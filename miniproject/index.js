require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();


app.use('/', userRoutes);
app.use('/', userRoutes);
app.use('/admin', adminRoutes);
app.use('/', orderRoutes);



app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});


app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
