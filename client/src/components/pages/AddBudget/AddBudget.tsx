import React, { Component } from "react";
import { connect } from "react-redux";
import classes from "./AddBudget.module.scss";
import { addBudget } from "../../../actions";

interface Props {
	addBudget: (form: AddBudgetState) => Promise<void>;
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
		const { name, startingBalance, categories } = this.state;
		this.props.addBudget({ name, startingBalance, categories }).then(() => {
			// Reset form
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
		const categories = this.state.categories;
		const nCategories = this.state.nCategories + 1;
		for (let i = this.state.nCategories; i < nCategories; i++) {
			categories.push("");
		}
		this.setState({ nCategories, categories });
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
						<span>Starting balance:</span>
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

export default connect(
	null,
	{ addBudget }
)(AddBudget);
