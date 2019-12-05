import React, { Component } from "react";
import classes from "./EditBudget.module.scss";
import { RouteComponentProps } from "react-router";

interface Props extends RouteComponentProps {}
interface State {
	name: string;
	categories: string[];
	loading: boolean;
	nCategories: number;
}

class EditBudget extends Component<Props, State> {
	state = {
		name: "test",
		categories: ["test", "test2"],
		nCategories: 2,
		loading: true
	};

	componentDidMount() {
		// retrieve budget from params' budget id
		// Set state of budget and set loading to false to stop spinner
	}

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
		// Categories are obtained from state, filled when budget retrieved from db
		for (let i = 0; i < this.state.nCategories; i++) {
			categoriesArray.push(
				<input
					key={i}
					type="text"
					maxLength={20}
					onChange={e => this.onChangeCategory(e, i - 1)}
					value={this.state.categories[i]}
					required
				/>
			);
		}

		// Add spinner while data is being retreived from database
		return (
			<div className={classes.container}>
				<h1 className={classes.title}>Edit budget</h1>
				<form className={classes.form} onSubmit={e => e.preventDefault()}>
					<label className={classes.name}>
						<span>Budget name:</span>
						<input
							type="text"
							maxLength={20}
							onChange={e => this.setState({ name: e.target.value })}
							value={this.state.name}
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

export default EditBudget;
