import '../styles/globals.css'
import Web3Provider from '../components/Web3/Web3Context'
// import styles from '../styles/app.scss'

function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  )
}

export default MyApp
