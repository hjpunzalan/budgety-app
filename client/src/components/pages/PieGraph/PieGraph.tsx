import React, { Component } from "react";
import * as d3 from "d3";
import { PieArcDatum } from "d3";
import classes from "./PieGraph.module.scss";
import { BudgetCategoryData } from "../../../reducers/charts";
import { IBudget } from "../../../actions";
import { checkAmount } from "../../utils/CheckAmount";

export enum PieGraphType {
	income = "income",
	expense = "expense"
}

interface Props {
	type: PieGraphType;
	month: number;
	year: number;
	pieGraph: BudgetCategoryData[];
	getCategoryData: (
		budgetId: string,
		month: number,
		year: number
	) => Promise<void>;
	budgetId?: string;
	budgets: IBudget[];
}
interface State {}

class PieGraph extends Component<Props, State> {
	canvas = React.createRef<HTMLDivElement>();
	tooltip = React.createRef<HTMLDivElement>();
	state = {};

	componentDidMount() {
		const { month, year, budgetId } = this.props;
		if (budgetId) {
			this.props.getCategoryData(budgetId, month, year).then(() => {
				const budget = this.props.budgets.filter(
					b => b._id === this.props.budgetId
				)[0];
				let data = this.props.pieGraph;
				const type = this.props.type;

				// Remove null values from graph
				if (type === PieGraphType.income) {
					data = this.props.pieGraph.filter(d => d.income !== 0);
				} else data = this.props.pieGraph.filter(d => d.expense !== 0);

				const size = 250;
				const dims = { height: size, width: size, radius: size / 2 }; // dimension of the pie chart
				// 5px extra
				const centre = {
					x: dims.width / 2 + 5,
					y: dims.height / 2 + 5
				};

				const svg = d3
					.select(this.canvas.current)
					.append("svg")
					.attr("width", dims.width + 150) // 150px extra for legend
					.attr("height", dims.height + 150); // 150px extra for legend

				// Pie function to convert data into pieData
				const pie = d3
					.pie<BudgetCategoryData>()
					.sort(null) // prevents default sorting
					.value(d => Math.abs(d[type]));

				// Function that generates arc Path based on PieData with argument data to pie function
				const arcPath = d3
					.arc<PieArcDatum<BudgetCategoryData>>()
					.outerRadius(dims.radius)
					.innerRadius(0);

				// ordinal scale
				const colour = d3.scaleOrdinal(d3["schemeSet2"]);

				// update colour scale domain
				colour.domain(data.map(d => budget.categories[d._id.category]));

				// Append group and centres pieGraph svg path
				const graph = svg
					.append("g")
					.attr("transform", `translate(${centre.x}, ${centre.y})`);

				// Append group for each slice
				const slice = graph
					.selectAll("g.slice")
					.data(pie(data))
					.enter()
					.append("g")
					.attr("class", "slice");

				// handle enter selection
				slice
					.append("path")
					.attr("d", arcPath)
					.attr("stroke", "#fff")
					.attr("stroke-width", 2)
					.attr("fill", d => colour(budget.categories[d.data._id.category]))
					.style("cursor", "pointer")
					.on("mouseover", d => {
						d3.select(this.tooltip.current).style("opacity", 1);
					})
					.on("mousemove", d => {
						d3.select(this.tooltip.current)
							.style("left", d3.event.pageX + 15 + "px")
							.style("top", d3.event.pageY + "px")
							.select("#pieGraphTip")
							.text(checkAmount(d.data[type]));
					})
					.on("mouseout", d =>
						d3.select(this.tooltip.current).style("opacity", 0)
					);

				slice
					.append("text")
					.attr("text-anchor", "middle")
					.attr("transform", d => `translate(${arcPath.centroid(d)})`)
					.text(d => budget.categories[d.data._id.category])
					.attr("class", classes.labels);
			});
		}
	}

	render() {
		return (
			<>
				<div ref={this.tooltip} className={classes.toolTip}>
					<span id="pieGraphTip"></span>
				</div>
				<div ref={this.canvas}></div>
			</>
		);
	}
}

export default PieGraph;
