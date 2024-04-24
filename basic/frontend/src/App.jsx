import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [jokes, setJokes] = useState([]);
  useEffect(() => {
    axios
      .get("/api/jokes")
      .then((res) => {
        console.log("res :", res);
        setJokes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <h1>Chai aur code | youtube</h1>
      <p>JOKES:{jokes.length}</p>
      {jokes.map((joke, index) => (
        <div key={index}>
          <p>{joke.title}</p>
          <p>{joke.content}</p>
        </div>
      ))}
    </>
  );
}

export default App;
