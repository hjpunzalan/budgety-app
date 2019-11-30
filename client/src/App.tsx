import React, { Component } from "react";
import classes from "./App.module.scss";
import Routes from "./components/routing/Routes";
import Alerts from "./components/utils/Alerts";

class App extends Component {
	state = {};

	render() {
		return (
			<div className={classes.App}>
				<Alerts />
				<Routes />
			</div>
		);
	}
}

export default App;
