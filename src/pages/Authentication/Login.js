import React from 'react';
// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Link } from "react-router-dom";

import { Row, Col, CardBody, Card, Container, Label, Input } from "reactstrap";

// import images
import profileImg from "../../assets/images/profile-img.png";
import logoImg from "../../assets/images/logo.svg";
import authbg from "../../assets/images/bg-auth-overlay.png";
import metamaskIc from "../../assets/images/metamask.svg"

const Login = (props) => {

    return (
        <React.Fragment>
            <Row className="justify-content-center g-0 ">
                <Col md={8} lg={8} xl={8}>

                    {/* <img src={profileImg} alt="" className="img-fluid" /> */}
                    <div class="auth-full-bg pt-lg-5 p-4">
                        <div class="w-100">
                            <div class="bg-overlay" style={{
                                backgroundImage: `url(${authbg})`,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: " 50%"
                            }}>

                            </div>
                        </div>
                    </div>

                </Col>
                <Col md={8} lg={8} xl={4}>

                    <div className=" auth-full-page-content my-5 pt-sm-5 h-100">
                        <div class="home-btn d-none d-sm-block"><a class="text-dark" href="/"><i class="fas fa-home h2"></i></a></div>
                        <Container>
                            <Row className="d-flex flex-column h-100">

                                <div className="my-auto">
                                    <div className="pl-5 pt-5 ">
                                        <Link to="/">
                                            <div className="avatar-md profile-user-wid">
                                                <span className="avatar-title rounded-circle bg-light">
                                                    <img
                                                        src={logoImg}
                                                        alt=""
                                                        className="rounded-circle"
                                                        height="34"
                                                    />
                                                </span>
                                            </div>
                                        </Link>

                                    </div>
                                    <div className=" pl-5 pt-3 pb-2">
                                        <h5 className="">Login</h5>
                                        <p>Get your free Metabank account now.</p>
                                    </div>


                                    <div className="pl-5 pr-5">

                                        <div className="form-group">
                                            <Row>
                                                <Col xl="6" sm="12">
                                                    <div className="mb-3">
                                                        <Label className="card-radio-label mb-2">
                                                            <Input type="radio" name="currency" id="buycurrencyoption1" className="card-radio-input" defaultChecked readOnly />

                                                            <div className="card-radio" style={{ paddingTop: '25px', paddingBottom: '25px' }}>
                                                                <div>
                                                                    <img style={{ marginRight: '10px' }} src={metamaskIc} alt="" className="rounded-circle" height="34" />
                                                                    <span>Meta Mask</span>
                                                                </div>
                                                            </div>
                                                        </Label>


                                                    </div>
                                                </Col>
                                                <Col xl="6" sm="12">
                                                <div className="mb-3">
                                                        <Label className="card-radio-label mb-2">
                                                            <Input type="radio" name="currency" id="buycurrencyoption1" className="card-radio-input" defaultChecked readOnly />

                                                            <div className="card-radio" style={{ paddingTop: '25px', paddingBottom: '25px' }}>
                                                                <div>
                                                                    <img style={{ marginRight: '5px' }} src={metamaskIc} alt="" className="rounded-circle" height="34" />
                                                                    <span>Wallet Connect</span>
                                                                </div>
                                                            </div>
                                                        </Label>


                                                    </div>
                                                    <div className="mb-4"></div>
                                                </Col>
                                            </Row>
                                            <div className="mt-4">
                        <button
                          className="btn btn-primary btn-block waves-effect waves-light"
                          type="submit"
                        >
                          Login
                        </button>
                      </div>
                                        </div>



                                        <div className="mt-4 text-center">
                                            <p className="mb-0">
                                                By Logining you agree to the Metabank{" "}
                                                <Link to="#" className="text-primary">
                                                    Terms of Use
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 text-center">

                                    <p>
                                        Don't have an account ?{" "}
                                        <Link
                                            to="/login"
                                            className="font-weight-medium text-primary"
                                        >
                                            {" "}
                                            Register
                                        </Link>{" "}
                                    </p>
                                </div>
                                <div className="mb-4"></div>
                                <div className="mb-4"></div>
                                <div className="mb-4"></div>
                                <div className="mb-4"></div>
                                <div className="mb-4"></div>
                                <div className="mb-4"></div>


                            </Row>
                        </Container>
                    </div>

                </Col>

            </Row>
        </React.Fragment>
    );
}

export default Login;