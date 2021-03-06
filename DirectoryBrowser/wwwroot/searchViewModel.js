﻿var SearchViewModel = (function () {
    function SearchViewModel(events, browserApi) {
        this.events = events;
        this.browserApi = browserApi;
        this.searchText = ko.observable();
        this.newDirectoryName = ko.observable();
        this.selectedRootNode = ko.observable();
        this.fileInputValue = ko.observable();
        this.enableInputs = ko.observable(true);
        this.events.subscribe('rootNodeChanged', this.nodeInfoChanged, this);
    }
    SearchViewModel.prototype.nodeInfoChanged = function (node) {
        if (node.isFile && node.content) {
            this.enableInputs(false);
        } else {
            this.enableInputs(true);
        }
        this.selectedRootNode(node);
    }
    SearchViewModel.prototype.search = function () {
        this.browserApi.search({ path: this.selectedRootNode().path, searchText: this.searchText() }, this.searchNodesComplete, this);
    }
    SearchViewModel.prototype.searchNodesComplete = function (node) {
        this.events.publish('searchResultsRetrieved', node);
        this.searchText(null);
    }
    SearchViewModel.prototype.createNewDirectory = function () {
        this.events.publish('createDirectory', { path: this.selectedRootNode().path, name: this.newDirectoryName() });
        this.newDirectoryName(null);
    }
    SearchViewModel.prototype.filesSelected = function (vm, e) {
        if (this.fileInputValue()) {
            var files = e.target.files;
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }
            this.events.publish('fileUpload', { path: this.selectedRootNode().path, files: formData, isFileUpload: true });
            this.fileInputValue(null);
        }
    }
    SearchViewModel.prototype.dispose = function () {
        this.events.unsubscribe('rootNodeChanged', this.nodeInfoChanged);
    }
    return SearchViewModel;
}());