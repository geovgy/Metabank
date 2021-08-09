//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interfaces/IERC20.sol";
import "./interfaces/ILendingPool.sol";
import "./interfaces/ICreditDelegationToken.sol";

contract CreditSpender {
    address public issuer;
    address public holder;
    bool public valid;
    uint public creditLimit;
    uint creditOwed;

    // Aave
    ILendingPool pool;
    IProtocolDataProvider constant aaveDataProvider = IProtocolDataProvider(0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d);
    IERC20 constant usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    IERC20 constant dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);

    constructor(address _holder, uint _limit, ILendingPool _pool) {
        issuer = msg.sender;
        holder = _holder;
        creditLimit = _limit;
        pool = _pool;
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

    modifier approvedViewersOnly {
        require(msg.sender == holder || msg.sender == issuer, "You are not approved");
        _;
    }

    // Initialize contract valid before use
    function init() external {
        require(!valid, "Contract has already been initialized");
        require(msg.sender == issuer, "Only issuer is allowed");
        valid = true;
    }

    function creditAllowance() public view returns (uint) {
        (, address stableDebtTokenAddress,) = aaveDataProvider.getReserveTokensAddresses(address(usdc));
        return ICreditDelegationToken(stableDebtTokenAddress).borrowAllowance(issuer, address(this));
    }

    // Spend available credit
    function spend(uint _amount, address _recipient) external validOnly ownerOnly {
        // uint balance = creditRemaining();
        // require(balance >= _amount, "You do not have enough remaining credit");
        usdc.approve(address(pool), _amount);
        pool.borrow(address(usdc), _amount, 1, 0, issuer);
        usdc.transfer(_recipient, _amount);
        creditOwed += _amount;
        emit Spent(_amount, _recipient, block.timestamp);
    }

    // Repay outstanding credit
    function repay(uint _amount) external validOnly ownerOnly {
        require(creditOwed > 0, "There is no outstanding credit owed.");
        if(_amount > creditOwed) {
            usdc.transferFrom(msg.sender, address(this), creditOwed);
            usdc.approve(address(pool), creditOwed);
            pool.repay(address(usdc), creditOwed, 1, issuer);
            creditOwed = 0;
        } else {
            usdc.transferFrom(msg.sender, address(this), _amount);
            usdc.approve(address(pool), _amount);
            pool.repay(address(usdc), _amount, 1, issuer);
            creditOwed -= _amount;
        }
        emit Repaid(_amount, msg.sender, block.timestamp);
    }

    // Get outstanding credit owed
    function creditOutstanding() public view approvedViewersOnly returns (uint) {
        return creditOwed;
    }

    // Destroy contract (if compromised)
}