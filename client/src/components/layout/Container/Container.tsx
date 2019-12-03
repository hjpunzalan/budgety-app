import React, { Component } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { connect } from "react-redux";
import { getLogout } from "../../../actions";
import classes from "./Container.module.scss";
import transactionIcon from "../../../images/transaction.png";
import { StoreState } from "../../../reducers";

interface Props extends StoreState {
	getLogout: () => Promise<void>;
}
interface State {}

class Container extends Component<Props, State> {
	state = {};

	render() {
		return (
			<div className={classes.page}>
				<button className={classes.logout} onClick={this.props.getLogout}>
					Logout
				</button>
				<div className={classes.container}>
					<button className={classes.add}>
						<img src={transactionIcon} alt="Transaction icon" />
						<span>Add Transaction</span>
					</button>
					<div className={classes.budgets}>
						<div className={classes.budgetsTable}>
							<h3>Budgets</h3>
							<ul>
								<li>Test Budget</li>
								<li>Test Budget</li>
								<li>Test Budget</li>
								<li>Test Budget</li>
								<li>Test Budget</li>
								<li>Test Budget</li>
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

					<div className={classes.userActions}>
						<div className={classes.userActionsTable}>
							<h3>User Actions</h3>
							<ul>
								<li>Test Link</li>
								<li>Test Link</li>
								<li>Test Link</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
	budget: state.budget
});

export default connect(
	mapStateToProps,
	{ getLogout }
)(Container);
