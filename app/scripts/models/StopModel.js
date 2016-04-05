/**
 * Created by lukasz on 02.04.2016.
 */
define(function (require) {

  var Backbone = require('backbone'),
    _ = require('underscore'),
    Config = require('config');

  var StopModel = Backbone.Model.extend({
    url: Config.baseUrl + "/stops",

    fetch: function (lat, lon) {
      if (lat && lon) {
        this.url += '/nearest?lat=' + lat + "&lon=" + lon;
      } else {
        this.url += Config.baseUrl + "/stops";
      }
      return Backbone.Model.prototype.fetch.call(this);
    }

  })

  return StopModel;

})

