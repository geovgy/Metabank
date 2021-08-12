import { useContext } from 'react';
import { Web3Context } from '../Web3/Web3Context';
import MetaMask from '../Web3/MetaMask';

const NavBar = () => {
	const { account } = useContext(Web3Context);

	return (
		<header>
			<nav>
				{!account ? (
					<MetaMask />
				) : (
					<div>
						<h3>Wallet Connected</h3>
						<button onClick={() => console.log(account)}>
							Check Account
						</button>
					</div>
				)}
			</nav>
		</header>
	);
};

export default NavBar;