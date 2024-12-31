require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { chatRouter } = require('./routes/chat');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 