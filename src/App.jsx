import { useEffect, useState } from "react";
import currencyapi from "@everapi/currencyapi-js";

function App() {
  const [input, setInput] = useState(null);
  const [result, setResult] = useState(0);
  const [current, setCurrent] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [rate, setRate] = useState(1);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const client = new currencyapi(
          "cur_live_FkeobDbrLYABO8dd9e1SOdqE5feWenp5rbxVI9Ft"
        );

        const response = await client.currencies();

        if (response.data) {
          setCurrencies(Object.keys(response.data));
        } else {
          console.error("Invalid response:", response);
        }
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const client = new currencyapi(
          "cur_live_FkeobDbrLYABO8dd9e1SOdqE5feWenp5rbxVI9Ft"
        );

        const response = await client.latest({
          base_currency: current,
          currencies: to,
        });

        if (response.data && response.data[to]) {
          const conversionRate = response.data[to].value;
          setRate(conversionRate);
          setResult(input * conversionRate);
        } else {
          console.error("Invalid response:", response);
        }
      } catch (error) {
        console.error("Error fetching currency data:", error);
      }
    };

    if (input > 0) {
      fetchConversionRate();
    }
  }, [input, current, to]);

  return (
    <div className="container">
      <h1 className="heading">Currency Converter</h1>
      <div>
        <span>Enter the amount:</span>
        <input
          type="number"
          value={input || ""}
          placeholder="Enter amount"
          onChange={(e) => setInput(Number(e.target.value))}
          className="input"
        />
        <div>
          <span>Select your Currency:</span>
          <select
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="select"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span>Select the Currency to convert into:</span>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="select"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="result-box">
        <h2>Converted Amount:</h2>
        <span>
          {result.toFixed(2)} {to}
        </span>
        <div>Conversion Rate: {rate}</div>
      </div>
    </div>
  );
}

export default App;
