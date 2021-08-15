import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useState, useContext } from 'react';

// Import smart contracts
import SavingsPool from '../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';
import CreditSpender from '../../artifacts/contracts/CreditSpender.sol/CreditSpender.json';
import { ethers } from 'ethers';

import { Web3Context } from '../components/Web3/Web3Context';
import NavBar from '../components/HorizontalLayout/NavBar';
import GridLayout from '../components/GridLayout';

export default function Home() {
  const {
    account,
    savingsContract,
    creditContract,
    daiContract,
    usdcContract,
    savingsInfo,
    creditInfo,
    walletInfo
  } = useContext(Web3Context);

  async function createMembership() {
    if (savingsInfo.isMember) {
      return console.log("You are already a member");
    }
    const createMembershipTx = await savingsContract.createMembership();
    await createMembershipTx.wait();

    const membershipStatus = await savingsContract.checkMembership();
    return savingsContract.isMember = membershipStatus;
  }

  // Unable to get address of signer
  async function viewDAIBalance() {
    const balance = await daiContract.balanceOf(account.address);
    setWalletInfo(ethers.utils.formatEther(balance));
  }
  
  return (
    <div>
      <Head>
        <title>Metabank</title>
        <meta name="description" content="Banking for the Metaverse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Metabank
        </h1>

        <GridLayout 
          individualSavings={savingsInfo.individualBalance}
          creditOwed={creditInfo.owed}
          creditLimit={creditInfo.limit}
          creditAvailable={creditInfo.available}
          totalSavings={parseInt(savingsInfo.totalBalance)}
          memberCount={savingsInfo.memberCount}
          totalInterest={savingsInfo.totalInterestAccrued}
        />
        
        {!savingsInfo.isMember ? (
          <button onClick={createMembership} className={styles.button}>
            Join Membership
          </button>
        ):('')}
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}
