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
	currentBudget: IBudget;
	budgetId: string;
}
interface State {
	removeGraph: boolean;
}

const size = 250;
const extraSpace = 20;

class PieGraph extends Component<Props, State> {
	canvas = React.createRef<HTMLDivElement>();
	tooltip = React.createRef<HTMLDivElement>();
	state = {
		removeGraph: false
	};
	nCategoriesByType = this.props.pieGraph.filter(p => p[this.props.type] !== 0).length;
	legendHeight = (this.nCategoriesByType * 20);

	componentDidUpdate(prevProps: Props) {
		if (prevProps.pieGraph !== this.props.pieGraph) {
			// Update graph
			graph(this, size, extraSpace, this.legendHeight);
		}
	}

	componentDidMount() {
		// dimension of the pie chart
		const dims = { height: size + this.legendHeight, width: size, radius: size / 2 };
		const centre = {
			x: (dims.width + extraSpace) / 2,
			y: (dims.height - this.legendHeight + extraSpace) / 2
		};

		// Initialise canvas
		const svg = d3
			.select(this.canvas.current)
			.append("svg")
			.attr("width", dims.width + extraSpace)
			.attr("height", dims.height + extraSpace);

		// Append group and centres pieGraph svg path
		svg.append("g").attr("transform", `translate(${centre.x}, ${centre.y + this.legendHeight})`);

		// Render graph
		graph(this, size, extraSpace, this.legendHeight);
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
