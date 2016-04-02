/**
 * Created by lukasz on 02.04.2016.
 */
define(function (require) {

  var Backbone = require('backbone'),
    _ = require('underscore'),
    Stop = require('../models/StopModel'),
    Config = require('config');

  var StopsCollection = Backbone.Collection.extend({
    url: Config.baseUrl + "/stops",
    model: Stop
  })

  return StopsCollection;

})

