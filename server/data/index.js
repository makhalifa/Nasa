const fs = require("fs");
const path = require("path");

const { parse } = require("csv-parse");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

fs.createReadStream("data/kepler_data.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", async (data) => {
    isHabitablePlanet(data) && habitablePlanets.push(data);
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", async () => {
    // fs.writeFileSync(
    //   path.join(__dirname, "planets.json"),
    //   JSON.stringify(habitablePlanets)
    // );
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
