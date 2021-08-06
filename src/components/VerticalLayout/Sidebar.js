import React from 'react';

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Simple bar
import SimpleBar from "simplebar-react";

//i18n
import { withNamespaces } from 'react-i18next';
import SidebarContent from "./SidebarContent";

const Sidebar = (props) => {
          return (
            <React.Fragment>
                <div className="vertical-menu">
                    <data data-simplebar data-simplebar className="h-100">
                        {props.type !== "condensed" ? (
                            <SimpleBar style={{ maxHeight: "100%" }}>
                                <SidebarContent />
                            </SimpleBar>
                        ) : <SidebarContent />}
                    </data>

                </div>
            </React.Fragment>
          );
        }

const mapStatetoProps = state => {
    return {
        layout: state.Layout
    };
};
export default connect(mapStatetoProps, {})(withRouter(withNamespaces()(Sidebar)));
