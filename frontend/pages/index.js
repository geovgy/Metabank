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
  const [daiContract, setDaiContract] = useState(null);
  const [usdcContract, setUsdcContract] = useState(null);
  const [savingsInfo, setSavingsInfo] = useState({});

  const savingsPoolAddress = '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF';
  const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

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

    const savingsPoolContract = new ethers.Contract(
      savingsPoolAddress,
      SavingsPool.abi,
      signer
    );

    // This won't get the DAI contract
    // Possible reason is the process.env.ERC20_ABI not fetching from .env and thus being null
    // const DAI = new ethers.Contract(
    //   daiAddress,
    //   process.env.ERC20_ABI,
    //   signer
    // );

    setSavingsContract(savingsPoolContract);
    // setDaiContract(DAI);
    viewSavingsAccount(savingsPoolContract);
  }

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
      individualBalance = ethers.utils.formatEther(individualBalance);
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

  async function swapETHToDAI() {
    const amountInput = document.querySelector('#swap-form').querySelector('input');
    const amountValue = amountInput.value;

    const swapTx = await savingsContract.swap({
      value: ethers.utils.parseEther(`${amountValue}`)
    });

    await swapTx.wait();
    return;
  }

  async function depositToSavings(e) {
    e.preventDefault();

    const amountInput = document.querySelector('#deposit-form').querySelector('input');
    const amountValue = amountInput.value;

    // const DAI = new ethers.Contract(
    //   daiAddress,
    //   process.env.ERC20_ABI,
    //   signer
    // );
    
    const approvalTx = await daiContract.approve(savingsContract.address, ethers.utils.parseEther(`${amountValue}`));
    await approvalTx.wait();

    const depositTx = await savingsContract.depositTokensToSavings(ethers.utils.parseEther(`${amountValue}`));
    await depositTx.wait();

    viewSavingsAccount(savingsContract);
  }

  //
  async function withdrawFromSavings(e) {
    e.preventDefault();

    const amountInput = document.querySelector('#withdrawal-form').querySelector('input');
    const amountValue = amountInput.value;

    await savingsContract.withdrawFromSavings(ethers.utils.parseEther(`${amountValue}`));
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
        <p>Total Savings Pool: {savingsInfo.totalBalance}</p>
        <p>Personal Savings Balance: {savingsInfo.individualBalance}</p>
        <button onClick={createMembership}>
          Join Membership
        </button>
        <form id="swap-form" method="post" action="/" onSubmit={swapETHToDAI}>
          <p>Swap to DAI</p>
          <input type="number" placeholder="Enter amount" required />
          <button type="submit">
            Swap
          </button>
        </form>
        <form id="deposit-form" method="post" action="/" onSubmit={depositToSavings}>
          <p>Deposit</p>
          <input type="number" placeholder="Enter amount" required />
          <button type="submit">
            Deposit
          </button>
        </form>
        <form id="withdrawal-form" method="post" action="/" onSubmit={withdrawFromSavings}>
          <p>Withdraw</p>
          <input type="number" placeholder="Enter amount" required />
          <button type="submit">
            Withdraw
          </button>
        </form>
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}
