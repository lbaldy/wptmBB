/**
 * Created by lukasz on 29.03.2016.
 */
/**
 * Created by lukasz on 03.01.2016.
 */
define(function (require) {

  var Backbone = require('backbone'),
    HomeView = require("../views/HomeView");


  var AppRouter = Backbone.Router.extend({

    routes: {
      "": "HomeView"
    },

    HomeView: function () {
      var homeView = new HomeView();
    }

  })

  return AppRouter;

})
