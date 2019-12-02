import React, { Component } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import classes from "./Container.module.scss";
import transactionIcon from "../../../images/transaction.png";

interface Props {}
interface State {}

class Container extends Component<Props, State> {
	state = {};

	render() {
		return (
			<div className={classes.page}>
				<button className={classes.logout}>Logout</button>
				<div className={classes.container}>
					<button className={classes.add}>
						<img src={transactionIcon} alt="Transaction icon" />
						<span>Add Transaction</span>
					</button>
					<div className={classes.budgets}>
						<div className={classes.table}>
							<h3>Budgets</h3>
							<ul>
								<li>Test Budget</li>
								<li>Test Budget</li>
								<li>Test Budget</li>
							</ul>
							<div className={classes.budgetActions}>
								<button className={classes.budgetActionAdd}>
									<IoIosAddCircleOutline />
									Add
								</button>
								<button className={classes.budgetActionEdit}>
									<FaRegEdit />
									Edit
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Container;
