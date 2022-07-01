const fs = require('fs')
const data = parseInt(fs.readFileSync('./numWatchesScraped.txt', { encoding: 'utf8' }))

console.log(data+1)