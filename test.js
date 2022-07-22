log = function () {
  const key = Object.keys(this)[0];
  const value = this[key];
  console.log(`${key}:${value}`);
};

let someValue = 2;

// log({ someValue }); //someValue:2

function thing(var1) {
    // log({var1})
    console.log(JSON.stringify(var1, null, "\t"))
}

thing(someValue)
