//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interfaces/IERC20.sol";

contract CreditSpenderFactory {
    mapping(address => CreditSpender) creditContract;
    mapping(address => bool) isCreditHolder;
    
    // To be calculated from Savings Pool, transaction history, etc.
    // DEV MODE ONLY
    // TO DO: Add address _for parameter back in for calculating limit
    function calculateCreditLimit() internal pure returns (uint) {
        // Must inlcude real calculations!!!
        // This number is only for testing CreditSpender contract
        return 500*(10**18);
    }

    // Should add functionality that only members can create a CreditSpender contract

    function createCreditSpender(address _asset) external {
        require(!isCreditHolder[msg.sender], "You already have a CreditSpender contract");
        uint limit = calculateCreditLimit();
        require(limit > 0, "You do not qualify");
        CreditSpender credit = new CreditSpender(msg.sender, IERC20(_asset), limit);
        creditContract[msg.sender] = credit;
        isCreditHolder[msg.sender] = true;
        console.log("New CreditSpender contract deployed at: ", address(credit));
    }

    function getCreditSpenderAddress() external view returns (CreditSpender) {
        require(isCreditHolder[msg.sender], "You do not have a CreditSpender contract");
        CreditSpender credit = creditContract[msg.sender];
        return credit;
    }

    function initCreditSpender(CreditSpender _creditContract) internal {
        require(isCreditHolder[msg.sender], "You do not have a CreditSpender contract");
        // Must have a token balance (borrowed from savings pool)

        // Transfer tokens to deployed CreditSpender contract

        // Initialize contract
        _creditContract.init();
    }
}

contract CreditSpender {
    address public issuer;
    address public holder;
    bool public valid;
    uint creditLimit;
    uint creditOwed;
    IERC20 asset;

    constructor(address _holder, IERC20 _asset, uint _limit) {
        issuer = msg.sender;
        holder = _holder;
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
        require(msg.sender == holder, "You do not own this contract");
        _;
    }

    // Initialize contract valid before use
    function init() external {
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