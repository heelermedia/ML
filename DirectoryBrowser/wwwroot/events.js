var Events = (function () {

    function Events() {
        var self = this;
        self.events = {};
    };
    Events.prototype.exists = function (eventName) {
        return this.events.hasOwnProperty(eventName);
    }
    Events.prototype.register = function (eventName, context) {
        if (!this.exists(eventName)) {
            this.events[eventName] = {};
            this.events[eventName].subscribers = [];
        }
    }
    Events.prototype.publish = function () {
        var args = [].slice.call(arguments);
        var eventName = args.shift();
        if (this.exists(eventName)) {
            var eventObj = this.events[eventName];
            eventObj.subscribers.forEach(function (subscriber) {
                subscriber.callBack.apply(subscriber.context, args);
            });
        }
    }
    Events.prototype.subscribe = function (eventName, callBack, context) {
        this.register(eventName, context);
        var eventObj = this.events[eventName];
        eventObj.subscribers.push({ callBack: callBack, context: context, key: context.constructor.name, eventName: eventName });
    }
    Events.prototype.unsubscribe = function (eventName, callBack) {
        if (this.exists(eventName)) {
            var eventObj = this.events[eventName];
            eventObj.subscribers = eventObj.subscribers.filter(function (subscriberObj) {
                subscriberObj = null;
            });
        }
    }
    Events.prototype.unsubscribeAll = function (ignoreKeys) {
        var keys = Object.keys(this.events);
        var toUnsubscribe = keys.filter(function (k) {
            return ignoreKeys.indexOf(k) > -1 === false;
        });
        for (var i = 0; i < toUnsubscribe.length; i++) {
            toUnsubscribe[i] = null;
        }
    }
    return Events;
}());



