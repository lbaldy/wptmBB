/**
 * Created by lukasz on 29.03.2016.
 */
define(function (require) {

  var BaseAppView = require("../views/BaseAppView"),
    MapsApi = require('mapsapi'),
    _ = require('underscore'),
    Template = require("text!../templates/HomeViewTemplate.html"),
    StopsModel = require("../models/StopModel"),
    Config = require("config"),
    TramsManager = require('../utils/TramManager');

  var HomeView = BaseAppView.extend({

    stopModel: new StopsModel(),

    markers: [],

    trams: [],

    stopImage: {
      url: "images/tram.png"
    },

    tramImage: {
      url: "images/tram_v1.png"
    },

    map: undefined,

    mapOptions: {
      styles: [
        {
          featureType: "transit.station",
          stylers: [
            {visibility: "off"}
          ]
        }
      ]
    },

    initialize: function () {
      var options = {};
      var self = this;

      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude,
          lng = position.coords.longitude,
          elementId = 'map';


        // Get the nearest stop to the map
        self.stopModel.fetch(lat, lng).done(function (data) {

          self.map = new google.maps.Map(document.getElementById(elementId), {
            center: {lat: data.lat, lng: data.lon},
            zoom: 16
          });

          self.markers.push(new google.maps.LatLng(data.lat, data.lon));
          self.getTrams(data);
          self.drawMarkers();

          self.map.addListener("click", function (e) {
            self.stopModel.fetch(e.latLng.lat(), e.latLng.lng()).done(function (data) {
              self.markers.push(new google.maps.LatLng(data.lat, data.lon));
              self.drawMarkers();
              self.getTrams(data);
            }).fail(function () {
              console.log("fail");
            });
          });

          self.map.setOptions(self.mapOptions);
        }).fail(function () {
          console.log("fail");
        })

      });

      BaseAppView.prototype.initialize.call(this, options);
      _.bindAll(this, 'drawTrams', 'drawMarkers', 'getTrams');
      this.render();
    },

    getTrams: function (data) {
      var self = this;
      self.trams = [];
      TramsManager.getNearestTrams(data.lat, data.lon, Config.distance).done(function (data) {
        console.log(data);
        for(var i = 0; i < data.length; i++){
          self.trams.push(new google.maps.LatLng(data[i].point.latitude, data[i].point.longitude));
        }
        self.drawTrams();
      }).fail(function (data) {
        console.log(data);
      });

    },

    clearMarkers: function () {

    },

    drawMarkers: function () {
      for (var i = 0; i < this.markers.length; i++) {
        new google.maps.Marker({
          position: this.markers[i],
          icon: this.stopImage,
          map: this.map
        });
      }
    },

    drawTrams: function(){
      for (var i = 0; i < this.trams.length; i++) {
        new google.maps.Marker({
          position: this.trams[i],
          icon: this.tramImage,
          map: this.map
        });
      }
    },

    render: function () {
      var template = _.template(Template)();
      this.$el.html(template)
    }


  })

  return HomeView;

})
