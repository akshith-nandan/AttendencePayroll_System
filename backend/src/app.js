const express = require('express');
const cors = require('cors');

const attendenceRoute = require('./routes/attendenceRoute');
const authRoute = require('./routes/authRoute');
const employeeRoute = require('./routes/employeeRoute');
const payrollRoute = require('./routes/payrollRoute');
const reportRoute = require('./routes/reportRoute');
const settingsRoute = require('./routes/settingsRoute');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/attendence', attendenceRoute);
app.use('/api/auth', authRoute);
app.use('/api/employee', employeeRoute);
app.use('/api/payroll', payrollRoute);
app.use('/api/report', reportRoute);
app.use('/api/settings', settingsRoute);

app.use('/api/healthy', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

app.use((err, req, res, next) => {
  console.error('Global Server Error', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
