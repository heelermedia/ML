var BrowserViewModel = (function () {
    function BrowserViewModel(events, browserApi) {

        this.nodes = ko.observableArray([]);

        this.events = events;
        this.browserApi = browserApi;
        this.removedNode = null;

        this.events.subscribe('routeChanged', this.initialize, this);
        this.events.subscribe('nodeClicked', this.nodeClicked, this);
        this.events.subscribe('fileUpload', this.uploadFiles, this);
        this.events.subscribe('createDirectory', this.createDirectory, this);
        this.events.subscribe('removeNodes', this.removeNodes, this);
        this.events.subscribe('searchResultsRetrieved', this.searchResultsRetrieved, this);
        this.events.subscribe('copyNodes', this.copyNodes, this);
    }
    BrowserViewModel.prototype.nodesRetrieved = function (node) {
        var existingNode = this.nodes();
        if (existingNode && existingNode.dispose) {
            existingNode.dispose();
        }
        this.events.publish('rootNodeChanged', node);
        this.nodes([]);
        this.createNodes(node.content ? [node] : node.children, this.nodes);
    }
    BrowserViewModel.prototype.initialize = function (path) {
        this.browserApi.getBrowserNodes(path, this.nodesRetrieved, this);
    }
    BrowserViewModel.prototype.nodeClicked = function (node) {
        this.browserApi.getBrowserNodes(node.path, this.nodesRetrieved, this);
    }
    BrowserViewModel.prototype.uploadFiles = function (formData) {
        this.browserApi.uploadFiles(formData, this.nodesRetrieved, this);
    }
    BrowserViewModel.prototype.createDirectory = function (createDirectoryModel) {
        this.browserApi.createDirectory(createDirectoryModel, this.nodesRetrieved, this);
    }
    BrowserViewModel.prototype.copyNodes = function (copyNodesModel) {
        this.browserApi.copyNodes(copyNodesModel, this.nodesRetrieved, this);
    }
    BrowserViewModel.prototype.removeNodes = function (removeNodesModel) {
        var node = removeNodesModel.nodesToRemove[0];
        this.removedNode = node;
        this.removeNode(node, this.nodes)
        this.browserApi.removeNodes(removeNodesModel, this.removeNodeComplete, this);
    }
    BrowserViewModel.prototype.searchResultsRetrieved = function (node) {
        this.nodes([]);
        this.createNodes(node.children, this.nodes);
    }
    BrowserViewModel.prototype.createNodes = function (nodeData, nodes) {
        var nodesArray = nodes();
        var l = nodeData.length;
        var i = -1;
        while (++i < l) {
            nodesArray.push(new DB.ViewModels.NodeViewModel(nodeData[i], this.events, this.browserApi));
        }
        nodes.valueHasMutated();
    };
    BrowserViewModel.prototype.removeNode = function (node, nodes) {
        var nodesArray = nodes();
        nodesArray = nodesArray.filter(function (n) {
            if (n.name !== node.name) return n;
        });
        nodes(nodesArray);
    }
    BrowserViewModel.prototype.removeNodeComplete = function () {
        this.browserApi.getBrowserNodes(this.removedNode.parent, this.nodesRetrieved, this);
        this.removedNode = null;
    }
    BrowserViewModel.prototype.moveNodes = function (moveNodeModel) {
        this.browserApi.moveNodes(moveNodeModel, this.nodesRetrieved, this);
    }
    BrowserViewModel.prototype.dispose = function () {
        this.nodes([]);
        this.events.unsubscribe('routeChanged', this.initialize);
        this.events.unsubscribe('nodeClicked', this.nodeClicked);
        this.events.unsubscribe('fileUpload', this.uploadFiles);
        this.events.unsubscribe('createDirectory', this.createDirectory);
        this.events.unsubscribe('removeNodes', this.removeNodes);
        this.events.unsubscribe('searchResultsRetrieved', this.searchResultsRetrieved);
        this.events.unsubscribe('copyNodes', this.copyNodes);
    }
    return BrowserViewModel;
}());