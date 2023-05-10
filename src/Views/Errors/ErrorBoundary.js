import React, { Component } from 'react';
import "./ErrorBoundary.css"
import logo from '../../Assets/SocialPost-Logo.png'
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render your custom error page here
      return (
<div className="ErrorContainer">
<div className="container-sm">
        <img src={logo} className="img-fluid" alt="Sample image" />
        </div>
<div className="browser">
  <div className="controls">
    <i></i>
    <i></i>
    <i></i>
  </div>
  
  <div className="eye"></div>
  <div className="eye"></div>
  <div className="mouth">
    <div className="lips"></div>
    <div className="lips"></div>
    <div className="lips"></div>
    <div className="lips"></div>
    <div className="lips"></div>
    <div className="lips"></div>
    <div className="lips"></div>
    <div className="lips"></div>
  </div>
</div>

<h1>Unfortunately, something has gone wrong.</h1>
<p>We're unable to fulfill your request. Rest assured we have been notified and are looking into the issue. Please refresh your browser. If the error continues, please contact our <a href="http://mcause.us/supportticket">support team</a>.</p>
</div>
      )
    }

    // Render children if there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;
