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
        //Array.from(args);
        var eventName = args.shift();
        if (this.exists(eventName)) {
            var eventObj = this.events[eventName];
            eventObj.subscribers.forEach(function (subscriber) {
                subscriber.callBack.apply(subscriber.context, args);
            });
        }
    }

    Events.prototype.subscribe = function (eventName, callBack, context) {
        //console.log(`Event Name: ${eventName} Context: ${context.constructor.name}`);
        this.register(eventName, context);
        var eventObj = this.events[eventName];
        eventObj.subscribers.push({ callBack: callBack, context: context, key: context.constructor.name, eventName: eventName });
    }

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



