import { useState, useContext } from 'react';

// Import smart contracts
import SavingsPool from '../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';
import CreditSpender from '../../artifacts/contracts/CreditSpender.sol/CreditSpender.json';
import { ethers } from 'ethers';

import { Web3Context } from '../components/Web3/Web3Context';
import NavBar from '../components/HorizontalLayout/NavBar';

export default function CreditSpender() {
    return (
        <div>Credit Page</div>
    )
}