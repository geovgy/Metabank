import React, { useEffect } from "react";
import { Route,Redirect,withRouter } from "react-router-dom";
import {LOCAL_STORAGE_SIGNIN_KEY} from '../../App.constants'
import {grantPermission} from '../../GrantPermission'
import {ROLES} from '../../App.constants';
import stateWrapper from '../../containers/provider';


	function Authmiddleware({
		component: Component, layout: Layout, roles, ...rest
	  }) {
		  useEffect(() => {
			  (async () => {
				const userData = rest?.userStore?.fetchUser();
				const bearertoken = userData?.access_token;
				console.log(userData, bearertoken);
				const result = rest?.orderStore?.fetchOrders(userData, bearertoken);
				console.log(result);
			  })()

		  }, [])
		return (
		  <>
			{ grantPermission([ROLES.CLIENT]) && (
			<Route
			  {...rest}
			  render={(props) => (
				<Layout>
				  <Component {...props} />
				</Layout>
			  )}
			/>
			)}
			{
			  !grantPermission([ROLES.CLIENT]) && (
				<Route 
				{...rest}
				render={(props) => (
					<Redirect  to={{ pathname: "/login", state: { from: props.location } }} />
				)}
					
				/>
				
			  )
			}
		  </>
		);
	  }

export default withRouter(stateWrapper(Authmiddleware));

