import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from 'react';

// Import smart contracts
import SavingsPool from '../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';
import CreditSpender from '../../artifacts/contracts/CreditSpender.sol/CreditSpender.json';
import { ethers } from 'ethers';

// import { useContext } from 'react';
// import { Web3Context } from '../components/Web3/Web3Context';

// import NavBar from '../components/HorizontalLayout/Navbar';

export default function Home() {
  const [savingsContract, setSavingsContract] = useState(null);
  const [creditContract, setCreditContract] = useState(null);
  const [savingsInfo, setSavingsInfo] = useState({});

  const savingsPoolAddress = '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF';

  async function viewSavingsAccount(contract) {
    let isMember;
    let individualBalance;
    let totalBalance;
    let totalInterestAccrued;
    
    totalBalance = await contract.getTotalSavingsBalance();
    totalBalance = ethers.utils.formatEther(totalBalance);
    
    totalInterestAccrued = await contract.getTotalInterestAccrued();

    isMember = await contract.checkMembership();

    if (isMember) {
      individualBalance = await contract.getMemberSavingsBalance();
    }
    
    setSavingsInfo({
      isMember,
      individualBalance,
      totalBalance,
      totalInterestAccrued
    });
  }

  async function createMembership() {
    if (savingsInfo.isMember) {
      return console.log("You are already a member");
    }
    const createMembershipTx = await savingsContract.createMembership();
    await createMembershipTx.wait();

    const membershipStatus = await savingsContract.checkMembership();
    return savingsContract.isMember = membershipStatus;
  }

  async function connectWallet() {
    let signer;
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const [account] = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      signer = provider.getSigner(account);
    } else {
      const provider = new ethers.providers.JsonRpcProvider();
      signer = provider.getSigner()
    }

    const contract = new ethers.Contract(
      savingsPoolAddress,
      SavingsPool.abi,
      signer
    );

    setSavingsContract(contract);
    viewSavingsAccount(contract);
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Metabank</title>
        <meta name="description" content="Banking for the Metaverse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Metabank
        </h1>
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
        <p>Membership Status: {savingsInfo.isMember}</p>
        <p>{savingsInfo.totalBalance}</p>
        <button onClick={createMembership}>
          Join Membership
        </button>
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}
