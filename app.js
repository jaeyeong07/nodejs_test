const  express = require('express')
const path = require('path')
const apiRouter = require('./routes/routing')
const mongoose = require('mongoose')
const session = require('express-session');
const FileStore = require('session-file-store')(session);


const app = express()

// Connect to MongoDB
mongoose.connect("mongodb+srv://root:1234@jaeyeong.wq2pmjv.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

app.set('views', path.resolve(__dirname + '/views'))
app.set('view engine','ejs')

//session 은 app.use apiRouter앞에 항상 와야한다.
app.use(session({                                          
    secret:"asdfasffdas",
    resave:false,
    saveUninitialized:true,
    store : new FileStore()                        
  }))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/',apiRouter)

let port = 8008

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})