import React from 'react';
// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Link } from "react-router-dom";

import { Row, Col, CardBody, Card, Container } from "reactstrap";

// import images
// import profileImg from "../../public/assets/images/profile-img.png";
import logoImg from "../../public/assets/images/logo.svg";
// import authbg from "../../public/assets/images/bg-auth-overlay.png";
import authbg from "../../public/assets/images/auth-bbg.jpeg";

const Register = (props) => {

  return (
    <React.Fragment>
      <Row className="justify-content-center g-0 ">
        <Col md={8} lg={8} xl={8}>

          {/* <img src={profileImg} alt="" className="img-fluid" /> */}
          <div class="auth-full-bg pt-lg-5 p-4">
            <div class="w-100">
              <div class="bg-overlay" style={{
                backgroundImage:`url(${authbg})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition:" 50%"
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
                    <h5 className="">Register</h5>
                    <p>Get your free Metabank account now.</p>
                  </div>


                  <div className="pl-5 pr-5">
                    <AvForm
                      className="form-horizontal"
                    >
                      <div className="form-group">
                        <AvField
                          name="email"
                          label="Email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <AvField
                          name="password"
                          label="Wallet Address"
                          type="password"
                          required
                          placeholder="Enter public key"
                        />
                      </div>

                      <div className="mt-4">
                        <button
                          className="btn btn-primary btn-block waves-effect waves-light"
                          type="submit"
                        >
                          Register
                        </button>
                      </div>
                      <div class="mt-4 text-center"><h5 class="font-size-14 mb-3">
                        Sign in using
                      </h5>
                        <ul class="list-inline">
                          <li class="list-inline-item">
                            <a class="social-list-item bg-primary text-white border-primary" href="/pages-register-2">
                              <i class="mdi mdi-facebook">
                              </i>
                            </a>
                          </li><li class="list-inline-item"><a class="social-list-item bg-info text-white border-info" href="/pages-register-2"><i class="mdi mdi-twitter"></i></a></li><li class="list-inline-item"><a class="social-list-item bg-danger text-white border-danger" href="/pages-register-2"><i class="mdi mdi-google"></i></a></li></ul></div>
                      <div className="mt-4 text-center">
                        <p className="mb-0">
                          By registering you agree to the Metabank{" "}
                          <Link to="#" className="text-primary">
                            Terms of Use
                          </Link>
                        </p>
                      </div>
                    </AvForm>
                  </div>
                </div>
                <div className="mt-5 text-center">

                  <p>
                    Already have an account ?{" "}
                    <Link
                      to="/login"
                      className="font-weight-medium text-primary"
                    >
                      {" "}
                      Login
                    </Link>{" "}
                  </p>
                </div>

              </Row>
            </Container>
          </div>

        </Col>

      </Row>
    </React.Fragment>
  );
}

export default Register;