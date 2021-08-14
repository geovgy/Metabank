import { createContext, useState } from 'react';

export const Web3Context = createContext();

const Web3Provider = ({ children }) => {
	// const [contract, setContract] = useState(null);
	// const [provider, setProvider] = useState(null);
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

	// Listens for a change in account and updates state
	// useEffect(() => {
	// 	if (contract && provider) {
	// 		ethereum.on('accountsChanged', newAccount);
	// 		return () => ethereum.removeListener('accountsChanged', newAccount);
	// 	}
	// });

	// function newAccount(accounts) {
	// 	setContract(contract.connect(provider.getSigner(accounts[0])));
	// 	setAccount(accounts[0]);
	// }

	// // Listens for network changes to reload the page
	// useEffect(() => {
	// 	ethereum.on('chainChanged', chainId => window.location.reload());
	// 	return () =>
	// 		ethereum.removeListener('chainChanged', chainId =>
	// 			window.location.reload()
	// 		);
	// }, []);

	return (
		<Web3Context.Provider
			value={{
				savingsContract, setSavingsContract,
				creditContract, setCreditContract,
				daiContract, setDaiContract,
				usdcContract, setUsdcContract,
				savingsInfo, setSavingsInfo,
				creditInfo, setCreditInfo,
				walletInfo, setWalletInfo,
				account, setAccount
			}}
		>
			{children}
		</Web3Context.Provider>
	);
};

export default Web3Provider;