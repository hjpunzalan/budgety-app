import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import classes from "./Budget.module.scss";
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
import BarGraph from "../../pages/BarGraph/BarGraph";
import Table from "../../pages/Table/Table";

interface Params {
	budgetId: string;
}
interface Props extends StoreState, RouteComponentProps<Params> {
	getTransactions: (budgetId: string, pageNumber: number) => Promise<void>;
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
	pageNumber: number;
}

class Dashboard extends Component<Props, State> {
	state = {
		loading: true,
		nav: Nav.transactions,
		pageNumber: 1
	};

	componentDidUpdate(prevProps: Props) {
		if (this.props.location !== prevProps.location) {
			// set initial state
			this.setState({ loading: true, nav: Nav.transactions });
			const budgetId = this.props.match.params.budgetId;
			const pageNumber = this.state.pageNumber;
			this.props.getBudget(budgetId).then(() => {
				// Load transactions
				this.props.getTransactions(budgetId, pageNumber).then(() => {
					this.setState({
						loading: false
					});
				});
			});
		}
	}

	componentDidMount() {
		// Load budgets first
		// If default -------------------- JUST AFTER LOGGING IN ----------------------------
		const pageNumber = this.state.pageNumber;
		if (this.props.budgets.length === 0) {
			this.props.getAllBudget().then(() => {
				// To be removed after dev
				if (this.props.auth.currentUser)
					if (this.props.budgets[0]._id) {
						const firstBudgetId = this.props.budgets[0]._id;
						// Load first budget
						this.props.getBudget(firstBudgetId).then(() => {
							// Load transactions
							this.props.getTransactions(firstBudgetId, pageNumber).then(() => {
								this.setState({
									loading: false
								});
							});
						});
					} else this.props.history.push(this.props.match.url + "/budget/new");
			});
		} else {
			// ----------------------OTHERWISE LOAD USING PARAMS--------------------
			const budgetId = this.props.match.params.budgetId;
			this.props.getBudget(budgetId).then(() => {
				// Load transactions
				this.props.getTransactions(budgetId, pageNumber).then(() => {
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
							<Table
								transactions={this.props.transactions}
								currentBudget={this.props.currentBudget}
							/>
						) : (
							<BarGraph transactions={this.props.transactions} />
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
