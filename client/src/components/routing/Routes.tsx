import React, { Component } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "../auth/Login/Login";
import Container from "../layout/Container/Container";
import Register from "../auth/Register/Register";
import PublicRoute from "./PublicRoute";
import ForgotPassword from "../auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../auth/ResetPassword/ResetPassword";
import { AuthState } from "../../reducers/auth";

interface Props {
	auth: AuthState;
}

// Public routes
export const pubRoutesArr = [
	{ name: "Login", path: "/login", component: Login },
	{
		name: "Register",
		path: "/register",
		component: Register
	},
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
	{ name: "Dashboard", path: "/user", component: Container, exact: false }
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
						exact={route.exact === undefined ? true : route.exact}
						path={route.path}
						component={route.component}
					/>
				))}

				{/* Only for pubRoutes for now */}
				{!this.props.auth.isAuthenticated && (
					<Route render={() => <Redirect to="/" />} />
				)}
			</Switch>
		);
	}
}

export default Routes;
