function f(a, b) {
  return new Promise(function (resolve, reject) {
    if (a === b) {
      resolve({
        result: true,
        var1: a,
        var2: b,
      });
    } else {
      reject(false);
    }
  });
}

function recurse(a, b) {
  f(a, b)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      doThing(a, b + 1);
    });
}

doThing(10, 0);
