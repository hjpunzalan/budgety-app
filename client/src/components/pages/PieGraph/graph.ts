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

export const graph = (component: PieGraph, size: number, extraSpace: number, legendHeight: number) => {
	const dims = { height: size, width: size, radius: size / 2 }; // dimension of the pie chart
	const legendBoxSize = 10;

	// Locate budget by budget ID to retrieve its categories
	const budget = component.props.currentBudget;
	let data = component.props.pieGraph;
	const type = component.props.type;

	// Remove null values from graph
	if (type === PieGraphType.income) {
		// Remove slices
		data = component.props.pieGraph.filter(d => d.income !== 0);
	} else data = component.props.pieGraph.filter(d => d.expense !== 0);

	// To find total amount
	let totalAmount = 0;
	if (data.length > 0)
		totalAmount = data.map(m => m[type]).reduce((acc, val) => acc + val);

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
			component.props.type === PieGraphType.expense
				? [
					"#fbb4ae",
					"#b3cde3",
					"#ccebc5",
					"#decbe4",
					"#fed9a6",
					"#ffffcc",
					"#e5d8bd",
					"#fddaec"
				]
				: [
					"#b3e2cd",
					"#fdcdac",
					"#cbd5e8",
					"#f4cae4",
					"#e6f5c9",
					"#fff2ae",
					"#f1e2cc",
					"#cccccc"
				]
		);

		//////////////////////////////////////// TWEENS //////////////////////////////////////////
		const arcTweenEnter = (d: PieArcDatum<BudgetCategoryData>) => {
			let i = d3.interpolate(d.endAngle, d.startAngle);

			return function (t: number) {
				d.startAngle = i(t);
				return String(arcPath(d));
			};
		};

		const arcTweenExit = (d: PieArcDatum<BudgetCategoryData>) => {
			let i = d3.interpolate(d.startAngle, d.endAngle);

			return function (t: number) {
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

			return function (t: number) {
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
		// Updates labels/ legend
		slice
			.select("text")
			.attr("transform", (d, i) => `translate(${-size / 3 + extraSpace},${i * 20 - size / 2 - legendHeight + extraSpace / 2})`)
			.text(d => budget.categories[d.data._id.category] + ` (${((100 * d.data[type]) / totalAmount).toFixed(0)}%)`)
			.attr("class", classes.labels);


		slice
			.select("rect") // make a matching color rect
			.attr("width", legendBoxSize)
			.attr("height", legendBoxSize)
			.attr("fill", (d, i) => colour(budget.categories[d.data._id.category]))
			.attr("transform", (d, i) => `translate(${-size / 3 + extraSpace - 1.5 * legendBoxSize},${i * 20 - size / 2 - legendHeight + extraSpace / 2 - legendBoxSize})`)

		// Update path and fill colour with animation
		slice
			.select<PathElement>("path")
			.attr("d", arcPath)
			.attr("fill", d => colour(budget.categories[d.data._id.category])) // update colours
			.transition()
			.duration(750)
			.attrTween("d", arcTweenUpdate);

		// Update tooltip data and position
		// Handles real-time event movement
		slice.on("mousemove", d => {
			d3.select(component.tooltip.current)
				.style("left", d.event.pageX + 15 + "px")
				.style("top", d.event.pageY + "px")
				.select("#pieGraphTip")
				.text(
					`${budget.categories[d.data._id.category]}: ${checkAmount(
						Math.abs(d.data[type])
					)} (${((100 * d.data[type]) / totalAmount).toFixed(0)}%)
						`
				);
		});

		/////////////////////////// Handle exit selection/////////////////////////
		// Remove each slice
		slice
			.exit<PieArcDatum<BudgetCategoryData>>()
			.select("path")
			.transition()
			.duration(750) // 750ms
			.attrTween("d", arcTweenExit)
			.remove()

		// Remove text label on graph
		slice
			.exit()
			.select("text")
			.remove()


		slice
			.exit()
			.select("rect")
			.remove()

		slice.exit().remove()

		/////////////////////////// Handle enter selection///////////////////////
		const newSlice = slice
			.enter()
			.append("g")
			.attr("class", "slice");

		newSlice
			.append<PathElement>("path")
			.attr("d", arcPath)
			.attr("stroke", "#fff")
			.attr("stroke-width", 3)
			.attr("fill", d => colour(budget.categories[d.data._id.category]))
			.style("cursor", "pointer")
			.each(function (d) {
				this._current = d;
			})
			.transition()
			.duration(750) // 750ms
			.attrTween("d", arcTweenEnter);

		// Add mouse events for tooltip on balance and %
		// Tool tip connected to component PieGraph
		// Tool tip positioning depents on mouse position
		newSlice
			.on("mouseover", () => {
				d3.select(component.tooltip.current)
					.style("opacity", 1)
					.style("color", type === PieGraphType.income ? "green" : "red");
			})
			.on("mousemove", d => {
				d3.select(component.tooltip.current)
					.style("left", d.event.pageX + 15 + "px")
					.style("top", d.event.pageY + "px")
					.select("#pieGraphTip")
					.text(
						`${budget.categories[d.data._id.category]}: ${checkAmount(
							Math.abs(d.data[type])
						)} (${((100 * d.data[type]) / totalAmount).toFixed(0)}%)
						`
					);
			})
			.on("mouseout", d =>
				d3.select(component.tooltip.current).style("opacity", 0)
			);

		newSlice
			.append("text")
			.attr("transform", (d, i) => `translate(${-size / 3 + extraSpace},${i * 20 - size / 2 - legendHeight + extraSpace / 2})`)
			.text(d => budget.categories[d.data._id.category] + ` (${((100 * d.data[type]) / totalAmount).toFixed(0)}%)`)
			.attr("class", classes.labels);


		newSlice
			.append("rect") // make a matching color rect
			.attr("width", legendBoxSize)
			.attr("height", legendBoxSize)
			.attr("fill", (d, i) => colour(budget.categories[d.data._id.category]))
			.attr("transform", (d, i) => `translate(${-size / 3 + extraSpace - 1.5 * legendBoxSize},${i * 20 - size / 2 - legendHeight + extraSpace / 2 - legendBoxSize})`)

	};



	// Remove graph if there's no amount depending on type
	if (data.length === 0) {
		component.setState({
			removeGraph: true
		});
	} else if (data.length > 0 && component.state.removeGraph) {
		// IF removeGraph was previously true
		// Add graph if there is amount and was removed before
		// dims === size
		const centre = {
			x: (dims.width + extraSpace) / 2,
			y: (dims.height + extraSpace) / 2
		};

		component.setState(
			{
				removeGraph: false
			},
			() => {
				// Initialise canvas
				d3.select(component.canvas.current)
					.append("svg")
					.attr("width", dims.width + extraSpace)
					.attr("height", dims.height + legendHeight + extraSpace)
					.append("g")
					.attr("transform", `translate(${centre.x}, ${centre.y + legendHeight})`)

				renderPieGraph();
			}
		);
	} else renderPieGraph(); // Normally render the graph
};
