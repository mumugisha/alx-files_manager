const controllingRoutes = require('./routes/index.js');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

controllingRoutes(app);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

module.exports = app;
