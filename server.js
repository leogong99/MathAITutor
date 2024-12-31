const express = require('express');
const bodyParser = require('body-parser');
const { handleChat } = require('./src/api/chat');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post('/api/chat', handleChat);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 