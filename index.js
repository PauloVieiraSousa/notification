const Every = require('every-moment')
const MongoJS = require('mongojs')
Every(1, 'second', () => {
    console.log('Initial!!')

})