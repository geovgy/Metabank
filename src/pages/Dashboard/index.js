import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Media,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";

import instance from "../../helpers/axiosly";

//import Charts
import StackedColumnChart from "./StackedColumnChart";

import modalimage1 from "../../assets/images/product/img-7.png";
import modalimage2 from "../../assets/images/product/img-4.png";

// Pages Components
import WelcomeComp from "./WelcomeComp";
import MonthlyEarning from "./MonthlyEarning";
import SocialSource from "./SocialSource";
import ActivityComp from "./ActivityComp";
import TopCities from "./TopCities";
// import LatestTranaction from "./LatestTranaction";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withNamespaces } from "react-i18next";

import stateWrapper from "../../containers/provider";

const Dashboard = (props) => {
  const [modal, setmodal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [totalBalance, setotalBalance] = useState(0)
  const [numberOfOrders, setnumberOfOrders] = useState(0)
  const [completedOrders, setcompletedOrders] = useState(0)
  const [state, setState] = useState({
    fullname: props.firstname,
    email: ""
  });

  useEffect(() => {
    let hit = props.userStore.fetchUser(props);
    // => console.log(state.success),[state.success])
    let orderData, userData, checkthis;
    userData = props.userStore.fetchUser(props);
    checkthis = props.userStore.state.sessionData;

    console.log("order-data", userData);
    console.log("order-data", checkthis);



    //eslint-disable-line
  }, []);
 const orderListData = [
    {
      title: "Orders",
      iconClass: "bx-copy-alt",
      // description: props.orderStore.state.sessionData.numberOfOrders,
      description: numberOfOrders,
    },
    {
      title: "Completed Orders",
      iconClass: "bx-archive-in",
      //description: props.orderStore.state.sessionData.completedOrders,
      description: completedOrders,
    },
    // {
    //   title: "Balance",
    //   iconClass: "bx-purchase-tag-alt",
    //   description: "$16.2",
    // },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboard")}
            breadcrumbItem={props.t("Dashboard")}
          />
          <Row>
            {/* {notifications.map((notification, key) => (
              <Col lg="12" key={"_col_" + key}>
                <Card className="mini-stats-wid">
                  <CardBody>
                    <CardTitle>Notification</CardTitle>
                    <Media>
                      <Media body>
                        <h4 className="mb-0">{notification.title}</h4>
                        <p className="text-muted font-weight-medium">
                          {notification.body}
                        </p>
                      </Media>
                    </Media>
                  </CardBody>
                </Card>
              </Col>
            ))} */}

          </Row>

          <Row>
            <Col xl="12">
              <Row>
                {/* orderListData Render */}
                {orderListData.map((report, key) => (
                  <Col md="4" key={"_col_" + key}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <Media>
                          <Media body>
                            <p className="text-muted font-weight-medium">
                              {report.title}
                            </p>
                            <h4 className="mb-0">{report.description}</h4>
                          </Media>
                          <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                            <span className="avatar-title">
                              <i
                                className={
                                  "bx " + report.iconClass + " font-size-24"
                                }
                              ></i>
                            </span>
                          </div>
                        </Media>
                      </CardBody>
                    </Card>
                  </Col>
                ))}

                <Col md="4">
                  <Card className="mini-stats-wid">
                    <CardBody>
                      <Media>
                        <Media body>
                          <p className="text-muted font-weight-medium">

                            Balance
                          </p>
                          <p>{state.fullname}</p>
                          <h4 className="mb-0">{`$${totalBalance}`}</h4>
                        </Media>
                        <div className="align-self-center">
                          <Link
                            className="btn btn-primary waves-effect waves-light"
                            to="/payments"
                          >
                            Payment
                          </Link>
                        </div>
                      </Media>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col xl="4">
              <WelcomeComp />
            </Col>
            <Col lg="8">
              {/* <RecentOrders /> */}
            </Col>
          </Row>
        </Container>
      </div>
      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabindex="-1"
        toggle={() => {
          setmodal(!modal);
        }}
      >
        <div className="modal-content">
          <ModalHeader
            toggle={() => {
              setmodal(!modal);
            }}
          >
            Order Details
          </ModalHeader>
          <ModalBody>
            <p className="mb-2">
              Product id: <span className="text-primary">#SK2540</span>
            </p>
            <p className="mb-4">
              Billing Name: <span className="text-primary">Neal Matthews</span>
            </p>

            <div className="table-responsive">
              <Table className="table table-centered table-nowrap">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage1} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Wireless Headphone (Black)
                        </h5>
                        <p className="text-muted mb-0">$ 225 x 1</p>
                      </div>
                    </td>
                    <td>$ 255</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage2} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Hoodie (Blue)
                        </h5>
                        <p className="text-muted mb-0">$ 145 x 1</p>
                      </div>
                    </td>
                    <td>$ 145</td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <h6 className="m-0 text-right">Sub Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <h6 className="m-0 text-right">Shipping:</h6>
                    </td>
                    <td>Free</td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <h6 className="m-0 text-right">Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                setmodal(!modal);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default withNamespaces()(stateWrapper(Dashboard));
