import React from 'react';
import { Card, CardBody, CardTitle, Badge, Button } from "reactstrap";
import { Link } from "react-router-dom";

const LatestTranaction = (props) => {



            const  transactions = [
                { id: "customCheck2", orderId: "#SK2540", billingName: "Neal Matthews", Date: "07 Oct, 2019", total: "$400", badgeClass: "success", paymentStatus: "Paid", methodIcon: "fa-cc-mastercard", paymentMethod: "Mastercard", link: "#" },
                { id: "customCheck3", orderId: "#SK2541", billingName: "Jamal Burnett", Date: "07 Oct, 2019", total: "$380", badgeClass: "danger", paymentStatus: "Chargeback", methodIcon: "fa-cc-visa", paymentMethod: "Visa", link: "#" },
                { id: "customCheck4", orderId: "#SK2542", billingName: "Juan Mitchell", Date: "06 Oct, 2019", total: "$384", badgeClass: "success", paymentStatus: "Paid", methodIcon: "fa-cc-paypal", paymentMethod: "Paypal", link: "#" },
                { id: "customCheck5", orderId: "#SK2543", billingName: "Barry Dick", Date: "05 Oct, 2019", total: "$412", badgeClass: "success", paymentStatus: "Paid", methodIcon: "fa-cc-mastercard", paymentMethod: "Mastercard", link: "#" },
                { id: "customCheck6", orderId: "#SK2544", billingName: "Ronald Taylor", Date: "04 Oct, 2019", total: "$404", badgeClass: "warning", paymentStatus: "Refund", methodIcon: "fa-cc-visa", paymentMethod: "Visa", link: "#" },
                { id: "customCheck7", orderId: "#SK2545", billingName: "Jacob Hunter", Date: "04 Oct, 2019", total: "$392", badgeClass: "success", paymentStatus: "Paid", methodIcon: "fa-cc-paypal", paymentMethod: "Paypal", link: "#" }
            ]; 

          return (
              <React.Fragment>
                <Card>
                    <CardBody>
                        <CardTitle className="mb-4">
                            Latest Transaction
                        </CardTitle>
                        <div className="table-responsive">
                            <table className="table table-centered table-nowrap mb-0">
                                <thead className="thead-light">
                                    <tr>
                                        <th style={{ width: "20px" }}>
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                                <label className="custom-control-label" htmlFor="customCheck1">&nbsp;</label>
                                            </div>
                                        </th>
                                        <th>Order ID</th>
                                        <th>Billing Name</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Payment Status</th>
                                        <th>Payment Method</th>
                                        <th>View Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        transactions.map((transaction, key) =>
                                            <tr key={"_tr_" + key}>
                                                <td>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" className="custom-control-input" id={transaction.id} />
                                                        <label className="custom-control-label" htmlFor={transaction.id}>&nbsp;</label>
                                                    </div>
                                                </td>
                                                <td><Link to="#" className="text-body font-weight-bold"> {transaction.orderId} </Link> </td>
                                                <td>{transaction.billingName}</td>
                                                <td>
                                                    {transaction.Date}
                                                </td>
                                                <td>
                                                    {transaction.total}
                                                </td>
                                                <td>
                                                    <Badge className={"font-size-12 badge-soft-" + transaction.badgeClass} color={transaction.badgeClass} pill>{transaction.paymentStatus}</Badge>
                                                </td>
                                                <td>
                                                    <i className={"fab " + transaction.methodIcon + " mr-1"}></i> {transaction.paymentMethod}
                                                </td>
                                                <td>
                                                    <Button type="button" color="primary" size="sm" className="btn-rounded waves-effect waves-light">
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </React.Fragment>
          );
        }

export default LatestTranaction;