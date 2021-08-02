//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interfaces/IERC20.sol";

contract CreditSpenderFactory {
    
    // To be calculated from Savings Pool, transaction history, etc.
    function calculateCreditLimit(address _for) internal pure returns (uint) {

    }

    function createCreditSpender(address _asset) external {
        uint limit = calculateCreditLimit(msg.sender);
        require(limit > 0, "You do not qualify");
        new CreditSpender(msg.sender, IERC20(_asset), limit);
    }
}

contract CreditSpender {
    address public issuer;
    address public owner;
    bool valid;
    uint creditLimit;
    uint creditOwed;
    IERC20 asset;

    constructor(address _owner, IERC20 _asset, uint _limit) {
        issuer = msg.sender;
        owner = _owner;
        asset = _asset;
        creditLimit = _limit;
    }

    event Spent(
        uint amount,
        address recipient,
        uint timestamp
    );

    event Repaid(
        uint amount,
        address sender,
        uint timestamp
    );

    modifier validOnly {
        require(valid, "Contract is not valid");
        _;
    }

    modifier ownerOnly {
        require(msg.sender == owner, "You do not own this contract");
        _;
    }

    // Initialize contract valid before use
    function init() internal {
        require(!valid, "Contract has already been initialized");
        require(msg.sender == issuer, "Only issuer is allowed");
        require(asset.balanceOf(address(this)) == creditLimit, "Does not have the correct amount to initialize");
        valid = true;
    }

    // Spend available credit
    function spend(uint _amount, address _recipient) external validOnly ownerOnly {
        uint balance = creditRemaining();
        require(balance >= _amount, "You do not have enough remaining credit");
        asset.transfer(_recipient, _amount);
        creditOwed += _amount;
        emit Spent(_amount, _recipient, block.timestamp);
    }

    // Repay outstanding credit
    function repay(uint _amount) external validOnly ownerOnly {
        asset.transferFrom(msg.sender, address(this), _amount);
        creditOwed -= _amount;
        emit Repaid(_amount, msg.sender, block.timestamp);
    }

    // Get available credit
    function creditRemaining() public view ownerOnly returns (uint) {
        return asset.balanceOf(address(this));
    }

    // Get outstanding credit owed
    function creditOutstanding() public view ownerOnly returns (uint owed) {
        uint balance = asset.balanceOf(address(this));
        if (balance >= creditLimit) {
            owed = 0;
        } else {
            owed = creditLimit - balance;
        }
    }

    // Destroy contract (if compromised)
}