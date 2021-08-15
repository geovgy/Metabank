import { useContext } from 'react';
import { Web3Context } from './Web3Context';
import { ethers } from 'ethers';

import styles from '../../styles/NavBar.module.css'

import SavingsPool from '../../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';
import CreditSpender from '../../../artifacts/contracts/CreditSpender.sol/CreditSpender.json';

const Wallet = () => {
	const { 
        setSavingsContract, 
        setCreditContract, 
        setDaiContract, 
        setUsdcContract, 
        setAccount,
        setSavingsInfo,
        setCreditInfo
    } = useContext(Web3Context);

    const savingsPoolAddress = '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF';
	const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
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

        const USDC = new ethers.Contract(
            usdcAddress,
            ERC20abi,
            signer
        );
        
		setSavingsContract(savingsPoolContract);
		setDaiContract(DAI);
        setUsdcContract(USDC);
		setAccount(signer);

		viewSavingsAccount(savingsPoolContract);

        try {
            const creditSpenderAddress = await savingsPoolContract.getCreditSpenderAddress();
            const creditSpender = new ethers.Contract(
                creditSpenderAddress,
                CreditSpender.abi,
                signer
            );
            
            setCreditContract(creditSpender);
            viewCreditAccount(creditSpender);
        } catch (err) {
            console.log(err);

            let creditLimit = await savingsPoolContract.getCreditLimit();
            creditLimit = parseFloat(creditLimit)/(10**6);
            setCreditInfo({
                limit: creditLimit
            });
        }
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

    async function viewCreditAccount(creditContract) {
        let creditLimit;
        let creditOwed;
        let creditAvailable;

        creditAvailable = await creditContract.creditAllowance();
        creditAvailable = parseFloat(creditAvailable)/(10**6);

        creditOwed = await creditContract.creditOutstanding();
        creditOwed = parseFloat(creditOwed)/(10**6);

        creditLimit = await creditContract.getCreditLimit();
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
			<button
                className={styles.connectBtn}
				onClick={connectWallet}
			>
				Connect Wallet
			</button>
		</div>
	);
};

export default Wallet;