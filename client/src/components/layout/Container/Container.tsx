import React, { Component } from "react";
import { FaHome } from "react-icons/fa";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import classes from "./Container.module.scss";
import { getLogout } from "../../../actions";
import { StoreState } from "../../../reducers";
import MobileNav from "../MobileNav/MobileNav";
import ContainerRoutes from "../../routing/ContainerRoutes";
import SideNav from "../SideNav/SideNav";

interface Props extends StoreState, RouteComponentProps {
	getLogout: () => Promise<void>;
}
interface State {
	loading: boolean;
	selected: number;
}

class Container extends Component<Props, State> {
	// Add selected state so the selected budget becomes highlighted
	// Change budget id for edit based on selected budget
	// Maybe

	state = {
		loading: true,
		selected: 0
	};

	stopLoading = () => {
		this.setState({ loading: false });
	};

	selectBudget = (budgetIndex: number) => {
		this.setState({ selected: budgetIndex });
	};

	handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const budgetIndex = parseInt(e.target.value, 10);
		this.selectBudget(budgetIndex);
		const budgetId = this.props.budgets[budgetIndex]._id;
		this.props.history.push(this.props.match.path + `/budget/${budgetId}`);
	};

	mobileSelectBudget = () => {
		const budgetId = this.props.budgets[this.state.selected]._id;
		this.props.history.push(this.props.match.path + `/budget/${budgetId}`);
	};

	render() {
		return (
			<div className={classes.page}>
				{this.props.budgets.length > 0 && (
					<div className={classes.mobileSelect}>
						<button onClick={this.mobileSelectBudget}>
							<FaHome />
							<span>Budget</span>
						</button>{" "}
						<span>:</span>
						<select onChange={this.handleSelect} value={this.state.selected}>
							{!this.state.loading &&
								this.props.budgets.map((b, i) => {
									return (
										<option key={b._id} value={i}>
											{b.name}
										</option>
									);
								})}
						</select>
					</div>
				)}
				<MobileNav
					currentBudget={this.props.currentBudget}
					budgets={this.props.budgets}
					getLogout={this.props.getLogout}
				/>
				<button className={classes.logout} onClick={this.props.getLogout}>
					Logout
				</button>
				<div className={classes.container}>
					{/* Routes */}
					<ContainerRoutes
						selectBudget={this.selectBudget}
						stopLoading={this.stopLoading}
						match={this.props.match}
					/>
					{/* NAVIGATION - cant be placed as of yet to its own component because of the styling */}
					<SideNav
						currentBudgetId={this.props.currentBudget._id}
						loading={this.state.loading}
						selected={this.state.selected}
						budgets={this.props.budgets}
						selectBudget={this.selectBudget}
						history={this.props.history}
						match={this.props.match} />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
	budgets: state.budgets,
	currentBudget: state.currentBudget
});

export default connect(
	mapStateToProps,
	{ getLogout }
)(Container);
