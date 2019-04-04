var BrowserViewModel = (function () {

    function BrowserViewModel(events, browserApi) {

        this.nodes = ko.observableArray([]);

        this.events = events;
        this.browserApi = browserApi;

        this.events.subscribe('routeChanged', this.initialize, this);
        this.events.subscribe('nodeClicked', this.nodeClicked, this);
        this.events.subscribe('fileUpload', this.uploadFiles, this);
        this.events.subscribe('createDirectory', this.createDirectory, this);
        this.events.subscribe('removeNodes', this.removeNodes, this);
        this.events.subscribe('searchResultsRetrieved', this.searchResultsRetrieved, this);
    }

    BrowserViewModel.prototype.nodesRetrieved = function (node) {
        var existingNode = this.nodes();
        if (existingNode && existingNode.dispose) {
            existingNode.dispose();
        }
        this.events.publish('rootNodeChanged', { ...node });
        this.nodes([]);
        this.createNodes(node.children, this.nodes);
    }

    BrowserViewModel.prototype.initialize = function (path) {
        var p = path ? path : "C:\\Projects\\knockout-asp-net-core";
        this.browserApi.getBrowserNodes(p, this.nodesRetrieved, this);
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

    BrowserViewModel.prototype.removeNodes = function (removeNodesModel) {
        this.removeNode(removeNodesModel.NodesToRemove[0], this.nodes)
        this.browserApi.removeNodes(removeNodesModel, null, this);
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

    BrowserViewModel.prototype.removeNode = function (node) {
        this.nodesRetrieved(node);
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
    }

    return BrowserViewModel;
}());