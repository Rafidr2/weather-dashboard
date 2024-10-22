import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './components/NavBar';
import SummaryCard from './components/SummaryCard';
import WeatherTable from './components/WeatherTable';
import './App.css';

const cityCoordinates = [
  { city: "Raleigh,NC", lat: 35.7796, lon: -78.6382 },
  { city: "New York,NY", lat: 40.7128, lon: -74.0060 },
  { city: "Los Angeles,CA", lat: 34.0522, lon: -118.2437 },
  { city: "Chicago,IL", lat: 41.8781, lon: -87.6298 },
  { city: "Houston,TX", lat: 29.7604, lon: -95.3698 },
  { city: "Phoenix,AZ", lat: 33.4484, lon: -112.0740 },
  { city: "Philadelphia,PA", lat: 39.9526, lon: -75.1652 },
  { city: "San Antonio,TX", lat: 29.4241, lon: -98.4936 },
  { city: "San Diego,CA", lat: 32.7157, lon: -117.1611 },
  { city: "Dallas,TX", lat: 32.7767, lon: -96.7970 },
];

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempFilter, setTempFilter] = useState("all");
  const [weatherFilter, setWeatherFilter] = useState("all");
  const [lowestTemp, setLowestTemp] = useState(null);
  const [highestTemp, setHighestTemp] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherPromises = cityCoordinates.map(({ lat, lon }, index) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(axios.get(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=c8e6c237107a43c0add3fbd373e3aea2`));
            }, index * 1000); // 1 second delay between requests
          })
        );
    
        const responses = await Promise.all(weatherPromises);
        const data = responses.map(response => response.data.data[0]);
        
        setWeatherData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error.response ? error.response.data : error.message);
      }
    };
    

    fetchWeather();
  }, []);

  // Update summary temperatures and filter data
  const updateSummaryTemperatures = (data) => {
    if (data.length > 0) {
      const temps = data.map(location => location.temp);
      setLowestTemp(Math.min(...temps));
      setHighestTemp(Math.max(...temps));
    } else {
      setLowestTemp(null);
      setHighestTemp(null);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    filterData(searchValue, tempFilter, weatherFilter);
  };

  // Handle temperature filter
  const handleTempFilter = (e) => {
    const selectedTemp = e.target.value;
    setTempFilter(selectedTemp);
    filterData(searchTerm, selectedTemp, weatherFilter);
  };

  // Handle weather condition filter
  const handleWeatherFilter = (e) => {
    const selectedWeather = e.target.value;
    setWeatherFilter(selectedWeather);
    filterData(searchTerm, tempFilter, selectedWeather);
  };

  // Filter data based on search term, temp filter, and weather filter
  const filterData = (searchValue, tempFilter, weatherFilter) => {
    let filtered = weatherData;

    // Filter by search term (city name)
    if (searchValue) {
      filtered = filtered.filter(location =>
        location.city_name.toLowerCase().includes(searchValue)
      );
    }

    // Filter by temperature
    if (tempFilter !== "all") {
      filtered = filtered.filter(location => {
        const temp = location.temp;
        if (tempFilter === "below50") return temp < 50;
        if (tempFilter === "50to70") return temp >= 50 && temp <= 70;
        if (tempFilter === "above70") return temp > 70;
        return true;
      });
    }

    // Filter by weather condition
    if (weatherFilter !== "all") {
      filtered = filtered.filter(location =>
        location.weather.description.toLowerCase().includes(weatherFilter)
      );
    }

    setFilteredData(filtered);
    updateSummaryTemperatures(filtered);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString();
  };

  return (
    <div className="dashboard-container">
      <NavBar />
      
      <div className="main-content">
        {/* Summary cards */}
        <div className="summary-cards">
          <SummaryCard title="Lowest Temperature" value={lowestTemp !== null ? `${lowestTemp} °F` : "N/A"} />
          <SummaryCard title="Highest Temperature" value={highestTemp !== null ? `${highestTemp} °F` : "N/A"} />
          <SummaryCard title="Current Time" value={getCurrentTime()} />
        </div>
        
        {/* Search and filter options */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search by location"
            value={searchTerm}
            onChange={handleSearch}
          />
          
          <select onChange={handleTempFilter} value={tempFilter}>
            <option value="all">All Temperatures</option>
            <option value="below50">Below 50°F</option>
            <option value="50to70">50°F to 70°F</option>
            <option value="above70">Above 70°F</option>
          </select>

          <select onChange={handleWeatherFilter} value={weatherFilter}>
            <option value="all">All Weather Conditions</option>
            <option value="clear">Clear</option>
            <option value="rain">Rain</option>
            <option value="clouds">Cloudy</option>
          </select>
        </div>

        {/* Weather data table */}
        <WeatherTable filteredData={filteredData} />
      </div>
    </div>
  );
};

export default App;