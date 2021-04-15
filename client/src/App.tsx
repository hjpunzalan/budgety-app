import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, withRouter, RouteComponentProps } from "react-router-dom";
import { checkUser } from "./actions";
import Routes from "./components/routing/Routes";
import Alerts from "./components/utils/Alerts";
import { StoreState } from "./reducers";
import Home from "./components/pages/Home/Home";

interface Props extends StoreState, RouteComponentProps {
	checkUser: () => Promise<void>;
}

interface State {
	checked: boolean;
}

class App extends Component<Props, State> {
	state = { checked: false };
	componentDidMount() {
		this.props.checkUser().then(() => {
			if (this.props.auth.isAuthenticated)
				this.props.history.push("/user"); // push straight to user to get current budget etc.
			this.setState({ checked: true });
		});
	}

	render() {
		return (
			this.state.checked && (
				<div>
					<Alerts alerts={this.props.alerts} />
					<Route exact path="/" component={Home} />
					<Routes auth={this.props.auth} />
				</div>
			)
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
	mapStateToProps,
	{ checkUser }
)(withRouter(App));
