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
    TramsManager = require('../utils/TramManager'),
    TramBase64 = require("text!../../images/trambase64.txt");

  var HomeView = BaseAppView.extend({

    stopModel: new StopsModel(),

    image: new Image(),

    markers: [],

    trams: [],

    stopImage: {
      url: "images/tram.png"
    },

    tramImage: function (angle) {
      var canvas = document.createElement('canvas');//new Canvas();//document.getElementById("c");
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      //console.log(angle);
      ctx.rotate(angle * Math.PI / 180);

      //ctx.fillRect(50,20, -50/2, -20/2);

      ctx.drawImage(this.image, -(this.image.width / 2), -(this.image.height / 2));
      // ctx.drawImage(this.image, 0, 0);
      return canvas.toDataURL();
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
    }
    ,

    initialize: function () {
      var options = {};
      var self = this;


      self.image.src = TramBase64;

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
          window.setInterval(function () {
            self.clearTrams();
            self.getTrams(data)
          }, 5000);

          window.setInterval(function(){
            self.animateTrams()
          }, 100)

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
      _.bindAll(this, 'drawTrams', 'drawMarkers', 'getTrams', 'tramImage');
      this.render();
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

    getTrams: function (data) {
      var self = this;
      self.trams = [];
      TramsManager.getNearestTrams(data.lat, data.lon, Config.distance).done(function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          self.trams.push({
            marker: new google.maps.Marker({
              position: new google.maps.LatLng(data[i].vehiclePositionData.lat, data[i].vehiclePositionData.lon),
            }),
            data: data[i]
          });
        }
        self.drawTrams();
      }).fail(function (data) {
        console.log(data);
      });

    },

    drawTrams: function () {
      var self = this;
      for (var i = 0; i < this.trams.length; i++) {
        self.trams[i].marker.setMap(self.map);
        var tramData = self.trams[i].data;
        self.animateTrams();
        self.trams[i].marker.addListener("click", function () {
          console.log(tramData);
        })
      }
    },

    clearTrams: function () {
      var self = this;
      for (var i = 0; i < this.trams.length; i++) {
        self.trams[i].marker.setMap(null);
      }
    },

    animateTrams: function(){
      // @TODO: Make this properly. It doesn't work and dividing by big number isn't a solution.
      for (var i = 0; i < this.trams.length; i++) {
        var sineBearing = (Math.sin(Math.PI * (this.trams[i].data.vehiclePositionData.bearing/180)))/100000;
        var cosBearing = (Math.cos(Math.PI * (this.trams[i].data.vehiclePositionData.bearing/180)))/100000;

        this.trams[i].marker.setPosition(new google.maps.LatLng(this.trams[i].marker.position.lat() + sineBearing, this.trams[i].marker.position.lng() + cosBearing));
      }
    },


    render: function () {
      var template = _.template(Template)();
      this.$el.html(template)
    }


  })

  return HomeView;

})
