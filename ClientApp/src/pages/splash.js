import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import AccountInput from '../components/accountInput'

class Splash extends Component {
  render() {
    return (
      <div>
        <AccountInput
          pageType="Log in"
          alternativeInput="Sign Up!"
          link="/signup"
        />
      </div>
    )
  }
}

export default Splash
