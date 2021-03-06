import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from './actions/actionCreators'
import Main from './components/Main'

// connect will connect the data from the store into whatever level component needed
// MAKE THIS STATE MATCH STORE STATE FOR THE WIN
function mapStateToProps(state) {
  return {
    inputURLs: state.inputURLs, // has bool in it (KEEP IT FLAT FOR THE WIN)
    topTrendingURLs: state.topTrendingURLs,
    chatMessages: state.chatMessages,
    userData: state.userData,
    user: state.user,
    currentModal: state.currentModal,
    hook: state.hook,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

const ReduxConnection = connect(mapStateToProps, mapDispatchToProps)(Main)

export default ReduxConnection
