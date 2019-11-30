/**********************
 *
 * Main Landing page for the app
 * 1. It includes the title and description of the app
 * 2. Call to action button
 */

import React, { Component } from "react";
import classes from "./Home.module.scss";
import { Link } from "react-router-dom";

class Home extends Component {
	state = {};

	render() {
		return (
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
				<button className={classes.cta}>Sign up!</button>
			</div>
		);
	}
}

export default Home;
