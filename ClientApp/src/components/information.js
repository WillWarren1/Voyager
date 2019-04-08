import React, { Component } from 'react'
import { Link } from 'react-router-dom'
class Information extends Component {
  render() {
    return (
      <div className="sky">
        <header className="splash-header" />
        <main className="scroll">
          <h1 className="pagetype">{this.props.pageType}</h1>
          <p className="info-text">
            Lorem Ipsum text will go here explaining what the game is/what tech
            was used to make it, sorry it's not here. I'm still drafting
          </p>
        </main>
        <footer className="backwaves" />
        <footer className="midwaves">
          <Link className="wave-text" to="/about">
            About
          </Link>
          <Link className="wave-text" to="/signup">
            Sign Up!
          </Link>
          <Link className="wave-text" to="/">
            Log in!
          </Link>
          <Link className="wave-text" to="/credits">
            Credits
          </Link>
        </footer>
        <footer className="frontwaves" />
      </div>
    )
  }
}

export default Information
