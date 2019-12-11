import React, { Component } from "react";
import classes from "./Budget.module.scss";

interface Props {}
interface State {}

class Budget extends Component<Props, State> {
	state = {};

	render() {
		return (
			<div className={classes.container}>
				<table>
					<tr>
						<th>Date</th>
						<th>Description</th>
						<th>Category</th>
						<th>Amount</th>
					</tr>
				</table>
			</div>
		);
	}
}

export default Budget;
