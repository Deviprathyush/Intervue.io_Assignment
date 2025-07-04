const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let currentPoll = null;
let results = {};
let answeredStudents = new Set();
let studentSockets = {}; // studentName -> socket.id

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('student:join', (name) => {
    studentSockets[name] = socket.id;
    socket.data.name = name;
    socket.emit('poll:current', currentPoll);
  });
  
socket.on('teacher:create_poll', ({ question, options, time }) => {
  console.log("📢 Teacher created a poll:", question);

  currentPoll = { question, options, time: time || 60 };
  results = {};
  answeredStudents.clear();
  options.forEach(opt => results[opt] = 0);

  io.emit('poll:new', currentPoll);

  setTimeout(() => {
    io.emit('poll:timeout');
    currentPoll = null;
  }, currentPoll.time * 1000);
});


  socket.on('student:answer_poll', (data) => {
    if (answeredStudents.has(data.name)) return;
    answeredStudents.add(data.name);
    results[data.answer]++;
    io.emit('poll:update_results', results);
  });

  socket.on('teacher:end_poll', () => {
    currentPoll = null;
    io.emit('poll:ended');
  });

  socket.on('teacher:kick_student', (studentName) => {
    const sockId = studentSockets[studentName];
    if (sockId) io.to(sockId).emit('student:kicked');
  });

  socket.on('disconnect', () => {
    if (socket.data.name) {
      delete studentSockets[socket.data.name];
      answeredStudents.delete(socket.data.name);
    }
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
