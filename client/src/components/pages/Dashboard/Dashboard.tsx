import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import moment from "moment";
import classes from "./Dashboard.module.scss";
import { StoreState } from "../../../reducers";
import {
	getTransactions,
	getBudget,
	getAllBudget,
	setAlert,
	AlertType
} from "../../../actions";
import Spinner from "../../utils/Spinner/Spinner";
import { checkAmount } from "../../utils/CheckAmount";
import { Link } from "react-router-dom";

interface Params {
	budgetId: string;
}
interface Props extends StoreState, RouteComponentProps<Params> {
	getTransactions: (budgetId: string) => Promise<void>;
	setAlert: (msg: string, alertType: AlertType) => void;
	getBudget: (budgetId: string) => Promise<void>;
	getAllBudget: () => Promise<void>;
}

enum Nav {
	transactions,
	graph
}

interface State {
	loading: boolean;
	nav: Nav;
}

class Dashboard extends Component<Props, State> {
	state = {
		loading: true,
		nav: Nav.transactions
	};

	componentDidUpdate(prevProps: Props) {
		if (this.props.location !== prevProps.location) {
			// set initial state
			this.setState({ loading: true, nav: Nav.transactions });
			const budgetId = this.props.match.params.budgetId;
			this.props.getBudget(budgetId).then(() => {
				// Load transactions
				this.props.getTransactions(budgetId).then(() => {
					this.setState({
						loading: false
					});
				});
			});
		}
	}

	componentDidMount() {
		// Load budgets first
		// If default
		if (this.props.budgets.length === 0) {
			this.props.getAllBudget().then(() => {
				// To be removed after dev
				if (this.props.auth.currentUser)
					if (this.props.budgets[0]._id) {
						const firstBudgetId = this.props.budgets[0]._id;
						// Load first budget
						this.props.getBudget(firstBudgetId).then(() => {
							// Load transactions
							this.props.getTransactions(firstBudgetId).then(() => {
								this.setState({
									loading: false
								});
							});
						});
					} else this.props.history.push(this.props.match.url + "/budget/new");
			});
		} else {
			const budgetId = this.props.match.params.budgetId;
			this.props.getBudget(budgetId).then(() => {
				// Load transactions
				this.props.getTransactions(budgetId).then(() => {
					this.setState({
						loading: false
					});
				});
			});
		}
	}

	render() {
		const budget = this.props.currentBudget;
		const transactions = this.props.transactions;

		return budget && !this.state.loading ? (
			<div className={classes.container}>
				<div className={classes.budget}>
					<h2 className={classes.budgetName}>Budget: {budget.name}</h2>

					<div className={classes.budgetBalance}>
						<h3>Balance: {checkAmount(budget.balance)}</h3>
						<span>Starting Balance: {checkAmount(budget.startingBalance)}</span>
					</div>
				</div>
				{transactions.length > 0 ? (
					<>
						<div className={classes.nav}>
							<span
								className={
									this.state.nav === Nav.transactions ? classes.navSelected : ""
								}
								onClick={e => this.setState({ nav: Nav.transactions })}>
								Transactions
							</span>
							<span> | </span>
							<span
								className={
									this.state.nav === Nav.graph ? classes.navSelected : ""
								}
								onClick={e => this.setState({ nav: Nav.graph })}>
								Graph
							</span>
						</div>
						{/**Only show transactions here */}
						{this.state.nav === Nav.transactions ? (
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
						) : (
							<div></div>
						)}
					</>
				) : (
					<div className={classes.addTransactions}>
						<span>No transactions listed.</span>
						<Link to={`/user/transactions/new/${budget._id}`}>
							Add one now!
						</Link>
					</div>
				)}
			</div>
		) : (
			<div className={classes.container}>
				<Spinner />
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
	{ getTransactions, setAlert, getBudget, getAllBudget }
)(Dashboard);
