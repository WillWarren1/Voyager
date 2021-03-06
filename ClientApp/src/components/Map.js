import React, { Component } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import axios from 'axios'
import piracy from '../img/piracy.png'
import chest from '../img/chest.png'

import auth from '../Auth'

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newNameText: '',
      username: '',
      amountOfTreasure: 0,
      creditshow: false,
      showLog: false,
      showLogOut: false,
      showNameField: false,
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
        latitude: props.lat,
        longitude: props.lng,
        zoom: 3
      },
      //these are going to be the glossary of coordinates of where the pins need to go
      userMarkers: [],
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
        500,
        500,
        500,
        1000,
        1000,
        1000,
        1000,
        1000,
        1500,
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
    // this.beginDropping()
    let lat = props.lat
    let lng = props.lng
    console.log('screen center:', this.state.screenCenter)
    // if (this.state.screenCenter) {
    //   lat = this.state.screenCenter.lat
    //   lng = this.state.screenCenter.lng
    // }
    this.setState({
      viewport: {
        width: '100%',
        height: '100%',
        latitude: lat,
        longitude: lng,
        zoom: 17,
        maxZoom: 20,
        minZoom: 15
      },
      userLocation: {
        lat: props.lat,
        lng: props.lng
      }

      // username: '',
      // amountOfTreasure: 0
    })
    if (this.state.userMarkers.length <= 5) {
      this.setState({
        userMarkers: this.state.userMarkers.concat(
          [this.openingLatLng(props.lat, props.lng)],
          [this.openingLatLng(props.lat, props.lng)],
          [this.openingLatLng(props.lat, props.lng)],
          [this.openingLatLng(props.lat, props.lng)],
          [this.openingLatLng(props.lat, props.lng)]
        )
      })
    }
  }

  updateTreasureCount = () => {
    axios
      .get('api/Players/current', {
        headers: {
          Authorization: auth.authorizationHeader()
        }
      })
      .then(resp => {
        console.log({ resp })
        this.setState(
          {
            username: resp.data.currentPlayer.name,
            amountOfTreasure: resp.data.currentPlayer.amountOfTreasure
          },
          console.log('received player data' + resp)
        )
      })
  }

  updateStateWithNameText = event => {
    this.setState(
      {
        newNameText: event.target.value
      },
      () => {
        console.log(this.state.newNameText)
      }
    )
  }

  updateUsername = e => {
    e.preventDefault()
    axios
      .put(
        '/api/Players/username',
        {
          Name: this.state.newNameText
        },
        {
          headers: {
            Authorization: auth.authorizationHeader()
          }
        }
      )
      .then(resp => {
        console.log({ resp })
        this.setState(
          {
            newNameText: ''
          },
          () => {
            this.updateTreasureCount()
            this.viewNameField()
          }
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
      let distance = Math.sqrt(
        Math.pow(this.state.userLocation.lat - event.lngLat[1], 2) +
          Math.pow(this.state.userLocation.lng - event.lngLat[0], 2)
      )
      console.log(distance)
      let distanceValue = distance * 1000
      console.log(distanceValue)
      if (distanceValue <= 0.25) {
        this.setState({
          userMarkers: this.state.userMarkers.concat([
            [event.lngLat[1], event.lngLat[0]]
          ])
        })
        axios
          .put('/api/Players/drop', {
            headers: {
              Authorization: auth.authorizationHeader()
            }
          })
          .then(
            resp => {
              console.log({ resp })
            },
            () => {
              this.updateTreasureCount()
            }
          )
      } else {
        return
      }
      this.setState({
        dropMode: false
      })
    }
  }

  //this is the act of clicking on a treasure chest, it calculates the distance...
  //roughly... between the marker and the user, and if it's close enough the user
  //may examine it, thus capturing the treasure and updating their history and amount
  //of treasure
  examineTreasure = marker => {
    console.log(marker)
    let distance = Math.sqrt(
      Math.pow(this.state.userLocation.lat - marker[0], 2) +
        Math.pow(this.state.userLocation.lng - marker[1], 2)
    )

    let distanceValue = distance * 1000
    console.log(distanceValue)
    if (this.state.isClickable) {
      if (distanceValue <= 0.25) {
        this.setState({
          popupInfo: marker
        })

        this.setState(
          {
            popupData: { coordinates: marker, value: this.randomValue() }
          },
          () => {
            axios
              .post(
                '/api/Treasures',
                {
                  value: this.state.popupData.value,
                  latitude: this.state.popupData.coordinates[0],
                  longitude: this.state.popupData.coordinates[1]
                },
                {
                  headers: {
                    Authorization: auth.authorizationHeader()
                  }
                }
              )
              .then(() => {
                this.setState({ isClickable: false })
                // console.log({ resp })
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
  viewCredits = () => {
    this.setState({
      creditshow: !this.state.creditshow
    })
  }

  viewNameField = () => {
    this.setState({
      showNameField: !this.state.showNameField
    })
  }

  viewLogOut = () => {
    this.setState({
      showLogOut: !this.state.showLogOut
    })
  }

  viewLog = () => {
    axios
      .get('/api/Players/playerTreasure', {
        headers: {
          Authorization: auth.authorizationHeader()
        }
      })
      .then(resp => {
        console.log({ resp })
        this.setState({
          treasureLog: resp.data.currentPlayer.capturedTreasure,
          showLog: !this.state.showLog
        })
      })
  }

  //this starts the treasure drop and gets user info
  componentDidMount() {
    this.beginDropping()
    this.updateTreasureCount()
  }

  logout = () => {
    this.props.stopWatch()
    auth.logout()
    this.props.history.push('/')
  }

  //and here's all the stuff the user will see! well.. not quite...
  //they won't see the literal code but they'll see what it renders!
  //like maps and pins and buttons and things! Fancy!
  render() {
    const visibility = this.state.showLog ? 'show' : 'hidden'
    const creditvis = this.state.creditshow ? 'show' : 'hidden'
    const logoutScreen = this.state.showLogOut ? 'show' : 'hidden'
    const nameField = this.state.showNameField ? 'show' : 'hidden'

    const _viewport = { ...this.state.viewport }
    if (this.state.screenCenter && this.state.screenCenter.lat !== 0) {
      _viewport.zoom = this.state.screenCenter.zoom
      _viewport.latitude = this.state.screenCenter.lat
      _viewport.longitude = this.state.screenCenter.lng
    }

    return (
      <div>
        <ReactMapGL
          {..._viewport}
          onViewportChange={viewport =>
            this.setState({
              viewport
            })
          }
          onInteractionStateChange={e => {
            if (
              (e.isDragging && !e.isRotating) ||
              (!e.isPanning && !e.isRotating)
            ) {
              console.log('interacted', e)
              console.log('user moved the map')
              console.log(this.state.viewport)
              this.setState(
                {
                  screenCenter: {
                    lat: this.state.viewport.latitude,
                    lng: this.state.viewport.longitude,
                    zoom: this.state.viewport.zoom
                  }
                },
                () => {
                  console.log('updated state', this.state)
                }
              )
            }
          }}
          mapboxApiAccessToken={this.state.token}
          onClick={this.dropChest}
          className="Map"
          mapStyle={'mapbox://styles/mapbox/streets-v8'}>
          {this.renderPopup()}
          {this.state.userMarkers.map((marker, i) => {
            return (
              <Marker key={i} latitude={marker[0]} longitude={marker[1]}>
                <img
                  src={chest}
                  alt="treasure chest"
                  width={30}
                  height={30}
                  onClick={() => this.examineTreasure(marker)}
                />
              </Marker>
            )
          })}

          <Marker
            latitude={this.state.userLocation.lat}
            longitude={this.state.userLocation.lng}
            offsetLeft={-30}
            offsetTop={-20}>
            <img src={piracy} alt="pirate skull" width={50} height={50} />
          </Marker>
        </ReactMapGL>
        <span>
          <button className="userinfo pulse" onClick={this.viewNameField}>
            <p className="username">{this.state.username}</p>
            <p>{this.state.amountOfTreasure} gold</p>
          </button>
          <div className={`newname${nameField}`}>
            <form onSubmit={this.updateUsername}>
              <input
                className="textfield"
                type="text"
                placeholder="New username?"
                value={this.state.newNameText}
                onChange={this.updateStateWithNameText}
              />
            </form>
          </div>
          <button className="treasurelogbutton" onClick={this.viewLog}>
            <p>Treasure log</p>
          </button>
        </span>
        {/* <button className="button1" onClick={this.abortDrop}>
          ABORT ABORT ABORT
        </button>
        <button className="button2" onClick={this.beginDropping}>
          ADD MORE
        </button> */}
        <button className="button3" onClick={this.allowDropMode}>
          Bury Treasure!
        </button>
        <button className="creditbutton" onClick={this.viewCredits}>
          Credits
        </button>
        <button className="logoutbutton" onClick={this.viewLogOut}>
          Abandon Ship
        </button>
        <div className={`credits${creditvis}`}>
          <div className="credit-text">
            Skull Icon made by{' '}
            <a href="https://www.freepik.com/" title="Freepik">
              Freepik
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>{' '}
            is licensed by{' '}
            <a
              href="http://creativecommons.org/licenses/by/3.0/"
              title="Creative Commons BY 3.0">
              CC 3.0 BY
            </a>
          </div>
          <div className="credit-text">
            Treasure Icons made by{' '}
            <a
              href="https://www.flaticon.com/authors/darius-dan"
              title="Darius Dan">
              Darius Dan
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>{' '}
            is licensed by{' '}
            <a
              href="http://creativecommons.org/licenses/by/3.0/"
              title="Creative Commons BY 3.0">
              CC 3.0 BY
            </a>
          </div>
          <section className="credit-text">
            {' '}
            Map provided by{' '}
            <a href="https://uber.github.io/react-map-gl/#/">
              Uber's react mapbox library
            </a>
          </section>
        </div>
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
              } else {
                return console.log("you don't need this much")
              }
            })}
          </ul>
        </div>
        <section className={`logoutmenu${logoutScreen}`}>
          Are you sure you'd like to end your current Voyage?
          <button className="logoutConfirm" onClick={this.logout}>
            Yes, log out
          </button>
        </section>
        {/* <section>{this.state.treasureLog[0].value}</section> */}
      </div>
    )
  }
}

export default Map
