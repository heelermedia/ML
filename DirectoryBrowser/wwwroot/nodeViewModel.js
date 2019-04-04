var NodeViewModel = (function () {
    function NodeViewModel(data) {
        var n = this;
        this.keys = Object.keys(data);
        this.path = data.path;
        this.parent = data.parent;
        this.root = data.root;
        this.name = data.name;
        this.children = ko.observableArray([]);
        this.lines = ko.observableArray([]);
        this.isFile = ko.observable(data.isFile);
        this.hasChildren = ko.observable(data.hasChildren);
        this.content = ko.observable(data.content ? data.content : null);
        if (this.content()) {
            this.lines(this.toFileLines(this.content()));
        }
        this.fileData = ko.observable();

        this.showNewFolderNameInput = ko.observable(false);
        this.newDirectoryName = ko.observable();

        this.showActions = ko.observable(false);
        this.showActionsTitle = ko.pureComputed(function () {
            return this.showActions() ? 'Hide Actions' : 'Show Actions';
        }, this);

        this.showFolder = ko.pureComputed(function () {
            return !n.isFile() && !this.hasChildren();
        }, this);
        this.showFolderPlus = ko.pureComputed(function () {
            return !n.isFile() && this.hasChildren();
        }, this);
        this.isDirectory = ko.pureComputed(function () {
            return n.showFolder() || n.showFolderPlus();
        }, this);

        if (data.children) {
            this.createChildren(data.children);
        }
    }

    NodeViewModel.prototype.nodeClicked = function () {
        DB.Events.publish('nodeClicked', { ...this });
    };
    NodeViewModel.prototype.viewActions = function () {
        this.showActions(!this.showActions());
    };
    NodeViewModel.prototype.createChildren = function (nodes) {
        var children = this.children();
        var l = nodes.length;
        var i = -1;
        while (++i < l) {
            children.push(new DB.ViewModels.NodeViewModel(nodes[i]));
        }
        this.children.valueHasMutated();
    };
    NodeViewModel.prototype.filesSelected = function (vm, e) {
        var files = e.target.files;
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        DB.Events.publish('fileUpload', { path: this.path, files: formData, isFileUpload: true });
    }
    NodeViewModel.prototype.addNewDirectory = function () {
        this.showNewFolderNameInput(true);
    }
    NodeViewModel.prototype.saveNewDirectory = function (node) {
        this.showNewFolderNameInput(false);
        DB.Events.publish('createDirectory', { path: this.path, name: this.newDirectoryName() });
    }
    NodeViewModel.prototype.downloadFile = function () {
        DB.BrowserApi.downloadFile({ path: this.path, isFileDownload: true }, this.fileDataRetrieved, this);
    };
    NodeViewModel.prototype.fileDataRetrieved = function (fileData) {
        this.fileData(fileData);
    };
    NodeViewModel.prototype.removeNodes = function (node) {
        DB.Events.publish('removeNodes', { NodesToRemove: [node] });
    };
    NodeViewModel.prototype.toFileLines = function (fileContent) {
        return fileContent.split('\n');
    };
    NodeViewModel.prototype.toDto = function (keys) {
        var nodeDto = {};
        for (var i = 0; i <= keys.length - 1; i++) {
            var key = keys[i];
            nodeDto[key] = ko.utils.unwrapObservable(this[key]);
        }
        return nodeDto;
    };
    NodeViewModel.prototype.dispose = function () {

    };
    return NodeViewModel;
}());