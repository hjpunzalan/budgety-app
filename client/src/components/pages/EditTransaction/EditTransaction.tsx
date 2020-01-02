import React, { Component } from "react";
import classes from "./EditTransaction.module.scss";
import DatePicker from "react-date-picker";
import Axios from "axios";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { AddTransactionForm } from "../AddTransaction/AddTransaction";
import { ITransaction } from "../../../actions";
import Spinner from "../../utils/Spinner/Spinner";
interface Params {
	budgetId: string;
	transactionId: string;
}
interface Props extends RouteComponentProps<Params> {}
interface State extends AddTransactionForm {
	min: number;
	max: number;
	loading: boolean;
}

class EditTransaction extends Component<Props, State> {
	state = {
		desc: "",
		categoryIndex: 0,
		amount: 0,
		min: 0,
		max: Infinity,
		date: new Date(),
		loading: true
	};

	async componentDidMount() {
		const { budgetId, transactionId } = this.props.match.params;

		// Get Transaction by Id using axios
		const res = await Axios.get<ITransaction>(
			`/api/transactions/${budgetId}/${transactionId}`
		);
		const { desc, amount, categoryIndex, date } = res.data;
		this.setState({ desc, amount, categoryIndex, date, loading: false });
	}

	render() {
		return (
			<div className={classes.container}>
				{this.state.loading ? (
					<Spinner />
				) : (
					<>
						<h1 className={classes.title}>Edit transaction</h1>
						<form className={classes.form} onSubmit={this.handleSubmit}>
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
									onChange={this.handleDateChange}
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

export default withRouter(EditTransaction);
