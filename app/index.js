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
app.set('assets', path.join(__dirname, 'assets'))

app.get('/', (request, response) => {
    response.render('game', {})
})

app.get('/phaser.js', function (req, res, next) {
    console.log("phaser.js delivered");
    res.sendFile(path.resolve(__dirname, './scripts/phaser.js'));
});

app.get('/Scene1.js', function (req, res, next) {
    console.log("scene1.js delivered"); 
    res.sendFile(path.resolve(__dirname, './scripts/Scene1.js'));
   
});

app.get('/Game.js', function (req, res, next) {
    console.log("game.js delivered");
    res.sendFile(path.resolve(__dirname, './scripts/Game.js'));
});

app.get('/runningMan.png', function (req, res, next) {
    console.log("runningMan.png delivered");
    res.sendFile(path.resolve(__dirname, './assets/runningMan.png'));
});

app.listen(3000)

console.log("Listening to PORT: 3000")

