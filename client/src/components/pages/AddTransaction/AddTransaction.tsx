import React, { Component } from "react";
import DatePicker from "react-date-picker";
import { connect } from "react-redux";
import { addTransaction } from "../../../actions";
import classes from "./AddTransaction.module.scss";
import { StoreState } from "../../../reducers";
import Spinner from "../../utils/Spinner/Spinner";
import { RouteComponentProps } from "react-router";

// Get budget based on budgetIndex option and then onChange retrieve data from budget state store
// Set state of budget and set loading to false to stop spinner
// Select will be the name of the budget from budgetStore array
// budgetIndex value by default will be the first in the array eg. this.props.budgets[0].name

interface Params {
	budgetId: string;
}

interface Props extends StoreState, RouteComponentProps<Params> {
	addTransaction: (budgetId: string, form: AddTransactionForm) => Promise<void>;
}

export interface AddTransactionForm {
	desc: string;
	categoryIndex: number;
	amount: number;
	date: Date | Date[];
}

interface State extends AddTransactionForm {
	budgetIndex: number;
	min: number;
	max: number;
	loading: boolean;
}
class AddTransaction extends Component<Props, State> {
	// Initial state
	state = {
		budgetIndex: 0,
		desc: "",
		categoryIndex: 0,
		amount: 0,
		min: 0,
		max: Infinity,
		date: new Date(),
		loading: false
	};

	componentDidMount() {
		// If params were provided
		if (this.props.match.params.budgetId) {
			const budgetId = this.props.match.params.budgetId;
			// Find index -- expected to be small group (1-5)
			const i = this.props.budgets.findIndex(b => b._id === budgetId);
			this.setState({
				budgetIndex: i,
				categoryIndex: 0
			});
		}
	}

	handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		this.setState({ loading: true });
		const { budgetIndex, desc, categoryIndex, amount, date } = this.state;
		const budget = this.props.budgets[budgetIndex];
		if (budget._id)
			this.props
				.addTransaction(budget._id, { desc, categoryIndex, amount, date })
				.then(() => {
					// Reset form and stop loading
					this.setState({
						loading: false,
						desc: "",
						categoryIndex: 0,
						amount: 0,
						min: 0,
						max: Infinity,
						date: new Date()
					});
				});
		else this.setState({ loading: false });
	};

	handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
		let amount = this.state.amount;
		if (!amount) amount = 1;
		if (e.target.value === "expense" && amount > 0) {
			amount *= -1;
			this.setState({ max: 0, min: -Infinity, amount });
		} else if (amount < 0 && e.target.value === "income") {
			amount *= -1;
			this.setState({ max: Infinity, min: 0 });
		} else {
			// Initially negative value but changed type to expense
			this.setState({ max: 0, min: -Infinity, amount });
		}

		this.setState({ amount });
	};

	handleBudgetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const budgetIndex = parseInt(e.target.value, 10);
		this.setState({
			budgetIndex,
			categoryIndex: 0
		});
	};

	render() {
		return (
			<div className={classes.container}>
				{this.state.loading ? (
					<Spinner />
				) : (
					<>
						<h1 className={classes.title}>Add new transaction</h1>
						<form className={classes.form} onSubmit={this.handleSubmit}>
							<label>
								<span>Select Budget: </span>
								<select
									autoFocus
									name="Budgets"
									value={this.state.budgetIndex}
									onChange={this.handleBudgetChange}>
									{this.props.budgets.map((b, i) => {
										return (
											<option key={i} value={i}>
												{b.name}
											</option>
										);
									})}
								</select>
							</label>
							<label className={classes.desc}>
								<span>Description:</span>
								<input
									type="text"
									maxLength={50}
									onChange={e => this.setState({ desc: e.target.value })}
									value={this.state.desc}
								/>
							</label>
							<label className={classes.categoryIndex}>
								<span>Category:</span>
								<select
									autoFocus
									name="categoryIndex"
									// Add value here later
									onChange={e =>
										this.setState({
											categoryIndex: parseInt(e.target.value, 10)
										})
									}
									value={this.state.categoryIndex}>
									{this.props.budgets[this.state.budgetIndex].categories.map(
										(c, i) => {
											return (
												<option key={i} value={i}>
													{c}
												</option>
											);
										}
									)}
								</select>
							</label>
							<label className={classes.date}>
								<span className={classes.dateLabel}>Date: </span>
								<DatePicker
									onChange={date => this.setState({ date })}
									value={this.state.date}
									format="dd/MM/y"
								/>
							</label>
							<label className={classes.amount}>
								<span>Amount $:</span>
								{/**Need to include a select for expense or income */}

								<input
									className={
										this.state.amount < 0
											? classes.inputNumberExp
											: classes.inputNumberInc
									}
									type="number"
									maxLength={20}
									onChange={e => {
										let amount = parseFloat(e.target.value);
										if (amount > 0 && this.state.min < 0) amount *= -1;
										this.setState({ amount });
									}}
									value={this.state.amount === 0 ? "" : this.state.amount}
									min={this.state.min}
									max={this.state.max}
									// pattern="^\d+(?:\.\d{1,2})?$"
									// step=".01"
								/>
							</label>
							<div className={classes.type}>
								<label>
									<input
										type="radio"
										name="amountType"
										value="income"
										checked={this.state.amount >= 0 ? true : false}
										onChange={e => this.handleChangeType(e)}
									/>
									<span>Income +</span>
								</label>
								<label>
									<input
										type="radio"
										name="amountType"
										value="expense"
										onChange={e => this.handleChangeType(e)}
										checked={this.state.amount < 0 ? true : false}
									/>
									<span>Expense - </span>
								</label>
							</div>

							<input type="submit" value="Submit" />
						</form>
					</>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	budgets: state.budgets
});

export default connect(
	mapStateToProps,
	{ addTransaction }
)(AddTransaction);
