import React, { useState, useEffect } from 'react';

import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

import avatar1 from "../../assets/images/users/avatar-1.jpg";
import profileImg from "../../assets/images/profile-img.png";
import {LOCAL_STORAGE_SIGNIN_KEY} from '../../App.constants'
import instance from "../../helpers/axiosly";
import stateWrapper from "../../containers/provider";

const WelcomeComp = (props) => {

    const [username, setusername] = useState("");

    const [state, setState] = useState({
        orderList: [],
        sum: []
      });

    useEffect(() => {
        let userData = props.userStore.fetchUser(props);
         setusername(userData.first_name);


        async function fetchData(){
            try {
              const token = localStorage.getItem("token")
              const res = await instance
                .get(`${process.env.REACT_APP_DATABASEURL}order`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })

                let orders = res.data.data.rows
                setState({
                  ...state,
                  orderList: orders.length,
                  sum: orders
                });
            } catch (e) {
              console.log(e);
            }
            }
            fetchData();
            //eslint-disable-line
      }, []);



          return (
           <React.Fragment>
                <Card className="overflow-hidden">
                    <div className="bg-soft-primary">
                        <Row>
                            <Col xs="7">
                                <div className="text-primary p-3">
                                    <h5 className="text-primary">Welcome Back !</h5>
                                    <p>AcadWritings Dashboard</p>
                                </div>
                            </Col>
                            <Col xs="5" className="align-self-end">
                                <img src={profileImg} alt="" className="img-fluid" />
                            </Col>
                        </Row>
                    </div>
                    <CardBody className="pt-0">
                        <Row>
                            <Col sm="4">
                                <div className="avatar-md profile-user-wid mb-4">
                                    <img src={avatar1} alt="" className="img-thumbnail rounded-circle" />
                                </div>
                                <h5 className="font-size-15 text-truncate">{username}</h5>
                            </Col>

                            <Col sm="8">
                                <div className="pt-4">
                                    <Row>
                                        <Col xs="6">
                                            <h5 className="font-size-15">{state.orderList}</h5>
                                            <p className="text-muted mb-0">Orders</p>
                                        </Col>
                                        <Col xs="6">
                                            <h5 className="font-size-15"></h5>
                                            <p className="text-muted mb-0">Complete Orders</p>
                                        </Col>
                                    </Row>
                                    <div className="mt-4">
                                        <Link to="/profile" className="btn btn-primary waves-effect waves-light btn-sm">View Profile <i className="mdi mdi-arrow-right ml-1"></i></Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </React.Fragment>
          );
        }
export default stateWrapper(WelcomeComp);
