/**
 * Created by lukasz on 29.03.2016.
 */
define(function (require) {

  var Backbone = require('backbone'),
    _ = require('underscore'),
    Tram = require('../models/TramModel'),
    Config = require('config');

  var TramsCollection = Backbone.Collection.extend({
    model: Tram
  })

  return TramsCollection;

})
