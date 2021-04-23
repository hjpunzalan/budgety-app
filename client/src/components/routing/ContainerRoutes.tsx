/* 
This component is used to extend path name instead of creating an entirely new one
It is required to be nested under an existend component under the main Switch Router.
*/

import React, { Component } from 'react'
import { Route, match } from "react-router-dom";
import { Switch, Redirect } from "react-router";

// Routes
import AddBudget from "../pages/AddBudget/AddBudget";
import EditBudget from "../pages/EditBudget/EditBudget";
import AddTransaction from "../pages/AddTransaction/AddTransaction";
import UpdateMe from "../pages/UpdateMe/UpdateMe";
import ChangePassword from "../auth/ChangePassword/ChangePassword";
import Budget from "../layout/Budget/Budget";
import EditTransaction from "../pages/EditTransaction/EditTransaction";

interface Props {
    selectBudget: (budgetIndex: number) => void;
    stopLoading: () => void;
    match: match;
}


export default class ContainerRoutes extends Component<Props> {

    render() {
        return (

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
                    render={props => (
                        <AddBudget selectBudget={this.props.selectBudget} {...props} />
                    )}
                />
                <Route
                    exact
                    path={this.props.match.path + "/budget/edit"}
                    render={props => (
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
                    render={props => (
                        <Budget stopLoading={this.props.stopLoading} {...props} />
                    )}
                />
                <Route
                    exact
                    path={this.props.match.path}
                    render={props => (
                        <Budget stopLoading={this.props.stopLoading} {...props} />
                    )}
                />
                <Redirect to="/user" />
            </Switch>
        )
    }
}
