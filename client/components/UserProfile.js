import React from 'react'
import { browserHistory } from 'react-router'

import SingleFieldForm from './SingleFieldForm.js'
import MDSpinner from "react-md-spinner"

export default class UserProfile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      id: '',
      username: '',
      email: '',
      picture_id: '',
      created_at: ' ', // mandatory space so not undefined
      mostPopularLong: '',
      mostPopularShort: '',
      isFetching: true,
    }
  }

  componentDidMount() {
    this.retrieveData(this.props.params.id)
  }

  componentWillReceiveProps(nextProps) {
    if ( this.props.params.id != nextProps.params.id ||
         this.props.hook != nextProps.hook ) {
      this.setState({
        ...this.state,
        isFetching: true,
      })
      this.retrieveData(nextProps.params.id)
    }
  }

  retrieveData(idParam) {
    fetch(`${process.env.API_URL}/api/users/${idParam}`)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        // handle this second error at api
        if (json.error || json.name === "error") {
          this.props.setCurrentModal({
            name: "messageModal",
            message: "Sorry. Don't seem to know that user.",
          })
          browserHistory.push('/')
        } else {
          this.setState({
            id: json.id,
            username: json.username,
            email: json.email,
            created_at: json.created_at,
            mostPopularLong: json.mostPopularLong,
            mostPopularShort: json.mostPopularShort,
            picture_id: json.picture_id,
            isFetching: false,
          })
        }
      })
      .catch((er) => console.log(er))
  }

  // executes in context (with props and state) of child
  newUsernameSubmit(e) {
    e.preventDefault()
    let url = `${process.env.API_URL}/api/users/${this.props.currentUser.id}?username=${this.refs.username.value}`
    fetch(url, {
        method: 'PATCH', // must be caps
        credentials: 'include',
      })
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        // handle second error at api
        if ( json.error === "Session expired." ) {
          this.props.clearUser()
          this.props.setCurrentModal({
            name: "messageModal",
            message: "Ooops. Looks like your session expired. Please login again.",
          })
        } else if (json.error || json.name === "error") {
          this.props.setCurrentModal({
            name: "messageModal",
            message: "Sorry. Something went wrong.",
          })
        } else {
          // update user state in store
          this.props.updateUserData({
            newUsername: this.refs.username.value
          })
          // update user and field state on component
          this.setState({
            ...this.state,
            value: this.refs.username.value,
            updateEnabled: false,
          })
        }
      })
      .catch((er) => {
        this.props.setCurrentModal({
          name: "messageModal",
          message: "" + er,
        })
      })
  }

  newEmailSubmit(e) {
    e.preventDefault()
    let url = `${process.env.API_URL}/api/users/${this.props.currentUser.id}?email=${this.refs.email.value}`
    fetch(url, {
        method: 'PATCH', // must be caps
        credentials: 'include',
      })
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        // handle second error at api
        if ( json.error === "Session expired." ) {
          this.props.clearUser()
          this.props.setCurrentModal({
            name: "messageModal",
            message: "Ooops. Looks like your session expired. Please login again.",
          })
        } else if (json.error || json.name === "error") {
          this.props.setCurrentModal({
            name: "messageModal",
            message: "Sorry. Something went wrong.",
          })
        } else {
          // (no email on user state in store, so no update
          // there is necessary/no reducer)
          // update user and field state on component
          this.setState({
            ...this.state,
            value: this.refs.email.value,
            updateEnabled: false,
          })
        }
      })
      .catch((er) => {
        this.props.setCurrentModal({
          name: "messageModal",
          message: "" + er,
        })
      })
  }

  uploadModal() {
    this.props.setCurrentModal({name: "pictureUploadModal"})
  }

  render() {
    return (
      <div id="user-profile">

        { this.state.isFetching &&

          <MDSpinner style={{"top":"4rem"}} />

        }

        { !this.state.isFetching &&

          <div>

            { this.state.picture_id ? (
              <div>
                <img
                  id="profile-picture"
                  src={`${process.env.API_URL}/uploads/${this.state.picture_id}`} />
                { this.props.user.id == this.props.params.id &&
                  <button onClick={this.uploadModal.bind(this)}>CHANGE</button>
                }
              </div>
            ) : (
              <div>
                <div className="user-icon user-icon-white" />
                { this.props.user.id == this.props.params.id &&
                  <button onClick={this.uploadModal.bind(this)}>UPLOAD</button>
                }
              </div>
            )}

            <div id="user-data">

              <SingleFieldForm
                name="username"
                value={this.state.username}
                profileId={this.state.id}
                currentUser={this.props.user}
                submit={this.newUsernameSubmit}
                clearUser={this.props.clearUser}
                setCurrentModal={this.props.setCurrentModal}
                updateUserData={this.props.updateUserData} />

              <SingleFieldForm
                  name="email"
                  value={this.state.email}
                  profileId={this.state.id}
                  currentUser={this.props.user}
                  submit={this.newEmailSubmit}
                  clearUser={this.props.clearUser}
                  setCurrentModal={this.props.setCurrentModal}
                  updateUserData={this.props.updateUserData} />

                <div id="user-created-date">
                  <span>User Since</span><br />
                  <span>
                    {this.state.created_at.slice(0, this.state.created_at.indexOf('T'))}
                  </span>
                </div>

              { this.state.mostPopularShort &&

                <div id="most-popular-link">
                  <span>most popular link</span><br />
                  <span><a
                    href={`${process.env.API_URL}/${this.state.mostPopularShort}`}
                    target="_bland" >
                    {`${process.env.API_URL}/${this.state.mostPopularShort}`.slice(8)}
                    </a></span><br />
                  <span>{this.state.mostPopularLong}</span>
                </div>

              }

            </div>

          </div>

        }

      </div>
    )
  }
}
