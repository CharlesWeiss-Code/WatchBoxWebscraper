/**
 * This is aws file that stors all the AWS credentials.
 * It is included in the ".gitignore" file so that the credentials are not published to github
 */

const SECRET = "iDnHzt52ltoAoricn0tulBQROE8FGhIGJuIskZ3W";
const KEY_ID = "AKIAYZQYZAMRXXBKD57D";
const REGION = "Virginia us-east-1"
const BUCKET_NAME = "wb-datascrapes-testing"
const ACCOUNT_ID="604568617763"
getSecret = () => SECRET
getKeyID = () => KEY_ID
getBucketName = () => BUCKET_NAME
getRegion = () => REGION
getAccountID = () => ACCOUNT_ID
module.exports = {getSecret, getKeyID, getBucketName, getRegion, getAccountID}