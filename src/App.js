import React, {Component} from 'react';

import { Switch, BrowserRouter as Router,Route } from "react-router-dom";
import { connect } from "react-redux";
import { Provider, Subscribe } from "unstated";

import allStores from './containers';
// Import Routes all
import { userRoutes , authRoutes} from "./routes/allRoutes";

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

import {ROLES} from './App.constants'

// Import scss
import "./assets/scss/theme.scss";




class App extends Component{

	constructor(props) {
		super(props);
		this.layoutStore = allStores[0];
		// this.footballStore = allStores[1];
		this.userStore = allStores[1];
	}


	appScreen = () => {
		const getLayout = () => {
			let layoutCls = VerticalLayout;

			switch (this.props.layout.layoutType) {
				case "horizontal":
					layoutCls = HorizontalLayout;
					break;
				default:
					layoutCls = VerticalLayout;
					break;
			}
			return layoutCls;
		};

		const Layout = getLayout();
		const NonAuthmiddleware = ({
			component: Component,
			layout: Layout
		}) => (
				<Route
					render={props => {
					return (
							<Layout>
								<Component {...props} />
							</Layout>
						);
					}}
				/>
			);
		return (
			<React.Fragment>
			<Router>
				<Switch>
					{authRoutes.map((route, idx) => (
						<NonAuthmiddleware
							path={route.path}
							component={route.component}
							key={idx}
							layout={NonAuthLayout}
						/>
					))}

					{userRoutes.map((route, idx) => (
						<Authmiddleware
							exact path={route.path}
							component={route.component}
							key={idx}
							layout={Layout}
						/>
					))}

				</Switch>
			</Router>
		</React.Fragment>

		)
	}

	render() {
		return (
			<Provider inject={allStores}>
				<Subscribe to={[this.layoutStore]}>
					{layoutStore => (
						this.appScreen(layoutStore)
					)}
				</Subscribe>
			</Provider>
		)
	}
}



const mapStateToProps = state => {
	return {
		layout: state.Layout
	};
};


export default connect(mapStateToProps, null)(App);
