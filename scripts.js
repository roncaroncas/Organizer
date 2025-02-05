import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";


function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
