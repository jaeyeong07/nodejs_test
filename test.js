const bcrypt = require('bcrypt')

// const encryptedPassowrd = bcrypt.hashSync('1234', 10) // sync
// console.log(encryptedPassowrd)
const same = bcrypt.compareSync("1234", "$2b$10$GRzzLrNdRCCI8xeXShywtesbX3H6qcqg0xgaBKua4vjXMyhFfvlrC") // sync
console.log(same)