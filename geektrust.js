const fs = require("fs");

const filename = process.argv[2];

fs.readFile(filename, "utf8", (err, data) => {
  if (err) throw err;
  var list = data.toString().split("\n");
  // Add your code here to process input commands

  for (let i = 0; i < list.length; i++) {
    if (list[i].includes("\r")) {
      list[i] = list[i].replace("\r", "");
    }
  }

  const type_charges = {
    ADULT: 200,
    SENIOR_CITIZEN: 100,
    KID: 50,
  };

  const balance_details = {};
  const checkin_details = {};
  let second_journey = [];
  const central = {
    total: 0,
    discount: 0,
    passenger_type: { ADULT: 0, KID: 0, SENIOR_CITIZEN: 0 },
  };

  const airport = {
    total: 0,
    discount: 0,
    passenger_type: { ADULT: 0, KID: 0, SENIOR_CITIZEN: 0 },
  };

  for (let i in list) {
    if (list[i].includes("BALANCE")) {
      let el = list[i].split(" ");
      balance_details[el[1]] = parseInt(el[2]);
    } else if (list[i].includes("CHECK_IN")) {
      let el = list[i].split(" ");
      checkin_details[i] = [el[1], el[2], el[3]];
    }
  }

  for (let i in checkin_details) {
    let prop = checkin_details[i];
    let id = prop[0];
    let type = prop[1];
    let origin = prop[2];
    let charge_amount = type_charges[type];
    let disc = 0;
    if (second_journey.includes(id)) {
      disc = charge_amount / 2;
      charge_amount = disc;
      second_journey = second_journey.filter((item) => item !== id);
    } else if (!second_journey.includes(id)) {
      second_journey.push(id);
    }
    let bal_amount = balance_details[id];
    let deduct_amount = 0;

    if (bal_amount < charge_amount) {
      let rem = charge_amount - bal_amount;
      let spare = (rem * 2) / 100;
      balance_details[id] = 0;
      if (origin === "CENTRAL") {
        central["total"] += charge_amount + spare;
        central["discount"] += disc;
        central["passenger_type"][type]++;
      } else if (origin === "AIRPORT") {
        airport["total"] += charge_amount + spare;
        airport["discount"] += disc;
        airport["passenger_type"][type]++;
      }
    } else {
      let rem_balance = bal_amount - charge_amount;
      balance_details[id] = rem_balance;
      if (origin === "CENTRAL") {
        central["total"] += charge_amount;
        central["discount"] += disc;
        central["passenger_type"][type]++;
      } else if (origin === "AIRPORT") {
        airport["total"] += charge_amount;
        airport["discount"] += disc;
        airport["passenger_type"][type]++;
      }
    }
  }

  console.log(
    `TOTAL_COLLECTION\tCENTRAL\t${central.total}\t${central.discount}`
  );

  console.log("PASSENGER_TYPE_SUMMARY");
  for (let i in central["passenger_type"]) {
    if (central["passenger_type"][i] !== 0) {
      console.log(`${i}\t${central["passenger_type"][i]}`);
    }
  }

  console.log(
    `TOTAL_COLLECTION\tAIRPORT\t${airport.total}\t${airport.discount}`
  );
  console.log("PASSENGER_TYPE_SUMMARY");

  for (let i in airport["passenger_type"]) {
    if (airport["passenger_type"][i] !== 0) {
      console.log(`${i}\t${airport["passenger_type"][i]}`);
    }
  }
});
