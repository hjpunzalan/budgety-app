import React, { Component } from 'react'
import { IBudget } from '../../../actions'
import classes from "./BudgetSelector.module.scss"

import { FaHome } from "react-icons/fa";

interface Props {
    loading: boolean;
    selected: number;
    budgets: IBudget[];
    handleSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void
    mobileSelectBudget: () => void;
}

class BudgetSelector extends Component<Props> {
    state = {}

    render() {
        return (
            <div className={classes.mobileSelect}>
                <button onClick={this.props.mobileSelectBudget}>
                    <FaHome />
                    <span>Budgety</span>
                </button>{" "}
                <span>:</span>
                <select onChange={this.props.handleSelect} value={this.props.selected}>
                    {!this.props.loading &&
                        this.props.budgets.map((b, i) => {
                            return (
                                <option key={b._id} value={i}>
                                    {b.name}
                                </option>
                            );
                        })}
                </select>
            </div>
        )
    }
}

export default BudgetSelector
