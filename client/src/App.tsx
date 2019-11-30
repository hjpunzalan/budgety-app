import React, { Component } from "react";
import classes from "./App.module.scss";
import Navbar from "./components/layout/Navbar";
import Routes from "./components/routing/Routes";
import Alerts from "./components/utils/Alerts";

class App extends Component {
	state = {};

	render() {
		return (
			<div>
				<Alerts />
				<div className={classes.App}>
					<div className={classes.navbar}>
						<Navbar />
					</div>
					<div className={classes.container}>
						<Routes />
					</div>
				</div>
			</div>
		);
	}
}

export default App;
