var BrowserViewModel = (function () {

    function BrowserViewModel() {
        var self = this;
        self.nodes = ko.observableArray([]);
        this.initialize();
        DB.Events.subscribe('nodeClicked', this.nodeClicked, this);
        DB.Events.subscribe('fileUpload', this.uploadFiles, this);
        DB.Events.subscribe('createDirectory', this.createDirectory, this);
        DB.Events.subscribe('removeNodes', this.removeNodes, this);
    }

    BrowserViewModel.prototype.initialize = function () {
        var path = "C:\\Users\\andre\\OneDrive\\Desktop\\Dirs";
        DB.BrowserApi.getBrowserNodes(path, this.nodesRetrieved, this);
    }

    BrowserViewModel.prototype.nodesRetrieved = function (node) {
        var existingNode = this.nodes();
        if (existingNode && existingNode.dispose) {
            existingNode.dispose();
        }
        DB.Events.publish('rootNodeChanged', { ...node });
        this.nodes(new DB.ViewModels.NodeViewModel(node));
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
        var node = this.nodes();
        if (node.children() && node.children().length > 0) {
            var children = node.children();
            children.splice(children.indexOf(removeNodesModel.NodesToRemove[0]), 1);
        }
        node.children.valueHasMutated();
        DB.BrowserApi.removeNodes(removeNodesModel, null, this);
    }

    BrowserViewModel.prototype.dispose = function () {
        DB.Events.unsubscribe('nodeClicked', this.nodesRetrieved);
        DB.Events.unsubscribe('fileUpload', this.uploadFiles);
        DB.Events.unsubscribe('createDirectory', this.createDirectory);
        DB.Events.unsubscribe('removeNodes', this.removeNodes);
    }

    return BrowserViewModel;
}());