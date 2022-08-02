let prom = new Promise(function (resolve, reject) {
  for (var i = 2; i < 20; i++) {
    if (i === 30) {
      resolve(i)
    }
  }
  reject("bad")
});

prom.then((res) => console.log(res)).catch((err) => console.log(err));
