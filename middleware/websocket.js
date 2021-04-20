const express = require('express'),
      app = express(),
      http = require('http'),
      server = http.createServer(app),
      io = require('socket.io')(server)

const kafka = require('kafka-node'),
      Consumer = kafka.Consumer,
      consumerClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' }),
      consumer = new Consumer(
        consumerClient,
        [{ topic: 'kafka-chat0' }]
      )

const Producer = kafka.Producer,
      producerClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' }),
      producer = new Producer(producerClient)

producer.on('ready', function() {
  produceMessage = (msg) => {
    producer.send([{topic: 'kafka-chat0', messages: [msg]}], function(err, data) { 
     console.log(data)
    })
  }  
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {

  console.log('User Connected')
  consumer.on('message', function(message) {
    socket.emit('chat message', message.value)
  })

  socket.on('produce', (msg) => {
    produceMessage(msg)
  })
})

server.listen(3001, () => {
  console.log('listening on *:3001')
})
