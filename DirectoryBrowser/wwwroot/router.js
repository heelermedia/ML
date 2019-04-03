(function (history) {
    var pushState = history.pushState;
    history.pushState = function (state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({ state: state });
        }
        return pushState.apply(history, arguments);
    }
    history.routeHistory = [window.location.href];
})(window.history);

var Router = (function () {
    function Router() {
        var self = this;
        this.history = [];
        this.currentPath = window.location.pathname;
        this.pushHistory = true;
        DB.Events.subscribe('rootNodeChanged', this.navigate, this);
        window.onpopstate = function (e) {
            console.log("location: " + document.location + ", state: " + JSON.stringify(e.state, null, 2));

            self.pushHistory = false;

            var previousState = null;
            if (self.history.length > 0) {
                self.history.pop();
                previousState = self.history[self.history.length - 1];
                console.log(JSON.stringify(previousState, null, 2));
                //if (previousState.nodeName === e.state.nodeName) {
                //    previousState = self.history.pop();
                //}
            }
            DB.Events.publish('routeChanged', previousState.serverPath || previousState.path);
        }

        window.history.onpushstate = function (e) {
            console.log("location: " + document.location + ", state: " + JSON.stringify(e.state, null, 2));

        }

        this.initialize();
    };

    Router.prototype.navigate = function (node) {
        if (this.pushHistory) {
            var activePath = this.getNodePath(node.path);
            var toPush = { nodeName: node.name, path: node.path };
            window.history.pushState(toPush, '', `${activePath}`);
            this.history.push(toPush);
        } else {
            this.pushHistory = true;
        }
        DB.Events.publish('breadCrumbsChanged', this.getHistoryStack(node.path));
    }

    Router.prototype.getCurrentPath = function () {
        return window.location.pathname;
    }

    Router.prototype.getNodePath = function (path) {
        var splits = path.split("\\");
        splits.splice(0, 1);
        return splits.join('/');
    }

    Router.prototype.initialize = function () {
        var path;
        if (window.location.pathname !== '/') {
            path = window.location.pathname;
        } else {
            path = 'C:\\Projects\\knockout-asp-net-core';
        }
        this.history = this.getHistoryStack(path);
        DB.Events.publish('routeChanged', path);
    }

    Router.prototype.getHistoryStack = function (path) {
        var history = [];
        var splits;
        if (path.indexOf("\\") > -1) {
            splits = path.split("\\")
        } else {
            splits = path.split("/")
        }
        splits.splice(0, 1);
        var length = splits.length - 1;
        var pathBuilder;
        var serverPathBuilder;
        for (var i = 0; i <= length; i++) {
            var nodeName = splits[i];
            if (pathBuilder) {
                pathBuilder = `${pathBuilder}/${nodeName}`;
                serverPathBuilder = `${serverPathBuilder}\\${nodeName}`;
            } else {
                pathBuilder = nodeName;
                serverPathBuilder = `C:\\${nodeName}`;
            }
            var toPush = { nodeName: nodeName, path: pathBuilder, serverPath: serverPathBuilder };
            //window.history.pushState(toPush, '', toPush.path);
            history.push(toPush);
        }
        console.log(JSON.stringify(history, null, 2));
        return history;
    }

    Router.prototype.previousStateMatches = function (pathA, pathB) {
        return pathA === pathB;
    }

    return Router;

}());
