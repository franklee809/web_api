import React from 'react';
import {Link} from 'react-router-dom';

const Landing = ()=> {
  return (
    <section className="landing">
        <div className="dark-overlay">
            <div className="landing-inner">
                    <h1 className="x-large">Stock API</h1>
                    <p className="lead">
                    {/* Create Link developer profile/portfolio, share posts and get help from
                    other developers */}
                    Realtime and Historical Stock Price Quotes, Company Financials and more with 200+ Financial Data Feeds across the investment 
                    </p>
                    <div className="buttons">
                    <Link to="/register" className="btn btn-primary">Sign Up</Link>
                    <Link to="/login" className="btn btn-light">Login</Link>
                </div>
            </div>
        </div>
    </section>
  );
} 

export default Landing ;