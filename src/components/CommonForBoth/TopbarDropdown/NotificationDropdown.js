import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

import Moment from "react-moment";

//Import images
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";

//i18n
import { withNamespaces } from 'react-i18next';
import stateWrapper from '../../../containers/provider'
import { grantPermission } from '../../../GrantPermission';
import { ROLES } from '../../../App.constants';

const NotificationDropdown = (props) => {

  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const token = localStorage.getItem("token")

  const [projectNotifications, setProjectNotifications] = useState([]);
  const [state, setState] = useState({
    loading: false,
    alert: ''
  })

  useEffect(() => {
    setState({ ...state, loading: true })
    async function fetchData() {
      try {

        let userData = await props.userStore.fetchUser(props);
        console.log(props?.writerStore?.getProjectNotifications(token, userData?.id))
        console.log(userData, "userData");
        // const orderList = await props?.masterStore?.fetchOrder(token)
        //   console.log(orderList)
        const res = await props?.writerStore?.getProjectNotifications(token, userData?.id)
        setState({ ...state, loading: false })
        setProjectNotifications(res.data.data.rows)
        console.log(res?.data?.data?.rows)




      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [])

  return (
    <>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon waves-effect"
          tag="button" id="page-header-notifications-dropdown">
          <i className="bx bx-bell bx-tada"></i>
          <span className="badge badge-danger badge-pill">3</span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0" right>
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {props.t('Notifications')} </h6>
              </Col>
              <div className="col-auto">
                <a href="/wnotification" className="small"> View All</a>
              </div>
            </Row>
          </div>

          {state.loading ? (<div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>) : (

            <SimpleBar style={{ height: "auto" }}>
              <Link to="/wnotification" className="text-reset notification-item">
              {projectNotifications.map((project, key) => (
                <div className="media">
                  <div className="avatar-xs mr-3">
                    <span className="avatar-title bg-primary rounded-circle font-size-16">
                      <i className="bx bx-cart"></i>
                    </span>
                  </div>
                  <div className="media-body">
                    <h6 className="mt-0 mb-1">{props.t('New project Request')}</h6>
                    <div className="font-size-12 text-muted">
                      <p className="mb-1">{project.text} {project.id}</p>
                      <p className="mb-0"><i className="mdi mdi-clock-outline"></i> <Moment format="hh:mm A">{project.createdAt}</Moment> </p>
                    </div>
                  </div>
                </div>
              ))}
              </Link>
            </SimpleBar>
          )}
          <div className="p-2 border-top">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="/wnotification"
            >
              {" "}
              {props.t('View all')}{" "}
            </Link>
          </div>
        </DropdownMenu>

      </Dropdown>
    </>
  );
}

export default withNamespaces()(stateWrapper(NotificationDropdown));