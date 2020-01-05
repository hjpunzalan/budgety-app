import React, { Component } from "react";
import StatusAlert, { StatusAlertService } from "react-status-alert";
import "react-status-alert/dist/status-alert.css";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Location } from "history";
import { connect } from "react-redux";
import { setAlert, resetAlert, Alert } from "../../actions";

// RouteComponent Allow the use of withRouter
interface Props extends RouteComponentProps {
	alerts: Alert;
	location: Location;
}
interface State {
	alertId: string;
	location: Location;
}

class Alerts extends Component<Props, State> {
	state = {
		alertId: "",
		location: this.props.location
	};

	componentDidUpdate(prevProps: Props) {
		// Remove alert everytime route changes
		if (this.props.location.pathname !== prevProps.location.pathname) {
			StatusAlertService.removeAlert(this.state.alertId);
		}

		// Add new alert whenever alert is added to the store's state
		if (this.props.alerts !== prevProps.alerts) {
			const { msg, alertType } = this.props.alerts;
			// Add custom options such as background color for each alert type
			const alertId = StatusAlertService.showAlert(msg, alertType);
			// Set new alert Id for removal
			this.setState({ alertId });
		}
	}

	render() {
		return (
			<div>
				<StatusAlert />
			</div>
		);
	}
}

export default connect(
	null,
	{
		setAlert,
		resetAlert
	}
)(withRouter(Alerts));
