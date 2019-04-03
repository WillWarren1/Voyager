import React, { Component } from 'react'
import { Link } from 'react-router-dom'
class AccountInput extends Component {
  render() {
    return (
      <div className="sky">
        <header className="splash-header" />
        <main className="scroll">
          <h1 className="pagetype">{this.props.pageType}</h1>
          <section className="login">
            <input type="text" placeholder="email or username" />
            <input type="text" placeholder="password" />
          </section>
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
