import React, {Fragment,useEffect} from 'react'
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Components
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'
import {loadUser} from './actions/auth'
import Dashboard from './components/dashboard/Dashboard'
import Profile from './components/profile/Profile'
import History from './components/history/History'
// import PrivateRoute from './components/routing/PrivateRoute'
import Home from './components/home/Home'
import setAuthToken from './utils/setAuthToken'
import './App.css'

// Redux store
import {Provider} from 'react-redux'
import store from './store'

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = ()=> {
  useEffect(()=>{
      store.dispatch(loadUser());
  },[])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar/>
          <Route exact path="/" component={Landing}></Route>
          <section className="container">
            <Alert/>
            <Switch>
              <Route exact path="/register" component={Register}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/home" component={Home}/>              
              <Route exact path="/profile" component={Profile}/>   
              <Route exact path="/history" component={History}/>          
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
} 

export default App;
