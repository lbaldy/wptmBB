/**
 * Created by lukasz on 04.01.2016.
 */
define(function (require) {

  var Backbone = require('backbone'),
    _ = require('underscore'),
    HeaderView = require('../views/HeaderView'),
    FooterView = require('../views/FooterView');

  var BaseAppView = Backbone.View.extend({

    el: "#content",

    initialize: function () {
      var headerView = new HeaderView();
      var footerView = new FooterView();
    }


  })

  return BaseAppView;

})
