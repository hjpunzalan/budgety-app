import React, { Component } from "react";
import * as d3 from "d3";
import classes from "./PieGraph.module.scss";
import { BudgetCategoryData } from "../../../reducers/charts";
import { IBudget } from "../../../actions";
import { graph } from "./graph";

export enum PieGraphType {
	income = "income",
	expense = "expense"
}

interface Props {
	type: PieGraphType;
	pieGraph: BudgetCategoryData[];
	budgets: IBudget[];
	budgetId: string;
}
interface State {
	removeGraph: boolean;
}

const size = 250;
const extra = 20;

class PieGraph extends Component<Props, State> {
	canvas = React.createRef<HTMLDivElement>();
	tooltip = React.createRef<HTMLDivElement>();
	state = {
		removeGraph: false
	};

	componentDidUpdate(prevProps: Props) {
		if (prevProps.pieGraph !== this.props.pieGraph) {
			// Update graph
			graph(this, size, extra);
		}
	}

	componentDidMount() {
		const dims = { height: size, width: size, radius: size / 2 }; // dimension of the pie chart
		const centre = {
			x: (dims.width + extra) / 2,
			y: (dims.width + extra) / 2
		};

		// Initialise canvas
		const svg = d3
			.select(this.canvas.current)
			.append("svg")
			.attr("width", dims.width + extra)
			.attr("height", dims.height + extra);

		// Append group and centres pieGraph svg path
		svg.append("g").attr("transform", `translate(${centre.x}, ${centre.y})`);

		// Render graph
		graph(this, size, extra);
	}

	render() {
		return (
			!this.state.removeGraph && (
				<>
					<div ref={this.tooltip} className={classes.toolTip}>
						<span id="pieGraphTip"></span>
					</div>
					<div className={classes.chart}>
						<h1 className={classes.title}>{this.props.type}</h1>
						<div className={classes.canvas} ref={this.canvas}></div>
					</div>
				</>
			)
		);
	}
}

export default PieGraph;
