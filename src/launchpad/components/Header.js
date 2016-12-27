const React = require("react");
const { createFactory, DOM: dom, PropTypes } = React;

const QuickLinks = createFactory(require("./QuickLinks"));
require("./Header.css");

const expressions = {
  array: [
    "x = [1, \"2\", {three: 3}, []]",
    "x = []"
  ],

  boolean: [
    "true",
    "false"
  ],

  date: [
    "new Date()"
  ],

  function: [
    "x = () => { 2 }"
  ],

  node: [
    `x = document.createElement("div");
     x.setAttribute("id", "myNodeId");
     x.setAttribute("class", "my-class and another");
     x.textContent = "My node id";
     x;
    `,
    `x = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
     x.setAttribute("id", "myNodeId");
     x.setAttribute("class", "my-class and another");
     x;
    `,
    "document.createComment('my comment node')",
    "document.createTextNode('foo')",
    `x = document.createAttribute('foo');
     x.value = "bar";
     x;
    `
  ],

  number: [
    "1",
    "-1",
    "-3.14",
    "0",
    "-0",
    "Infinity",
    "-Infinity",
    "NaN"
  ],

  object: [
    "x = {a: 2}"
  ],

  promise: [
    "Promise.resolve([1, 2, 3])",
    "Promise.reject(new Error('This is wrong'))",
    "new Promise()"
  ],

  regexp: [
    "new RegExp('^[-]?[0-9]+[\.]?[0-9]+$')"
  ],

  string: [
    "'foo'",
    "'bar\nbaz\nyup'",
    "'blah'.repeat(10000)"
  ],

  symbol: [
    "Symbol('foo')",
    "Symbol()"
  ]
};

expressions.yolo = Object.keys(expressions).reduce((res, key) => {
  return [...res, ...expressions[key]];
}, []);

const Header = React.createClass({

  propTypes: {
    evaluate: PropTypes.func.required,
    clearResultsList: PropTypes.func.required,
  },

  displayName: "Header",

  evaluateExpressions(label) {
    expressions[label].forEach(
      expression => this.props.evaluate(expression)
    );
  },

  renderLinks() {
    return Object.keys(expressions).map(label => dom.span(
      {
        key: label,
        onClick: () => this.evaluateExpressions(label)
      },
      label
    ));
  },

  onSubmitForm: function(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let expression = data.get("expression");
    this.props.evaluate(expression);
  },

  onClearButtonClick: function(e) {
    this.props.clearResultsList();
  },

  render() {
    return dom.header(
      { className: "console-header" },
      dom.form({
          onSubmit: this.onSubmitForm,
        },
        dom.h1({}, "Reps"),
        dom.input({
          type: "text",
          placeholder: "Enter an expression",
          name: "expression"
        }),
        dom.button({
          className: "clear-button",
          type: "button",
          onClick: this.onClearButtonClick
        }, "Clear"),
      ),
      QuickLinks({evaluate: this.props.evaluate})
    );
  }
});

module.exports = Header;
