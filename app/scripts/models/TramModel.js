/**
 * Created by lukasz on 29.03.2016.
 */
define(function (require) {

  var Backbone = require('backbone'),
    _ = require('underscore'),
    Config = require('config');

  var TramModel = Backbone.Model.extend({
    url: Config.baseUrl + "/"
  })

  return TramModel;

})
