import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useState, useEffect } from 'react';

// Import smart contracts
import SavingsPool from '../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';
import CreditSpender from '../../artifacts/contracts/CreditSpender.sol/CreditSpender.json';
import { ethers } from 'ethers';

import GridLayout from '../components/GridLayout';

// import { useContext } from 'react';
// import { Web3Context } from '../components/Web3/Web3Context';

// import NavBar from '../components/HorizontalLayout/Navbar';

export default function Home() {
  // User
  const [account, setAccount] = useState('');
  // Main contracts
  const [savingsContract, setSavingsContract] = useState(null);
  const [creditContract, setCreditContract] = useState(null);
  // ERC20 token contracts
  const [daiContract, setDaiContract] = useState(null);
  const [usdcContract, setUsdcContract] = useState(null);
  // User's financial info
  const [savingsInfo, setSavingsInfo] = useState({});
  const [creditInfo, setCreditInfo] = useState({});
  const [walletInfo, setWalletInfo] = useState('');

  const savingsPoolAddress = '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF';
  const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const ERC20abi = [{"inputs":[{"internalType":"uint256","name":"chainId_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"guy","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":true,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"usr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"arg1","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"arg2","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"move","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"bool","name":"allowed","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"pull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"push","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

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

    const DAI = new ethers.Contract(
      daiAddress,
      ERC20abi,
      signer
    );

    setSavingsContract(savingsPoolContract);
    setDaiContract(DAI);
    setAccount(signer);
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
        <GridLayout 
          individualSavings={savingsInfo.individualBalance}
          creditOwed=''
          totalSavings={parseInt(savingsInfo.totalBalance)}
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
