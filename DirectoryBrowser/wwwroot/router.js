var Router = (function () {
    function Router(events) {
        var self = this;
        this.events = events;
        this.history = [];
        this.currentPath = window.location.pathname;
        this.pushHistory = true;
        this.events.subscribe('rootNodeChanged', this.navigate, this);
        window.onpopstate = function (e) {
            self.pushHistory = false;
            var previousState = null;
            if (self.history.length > 0) {
                self.history.pop();
                previousState = self.history[self.history.length - 1];
            }
            self.events.publish('routeChanged', previousState.serverPath || previousState.path);
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
        this.events.publish('breadCrumbsChanged', this.getHistoryStack(node.path));
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
            path = 'C:\\TestingFolder';
        }
        this.history = this.getHistoryStack(path);
        this.events.publish('routeChanged', path);
        this.events.publish('breadCrumbsChanged', this.getHistoryStack(path));
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
            history.push(toPush);
        }
        return history;
    }
    return Router;
}());
