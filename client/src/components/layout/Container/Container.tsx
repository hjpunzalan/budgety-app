import React, { Component } from "react";
import { GoDiffAdded } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import { RouteComponentProps, Switch } from "react-router";
import { getLogout } from "../../../actions";
import classes from "./Container.module.scss";
import transactionIcon from "../../../images/transaction.png";
import { StoreState } from "../../../reducers";
import AddBudget from "../../pages/AddBudget/AddBudget";

interface Props extends StoreState, RouteComponentProps {
	getLogout: () => Promise<void>;
}
interface State {}

class Container extends Component<Props, State> {
	state = {};

	render() {
		return (
			<div className={classes.page}>
				<button className={classes.logout} onClick={this.props.getLogout}>
					Logout
				</button>
				<div className={classes.container}>
					{/* Routes */}
					<div className={classes.routes}>
						<Switch>
							<Route
								exact
								path={this.props.match.url + "/budget/new"}
								component={AddBudget}
							/>
						</Switch>
					</div>

					{/* NAVIGATION */}
					<button className={classes.add}>
						<img src={transactionIcon} alt="Transaction icon" />
						<span>Add Transaction</span>
					</button>
					<div className={classes.budgets}>
						<h3>Budgets</h3>
						<ul>
							<li>Test Budget</li>
						</ul>
						<div className={classes.budgetActions}>
							<Link
								to={this.props.match.url + "/budget/new"}
								className={classes.budgetActionAdd}>
								<GoDiffAdded />
								Add
							</Link>
							<Link to="" className={classes.budgetActionEdit}>
								<FaRegEdit />
								Edit
							</Link>
						</div>
					</div>

					<div className={classes.userActions}>
						<h3>User Actions</h3>
						<ul>
							<li>
								<Link to="/updateme">Update user details</Link>
							</li>
							<li>
								<Link to="/changepassword">Change password</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
	budget: state.budget
});

export default connect(
	mapStateToProps,
	{ getLogout }
)(Container);
