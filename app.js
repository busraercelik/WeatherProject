// body-parser is a package, it will allow me to look through the body of the post request
// and fetch the data based on the name of my input
const express = require('express');
const https = require('https');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
//GET is used to request data from a specified resource.
// make a get request to openweathermap server 
// fetch the data as a json from external server and parse it 
app.get("/", function(req, res){
    // index.html i alir.
    res.sendFile(__dirname + "/index.html");
});

// html de girilen datayi post metoduyla yakalariz.
app.post("/", function(req, res){
    // kullanicinin girdigi sehir adini alir. Dynamic data almis oluruz.
    const query = req.body.cityName;
    // autentication    
    const apiKey = "438a997151fceb50c4a10093657bbb42";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query + "&appid=" + apiKey + "&units=" + unit;
    
    // kullanicin belirledigi bolgenin(ilin) datasini al.
    https.get(url, function (response) {
        console.log(response.statusCode);

    response.on("data", function(data){
        //When receiving data from a web server, the data is always a string.
        //Parse the data with JSON.parse(), and the data becomes a JavaScript object.
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        // app'in icinde sadece 1 kez res.send() kullanabilirsin yoksa error verir.
        // res.send is equivalent to res.write + res.end
        // res.write can be called multiple times to provide successive parts of the body.
        res.write("<p>The weather is currently "+ weatherDescription + "</p>");
        res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
        res.write("<img src=" + imageURL+ ">");
        // birden fazla send yapmak icin 2 kez write kullandim.
        res.send();

        // we can log the data that we are interested in
        console.log(weatherDescription);
        });
    });
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
})

