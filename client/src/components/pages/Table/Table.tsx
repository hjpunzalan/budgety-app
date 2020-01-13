import React, { Component } from "react";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import { RouteComponentProps, withRouter } from "react-router";
import { checkAmount } from "../../utils/CheckAmount";
import classes from "./Table.module.scss";
import { ITransactionResult } from "../../../reducers/transactions";
import { IBudget, ITransaction } from "../../../actions";

interface Props extends RouteComponentProps {
	transactions: ITransactionResult[];
	currentBudget: IBudget;
	getTransactions: (
		budgetId: string,
		pageNumber?: number,
		setHasMore?: (hasMore: boolean) => void
	) => Promise<void>;
}
interface State {
	pageNumber: number;
	hasMore: boolean;
	selectedId?: string;
	latestClick: number;
}

class Table extends Component<Props, State> {
	state = {
		pageNumber: 1,
		hasMore: true,
		selectedId: "",
		latestClick: new Date().getTime()
	};
	// A method to be push to the action creator
	// This checks if there are results from server,
	// if not there are no more pages left
	setHasMore = (hasMore: boolean) => {
		this.setState({ hasMore });
	};

	loadMore = () => {
		const { pageNumber, hasMore } = this.state;
		if (hasMore) {
			// Stop repeated execution
			this.setState({ hasMore: false });
			const nextPage = pageNumber + 1;
			if (this.props.currentBudget._id)
				// Set new transactions based on page
				this.props.getTransactions(
					this.props.currentBudget._id,
					nextPage,
					this.setHasMore
				);
			// Set new page before request even finish
			this.setState({ pageNumber: nextPage });
		}
	};

	handleClick = (transactionId: string) => {
		// Create double click/tap function
		const now = new Date().getTime();
		const timesince = now - this.state.latestClick;
		if (this.state.selectedId === transactionId) {
			if (timesince < 800 && timesince > 0) {
				// double tap
				this.props.history.push(
					`/user/transactions/${this.props.currentBudget._id}/edit/${transactionId}`
				);
			} // one tap
			else
				this.setState({
					selectedId: ""
				});
		} // different transaction
		else
			this.setState({
				selectedId: transactionId
			});

		// Set new latestClick
		this.setState({
			latestClick: new Date().getTime()
		});
	};

	render() {
		const { currentBudget, transactions } = this.props;
		return (
			<>
				<span className={classes.tip}>Double click to edit a transaction</span>
				<table className={classes.table}>
					<thead>
						<tr className={classes.heading}>
							<th>Date</th>
							<th>Description</th>
							<th>Amount($AUD)</th>
							<th className={classes.mobileTableHead}>Category</th>
							<th className={classes.mobileTableHead}>Balance</th>
						</tr>
					</thead>
					<InfiniteScroll
						element="tbody"
						loadMore={this.loadMore}
						hasMore={this.state.hasMore}
						threshold={50}
						loader={
							<tr className={classes.loader} key={0}>
								<td>Loading ...</td>
							</tr>
						}>
						{transactions.map(group => {
							return (
								<React.Fragment key={group._id.month + group._id.year}>
									<tr>
										<td className={classes.groupDate} colSpan={5}>
											{moment(group._id.month, "MM").format("MMMM")}{" "}
											{group._id.year}
										</td>
									</tr>
									{group.transactions.map((t: ITransaction, i: number) => {
										return (
											//When double clicked redirect to edit transaction page!
											<tr
												key={i}
												className={
													this.state.selectedId === t._id
														? classes.transactionSelected
														: classes.transaction
												}
												onClick={() => t._id && this.handleClick(t._id)}>
												<td>
													{moment
														.utc(t.date)
														.format("DD MMM")
														.toUpperCase()}
												</td>
												<td>
													{t.desc}
													{this.state.selectedId === t._id && (
														<p className={classes.mobileTableCategory}>
															{currentBudget.categories[t.categoryIndex]}
														</p>
													)}
												</td>
												<td>{checkAmount(t.amount)}</td>
												<td className={classes.mobileTableData}>
													{currentBudget.categories[t.categoryIndex]}
												</td>
												<td className={classes.mobileTableData}>
													{checkAmount(t.balance)}
												</td>
											</tr>
										);
									})}
								</React.Fragment>
							);
						})}
					</InfiniteScroll>
				</table>
			</>
		);
	}
}

export default withRouter(Table);
