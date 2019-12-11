import React, { Component } from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { ActionTypes } from "../../actions";
import { Dispatch } from "redux";

interface Props extends RouteProps {
	sessionExpired: () => { type: ActionTypes };
	isAuthenticated: boolean;
}

class PublicRoute extends Component<Props> {
	render() {
		return this.props.isAuthenticated ? (
			<Redirect to="/user" />
		) : (
			<Route {...this.props} />
		);
	}
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
	sessionExpired: () => dispatch({ type: ActionTypes.logoutUser })
});

export default connect(
	null,
	mapDispatchToProps
)(PublicRoute);
