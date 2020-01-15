import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { FaTrashAlt } from "react-icons/fa";
import { connect } from "react-redux";
import classes from "./EditBudget.module.scss";
import { StoreState } from "../../../reducers";
import {
	editBudget,
	deleteBudget,
	setAlert,
	AlertType,
	IBudget
} from "../../../actions";
import Spinner from "../../utils/Spinner/Spinner";

interface Props extends RouteComponentProps, StoreState {
	editBudget: (budgetId: string, form: EditBudgetForm) => Promise<void>;
	deleteBudget: (budget: IBudget) => Promise<void>;
	setAlert: (msg: string, alertType: AlertType) => void;
	selectBudget: (budgetIndex: number) => void;
}

export interface EditBudgetForm {
	name: string;
	categories: string[];
	startingBalance: number;
}
interface State extends EditBudgetForm {
	loading: boolean;
	budgetIndex: number;
	nCategories: number;
}

class EditBudget extends Component<Props, State> {
	state = {
		budgetIndex: 0,
		name: this.props.budgets[0].name,
		categories: [...this.props.budgets[0].categories],
		nCategories: this.props.budgets[0].categories.length,
		startingBalance: this.props.budgets[0].startingBalance,
		loading: false
	};

	componentDidMount() {
		if (this.props.currentBudget._id) {
			const budgetIndex = this.props.budgets.findIndex(
				b => b._id === this.props.currentBudget._id
			);
			const { name, categories, startingBalance } = this.props.currentBudget;
			this.setState({
				budgetIndex,
				name,
				categories,
				startingBalance,
				nCategories: categories.length
			});
		}
	}

	handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		this.setState({ loading: true });
		const { budgetIndex, name, categories, startingBalance } = this.state;
		const budgetId = this.props.budgets[budgetIndex]._id;
		e.preventDefault();
		if (budgetId) {
			this.props
				.editBudget(budgetId, {
					name,
					categories,
					startingBalance
				})
				.then(() => {
					this.setState({
						loading: false
					});
				});
		} else {
			this.props.setAlert("Invalid budget selected!", AlertType.warning);
		}
	};

	addCategories = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		// Max categories is 8 due to the colour scheme of the pieGraph
		if (this.state.nCategories < 8) {
			const categories = this.state.categories;
			const nCategories = this.state.nCategories + 1;
			categories.push("");

			this.setState({ nCategories, categories });
			this.props.setAlert(
				"Be careful when adding categories as these cannot be deleted after updating the budget.",
				AlertType.info
			);
		} else
			this.props.setAlert(
				"Maximum number of categories reached!!",
				AlertType.warning
			);
	};

	delCategories = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		const i = this.state.budgetIndex;
		const nCategories = this.state.nCategories - 1;
		const categories = this.state.categories;
		// Delete the last element of array and make it empty
		if (this.state.nCategories > this.props.budgets[i].categories.length) {
			categories.pop();
			this.setState({ nCategories, categories });
		} else
			this.props.setAlert(
				"Cannot reduce number of categories that was previously set! This could affect any previous transactions made.",
				AlertType.warning
			);
	};

	onChangeCategory = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const categories = this.state.categories;
		categories[index] = e.target.value;
		this.setState({ categories });
	};

	onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const i = parseInt(e.target.value, 10);
		this.setState({
			budgetIndex: i,
			name: this.props.budgets[i].name,
			categories: [...this.props.budgets[i].categories],
			nCategories: this.props.budgets[i].categories.length,
			startingBalance: this.props.budgets[i].startingBalance
		});
	};

	handleDelete = () => {
		if (
			window.confirm(
				`Are you sure you want to delete budget ${this.state.name}?`
			)
		) {
			// Set loading to true
			this.setState({ loading: true });
			const previousBudget = this.state.budgetIndex - 1;

			const budget = this.props.budgets[this.state.budgetIndex];
			this.props.deleteBudget(budget).then(() => {
				if (this.props.budgets.length > 1) {
					// Select new budget from Container component
					const i = this.props.budgets.length - 1;
					this.props.selectBudget(i);
					//Reset form after deleting budget
					this.setState({
						budgetIndex: previousBudget,
						name: this.props.budgets[previousBudget].name,
						categories: [...this.props.budgets[previousBudget].categories],
						nCategories: this.props.budgets[previousBudget].categories.length,
						startingBalance: this.props.budgets[previousBudget].startingBalance,
						loading: false
					});
				} else {
					this.props.history.push(this.props.match.path + "/budget/new");
				}
			});
		}
	};

	handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		this.props.history.goBack();
	};

	render() {
		// Add spinner while data is being retreived from database
		return (
			<div className={classes.container}>
				<h1 className={classes.title}>Edit budget</h1>
				<form className={classes.form} onSubmit={this.handleSubmit}>
					<label>
						<span>Select Budget: </span>
						<select
							value={this.state.budgetIndex}
							onChange={this.onChangeSelect}
							autoFocus
							name="Budgets"
							required>
							{this.props.budgets.map((b, i) => (
								<option key={b._id} value={i}>
									{b.name}
								</option>
							))}
						</select>
					</label>
					<label className={classes.name}>
						<span>Budget name:</span>
						<input
							type="text"
							maxLength={20}
							onChange={e => this.setState({ name: e.target.value })}
							value={this.state.name}
							required
						/>
					</label>
					<label>
						<span>Starting balance $:</span>
						<input
							type="number"
							onChange={e =>
								this.setState({
									startingBalance: parseFloat(e.target.value)
								})
							}
							value={
								this.state.startingBalance === 0
									? undefined
									: this.state.startingBalance
							}
							required
						/>
					</label>
					<label className={classes.categories}>
						<span>Categories:</span>
						{this.state.categories.map((c, i) => {
							return (
								<input
									key={i}
									type="text"
									maxLength={20}
									onChange={e => this.onChangeCategory(e, i)}
									value={this.state.categories[i]}
									required
								/>
							);
						})}
					</label>
					<button className={classes.btnGrey} onClick={this.addCategories}>
						Add more
					</button>
					<button className={classes.btnDel} onClick={this.delCategories}>
						Delete category
					</button>

					{/** Bottom buttons */}
					{this.state.loading ? (
						<div className={classes.spinner}>
							<Spinner />
						</div>
					) : (
						<>
							<button className={classes.btnCancel} onClick={this.handleCancel}>
								Cancel
							</button>
							<input type="submit" value="Submit" />
							<span
								className={classes.deleteBudget}
								onClick={this.handleDelete}>
								<FaTrashAlt /> Delete Budget
							</span>
						</>
					)}
				</form>
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
	{ editBudget, setAlert, deleteBudget }
)(EditBudget);
