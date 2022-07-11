const utilFunc = require("../utilityFunctions")

run = () => {
    utilFunc.getName((res) => {
        console.log(res)
    })

}
run()