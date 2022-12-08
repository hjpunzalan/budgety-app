import { History } from "history";
import React, { Component } from "react";
import { Link, match } from "react-router-dom";
import { IBudget } from "../../../actions";
import transactionIcon from "../../../images/transaction.png";
import classes from "./SideNav.module.scss";

import { FaKey, FaRegEdit } from "react-icons/fa";
import { GoDiffAdded, GoPerson } from "react-icons/go";

interface Props {
	currentBudgetId: string | undefined;
	loading: boolean;
	selected: number;
	budgets: IBudget[];
	selectBudget: (budgetIndex: number) => void;
	history: History;
	match: match;
}

class SideNav extends Component<Props> {
	render() {
		return (
			<div className={classes.container}>
				<button
					className={classes.add}
					onClick={() =>
						this.props.currentBudgetId &&
						this.props.history.push(this.props.match.path + "/transactions/new")
					}>
					<img src={transactionIcon} alt="Transaction icon" />
					<span>Add Transaction</span>
				</button>
				<div className={classes.budgets}>
					<h3>Budgets</h3>
					<ul>
						{!this.props.loading &&
							(this.props.budgets.length > 0 ? (
								this.props.budgets.map((b, i) => {
									return (
										<Link
											key={b._id}
											to={this.props.match.path + `/budget/${b._id}`}
											onClick={() => this.props.selectBudget(i)}>
											<li
												className={
													this.props.selected === i &&
													this.props.budgets.length > 1
														? classes.selected
														: ""
												}>
												{b.name}
											</li>
										</Link>
									);
								})
							) : (
								<Link
									key={"nobudget"}
									to={this.props.match.path + `/budget/new`}>
									<li>
										<i>No budgets listed....</i>
									</li>
								</Link>
							))}
					</ul>
					<div className={classes.budgetActions}>
						<Link
							to={this.props.match.path + "/budget/new"}
							className={classes.budgetActionAdd}>
							<GoDiffAdded />
							Add
						</Link>
						{this.props.budgets.length > 0 && (
							<Link
								to={this.props.match.path + "/budget/edit"}
								className={classes.budgetActionEdit}>
								<FaRegEdit />
								Edit
							</Link>
						)}
					</div>
				</div>

				<div className={classes.userActions}>
					<h3>User Actions</h3>
					<ul>
						<Link to="/user/update">
							<li>
								<GoPerson />
								Update user details
							</li>
						</Link>
						<Link to="/user/changepassword">
							<li>
								<FaKey />
								Change password
							</li>
						</Link>
					</ul>
				</div>
			</div>
		);
	}
}

export default SideNav;
