import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, Link } from "react-router-dom";
import { patchResetPassword } from "../../../actions";
import Spinner from "../../utils/Spinner/Spinner";
import { StoreState } from "../../../reducers";
import classes from "./ResetPassword.module.scss";
import { TiHomeOutline } from "react-icons/ti";

interface RouteParams {
	resetToken: string;
}

interface Props extends RouteComponentProps<RouteParams>, StoreState {
	patchResetPassword: (form: IResetPassState, url: string) => Promise<void>;
}

export interface IResetPassState {
	loading?: boolean;
	newPassword: string;
	confirmPassword: string;
	pathname?: string;
}

class ResetPassword extends Component<Props, IResetPassState> {
	state = {
		loading: false,
		newPassword: "",
		confirmPassword: "",
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
		// Set loading to true which adds spinner
		this.setState({ loading: true });
		// Login user
		this.props
			.patchResetPassword(
				{
					newPassword: this.state.newPassword,
					confirmPassword: this.state.confirmPassword
				},
				this.props.match.params.resetToken
			)
			.then(() => {
				// Refresh form if error received
				if (this.props.history.location.pathname === this.state.pathname)
					this.setState({
						newPassword: "",
						confirmPassword: "",
						loading: false
					});
			});
	};

	render() {
		return (
			<div className={classes.page}>
				<div className={classes.nav}>
					<Link className={classes.homeLink} to="/">
						<button>
							<TiHomeOutline />
						</button>
					</Link>
					<Link to="/login">
						<button>Login</button>
					</Link>
				</div>

				<div className={classes.container}>
					<h1>Reset password:</h1>
					<form className={classes.form} onSubmit={this.handleSubmit}>
						<p className={classes.desc}>Please enter a new password below.</p>
						<label>
							<span>Password:</span>
							<input
								type="password"
								placeholder="Enter a new Password"
								name="newPassword"
								value={this.state.newPassword}
								onChange={this.handleChange}
								minLength={6}
								autoComplete="on"
								required
							/>
						</label>
						<label>
							<span>Confirm Password:</span>
							<input
								type="password"
								placeholder="Confirm password"
								name="confirmPassword"
								value={this.state.confirmPassword}
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
								<input
									type="submit"
									className="btn btn__submit"
									value="Set new password"
								/>
								<Link className={classes.btmLink} to="/forgotpassword">
									Send another reset token?
								</Link>
							</>
						)}
					</form>
				</div>
			</div>
		);
	}
}

export default connect(null, { patchResetPassword })(ResetPassword);
