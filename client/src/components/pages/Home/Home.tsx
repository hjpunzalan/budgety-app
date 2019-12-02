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

export default Home;
