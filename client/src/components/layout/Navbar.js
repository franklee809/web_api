import React,{Fragment} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';
import {connect} from 'react-redux';


const Navbar = ({auth:{isAuthenticated,loading},logout})=> {

  const AuthLinks = (
    <ul>
        <li>
          <a onClick={logout} to="#!">
            <i className="fas fa-sign-out-alt"></i> 
            <span className="hide-sm"> {' '}Logout</span>
          </a>
        </li>
    </ul>
  );


  const GuestLinks = ( 
    <ul>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
    </ul>
  );

  return (
    <div>
        <nav className="navbar bg-dark">
            <h1><Link to="/home"><i className="fas fa-code"></i> StockConnector</Link></h1>
            {!loading && (<Fragment>{isAuthenticated ? AuthLinks : GuestLinks}</Fragment>)}
        </nav>
    </div>
  );
} 

Navbar.propTypes = {logout:PropTypes.func.isRequired, auth:PropTypes.object.isRequired}
const mapStateToProps = state => ({ auth: state.auth });
export default connect(mapStateToProps,{logout})(Navbar) ;
