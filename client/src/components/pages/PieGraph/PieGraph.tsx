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
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;


class PieGraph extends Component<Props, State> {
	canvas = React.createRef<HTMLDivElement>();
	tooltip = React.createRef<HTMLDivElement>();
	state = {
		removeGraph: false
	};
	nCategoriesByType = window.screen.width < 700 ? this.props.pieGraph.filter(p => p[this.props.type] !== 0).length : this.props.pieGraph.length;
	legendHeight = (this.nCategoriesByType * 20);
	// dimension of the pie chart
	dims = { height: size, width: size, radius: size / 2 };
	centre = {
		x: (this.dims.width + extraSpace) / 2,
		y: (this.dims.height + extraSpace) / 2
	};

	componentDidUpdate(prevProps: Props) {
		const nCategoriesByType = window.screen.width < 700 ? this.props.pieGraph.filter(p => p[this.props.type] !== 0).length : this.props.pieGraph.length;
		const legendHeight = (nCategoriesByType * 20);
		const dims = { height: size, width: size, radius: size / 2 };
		const centre = {
			x: (dims.width + extraSpace) / 2,
			y: (dims.height + extraSpace) / 2
		};

		if (!this.state.removeGraph) {
			d3.select(this.canvas.current)
			.select("svg")
			.attr("width", dims.width + extraSpace)
			.attr("height", dims.height + legendHeight + extraSpace)
			.select("g")
			.attr("transform", `translate(${centre.x}, ${centre.y + legendHeight})`)
		}

		if (prevProps.pieGraph !== this.props.pieGraph) {
			// Update graph
			// Append group and centres pieGraph svg path
			graph(this, size, extraSpace, legendHeight);
		}
	}

	componentDidMount() {
		// Initialise canvas
		svg = d3
			.select(this.canvas.current)
			.append("svg")
			.attr("width", this.dims.width + extraSpace)
			.attr("height", this.dims.height + this.legendHeight + extraSpace);

		svg.append("g").attr("transform", `translate(${this.centre.x}, ${this.centre.y + this.legendHeight})`);
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
