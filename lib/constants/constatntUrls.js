// Change this on production
const isProduction = false

const api = isProduction ? process.env.PRODUCTION_ENDPOINT || 'https://api.searchngo.app' : process.env.DEVELOPMENT_ENDPOINT || 'http://10.186.237.1:3019'

module.exports = {
    currentApi: api,
    apiPrefix: '/api',

    // Image Prefixes
    profilePrefix: (userid) => api+'/public/uploads/'+userid+'/profile/profilepic.jpg'
}

