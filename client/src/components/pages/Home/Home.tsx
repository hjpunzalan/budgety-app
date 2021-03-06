/**********************
 *
 * Main Landing page for the app
 * 1. It includes the title and description of the app
 * 2. Call to action button
 */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import classes from "./Home.module.scss";

class Home extends Component {
	render() {
		return (
			<div className={classes.page}>
				<div className={classes.nav}>
					<Link to="/login">
						<button>Login</button>
					</Link>
				</div>
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

export default Home;
