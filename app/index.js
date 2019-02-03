// index.js
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const request = require('request-promise')

const app = express()

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
app.set('scripts', path.join(__dirname, 'scripts'))

app.get('/', (request, response) => {
    response.render('game', {

    })
})

app.get('/game.js', function (req, res, next) {
    console.log("before redirection");
    res.sendfile('./app/scripts/Game.js');
});

const options = {
    method: 'GET',
    uri: 'https://risingstack.com'
}

request(options)
    .then(function (response) {
        console.log("success")
        
    })
    .catch(function (err) {
        console.log(err)
    })

app.listen(3000)


