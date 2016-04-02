/**
 * Created by lukasz on 02.04.2016.
 */
define(function (require) {

  var Backbone = require('backbone'),
    _ = require('underscore'),
    Config = require('config');

  var StopModel = Backbone.Model.extend({
    url: Config.baseUrl + "/"
  })

  return StopModel;

})

