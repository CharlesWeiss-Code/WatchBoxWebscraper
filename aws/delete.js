const utilFunc = require("../utilityFunctions")

async function run(){
    await utilFunc.getKey(async (res) => {
        await utilFunc.deleteObj(res)
    })
}