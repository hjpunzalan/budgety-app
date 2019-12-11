import React, { Component } from "react";
import { connect } from "react-redux";
import { checkUser } from "./actions";
import classes from "./App.module.scss";
import Routes from "./components/routing/Routes";
import Alerts from "./components/utils/Alerts";

interface Props {
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
				<Alerts />
				<Routes />
			</div>
		);
	}
}

export default connect(
	null,
	{ checkUser }
)(App);
