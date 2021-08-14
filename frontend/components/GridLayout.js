import { Component } from "react";
import styles from '../styles/GridLayout.module.css';

class GridLayout extends Component {
    // constructor(props) {
    //     super(props);
    //     const individualSavings = '';
    //     const totalSavings = '';
    //     const creditLimit = '';
    //     const creditOwed = '';
    // }

    render() {
        return (
            <div className={styles.dashboard}>
                <div className={styles.card}>
                    <h2>Savings</h2>
                    <p>Balance: <span>${this.props.individualSavings} (DAI)</span></p>
                    <p>Interest Earned: <span>${this.props.interestAccrued} (DAI)</span></p>
                </div>
                <div className={styles.card}>
                    <h2>Credit</h2>
                    <p>Remaining: <span>${this.props.creditRemaining} (USDC)</span></p>
                    <p>Outstanding: <span>${this.props.creditOwed} (USDC)</span></p>
                    <p>Limit: <span>${this.props.creditLimit} (USDC)</span></p>
                </div>
                <div className={styles.card}>
                    <h2>Total Pool</h2>
                    <p>Total Balance: <span>${this.props.totalSavings} (DAI)</span></p>
                    <p># of Members: <span>{this.props.memberCount}</span></p>
                    <p>Total Interest: <span>{this.props.totalInterest}</span></p>
                </div>
            </div>
        )
    }
}

export default GridLayout;