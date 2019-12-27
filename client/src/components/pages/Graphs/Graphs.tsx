import React, { Component } from "react";
import { connect } from "react-redux";
import { getStats, getCategoryData } from "../../../actions";
import { StoreState } from "../../../reducers";
import BarGraph from "../BarGraph/BarGraph";
import PieGraph, { PieGraphType } from "../PieGraph/PieGraph";
import classes from "./Graphs.module.scss";
import Spinner from "../../utils/Spinner/Spinner";
import moment from "moment";

interface Props extends StoreState {
	budgetId: string;
	getStats: (budgetId: string, year: number) => Promise<void>;
	getCategoryData: (
		budgetId: string,
		month: number,
		year: number
	) => Promise<void>;
}
interface State {
	loading: boolean;
	year: number;
	month: number;
}

class Graphs extends Component<Props, State> {
	state = {
		loading: true,
		//Initial state is based on latest transaction
		year: parseInt(
			moment
				.utc(this.props.transactions[0].transactions[0].date)
				.format("YYYY"),
			10
		),
		month: parseInt(
			moment.utc(this.props.transactions[0].transactions[0].date).format("MM"),
			10
		)
	};

	componentDidMount() {
		const { budgetId } = this.props;
		const { month, year } = this.state;
		const getData = async () => {
			await this.props.getStats(budgetId, year);
			await this.props.getCategoryData(budgetId, month, year);
		};
		// Initialise store state
		getData().then(() => {
			this.setState({ loading: false });
		});
	}

	render() {
		// Need a list of years
		// One way is to have oldest and newest date
		// Another way is add another route handler for retrieving an aggregate of years!
		// Add a select element which changes state of year
		// Do the same for the month
		// Add edit option for all transactions
		// Add search function
		return this.state.loading ? (
			<Spinner />
		) : (
			<div className={classes.container}>
				<div className={classes.barGraphHeading}>
					<h2>Annual data</h2>
                    <select>
                    {</select>
				</div>
				<BarGraph barGraph={this.props.charts.barGraph} />

				<div className={classes.pieGraphs}>
					<PieGraph
						type={PieGraphType.income}
						budgets={this.props.budgets}
						pieGraph={this.props.charts.pieGraph}
						budgetId={this.props.budgetId}
					/>
					<PieGraph
						type={PieGraphType.expense}
						budgets={this.props.budgets}
						pieGraph={this.props.charts.pieGraph}
						budgetId={this.props.budgetId}
					/>
				</div>
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
	{ getStats, getCategoryData }
)(Graphs);
