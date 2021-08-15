import { useState, useContext } from 'react';

// Import smart contracts
import SavingsPool from '../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';
import CreditSpender from '../../artifacts/contracts/CreditSpender.sol/CreditSpender.json';
import { ethers } from 'ethers';

import { Web3Context } from '../components/Web3/Web3Context';
import NavBar from '../components/HorizontalLayout/NavBar';
import Head from 'next/head';
import styles from '../styles/Credit.module.css';

export default function Credit() {
    const {
        account,
        savingsContract,
        creditContract,
        setCreditContract,
        usdcContract,
        creditInfo,
        setCreditInfo,
        walletInfo
    } = useContext(Web3Context);

    async function viewCreditAccount(creditContract) {
        let creditLimit;
        let creditOwed;
        let creditAvailable;
        let valid;

        creditAvailable = await creditContract.creditAllowance();
        creditAvailable = parseFloat(creditAvailable)/(10**6);

        creditOwed = await creditContract.creditOutstanding();
        creditOwed = parseFloat(creditOwed)/(10**6);

        creditLimit = await creditContract.creditLimit();
        creditLimit = parseFloat(creditLimit)/(10**6);

        valid = await creditContract.valid();
		if (valid) {valid = true} else {valid = false};

        setCreditInfo({
            available: creditAvailable,
            owed: creditOwed,
            limit: creditLimit,
            address: creditContract.address,
            valid
        });
    }

    async function getCreditLimit() {
        let creditLimit = await savingsContract.getCreditLimit();
        creditLimit = parseFloat(creditLimit)/(10**6);

        if (!creditInfo.limit && creditLimit > 0) {
            setCreditInfo({
                available: creditInfo.available,
                owed: creditInfo.owed,
                limit: creditLimit,
                address: creditInfo.address
            });
        }

        return creditLimit;
    }

    async function createCreditLimit(e) {
        e.preventDefault();

        const newLimitTx = await savingsContract.generateCreditLimit();
        await newLimitTx.wait();

        await getCreditLimit();
        return;
    }

    async function issueCreditContract(e) {
        e.preventDefault();

        if (!creditInfo.limit) {
            return console.log('Need a credit limit first!');
        }

        const deployCreditSpender = await savingsContract.createCreditSpender();
        await deployCreditSpender.wait();

        const creditAddress = await savingsContract.getCreditSpenderAddress();

        const creditSpenderContract = new ethers.Contract(
            creditAddress,
            CreditSpender.abi,
            account
        );

        setCreditContract(creditSpenderContract);
        viewCreditAccount(creditSpenderContract);
    }

    async function activateCreditContract() {
        const approvalTx = await savingsContract.approveCreditHolder();
        await approvalTx.wait();

        const initializeTx = await savingsContract.initCreditSpender();
        await initializeTx.wait();

        viewCreditAccount(creditContract);
    }

    async function repay(e) {
        e.preventDefault();
        const repayForm = document.querySelector('#repay-form');
        const amount = repayForm.querySelector('.amount').value;
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

    function enableRepay() {
        const repayForm = document.querySelector('#repay-form');
        const enableBtn = document.querySelector('#enableRepayBtn');

        repayForm.hidden = false;
        enableBtn.hidden = true;
    }

    return (
        <div>
            <Head>
                <title>Credit | Metabank</title>
                <meta name="description" content="Banking for the Metaverse" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NavBar />

            <main>
                <h1 className={styles.title}>Credit</h1>
                
                {creditInfo.address ? (
                    <div className={styles.row}>
                        <div className={styles.showcase}>
                            <p>Credit Available</p>
                            <h1>{creditInfo.available}</h1>
                            <hr/>
                            <p>Credit Limit</p>
                            <h2>{creditInfo.limit}</h2>
                            <p>Need to repay</p>
                            <h2>{creditInfo.owed}</h2>

                            <br/>

                            {!creditInfo.valid ? (
                                <button 
                                    onClick={activateCreditContract}
                                    id="initCreditBtn"
                                >
                                    Activate
                                </button>
                            ):(
                                <div>
                                    <button onClick={enableRepay} id="enableRepayBtn">Repay</button>
                                    <form method="post" onSubmit={repay} id="repay-form" hidden>
                                        <input type="number" placeholder="Enter Amount" required />
                                        <button type="submit">Submit Payment</button>
                                    </form>
                                </div>
                            )}
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
                ):(
                    <div className={styles.row}>
                        <div className={styles.showcase}>
                        {creditInfo.limit ? (
                            <div className={styles.column}>
                                <p>Calculated Credit Limit</p>
                                <h2>$ {creditInfo.limit} USDC</h2>
                                {creditInfo.address ? (''):(
                                    <div style={{padding: '20px'}}>
                                        <button onClick={createCreditLimit}>
                                            Recalculate
                                        </button>
                                        <button onClick={issueCreditContract}>
                                            Get a Credit Card
                                        </button>
                                    </div>
                                )}
                            </div>
                        ):(
                            <div>
                                <button onClick={createCreditLimit}>
                                    Generate Credit Limit
                                </button>
                                <button onClick={issueCreditContract}>
                                    Get a Credit Card
                                </button>
                            </div>
                        )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}