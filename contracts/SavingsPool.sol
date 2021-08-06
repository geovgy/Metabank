//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interfaces/IERC20.sol";
import "./interfaces/ILendingPool.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/ICreditDelegationToken.sol";

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
    uint interestX = aDai.balanceOf(address(this)) / totalPrincipal;

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
    require(creditToRepay[msg.sender] == 0, "You cannot withdraw due to outstanding debts");
    uint currentSavings = getMemberSavingsBalance();
    require(_amount <= currentSavings, "You cannot withdraw an amount over your balance.");

    aDai.approve(address(pool), _amount);
    pool.withdraw(address(dai), _amount, msg.sender);

    // TO DO: reduce deposit amount from state variables
    individualAmount[msg.sender] -= _amount;
    totalPrincipal -= _amount;
  }

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

  // Calculate maximum amount that member is approved to borrow
  function generateCreditLimit() public {
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
    creditLimit[msg.sender] = proposedLimit[0];
  }

  function getCreditLimit() external view returns (uint) {
    return creditLimit[msg.sender];
  }

  // Use credit delegation approval for calculated credit limit amount
  function approveCreditHolder() public {
    require(creditLimit[msg.sender] > 0, "Does not have a credit limit");
    // Should probably require another health check
    (, address stableDebtTokenAddress,) = aaveDataProvider.getReserveTokensAddresses(address(dai));
    ICreditDelegationToken(stableDebtTokenAddress).approveDelegation(msg.sender, creditLimit[msg.sender]);
    isCreditHolder[msg.sender] = true;
  }

  function creditAllowance() public view returns (uint) {
    require(creditLimit[msg.sender] > 0, "Does not have a credit limit");
    (, address stableDebtTokenAddress,) = aaveDataProvider.getReserveTokensAddresses(address(dai));
    return ICreditDelegationToken(stableDebtTokenAddress).borrowAllowance(address(this), msg.sender);
  }

  // Used every time member wants to purchase with credit until limit is reached
  function borrowCredit(uint _amount) public memberOnly {
    require(isCreditHolder[msg.sender], "You are not a credit holder");
    uint creditRemaining = creditLimit[msg.sender] - creditToRepay[msg.sender];
    require(creditRemaining >= _amount, "You do not have enough credit available");
    uint usdcAmount = _amount * (10**6);
    usdc.approve(address(pool), usdcAmount);
    pool.borrow(address(usdc), usdcAmount, 1, 0, address(this));
    usdc.transfer(msg.sender, _amount);
    creditToRepay[msg.sender] += _amount;
    totalCreditDelegated += _amount;
  }

  // Allow member to repay credit to this contract (delegator)
  // *** Check SafeERC20 for low-level call issues ***
  function repayCredit(uint _amount) public {
    uint leftover;
    if (_amount > creditToRepay[msg.sender]) {
      leftover = _amount - creditToRepay[msg.sender];
      pool.repay(address(usdc), creditToRepay[msg.sender], 1, address(this));
      creditToRepay[msg.sender] = 0;
      totalCreditDelegated -= creditToRepay[msg.sender];
      // TO DO: swap the rest to DAI and deposit to member's savings account
    } else {
      pool.repay(address(usdc), _amount, 1, address(this));
      creditToRepay[msg.sender] -= _amount;
      totalCreditDelegated -= _amount;
    }
  }
}
