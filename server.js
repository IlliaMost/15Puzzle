const express = require('express')
const path = require('path')
const http = require('http')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Задаємо статичну папку
app.use(express.static(path.join(__dirname, "public")))

// Запускаємо сервер
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// Обробляєм запит на підключення до сокета від веб-клієнта
const connections = [null, null]


// Підключення/відключення користувача
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});