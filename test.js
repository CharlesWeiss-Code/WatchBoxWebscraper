const fs = require("fs")
const utilFunc = require("./utilityFunctions")
fs.renameSync("./data.csv", "./Archives/"+utilFunc.getKey())
