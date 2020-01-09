import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { GoDiffAdded, GoPerson } from "react-icons/go";
import { FaKey } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import classes from "./MobileNav.module.scss";
import transactionIcon from "../../../images/transaction.png";
import { IBudget } from "../../../actions";

interface Props extends RouteComponentProps {
	currentBudget: IBudget;
	budgets: IBudget[];
	getLogout: () => void;
}
interface State {}

class MobileNav extends Component<Props, State> {
	state = {};

	render() {
		return (
			<div className={classes.nav}>
				{this.props.budgets.length > 0 && (
					<button
						onClick={() =>
							this.props.currentBudget._id &&
							this.props.history.push(
								this.props.match.url + "/transactions/new"
							)
						}>
						<img src={transactionIcon} alt="Transaction icon" />
						<span>Add Transaction</span>
					</button>
				)}
				<button
					onClick={() =>
						this.props.currentBudget._id &&
						this.props.history.push(this.props.match.url + "/budget/new")
					}
					className={classes.addBudget}>
					<GoDiffAdded />
					<span>Create Budget</span>
				</button>
				<button
					onClick={() =>
						this.props.currentBudget._id &&
						this.props.history.push(this.props.match.url + "/update")
					}>
					<GoPerson />
					<span>Update Account</span>
				</button>
				<button
					onClick={() =>
						this.props.currentBudget._id &&
						this.props.history.push(this.props.match.url + "/changepassword")
					}>
					<FaKey />
					<span>Change Password</span>
				</button>
				<button onClick={this.props.getLogout}>
					<IoIosLogOut />
					<span>Logout</span>
				</button>
			</div>
		);
	}
}

export default withRouter(MobileNav);
