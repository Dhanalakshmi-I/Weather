import { useState } from "react";
const DELHI = { lat: 28.6139, lon: 77.2090 };
function lastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate(); // month 1-12
}
function WeatherByMonth() {
  const [year, setYear] = useState("2020");
  const [month, setMonth] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchWeather = async () => {
    const m = Number(month);
    const y = Number(year);
    if (!y) return alert("Enter year");
    if (!m || m < 1 || m > 12) {
      alert("Enter month (1-12)");
      return;
    }
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const mm = String(m).padStart(2, "0");
      const start = `${y}-${mm}-01`;
      const end = `${y}-${mm}-${String(lastDayOfMonth(y, m)).padStart(2, "0")}`;
  const url =
        `https://archive-api.open-meteo.com/v1/archive` +
        `?latitude=${DELHI.lat}&longitude=${DELHI.lon}` +
        `&start_date=${start}&end_date=${end}` +
        `&daily=temperature_2m_mean,relative_humidity_2m_mean,pressure_msl_mean` +
        `&timezone=Asia%2FKolkata`;
        const response = await fetch(url);
        const data = await response.json();
        const d = data.daily;
      if (!d || !d.time || d.time.length === 0) {
        setError("No data available for this month.");
        setLoading(false);
        return;
      }
        const rows = d.time.map((t, i) => ({
        date: t,
        temperature: d.temperature_2m_mean?.[i],
        humidity: d.relative_humidity_2m_mean?.[i],
        pressure: d.pressure_msl_mean?.[i],
      }));
     setResults(rows);
    } catch (e) {
      setError("Network error. Try again.");
    }
      setLoading(false);
  };
  return (
    <div>
      <h2>Search Weather by Month</h2>
      <input
        type="number"
        placeholder="Enter year (e.g. 2015)"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        style={{ width: 160 }}/>
     <input
        type="number"
        placeholder="Enter month (1-12)"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        style={{ width: 160, marginLeft: 10 }}/>
    <button onClick={fetchWeather}>Search</button>
        {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
   {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temp (mean)</th>
              <th>Humidity (mean)</th>
              <th>Pressure (mean)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.temperature ?? "N/A"}</td>
                <td>{item.humidity ?? "N/A"}</td>
                <td>{item.pressure ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WeatherByMonth;