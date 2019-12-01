import React, { Component } from "react";
import { Switch } from "react-router-dom";
import { connect } from "react-redux";
import { StoreState } from "../../reducers";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home/Home";
import Login from "../auth/Login/Login";
import Dashboard from "../pages/Dashboard";
import Register from "../auth/Register/Register";
import PublicRoute from "./PublicRoute";
import ChangePassword from "../auth/ChangePassword";
import UpdateMe from "../pages/UpdateMe";
import ForgotPassword from "../auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";

interface Props extends StoreState {}

// Public routes
export const pubRoutesArr = [
	{ name: "Home", path: "/", component: Home }, // had to add nav:true for typescript to recognise nav property
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
	{ name: "Dashboard", path: "/dashboard", component: Dashboard },
	{
		name: "Change Password",
		path: "/changepassword",
		component: ChangePassword
	},
	{
		name: "Update user details",
		path: "/updateme",
		component: UpdateMe
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
						exact
						path={route.path}
						component={route.component}
					/>
				))}

				{privRoutesArr.map(route => (
					<PrivateRoute
						key={route.name}
						isAuthenticated={this.props.auth.isAuthenticated}
						exact
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
	users: state.users,
	alerts: state.alerts,
	budget: state.budget
});

export default connect(mapStateToProps)(Routes);
