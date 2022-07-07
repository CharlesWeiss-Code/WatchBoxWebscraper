const fs = require("fs")
const Watch = require("./DataStructures/Watch")
w = new Watch("","","","","","","","","","","","","","","","","","","","")
s = ""
for (var propt in w) {
    if (propt != "website") {
    s+=propt+","
    } else {
    s+=propt
    }
}
fs.writeFileSync("BLANKdataInCSV.csv",s+"\n")

