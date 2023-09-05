const  express = require('express')
const path = require('path')
const apiRouter = require('./routes/routing')
const mongoose = require('mongoose')

const app = express()

// Connect to MongoDB
mongoose.connect("mongodb+srv://root:1234@jaeyeong.wq2pmjv.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

app.set('views', path.resolve(__dirname + '/views'))
app.set('view engine','ejs')

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/',apiRouter)

let port = 8008

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})