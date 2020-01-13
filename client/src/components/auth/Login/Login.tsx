import React, { Component } from "react";
import { connect } from "react-redux";
import { postLogin } from "../../../actions";
import { StoreState } from "../../../reducers";
import Spinner from "../../utils/Spinner/Spinner";
import { Link } from "react-router-dom";
import classes from "./Login.module.scss";
import { RouterProps } from "react-router";

interface Props extends StoreState, RouterProps {
	postLogin: (email: string, password: string) => Promise<void>;
}
interface State {
	email: string;
	password: string;
	loading: boolean;
	pathname: string;
}

class Login extends Component<Props, State> {
	state = {
		email: "",
		password: "",
		loading: false,
		pathname: this.props.history.location.pathname
	};

	handleChange = (e: { target: HTMLInputElement }) => {
		this.setState({
			...this.state,
			[e.target.name]: e.target.value
		});
	};

	handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { email, password } = this.state;
		// Set loading to true which adds spinner
		this.setState({ loading: true });
		// Login user
		this.props.postLogin(email, password).then(() => {
			// Refresh form if authentication fails
			if (this.props.history.location.pathname === this.state.pathname)
				this.setState({ email: "", password: "", loading: false });
		});
	};

	render() {
		return (
			<div className={classes.page}>
				<Link className={classes.homeLink} to="/">
					<button>{`<<`}</button>
				</Link>
				<div className={classes.container}>
					<h1>Login</h1>
					<form className={classes.form} onSubmit={this.handleSubmit}>
						<label>
							<span>Email:</span>
							<input
								type="email"
								name="email"
								value={this.state.email}
								onChange={this.handleChange}
								required
							/>
						</label>

						<label>
							<span>Password:</span>
							<input
								type="password"
								name="password"
								value={this.state.password}
								onChange={this.handleChange}
								minLength={6}
								required
							/>
						</label>
						{this.state.loading ? (
							<div className={classes.spinner}>
								<Spinner />
							</div>
						) : (
							<>
								<button
									className={classes.registerBtn}
									onClick={() => this.props.history.push("/register")}>
									Sign Up{" "}
								</button>
								<button className={classes.loginBtn}>Login</button>

								<Link className={classes.link} to="/forgotpassword">
									Forgot your password?
								</Link>
							</>
						)}
					</form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth
});

export default connect(mapStateToProps, { postLogin })(Login);
