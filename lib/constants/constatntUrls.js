// Change this on production
const isProduction = false;

const api = isProduction ? process.env.PRODUCTION_ENDPOINT || 'https://api.searchngo.app' : process.env.DEVELOPMENT_ENDPOINT || 'http://10.12.0.2:3019'

module.exports = {
    currentApi: api,
    apiPrefix: '/api',

    // Image Prefixes
    profilePrefix: (userid) => api+'/public/uploads/'+userid+'/profile/profilepic.jpg',

    // socket.ws communication service
    socket_server_url: isProduction ? "wss://searchngo.app:3019" : 'ws://10.12.0.2:3019',
}

