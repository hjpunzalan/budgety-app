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

// Get budget based on selected option and then onChange retrieve data from budget state store
// Set state of budget and set loading to false to stop spinner
// Select will be the name of the budget from budgetStore array

interface Props extends RouteComponentProps, StoreState {
	editBudget: (budgetId: string, form: EditBudgetForm) => Promise<void>;
	deleteBudget: (budget: IBudget) => Promise<void>;
	setAlert: (msg: string, alertType: AlertType) => void;
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
		const categories = this.state.categories;
		const nCategories = this.state.nCategories + 1;
		categories.push("");

		this.setState({ nCategories, categories });
		this.props.setAlert(
			"Be careful when adding categories as these cannot be deleted after updating the budget.",
			AlertType.info
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
				//Reset form after deleting budget
				this.setState({
					budgetIndex: previousBudget,
					name: this.props.budgets[previousBudget].name,
					categories: [...this.props.budgets[previousBudget].categories],
					nCategories: this.props.budgets[previousBudget].categories.length,
					startingBalance: this.props.budgets[previousBudget].startingBalance,
					loading: false
				});
			});
		}
	};

	handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		const i = this.state.budgetIndex;
		this.setState({
			name: this.props.budgets[i].name,
			categories: [...this.props.budgets[i].categories],
			nCategories: this.props.budgets[i].categories.length,
			startingBalance: this.props.budgets[i].startingBalance
		});
	};

	render() {
		// Add spinner while data is being retreived from database
		return (
			<div className={classes.container}>
				{this.state.loading ? (
					<Spinner />
				) : (
					<>
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
							<button className={classes.btnCancel} onClick={this.handleCancel}>
								Cancel
							</button>
							<input type="submit" value="Submit" />
							<span
								className={classes.deleteBudget}
								onClick={this.handleDelete}>
								<FaTrashAlt /> Delete Budget?
							</span>
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
	{ editBudget, setAlert, deleteBudget }
)(EditBudget);
