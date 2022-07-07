const utilFunc = require("./utilityFunctions")

run = async () => {
    
    await utilFunc.deleteObj("2022_7_7.csv")
}
run()
