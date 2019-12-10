import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { FaTrashAlt } from "react-icons/fa";
import classes from "./EditBudget.module.scss";
// import { setAlert, AlertType } from "../../../actions";

// Get budget based on selected option and then onChange retrieve data from budget state store
// Set state of budget and set loading to false to stop spinner
// Select will be the name of the budget from budgetStore array

interface Props extends RouteComponentProps {}
interface State {
	name: string;
	categories: string[];
	loading: boolean;
	selected: string;
	nCategories: number;
	startingBalance: number;
}

class EditBudget extends Component<Props, State> {
	state = {
		name: "test",
		categories: ["test", "test2"],
		nCategories: 2,
		startingBalance: 1000,
		selected: "test",
		loading: true
	};

	componentDidMount() {}

	addCategories = () => {
		const nCategories = this.state.nCategories;
		this.setState({ nCategories: nCategories + 1 });
	};

	delCategories = () => {
		const nCategories = this.state.nCategories;
		const categories = this.state.categories;
		// Delete the last element of array and make it empty
		categories.pop();
		if (nCategories > 1)
			this.setState({ nCategories: nCategories - 1, categories });
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
		this.setState({ selected: e.target.value });
	};

	handleDelete = () => {
		if (window.confirm("Are you sure you want to delete Budget?")) {
			// add delete Budget action here
			// this.props.setAlert("Budget Deleted", AlertType.success);
		}
	};

	render() {
		const categoriesArray = [];
		// Categories are obtained from state, filled when budget retrieved from db
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

		// Add spinner while data is being retreived from database
		//  Add option values of select from store budget state
		return (
			<div className={classes.container}>
				<h1 className={classes.title}>Edit budget</h1>
				<form className={classes.form} onSubmit={e => e.preventDefault()}>
					<label>
						<span>Select Budget: </span>
						<select autoFocus name="Budgets">
							<option value="test" defaultChecked>
								Test
							</option>
							<option value="test2">Test2</option>
						</select>
					</label>
					<label className={classes.name}>
						<span>Budget name:</span>
						<input
							type="text"
							maxLength={20}
							onChange={e => this.setState({ name: e.target.value })}
							value={this.state.name}
						/>
					</label>
					<label>
						<span>Starting balance:</span>
						<input
							type="number"
							onChange={e =>
								this.setState({ startingBalance: parseFloat(e.target.value) })
							}
							value={
								this.state.startingBalance === 0
									? undefined
									: this.state.startingBalance
							}
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
					<span
						className={classes.deleteBudget}
						onClick={() => console.log("delete Budget")}>
						<FaTrashAlt /> Delete Budget?
					</span>
				</form>
			</div>
		);
	}
}

export default EditBudget;
