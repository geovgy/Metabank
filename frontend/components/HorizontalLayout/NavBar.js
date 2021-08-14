import { useContext } from 'react';
import { Web3Context } from '../Web3/Web3Context';
import Wallet from '../Web3/Wallet';

import styles from '../../styles/NavBar.module.css'

const NavBar = () => {
	const { account } = useContext(Web3Context);

	return (
		<header className={styles.header}>
			<nav>
				{!account ? (
					<Wallet />
				) : (
					<div>
						<button className={styles.walletBtn} onClick={() => console.log(account)}>
							Connected
						</button>
					</div>
				)}
			</nav>
		</header>
	);
};

export default NavBar;