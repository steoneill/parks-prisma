const { prisma } = require("./generated/prisma-client");
const ThemeParks = require("themeparks");

const Parks = {};

function generateParks() {
  for (const park in ThemeParks.Parks) {
    if (park.includes("Disney")) {
      Parks[park] = new ThemeParks.Parks[park]();
    }
  }
}

async function createRide(ride) {
  let createRide = await prisma.createRide({
    rideId: ride.id,
    name: ride.name,
    waitTime: ride.waitTime,
    active: ride.active,
    fastPass: ride.fastPass,
    status: ride.status,
    lastUpdate: ride.lastUpdate
  });
  console.log(`created new ride data for ${createRide.name}`);
}

async function updateRide(ride) {
  let updateRide = await prisma.updateRide({
    where: { rideId: ride.id },
    data: {
      waitTime: ride.waitTime,
      active: ride.active,
      fastPass: ride.fastPass,
      status: ride.status,
      lastUpdate: ride.lastUpdate
    }
  });
  console.log(`updated ride ${updateRide.name}`);
}

const CheckWaitTimes = park => {
  Parks[park]
    .GetWaitTimes()
    .then(rideTimes => {
      rideTimes.forEach(async ride => {
        const searchRide = await prisma.ride({ rideId: ride.id });
        if (searchRide === null) {
          createRide(ride);
        } else {
          updateRide(ride);
        }
      });
    })
    .catch(e => console.log(e));
};

getParks = () => {
  for (const park in Parks) {
    CheckWaitTimes(park);
  }
};

// A `main` function so that we can use async/await
async function main() {
  await generateParks();

  let minutes = 5,
    the_interval = minutes * 60 * 1000;

  getParks();

  setInterval(function() {
    console.log("5 minute check");
    getParks();
  }, the_interval);
}

module.exports = main;
