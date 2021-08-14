import { useState, useContext } from 'react';

// Import smart contracts
import SavingsPool from '../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';
import CreditSpender from '../../artifacts/contracts/CreditSpender.sol/CreditSpender.json';
import { ethers } from 'ethers';

import { Web3Context } from '../components/Web3/Web3Context';
import NavBar from '../components/HorizontalLayout/NavBar';
import Head from 'next/head';

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
        viewCreditAccount(creditSpenderContract, savingsContract);
    }

    async function viewCreditAccount(creditContract, savingsContract) {
        let creditLimit;
        let creditOwed;
        let creditAvailable;

        creditAvailable = await creditContract.creditAllowance();
        creditAvailable = parseFloat(creditAvailable)/(10**6);

        creditOwed = await creditContract.creditOutstanding();
        creditOwed = parseFloat(creditOwed)/(10**6);

        creditLimit = await savingsContract.getCreditLimit();
        creditLimit = parseFloat(creditLimit)/(10**6);

        setCreditInfo({
            available: creditAvailable,
            owed: creditOwed,
            limit: creditLimit,
            address: creditContract.address
        });
    }

    return (
        <div>
            <Head>
                <title>Metabank</title>
                <meta name="description" content="Banking for the Metaverse" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <NavBar />

            <main>
                {creditInfo.limit ? (
                    <div>
                        <p>Credit Limit: {creditInfo.limit}</p>
                        {creditInfo.address ? (''):(
                            <button onClick={createCreditLimit}>
                                New Credit Limit
                            </button>
                        )}
                    </div>
                ):(
                    <button onClick={createCreditLimit}>
                        Generate Credit Limit
                    </button>
                )}
                {creditInfo.address ? (
                    <div>
                        <p>Credit Available: {creditInfo.available}</p>
                        <p>Outstanding: {creditInfo.owed}</p>
                        <p>Contract Address: {creditInfo.address}</p>
                    </div>
                ):(
                    <div>
                        <button onClick={issueCreditContract}>
                            Get a Credit Card
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}