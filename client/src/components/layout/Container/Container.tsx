import React, { Component } from "react";
import { GoDiffAdded, GoPerson } from "react-icons/go";
import { FaKey, FaHome } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { Link, Route } from "react-router-dom";
import { RouteComponentProps, Switch } from "react-router";
import { connect } from "react-redux";
import classes from "./Container.module.scss";
import { getLogout } from "../../../actions";
import transactionIcon from "../../../images/transaction.png";
import { StoreState } from "../../../reducers";
import AddBudget from "../../pages/AddBudget/AddBudget";
import EditBudget from "../../pages/EditBudget/EditBudget";
import AddTransaction from "../../pages/AddTransaction/AddTransaction";
import UpdateMe from "../../pages/UpdateMe/UpdateMe";
import ChangePassword from "../../auth/ChangePassword/ChangePassword";
import Budget from "../Budget/Budget";
import EditTransaction from "../../pages/EditTransaction/EditTransaction";
import MobileNav from "../MobileNav/MobileNav";

interface Props extends StoreState, RouteComponentProps {
	getLogout: () => Promise<void>;
}
interface State {
	loading: boolean;
	selected: number;
}

class Container extends Component<Props, State> {
	// Add selected state so the selected budget becomes highlighted
	// Change budget id for edit based on selected budget
	// Maybe

	state = {
		loading: true,
		selected: 0
	};

	stopLoading = () => {
		this.setState({ loading: false });
	};

	selectBudget = (budgetIndex: number) => {
		this.setState({ selected: budgetIndex });
	};

	handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const budgetIndex = parseInt(e.target.value, 10);
		this.selectBudget(budgetIndex);
		const budgetId = this.props.budgets[budgetIndex]._id;
		this.props.history.push(this.props.match.url + `/budget/${budgetId}`);
	};

	mobileSelectBudget = () => {
		const budgetId = this.props.budgets[this.state.selected]._id;
		this.props.history.push(this.props.match.url + `/budget/${budgetId}`);
	};

	render() {
		return (
			<div className={classes.page}>
				<MobileNav
					currentBudget={this.props.currentBudget}
					budgets={this.props.budgets}
					getLogout={this.props.getLogout}
				/>
				<button className={classes.logout} onClick={this.props.getLogout}>
					Logout
				</button>
				{this.props.budgets.length > 0 && (
					<div className={classes.mobileSelect}>
						<label>
							<button onClick={this.mobileSelectBudget}>
								<FaHome />
								Budget
							</button>{" "}
							<span>:</span>
							<select onChange={this.handleSelect} value={this.state.selected}>
								{!this.state.loading &&
									this.props.budgets.map((b, i) => {
										return (
											<option key={b._id} value={i}>
												{b.name}
											</option>
										);
									})}
							</select>
						</label>
					</div>
				)}
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
								render={props => (
									<AddBudget selectBudget={this.selectBudget} {...props} />
								)}
							/>
							<Route
								exact
								path={this.props.match.url + "/budget/edit"}
								render={props => (
									<EditBudget selectBudget={this.selectBudget} {...props} />
								)}
							/>
							<Route
								exact
								path={this.props.match.url + "/transactions/new"}
								component={AddTransaction}
							/>
							<Route
								exact
								path={this.props.match.url + "/transactions/new/:budgetId"}
								component={AddTransaction}
							/>
							<Route
								exact
								path={
									this.props.match.url +
									"/transactions/:budgetId/edit/:transactionId"
								}
								component={EditTransaction}
							/>
							<Route
								exact
								path={this.props.match.url + "/budget/:budgetId"}
								render={props => (
									<Budget stopLoading={this.stopLoading} {...props} />
								)}
							/>
							<Route
								exact
								path={this.props.match.url}
								render={props => (
									<Budget stopLoading={this.stopLoading} {...props} />
								)}
							/>
						</Switch>
					</div>

					{/* NAVIGATION - cant be placed as of yet to its own component because of the styling */}
					<button
						className={classes.add}
						onClick={() =>
							this.props.currentBudget._id &&
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
							{!this.state.loading &&
								(this.props.budgets.length > 0 ? (
									this.props.budgets.map((b, i) => {
										return (
											<Link
												key={b._id}
												to={this.props.match.url + `/budget/${b._id}`}
												onClick={() => this.selectBudget(i)}>
												<li
													className={
														this.state.selected === i &&
														this.props.budgets.length > 1
															? classes.selected
															: ""
													}>
													{b.name}
												</li>
											</Link>
										);
									})
								) : (
									<Link
										key={"nobudget"}
										to={this.props.match.url + `/budget/new`}>
										<li>
											<i>No budgets listed....</i>
										</li>
									</Link>
								))}
						</ul>
						<div className={classes.budgetActions}>
							<Link
								to={this.props.match.url + "/budget/new"}
								className={classes.budgetActionAdd}>
								<GoDiffAdded />
								Add
							</Link>
							{this.props.budgets.length > 0 && (
								<Link
									to={this.props.match.url + "/budget/edit"}
									className={classes.budgetActionEdit}>
									<FaRegEdit />
									Edit
								</Link>
							)}
						</div>
					</div>

					<div className={classes.userActions}>
						<h3>User Actions</h3>
						<ul>
							<Link to="/user/update">
								<li>
									<GoPerson />
									Update user details
								</li>
							</Link>
							<Link to="/user/changepassword">
								<li>
									<FaKey />
									Change password
								</li>
							</Link>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
	budgets: state.budgets,
	currentBudget: state.currentBudget
});

export default connect(mapStateToProps, { getLogout })(Container);
