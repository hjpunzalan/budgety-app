import React, { Component } from "react";
import DatePicker from "react-date-picker";
import classes from "./AddTransaction.module.scss";

// Get budget based on selected option and then onChange retrieve data from budget state store
// Set state of budget and set loading to false to stop spinner
// Select will be the name of the budget from budgetStore array
// Selected value by default will be the first in the array eg. this.props.budgets[0].name

interface Props {}
interface State {
	selected: string;
	desc: string;
	category: string;
	amount?: number;
	min: number;
	max: number;
	date: Date | Date[];
}
class AddTransaction extends Component<Props, State> {
	state = {
		selected: "test",
		desc: "",
		category: "",
		amount: 0,
		min: 0,
		max: Infinity,
		date: new Date()
	};

	handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		// Get budget by Id
		this.setState({ selected: e.target.value });
	};

	handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
		let amount = this.state.amount;

		if (e.target.value === "expense") {
			if (amount > 0) amount *= -1;
			this.setState({ max: 0, min: -Infinity, amount });
		} else {
			if (amount < 0) amount *= -1;
			this.setState({ max: Infinity, min: 0 });
		}
		this.setState({ amount });
	};

	render() {
		return (
			<div className={classes.container}>
				<h1 className={classes.title}>Add new transaction</h1>
				<form className={classes.form} onSubmit={e => e.preventDefault()}>
					<label>
						<span>Select Budget: </span>
						<select
							autoFocus
							name="Budgets"
							// Add value here later
							onChange={this.handleSelect}>
							<option value="test" defaultChecked>
								Test
							</option>
							<option value="test2">Test2</option>
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
							onChange={this.handleSelect}>
							<option value="test" defaultChecked>
								Test
							</option>
							<option value="test2">Test2</option>
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
							className={classes.inputNumber}
							type="number"
							maxLength={20}
							onChange={e => {
								let amount = parseFloat(e.target.value);
								if (amount > 0 && this.state.min < 0) amount *= -1;
								this.setState({ amount });
							}}
							value={this.state.amount === 0 ? undefined : this.state.amount}
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
			</div>
		);
	}
}

export default AddTransaction;
