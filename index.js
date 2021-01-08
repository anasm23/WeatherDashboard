////
var APIKey = "ba465d36d563ab2554496783400dba83";
////
$(document).ready(function () {
    //search button funct
    $("#search-button").on("click", function () {
        var searchTerm = $("#search").val();
        $("#search").val('');
        weatherFunction(searchTerm);
        weatherForecast(searchTerm);
    });
    $("clear").on("click", function (){
        localStorage.clear(history);
    }
    )
    $("#search-button").keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === 13) {
            weatherFunction(searchTerm);
            weatherForecast(searchTerm);
        }
    });

    var history = JSON.parse(localStorage.getItem("history")) || [];

    if (history.length > 0) {
        weatherFunction(history[history.length - 1]);
    }
    for (var i = 0; i < history.length; i++) {
        createRow(history[i]);
    }
    /////
    function createRow(text) {
        var listItem = $("<li>").addClass("list-group-item").text(text);
        $(".history").append(listItem);
    }
    ////
    $(".history").on("click", "li", function () {
        weatherFunction($(this).text());
        weatherForecast($(this).text());
    });
    //////
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
    function weatherForecast(searchTerm) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=ba465d36d563ab2554496783400dba83&units=imperial",

        }).then(function (data) {
            console.log(data);
            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
            for (var i = 0; i < data.list.length; i++) {

                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    ///title card and icon
                    var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                    /// 5 day forecast 
                    var addCol = $("<div>").addClass("col-md-2");
                    var cardRen = $("<div>").addClass("card bg-primary text-black");
                    var cardBod = $("<div>").addClass("card-body p-2");
                    var humidRen = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var tempRen = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
                    //////
                    addCol.append(cardRen.append(cardBod.append(titleFive, imgFive, tempRen, humidRen)));
                    $("#forecast .row").append(addCol);
                }
            }
        });
    }

});