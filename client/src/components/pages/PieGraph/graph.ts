import PieGraph from "./PieGraph";
import * as d3 from "d3";
import { PieArcDatum } from "d3";
import classes from "./PieGraph.module.scss";
import { BudgetCategoryData } from "../../../reducers/charts";
import { checkAmount } from "../../utils/CheckAmount";

export enum PieGraphType {
	income = "income",
	expense = "expense"
}

export const graph = (component: PieGraph, size: number, extra: number) => {
	const dims = { height: size, width: size, radius: size / 2 }; // dimension of the pie chart

	// Locate budget to retrieve its categories
	const budget = component.props.budgets.filter(
		b => b._id === component.props.budgetId
	)[0];
	let data = component.props.pieGraph;
	const type = component.props.type;

	// Remove null values from graph
	if (type === PieGraphType.income) {
		// Remove slices
		data = component.props.pieGraph.filter(d => d.income !== 0);
	} else data = component.props.pieGraph.filter(d => d.expense !== 0);

	const renderPieGraph = () => {
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
		const colour = d3.scaleOrdinal(d3.schemeSet2);

		const graph = d3
			.select(component.canvas.current)
			.select("svg")
			.select("g");

		const slice = graph.selectAll("g.slice").data(pie(data));

		// Handle current selection
		slice
			.select("path")
			.attr("d", arcPath)
			.attr("d", arcPath)
			.attr("stroke", "#fff")
			.attr("stroke-width", 2)
			.attr("fill", d => colour(budget.categories[d.data._id.category]))
			.style("cursor", "pointer")
			.on("mouseover", () => {
				d3.select(component.tooltip.current)
					.style("opacity", 1)
					.style("color", type === PieGraphType.income ? "green" : "red");
			})
			.on("mousemove", d => {
				d3.select(component.tooltip.current)
					.style("left", d3.event.pageX + 15 + "px")
					.style("top", d3.event.pageY + "px")
					.select("#pieGraphTip")
					.text(
						`${budget.categories[d.data._id.category]}: ${checkAmount(
							Math.abs(d.data[type])
						)}`
					);
			})
			.on("mouseout", d =>
				d3.select(component.tooltip.current).style("opacity", 0)
			);

		slice
			.select("text")
			.attr("text-anchor", "middle")
			.attr("transform", d => `translate(${arcPath.centroid(d)})`)
			.text(d => budget.categories[d.data._id.category])
			.attr("class", classes.labels);

		// Handle enter selection
		const newSlice = slice
			.enter()
			.append("g")
			.attr("class", "slice");

		newSlice
			.append("path")
			.attr("d", arcPath)
			.attr("stroke", "#fff")
			.attr("stroke-width", 2)
			.attr("fill", d => colour(budget.categories[d.data._id.category]))
			.style("cursor", "pointer")
			.on("mouseover", () => {
				d3.select(component.tooltip.current)
					.style("opacity", 1)
					.style("color", type === PieGraphType.income ? "green" : "red");
			})
			.on("mousemove", d => {
				d3.select(component.tooltip.current)
					.style("left", d3.event.pageX + 15 + "px")
					.style("top", d3.event.pageY + "px")
					.select("#pieGraphTip")
					.text(
						`${budget.categories[d.data._id.category]}: ${checkAmount(
							Math.abs(d.data[type])
						)}`
					);
			})
			.on("mouseout", d =>
				d3.select(component.tooltip.current).style("opacity", 0)
			);
		newSlice
			.append("text")
			.attr("text-anchor", "middle")
			.attr("transform", d => `translate(${arcPath.centroid(d)})`)
			.text(d => budget.categories[d.data._id.category])
			.attr("class", classes.labels);

		// Handle exit selection
		slice.exit().remove();
		newSlice.exit().remove();
	};

	// Remove graph if there's no amount depending on type
	if (data.length === 0) {
		component.setState({
			removeGraph: true
		});
	} else if (data.length > 0 && component.state.removeGraph) {
		// Add graph if there is amount and was removed before
		const centre = {
			x: (dims.width + extra) / 2,
			y: (dims.width + extra) / 2
		};

		component.setState(
			{
				removeGraph: false
			},
			() => {
				// Initialise canvas
				d3.select(component.canvas.current)
					.append("svg")
					.attr("width", dims.width + extra)
					.attr("height", dims.height + extra)
					.append("g")
					.attr("transform", `translate(${centre.x}, ${centre.y})`);

				renderPieGraph();
			}
		);
	} else renderPieGraph(); // Normally render the graph
};
