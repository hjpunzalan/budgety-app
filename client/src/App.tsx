import React, { Component } from "react";
import { connect } from "react-redux";
import { checkUser } from "./actions";
import classes from "./App.module.scss";
import Routes from "./components/routing/Routes";
import Alerts from "./components/utils/Alerts";
import { StoreState } from "./reducers";

interface Props extends StoreState {
	checkUser: () => Promise<void>;
}

class App extends Component<Props> {
	state = {};
	componentDidMount() {
		this.props.checkUser();
	}

	render() {
		return (
			<div className={classes.App}>
				<Alerts alerts={this.props.alerts} />
				<Routes auth={this.props.auth} />
			</div>
		);
	}
}
const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
	alerts: state.alerts,
	budgets: state.budgets,
	currentBudget: state.currentBudget,
	transactions: state.transactions
});

export default connect(
	mapStateToProps,
	{ checkUser }
)(App);
