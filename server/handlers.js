"use strict";

const { MongoClient, ReturnDocument } = require("mongodb");

// const { flights } = require("./data");

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

console.log("test, handlers.js is opening");
const getSeats = async (req, res) => {
  console.log("getSeats triggered");
  console.log(req, "req");
  try {
    await client.connect();
    console.log("getting seats...");
    const result = await db.collection("seats").find().toArray();
    console.log(result, "got seats");
    console.log("YOU HAVE NO IDEA ABOUT THE OBJECT.KEYS OR ID DO YOU");
    // const seatsArr = Object.keys(result[0]).filter((key) => {
    //   if (key !== "_id") {
    //     return key;
    //   }
    // });

    if (result) {
      res.status(200).json({
        status: 200,
        message: "Request received. Here are all the seat availabilities.",
        body: result,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "We got your request. Something went wrong.",
      });
    }
  } catch (err) {
    console.log(err);
    console.log("da???");
  }
  client.close();
};

// returns an array of all flight numbers
const getFlights = async (req, res) => {
  try {
    await client.connect();
    const result = await db.collection("flights").find().toArray();
    console.log(result, "got flights?");
    const flightsArr = Object.keys(result[0]).filter((key) => {
      if (key !== "_id") {
        return key;
      }
    });

    // [{id, flightkey: [], flightkey: []}]
    // want flightkeys only
    if (result) {
      res.status(200).json({
        status: 200,
        message:
          "Request received. Here are all the current flight numbers with Slingair.",
        data: flightsArr,
      });
    } else {
      res.status(404).json({
        status: 404,
        message:
          "Request received, but the data you were looking for wasn't found.",
      });
    }
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

// returns all the seats on a specified flight
const getFlight = async (req, res) => {
  const { flight } = req.params;
  let flightExists = false;
  try {
    await client.connect();
    const result = await db.collection("flights").find().toArray();
    // ` object.keys gives arr of id, flightkey, flightkey
    let flightIndex;
    Object.keys(result[0]).filter((key, index) => {
      if (key === flight) {
        flightExists = true;
        flightIndex = index;
        return key, index;
      }
    });
    // ? match id of object with flightIndex, return that array

    const singleFlightSeats = Object.values(result[0]);
    // [{id, flightkey: [], flightkey: []}]
    // want flightkeys only
    if (flightExists) {
      res.status(200).json({
        status: 200,
        message: `Request received. Here are all the seats on Slingair flight ${flight}.`,
        data: singleFlightSeats[flightIndex],
      });
    } else {
      res.status(404).json({
        status: 404,
        message: `Request received, but flight ${flight} was not found. Please make sure you typed the flight number correctly, as flight codes are case-sensitive. Oh, you already did? Well... maybe your computer is mad at you. Go outside.`,
      });
    }
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

// returns all reservations
const getReservations = async (req, res) => {
  try {
    await client.connect();
    const result = await db.collection("reservations").find().toArray();

    if (result) {
      res.status(200).json({
        status: 200,
        message: `Request received. Here are all the currently booked seats with Slingair.`,
        data: result,
      });
    } else {
      res.status(404).json({
        status: 404,
        message:
          "Request received, but the data you were looking for wasn't found.",
      });
    }
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

// returns a single reservation
const getSingleReservation = async (req, res) => {
  const { reservation: reservationCodeFromURL } = req.params;
  let foundRes = false;
  // 5b30101e-ca8b-485e-99a0-3c3a9f57af45 gives seat 4D on flight SA231
  try {
    await client.connect();
    const result = await db.collection("reservations").find().toArray();
    const desiredReservation = result.filter((reservation) => {
      if (reservation.reservationCode === reservationCodeFromURL) {
        foundRes = true;
        return reservation;
      }
    });

    if (foundRes) {
      res.status(200).json({
        status: 200,
        message:
          "Request received. Here is the info associated with your reservation code.",
        data: desiredReservation[0],
      });
    } else {
      res.status(404).json({
        status: 404,
        message: `Request received, but the data you were looking for wasn't found. The provided reservation code was invalid: ${reservationCodeFromURL}`,
      });
    }
  } catch (err) {
    console.log(err.stack);
  }
  client.close();

  // ? what does a reservation look like? its given in req.params via the url, but idk what itll be. must check FE
  // ? create reservation code in the BE, put in DB, send to FE?
};

// creates a new reservation
const addReservation = async (req, res) => {
  const reservationCode = uuidv4();
  const reservationInfo = { ...req.body, reservationCode: reservationCode };
  console.log(reservationInfo);
  // ` req.body formatted properly:
  //   {
  // 	"firstName": "James",
  // 	"lastName": "McGillicuddy",
  // 	"email": "cooldude69@neopets.com",
  // 	"flightNumber": "SA231",
  // 	"seatNum": "2C"
  // }

  try {
    await client.connect();
    const seatNum = req.body.seatNum;
    const flightNum = req.body.flightNumber;
    const result = await db.collection("flights").find().toArray();
    const flightSeats = result[0][flightNum];
    console.log(req.body, "req");
    console.log(flightNum, "flightnum");
    console.log(flightSeats, "flightseats array");
    if (!flightSeats) {
      res.status(400).json({
        status: 400,
        message: `Flight ${flightNum} does not exist. Please verify your flight selection. Also, how did you get this past the front end?`,
        data: req.body,
      });
    }
    let seatIsAvailable = false;
    flightSeats.forEach((seat) => {
      if (seat.id === seatNum && seat.isAvailable === true) {
        seatIsAvailable = true;
        console.log(seat, seatNum, "check seat availability");
      }
    });

    const match = flightNum + ".$." + "isAvailable";

    // * i wanted to put the insertOne and updateOne within the flightSeats.forEach in order to avoid using a boolean and cluttering up my code, but async await stuff cant be done within that particular if for some reason??
    // ! 'await' expressions are only allowed within async functions and at the top levels of modules.ts(1308)
    if (seatIsAvailable) {
      await db.collection("reservations").insertOne(reservationInfo);
      await db
        .collection("flights")
        .updateOne(
          { [flightNum]: { $elemMatch: { id: seatNum } } },
          { $set: { [match]: false } }
        );
      res.status(200).json({
        status: 200,
        message: `Request received. Your flight has been reserved. Your reservation code can be used to view your reservation. It will also be emailed to you. Reservation code: ${reservationCode}`,
        data: reservationInfo,
      });
    } else if (!seatIsAvailable) {
      res.status(400).json({
        status: 400,
        message: `The seat ${seatNum} on flight ${flightNum} is already booked. Please try another seat. Also, how did you get this past the front end?`,
        data: req.body,
      });
    } else {
      res.status(404).json({
        status: 404,
        message:
          "Request received, but the data you were looking for wasn't found. Verify your information and try again.",
        data: req.body,
      });
    }
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

// updates a specified reservation
const updateReservation = async (req, res) => {
  // * req.body format
  // {
  //   "flightNum": "SA231",
  //   "firstName": "dw",
  //   "lastName": "dw",
  //   "email": "dw@daa.ca",
  //   "seatNum": "6D",
  //   "desiredSeatNum": "",
  //   "reservationCode": "feeefaac-ef64-4b55-9872-84e196b72612"
  // }

  try {
    const flightNum = req.body.flightNumber;
    const seatNum = req.body.seatNum;
    const desiredSeatNum = req.body.desiredSeatNum;
    const reqbodyReservationCode = req.body.reservationCode;
    console.log(reqbodyReservationCode);
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    await client.connect();

    // search in reservations for desried seat.

    const reservationsArr = await db
      .collection("reservations")
      .find()
      .toArray();

    // console.log(reservationsArr); // should give array of objects
    let userHasReservedASeat = false; // confirm user indeed has a seat to change
    let seatIsBooked = false; // assume seat is free, but we will check
    let userHasChangedFirstName = false;
    let userHasChangedLastName = false;
    let userHasChangedEmail = false;
    // ! we dont need flights array from DB because we can reference the reservations instead
    reservationsArr.forEach((reservation) => {
      if (
        reservation.flightNumber === flightNum &&
        reservation.seatNum === desiredSeatNum
      ) {
        console.log("desiredseatbooked true");
        seatIsBooked = true;
      }

      if (
        reservation.flightNumber === flightNum &&
        reservation.seatNum === seatNum &&
        reservation.reservationCode === reqbodyReservationCode
      ) {
        console.log("user has a seat true");
        userHasReservedASeat = true;
      }
      if (
        reservation.reservationCode === reqbodyReservationCode &&
        reservation.firstName !== firstName
      ) {
        console.log("user firstame");
        userHasChangedFirstName = true;
      }
      if (
        reservation.reservationCode === reqbodyReservationCode &&
        reservation.lastName !== lastName
      ) {
        console.log("user lastname");
        userHasChangedLastName = true;
      }
      if (
        reservation.reservationCode === reqbodyReservationCode &&
        reservation.email !== email
      ) {
        console.log("user email");
        userHasChangedEmail = true;
      }
    });
    // todo if seat numbers match, be able to change the name
    if (userHasChangedFirstName) {
      await db.collection("reservations").updateOne(
        { reservationCode: reqbodyReservationCode },
        // do i need all the things in the set like email, lastname etc?
        { $set: { firstName: firstName, email, lastName } }
      );
      const data = await db
        .collection("reservations")
        .findOne({ reservationCode: reqbodyReservationCode });
      console.log(data);
      res.status(200).json({
        status: 200,
        message: `Request received. Your name has been changed.`,
        data: data,
      });
    }
    if (userHasChangedEmail) {
      await db.collection("reservations").updateOne(
        { reservationCode: reqbodyReservationCode },
        // do i need all the things in the set like email, lastname etc?
        { $set: { email: email, firstName, lastName } }
      );
      const data = await db
        .collection("reservations")
        .findOne({ reservationCode: reqbodyReservationCode });
      console.log(data);
      res.status(200).json({
        status: 200,
        message: `Request received. Your email has been changed.`,
        data: data,
      });
    }
    if (userHasChangedLastName) {
      await db.collection("reservations").updateOne(
        { reservationCode: reqbodyReservationCode },
        // do i need all the things in the set like email, lastname etc?
        { $set: { lastName: lastName, email, lastName } }
      );
      const data = await db
        .collection("reservations")
        .findOne({ reservationCode: reqbodyReservationCode });
      console.log(data);
      res.status(200).json({
        status: 200,
        message: `Request received. Your name has been changed.`,
        data: data,
      });
    }
    if (userHasReservedASeat && !seatIsBooked) {
      await db
        .collection("reservations")
        .updateOne(
          { reservationCode: reqbodyReservationCode },
          { $set: { seatNum: desiredSeatNum, email, firstName, lastName } }
        );
      const match = flightNum + ".$." + "isAvailable";
      await db
        .collection("flights")
        .updateOne(
          { [flightNum]: { $elemMatch: { id: desiredSeatNum } } },
          { $set: { [match]: false } }
        );
      await db
        .collection("flights")
        .updateOne(
          { [flightNum]: { $elemMatch: { id: seatNum } } },
          { $set: { [match]: true } }
        );
      const updatedReservation = await db
        .collection("reservations")
        .findOne({ reservationCode: reqbodyReservationCode });
      res.status(200).json({
        status: 200,
        message: `Request received. Your old seat ${seatNum} has been changed to ${desiredSeatNum}.`,
        data: updatedReservation,
      });
    } else if (seatIsBooked && userHasReservedASeat) {
      res.status(400).json({
        status: 400,
        message:
          "That seat is already booked. How did you even get that past the front end? You sneak.",
        data: req.body,
      });
    } else if (seatNum === desiredSeatNum) {
      await db
        .collection("reservations")
        .updateOne(
          { reservationCode: reqbodyReservationCode },
          { $set: { seatNum: seatNum, email, firstName, lastName } }
        );
      const updatedReservation = await db
        .collection("reservations")
        .findOne({ reservationCode: reqbodyReservationCode });
      res.status(200).json({
        status: 200,
        message:
          "You updated the reservation information associated with your code.",
        data: updatedReservation,
      });
    } else if (!userHasReservedASeat) {
      res.status(400).json({
        status: 400,
        message:
          "Your initial reservation was not found. Make sure your reservation code, flight, and seat numbers are all correct (they're case-sensitive).",
        data: req.body,
      });
    }

    // turning flight availability to false based off of flightnum and seatnum
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.close();
  }
};

// deletes a specified reservation
const deleteReservation = async (req, res) => {
  const { reservation: deleteThisReservationCode } = req.params;
  try {
    await client.connect();
    const reservationsArr = await db
      .collection("reservations")
      .find()
      .toArray();
    let reservationCodesMatch = false;
    reservationsArr.forEach((reservation) => {
      if (reservation.reservationCode === deleteThisReservationCode) {
        reservationCodesMatch = true;
      }
    });
    if (reservationCodesMatch) {
      const DBReservations = await db
        .collection("reservations")
        .find()
        .toArray();
      let flight;
      let seatID;

      const DBReservationToDelete = DBReservations.filter((reservation) => {
        flight = reservation.flightNumber;
        seatID = reservation.seatID;
        return deleteThisReservationCode === reservation.reservationCode;
      });
      console.log(DBReservations);
      const flightNum = DBReservationToDelete[0].flightNumber;
      const seatNum = DBReservationToDelete[0].seatNum;
      await db.collection("reservations").deleteOne({
        reservationCode: deleteThisReservationCode,
      });
      // ` deleteOne worked.
      const allSeatsOnFlightsFromDB = await db
        .collection("flights")
        .find()
        .toArray();

      console.log(allSeatsOnFlightsFromDB, "uidhwquidhwqiudhqwiu");
      console.log(flightNum, "nnmunumum");
      let deleteByID;
      let count = 1;
      let allSeatsRightFlightIndex;
      const singleFlightToBeReplaced = allSeatsOnFlightsFromDB.filter(
        (flight, index) => {
          if (flight[flightNum] && count > 0) {
            allSeatsRightFlightIndex = index;
            deleteByID = flight._id;
            count--;
            return flight[flightNum];
          }
        }
      );

      const correctFlight = singleFlightToBeReplaced;
      console.log(deleteByID);
      let indexToUpdate;
      console.log(singleFlightToBeReplaced[0][flightNum], "flightcorrec");
      singleFlightToBeReplaced[0][flightNum].forEach((seat, index) => {
        if (seat.id === seatNum) {
          console.log(
            "yayEUFIHIUEWFHEWIUFHEWUIFHWEIUFHWEIUFHWE9843583475984375984739857"
          );
          indexToUpdate = index;
        }
      });

      const replacementFlight = correctFlight[0];

      // console.log(replacementFlight, "replace");

      // console.log(
      //   singleFlightToBeReplaced,
      //   "YOOOOOOO",
      //   singleFlightToBeReplaced[0][flightNum],
      //   "ihihihihi984732948723"
      // );
      // console.log(query);
      // const findMsg = await db
      //   .collection("flights")
      //   .findOne({ [flightNum]: { ...singleFlightToBeReplaced } });

      const query = flightNum + ".id";
      // const query2 = singleFlightToBeReplaced[0][flightNum] + ".$.isAvailable";
      const query2 = flightNum + ".$.isAvailable";
      // console.log(indexToUpdate);
      // console.log(correctFlight, "correc");
      // console.log(query2[indexToUpdate], "query2");
      // !!!!!!!!!!!!!!!!!!!!!!!
      const updateMsg = await db
        .collection("flights")
        .updateOne({ [query]: seatNum }, { $set: { [query2]: true } });
      // !!!!!!!!!!!!!

      console.log(updateMsg, "find?!?!");
      console.log(query2, "query2");
      // console.log(...singleFlightToBeReplaced, "12314414");
      const updatedFlight = await db
        .collection("flights")
        .findOne({ [query]: seatNum });
      res.status(200).json({
        status: 200,
        message: `Reservation deleted successfully, or whatever. We didn't want your business anyways.`,
        data: updatedFlight,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: `Your reservation code did not match any in our database. Please try again or give up.`,
        data: req.body,
      });
    }
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

module.exports = {
  getSeats,
};
