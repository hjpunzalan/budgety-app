import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { TiHomeOutline } from "react-icons/ti";
import { postForgotPassword } from "../../../actions";
import Spinner from "../../utils/Spinner/Spinner";
import classes from "./ForgotPassword.module.scss";

interface Props {
	postForgotPassword: (email: IForgotPassState, url: string) => Promise<void>;
}
export interface IForgotPassState {
	loading?: boolean;
	email: string;
}

class ForgotPassword extends Component<Props, IForgotPassState> {
	state = {
		loading: false,
		email: ""
	};

	handleChange = (e: { target: HTMLInputElement }) => {
		this.setState({
			...this.state,
			[e.target.name]: e.target.value
		});
	};

	handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Set loading to true which adds spinner
		this.setState({ loading: true });
		// Login user
		this.props
			.postForgotPassword({ email: this.state.email }, document.location.href)
			.then(() => {
				// Refresh form
				this.setState({ email: "", loading: false });
			});
	};

	render() {
		return (
			<div className={classes.page}>
				<div className={classes.nav}>
					<Link to="/">
						<button>
							<TiHomeOutline />
						</button>
					</Link>
					<Link to="/login">
						<button>Login</button>
					</Link>
				</div>

				<div className={classes.container}>
					<h1>Forgot password?</h1>
					<form className={classes.form} onSubmit={this.handleSubmit}>
						<p className={classes.desc}>
							Please enter the email address registered to your account and we
							will send you the link to reset your password.
						</p>
						<input
							type="email"
							placeholder="Enter Email"
							name="email"
							value={this.state.email}
							onChange={this.handleChange}
							required
						/>
						{this.state.loading ? (
							<div className={classes.spinner}>
								<Spinner />
							</div>
						) : (
							<input type="submit" value="Send to email" />
						)}
					</form>
				</div>
			</div>
		);
	}
}

export default connect(null, { postForgotPassword })(ForgotPassword);
