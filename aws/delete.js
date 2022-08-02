const utilFunc = require("../utilityFunctions")

async function run(){
    await utilFunc.getName(async (res) => {
        console.log(res)
        await utilFunc.deleteObj(res)
    })
}
run()