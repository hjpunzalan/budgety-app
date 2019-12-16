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
import { checkAmount } from "../../utils/CheckAmount";

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
		return this.props.budget[budgetIndex] &&
			this.props.transactions.length > 0 ? (
			<div className={classes.container}>
				<div className={classes.budget}>
					<h2 className={classes.budgetName}>{budget.name}</h2>
					<h3 className={classes.budgetBalance}>
						Balance: {checkAmount(budget.balance)}
					</h3>
				</div>
				<table className={classes.table}>
					<thead>
						<tr className={classes.heading}>
							<th>Date</th>
							<th>Description</th>
							<th>Amount($AUD)</th>
							<th>Category</th>
							<th>Balance</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map(group => {
							return (
								<React.Fragment key={group._id.month + group._id.year}>
									<tr>
										<td className={classes.groupDate} colSpan={5}>
											{moment(group._id.month, "MM").format("MMMM")}{" "}
											{group._id.year}
										</td>
									</tr>
									{group.transactions.map((t, i) => {
										return (
											//When double clicked redirect to edit transaction page!
											<tr key={i} className={classes.transactions}>
												<td>
													{moment(t.date)
														.format("DD MMM")
														.toUpperCase()}
												</td>
												<td>{t.desc}</td>
												<td>{checkAmount(t.amount)}</td>
												<td>{budget.categories[t.categoryIndex]}</td>
												<td>{checkAmount(t.balance)}</td>
											</tr>
										);
									})}
								</React.Fragment>
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
