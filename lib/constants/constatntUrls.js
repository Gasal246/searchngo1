// Change this on production
const isProduction = false

module.exports = {
    currentApi: isProduction ? process.env.PRODUCTION_ENDPOINT || 'https://api.searchngo.app' : process.env.DEVELOPMENT_ENDPOINT || 'http://10.30.30.12:3019',
    apiPrefix: '/api'
}