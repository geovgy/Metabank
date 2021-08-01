//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "../interfaces/IERC20.sol";
import "../interfaces/ILendingPool.sol";
import "../interfaces/IUniswapV2Router02.sol";

contract SavingsPool {
  mapping(address => bool) private isMember;
  mapping(address => uint) private individualAmount;
  uint totalAmount;
  uint public memberCount;

  // Additional Variables Needed:
  // ILendingPool address object
  // IERC20 token addresses
  // IERc20 aToken addresses (Aave specific)
  ILendingPool pool;
  IERC20 constant dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
  IERC20 constant aDai = IERC20(0x028171bCA77440897B824Ca71D1c56caC55b68A3);
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

  function getSavingsBalance() public view memberOnly returns (uint) {
    console.log("msg.sender savings balance is ", individualAmount[msg.sender]/(10**18));
    return individualAmount[msg.sender];
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

  function _deposit(uint _amount) private returns (bool) {
    dai.approve(address(pool), _amount);
    pool.deposit(address(dai), _amount, address(this), 0);

    individualAmount[msg.sender] += _amount;
    totalAmount += _amount;
    return true;
  }

  function depositTokensToSavings(uint _amount) external memberOnly {
    dai.transferFrom(msg.sender, address(this), _amount);
    dai.approve(address(pool), _amount);
    pool.deposit(address(dai), _amount, address(this), 0);

    individualAmount[msg.sender] = individualAmount[msg.sender] + _amount;
    totalAmount = totalAmount + _amount;
  }

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

  function daiBalance() external view returns (uint) {
    uint balance = dai.balanceOf(msg.sender);
    console.log("msg.sender DAI balance is ", balance/(10**18));
    return dai.balanceOf(msg.sender);
  }

  // function depositETHToSavings() external payable memberOnly {
  //   require(msg.value > 0, "There is no ETH in your deposit");
    
  //   // First swap ETH to DAI
  //   address[] memory path = new address[](2);
  //   path[0] = uniswapV2Router.WETH();
  //   path[1] = address(dai);
  //   uint amountsOut = uniswapV2Router.getAmountsOut(msg.value, path)[1];
  //   console.log(amountsOut);
  //   console.log(block.timestamp);
  //   uint[] memory daiAmount = uniswapV2Router.swapExactETHForTokens{
  //     value: msg.value
  //   }(0, path, address(this), block.timestamp);
  //   console.log(daiAmount[0], daiAmount[1]);

  //   // Then deposit DAI into lending pool
  //   _deposit(daiAmount[1]);
  // }

  function withdrawFromSavings(uint _amount) external memberOnly {

  }
}