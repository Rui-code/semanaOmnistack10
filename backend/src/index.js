const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setUpWebsocket } = require('./websocket');


const app = express();
const server = http.Server(app);

setUpWebsocket(server);

mongoose.connect('mongodb+srv://Omnistack:1234@cluster0-hajiw.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(routes);


server.listen(3333);

