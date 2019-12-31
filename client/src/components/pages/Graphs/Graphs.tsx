import React, { Component } from "react";
import { connect } from "react-redux";
import { getStats, getCategoryData, getDates } from "../../../actions";
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
		year: number,
		month?: number
	) => Promise<void>;
	getDates: (budgetId: string) => Promise<void>;
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
		month: 0
	};

	async getData(budgetId: string, year: number) {
		await this.props.getStats(budgetId, year);
		await this.props.getCategoryData(budgetId, year);
		await this.props.getDates(budgetId);
	}

	componentDidMount() {
		const { budgetId } = this.props;
		const { year } = this.state;
		// Initialise store state
		this.getData(budgetId, year).then(() => {
			this.setState({ loading: false });
		});
	}

	handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { budgetId } = this.props;
		const year = parseInt(e.target.value, 10);
		this.setState({ year, loading: true });
		this.getData(budgetId, year).then(() => {
			this.setState({ loading: false });
		});
	};

	changeMonth = (month: number) => {
		const { budgetId } = this.props;
		const { year } = this.state;
		this.props.getCategoryData(budgetId, year, month).then(() => {
			this.setState({ month });
		});
	};

	render() {
		const years = this.props.charts.dates.map(date => date._id.year);
		return this.state.loading ? (
			<Spinner />
		) : (
			<div className={classes.container}>
				<div className={classes.barGraphHeading}>
					<label>
						<h2>Annual data for </h2>
						<select
							autoFocus
							name="Budgets"
							value={this.state.year}
							onChange={this.handleYearChange}>
							{years.map(y => (
								<option key={y} value={y}>
									{y}
								</option>
							))}
						</select>
					</label>
				</div>
				<span className={classes.barGraphTip}>
					Click graph to see category data by month
				</span>
				<BarGraph
					barGraph={this.props.charts.barGraph}
					changeMonth={this.changeMonth}
				/>
				<div className={classes.pieGraphGroup}>
					<h2>
						Amount by category for&nbsp;
						{this.state.month > 0
							? moment(this.state.month, "MM").format("MMMM")
							: this.state.year}
					</h2>
					<div className={classes.pieGraph}>
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

					<button onClick={() => this.changeMonth(0)}>
						Get the annual category data
					</button>
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
	{ getStats, getCategoryData, getDates }
)(Graphs);
