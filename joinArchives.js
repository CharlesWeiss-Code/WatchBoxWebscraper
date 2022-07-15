const fs = require("fs");
const Watch = require("./Watch");

(() => {
  w = new Watch(
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  );
  s = "";
  for (var propt in w) {
    s += propt + ",";
  }
  fs.writeFileSync("compilation.csv", s + "\n");
  result = "";
  fs.readdirSync("./archives/").forEach((file) => {
    if (file != ".DS_Store") {
      console.log(file);
      let fileData = fs.readFileSync("./archives/" + file).toString();
      result += fileData.substring(fileData.indexOf("\n") + 1);
    }
  });
  fs.appendFileSync("compilation.csv", result);
})();
