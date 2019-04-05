var SearchViewModel = (function () {
    function SearchViewModel(events, browserApi) {
        this.events = events;
        this.browserApi = browserApi;
        this.searchOptions = ko.observableArray(['Search Files', 'Search Directories']);
        this.selectedSearchOption = ko.observable(this.searchOptions()[0]);
        this.searchText = ko.observable();
        this.newDirectoryName = ko.observable();
        this.selectedRootNode = ko.observable();
        this.events.subscribe('rootNodeChanged', this.nodeInfoChanged, this);
    }
    SearchViewModel.prototype.nodeInfoChanged = function (node) {
        this.selectedRootNode(node);
    }
    SearchViewModel.prototype.search = function () {
        this.browserApi.search({ path: this.selectedRootNode().path, searchText: this.searchText() }, this.searchNodesComplete, this);
    }
    SearchViewModel.prototype.searchNodesComplete = function (node) {
        this.events.publish('searchResultsRetrieved', node);
        this.searchText('');
    }
    SearchViewModel.prototype.createNewDirectory = function () {
        this.events.publish('createDirectory', { path: this.selectedRootNode().path, name: this.newDirectoryName() });
    }
    SearchViewModel.prototype.filesSelected = function (vm, e) {
        var files = e.target.files;
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        this.events.publish('fileUpload', { path: this.selectedRootNode().path, files: formData, isFileUpload: true });
    }
    SearchViewModel.prototype.dispose = function () {
        this.events.unsubscribe('rootNodeChanged', this.nodeInfoChanged);
    }
    return SearchViewModel;
}());