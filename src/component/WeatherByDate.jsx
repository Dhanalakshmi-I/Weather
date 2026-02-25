import { useState } from "react";
const DELHI = { lat: 28.6139, lon: 77.2090 };
function WeatherByDate() {
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const avg = (arr) => {
  const valid = (arr || []).filter((x) => x !== null && x !== undefined && !Number.isNaN(x));
    if (!valid.length) return null;
    const sum = valid.reduce((s, v) => s + v, 0);
    return Math.round((sum / valid.length) * 10) / 10;
  };
    const mode = (arr) => {
    const valid = (arr || []).filter((x) => x !== null && x !== undefined);
    if (!valid.length) return null;
    const map = new Map();
    valid.forEach((v) => map.set(v, (map.get(v) || 0) + 1));
    let best = valid[0], bestCount = 0;
    for (const [k, c] of map.entries()) {
      if (c > bestCount) { best = k; bestCount = c; }
    }
    return best;
  };
   const fetchWeather = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const url =
        `https://archive-api.open-meteo.com/v1/archive` +
        `?latitude=${DELHI.lat}&longitude=${DELHI.lon}` +
        `&start_date=${date}&end_date=${date}` +
        `&hourly=temperature_2m,relative_humidity_2m,pressure_msl,weather_code` +
        `&timezone=Asia%2FKolkata`;
      const response = await fetch(url);
      const data = await response.json();
      const h = data.hourly;
      if (!h || !h.time || h.time.length === 0) {
        setError("No data available for this date.");
        setLoading(false);
        return;
      }
      const code = mode(h.weather_code);
      const condition = code === 0 ? "Clear" : code === 3 ? "Cloudy" : "Normal";
      setResult({
        condition,
        temperature: avg(h.temperature_2m),
        humidity: avg(h.relative_humidity_2m),
        pressure: avg(h.pressure_msl),
      });
    } catch (e) {
      setError("Network error. Try again.");
    }
      setLoading(false);
  };
   return (
    <div>
      <h2>Search Weather by Date</h2>
      <input
        type="date"
        value={date}
        max={new Date().toISOString().split("T")[0]}
        onChange={(e) => setDate(e.target.value)}/>
      <button onClick={fetchWeather}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div className="result">
          <p>Condition: {result.condition}</p>
          <p>Temperature: {result.temperature ?? "N/A"} °C</p>
          <p>Humidity: {result.humidity ?? "N/A"} %</p>
          <p>Pressure: {result.pressure ?? "N/A"} hPa</p>
        </div>
      )}
    </div>
  );
}
export default WeatherByDate;