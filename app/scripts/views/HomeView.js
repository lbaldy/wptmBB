/**
 * Created by lukasz on 29.03.2016.
 */
define(function (require) {

  var BaseAppView = require("../views/BaseAppView"),
    MapsApi = require('mapsapi'),
    Template = require("text!../templates/HomeViewTemplate.html"),
    StopsModel = require("../models/StopModel");

  var HomeView = BaseAppView.extend({

    stopModel: new StopsModel(),

    initialize: function () {
      var options = {};
      var self = this;

      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude,
          lng = position.coords.longitude,
          elementId = 'map';

        self.map = new google.maps.Map(document.getElementById(elementId), {
          center: {lat: lat, lng: lng},
          zoom: 16
        });

        var mapOptions = {
          styles: [
            {
              featureType: "transit.station.bus",
              stylers: [
                {visibility: "off"}
              ]
            }
          ]
        };

        self.map.setOptions(mapOptions);

        self.map.addListener("click", function (e) {
          self.stopModel.fetch(e.latLng.lat(), e.latLng.lng()).done(function(){
            console.log("sucess");
          }).fail(function(){
            console.log("fail");
          })
        });

      });

      BaseAppView.prototype.initialize.call(this, options);
      this.render();

    },

    render: function () {
      var template = _.template(Template)();
      this.$el.html(template)
    }


  })

  return HomeView;

})
