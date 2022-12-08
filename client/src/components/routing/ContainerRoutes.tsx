/* 
This component is used to extend path name instead of creating an entirely new one
It is required to be nested under an existend component under the main Switch Router.
*/

import React, { Component } from "react";
import { match, Redirect, Route, Switch } from "react-router-dom";
import classes from "../layout/Container/Container.module.scss";

// Routes
import ChangePassword from "../auth/ChangePassword/ChangePassword";
import Budget from "../layout/Budget/Budget";
import AddBudget from "../pages/AddBudget/AddBudget";
import AddTransaction from "../pages/AddTransaction/AddTransaction";
import EditBudget from "../pages/EditBudget/EditBudget";
import EditTransaction from "../pages/EditTransaction/EditTransaction";
import UpdateMe from "../pages/UpdateMe/UpdateMe";

interface Props {
	selectBudget: (budgetIndex: number) => void;
	stopLoading: () => void;
	match: match;
}

class ContainerRoutes extends Component<Props> {
	render() {
		return (
			<div className={classes.routes}>
				<Switch>
					<Route
						exact
						path={this.props.match.path + "/update"}
						component={UpdateMe}
					/>
					<Route
						exact
						path={this.props.match.path + "/changepassword"}
						component={ChangePassword}
					/>
					<Route
						exact
						path={this.props.match.path + "/budget/new"}
						render={(props) => (
							<AddBudget selectBudget={this.props.selectBudget} {...props} />
						)}
					/>
					<Route
						exact
						path={this.props.match.path + "/budget/edit"}
						render={(props) => (
							<EditBudget selectBudget={this.props.selectBudget} {...props} />
						)}
					/>
					<Route
						exact
						path={this.props.match.path + "/transactions/new"}
						component={AddTransaction}
					/>
					<Route
						exact
						path={this.props.match.path + "/transactions/new/:budgetId"}
						component={AddTransaction}
					/>
					<Route
						exact
						path={
							this.props.match.path +
							"/transactions/:budgetId/edit/:transactionId"
						}
						component={EditTransaction}
					/>
					<Route
						exact
						path={this.props.match.path + "/budget/:budgetId"}
						render={(props) => (
							<Budget stopLoading={this.props.stopLoading} {...props} />
						)}
					/>
					<Route
						exact
						path={this.props.match.path}
						render={(props) => (
							<Budget stopLoading={this.props.stopLoading} {...props} />
						)}
					/>
					<Redirect to="/user" />
				</Switch>
			</div>
		);
	}
}

export default ContainerRoutes;
