import React, { Component } from 'react'
import { Link } from 'react-router-dom'
class Information extends Component {
  render() {
    return (
      <div className="sky">
        <header className="splash-header" />
        <main className="scroll">
          <h1 className="pagetype">Welcome, Voyager</h1>
          <p className="info-text">
            Welcome to Voyager, an Alternate Reality Game that lets you live out
            your dream of being a pirate by collecting treasure in the world
            around you!
          </p>
        </main>
        <footer className="backwaves" />
        <footer className="midwaves">
          <Link className="wave-text" to="/signup">
            Sign Up!
          </Link>
          <Link className="wave-text" to="/">
            Log in!
          </Link>
        </footer>
        <footer className="frontwaves" />
      </div>
    )
  }
}

export default Information
