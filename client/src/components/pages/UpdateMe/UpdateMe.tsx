import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom"
import { StoreState } from "../../../reducers";
import { updateUser } from "../../../actions";
import classes from "./UpdateMe.module.scss";
import Spinner from "../../utils/Spinner/Spinner";

interface Props extends StoreState {
	updateUser: (form: UpdateMeForm) => Promise<void>;
}
export interface UpdateMeForm {
	firstName?: string;
	lastName?: string;
	email?: string;
}

interface State extends UpdateMeForm {
	loading: boolean;
}

class UpdateMe extends Component<Props, State> {
	state = {
		firstName: this.props.auth.currentUser
			? this.props.auth.currentUser.firstName
			: "",
		lastName: this.props.auth.currentUser
			? this.props.auth.currentUser.lastName
			: "",
		email: this.props.auth.currentUser ? this.props.auth.currentUser.email : "",
		loading: false
	};

	handleCancel = () => {
		this.setState({ firstName: "", lastName: "", email: "" });
	};

	handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { firstName, lastName, email } = this.state;
		this.setState({ loading: true });
		this.props.updateUser({ firstName, lastName, email }).then(() => {
			this.setState({ loading: false });
		});
	};

	render() {
		const { firstName, lastName, email } = this.state;
		return (
			<div className={classes.container}>
				<h1 className={classes.title}>Update your details</h1>
				<form className={classes.form} onSubmit={this.handleSubmit}>
					<label>
						<span>First Name:</span>
						<input
							type="text"
							placeholder="Enter first name"
							name="firstName"
							value={firstName}
							onChange={e => this.setState({ firstName: e.target.value })}
							required
						/>
					</label>
					<label>
						<span>Last Name:</span>
						<input
							type="text"
							placeholder="Enter last name"
							name="lastName"
							value={lastName}
							onChange={e => this.setState({ lastName: e.target.value })}
							required
						/>
					</label>
					<label>
						<span>Email:</span>
						<input
							type="email"
							placeholder="Enter Email"
							name="email"
							value={email}
							onChange={e => this.setState({ email: e.target.value })}
							required
						/>
					</label>
					<Link className={classes.changePassword} to="/user/changepassword">
						Change Password
					</Link>
					{this.state.loading ? (
						<div className={classes.spinner}>
							<Spinner />
						</div>
					) : (
						<>
							<button className={classes.btnCancel} onClick={this.handleCancel}>
								Clear
							</button>
							<input type="submit" className="btn btn__submit" value="Update" />
						</>
					)}
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth
});

export default connect(mapStateToProps, { updateUser })(UpdateMe);
