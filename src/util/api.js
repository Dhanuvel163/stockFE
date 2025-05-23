const axios = require('axios')
const BE_URL = "https://stockbe-dcg7.onrender.com/"

module.exports = {
    call_api: async function(method, path, headers, data={}){
        headers = {authorization:localStorage.getItem('token'), ...headers}
        return await axios.request({method, url: `${BE_URL}${path}`, headers, data})        
    }
}