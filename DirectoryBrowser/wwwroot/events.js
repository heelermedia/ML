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
            this.events[eventName].context = context;
            this.events[eventName].subscribers = [];
        }
    }

    Events.prototype.publish = function () {
        var args = [].slice.call(arguments);
        var eventName = args.shift();
        if (this.exists(eventName)) {
            var eventObj = this.events[eventName];
            eventObj.subscribers.forEach(function (subscriber) {
                subscriber.apply(eventObj.context, args);
            });
        }
    }

    Events.prototype.subscribe = function (eventName, callBack, context) {
        if (!eventName) {
            console.log("Events: Attempting to subscribe with an empty event name. callBack: " + callBack);
            return function () { };
        }

        if (!callBack) {
            console.log("Events: Attempting to subscribe with an empty callback. event name: " + eventName);
            return function () { };
        }

        if (!context) {

        }

        this.register(eventName, context);
        var eventObj = this.events[eventName];
        eventObj.subscribers.push(callBack);
       
    }

    //TODO: um yea this needs work
    Events.prototype.unsubscribe = function (eventName, callBack) {
        if (this.exists(eventName)) {
            var eventObj = this.events[eventName];
            eventObj.subscribers = eventObj.subscribers.filter(function (subscriber) {
                if (subscriber !== callBack) {
                    return subscriber;
                };
            });
        }
    }


    return Events;

}());



