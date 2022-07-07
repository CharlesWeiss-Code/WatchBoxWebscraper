const utilFunc = require('./utilityFunctions')


start = async () => {
    await utilFunc.checkNewDay()
}

start()