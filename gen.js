const fs = require("fs")
const Watch = require("./DataStructures/Watch")
w = new Watch("","","","","","","","","","","","","","","","","","","","")
s = ""
for (var propt in w) {
    s+=propt+","
}
fs.writeFileSync("BLANKdata.csv",s+"\n")

