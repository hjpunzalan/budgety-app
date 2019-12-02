import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { StoreState } from "../../../reducers";
import classes from "./Dashboard.module.scss";

interface Props extends StoreState {}
interface State {}

class Dashboard extends Component<Props, State> {
	state = {};

	render() {
		const { currentUser } = this.props.auth;
		return (
			<div className={classes.container}>
				<h3>
					Hi {currentUser && currentUser.firstName}{" "}
					{currentUser && currentUser.lastName}!
				</h3>
				<ul>
					<li>
						<Link to="/changepassword">Change Password</Link>
					</li>
					<li>
						<Link to="/updateme">Update user details</Link>
					</li>
				</ul>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
	users: state.users,
	alerts: state.alerts
});

export default connect(mapStateToProps)(Dashboard);
