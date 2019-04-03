import React, { Component } from 'react'
// import HelloWorld from './components/HelloWorld'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Splash from './pages/splash'
import SignUp from './pages/signup'
import About from './pages/about'
import Credits from './pages/credits'
import Home from './pages/home'
import './index.css'
class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={Splash} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/about" component={About} />
            <Route exact path="/credits" component={Credits} />
            <Route exact path="/home" component={Home} />
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App
