import { useContext } from 'react';
import { Web3Context } from './Web3Context';
import SavingsPool from '../../../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';

// prettier-ignore
// const abi =

const MetaMask = () => {
	const enableEth = async () => {
		try {
			let contractAddress = '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF';
			if (typeof window.ethereum !== "undefined") {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const [account] = await ethereum.request({
					method: 'eth_requestAccounts'
				});
	
				const signer = provider.getSigner(account);
				const contract = new ethers.Contract(
					contractAddress,
					SavingsPool.abi,
					signer
				);
				return contract;
			} else {
				const provider = new ethers.providers.JsonRpcProvider();
				const signer = provider.getSigner()
				
				const contract = new ethers.Contract(
					contractAddress,
					SavingsPool.abi,
					signer
				);
				return contract;
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