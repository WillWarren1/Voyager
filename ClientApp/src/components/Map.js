import React, { Component } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons'
import { faGem } from '@fortawesome/free-solid-svg-icons'
library.add(faGem)
library.add(faSkullCrossbones)

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userLocation: {
        lat: props.lat,
        lng: props.lng
      },
      viewport: {
        width: 1000,
        height: 1000,
        latitude: props.lat,
        longitude: props.lng,
        zoom: 3
      },
      userMarkers: [[props.lat, props.lng]],
      TOKEN:
        'pk.eyJ1Ijoid2lsbGtzaGFrZXMiLCJhIjoiY2p0eng5ejgyMzlmbTQzbTI4MG80aXd3ZSJ9.he43q3C_S0uhZD9wRnGtsQ',
      incrementor: 0
    }
  }
  randomLatLng = () => {
    let result = []

    let howFar = 0.0035 * Math.sqrt(Math.random())
    let whichDirection = 2 * Math.PI * Math.random()
    let x = howFar * Math.cos(whichDirection)
    let y = howFar * Math.sin(whichDirection)
    result[0] = x + this.state.userLocation.lat
    result[1] = y + this.state.userLocation.lng
    console.log(result)
    return result
  }

  beginDropping = () => {
    if (this.state.userMarkers.length < 20) {
      this.interval = setInterval(() => {
        this.randomLatLng()

        this.setState({
          userMarkers: this.state.userMarkers.concat(
            [this.randomLatLng()],
            [this.randomLatLng()],
            [this.randomLatLng()],
            [this.randomLatLng()],
            [this.randomLatLng()]
          )
        })
      }, 5000)
    } else {
      clearInterval(this.interval)
    }
  }

  abortDrop = () => {
    clearInterval(this.interval)
  }

  componentWillReceiveProps(props) {
    this.setState({
      viewport: {
        width: 1000,
        height: 1000,
        latitude: props.lat,
        longitude: props.lng,
        zoom: 17,
        maxZoom: 25
        // minZoom: 15
      },
      userLocation: {
        lat: props.lat,
        lng: props.lng
      },
      userMarkers: []
    })
  }

  dropChest = event => {
    this.setState({
      userMarkers: this.state.userMarkers.concat([
        [event.lngLat[1], event.lngLat[0]]
      ])
    })
  }
  componentDidMount() {
    this.beginDropping()
  }
  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={viewport => this.setState({ viewport })}
        mapboxApiAccessToken={this.state.TOKEN}
        onClick={this.dropChest}>
        <button onClick={this.abortDrop}>ABORT ABORT ABORT</button>
        <button onClick={this.beginDropping}>ADD MORE</button>
        {this.state.userMarkers.map((marker, i) => {
          // console.log(marker)
          return (
            <Marker key={i} latitude={marker[0]} longitude={marker[1]}>
              <FontAwesomeIcon icon="gem" />
            </Marker>
          )
        })}
        <Marker
          latitude={this.state.userLocation.lat}
          longitude={this.state.userLocation.lng}
          offsetLeft={0}
          offsetTop={0}>
          <FontAwesomeIcon icon="skull-crossbones" />
        </Marker>
      </ReactMapGL>
    )
  }
}

export default Map
