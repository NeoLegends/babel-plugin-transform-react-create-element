import React from "react";
const _createElement = /*#__PURE__*/ React.createElement;
import logo from "./logo.svg";
import "./App.css";

function App() {
  return /*#__PURE__*/ _createElement(
    "div",
    {
      className: "App",
    },
    /*#__PURE__*/ _createElement(
      "header",
      {
        className: "App-header",
      },
      /*#__PURE__*/ _createElement("img", {
        src: logo,
        className: "App-logo",
        alt: "logo",
      }),
      /*#__PURE__*/ _createElement(
        "p",
        null,
        "Edit ",
        /*#__PURE__*/ _createElement("code", null, "src/App.js"),
        " and save to reload.",
      ),
      /*#__PURE__*/ _createElement(
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
