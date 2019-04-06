var Router = (function () {
    function Router(events) {
        var self = this;
        this.events = events;
        this.history = [];
        this.currentPath = window.location.pathname;
        this.queryParams = window.location.search;
        this.pushHistory = true;
        this.events.subscribe('rootNodeChanged', this.navigate, this);
        this.events.subscribe('removeNodes', this.nodesRemoved, this);
        window.onpopstate = function (e) {
            self.pushHistory = false;
            var previousState = null;
            if (self.history.length > 0) {
                self.history.pop();
                previousState = self.history[self.history.length - 1];
            }
            if (previousState) {
                self.events.publish('routeChanged', previousState.serverPath || previousState.path);
            }
        }
        this.initialize(this.currentPath, this.queryParams);
    };
    Router.prototype.navigate = function (node) {
        if (this.pushHistory) {
            var activePath = this.getNodePath(node.path);
            if (activePath) {
                if (node.isFile) activePath = this.toQueryParams(activePath, node.name);
                var toPush = { nodeName: node.name, path: node.path };
                window.history.pushState(toPush, '', activePath);
                this.history.push(toPush);
            }
        } else {
            this.pushHistory = true;
        }
        this.events.publish('breadCrumbsChanged', this.getHistoryStack(node.path));
    }
    Router.prototype.toQueryParams = function (path, nodeName) {
        var splits = path.split('/');
        splits.pop();
        var toReturn = splits.join('/') + '?file=' + nodeName;
        return toReturn;
    }
    Router.prototype.getCurrentPath = function () {
        return window.location.pathname;
    }
    Router.prototype.getNodePath = function (path) {
        if (path) {
            var splits = path.split("\\");
            splits.splice(0, 1);
            return splits.join('/');
        }
        return null;
    }
    Router.prototype.nodesRemoved = function (removeNodesModel) {
        var node = removeNodesModel.nodesToRemove[0];
        var toReplace = this.history.find(function (h) {
            return h.nodeName === node.name;
        });
        this.history = this.history.filter(function (h) {
            return h.nodeName !== node.name;
        });
        this.events.publish('breadCrumbsChanged', this.getHistoryStack(node.parent));
        var activePath = this.getNodePath(toReplace.path);
        window.history.replaceState(toReplace, '', '');
    }
    Router.prototype.getHistoryStack = function (path) {
        var history = [];
        if (path) {
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
                    pathBuilder = pathBuilder + '/' + nodeName;
                    serverPathBuilder = serverPathBuilder + '\\' + nodeName;
                } else {
                    pathBuilder = nodeName;
                    serverPathBuilder = 'C:\\' + nodeName;
                }
                var toPush = { nodeName: nodeName, path: pathBuilder, serverPath: serverPathBuilder };
                history.push(toPush);
            }
        }
        return history;
    }
    Router.prototype.initialize = function (path, queryParams) {
        this.history = [];
        if (path !== '/') {
            path = window.location.pathname;
        } else {
            path = 'C:\\Users';
        }
        this.history = this.getHistoryStack(path);
        if (queryParams) path = path + '/' + queryParams.split('=')[1];
        this.events.publish('routeChanged', path);
        this.events.publish('breadCrumbsChanged', this.getHistoryStack(path));
    }
    return Router;
}());
