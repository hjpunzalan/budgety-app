import React, { Component } from "react";
import { Switch } from "react-router-dom";
import { connect } from "react-redux";
import { StoreState } from "../../reducers";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home/Home";
import Login from "../auth/Login/Login";
// import Dashboard from "../pages/Dashboard/Dashboard";
import Container from "../layout/Container/Container";
import Register from "../auth/Register/Register";
import PublicRoute from "./PublicRoute";
import ChangePassword from "../auth/ChangePassword";
import ForgotPassword from "../auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../auth/ResetPassword/ResetPassword";

interface Props extends StoreState {}

// Public routes
// !!!!!!!!!!!!!!!!!!!!!!!!
// Need to move dashboard back to privRoutes
export const pubRoutesArr = [
	{ name: "Home", path: "/", component: Home, exact: true }, // had to add nav:true for typescript to recognise nav property
	{ name: "Login", path: "/login", component: Login },
	{ name: "Register", path: "/register", component: Register },
	{
		name: "Forgot Password",
		path: "/forgotpassword",
		component: ForgotPassword
	},
	{
		name: "Reset Password",
		path: "/forgotpassword/reset/:resetToken",
		component: ResetPassword
	}
];

// Private routes
export const privRoutesArr = [
	{ name: "Dashboard", path: "/user", component: Container, exact: false },
	{
		exact: true,
		name: "Change Password",
		path: "/changepassword",
		component: ChangePassword
	}
];

class Routes extends Component<Props> {
	render() {
		return (
			<Switch>
				{pubRoutesArr.map(route => (
					<PublicRoute
						key={route.name}
						isAuthenticated={this.props.auth.isAuthenticated}
						exact={route.exact === undefined ? true : route.exact}
						path={route.path}
						component={route.component}
					/>
				))}

				{privRoutesArr.map(route => (
					<PrivateRoute
						key={route.name}
						isAuthenticated={this.props.auth.isAuthenticated}
						exact={route.exact === undefined ? true : route.exact}
						path={route.path}
						component={route.component}
					/>
				))}
			</Switch>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
	alerts: state.alerts,
	budget: state.budget,
	transactions: state.transactions
});

export default connect(mapStateToProps)(Routes);
