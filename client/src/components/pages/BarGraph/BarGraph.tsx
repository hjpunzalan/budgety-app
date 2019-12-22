import React, { Component } from "react";
import * as d3 from "d3";
import { select } from "d3";
import d3Tip from 'd3-tip'
import { ITransactionResult } from "../../../reducers/transactions";
import moment from "moment";
import classes from "./BarGraph.module.scss";
import { checkAmount } from "../../utils/CheckAmount";

interface Props {
	transactions: ITransactionResult[];
}
interface State {}

class BarGraph extends Component<Props, State> {
	canvas = React.createRef<HTMLDivElement>();

	componentDidMount() {
		const data = this.props.transactions;

		const margin = {
			top: 10,
			right: 10,
			bottom: 25,
			left: 100
		};

		const width = this.canvas.current
		? this.canvas.current.offsetWidth
		: 800;
		const height = this.canvas.current
		? this.canvas.current.offsetHeight
		: 500;
		
		const barSpacing = 10;
		// Selectors
		const svg = select(this.canvas.current)
			.append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr(
				"viewBox",
				`0 0 ${width}  ${height}`
			)
			.attr("preserveAspectRatio", "xMinYMin meet");
		
		const canvasWidth = svg.node()?.getBoundingClientRect().width || 800;
		const canvasHeight = svg.node()?.getBoundingClientRect().height || 500

				// give space to axis
		const graphWidth = canvasWidth - margin.left - margin.right;
		const graphHeight = canvasHeight - margin.top - margin.bottom;

		const graph = svg
			.append("g")
			.attr("width", graphWidth)
			.attr("height", graphHeight)
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		const xAxisGroup = graph
			.append("g")
			.attr("transform", `translate(0,${graphHeight})`)
			.style("font-size", "12px");
		const yAxisGroup = graph.append("g").style("font-size", "12px");

		// scales for data
		const y = d3.scaleLinear().range([graphHeight, 0]);

		const x = d3.scaleBand<number>().range([0, graphWidth]);

		// Set domains
		const xMax = d3.max(data, d => d.transactions[0].balance);
		y.domain([0, xMax as number]);
		x.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

		// Prevent empty value max tick
		const ticks = y.ticks(),
			lastTick = ticks[ticks.length - 1],
			newLastTick = lastTick + (ticks[1] - ticks[0]);
		// If last tick is lower than max value
		if (lastTick < y.domain()[1]) {
			ticks.push(newLastTick);
		}
		// Set new domain with new max value tick
		y.domain([y.domain()[0], newLastTick]);

		// create the axis
		const xAxis = d3
			.axisBottom(x)
			.tickFormat(d => moment(d.toString(), "MM").format("MMM"));
		const yAxis = d3
			.axisLeft(y)
			.ticks(3)
			.tickValues(ticks)
			.tickFormat(d => "$" + d);
		
		// Mousseover tooltip
		const tip = (d3Tip as Function)()
			.attr('class', classes.toolTip)
			.offset([-10,0])
		.html((d: ITransactionResult) => {
			return `<div><strong>Balance: </strong> <span>${checkAmount(d.transactions[0].balance)}</span></div>
					<div><strong>Income: </strong> <span>${checkAmount(d.income)}</span></div>
					<div><strong>Expense: </strong> <span>${checkAmount(d.expense)}</span></div>
			
			`
		});
	graph.call(tip); // apply tip to all graph group
		
		// Enter selection
		graph
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("fill", "rgb(0, 153, 255)")
			.attr("x", d => {
				const val = x(d._id.month);
				if (val) return val;
				else return d._id.month;
			})
			// Creates space based on index
			.attr("width", graphWidth / 12 - barSpacing)
			.attr("y", d => y(d.transactions[0].balance))
			.attr("height", d => graphHeight - y(d.transactions[0].balance))
			.style('cursor', 'pointer')
			.on('mouseover',function(d){tip.show(d, this)})
			.on('mouseout', function(d) { tip.hide(d,this)})

		// Call axis
		xAxisGroup.call(xAxis);
		yAxisGroup.call(yAxis);
	}

	render() {
		return <div className={classes.canvas} ref={this.canvas}></div>;
	}
}

export default BarGraph;
