const express = require('express')
const { establishDatabaseConnection } = require('./config/db')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(require('cors')({ origin: process.env.CLIENT_URL }))
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
  app.use(require('morgan')('dev'))
}

// Routes
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
app.get('/check', (req, res) =>
  res.json({ message: 'Server is up and running!', status: 200 })
)
app.use('/api/users', authRoutes)
app.use('/api/profile', profileRoutes)

const PORT = process.env.PORT || 8000
establishDatabaseConnection()
app.listen(PORT, () => console.log('api service running @', PORT))
