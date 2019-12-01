/**********************
 *
 * Main Landing page for the app
 * 1. It includes the title and description of the app
 * 2. Call to action button
 */

import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import classes from "./Home.module.scss";
import { StoreState } from "../../../reducers";

interface Props extends StoreState {}

class Home extends Component<Props> {
	render() {
		return this.props.auth.isAuthenticated ? (
			<Redirect to="/dashboard" />
		) : (
			<div className={classes.container}>
				<ul className={classes.navbar}>
					<Link to="/login">
						<li>Login</li>
					</Link>
				</ul>
				<h1 className={classes.title}>Budgety</h1>
				<h3 className={classes.desc}>
					Handle your annual budget with a click.
				</h3>
				<Link className={classes.cta} to="/register">
					<button>Sign up!</button>
				</Link>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Home);
