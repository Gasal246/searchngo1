// Change this on production
const isProduction = false

module.exports = {
    currentApi: isProduction ? process.env.PRODUCTION_ENDPOINT || 'https://api.searchngo.app' : process.env.DEVELOPMENT_ENDPOINT || 'http://10.186.237.1:3019',
    apiPrefix: '/api'
}