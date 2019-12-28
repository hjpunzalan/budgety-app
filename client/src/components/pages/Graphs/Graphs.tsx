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
		this.setState({ month });
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

				<PieGraphGroup
					month={this.state.month}
					year={this.state.year}
					months={months}
					budgetId={this.props.budgetId}
					getCategoryData={this.props.getCategoryData}
					changeMonth={this.changeMonth}>
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
				</PieGraphGroup>
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

interface PieGroupProps {
	month: number;
	year: number;
	months: number[];
	budgetId: string;
	getCategoryData: (
		budgetId: string,
		year: number,
		month?: number
	) => Promise<void>;
	changeMonth: (month: number) => void;
}
class PieGraphGroup extends Component<PieGroupProps> {
	state = {
		loading: false
	};

	handleCategoryData = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { budgetId, year } = this.props;
		this.setState({ loading: true });
		// If annual data is chosen
		if (parseInt(e.target.value, 10) === this.props.year) {
			// setState to initial state
			this.setState({ month: 0 });
			this.props.getCategoryData(budgetId, year).then(() => {
				this.setState({ loading: false });
			});
		} else {
			const month = parseInt(e.target.value, 10);
			this.props.changeMonth(month);
			this.props.getCategoryData(budgetId, year, month).then(() => {
				this.setState({ loading: false });
			});
		}
	};

	render() {
		return (
			<div className={classes.pieGraphs}>
				<label>
					<h2>Category data</h2>
					<select
						autoFocus
						name="Budgets"
						value={this.props.month === 0 ? this.props.year : this.props.month}
						onChange={this.handleCategoryData}>
						<option key={this.props.year} value={this.props.year}>
							Annual
						</option>
						{this.props.months.map(y => (
							<option key={y} value={y}>
								{moment(y, "MM").format("MMMM")}
							</option>
						))}
					</select>
				</label>
				{this.state.loading ? <Spinner /> : this.props.children}
			</div>
		);
	}
}
