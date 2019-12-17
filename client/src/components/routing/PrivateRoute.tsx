import React from "react";
import { Redirect, Route, RouteProps } from "react-router";
import Axios from "axios";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ActionTypes } from "../../actions";

interface Props extends RouteProps {
	isAuthenticated: boolean;
	sessionExpired: () => { type: ActionTypes };
}

class PrivateRoute extends Route<Props> {
	componentDidMount() {
		// Log user out if session expires
		if (this.props.isAuthenticated)
			Axios.get<boolean>("/api/auth/isloggedin")
				.then(res => {
					if (!res.data) this.props.sessionExpired();
					else return;
				})
				.catch(err => {
					console.error(err);
					// If server fails, log user out
					this.props.sessionExpired();
				});
	}
	// Can be too much request
	componentDidUpdate(prevProps: Props) {
		if (prevProps.location !== this.props.location) {
			// Log user out if session expires
			if (this.props.isAuthenticated)
				Axios.get<boolean>("/api/auth/isloggedin")
					.then(res => {
						if (res.data === false) this.props.sessionExpired();
						else return;
					})
					.catch(err => {
						console.error(err);
						// If server fails, log user out
						this.props.sessionExpired();
					});
		}
	}
	public render() {
		return !this.props.isAuthenticated ? (
			<Redirect to="/login" />
		) : (
			<Route {...this.props} />
		);
	}
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
	// need to fix this
	sessionExpired: () => dispatch({ type: ActionTypes.logoutUser })
});

export default connect(
	null,
	mapDispatchToProps
)(PrivateRoute);
