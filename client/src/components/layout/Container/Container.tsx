import React, { Component } from "react";
import { GoDiffAdded, GoPerson } from "react-icons/go";
import { FaKey } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";
import { RouteComponentProps, Switch } from "react-router";
import classes from "./Container.module.scss";
import { getLogout, getAllBudget } from "../../../actions";
import transactionIcon from "../../../images/transaction.png";
import { StoreState } from "../../../reducers";
import AddBudget from "../../pages/AddBudget/AddBudget";
import EditBudget from "../../pages/EditBudget/EditBudget";
import AddTransaction from "../../pages/AddTransaction/AddTransaction";
import UpdateMe from "../../pages/UpdateMe/UpdateMe";
import ChangePassword from "../../auth/ChangePassword/ChangePassword";

interface Props extends StoreState, RouteComponentProps {
	getLogout: () => Promise<void>;
	getAllBudget: () => Promise<void>;
}
interface State {}

class Container extends Component<Props, State> {
	// Add selected state so the selected budget becomes highlighted
	state = {};

	componentDidMount() {
		this.props.getAllBudget();
	}

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
								path={this.props.match.url + "/update"}
								component={UpdateMe}
							/>
							<Route
								exact
								path={this.props.match.url + "/changepassword"}
								component={ChangePassword}
							/>
							<Route
								exact
								path={this.props.match.url + "/budget/new"}
								component={AddBudget}
							/>
							<Route
								exact
								path={this.props.match.url + "/budget/edit/:budgetId"}
								component={EditBudget}
							/>
							<Route
								exact
								path={this.props.match.url + "/transactions/new"}
								component={AddTransaction}
							/>
						</Switch>
					</div>

					{/* NAVIGATION - cant be placed as of yet to its own component because of the styling */}
					<button
						className={classes.add}
						onClick={() =>
							this.props.history.push(
								this.props.match.url + "/transactions/new"
							)
						}>
						<img src={transactionIcon} alt="Transaction icon" />
						<span>Add Transaction</span>
					</button>
					<div className={classes.budgets}>
						<h3>Budgets</h3>
						<ul>
							{this.props.budget.map(b => {
								return <li key={b._id}>{b.name}</li>;
							})}
						</ul>
						<div className={classes.budgetActions}>
							<Link
								to={this.props.match.url + "/budget/new"}
								className={classes.budgetActionAdd}>
								<GoDiffAdded />
								Add
							</Link>
							<Link
								to={this.props.match.url + "/budget/edit/test"}
								className={classes.budgetActionEdit}>
								<FaRegEdit />
								Edit
							</Link>
						</div>
					</div>

					<div className={classes.userActions}>
						<h3>User Actions</h3>
						<ul>
							<li>
								<Link to="/user/update">
									<GoPerson />
									Update user details
								</Link>
							</li>
							<li>
								<Link to="/user/changepassword">
									<FaKey />
									Change password
								</Link>
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
	{ getLogout, getAllBudget }
)(Container);
