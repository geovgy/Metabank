//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interfaces/IERC20.sol";
import "./interfaces/ILendingPool.sol";
import "./interfaces/IUniswapV2Router02.sol";

contract SavingsPool {
  mapping(address => bool) private isMember;
  mapping(address => uint) private individualAmount;
  uint public totalPrincipal;
  uint public memberCount;

  // Aave
  ILendingPool pool;
  IERC20 constant dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
  IERC20 constant aDai = IERC20(0x028171bCA77440897B824Ca71D1c56caC55b68A3);

  // Uniswap
  IUniswapV2Router02 constant uniswapV2Router = IUniswapV2Router02(0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F);

  constructor(address _lendingPoolAddress) {
    pool = ILendingPool(_lendingPoolAddress);
  }

  // Additional functions Needed:
  // call for interest accrued and APY
  // function to create a create limit and credit contract

  modifier memberOnly {
    require(isMember[msg.sender], "You are not a member.");
    _;
  }

  // TO DO: call lending pool to get savings amount + interest accrued
  function getMemberSavingsBalance() public view memberOnly returns (uint) {
    // Get interest accrued as multiple (1 + xx%) of total deposited
    uint interestX = aDai.balanceOf(address(this)) / totalPrincipal;

    // Apply multiple to individual member's savings deposit
    uint memberSavings = individualAmount[msg.sender] * interestX;
    return memberSavings;
  }

  function getTotalSavingsBalance() external view returns (uint) {
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
    uint currentSavings = getMemberSavingsBalance();
    require(_amount <= currentSavings, "You cannot withdraw an amount over your balance.");
    // Could ADD another require() for minimum balance if member has a credit contract
    aDai.approve(address(pool), _amount);
    pool.withdraw(address(dai), _amount, msg.sender);

    // TO DO: reduce deposit amount from state variables
    individualAmount[msg.sender] -= _amount;
    totalPrincipal -= _amount;
  }

  // Helper - to swap ETH to DAI for users
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

  // Helper - FOR TESTING PURPOSES ONLY (Delete before deploying)
  function daiBalance() external view returns (uint) {
    uint balance = dai.balanceOf(msg.sender);
    console.log("msg.sender DAI balance is ", balance);
    return dai.balanceOf(msg.sender);
  }

  function borrow(address _onBehalfOf, uint _amount) internal {
    require(isMember[_onBehalfOf], "You are not a member");
    // Require a max credit limit cap of 5000 DAI
    require(_amount <= 5000*(10**18), "Request amount is over the max credit limit cap");
    // Check member's savings account (ADD a lock mapping for amount they cannot withdraw)
    uint savings = getMemberSavingsBalance();
    // TEMPORARY: Set borrow limit to maximum 3x savings amount
    require(_amount <= savings * 3, "You do not have enough collateral in savings");

    // Require CreditSpenderFacotry is legit
    
    // Check health of collateral pool
    (
      uint256 totalCollateralETH, 
      uint256 totalDebtETH, 
      uint256 availableBorrowsETH, 
      uint256 currentLiquidationThreshold, 
      uint256 ltv, 
      uint256 healthFactor
    ) = pool.getUserAccountData(address(this));
    require(healthFactor > 3, "Health Factor is too low to borrow");
    require(totalCollateralETH > totalDebtETH + _amount, "You cannot borrow that much");
    // TO DO: Add a multiple of _amount to compare to availableBorrowETH for borrow allowance
    require(availableBorrowsETH > _amount, "You cannot borrow that much");

    // Borrow funds
    aDai.approve(address(pool), _amount);
    pool.borrow(address(dai), _amount, 1, 0, address(this));
    // currently not transferring tokens to anyone
    // TO DO: Change address!! Need to transfer borrowed tokens to CreditFactory
    dai.transfer(address(0), _amount);
  }
}
