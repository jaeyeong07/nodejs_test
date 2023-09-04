const  express = require('express')
const path = require('path')

const app = express()

app.set('views', path.resolve(__dirname + '/views'))
app.set('view engine','ejs')

let port = 8008

app.get('/', (req, res)=>{
    return res.render('index')
})

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})