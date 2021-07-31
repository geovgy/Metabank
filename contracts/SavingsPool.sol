//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract SavingsPool {
  mapping(address => bool) private isMember;
  mapping(address => uint) private individualAmount;
  uint totalPoolAmount;
  uint public memberCount;

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
