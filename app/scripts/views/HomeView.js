/**
 * Created by lukasz on 29.03.2016.
 */
define(function (require) {

  var BaseAppView = require("../views/BaseAppView"),
    MapsApi = require('mapsapi'),
    Template = require("text!../templates/HomeViewTemplate.html"),
    StopsCollection = require('../collections/StopsCollection');

  var HomeView = BaseAppView.extend({

    stopsCollection: new StopsCollection(),

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
          self.stopsCollection.fetch().done(function (collection) {
            console.log(collection);
          }).fail(function (error) {
            console.log(error);
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
