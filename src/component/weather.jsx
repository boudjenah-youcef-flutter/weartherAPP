import './weather.css';
import search from '../assets/search.png';
import clear from '../assets/clear.png';
import cloud from '../assets/cloud.png';
import drizzle from '../assets/drizzle.png';
import humidity from '../assets/humidity.png';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';
import wind from '../assets/wind.png';
import { useEffect, useState } from 'react';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null); // State for weather data
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [isLoading, setIsLoading] = useState(false); // State for loading dialog

  const allcode = {
    '01d': clear,
    '01n': clear,
    '02d': cloud,
    '02n': cloud,
    '03d': cloud,
    '03n': cloud,
    '04d': drizzle,
    '04n': drizzle,
    '09d': rain,
    '09n': rain,
    '10d': rain,
    '10n': rain,
    '13d': snow,
    '13n': snow,
  };

  const searchData = async (city) => {
    setIsLoading(true); // Show loading dialog
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const icon = allcode[data.weather[0].icon] || cloud; // Default to cloud if icon not found
        setWeatherData({
          humidity: data.main.humidity,
          windspeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: icon,
        });
      } else {
        console.error(data.message); // Handle API errors
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false); // Hide loading dialog
    }
  };

  useEffect(() => {
    searchData('london'); // Fetch initial weather data
  }, []);

  const handleSearch = () => {
    if (searchInput.trim()) {
      searchData(searchInput);
    }
  };

  return (
    <div className="weather">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <img
          src={search}
          alt="Search Icon"
          onClick={handleSearch} // Trigger search on click
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Loading Dialog */}
      {isLoading && (
        <div className="loading-dialog">
          <p>Loading...</p>
        </div>
      )}

      {!isLoading && weatherData ? (
        <>
          {/* Weather Icon */}
          <img src={weatherData.icon} alt="Weather Icon" />

          {/* Weather Info */}
          <div className="body">
            <h1>{weatherData.temperature}°C</h1>
            <p>{weatherData.location}</p>
          </div>

          {/* Weather Details */}
          <div className="block">
            {/* Humidity Block */}
            <div className="detail-block">
              <img src={humidity} alt="Humidity Icon" />
              <div className="texti">
                <p>{weatherData.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>

            {/* Wind Speed Block */}
            <div className="detail-block">
              <img src={wind} alt="Wind Speed Icon" />
              <div className="texti">
                <p>{weatherData.windspeed} km/h</p>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        !isLoading && <p>No data available. Please search for a city.</p>
      )}
    </div>
  );
};

export default Weather;
