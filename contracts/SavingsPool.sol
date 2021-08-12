//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interfaces/IERC20.sol";
import "./interfaces/ILendingPool.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/ICreditDelegationToken.sol";

import "./CreditSpender.sol";

contract SavingsPool {
  mapping(address => bool) private isMember;
  mapping(address => uint) private individualAmount;
  uint public totalPrincipal;
  uint public memberCount;

  // Credit Lending
  mapping(address => bool) private isCreditHolder;
  mapping(address => uint) private creditLimit;
  uint public immutable maxCreditLimit = 3000*(10**18);
  mapping(address => uint) private creditToRepay;
  uint public totalCreditDelegated;
  mapping(address => CreditSpender) creditHolder;

  // Aave
  ILendingPool pool;
  IProtocolDataProvider constant aaveDataProvider = IProtocolDataProvider(0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d);
  IERC20 constant usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
  IERC20 constant dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
  IERC20 constant aDai = IERC20(0x028171bCA77440897B824Ca71D1c56caC55b68A3);

  // Uniswap
  IUniswapV2Router02 constant uniswapV2Router = IUniswapV2Router02(0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F);

  constructor(address _lendingPoolAddress) {
    pool = ILendingPool(_lendingPoolAddress);
  }

  modifier memberOnly {
    require(isMember[msg.sender], "You are not a member.");
    _;
  }

  function getMemberSavingsBalance() public view memberOnly returns (uint) {
    // Get interest accrued as multiple (1 + xx%) of total deposited
    uint interestX = 1;
    if (totalPrincipal > 0) {
      interestX = aDai.balanceOf(address(this)) / totalPrincipal;
    }

    // Apply multiple to individual member's savings deposit
    uint memberSavings = individualAmount[msg.sender] * interestX;
    return memberSavings;
  }

  function getTotalSavingsBalance() public view returns (uint) {
    return aDai.balanceOf(address(this));
  }

  function getTotalInterestAccrued() external view returns (uint) {
    uint totalSavings = aDai.balanceOf(address(this));
    return totalSavings - totalPrincipal;
  }

  function createMembership() external {
    require(!isMember[msg.sender], "You are already a member!");
    isMember[msg.sender] = true;
    memberCount++;
  }

  function checkMembership() external view returns (bool) {
    return isMember[msg.sender];
  }

  function deleteMembership() external memberOnly {

  }

  function depositTokensToSavings(uint _amount) external memberOnly {
    dai.transferFrom(msg.sender, address(this), _amount);
    dai.approve(address(pool), _amount);
    pool.deposit(address(dai), _amount, address(this), 0);

    individualAmount[msg.sender] = individualAmount[msg.sender] + _amount;
    totalPrincipal = totalPrincipal + _amount;
  }

  function withdrawFromSavings(uint _amount) external memberOnly {
    // Member can only withdraw savings if no outstanding credit is owed
    bool hasCreditSpender = isCreditHolder[msg.sender];
    if(hasCreditSpender) {
      CreditSpender credit = creditHolder[msg.sender];
      uint debt = credit.creditOutstanding();
      require(debt == 0, "You cannot withdraw due to outstanding debts");
    }
    uint currentSavings = getMemberSavingsBalance();
    require(_amount <= currentSavings, "You cannot withdraw an amount over your balance.");

    aDai.approve(address(pool), _amount);
    pool.withdraw(address(dai), _amount, msg.sender);

    // TO DO: reduce deposit amount from state variables
    individualAmount[msg.sender] -= _amount;
    totalPrincipal -= _amount;
  }

  // *************************************************************

  //    CREDIT LENDING AND REPAYING
  //    1. Generate a credit limit for user
  //    2. Deploy a CreditSpender contract for user
  //    3. Approve the credit limit to user's CreditSpender contract
  //    4. Initialize the CreditSpender contract for valid use

  //    Functions called from CreditSpender contract
  //    1. Borrow from pool on behalf of SavingsPool
  //    2. Repay pool on behalf of SavingsPool
  
  // *************************************************************

  // Calculate maximum amount that member is approved to borrow
  function generateCreditLimit() public memberOnly {
    // Require the requester is a member
    require(isMember[msg.sender], "You are not a member");
    require(!isCreditHolder[msg.sender], "You are already a credit holder");
    // Check member's savings account (ADD a lock mapping for amount they cannot withdraw)
    uint savings = getMemberSavingsBalance();
    require(savings > 0, "Please deposit tokens in savings first");
    // Check health of collateral pool
    (,,uint256 availableToBorrow,,,uint256 healthFactor) = pool.getUserAccountData(address(this));
    require(healthFactor > 1, "Health Factor is too low to borrow");

    // MUST BASE CREDIT LIMIT ON AVAILABLE BORROWING POWER
    uint[] memory proposedLimit = new uint[](1);
    uint[] memory multiples = new uint[](3);
    multiples[0] = 1;
    multiples[1] = 2;
    multiples[2] = 3;
    for (uint i; i < multiples.length; i++) {
      if (maxCreditLimit > availableToBorrow) {
        if (savings * multiples[i] <= availableToBorrow) {
          proposedLimit[0] = savings * multiples[i];
        } else {
          proposedLimit[0] = availableToBorrow;
        }
      } else {
        if (savings * multiples[i] >= maxCreditLimit) {
          proposedLimit[0] = maxCreditLimit;
        } else {
          proposedLimit[0] = savings * multiples[i];
        }
      }
    }
    // require(availableBorrowsETH >= proposedLimit[0], "Unable to lend money at this time");
    // require(totalCollateralETH > totalDebtETH + proposedLimit[0], "You cannot borrow that much");
    creditLimit[msg.sender] = proposedLimit[0]/(10**12);
  }

  function getCreditLimit() external view returns (uint) {
    return creditLimit[msg.sender];
  }
  
  function createCreditSpender() external memberOnly {
    require(!isCreditHolder[msg.sender], "You already have a CreditSpender contract");
    require(creditLimit[msg.sender] > 0, "You do not qualify");
    CreditSpender credit = new CreditSpender(msg.sender, creditLimit[msg.sender], pool);
    creditHolder[msg.sender] = credit;
    isCreditHolder[msg.sender] = true;
    console.log("New CreditSpender contract deployed at: ", address(credit));
  }

  // Use credit delegation approval for calculated credit limit amount
  function approveCreditHolder() public {
    require(creditLimit[msg.sender] > 0, "Does not have a credit limit");
    // Should probably require another health check
    CreditSpender creditSpender = creditHolder[msg.sender];
    (, address stableDebtTokenAddress,) = aaveDataProvider.getReserveTokensAddresses(address(usdc));
    ICreditDelegationToken(stableDebtTokenAddress).approveDelegation(address(creditSpender), creditLimit[msg.sender]);
    isCreditHolder[msg.sender] = true;
  }

  function creditAllowance(address _creditSpenderAddress) public view returns (uint) {
    require(creditLimit[msg.sender] > 0, "Does not have a credit limit");
    require(isCreditHolder[msg.sender], "Must have a CreditSpender first");
    (, address stableDebtTokenAddress,) = aaveDataProvider.getReserveTokensAddresses(address(usdc));
    return ICreditDelegationToken(stableDebtTokenAddress).borrowAllowance(address(this), _creditSpenderAddress);
  }

  function getCreditSpenderAddress() external view returns (address) {
    require(isCreditHolder[msg.sender], "You do not have a CreditSpender contract");
    CreditSpender credit = creditHolder[msg.sender];
    return address(credit);
  }

  // REVISE: Approve credit to CreditSpender
  function initCreditSpender() external {
    require(isCreditHolder[msg.sender], "You do not have a CreditSpender contract");
    CreditSpender creditSpender = creditHolder[msg.sender];
    
    uint allowance = creditAllowance(address(creditSpender));
    require(allowance > 0 && allowance == creditLimit[msg.sender]);

    creditSpender.init();
  }

  // *************************************************************************
  // HELPER - to swap ETH to DAI for users
  function swap() external payable {
    require(msg.value > 0, "There is no ETH in your deposit");
    
    // First swap ETH to DAI
    address[] memory path = new address[](2);
    path[0] = uniswapV2Router.WETH();
    path[1] = address(dai);
    // uint amountsOut = uniswapV2Router.getAmountsOut(msg.value, path)[1];
    uniswapV2Router.swapExactETHForTokens{
      value: msg.value
    }(0, path, msg.sender, block.timestamp);
  }

  // HELPER - FOR TESTING PURPOSES ONLY (Delete before deploying)
  function daiBalance() external view returns (uint) {
    // uint balance = dai.balanceOf(msg.sender);
    // console.log("msg.sender DAI balance is ", balance);
    return dai.balanceOf(msg.sender);
  }

  // HELPER - FOR TESTING PURPOSES ONLY (Delete before deploying)
  function usdcBalance() external view returns (uint) {
    return usdc.balanceOf(msg.sender);
  }
  // *************************************************************************
}
