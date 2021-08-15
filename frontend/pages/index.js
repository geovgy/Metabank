import Head from 'next/head';
import styles from '../styles/Home.module.css';
import React from 'react';
import { useState, useContext } from 'react';


import { Row, Col, CardBody, Card, Container, Label, Input } from "reactstrap";
// import 'bootstrap-css-only/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Image from 'next/image'

// Import smart contracts
import SavingsPool from '../../artifacts/contracts/SavingsPool.sol/SavingsPool.json';
import CreditSpender from '../../artifacts/contracts/CreditSpender.sol/CreditSpender.json';
import { ethers } from 'ethers';

import { Web3Context } from '../components/Web3/Web3Context';
import NavBar from '../components/HorizontalLayout/NavBar';
import GridLayout from '../components/GridLayout';
// import images
import profileImg from "../public/assets/images/profile-img.png";
// import logoImg from "../../assets/assets/images/logo.svg";
import authbg from "../public/assets/images/auth-bbg.jpeg";
import metamaskIc from "../public/assets/images/metamask.svg"
import login from '../styles/login.module.css';

export default function Home() {
    const {
        account,
        savingsContract,
        creditContract,
        daiContract,
        usdcContract,
        savingsInfo,
        creditInfo,
        walletInfo
      } = useContext(Web3Context);
    
      async function createMembership() {
        if (savingsInfo.isMember) {
          return console.log("You are already a member");
        }
        const createMembershipTx = await savingsContract.createMembership();
        await createMembershipTx.wait();
    
        const membershipStatus = await savingsContract.checkMembership();
        return savingsContract.isMember = membershipStatus;
      }
    
      // Unable to get address of signer
      async function viewDAIBalance() {
        const balance = await daiContract.balanceOf(account.address);
        setWalletInfo(ethers.utils.formatEther(balance));
      }
      
    return (
          <React.Fragment >
            <Row className={login.loginWrapper}>
                <Col md={8} lg={8} xl={7}>

                    {/* <img src={profileImg} alt="" className="img-fluid" /> */}
                    <div class="auth-full-page-content ">
                        <div class="w-100">
                            <div className={[login.authBg,]} style={{

                            }}>
                            </div>
                        </div>
                    </div>


                </Col>
                <Col md={8} lg={8} xl={5}>

                    <div className=" auth-full-page-content pt-sm-5 ">
                    
                        <div class="home-btn d-none d-sm-block"><a class="text-dark" href="/"><i class="fas fa-home h2"></i></a></div>
                        <Container>
                            <Row className="d-flex flex-column h-100">

                                <div className="my-auto">
                                    <div className="pl-5 pt-5 ">
                                        {/* <Link to="/"> */}
                                        <div className="avatar-md profile-user-wid">
                                            <span className="avatar-title rounded-circle bg-light">
                                                {/* <Image
                                                src={metamaskIc}
                                                alt=""
                                                className="rounded-circle"
                                                height="34"
                                            /> */}
                                                {/* <Image width={500}
                                            height={500} src={profileImg}></Image> */}
                                            </span>
                                        </div>
                                        {/* </Link> */}

                                    </div>
                                    <div className=" pl-5 pt-3 pb-2">
                                        <h5 className="">Login</h5>
                                        <p>Get your free Metabank account now.</p>
                                    </div>


                                    <div className="pl-5 pr-5">

                                        <div className="form-group">
                                            <Row>
                                                <Col xl="12" sm="12">
                                                    {/* <div className={[login.loginCardlayout,]}>
                                                <Label className="card-radio-label mb-2">
                                                        <div>

                                                            <img style={{ marginRight: '10px' }} src={metamaskIc} alt="" className="rounded-circle" height="34" />
                                                            <span>Meta Mask</span>
                                                        </div>
                                                </Label>


                                            </div> */}
                                                </Col>
                                                {/* <Col xl="6" sm="12">
                                            <div className="mb-3">
                                                <Label className="card-radio-label mb-2">
                                                    <Input type="radio" name="currency" id="buycurrencyoption1" className="card-radio-input" defaultChecked readOnly />

                                                    <div className="card-radio" style={{ paddingTop: '25px', paddingBottom: '25px' }}>
                                                        <div>
                                                            <span>Wallet Connect</span>
                                                        </div>
                                                    </div>
                                                </Label>


                                            </div>
                                            <div className="mb-4"></div>
                                        </Col> */}
                                            </Row>
                                            <div >
                                                {/* <button
                                            // className="btn btn-primary btn-block waves-effect waves-light"
                                            className={[login.loginCardlayout,]}
                                            type="submit"
                                        >
                                            Login
                                        </button> */}
                                                {!savingsInfo.isMember ? (


                                                    <button onClick={createMembership}
                                                        // className="btn btn-primary btn-block waves-effect waves-light"
                                                        className={[login.loginCardlayout,]}
                                                    // type="submit"
                                                    >
                                                        Login with Metamask
                                                    </button>
                                                ) : ('')}
                                            </div>
                                        </div>



                                        <div className="mt-4 text-center">
                                            <p className="mb-0">
                                                By Logining you agree to the Metabank{" "}
                                                <div to="#" className="text-primary">
                                                    Terms of Use
                                                </div>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="mt-5 text-center">

                            <p>
                                Don't have an account ?{" "}
                                <div
                                    // to="/login"
                                    className="font-weight-medium text-primary"
                                >
                                    {" "}
                                    Register
                                </div>{" "}
                            </p>
                        </div> */}


                            </Row>
                        </Container>
                    </div>

                </Col>

            </Row>
        </React.Fragment>
    

    )
}
