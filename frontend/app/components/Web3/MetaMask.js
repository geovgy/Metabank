import { useContext } from 'react';
import { Web3Context } from './Web3Context';
import SavingsPool from '../../../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';

// prettier-ignore
// const abi =

const MetaMask = () => {
	const { setContract, setProvider, ethers, setAccount } = useContext(Web3Context);

	async function enableEth() {
		try {
			if (typeof window.ethereum !== "undefined") {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const [account] = await ethereum.request({
					method: 'eth_requestAccounts'
				});
				const chainId = await ethereum.request({ method: 'eth_chainId' });
				let contractAddress = '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF';

				// Hardhat Local
				// if (chainId === '0x7a69') {
				// 	contractAddress = '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF';

				// 	// Rinkeby
				// } else if (chainId === '0x4') {
				// 	contractAddress = '';

				// 	// Polygon Mainnet
				// } else if (chainId === '0x89') {
				// 	contractAddress = '';

				// 	// Polygon Testnet
				// } else if (chainId === '0x13881') {
				// 	contractAddress = '';

				// 	// Mainnet
				// } else if (chainId === '0x1') {
				// 	contractAddress = '';

				// 	// Ropsten
				// } else if (chainId === '0x3') {
				// 	contractAddress = '';
				// }

				const signer = provider.getSigner(account);
				const contract = new ethers.Contract(
					contractAddress,
					SavingsPool.abi,
					signer
				);

				setProvider(provider);
				setContract(contract);
				setAccount(contract.signer._address);
			} else if (window.web3) {
				console.log('Update MetaMask');
			} else {
				console.log('Enable MetaMask');
			}
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<div>
			<button onClick={enableEth}>
				Connect Wallet
			</button>
		</div>
	);
};

export default MetaMask;