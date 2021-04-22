const app = require('express')(),
      httpServer = require('http').createServer(app)

const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*'
  }
})

const kafka = require('kafka-node'),
      Consumer = kafka.Consumer,
      consumerClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' }),
      consumer = new Consumer(
        consumerClient,
        [{ topic: 'kafka-chat7' }]
      )

const Producer = kafka.Producer,
      producerClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' }),
      producer = new Producer(producerClient)

producer.on('ready', function() {
  console.log('producer is ready')
})

const produceMessage = (msg) => {
  producer.send([{topic: 'kafka-chat7', messages: [msg]}], function(err, data) { 
    console.log(data)
  })
}  

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {

  socket.broadcast.emit('user connection', socket.id)
  
  consumer.on('message', (msg) => {
    socket.emit('chat message', msg.value)
  })
  socket.on('produce', (msg) => {
    produceMessage(msg)
  })
})

httpServer.listen(8080, () => {
  console.log('listening on *:8080')
})
