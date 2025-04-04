const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;
const WINDOW_SIZE = 10;
const numberStorage = [];

const API_ENDPOINTS = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

app.get("/numbers/:type", async (req, res) => {
  const type = req.params.type;
  
  if (!API_ENDPOINTS[type]) {
    return res.status(400).json({ error: "Invalid number type" });
  }

  try {
    const response = await axios.get(API_ENDPOINTS[type], { timeout: 500 });
    const newNumbers = response.data.numbers || [];

    
    const uniqueNumbers = newNumbers.filter(n => !numberStorage.includes(n));

    
    const prevWindow = [...numberStorage];
    numberStorage.push(...uniqueNumbers);
    while (numberStorage.length > WINDOW_SIZE) {
      numberStorage.shift();
    }

    const avg = numberStorage.length > 0 ? 
      (numberStorage.reduce((sum, num) => sum + num, 0) / numberStorage.length).toFixed(2) 
      : 0;

    res.json({
      windowPrevState: prevWindow,
      windowCurrState: [...numberStorage],
      numbers: newNumbers,
      avg: parseFloat(avg)
    });

  } catch (error) {
    res.status(500).json({ error: "Error fetching numbers" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
