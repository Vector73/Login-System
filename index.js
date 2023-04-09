const express = require('express')
const port = 3000
const path = require('path')
const app = express()
const router=require('./router');
const session = require('express-session')
const handlebars = require('express-handlebars')
const fs = require('fs')

app.use(session({
  secret : "abc123",
  resave : false,
  saveUninitialized: false,
    cookie : {
        maxAge : 600000
    }
}))

app.set('view engine', 'hbs')
app.engine('hbs', handlebars.engine({
  layoutsDir: __dirname + '/views/layouts',
  extname: 'hbs'
}))

app.use(express.static(path.join(__dirname,"public")))
app.use('/verification', express.static(path.join(__dirname,"public")))
app.use('/change', express.static(path.join(__dirname,"public")))
app.use(express.json())

app.use('/',router)
app.get('/:page', (req, res) => {
  req.session.forgot = false
  if (fs.existsSync(path.join(__dirname,"public", `${req.params.page}.html`))){
    res.sendFile(path.join(__dirname,"public", `${req.params.page}.html`))
  }else res.status(404).send("<pre>Not Found</pre>")
})


app.get('/',(req,res) => {
  if(req.session.user) res.redirect("/dashboard")
  else res.redirect("/sign-in")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})