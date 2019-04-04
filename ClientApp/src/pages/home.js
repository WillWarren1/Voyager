import React, { Component } from 'react'
import Map from '../components/Map'
class Home extends Component {
  state = {
    userLocation: { lat: 0.0, lng: 0.0 },
    loading: ''
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords

      this.setState({
        userLocation: { lat: latitude, lng: longitude }
      })
    })
  }

  render() {
    return (
      <Map
        lat={this.state.userLocation.lat}
        lng={this.state.userLocation.lng}
      />
    )
  }
}

export default Home
