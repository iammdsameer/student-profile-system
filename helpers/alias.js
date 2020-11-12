const axios = require('axios')

exports.alias = async (link) => {
  try {
    let response = await axios.get(`${process.env.URL_HANDLER}?u=${link}`)
    return response.data.alias
  } catch (error) {
    return 'Sorry, link unavailable, ERR: error-while-aliasing-url'
  }
}
