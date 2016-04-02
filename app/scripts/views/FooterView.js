/**
 * Created by lukasz on 04.01.2016.
 */
define(function (require) {

  var Backbone = require('backbone'),
    _ = require('underscore'),
    FooterViewTemplate = require('text!../templates/FooterViewTmpl.html');

  var FooterView = Backbone.View.extend({

    el: "#footer",

    initialize: function () {
      this.render();
    },

    render: function () {
      this.$el.html(_.template(FooterViewTemplate))
    }


  });

  return FooterView;

})
