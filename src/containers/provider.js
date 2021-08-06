import React from "react";
import { Subscribe } from "unstated";
import allStores from "./index";

export default WrappedComponent => {
  
  const subscribeWrapper = ({ ...props }) => (

    <Subscribe to={allStores}>
        {(
          userStore,
          masterStore,
        ) => (
          <WrappedComponent
            userStore= {userStore}
            masterStore = {masterStore}
            {...props}
          />
        )}
    </Subscribe>


  )

  return subscribeWrapper;
};
