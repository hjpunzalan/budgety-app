import React, { Component } from "react";
import classes from "./EditTransaction.module.scss";
import DatePicker from "react-date-picker";
import Axios from "axios";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { ITransaction, setAlert, AlertType } from "../../../actions";
import Spinner from "../../utils/Spinner/Spinner";
import { StoreState } from "../../../reducers";
interface Params {
	budgetId: string;
	transactionId: string;
}
export interface EditTransactionForm {
	desc?: string;
	categoryIndex?: number;
	amount?: number;
	date?: Date | Date[];
}
interface Props extends RouteComponentProps<Params>, StoreState {
	setAlert: (message: string, alertType: AlertType) => void;
}
interface State extends EditTransactionForm {
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
		// Set min and max
		if (amount < 0) this.setState({ max: 0, min: -Infinity, amount });
		else this.setState({ max: Infinity, min: 0 });
	}

	handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		this.setState({
			loading: true
		});
		const { desc, categoryIndex, amount, date } = this.state;
		// This fixes the bug when sending different format of Date to server from client's format
		// The bug is the date saved on server is the day before when its the beginning of the month
		// The selections works correclty but the server assumes its the day before.
		if (date instanceof Date) {
			const day = date.getDate();
			date.setDate(day + 1);
		}
		const { budgetId, transactionId } = this.props.match.params;
		await Axios.patch(`/api/transactions/update/${budgetId}/${transactionId}`, {
			desc,
			categoryIndex,
			date,
			amount
		});

		// stop loading
		this.setState({
			loading: false
		});

		this.props.setAlert("Transaction updated!", AlertType.success);
	};

	handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
		let amount = this.state.amount;
		if (!amount) amount = 1; // if amount = 0 or undefined
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

	handleDateChange = (date: Date | Date[]) => {
		this.setState({ date });
	};

	render() {
		const { budgetId } = this.props.match.params;
		const budget = this.props.budgets.find(b => b._id === budgetId);
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
									{budget &&
										budget.categories.map((c, i) => {
											return (
												<option key={i} value={i}>
													{c}
												</option>
											);
										})}
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

const mapStateToProps = (state: StoreState) => ({
	budgets: state.budgets
});

export default connect(
	mapStateToProps,
	{ setAlert }
)(withRouter(EditTransaction));
