# 06 Server-Side APIs: Weather Dashboard

## Deployed App
https://safe-savannah-47043.herokuapp.com/

## Description
Using the OpenWeather API, data is retrieved and displayed showing a 5-day Forecast and current day weather statistics. Results can be found through search of any city. 

Using AJAX, the OpenWeather api retrieves data in JSON format. The application dynamically updates with JQuery.

## Screenshot
<img src="./Assets/Screenshot.png">

## Code Snippet
```
function weatherFunction(searchTerm) {

        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=ba465d36d563ab2554496783400dba83&units=imperial",


        }).then(function (data) {
            if (history.indexOf(searchTerm) === -1) {
                history.push(searchTerm);
                localStorage.setItem("history", JSON.stringify(history));
                createRow(searchTerm);
            }
            $("#today").empty();

            var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");


            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");

            var lon = data.coord.lon;
            var lat = data.coord.lat;

            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/uvi?appid=ba465d36d563ab2554496783400dba83&lat=" + lat + "&lon=" + lon,
            }).then(function (response) {
                console.log(response + "Success");
                ////
                var uvResponse = response.value;
                var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);
                ////
                if (uvResponse < 3) {
                    btn.addClass("btn-success");
                } else if (uvResponse < 7) {
                    btn.addClass("btn-warning");
                } else {
                    btn.addClass("btn-danger");
                }
                ////
                cardBody.append(uvIndex);
                $("#today .card-body").append(uvIndex.append(btn));

            });
            /////
            title.append(img);
            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#today").append(card);
            console.log(data);
        });
    }
    
```

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

