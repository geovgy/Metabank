//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "../interfaces/IERC20.sol";
import "../interfaces/ILendingPool.sol";

contract SavingsPool {
  mapping(address => bool) private isMember;
  mapping(address => uint) private individualAmount;
  uint totalPoolAmount;
  uint public memberCount;

  // Additional Variables Needed:
  // ILendingPool address object
  // IERC20 token addresses
  // IERc20 aToken addresses (Aave specific)

  // Additional functions Needed:
  // call for interest accrued and APY
  // function to create a create limit and credit contract

  modifier memberOnly {
    require(isMember[msg.sender], "You are not a member.");
    _;
  }

  function getSavingsBalance() public view memberOnly returns (uint) {
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

  function depositToSavings(uint _amount) external memberOnly {

  }

  function withdrawFromSavings(uint _amount) external memberOnly {

  }
}
