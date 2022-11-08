const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middle wares
app.use(cors());
app.use(express.json());





app.get('/', (req, res) => {
    res.send('paradise server is running')
})

app.listen(port, () => {
    console.log(`Paradise server is running on ${port}`);
})