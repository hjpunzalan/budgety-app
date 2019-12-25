import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import classes from "./Budget.module.scss";
import { StoreState } from "../../../reducers";
import {
	getTransactions,
	getBudget,
	getAllBudget,
	getStats,
	getCategoryData,
	setAlert,
	AlertType
} from "../../../actions";
import Spinner from "../../utils/Spinner/Spinner";
import { checkAmount } from "../../utils/CheckAmount";
import { Link } from "react-router-dom";
import BarGraph from "../../pages/BarGraph/BarGraph";
import Table from "../../pages/Table/Table";
import PieGraph, { PieGraphType } from "../../pages/PieGraph/PieGraph";

interface Params {
	budgetId: string;
}
interface Props extends StoreState, RouteComponentProps<Params> {
	getTransactions: (budgetId: string, pageNumber?: number) => Promise<void>;
	setAlert: (msg: string, alertType: AlertType) => void;
	getBudget: (budgetId: string) => Promise<void>;
	getAllBudget: () => Promise<void>;
	getStats: (budgetId: string) => Promise<void>;
	getCategoryData: (
		budgetId: string,
		month: number,
		year: number
	) => Promise<void>;
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
		if (this.props.budgets.length === 0) {
			this.props.getAllBudget().then(() => {
				// To be removed after dev
				if (this.props.auth.currentUser)
					this.setState({ budgetId: this.props.budgets[0]._id });
				if (this.state.budgetId) {
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
				} else this.props.history.push(this.props.match.url + "/budget/new");
			});
		} else {
			// ----------------------OTHERWISE LOAD USING PARAMS--------------------
			this.setState({ budgetId: this.props.match.params.budgetId });
			const budgetId = this.state.budgetId;
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
							<>
								<BarGraph
									barGraph={this.props.charts.barGraph}
									getStats={this.props.getStats}
									budgetId={this.state.budgetId}
								/>
								<PieGraph
									type={PieGraphType.income}
									month={12}
									year={2019}
									budgets={this.props.budgets}
									pieGraph={this.props.charts.pieGraph}
									getCategoryData={this.props.getCategoryData}
									budgetId={this.state.budgetId}
								/>
							</>
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
		getAllBudget,
		getStats,
		getCategoryData
	}
)(Dashboard);
