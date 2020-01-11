import React, { Component } from "react";
import DatePicker from "react-datepicker";
import Axios from "axios";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import classes from "./EditTransaction.module.scss";
import { ITransaction, setAlert, AlertType } from "../../../actions";
import Spinner from "../../utils/Spinner/Spinner";
import { StoreState } from "../../../reducers";
import { FaTrashAlt } from "react-icons/fa";
interface Params {
	budgetId: string;
	transactionId: string;
}
export interface EditTransactionForm {
	desc?: string;
	categoryIndex?: number;
	amount?: number;
	date?: Date | string;
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
		const dateFixed = new Date(date);
		this.setState({
			desc,
			amount,
			categoryIndex,
			date: dateFixed,
			loading: false
		});
		// Set min and max
		if (amount < 0)
			this.setState({
				max: 0,
				min: -Infinity,
				amount
			});
		else this.setState({ max: Infinity, min: 0 });
	}

	handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		this.setState({
			loading: true
		});
		const { desc, categoryIndex, amount, date } = this.state;
		// Need to convert date to ISO format before sending to server otherwise, it will send incorrect date
		const isoDate = date.toISOString();
		const { budgetId, transactionId } = this.props.match.params;
		await Axios.patch(`/api/transactions/update/${budgetId}/${transactionId}`, {
			desc,
			categoryIndex,
			date: isoDate,
			amount
		});

		this.props.history.push(`/user/budget/${budgetId}`);

		this.props.setAlert("Transaction updated!", AlertType.success);
	};

	handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
		let amount = this.state.amount;
		if (e.target.value === "expense" && amount > 0) {
			amount *= -1;
			this.setState({ max: 0, min: -Infinity, amount });
		} else if (amount < 0 && e.target.value === "income") {
			amount *= -1;
			this.setState({ max: Infinity, min: 0, amount });
		}
	};

	handleDateChange = (date: Date | null) => {
		if (date) this.setState({ date });
	};

	handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		let amount = parseFloat(e.target.value);
		if (amount > 0 && this.state.min < 0) amount *= -1;
		this.setState({ amount });

		// Check if initial value is negative or positive  value
		if (this.state.amount < 0) this.setState({ min: -Infinity, max: 0 });
		else this.setState({ min: 0, max: Infinity });
	};

	handleDelete = async () => {
		this.setState({ loading: true });
		const { budgetId, transactionId } = this.props.match.params;
		await Axios.patch(
			`/api/transactions/delete/${budgetId}/${transactionId}`
		).then(() => {
			this.setState({ loading: false });
			this.props.history.push(`/user/budget/${budgetId}`);
			this.props.setAlert("Transaction deleted!", AlertType.success);
		});
	};

	render() {
		const { budgetId } = this.props.match.params;
		const budget = this.props.budgets.find(b => b._id === budgetId);
		return (
			<div className={classes.container}>
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
					<label onClick={e => e.preventDefault()} className={classes.date}>
						<span className={classes.dateLabel}>Date: </span>
						<DatePicker
							onChange={this.handleDateChange}
							selected={this.state.date}
							dateFormat="dd/MM/yyyy"
							peekNextMonth
							showMonthDropdown
							showYearDropdown
							dropdownMode="select"
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
							onChange={this.handleAmount}
							value={this.state.amount}
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
								checked={
									this.state.min >= 0 && this.state.amount > 0 ? true : false
								}
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
								checked={
									this.state.min < 0 && this.state.amount < 0 ? true : false
								}
							/>
							<span>Expense - </span>
						</label>
					</div>
					{this.state.loading ? (
						<div className={classes.spinner}>
							<Spinner />
						</div>
					) : (
						<>
							<button
								className={classes.btnCancel}
								onClick={e => {
									e.preventDefault();
									this.props.history.goBack();
								}}>
								Go back
							</button>
							<input type="submit" value="Submit" />
							<span
								className={classes.deleteTransaction}
								onClick={this.handleDelete}>
								<FaTrashAlt /> Delete Transaction
							</span>
						</>
					)}
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	budgets: state.budgets
});

export default connect(mapStateToProps, { setAlert })(
	withRouter(EditTransaction)
);
