const utilFunc = require("../utilityFunctions")


async function run(){
    await utilFunc.uploadFileToS3()
}
run()