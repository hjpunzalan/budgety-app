import React, { Component } from "react";
import { select } from "d3";

interface Props {}
interface State {}

class BarGraph extends Component<Props, State> {
	private canvas: React.RefObject<HTMLCanvasElement>;
	constructor(props: Props) {
		super(props);
		this.canvas = React.createRef();
	}

	componentDidMount() {
		const margin = { top: 40, right: 20, bottom: 50, left: 100 }; // give space to axis
		const graphWidth = 560 - margin.left - margin.left - margin.right;
		const graphHeight = 400 - margin.top - margin.bottom;

		const svg = select(this.canvas.current)
			.append("svg")
			.attr("width", graphWidth + margin.left + margin.right)
			.attr("height", graphHeight + margin.bottom + margin.top);

		const graph = svg
			.append("g")
			.attr("width", graphWidth)
			.attr("height", graphHeight)
			.attr("transform", `translate(${margin.left}, ${margin.top})`);
	}

	render() {
		return <canvas ref={this.canvas}></canvas>;
	}
}

export default BarGraph;
