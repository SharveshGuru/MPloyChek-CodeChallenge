const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

app.use('/api/auth', require('./routes/authRoutes')); 


app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: err.message });
});


app.get('/', (req, res) => {
    res.send("API is Running!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
