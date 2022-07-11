const AWS = require("aws-sdk");
const awsInfo = require("./aws-info");
const utilFunc = require("../utilityFunctions")

run = async () => {
     utilFunc.getName(async (res) => {
        await utilFunc.deleteObj(res)
        await utilFunc.uploadFileToS3()
    })
}
run()