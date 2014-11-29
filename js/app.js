/*
    Author: Vincent Jonany
    Description: traffic cam challenge INFO 343
    Date: 11/23/14
*/
"use strict";

$(document).ready(function() {
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };

    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });

    $('#map').css('height', $(window).height() - $('#map').position().top - 20); 

    $(window).resize(function() {
        $('#map').css('height', $(window).height() - $('#map').position().top - 20);
    }); //resizes the map's height

    var infoWindow = new google.maps.InfoWindow();

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            data.forEach(function(cameras) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(cameras.location.latitude),
                        lng: Number(cameras.location.longitude)
                    },
                    map: map,
                    animation: google.maps.Animation.DROP,
                });

                google.maps.event.addListener(map, 'click', function() {
                        infoWindow.close();
                });

                google.maps.event.addListener(marker, 'click', function() {
                    var html = '<p>' + cameras.cameralabel + '</p>';
                    html += '<img src="' + cameras.imageurl.url  + '"/>';
                    infoWindow.setContent(html);
                    infoWindow.open(map, this); 
                    map.panTo(marker.getPosition());

                });

                var searchQuery = '';

                $('#search').bind("search keyup", function() {

                	searchQuery = this.value.toLowerCase();
                	var n = cameras.cameralabel.toLowerCase().indexOf(searchQuery);

                	if(n <= -1) {
                		marker.setMap(null);
                	}
                	else {
                		marker.setMap(map);
                	}
                });
            });

        }).fail(function(err) {
            alert(err);
        }).always(function(){
            $('#ajax-loader').fadeOut();
        });
});
