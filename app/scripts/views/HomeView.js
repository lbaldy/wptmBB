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
    TramBase64 = require("text!../../images/trambase64.txt"),
    TramInfoTemplate = require("text!../templates/TramInfoTmpl.html");

  var HomeView = BaseAppView.extend({

    stopModel: new StopsModel(),

    image: new Image(),

    markers: [],

    trams: [],

    stopImage: {
      url: "images/tram.png"
    },

    events: {
      "click .hideInfo": "hideInfo"
    },

    tramImage: function (line, angle) {
      var canvas = document.createElement('canvas');//new Canvas();//document.getElementById("c");
      var ctx = canvas.getContext("2d");


      ctx.rotate(angle*Math.PI/180);
      ctx.fillStyle = "black";
      ctx.fillRect(10, 70, 15, 20);
      ctx.strokeRect(10, 70, 15, 20)
      ctx.fillStyle = 'red';
      ctx.fillText(line, 12, 80);
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
          }, 30000);

          window.setInterval(function () {
            self.animateTrams()
          }, 1)

          self.drawMarkers();

          // self.map.addListener("click", function (e) {
          //   self.stopModel.fetch(e.latLng.lat(), e.latLng.lng()).done(function (data) {
          //     self.markers.push(new google.maps.LatLng(data.lat, data.lon));
          //     self.drawMarkers();
          //     self.getTrams(data);
          //   }).fail(function () {
          //     console.log("fail");
          //   });
          // });

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
          label: "S",
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
              // icon: self.tramImage(data[i].vehiclePositionData.shortName, data[i].vehiclePositionData.bearing),
              customData: data[i]
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
        self.animateTrams();
        self.trams[i].marker.addListener("click", function (e) {
          self.$el.find("#tramInfo").html(_.template(TramInfoTemplate)(this.customData.vehiclePositionData)).show();
          console.log(this.customData.vehiclePositionData.shortName)
        })
      }
    },

    clearTrams: function () {
      var self = this;
      for (var i = 0; i < this.trams.length; i++) {
        self.trams[i].marker.setMap(null);
      }
    },

    computeDestinationPoint: function (start, end, distance, bearing, radius) {

      var lat = start;
      var lng = end;

      radius = (typeof radius === 'undefined') ? 6378137 : Number(radius);

      var δ = Number(distance) / radius; // angular distance in radians
      var θ = Number(bearing);

      var φ1 = Number(lat) / 180;
      var λ1 = Number(lng) / 180;

      var φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) +
        Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
      var λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
          Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));
      λ2 = (λ2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // normalise to -180..+180°

      return {
        latitude: φ2 * 180,
        longitude: λ2 * 180
      };

    },

    animateTrams: function () {
      for (var i = 0; i < this.trams.length; i++) {
        var bearinRad = (360 - this.trams[i].data.vehiclePositionData.bearing) / 180;
        var dist = (this.trams[i].data.vehiclePositionData.calculatedSpeed * (1000 / 3600)) / 1000;
        var calculatedPosition = this.computeDestinationPoint(this.trams[i].marker.position.lat(), this.trams[i].marker.position.lng(), dist, bearinRad);
        this.trams[i].marker.setPosition(new google.maps.LatLng(calculatedPosition.latitude, calculatedPosition.longitude));
      }
    },


    render: function () {
      var template = _.template(Template)();
      this.$el.html(template)
    },

    hideInfo: function(){
      $("#tramInfo").hide();
    }


  })

  return HomeView;

})
