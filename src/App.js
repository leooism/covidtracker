import React, { useState, useEffect } from "react";
import "./App.css";

import {
	MenuItem,
	FormControl,
	Select,
	Card,
	CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import { sortData } from "./util.js";
import Table from "./Table";
import LineGraph from "./LineGraph";
import { prettyPrintStat } from "./util.js";

// import "leaflet/dist/leaflet.css";
function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState("worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [casesType, setCasesType] = useState("cases");

	const onCountryChange = async (e) => {
		const countryCode = e.target.value;
		setCountry(countryCode);
		const url =
			countryCode === "worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;
		await fetch(url)
			.then((res) => res.json())
			.then((data) => {
				setCountry(countryCode);
				setCountryInfo(data);
				setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setMapZoom(4);
			});
	};

	useEffect(() => {
		//The code inside here will run once
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));
					const sortedData = sortData(data);
					setTableData(sortedData);
					setCountries(countries);
					setMapCountries(data);
				});
		};
		getCountriesData();
		//When the component loads and not again
	}, []);
	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((res) => res.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);
	return (
		<div className="app">
			{/* Header  */}
			<div className="app__left">
				<div className="app__header">
					<h1>COVID-19 TRACKER</h1>
					<FormControl className="app__dropdown">
						<Select
							variant="outlined"
							onChange={onCountryChange}
							value={country}
						>
							<MenuItem value="worldwide">WorldWide</MenuItem>
							{countries.map((el) => (
								<MenuItem value={el.value}>{el.name}</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="app__stats">
					<InfoBox
						title="Coronavirus Cases"
						cases={prettyPrintStat(countryInfo.todayCases)}
						total={prettyPrintStat(countryInfo.cases)}
						onClick={(e) => setCasesType("cases")}
					/>

					<InfoBox
						title="Recovered Cases"
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						total={prettyPrintStat(countryInfo.recovered)}
						onClick={(e) => setCasesType("recovered")}
					/>

					<InfoBox
						title="Death Cases"
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						total={prettyPrintStat(countryInfo.deaths)}
						onClick={(e) => setCasesType("deaths")}
					/>
				</div>
				<Map
					countries={mapCountries}
					center={mapCenter}
					zoom={mapZoom}
					casesType={casesType}
				/>
			</div>
			<Card className="app__right">
				<CardContent>
					<h3>Live Cases by Country</h3>
					{/* Table */}
					<Table countries={tableData} />
					<h3>Worldwide new cases</h3>
					<LineGraph casesType={casesType} />

					{/* Graph */}
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
