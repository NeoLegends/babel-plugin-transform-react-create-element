/** @jsx _createElement */
import React from "react";
const _createElement = React.createElement;
import logo from "./logo.svg";
import "./App.css";

function App() {
  return _createElement(
    "div",
    {
      className: "App",
    },
    _createElement(
      "header",
      {
        className: "App-header",
      },
      _createElement("img", {
        src: logo,
        className: "App-logo",
        alt: "logo",
      }),
      _createElement(
        "p",
        null,
        "Edit ",
        _createElement("code", null, "src/App.js"),
        " and save to reload.",
      ),
      _createElement(
        "a",
        {
          className: "App-link",
          href: "https://reactjs.org",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        "Learn React",
      ),
    ),
  );
}

export default App;
