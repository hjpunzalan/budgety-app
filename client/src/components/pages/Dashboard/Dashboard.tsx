import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import moment from "moment";
import classes from "./Dashboard.module.scss";
import { StoreState } from "../../../reducers";
import {
	getTransactions,
	getAllBudget,
	setAlert,
	AlertType
} from "../../../actions";
import Spinner from "../../utils/Spinner/Spinner";

interface Params {
	budgetId: string;
}
interface Props extends StoreState, RouteComponentProps<Params> {
	getTransactions: (budgetId: string) => Promise<void>;
	setAlert: (msg: string, alertType: AlertType) => void;
	getAllBudget: () => Promise<void>;
}
interface State {
	budgetIndex: number;
	loading: boolean;
}

class Dashboard extends Component<Props, State> {
	state = {
		budgetIndex: 0,
		loading: true
	};

	componentDidMount() {
		// Load budgets first
		this.props.getAllBudget().then(() => {
			const budgetId = this.props.match.params.budgetId;
			// Load transactions
			if (this.props.budget[0] && this.props.budget[0]._id) {
				this.props.getTransactions(
					budgetId ? budgetId : this.props.budget[0]._id
				);
				// Redirect new user with no budget in list
			} else this.props.history.push(this.props.match.url + "/budget/new");
			if (budgetId) {
				// If budget Id is in params then set budgetIndex
				const budgetIndex = this.props.budget.findIndex(
					b => b._id === budgetId
				);
				this.setState({ budgetIndex });
			}
			this.setState({ loading: false });
		});
	}

	render() {
		const { budgetIndex } = this.state;
		const budget = this.props.budget[budgetIndex];
		const transactions = this.props.transactions;
		return this.props.budget[budgetIndex] ? (
			<div className={classes.container}>
				<h2>{budget.name}</h2>
				<h3>Balance: {budget.balance}</h3>
				<table className={classes.table}>
					<tr>
						<th>Date</th>
						<th>Description</th>
						<th>Amount</th>
						<th>Category</th>
					</tr>
					<tbody>
						{transactions.map(group => {
							return (
								<>
									<tr>
										<td className={classes.groupHeading} colSpan={4}>
											{moment(group._id.month, "MM").format("MMMM")}{" "}
											{group._id.year}
										</td>
									</tr>
									{group.transactions.map(t => {
										return (
											<tr key={t._id}>
												<td>
													{moment(t.date)
														.format("DD MMM")
														.toUpperCase()}
												</td>
												<td>{t.desc}</td>
												<td>{t.amount}</td>
												<td>{budget.categories[t.categoryIndex]}</td>
											</tr>
										);
									})}
								</>
							);
						})}
					</tbody>
				</table>
			</div>
		) : (
			<Spinner />
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
	alerts: state.alerts,
	budget: state.budget,
	transactions: state.transactions
});

export default connect(
	mapStateToProps,
	{ getTransactions, setAlert, getAllBudget }
)(Dashboard);
