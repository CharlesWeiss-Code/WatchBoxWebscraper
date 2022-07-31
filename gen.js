/**
 * This file gives me the opportunity to manually create a blank "data.csv" file.
 */
const fs = require("fs")
const Watch = require("./Watch")
w = new Watch("","","","","","","","","","","","","","","","","","","","")
s = ""
for (var propt in w) {
    s+=propt+","
}
fs.writeFileSync("data.csv",s+"\n")
console.log("Created a blank data CSV")

