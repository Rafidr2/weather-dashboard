import React from 'react';

const WeatherTable = ({ filteredData }) => {
  return (
    <div className="weather-table">
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>Temperature (°C)</th>
            <th>Weather Condition</th>
            {/* Removed Date header */}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((data) => (
            <tr key={data.city_name}>
              <td>{data.city_name}</td>
              <td>{data.temp} °C</td>
              <td>{data.weather.description}</td>
              {/* Removed Date cell */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeatherTable;
