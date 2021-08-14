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
  // User
  // const [account, setAccount] = useState('');
  // // Main contracts
  // const [savingsContract, setSavingsContract] = useState(null);
  // const [creditContract, setCreditContract] = useState(null);
  // // ERC20 token contracts
  // const [daiContract, setDaiContract] = useState(null);
  // const [usdcContract, setUsdcContract] = useState(null);
  // // User's financial info
  // const [savingsInfo, setSavingsInfo] = useState({});
  // const [creditInfo, setCreditInfo] = useState({});
  // const [walletInfo, setWalletInfo] = useState('');

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

  async function swapETHToDAI(e) {
    e.preventDefault();

    const amountInput = document.querySelector('#swap-form').querySelector('input');
    const amountValue = amountInput.value;

    await savingsContract.swap({
      value: ethers.utils.parseEther(`${amountValue}`)
    });

    return;
  }

  async function viewDAIBalance() {
    // Unable to get address of signer
    const balance = await daiContract.balanceOf(account.address);
    setWalletInfo(ethers.utils.formatEther(balance));
  }

  async function depositToSavings(e) {
    e.preventDefault();

    const amountInput = document.querySelector('#deposit-form').querySelector('input');
    const amountValue = amountInput.value;
    
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

    const withdrawalTx = await savingsContract.withdrawFromSavings(ethers.utils.parseEther(`${amountValue}`));
    await withdrawalTx.wait();

    viewSavingsAccount(savingsContract);
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
          creditOwed=''
          totalSavings={parseInt(savingsInfo.totalBalance)}
          totalInterest={savingsInfo.totalInterestAccrued}
        />
        
        <button onClick={createMembership}>
          Join Membership
        </button>

        <button onClick={viewDAIBalance}>
          View Balance
        </button>

        {/* <p>Wallet ETH: {walletInfo.eth}</p> */}
        <p>Wallet DAI: {walletInfo.dai}</p>

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
