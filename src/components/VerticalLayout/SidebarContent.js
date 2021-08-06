import React, { useState, useEffect } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withNamespaces } from "react-i18next";

import { grantPermission } from '../../GrantPermission';
import {ROLES} from '../../App.constants'
import stateWrapper from "../../containers/provider";
import instance from "../../helpers/axiosly";



const SidebarContent = (props) => {
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  const [examScore, setExamScore] = useState(0)

  useEffect(() => {
    var pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu("#side-menu");
      var matchingMenuItem = null;
      var ul = document.getElementById("side-menu");
      var items = ul.getElementsByTagName("a");
      for (var i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();

    let userData = props.userStore.fetchUser(props);

  }, [props.location.pathname]);



  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  }

  const Admin = localStorage.getItem("Admin")

  return (
    <React.Fragment>
          {grantPermission([ROLES.CLIENT]) ?
         <div id="sidebar-menu">
         <ul className="metismenu list-unstyled" id="side-menu">
           <li className="menu-title">{props.t("Menu")} </li>
           <li>
             <Link to="/dashboard" className="waves-effect">
               <i className="bx bx-home-circle"></i>
               <span>{props.t("Dashboard")}</span>
             </Link>
           </li>
           <li>
             <Link to="/#" className="has-arrow waves-effect">
               <i className="bx bx-store"></i>
               <span>{props.t("My Orders")}</span>
             </Link>
             <ul className="sub-menu" aria-expanded="false">
               <li>
                 <Link to="/orders">{props.t("Orders")}</Link>
               </li>
               <li>
                 <Link to="/new-order">{props.t("New Orders")}</Link>
               </li>
             </ul>
           </li>

           <li>
             <Link to="/payments" className="waves-effect">
               <i className="bx bxs-bank"></i>
               <span>{props.t("Payments")}</span>
             </Link>
           </li>

           <li>
             <Link to="/profile" className="waves-effect">
               <i className="bx bxs-user-detail"></i>
               <span>{props.t("Profile")}</span>
             </Link>
           </li>

           <li>
             <Link to="/support" className="waves-effect">
               <i className="bx bx-envelope"></i>
               <span>{props.t("Support")}</span>
             </Link>
           </li>


         </ul>
       </div>: ''}

    </React.Fragment>
  );
};

export default withRouter(withNamespaces()(stateWrapper(SidebarContent)));
