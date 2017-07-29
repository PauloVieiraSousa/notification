const Every = require('every-moment')
const MongoJS = require('mongojs')
const db = mongojs('username:password@example.com/mydb?authSource=authdb')
const notifications = db.collection('notifications')
Every(1, 'second', () => {
    console.log('Initial!!')

})