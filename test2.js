function f(a, b) {
  return new Promise(function (resolve, reject) {
    for (var i = a; i < b; i++) {
      if (i === 5 || i === 10) {
        resolve("Done");
      } else {
        reject(i);
      }
    }
  });
}

function recurse(a, b) {
  f(a, b)
    .then((res) => {
      console.log(res);
      recurse(a + 1, b);
    })
    .catch((err) => {
      console.log(err);
      recurse(a + 1, b);
    });
}

recurse(-1, 15);
