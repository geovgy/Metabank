import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withNamespaces } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

// users
import user1 from "../../../assets/images/users/avatar-1.jpg";
import stateWrapper from "../../../containers/provider";

import {LOCAL_STORAGE_SIGNIN_KEY} from '../../../App.constants'

const ProfileMenu = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState("");

  useEffect(() => {
    let userData = props.userStore.fetchUser(props);
        setusername(userData.first_name);
  }, [props.success]);

  useEffect(() => {
    let userData = props.userStore.fetchUser(props);
        setusername(userData.first_name);
  },[props?.userStore?.state?.updatedProfile])

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ml-2 mr-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
        </DropdownToggle>
        <DropdownMenu right>
          <Link to="/profile" className="dropdown-item">
            <i className="bx bx-user font-size-16 align-middle mr-1"></i>
            <span> {props.t("Profile")}</span>
          </Link>

          <Link to="/payments" className="dropdown-item">
            <i className="bx bx-wallet font-size-16 align-middle mr-1"></i>
            <span> {props.t("Payments")}</span>
          </Link>
          <div className="dropdown-divider"></div>
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle mr-1 text-danger"></i>
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withNamespaces()(stateWrapper(ProfileMenu)))
);
