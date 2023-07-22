const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

let weatherData;
let imageURL;
let query;
let weatherInfo ={ temp:null,weatherDes: null,coord_lat:null,coord_lon:null,mainWeather:null,
                   feels_Like:null,maxTemp:null,minTemp:null,pres:null,hum:null,visibility:null,
                   windSp:null,windDir:null,rain:null,clouds:null,dt:null,sunrise:null,sunset:null};
let aqiData;
let lon;
let lat;

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));


app.get("/", function(req,res){

  // res.sendFile(__dirname + "/index.html");
  res.render("home");

  });

app.post("/",function(req,res){

  query = req.body.cityName;
  const apiKey = "cdb0c35ac7153653f5ff7e88ebe27a1b";
  const url_weather = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=metric#";
  https.get(url_weather,function(response){

    console.log(response.statusCode);

    response.on("data",function(data){
      weatherData = JSON.parse(data);

      const icon = weatherData.weather[0].icon;
      imageURL = "https://openweathermap.org/img/wn/" + icon +"@2x.png";
      console.log(weatherData.coord.lon);
      console.log(weatherData.coord.lat);
      lon = weatherData.coord.lon;
      lat = weatherData.coord.lat;


    }); });
    const url_aqi = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    https.get(url_aqi,function(response){

      console.log(response.statusCode);

      response.on("data",function(data){
        aqiData = JSON.parse(data);

        res.redirect("/weather");
      });
  });

});

app.get("/weather",function(req,res){
  res.render("index",{weatherData:weatherData, imageURL: imageURL, cityName: query, aqiData:aqiData});

  // res.render("weather",{weatherInfo:weatherInfo, imageURL: imageURL, cityName: query});
  // res.render("weather",{weatherDescription: weatherDes, cityName: query,imageURL: imageURL, temperature: temp});
});

app.listen("3000", function(){
  console.log("Server is running on port 3000");
});



// https://api.openweathermap.org/data/2.5/weather?q=lucknow&appid=cdb0c35ac7153653f5ff7e88ebe27a1b&units=metric#
