import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";
const casesTypeColor = {
	cases: {
		hex: "#CC1034",
		rgb: "rgb(204, 16, 52)",
		half_op: "rgba(204, 16, 52, 0.5)",
		multiplayer: 800,
	},
	recovered: {
		hex: "#7dd71d",
		rgb: "rgb(125, 215, 29)",
		half_op: "rgba(125, 125, 29, 0.5)",
		multiplayer: 1200,
	},
	deaths: {
		hex: "#fb4443",
		rgb: "rgb(251, 68, 67)",
		half_op: "rgba(251, 68, 67, 0.5)",
		multiplayer: 2000,
	},
};
export const sortData = (data) => {
	const sortedData = [...data];
	sortedData.sort((a, b) => b.cases - a.cases);
	return sortedData;
};
export const showDataOnMap = (data, caseType = "cases") =>
	data.map((country) => (
		<Circle
			center={[country.countryInfo.lat, country.countryInfo.long]}
			fillOpacity={0.4}
			color={casesTypeColor[caseType.hex]}
			radius={
				Math.sqrt(country[caseType]) * casesTypeColor[caseType].multiplayer
			}
		>
			<Popup>
				<div className="info-container">
					<div
						className="info-flag"
						style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
					/>
					<div className="info-country">{country.country}</div>
					<div className="info-cases">
						Cases: {numeral(country.cases).format("0, 0")}
					</div>
					<div className="info-recovered">
						Recovered:{numeral(country.recovered).format("0, 0")}{" "}
					</div>
					<div className="info-deaths">
						Deaths:{numeral(country.deaths).format("0, 0")}{" "}
					</div>
				</div>
			</Popup>
		</Circle>
	));
export const prettyPrintStat = (stat) =>
	stat ? `+${numeral(stat).format("0.0a")}` : "+0";
