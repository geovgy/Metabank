import { useState, useContext } from 'react';

// Import smart contracts
import SavingsPool from '../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';
import { ethers } from 'ethers';

import { Web3Context } from '../components/Web3/Web3Context';
import NavBar from '../components/HorizontalLayout/NavBar';
import Head from 'next/head';
import styles from '../styles/Credit.module.css';

export default function Savings() {
    const {
        account,
        savingsContract,
        savingsInfo,
        setSavingsInfo,
        daiContract,
        walletInfo
    } = useContext(Web3Context);

    async function repay(e) {
        const repayForm = document.querySelector('#repay-form');
        const amount = repayForm.querySelector('input').value;
        const enableBtn = document.querySelector('#enableRepayBtn');

        const usdcAmount = parseFloat(amount)*(10**6);
        const approvalTx = await usdcContract.approve(creditContract.address, usdcAmount);
        await approvalTx.wait();

        const repayTx = await creditContract.repay(usdcAmount);
        await repayTx.wait();

        viewCreditAccount(creditContract);

        repayForm.hidden = true;
        enableBtn.hidden = false;
    }

    async function viewSavingsAccount(contract) {
		let isMember;
		let individualBalance;
		let totalBalance;
		let totalInterestAccrued;
		
		totalBalance = await contract.getTotalSavingsBalance();
		totalBalance = ethers.utils.formatEther(totalBalance);
		
		totalInterestAccrued = await contract.getTotalInterestAccrued();
		totalInterestAccrued = ethers.utils.formatEther(totalInterestAccrued);

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

    async function swapETHToDAI(e) {
        e.preventDefault();
    
        const amount = document.querySelector('#swap-form').querySelector('input');
    
        await savingsContract.swap({
          value: ethers.utils.parseEther(`${amount.value}`)
        });
    
        amount.value = '';
        return;
    }

    async function deposit(e) {
        e.preventDefault();

        const form = document.querySelector('#deposit-form');
        const amount = form.querySelector('input');
        const enableBtn = document.querySelector('#enableDepositBtn');
        const otherBtn = document.querySelector('#enableWithdrawBtn');

        const approvalTx = await daiContract.approve(savingsContract.address, ethers.utils.parseEther(`${amount.value}`));
        await approvalTx.wait();

        const depositTx = await savingsContract.depositTokensToSavings(ethers.utils.parseEther(`${amount.value}`));
        await depositTx.wait();

        viewSavingsAccount(savingsContract);

        form.hidden = true;
        enableBtn.hidden = false;
        otherBtn.hidden = false;
        amount.value = '';
    }

    async function withdraw(e) {
        e.preventDefault();
    
        const form = document.querySelector('#withdraw-form');
        const amount = form.querySelector('input');
        const enableBtn = document.querySelector('#enableWithdrawBtn');
        const otherBtn = document.querySelector('#enableDepositBtn');
    
        const withdrawalTx = await savingsContract.withdrawFromSavings(ethers.utils.parseEther(`${amount.value}`));
        await withdrawalTx.wait();
    
        viewSavingsAccount(savingsContract);

        form.hidden = true;
        enableBtn.hidden = false;
        otherBtn.hidden = false;
        amount.value = '';
    }

    function enableForm(e) {
        let form;
        let enableBtn;
        let otherBtn;
        if (e.target.id.includes('Deposit')) {
            form = document.querySelector('#deposit-form');
            enableBtn = document.querySelector('#enableDepositBtn');
            otherBtn = document.querySelector('#enableWithdrawBtn');
        } else if (e.target.id.includes('Withdraw')) {
            form = document.querySelector('#withdraw-form');
            enableBtn = document.querySelector('#enableWithdrawBtn');
            otherBtn = document.querySelector('#enableDepositBtn');
        }

        form.hidden = false;
        enableBtn.hidden = true;
        otherBtn.hidden = true;
    }

    return (
        <div>
            <Head>
                <title>Savings | Metabank</title>
                <meta name="description" content="Banking for the Metaverse" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NavBar />

            <main>
                <h1 className={styles.title}>Savings</h1>
                
                <div className={styles.row}>
                    <div className={styles.showcase}>
                        <p>Current Balance</p>
                        <h1>{savingsInfo.individualBalance} <span>DAI</span></h1>
                        <hr/>

                        <br/>

                        <button onClick={enableForm} id="enableDepositBtn">Deposit</button>
                        <form method="post" onSubmit={deposit} id="deposit-form" hidden>
                            <input type="number" placeholder="Enter Amount" required />
                            <button type="submit">Submit Deposit</button>
                        </form>

                        <button onClick={enableForm} id="enableWithdrawBtn">Withdraw</button>
                        <form method="post" onSubmit={withdraw} id="withdraw-form" hidden>
                            <input type="number" placeholder="Enter Amount" required />
                            <button type="submit">Submit Withdrawal</button>
                        </form>

                        <br/>

                        <p>Swap ETH to DAI</p>
                        <form id="swap-form" method="post" onSubmit={swapETHToDAI}>
                            <input type="number" placeholder="Enter amount" required />
                            <button type="submit">
                                Swap
                            </button>
                        </form>
                    </div>
                    <div className={styles.transactionList}>
                        <table>
                            <thead>
                                <th>Date</th>
                                <th>Recipient</th>
                                <th>Type</th>
                                <th>Amount</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>12/25/20</td>
                                    <td>0xabc123...</td>
                                    <td>Spent</td>
                                    <td>$69</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}