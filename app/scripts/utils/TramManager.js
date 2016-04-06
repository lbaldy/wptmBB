/**
 * Created by lukasz on 06.04.2016.
 */
define(function (require) {
  var Config = require("config");

  var TramManager = {
    getNearestTrams: function (lat, lon, distance) {

      var deferred = $.Deferred();
      var apiUrl = Config.baseUrl + "/warsaw-trams/position/current/near?latitude=" + lat + "&longitude=" + lon + "&maxDistance=" + distance;
      $.ajax({
        url: apiUrl,
        success: function (data) {
          deferred.resolve(data)
        },
        error: function (data) {
          deferred.reject(data);
        }
      })

      return deferred;
    }
  }

  return TramManager


})
