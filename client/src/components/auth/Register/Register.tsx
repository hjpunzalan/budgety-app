import React, { Component } from "react";
import { connect } from "react-redux";
import { registerUser, IUser } from "../../../actions";
import { StoreState } from "../../../reducers";
import classes from "./Register.module.scss";
import Spinner from "../../utils/Spinner/Spinner";
import { Link } from "react-router-dom";
import { TiHomeOutline } from "react-icons/ti";
import { RouteComponentProps } from "react-router";

interface Props extends StoreState, RouteComponentProps {
	registerUser: (
		form: IRegisterState,
		Props: RouteComponentProps
	) => Promise<void>;
}

export interface IRegisterState extends IUser {
	loading?: boolean;
	pathname?: string;
}

class Register extends Component<Props, IRegisterState> {
	state = {
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		loading: false,
		pathname: this.props.history.location.pathname
	};

	handleChange = (e: { target: HTMLInputElement }) => {
		this.setState({ ...this.state, [e.target.name]: e.target.value });
	};

	handleCancel = () => {
		this.setState({ firstName: "", lastName: "", email: "", password: "" });
	};

	handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		this.setState({ loading: true });
		const { firstName, lastName, email, password } = this.state;
		this.props
			.registerUser({ firstName, lastName, email, password }, { ...this.props })
			.then(() => {
				if (this.props.history.location.pathname === this.state.pathname) {
					this.setState({ loading: false });
					// If register fails invalid
					// clear password
					this.setState({ password: "" });
				}
			});
	};

	render() {
		const { firstName, lastName, email, password } = this.state;
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
					<h1>Sign Up</h1>
					<form className={classes.form} onSubmit={this.handleSubmit}>
						<label>
							<span>First Name:</span>
							<input
								type="text"
								placeholder="Enter first name"
								name="firstName"
								value={firstName}
								onChange={this.handleChange}
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
								onChange={this.handleChange}
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
								onChange={this.handleChange}
								required
							/>
						</label>
						<label>
							<span>Password:</span>
							<input
								type="password"
								placeholder="Enter Password"
								name="password"
								value={password}
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
								<input type="submit" value="Register" />
								<button onClick={this.handleCancel}>Clear</button>
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

export default connect(mapStateToProps, { registerUser })(Register);
