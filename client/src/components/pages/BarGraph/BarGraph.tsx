import React, { Component } from "react";
import * as d3 from "d3";
import { select } from "d3";
import { ITransactionResult } from "../../../reducers/transactions";
import moment from "moment";

interface Props {
	transactions: ITransactionResult[];
}
interface State {}

const margin = {
	top: 40,
	right: 20,
	bottom: 50,
	left: 100
};

// give space to axis
const graphWidth = 560 - margin.left - margin.right;
const graphHeight = 400 - margin.top - margin.bottom;

class BarGraph extends Component<Props, State> {
	canvas = React.createRef<HTMLDivElement>();

	componentDidMount() {
		const data = this.props.transactions;
		// Selectors
		const svg = select(this.canvas.current)
			.append("svg")
			.attr("width", graphWidth + margin.left + margin.right)
			.attr("height", graphHeight + margin.bottom + margin.top);

		const graph = svg
			.append("g")
			.attr("width", graphWidth)
			.attr("height", graphHeight);
		// .attr("transform", `translate(-${margin.left}, ${margin.top})`);

		const xAxisGroup = graph
			.append("g")
			.attr("transform", `translate(0,${graphHeight})`);
		const yAxisGroup = graph.append("g");

		// scales for data
		const y = d3.scaleLinear().range([graphHeight, 0]);

		const x = d3
			.scaleBand<number>()
			.range([0, 500])
			.paddingInner(0.2)
			.paddingOuter(0.2); //px

		// create the axis
		const xAxis = d3
			.axisBottom(x)
			.tickFormat(d => moment(d.toString(), "MM").format("MMM"));
		const yAxis = d3.axisLeft(y);

		// Set domains
		if (d3.max(data, d => d.transactions[0].balance))
			y.domain([0, d3.max(data, d => d.transactions[0].balance) as number]);
		x.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
		graph
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("fill", "orange")
			.attr("x", d => {
				const val = x(d._id.month);
				if (val) return val;
				else return d._id.month;
			})
			// Creates space based on index
			.attr("width", 50)
			.attr("y", d => y(d.transactions[0].balance))
			.attr("height", d => graphHeight - y(d.transactions[0].balance));

		// Call axis
		xAxisGroup.call(xAxis);
		yAxisGroup.call(yAxis);
	}

	render() {
		return <div ref={this.canvas}></div>;
	}
}

export default BarGraph;
