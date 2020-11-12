const { connect } = require('mongoose')

exports.establishDatabaseConnection = async () => {
  try {
    const db = await connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    console.log('Database Connected: ', db.connection.host)
  } catch (error) {
    console.log('Failed to establish connection to database:', error.codeName)
  }
}
