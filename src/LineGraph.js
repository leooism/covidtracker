import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
	legend: {
		display: false,
	},
	elements: {
		point: {
			radius: 0,
		},
	},
	maintainAspectRatio: false,
	tooltips: {
		mode: "index",
		intersect: false,
		callbacks: {
			label: function (tooltipItem, data) {
				return numeral(tooltipItem.value).format("+0, 0");
			},
		},
	},
	scales: {
		xAxes: [
			{
				type: "time",
				time: {
					format: "MM/DD/YY",
					tooltipFormat: "ll",
				},
			},
		],
		yAxes: [
			{
				gridLines: {
					display: false,
				},
				ticks: {
					//Include a dollar sign in the ticks
					callback: function (value, index, values) {
						return numeral(value).format("0a");
					},
				},
			},
		],
	},
};
function LineGraph({ casesType = "cases" }) {
	const [data, setData] = useState([]);

	//https://disease.sh/v3/covid-19/historical/all?lastdays=120

	const buildChartData = (data, casesType = "cases") => {
		const chartData = [];
		let lastDataPoint;
		for (let date in data.cases) {
			if (lastDataPoint) {
				const newDataPoint = {
					x: date,
					y: data[casesType][date] - lastDataPoint,
				};

				chartData.push(newDataPoint);
			}
			lastDataPoint = data["cases"][date];
		}
		return chartData;
	};
	useEffect(() => {
		const fetchData = async () =>
			await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
				.then(res => res.json())
				.then(data => {
					const chartData = buildChartData(data, casesType);
					setData(chartData);
				});
		fetchData();
	}, [casesType]);
	return (
		<div>
			<Line
				data={{
					datasets: [
						{
							backgroundColor: "blue",
							borderColor: "#CC1034",
							data: data,
						},
					],
				}}
				options={options}
			/>
		</div>
	);
}

export default LineGraph;
