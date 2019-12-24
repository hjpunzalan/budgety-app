import React, { Component } from "react";
import moment from "moment";
import { checkAmount } from "../../utils/CheckAmount";
import InfiniteScroll from "react-infinite-scroller";
import classes from "./Table.module.scss";
import { ITransactionResult } from "../../../reducers/transactions";
import { IBudget } from "../../../actions";

interface Props {
	transactions: ITransactionResult[];
	currentBudget: IBudget;
}
interface State {}

class Table extends Component<Props, State> {
	state = {};

	render() {
		return (
			<table className={classes.table}>
				<thead>
					<tr className={classes.heading}>
						<th>Date</th>
						<th>Description</th>
						<th>Amount($AUD)</th>
						<th>Category</th>
						<th>Balance</th>
					</tr>
				</thead>
				<tbody>
					{this.props.transactions.map(group => {
						return (
							<React.Fragment key={group._id.month + group._id.year}>
								<tr>
									<td className={classes.groupDate} colSpan={5}>
										{moment(group._id.month, "MM").format("MMMM")}{" "}
										{group._id.year}
									</td>
								</tr>
								{group.transactions.map((t, i) => {
									return (
										//When double clicked redirect to edit transaction page!
										<tr key={i} className={classes.transactions}>
											<td>
												{moment
													.utc(t.date)
													.format("DD MMM")
													.toUpperCase()}
											</td>
											<td>{t.desc}</td>
											<td>{checkAmount(t.amount)}</td>
											<td>
												{this.props.currentBudget.categories[t.categoryIndex]}
											</td>
											<td>{checkAmount(t.balance)}</td>
										</tr>
									);
								})}
							</React.Fragment>
						);
					})}
				</tbody>
			</table>
		);
	}
}

export default Table;
