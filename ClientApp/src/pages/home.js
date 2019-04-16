import React, { Component } from 'react'
import Map from '../components/Map'
class Home extends Component {
  state = {
    userLocation: { lat: 0.0, lng: 0.0 },
    loading: ''
  }
  componentDidMount() {
    const success = position => {
      const { latitude, longitude } = position.coords

      this.setState({
        userLocation: { lat: latitude, lng: longitude }
      })
    }
    const error = error => {
      console.log('oops', error)
    }
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    // navigator.geolocation.getCurrentPosition(success, error, options)
    let watchID = navigator.geolocation.watchPosition(success, error, options)
    console.log({ watchID })
    this.setState({
      watchID
    })
  }
  stopWatch = () => {
    navigator.geolocation.clearWatch(this.state.watchID)
  }

  render() {
    return (
      <Map
        stopWatch={this.stopWatch}
        lat={this.state.userLocation.lat}
        lng={this.state.userLocation.lng}
      />
    )
  }
}

export default Home
