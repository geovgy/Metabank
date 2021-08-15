import { Component } from "react";
import styles from '../styles/GridLayout.module.css';

class GridLayout extends Component {
    render() {
        return (
            <div className={styles.dashboard}>
                <div className={styles.card}>
                    <h2>Savings</h2>
                    <p>Balance: <span>{this.props.individualSavings}</span> DAI</p>
                    {/* <p>Interest Earned: <span>{this.props.interestAccrued}</span> DAI</p> */}
                </div>
                <div className={styles.card}>
                    <h2>Credit</h2>
                    <p>Available: <span>{this.props.creditAvailable}</span> USDC</p>
                    <p>Outstanding: <span>{this.props.creditOwed}</span> USDC</p>
                    <p>Limit: <span>{this.props.creditLimit}</span> USDC</p>
                </div>
                <div className={styles.card}>
                    <h2>Pool</h2>
                    <p>Total Balance: <span>{this.props.totalSavings}</span> DAI</p>
                    <p># of Members: <span>{this.props.memberCount}</span></p>
                    <p>Total Interest: <span>{this.props.totalInterest}</span> DAI</p>
                </div>
            </div>
        )
    }
}

export default GridLayout;