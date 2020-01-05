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
import Table from "../../pages/Table/Table";
import Graphs from "../../pages/Graphs/Graphs";

interface Params {
	budgetId: string;
}
interface Props extends StoreState, RouteComponentProps<Params> {
	getTransactions: (budgetId: string, pageNumber?: number) => Promise<void>;
	setAlert: (msg: string, alertType: AlertType) => void;
	getBudget: (budgetId: string) => Promise<void>;
	getAllBudget: () => Promise<void>;
	stopLoading: () => void;
}

enum Nav {
	transactions,
	graph
}

interface State {
	loading: boolean;
	nav: Nav;
	budgetId?: string;
}

class Dashboard extends Component<Props, State> {
	state = {
		loading: true,
		nav: Nav.transactions,
		budgetId: ""
	};

	componentDidUpdate(prevProps: Props) {
		if (this.props.location !== prevProps.location) {
			// set initial state
			this.setState({
				loading: true,
				nav: Nav.transactions,
				budgetId: this.props.match.params.budgetId
			});
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
		// If default -------------------- JUST AFTER LOGGING IN ----------------------------
		// Check if it doesn't have any params then its default just after logging in
		if (!this.props.match.params.budgetId) {
			this.props.getAllBudget().then(() => {
				// Stop loading state from Container component
				//  Mainly to let container know that budget list has loaded
				this.props.stopLoading();

				// After loading budget check if user already has budgets listed
				if (this.props.budgets.length > 0) {
					this.setState({ budgetId: this.props.budgets[0]._id });
					const budgetId = this.state.budgetId;
					// Load first budget
					this.props.getBudget(budgetId).then(() => {
						// Load transactions
						this.props.getTransactions(budgetId).then(() => {
							this.setState({
								loading: false
							});
						});
					});
				} else if (this.props.budgets.length === 0 && !this.state.budgetId)
					this.props.history.push(this.props.match.url + "/budget/new");
			});
		} else {
			// ----------------------OTHERWISE LOAD USING PARAMS--------------------
			this.setState({ budgetId: this.props.match.params.budgetId });
			const budgetId = this.props.match.params.budgetId;
			if (budgetId) {
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
								onClick={() => this.setState({ nav: Nav.transactions })}>
								Transactions
							</span>
							<span> | </span>
							<span
								className={
									this.state.nav === Nav.graph ? classes.navSelected : ""
								}
								onClick={() => this.setState({ nav: Nav.graph })}>
								Graph
							</span>
						</div>
						{/**Only show transactions here */}
						{this.state.nav === Nav.transactions ? (
							<Table
								transactions={this.props.transactions}
								currentBudget={this.props.currentBudget}
								getTransactions={this.props.getTransactions}
							/>
						) : (
							<Graphs budgetId={this.state.budgetId} />
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
	transactions: state.transactions,
	charts: state.charts
});

export default connect(
	mapStateToProps,
	{
		getTransactions,
		setAlert,
		getBudget,
		getAllBudget
	}
)(Dashboard);
