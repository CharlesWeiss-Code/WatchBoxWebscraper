/**
 * This file's purpose is to give me the opportunity to manually post the current csv to the s3 bucket
 * and delete the old csv from the bucket.
 */


const utilFunc = require("../utilityFunctions")

!async function(){
    utilFunc.getName(async (res) => {
        await utilFunc.postAndDelete(res)
    })
}()