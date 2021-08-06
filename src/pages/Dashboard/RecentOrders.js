import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle, Badge, Button } from "reactstrap";
import { Link } from "react-router-dom";
import instance from "../../helpers/axiosly";
import moment from "moment";

const RecentOrders = (props) => {
  /*const transactions = [
    {
      id: "customCheck2",
      orderId: "#SK2540",
      billingName: "Neal Matthews",
      Date: "07 Oct, 2019",
      total: "$400",
      badgeClass: "success",
      paymentStatus: "Paid",
      methodIcon: "fa-cc-mastercard",
      paymentMethod: "Mastercard",
      link: "#",
    },
    {
      id: "customCheck3",
      orderId: "#SK2541",
      billingName: "Jamal Burnett",
      Date: "07 Oct, 2019",
      total: "$380",
      badgeClass: "danger",
      paymentStatus: "Chargeback",
      methodIcon: "fa-cc-visa",
      paymentMethod: "Visa",
      link: "#",
    },
  ];*/

  const [state, setState] = useState({
    orderList: [],
    loading: false
  });

  useEffect(() => {
    setState({...state, loading: true})
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

        const lastList = orders.slice(0, 2)

          setState({
            ...state,
            orderList: lastList,
            loading: false
          });

    } catch (e) {
      console.log(e);
    }
    }
    fetchData();

    //eslint-disable-line
  }, [])

  console.log(state.orderList)
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-4">RECENT ORDERS</CardTitle>
          {state.loading ? (<div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                  </div>):
          (
            <div>
              <Link
            className="btn btn-primary waves-effect waves-light"
            to="/orders"
          >
            View Orders
          </Link>
          <div className="table-responsive">
            <table className="table table-centered table-nowrap mb-0">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: "20px" }}>
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="customCheck1"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheck1"
                      >
                        &nbsp;
                      </label>
                    </div>
                  </th>
                  <th>Order ID</th>
                  <th>Topic</th>
                  <th>Date</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {state.orderList.map((list, key) => (
                  <tr key={"_tr_" + key}>
                    <td>
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={list.id}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={list.id}
                        >
                          &nbsp;
                        </label>
                      </div>
                    </td>
                    <td>
                      <Link to="#" className="text-body font-weight-bold">
                        {" "}
                        {list.id}{" "}
                      </Link>{" "}
                    </td>
                    <td>{list.topic}</td>
                    <td>{moment(list.createdAt).format("MMMM Do YYYY")}</td>
                    <td>{`$${list.balance}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </div>
          )}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default RecentOrders;
