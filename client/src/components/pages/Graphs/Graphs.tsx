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
		month: number,
		year: number
	) => Promise<void>;
	getDates: (budgetId: string) => Promise<void>;
}
interface State {
	loading: boolean;
	year: number;
	month: number;
	pieGraphLoading: boolean;
}

class Graphs extends Component<Props, State> {
	state = {
		loading: true,
		pieGraphLoading: false,
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

	async getData(budgetId: string, month: number, year: number) {
		await this.props.getStats(budgetId, year);
		await this.props.getCategoryData(budgetId, month, year);
		await this.props.getDates(budgetId);
	}

	componentDidMount() {
		const { budgetId } = this.props;
		const { month, year } = this.state;
		// Initialise store state
		this.getData(budgetId, month, year).then(() => {
			this.setState({ loading: false });
		});
	}

	handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { budgetId } = this.props;
		const year = parseInt(e.target.value, 10);
		const yearData = this.props.charts.dates.filter(
			date => date._id.year === year
		)[0];
		const month = yearData.months.map(m => m)[0];
		this.setState({ year, month, loading: true });
		this.getData(budgetId, month, year).then(() => {
			this.setState({ loading: false });
		});
	};

	handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { budgetId } = this.props;
		const { year } = this.state;
		const month = parseInt(e.target.value, 10);
		this.setState({ month, pieGraphLoading: true });
		this.getData(budgetId, month, year).then(() => {
			this.setState({ pieGraphLoading: false });
		});
	};

	render() {
		const years = this.props.charts.dates.map(date => date._id.year);
		let months: number[] = [];
		if (this.props.charts.dates.length > 0) {
			const yearData = this.props.charts.dates.filter(
				date => date._id.year === this.state.year
			)[0];
			months = yearData.months.map(m => m);
		}
		return this.state.loading ? (
			<Spinner />
		) : (
			<div className={classes.container}>
				<div className={classes.barGraphHeading}>
					<label>
						<h2>Annual data</h2>
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
				<BarGraph barGraph={this.props.charts.barGraph} />
				{this.state.pieGraphLoading ? (
					<Spinner />
				) : (
					<div className={classes.pieGraphs}>
						<label>
							<h2>Annual data</h2>
							<select
								autoFocus
								name="Budgets"
								value={this.state.month}
								onChange={this.handleMonthChange}>
								{months.map(y => (
									<option key={y} value={y}>
										{y}
									</option>
								))}
							</select>
						</label>
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
				)}
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
