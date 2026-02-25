import WeatherByDate from "./component/WeatherByDate";
import WeatherByMonth from "./component/WeatherByMonth";
import WeatherStats from "./component/Weatherstats";
import WeatherSearch from "./component/WeatherSearch";
import "./App.css";
function App() {
  return (
    <div className="container">
      <h1>Delhi Weather Dashboard</h1>
      <div className="box">
        <WeatherSearch />
      </div>
      <div className="box">
        <WeatherByDate />
      </div>
       
      <div className="box">
        <WeatherByMonth />
      </div>

      <div className="box">
        <WeatherStats />
      </div>
    </div>
  );
}

export default App;