import React, { Component } from "react";
import { connect } from "react-redux";
import classes from "./AddBudget.module.scss";
import { addBudget, setAlert, AlertType } from "../../../actions";
import { StoreState } from "../../../reducers";
import { RouteComponentProps } from "react-router";

interface Props extends StoreState, RouteComponentProps {
	addBudget: (form: AddBudgetState) => Promise<void>;
	setAlert: (msg: string, alertType: AlertType) => void;
}
export interface AddBudgetState {
	nCategories?: number;
	name: string;
	categories: string[];
	startingBalance: number;
}

class AddBudget extends Component<Props, AddBudgetState> {
	state = {
		nCategories: 1,
		name: "",
		startingBalance: 0,
		categories: [""]
	};

	handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const budgetListLength = this.props.budgets.length;
		const { name, startingBalance, categories } = this.state;
		this.props.addBudget({ name, startingBalance, categories }).then(() => {
			// If successful
			if (this.props.budgets.length > budgetListLength) {
				// Redirect to the budget
				const budgetId = this.props.budgets[budgetListLength]._id;
				this.props.history.push(`/user/budget/${budgetId}`);
			}
			// /Reset form
			else
				this.setState({
					nCategories: 1,
					name: "",
					startingBalance: 0,
					categories: [""]
				});
		});
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
		const nCategories = this.state.nCategories - 1;
		const categories = this.state.categories;
		// Delete the last element of array and make it empty
		if (this.state.nCategories > 1) {
			categories.pop();
			this.setState({ nCategories, categories });
		}
	};

	onChangeCategory = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const categories = this.state.categories;
		categories[index] = e.target.value;
		this.setState({ categories });
	};

	render() {
		const categoriesArray = [];
		for (let i = 0; i < this.state.nCategories; i++) {
			categoriesArray.push(
				<input
					key={i}
					type="text"
					maxLength={20}
					onChange={e => this.onChangeCategory(e, i)}
					value={this.state.categories[i]}
					required
				/>
			);
		}

		return (
			<div className={classes.container}>
				<h1 className={classes.title}>Create new budget</h1>
				<form className={classes.form} onSubmit={this.handleSubmit}>
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
									startingBalance:
										e.target.value.length > 0 ? parseFloat(e.target.value) : 0
								})
							}
							value={
								this.state.startingBalance === 0
									? ""
									: this.state.startingBalance
							}
							required
						/>
					</label>
					<label className={classes.categories}>
						<span>Categories:</span>
						{categoriesArray}
					</label>
					<button className={classes.btnGrey} onClick={this.addCategories}>
						Add more
					</button>
					<button className={classes.btnDel} onClick={this.delCategories}>
						Delete category
					</button>

					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	budgets: state.budgets
});

export default connect(
	mapStateToProps,
	{ addBudget, setAlert }
)(AddBudget);
