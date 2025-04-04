import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:9876/numbers";

function App() {
  const [numberType, setNumberType] = useState("p");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNumbers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/${numberType}`);
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch numbers");
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Average Calculator Microservice</h1>
      <select onChange={(e) => setNumberType(e.target.value)} value={numberType}>
        <option value="p">Prime</option>
        <option value="f">Fibonacci</option>
        <option value="e">Even</option>
        <option value="r">Random</option>
      </select>
      <button onClick={fetchNumbers} style={{ marginLeft: "10px" }}>Fetch Numbers</button>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div style={{ marginTop: "20px" }}>
          <h3>Previous Window</h3>
          <p>{JSON.stringify(data.windowPrevState)}</p>

          <h3>Current Window</h3>
          <p>{JSON.stringify(data.windowCurrState)}</p>

          <h3>Fetched Numbers</h3>
          <p>{JSON.stringify(data.numbers)}</p>

          <h2>Average: {data.avg}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
