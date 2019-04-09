import React, { Component } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons'
import { faGem } from '@fortawesome/free-solid-svg-icons'
library.add(faGem)
library.add(faSkullCrossbones)

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      popupInfo: null,
      popupData: null,
      userLocation: {
        lat: props.lat,
        lng: props.lng
      },
      viewport: {
        width: '100%',
        height: '100%',
        latitude: 27.7709662,
        longitude: -82.6633524,
        zoom: 3
      },
      userMarkers: [[props.lat, props.lng]],
      token:
        'pk.eyJ1Ijoid2lsbGtzaGFrZXMiLCJhIjoiY2p1OGd1c3BiMDNqajRkcXF5ZG5ycjh1eiJ9.bj4k4amBd2GhmmXlPVh9Og',
      dropMode: false,
      treasureValues: [
        500,
        500,
        500,
        500,
        500,
        1000,
        1000,
        1000,
        1500,
        1500,
        2500
      ]
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

  randomValue = () => {
    let index = Math.floor(Math.random() * 11)
    return this.state.treasureValues[index]
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
    console.log([props.lat, props.lng])
    this.setState({
      viewport: {
        width: '100%',
        height: '100%',
        latitude: props.lat,
        longitude: props.lng,
        zoom: 17,
        maxZoom: 20,
        minZoom: 15
      },
      userLocation: {
        lat: props.lat,
        lng: props.lng
      },
      userMarkers: []
    })
  }

  allowDropMode = () => {
    this.setState({
      dropMode: true
    })
  }
  dropChest = event => {
    if (this.state.dropMode === true) {
      this.setState({
        userMarkers: this.state.userMarkers.concat([
          [event.lngLat[1], event.lngLat[0]]
        ])
      })
    }
    this.setState({
      dropMode: false
    })
  }
  examineTreasure = marker => {
    console.log(marker)
    // console.log(this.state.userLocation)
    let distance = Math.sqrt(
      Math.pow(this.state.userLocation.lat - marker[0], 2) +
        Math.pow(this.state.userLocation.lng - marker[1], 2)
    )

    let distanceValue = distance * 1000
    console.log(distanceValue)

    if (distanceValue < 0.2) {
      this.setState({
        popupInfo: marker
      })

      this.setState(
        {
          popupData: { coordinates: marker, value: this.randomValue() }
        },
        () => {
          // console.log(this.state.popupData)
          axios.post('https://localhost:5001/api/Treasures', {
            value: this.state.popupData.value,
            latitude: this.state.popupData.coordinates[0],
            longitude: this.state.popupData.coordinates[1]
          })
        }
      )
    } else {
      return
    }
  }
  renderPopup = () => {
    const popupInfo = this.state.popupInfo
    const popupData = this.state.popupData
    if (!popupInfo) {
      return
    }
    const message = popupData
      ? popupData.value + ' gold doubloons'
      : 'opening chest...'
    return (
      <Popup
        tipSize={10}
        anchor="bottom"
        latitude={popupInfo[0]}
        longitude={popupInfo[1]}
        closeOnClick={false}
        offsetLeft={13}
        onClose={() => {
          this.setState({ popupInfo: null })
        }}>
        <div>
          <p>{message}</p>
        </div>
      </Popup>
    )
    // }
    // }
    // )
  }

  componentDidMount() {
    this.beginDropping()
  }
  render() {
    return (
      <div>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={viewport => this.setState({ viewport })}
          mapboxApiAccessToken={this.state.token}
          onClick={this.dropChest}
          className="Map"
          mapStyle={'mapbox://styles/mapbox/streets-v8'}>
          {this.renderPopup()}
          {this.state.userMarkers.map((marker, i) => {
            // console.log(marker)
            return (
              <Marker key={i} latitude={marker[0]} longitude={marker[1]}>
                <FontAwesomeIcon
                  icon="gem"
                  size="lg"
                  onClick={() => this.examineTreasure(marker)}
                />
              </Marker>
            )
          })}

          <Marker
            latitude={this.state.userLocation.lat}
            longitude={this.state.userLocation.lng}
            offsetLeft={0}
            offsetTop={0}>
            <FontAwesomeIcon icon="skull-crossbones" size="2x" />
          </Marker>
        </ReactMapGL>
        <button className="button1" onClick={this.abortDrop}>
          ABORT ABORT ABORT
        </button>
        <button className="button2" onClick={this.beginDropping}>
          ADD MORE
        </button>
        <button className="button3" onClick={this.allowDropMode}>
          Bury Treasure!
        </button>
      </div>
    )
  }
}

export default Map
