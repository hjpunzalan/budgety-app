import React, { Component } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
// import { checkUser } from "./actions";
import Routes from "./components/routing/Routes";
import Alerts from "./components/utils/Alerts";
import { StoreState } from "./reducers";
import Home from "./components/pages/Home/Home";

interface Props extends StoreState {
	// checkUser: () => Promise<void>;
}

class App extends Component<Props> {
	state = {};
	// componentDidMount() {
	// 	this.props.checkUser();
	// }

	render() {
		return (
			<div>
				<Alerts alerts={this.props.alerts} />
				<Route exact path="/" component={Home} />
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
	transactions: state.transactions,
	charts: state.charts
});

export default connect(
	mapStateToProps
	// { checkUser }
)(App);
