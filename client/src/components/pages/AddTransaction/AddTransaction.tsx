import React, { Component } from "react";
import DatePicker from "react-date-picker";
import { connect } from "react-redux";
import { addTransaction } from "../../../actions";
import classes from "./AddTransaction.module.scss";
import { StoreState } from "../../../reducers";
import Spinner from "../../utils/Spinner/Spinner";

// Get budget based on selected option and then onChange retrieve data from budget state store
// Set state of budget and set loading to false to stop spinner
// Select will be the name of the budget from budgetStore array
// Selected value by default will be the first in the array eg. this.props.budgets[0].name

interface Props extends StoreState {
	addTransaction: (budgetId: string, form: AddTransactionForm) => Promise<void>;
}

export interface AddTransactionForm {
	desc: string;
	category: string;
	amount: number;
	date: Date | Date[];
}

interface State extends AddTransactionForm {
	selected: number;
	min: number;
	max: number;
	loading: boolean;
}
class AddTransaction extends Component<Props, State> {
	// Initial state
	state = {
		selected: 0,
		desc: "",
		category: this.props.budget[0].categories[0],
		amount: 0,
		min: 0,
		max: Infinity,
		date: new Date(),
		loading: false
	};

	handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		this.setState({ loading: true });
		const { selected, desc, category, amount, date } = this.state;
		const budget = this.props.budget[selected];
		if (budget._id)
			this.props
				.addTransaction(budget._id, { desc, category, amount, date })
				.then(() => {
					// Reset form and stop loading
					this.setState({
						loading: false,
						desc: "",
						category: this.props.budget[selected].categories[0],
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
		} else {
			if (amount < 0) amount *= -1;
			this.setState({ max: Infinity, min: 0 });
		}

		this.setState({ amount });
	};

	handleBudgetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selected = parseInt(e.target.value, 10);
		this.setState({
			selected,
			category: this.props.budget[selected].categories[0]
		});
	};

	handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selected = this.state.selected;
		const i = parseInt(e.target.value, 10);
		this.setState({ category: this.props.budget[selected].categories[i] });
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
									// Add value here later
									onChange={this.handleBudgetChange}>
									{this.props.budget.map((b, i) => {
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
							<label className={classes.category}>
								<span>Category:</span>
								<select
									autoFocus
									name="Budgets"
									// Add value here later
									onChange={this.handleCategoryChange}>
									{this.props.budget[this.state.selected].categories.map(
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
										this.state.max === 0
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
								/>
							</label>
							<div className={classes.type}>
								<label>
									<input
										type="radio"
										name="amountType"
										value="income"
										defaultChecked={this.state.amount >= 0 ? true : false}
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
										defaultChecked={this.state.amount >= 0 ? false : true}
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
	budget: state.budget
});

export default connect(
	mapStateToProps,
	{ addTransaction }
)(AddTransaction);
