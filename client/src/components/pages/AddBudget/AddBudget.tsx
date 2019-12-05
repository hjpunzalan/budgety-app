import React, { Component } from "react";
import classes from "./AddBudget.module.scss";

interface Props {}
interface State {
	nCategories: number;
	name: string;
	categories: string[];
}

class AddBudget extends Component<Props, State> {
	state = {
		nCategories: 1,
		name: "",
		categories: [""]
	};

	addNCategories = () => {
		const nCategories = this.state.nCategories;
		this.setState({ nCategories: nCategories + 1 });
	};

	delNCategories = () => {
		const nCategories = this.state.nCategories;
		if (nCategories > 1) this.setState({ nCategories: nCategories - 1 });
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
		for (let i = 1; i <= this.state.nCategories; i++) {
			categoriesArray.push(
				<input
					key={i}
					type="text"
					maxLength={20}
					onChange={e => this.onChangeCategory(e, i - 1)}
					required
				/>
			);
		}

		return (
			<div className={classes.container}>
				<h1 className={classes.title}>Create new budget</h1>
				<form className={classes.form} onSubmit={e => e.preventDefault()}>
					<label className={classes.name}>
						<span>Budget name:</span>
						<input
							type="text"
							maxLength={20}
							onChange={e => this.setState({ name: e.target.value })}
						/>
					</label>
					<label className={classes.categories}>
						<span>Categories:</span>
						{categoriesArray}
					</label>
					<button className={classes.btnGrey} onClick={this.addNCategories}>
						Add more
					</button>
					<button className={classes.btnDel} onClick={this.delNCategories}>
						Delete category
					</button>

					<input type="submit" value="Submit" />
				</form>
			</div>
		);
	}
}

export default AddBudget;
