import React from 'react'
import { Button } from '@material-ui/core'
import Websocket from 'react-websocket'

class Messages extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      count: 90
    }
  }

  handleData(data) {
    let result = JSON.parse(data)
    this.setState({ count: this.state.count + result.movement })
  }
  
  render() {
    return (
      <div>
        Count: <strong>{this.state.count}</strong>
        <Websocket url="ws://localhost:3001" onMessage={this.handleData.bind(this)}/>
        <h1>The messages </h1>
        
      </div>
    );
  }
}


function App() {
  return (
    <div className="App">
      <Messages/>
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
