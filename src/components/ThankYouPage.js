import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/thankyouPage.css';

const ThankYouPage = () => {
  return (
    <div className="container">
      <div className="icon">&#10004;</div>
      <h1>Thank You!</h1>
      <p>Your request has been submitted successfully.</p>
      <Link to="/" className="button">Back to Home</Link>
    </div>
  );
};

export default ThankYouPage;
