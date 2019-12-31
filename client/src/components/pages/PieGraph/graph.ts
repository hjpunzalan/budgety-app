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

interface PathElement extends SVGPathElement {
	_current: PieArcDatum<BudgetCategoryData>;
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
		const colour = d3.scaleOrdinal(
			component.props.type === PieGraphType.income
				? d3.schemeSet2
				: d3.schemeSet1
		);

		//////////////////////////////////////// TWEENS //////////////////////////////////////////
		const arcTweenEnter = (d: PieArcDatum<BudgetCategoryData>) => {
			let i = d3.interpolate(d.endAngle, d.startAngle);

			return function(t: number) {
				d.startAngle = i(t);
				return String(arcPath(d));
			};
		};

		const arcTweenExit = (d: PieArcDatum<BudgetCategoryData>) => {
			let i = d3.interpolate(d.startAngle, d.endAngle);

			return function(t: number) {
				d.startAngle = i(t);
				return String(arcPath(d));
			};
		};
		// use function keyword so 'this' will be dynamically scoped
		// Using updated data
		function arcTweenUpdate(
			this: PathElement,
			d: PieArcDatum<BudgetCategoryData>
		) {
			// interpolate between the two objects and not just angles because interpolation may happen in two of the angles or one
			let i = d3.interpolate(this._current, d);

			// update the current prop with the new updated data for future changes
			// Initialise a value
			// Will be replaced as data from enter selection
			// Update will compare new data from current one
			this._current = i(1); // or d

			return function(t: number) {
				return String(arcPath(i(t)));
			};
		}
		////////////////////////////////////////////////////////////////////////////////////////////////

		const graph = d3
			.select(component.canvas.current)
			.select("svg")
			.select("g");
		// Update data
		const slice = graph.selectAll("g.slice").data(pie(data));

		////////////////////////// Handle current selection//////////////////////////////
		// Updates labels
		slice
			.select("text")
			.transition()
			.duration(750)
			.attr("text-anchor", "middle")
			.attr("transform", d => `translate(${arcPath.centroid(d)})`)
			.text(d => budget.categories[d.data._id.category])
			.attr("class", classes.labels);

		slice
			.select<PathElement>("path")
			.attr("d", arcPath)
			.attr("fill", d => colour(budget.categories[d.data._id.category])) // update colours
			.transition()
			.duration(750)
			.attrTween("d", arcTweenUpdate);

		/////////////////////////// Handle exit selection/////////////////////////

		slice
			.exit<PieArcDatum<BudgetCategoryData>>()
			.select("path")
			.transition()
			.duration(750) // 750ms
			.attrTween("d", arcTweenExit)
			.remove();

		slice
			.exit()
			.select("text")
			.remove();
		slice
			.exit()
			.transition()
			.duration(750)
			.remove();
		/////////////////////////// Handle enter selection///////////////////////
		const newSlice = slice
			.enter()
			.append("g")
			.attr("class", "slice");

		newSlice
			.append<PathElement>("path")
			.attr("d", arcPath)
			.attr("stroke", "#fff")
			.attr("stroke-width", 2)
			.attr("fill", d => colour(budget.categories[d.data._id.category]))
			.style("cursor", "pointer")
			.each(function(d) {
				this._current = d;
			})
			.transition()
			.duration(750) // 750ms
			.attrTween("d", arcTweenEnter);

		// Add mouse events
		newSlice
			.select("path")
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
			.transition()
			.duration(750)
			.attr("text-anchor", "middle")
			.attr("transform", d => `translate(${arcPath.centroid(d)})`)
			.text(d => budget.categories[d.data._id.category])
			.attr("class", classes.labels);
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
