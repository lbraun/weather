// Refresh Button
GOOGLE_KEY = "AIzaSyD2qgiiv8Ajhq_i8Yt9Et7ruQJ9ssuVjZY";
OPEN_WEATHER_KEY = "7263b8f0e64bb20337aa7d9a040335ab";
CURRENT_STATION = "";

$(document).on("click", "#refresh-button", function () {
    // Prevent the usual navigation behavior
    event.preventDefault();

    // Get current location
    $.post("https://www.googleapis.com/geolocation/v1/geolocate?key=" + GOOGLE_KEY,
        function (response) {
            lat = response.location.lat;
            lng = response.location.lng;
            units = "metric";
            cnt = 30;

            api_url = "http://api.openweathermap.org/data/2.5/find?"
                + "APPID=" + OPEN_WEATHER_KEY
                + "&lat=" + lat
                + "&lon=" + lng
                + "&units=" + units
                + "&cnt=" + cnt;

            $.getJSON(api_url,
                function (data) {
                    // Process response from OpenWeatherMaps API call
                    stations = data.list;
                    // Clear list of existing stations
                    $('#station-list li').remove();
                    // Populate list with fresh stations
                    $.each(stations, function (index, station) {
                        $('#station-list').append(
                            '<li data-id=' + index + '><a id="station-details-link" href="#">' + station.name +
                            '<span class="ui-li-count">' + Math.round(station.main.temp) + 'º</span>' +
                            '</a></li>');
                    });
                    // Refresh list content
                    $('#station-list').listview('refresh');
                })
        })
});

$(document).on('pagebeforeshow', '#index-page', function () {
    $(document).on('click', '#station-details-link', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        // Store the id of the station that was clicked
        CURRENT_STATION = stations[e.target.parentElement.dataset["id"]];

        // Navigate to details page
        $.mobile.changePage("#station-details-page");
    })
});

$(document).on('pagebeforeshow', '#station-details-page', function (e) {
    e.preventDefault();
    $('#station-icon').attr('src','http://openweathermap.org/img/w/' + CURRENT_STATION.weather[0].icon + '.png');
    $('#station-name').text(CURRENT_STATION.name);
    $('#station-description').text(CURRENT_STATION.weather[0].description);
    $('#station-temp').text('Temperature: ' + CURRENT_STATION.main.temp);
    $('#station-humidity').text('Humidity: ' + CURRENT_STATION.main.humidity + ' %');
    $('#station-pressure').text('Pressure: ' + CURRENT_STATION.main.pressure + ' hpa');
});
