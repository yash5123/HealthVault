import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("React Error:", error);
    console.error("Component stack:", info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something crashed.</h2>;
    }

    return this.props.children;
  }
}