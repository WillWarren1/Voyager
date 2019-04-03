import React, { Component } from 'react'
import AccountInput from '../components/accountInput'
class SignUp extends Component {
  render() {
    return (
      <AccountInput pageType="Sign Up!" alternativeInput="Log in" link="/" />
    )
  }
}

export default SignUp
