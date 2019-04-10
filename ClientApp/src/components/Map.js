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
      showLog: false,
      treasureLog: [],
      popupInfo: null,
      popupData: null,
      userLocation: {
        lat: props.lat,
        lng: props.lng
      },
      //this controls aspects of the map's viewport, think of it like a window to the map
      viewport: {
        width: '100%',
        height: '100%',
        latitude: 27.7709662,
        longitude: -82.6633524,
        zoom: 3
      },
      //these are going to be the glossary of coordinates of where the pins need to go
      userMarkers: [[props.lat, props.lng]],
      //token to access the map
      token:
        'pk.eyJ1Ijoid2lsbGtzaGFrZXMiLCJhIjoiY2p1OGd1c3BiMDNqajRkcXF5ZG5ycjh1eiJ9.bj4k4amBd2GhmmXlPVh9Og',
      //whether or not the player can drop their own treasure
      dropMode: false,
      //possible values for treasures to contain
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
      ],
      //whether or not the user can click on a treasure that is within range
      //this makes sure the user cannot keep clicking the same treasure to randomly
      //generate new values and scam the treasure system before the treasure disappears
      isClickable: true
    }
  }

  //randomly generates treasure within a certain radius of the user's location
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

  //same as above, randomly generates treasure within a certain radius of user's location,
  // but this is active the moment the user's location is received, only called once per session
  openingLatLng = (lat, lng) => {
    let result = []

    let howFar = 0.0035 * Math.sqrt(Math.random())
    let whichDirection = 2 * Math.PI * Math.random()
    let x = howFar * Math.cos(whichDirection)
    let y = howFar * Math.sin(whichDirection)
    result[0] = x + lat
    result[1] = y + lng
    console.log(result)
    return result
  }

  //this random value function is used to randomly select a treasure value.
  randomValue = () => {
    let index = Math.floor(Math.random() * this.state.treasureValues.length)
    return this.state.treasureValues[index]
  }

  //this function runs at an interval and randomly populates the map with five
  //new treasure chests, whose value is undecided until clicked
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
      }, 900000)
    } else {
      clearInterval(this.interval)
    }
  }

  //abort button is for TESTING PURPOSES ONLY, it keeps the map from getting slow
  //from thousands of pins appearing every three seconds
  abortDrop = () => {
    clearInterval(this.interval)
  }

  //location is being passed in through the parent, so it is not present in state
  //immediately upon page load. This function allows the page to update when location
  //is received.
  componentWillReceiveProps(props) {
    console.log([props.lat, props.lng])
    this.updateTreasureCount()
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
      userMarkers: this.state.userMarkers.concat(
        [this.openingLatLng(props.lat, props.lng)],
        [this.openingLatLng(props.lat, props.lng)],
        [this.openingLatLng(props.lat, props.lng)],
        [this.openingLatLng(props.lat, props.lng)],
        [this.openingLatLng(props.lat, props.lng)]
      ),
      username: '',
      amountOfTreasure: 0
    })
  }

  updateTreasureCount = () => {
    axios.get('api/Players/1').then(resp => {
      this.setState(
        {
          username: resp.data.name,
          amountOfTreasure: resp.data.amountOfTreasure
        },
        console.log('received player data')
      )
    })
  }

  //this function updates drop mode so that users may drop treasure
  allowDropMode = () => {
    this.setState({
      dropMode: true
    })
  }

  //this function is the actual nonphysical act of dropping the treasure
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

  //this is the act of clicking on a treasure chest, it calculates the distance...
  //roughly... between the marker and the user, and if it's close enough the user
  //may examine it, thus capturing the treasure and updating their history and amount
  //of treasure
  examineTreasure = marker => {
    console.log(marker)
    // console.log(this.state.userLocation)
    let distance = Math.sqrt(
      Math.pow(this.state.userLocation.lat - marker[0], 2) +
        Math.pow(this.state.userLocation.lng - marker[1], 2)
    )

    let distanceValue = distance * 1000
    console.log(distanceValue)
    if (this.state.isClickable) {
      if (distanceValue <= 0.2) {
        this.setState({
          popupInfo: marker
        })

        this.setState(
          {
            popupData: { coordinates: marker, value: this.randomValue() }
          },
          () => {
            axios
              .post('/api/Treasures', {
                value: this.state.popupData.value,
                latitude: this.state.popupData.coordinates[0],
                longitude: this.state.popupData.coordinates[1]
              })
              .then(() => {
                this.setState({ isClickable: false })
                console.log('update treasure count')
                this.updateTreasureCount()
              })
          }
        )
      } else {
        return
      }
    }
  }

  //this filters out treasures that have been clicked on and removes them from the map
  //since treasure generation is handled client-side, there's no back-end changes needed!
  //Isn't that neat?
  removeTreasureFromMap = coordinates => {
    let i = this.state.userMarkers.filter(
      coord => !coord.includes(coordinates[0] && coordinates[1])
    )
    console.log(i)
    this.setState({
      userMarkers: i
    })
  }

  //this handles the rendering of popup windows, I use these to display the contents of treasure
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
          this.removeTreasureFromMap(popupData.coordinates)
          this.setState({
            popupInfo: null,
            isClickable: true
          })
        }}>
        <div>
          <p>{message}</p>
        </div>
      </Popup>
    )
  }

  viewLog = () => {
    axios.get('/api/Players/1').then(resp => {
      this.setState(
        {
          treasureLog: resp.data.capturedTreasure,
          showLog: !this.state.showLog
        }
        // , () => {
        // console.log(this.state.treasureLog)
        // return (
        // <div className="treasurelog">
        //   <ul>
        //     {this.state.treasureLog.map((treasure, i) => {
        //       console.log(treasure)
        //       return (
        //         <li key={i}>
        //           {treasure.id}: {treasure.value} gold, found at{' '}
        //           {treasure.latitude}/{treasure.longitude}
        //         </li>
        //       )
        //     })}
        //   </ul>
        // </div>
      )
      // })
    })
  }

  //this starts the treasure drop and gets user info
  componentDidMount() {
    this.beginDropping()
    this.updateTreasureCount()
  }

  //and here's all the stuff the user will see! well.. not quite...
  //they won't see the literal code but they'll see what it renders!
  //like maps and pins and buttons and things! Fancy!
  render() {
    const visibility = this.state.showLog ? 'show' : 'hidden'
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
        <span>
          <section className="userinfo">
            <p>{this.state.username}</p>
            <p>{this.state.amountOfTreasure} gold</p>
          </section>
          <section className="treasurelogbutton" onClick={this.viewLog}>
            <p>Treasure log</p>
          </section>
        </span>
        <button className="button1" onClick={this.abortDrop}>
          ABORT ABORT ABORT
        </button>
        <button className="button2" onClick={this.beginDropping}>
          ADD MORE
        </button>
        <button className="button3" onClick={this.allowDropMode}>
          Bury Treasure!
        </button>
        <div className={`treasurelog${visibility}`}>
          <ul>
            {this.state.treasureLog.map((treasure, i) => {
              console.log(treasure)
              if (i < 10) {
                return (
                  <li key={i}>
                    {treasure.value} gold, from {treasure.latitude}/
                    {treasure.longitude}
                  </li>
                )
              }
            })}
          </ul>
        </div>
        {/* <section>{this.state.treasureLog[0].value}</section> */}
      </div>
    )
  }
}

export default Map
