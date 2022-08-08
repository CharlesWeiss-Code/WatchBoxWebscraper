(() => {
  thing(0);
})();

function thing(start) {
  for (var i = start; i < 20; i++) {
    try {
      if (i === 10) throw "bad number";
      else console.log(i)
    } catch (error) {
      console.log(error);
      thing(i + 1);
      break;
    }
  }
}
