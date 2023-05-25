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

  const arr = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < seatNums.length; j++) {
      const obj = {
        id: `${rows[i]}-${seatNums[j]}`,
        isAvailable: false,
      };
      //
      // obj.id = `${rows[i]}-${seatNums[j]}`,
      // obj.isAvailable= false
      arr.push(obj);
    }
  }

  console.log(arr);
  try {
    await client.connect();
    await db.collection("seats").insertMany(arr);

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
