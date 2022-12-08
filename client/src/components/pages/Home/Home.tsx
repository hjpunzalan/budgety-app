/**********************
 *
 * Main Landing page for the app
 * 1. It includes the title and description of the app
 * 2. Call to action button
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, RouterProps } from "react-router-dom";
import { postLogin } from "../../../actions/auth";
import { StoreState } from "../../../reducers";
import Spinner from "../../utils/Spinner/Spinner";
import classes from "./Home.module.scss";

interface Props extends StoreState, RouterProps {
	postLogin: (email: string, password: string) => Promise<void>;
}
class Home extends Component<Props> {
	state = {
		loading: false,
	};

	handleSubmit = () => {
		this.setState({ loading: true });
		// Login user
		this.props
			.postLogin("test@example.com", "test123")
			.then(() => {
				this.props.history.push("/user");
			})
			.finally(() => {
				this.setState({ loading: false });
			});
	};

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
				<button className={classes.cta} onClick={this.handleSubmit}>
					{this.state.loading ? (
						<div className={classes.spinner}>
							<Spinner />
						</div>
					) : (
						"Try it now"
					)}
				</button>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { postLogin })(Home);
