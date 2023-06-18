const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set("view engine", "ejs");

app.get("/",function(req,res){
         res.render("weather",{
            loading: "loading",
            bgurl: "https://source.unsplash.com/1600x900/?landscape",
            city: "query",
            temperature: "temp",
            imageurl: "images/cloud.png",
            weatherdesc: "weatherDescription",
            humid: "humidity",
            speed:"wind"});
    });

app.post("/",function(req,res){

    const query = req.body.cityName;
    const bgimage = "https://source.unsplash.com/1600x900/?"+query+"";
    const apiKey = "63436e4df4feacbf27e9e6e33c3f540b";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;

      https.get(url,function(response){

        console.log(response.statusCode);
        response.on("data",function(data){
          const weatherData = JSON.parse(data);
          if(weatherData.cod === "404")
          {
               res.sendFile(__dirname + "/failure.html");
          }
          else{
            const temp = weatherData.main.temp;
            console.log(temp);
            const humidity = weatherData.main.humidity;
            console.log(humidity);
            const wind = weatherData.wind.speed;
            console.log(wind);
            const weatherDescription = weatherData.weather[0].description;
            console.log(weatherDescription);
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
              res.render("weather",{
                 loading: "weather",
                 bgurl: bgimage,
                 city: query,
                 temperature: temp,
                 imageurl: imageURL,
                 weatherdesc: weatherDescription,
                 humid: humidity,
                 speed: wind
               });
          }

        });
    });
  });

  app.post("/failure", function(req,res){
    res.redirect("/");
  });

app.listen(process.env.PORT || 5000, function(){
  console.log("server running on port 5000");
})
