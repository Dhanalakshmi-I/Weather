import { useState } from "react";

function WeatherSearch() {
  const [city, setCity] = useState("Delhi");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const codeToCondition = (code) => {
    if (code === 0) return "Clear";
    if (code === 1 || code === 2) return "Partly Cloudy";
    if (code === 3) return "Cloudy";
    if (code === 45 || code === 48) return "Fog";
    if (code >= 51 && code <= 67) return "Drizzle/Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Showers";
    if (code >= 95) return "Thunderstorm";
    return "Weather";
  };

  const searchWeather = async () => {
    const q = city.trim();
    if (!q) {
      alert("Enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // 1) City -> Lat/Lon (Geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          q
        )}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found");
        setLoading(false);
        return;
      }

      const place = geoData.results[0];

      // 2) Current Weather (Forecast)
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,pressure_msl,weather_code`
      );
      const weatherData = await weatherRes.json();

      if (!weatherData.current) {
        setError("Weather data not available");
        setLoading(false);
        return;
      }

      const current = weatherData.current;

      setResult({
        location: `${place.name}, ${place.country}`,
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
        condition: codeToCondition(current.weather_code),
        time: current.time,
      });
    } catch (e) {
      setError("Network error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Search Weather by City </h2>

      <input
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={searchWeather}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className="weather-card">
          <h3>{result.location}</h3>
          <p><strong>Condition:</strong> {result.condition}</p>
          <p><strong>Temperature:</strong> {result.temperature} °C</p>
          <p><strong>Humidity:</strong> {result.humidity} %</p>
          <p><strong>Pressure:</strong> {result.pressure} hPa</p>
          <p style={{ fontSize: 12, color: "#555" }}>
            Time: {result.time}
          </p>
        </div>
      )}
    </div>
  );
}

export default WeatherSearch;