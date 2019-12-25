import React, { Component } from "react";
import * as d3 from "d3";
import { PieArcDatum } from "d3";
import { BudgetCategoryData } from "../../../reducers/charts";
import { IBudget } from "../../../actions";

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
	state = {};

	componentDidMount() {
		const { month, year, budgetId } = this.props;
		if (budgetId) {
			this.props.getCategoryData(budgetId, month, year).then(() => {
				const budget = this.props.budgets.filter(
					b => b._id === this.props.budgetId
				)[0];
				const data = this.props.pieGraph;
				const type = this.props.type;
				const dims = { height: 300, width: 300, radius: 150 }; // dimension of the pie chart
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

				const graph = svg
					.append("g")
					.attr("transform", `translate(${centre.x}, ${centre.y})`);

				const pie = d3
					.pie<BudgetCategoryData>()
					.sort(null) // prevents default sorting
					.value(d => d[type]);

				const arcPath = d3
					.arc<PieArcDatum<BudgetCategoryData>>()
					.outerRadius(dims.radius);

				// ordinal scale
				const colour = d3.scaleOrdinal(d3["schemeSet2"]);

				// update colour scale domain
				colour.domain(data.map(d => budget.categories[d._id.category]));

				// join enhanced (pie) data to path element
				const paths = graph.selectAll("path").data(pie(data));
				console.log(data);
				console.log(pie(data));

				// handle enter selection
				paths
					.enter()
					.append("path")
					.attr("class", "arc")
					.attr("stroke", "#fff")
					.attr("stroke-width", 3)
					.attr("fill", d => colour(budget.categories[d.data._id.category]));
			});
		}
	}

	render() {
		return <div ref={this.canvas}></div>;
	}
}

export default PieGraph;
