thing = () => {
  var d = new Date();
  d.setSeconds(0);
  d.setMinutes(0);
  d.setHours(0);
  flag = false;
  firstToday = true;
  for (var i = 0; i < 1440; i++) {
    if (d.getHours() === 10 && firstToday) {
      flag = true;
      firstToday = false;
    }

    if (i % 20 === 0) {
      console.log(d.toLocaleTimeString());
    }
    d.setMinutes(d.getMinutes() + 1);

    if (d.getMinutes() === 0 && d.getHours() === 0) {
      firstToday = true;
    }

    if (flag) {
      console.log("SEND THE DOC NOW NOW NOW");
      flag = false;
      // return true
    } else {
      //return false
    }
  }
};

for (var i = 0; i < 5; i++) {
  thing();
}

