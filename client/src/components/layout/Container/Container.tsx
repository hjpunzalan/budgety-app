import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { getLogout } from "../../../actions";
import { StoreState } from "../../../reducers";
import ContainerRoutes from "../../routing/ContainerRoutes";
import BudgetSelector from "../BudgetSelector/BudgetSelector";
import MobileNav from "../MobileNav/MobileNav";
import SideNav from "../SideNav/SideNav";
import classes from "./Container.module.scss";

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
		selected: 0,
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
					<BudgetSelector
						loading={this.state.loading}
						selected={this.state.selected}
						budgets={this.props.budgets}
						handleSelect={this.handleSelect}
						mobileSelectBudget={this.mobileSelectBudget}
					/>
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
						match={this.props.match}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
	budgets: state.budgets,
	currentBudget: state.currentBudget,
});

export default connect(mapStateToProps, { getLogout })(Container);
