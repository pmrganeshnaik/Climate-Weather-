import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var location = "Shadnagar";

// Date month year dd/mm/yy
var today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
let yyyy = today.getFullYear();
if (dd < 10) {
  dd = "0" + dd;
}
if (mm < 10) {
  mm = "0" + mm;
}
today = dd + "/" + mm + "/" + yyyy;


app.get("/", async (req, res) => {
  try {
    // Getting Longitude and lattitude
    const location_Details = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=f4127f53a0d93000b1cadcdbefe2ebd1`
    );

    // Extrating and Conveting data from JON to JavaScript
    const stateAsString = JSON.stringify(location_Details.data);
    const js = JSON.parse(stateAsString);

    // Extrating data from from JS object
    let lon = js[0].lon;
    let lat = js[0].lat;
    let state_name = js[0].state;
    let city_name = js[0].name;
    let country_name = js[0].country;

    // Getting Weather report form API
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f4127f53a0d93000b1cadcdbefe2ebd1&units=metric&Imperial=miles/hour`
    );

    //Extrating and Converting data from JON to JavaScript
    const content = JSON.stringify(result.data);
    const javaScript = JSON.parse(content);

    // UTC to Local time
    let sunrise_utc = new Date(javaScript.sys.sunrise);
    let sunset_utc = new Date(javaScript.sys.sunset);

    let sunrise_time = sunrise_utc.toLocaleTimeString();
    let sunset_time = sunset_utc.toLocaleTimeString();

    // Data passing to ejs file
    res.render("index.ejs", {
      temp: Math.round(javaScript.main.temp),
      feels_like: Math.round(javaScript.main.feels_like),
      pressure: javaScript.main.pressure,
      humidity: javaScript.main.humidity,
      sea_level: javaScript.main.sea_level,
      grnd_level: javaScript.main.grnd_level,
      visibility: javaScript.visibility / 1000,
      speed: javaScript.wind.speed,
      deg: javaScript.wind.deg,
      sunrise: sunrise_time,
      sunset: sunset_time,
      city_name,
      state_name,
      country_name,
      date: today,
      time: new Date().toLocaleTimeString(),
    });
  } catch (error) {
    console.error("The Error is soppted" + error);
  }
});

//After Input from user

app.post("/submit", async (req, res) => {
  var location2 = req.body["search"];
  console.log(location2);
  try {
    // Getting Longitude and lattitude
    const location_Details = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location2}&limit=5&appid=f4127f53a0d93000b1cadcdbefe2ebd1`
    );

    location2 = null
    // Extrating and Conveting data from JON to JavaScript
    const stateAsString = JSON.stringify(location_Details.data);
    const js = JSON.parse(stateAsString);

    // Extrating data from from JS object
    let lon = js[0].lon;
    let lat = js[0].lat;
    let state_name = js[0].state;
    let city_name = js[0].name;
    let country_name = js[0].country;

    // Getting Weather report form API
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f4127f53a0d93000b1cadcdbefe2ebd1&units=metric&Imperial=miles/hour`
    );

    //Extrating and Converting data from JON to JavaScript
    const content = JSON.stringify(result.data);
    const javaScript = JSON.parse(content);

    // UTC to Local time
    let sunrise_utc = new Date(javaScript.sys.sunrise);
    let sunset_utc = new Date(javaScript.sys.sunset);


    let sunrise_time = sunrise_utc.toLocaleTimeString();
    let sunset_time = sunset_utc.toLocaleTimeString();


    // Data passing to ejs file
    res.render("index.ejs", {
      temp: Math.round(javaScript.main.temp),
      feels_like: Math.round(javaScript.main.feels_like),
      pressure: javaScript.main.pressure,
      humidity: javaScript.main.humidity,
      sea_level: javaScript.main.sea_level,
      grnd_level: javaScript.main.grnd_level,
      visibility: javaScript.visibility / 1000,
      speed: javaScript.wind.speed,
      deg: javaScript.wind.deg,
      sunrise: sunrise_time,
      sunset: sunset_time,
      city_name,
      state_name,
      country_name,
      date: today,
      time: new Date().getTime().toLocaleTimeString,
    });
  } catch (error) {
    console.error("The Error is soppted" + error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
