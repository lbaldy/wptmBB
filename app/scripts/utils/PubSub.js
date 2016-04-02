/**
 * Created by lukasz on 20.01.2016.
 */
define(function (require) {

  var _ = require('underscore');

  var PubSub = {

    events: [],

    subscribe: function (event, handler, scope) {
      this.events.push({
        event: event,
        handler: handler,
        scope: scope
      })
    },

    publish: function (event) {
      var eventHandler = _.where(this.events, {
        event: event
      });

      eventHandler[0].handler.apply(eventHandler[0].scope);
    }


  }

  return PubSub;

})
