import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import auth from '../Auth'
class AccountInput extends Component {
  login = () => {
    auth.login()
  }
  render() {
    return (
      <div className="sky">
        <header className="splash-header" />
        <main className="scroll" onClick={this.login}>
          <h1 className="pagetype">Click here to {this.props.pageType}</h1>
        </main>
        <footer className="backwaves" />
        <footer className="midwaves">
          <Link className="wave-text" to="/about">
            About
          </Link>
          <Link className="wave-text" to={`${this.props.link}`}>
            {this.props.alternativeInput}
          </Link>
          <Link className="wave-text" to="/credits">
            Credits
          </Link>
          <Link className="wave-text" to="/home">
            Temporary Home Button
          </Link>
        </footer>
        <footer className="frontwaves" />
      </div>
    )
  }
}

export default AccountInput
