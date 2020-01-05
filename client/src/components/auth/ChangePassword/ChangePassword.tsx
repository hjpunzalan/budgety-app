import React, { Component } from "react";
import { connect } from "react-redux";
import { RouterProps } from "react-router";
import classes from "./ChangePassword.module.scss";
import { changePassword } from "../../../actions";
import Spinner from "../../utils/Spinner/Spinner";
import { StoreState } from "../../../reducers";

interface Props extends StoreState, RouterProps {
	changePassword: (form: ChangePassForm) => Promise<void>;
}

export interface ChangePassForm {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}
interface State extends ChangePassForm {
	loading: boolean;
}

class ChangePassword extends Component<Props, State> {
	state = {
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
		loading: false
	};

	handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		this.setState({ loading: true });

		const { currentPassword, newPassword, confirmPassword } = this.state;
		this.props
			.changePassword({
				currentPassword,
				newPassword,
				confirmPassword
			})
			.then(() => {
				// If error
				this.setState({
					currentPassword: "",
					newPassword: "",
					confirmPassword: "",
					loading: false
				});
			});
	};

	render() {
		return (
			<div className={classes.container}>
				<h1 className={classes.title}>Change Your Password</h1>
				<form className={classes.form} onSubmit={this.handleSubmit}>
					<label>
						<span>Current Password</span>
						<input
							type="password"
							name="currentPassword"
							value={this.state.currentPassword}
							onChange={e => this.setState({ currentPassword: e.target.value })}
							minLength={6}
							required
						/>
					</label>
					<label>
						<span>New Password</span>
						<input
							type="password"
							name="newPassword"
							value={this.state.newPassword}
							onChange={e => this.setState({ newPassword: e.target.value })}
							minLength={6}
							required
						/>
					</label>
					<label>
						<span>Confirm New Password</span>
						<input
							type="password"
							name="confirmPassword"
							value={this.state.confirmPassword}
							onChange={e => this.setState({ confirmPassword: e.target.value })}
							minLength={6}
							required
						/>
					</label>
					{this.state.loading ? (
						<div className={classes.spinner}>
							<Spinner />
						</div>
					) : (
						<input type="submit" value="Change Password" />
					)}
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ changePassword }
)(ChangePassword);
