import React from 'react'
import openSocket from 'socket.io-client'
const socket = openSocket('http://localhost:8080')

function NumberList(props) {
  const Numbers = props.numbers
  const listItems = Numbers.map((number) => {
    return <li key={number.toString()}>{number}</li>
  })
  return (
    <ul>{listItems}</ul>
  );
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      consumingMessages: [],
      users: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit(event) {
    socket.emit("produce", this.state.value)
    this.setState({ value: '' })
    event.preventDefault()
  }
  
  componentDidMount() {
    socket.on('chat message', (msg) => {
      this.state.consumingMessages.push(msg)
    })
    socket.on('user connection', (userID) => {
      this.state.users.push(userID + ' has connected')
    })
  }

  render() {
    return(
      <div>

        <NumberList numbers={this.state.users}/>
        <NumberList numbers={this.state.consumingMessages}/>
        <form onSubmit={this.handleSubmit}>
          <label>
            Message:
            <input type="text" value={this.state.value} onChange={this.handleChange}></input>
          </label>
        </form>
        
      </div>
    );
  }
}


export default App 
