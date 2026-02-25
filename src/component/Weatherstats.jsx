import { useState } from "react";
const DELHI = { lat: 28.6139, lon: 77.2090 };
function median(values) {
  if (!values.length) return null;
  const a = [...values].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}
function Weatherstats() {
  const [year, setYear] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
   const fetchStats = async () => {
    const y = Number(year);
    if (!y) {
      alert("Enter a year");
      return;
    }
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const start = `${y}-01-01`;
      const end = `${y}-12-31`;
      const url =
        `https://archive-api.open-meteo.com/v1/archive` +
        `?latitude=${DELHI.lat}&longitude=${DELHI.lon}` +
        `&start_date=${start}&end_date=${end}` +
        `&daily=temperature_2m_mean` +
        `&timezone=Asia%2FKolkata`;
      const response = await fetch(url);
      const data = await response.json();
      const d = data.daily;
      if (!d || !d.time || d.time.length === 0) {
        setError("No data available for this year.");
        setLoading(false);
        return;
      }
      const monthMap = {};
      d.time.forEach((t, i) => {
        const m = t.slice(5, 7);
        const temp = d.temperature_2m_mean?.[i];
        if (temp === null || temp === undefined) return;
        if (!monthMap[m]) monthMap[m] = [];
        monthMap[m].push(temp);
      });
      const rows = [];
      for (let i = 1; i <= 12; i++) {
        const mm = String(i).padStart(2, "0");
        const temps = monthMap[mm] || [];

        if (!temps.length) {
          rows.push({ month: mm, min: "N/A", median: "N/A", max: "N/A" });
        } else {
          const sorted = [...temps].sort((a, b) => a - b);
          rows.push({
            month: mm,
            min: Math.round(sorted[0] * 10) / 10,
            median: Math.round(median(sorted) * 10) / 10,
            max: Math.round(sorted[sorted.length - 1] * 10) / 10,
          });
        }
      }
     setResults(rows);
    } catch (e) {
      setError("Network error. Try again.");
    }
     setLoading(false);
  };
   return (
    <div>
      <h2>Temperature Stats by Year</h2>
      <input
        type="number"
        placeholder="Enter year (e.g. 2015)"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
    <button onClick={fetchStats}>Get Stats</button>
    {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Min</th>
              <th>Median</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={index}>
                <td>{item.month}</td>
                <td>{item.min}</td>
                <td>{item.median}</td>
                <td>{item.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default Weatherstats;