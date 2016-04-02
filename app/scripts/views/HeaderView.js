/**
 * Created by lukasz on 04.01.2016.
 */
define(function(require){

  var Backbone = require('backbone'),
    _ = require('underscore'),
    HeaderTemplate = require('text!../templates/HeaderViewTemplate.html');


  var HeaderView = Backbone.View.extend({

    el: "#header",

    template: HeaderTemplate,

    initialize: function(){
      this.render();
    },

    render: function(){
      this.$el.html(_.template(this.template));
    }

  })

  return HeaderView;

})
