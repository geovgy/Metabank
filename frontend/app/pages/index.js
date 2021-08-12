import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useContext } from 'react';
import { Web3Context } from '../components/Web3/Web3Context';

import NavBar from '../components/HorizontalLayout/Navbar';
import MetaMask from '../components/Web3/MetaMask';

export default function Home() {
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Metabank</title>
        <meta name="description" content="Banking for the Metaverse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MetaMask />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Metabank
        </h1>
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  )
}
