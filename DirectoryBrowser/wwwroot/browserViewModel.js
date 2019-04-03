var BrowserViewModel = (function () {

    function BrowserViewModel() {
        var self = this;
        self.nodes = ko.observableArray([]);
        //this.initialize();
        DB.Events.subscribe('routeChanged', this.initialize, this);
        DB.Events.subscribe('nodeClicked', this.nodeClicked, this);
        DB.Events.subscribe('fileUpload', this.uploadFiles, this);
        DB.Events.subscribe('createDirectory', this.createDirectory, this);
        DB.Events.subscribe('removeNodes', this.removeNodes, this);
        DB.Events.subscribe('searchResultsRetrieved', this.searchResultsRetrieved, this);
    }

    BrowserViewModel.prototype.initialize = function (path) {
        var p = path ? path : "C:\\Projects\\knockout-asp-net-core";
        DB.BrowserApi.getBrowserNodes(p, this.nodesRetrieved, this);
    }

    BrowserViewModel.prototype.nodesRetrieved = function (node) {
        var existingNode = this.nodes();
        if (existingNode && existingNode.dispose) {
            existingNode.dispose();
        }
        DB.Events.publish('rootNodeChanged', { ...node });
        this.nodes([]);
        this.createNodes(node.children, this.nodes);
    }

    BrowserViewModel.prototype.nodeClicked = function (node) {
        DB.BrowserApi.getBrowserNodes(node.path, this.nodesRetrieved, this);
    }

    BrowserViewModel.prototype.uploadFiles = function (formData) {
        DB.BrowserApi.uploadFiles(formData, this.nodesRetrieved, this);
    }

    BrowserViewModel.prototype.createDirectory = function (createDirectoryModel) {
        DB.BrowserApi.createDirectory(createDirectoryModel, this.nodesRetrieved, this);
    }

    BrowserViewModel.prototype.removeNodes = function (removeNodesModel) {
        this.removeNode(removeNodesModel.NodesToRemove[0], this.nodes)
        DB.BrowserApi.removeNodes(removeNodesModel, null, this);
    }

    BrowserViewModel.prototype.searchResultsRetrieved = function (nodeToRemove, nodes) {
        var node = nodes();
        if (node.children() && node.children().length > 0) {
            var children = node.children();
            children.splice(children.indexOf(removeNodesModel.NodesToRemove[0]), 1);
        }
        node.children.valueHasMutated();
    }
    BrowserViewModel.prototype.createNodes = function (nodeData, nodes) {
        var nodesArray = nodes();
        var l = nodeData.length;
        var i = -1;
        while (++i < l) {
            nodesArray.push(new DB.ViewModels.NodeViewModel(nodeData[i]));
        }
        nodes.valueHasMutated();
    };

    BrowserViewModel.prototype.removeNode = function (node) {
        this.nodesRetrieved(node);
    }

    BrowserViewModel.prototype.moveNodes = function (moveNodeModel) {
        DB.BrowserApi.moveNodes(moveNodeModel, this.nodesRetrieved, this);
    }

    BrowserViewModel.prototype.dispose = function () {
        DB.Events.unsubscribe('nodeClicked', this.nodesRetrieved);
        DB.Events.unsubscribe('fileUpload', this.uploadFiles);
        DB.Events.unsubscribe('createDirectory', this.createDirectory);
        DB.Events.unsubscribe('removeNodes', this.removeNodes);
        DB.Events.unsubscribe('searchResultsRetrieved', this.searchResultsRetrieved);
    }

    return BrowserViewModel;
}());