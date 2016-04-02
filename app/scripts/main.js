/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
  // The shim config allows us to configure dependencies for
  // scripts that do not call define() to register a module
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'backbone'
    }
  },
  paths: {
    jquery: '../../bower_components/jquery/dist/jquery',
    underscore: '../../bower_components/underscore/underscore',
    backbone: '../../bower_components/backbone/backbone',
    text: '../../bower_components/text/text',
    config: '../scripts/utils/Config',
    pubsub: '../utils/PubSub',
    mapsapi: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBzvem3lU7I_AT-TupnscWfX2aOh6DKtOs'
  }
});

require([
  'backbone',
  'scripts/views/HomeView',
  'scripts/routers/AppRouter',
], function (Backbone, AppView, AppRouter) {
  /*jshint nonew:false*/
  // Initialize routing and start Backbone.history()
  new AppRouter();
  Backbone.history.start();
  // Initialize the application view
  //new AppView();
});
