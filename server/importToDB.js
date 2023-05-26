"use strict";

const { MongoClient, ReturnDocument } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const client = new MongoClient(MONGO_URI, options);

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");
const db = client.db("ticket-tracker");

const importSeats = async (req, res) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const bigArr = [];
  for (let i = 0; i < rows.length; i++) {
    const rowObj = { rowID: rows[i], rowSeats: [] };
    for (let j = 0; j < seatNums.length; j++) {
      const seatObj = {
        seatID: `${rows[i]}-${seatNums[j]}`,
        isAvailable: true,
      };

      //
      // obj.id = `${rows[i]}-${seatNums[j]}`,
      // obj.isAvailable= false
      // console.log(rowObj,'wtf');
      rowObj.rowSeats.push(seatObj);
      // [{id: 'A-1', isAvailable: false}, {id: 'A-2', isAvailable: false}, etc ]
      // todo ['A': [{id: 'A-1', isAvailable: false}, {id: 'A-2', isAvailable: false}, etc] , etc ]
    }
    bigArr.push(rowObj);
  }

  // todo want [ {rowID: 'A', rowSeats: [...]}, ...]
  // first make array, bigArr. done
  // then for each row, make rowObj
  // inner loop, push all seatObjs into rowObj
  // push rowObjs into bigArr

  console.log(bigArr, "yodododo");
  try {
    await client.connect();
    await db.collection("seats").insertMany(bigArr);

    const result = await db.collection("seats").find().toArray();
    console.log(result, "got seats");

    if (result) {
      console.log(result, "YAYYYYYYYYYYYYYYYYYYYYY");
    }
  } catch (err) {
    console.log(err);
  }
  client.close();
};

importSeats();
