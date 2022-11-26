const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'Players'

MongoClient.connect('<<insert Databasehere>>', { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    //checked. Only change is the connect method
app.set('view engine', 'ejs')
app.use(express.static('public')) // this pulls everything from the main one.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// no change

app.get('/',(request, response)=>{
    db.collection('players').find().sort({likes: -1}).toArray() //puts the data into an array.
    .then(data => {
        response.render('index.ejs', { info: data }) //sends the data that has been put into an array into an ejs file
    })
    .catch(error => console.error(error))
})
//only change is database name

app.post('/addPlayer', (request, response) => { //action in the html is the route here, that is what connects them
    db.collection('players').insertOne({firstName: request.body.firstName,
    lastName: request.body.lastName, position: request.body.position, likes: 0})//anything inside the curly braces is what is getting put into the database
    .then(result => {
        console.log('Player Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
}) // added position, changes titles.

app.put('/addOneLike', (request, response) => {
    db.collection('players').updateOne({firstName: request.body.firstNameS, lastName: request.body.lastNameS,position: request.body.positionS,likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
          }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})//possibly errors coming her

app.delete('/deletePlayer', (request, response) => {
    db.collection('players').deleteOne({firstName: request.body.firstNameS})
    .then(result => {
        console.log('Player Deleted')
        response.json('Player Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})