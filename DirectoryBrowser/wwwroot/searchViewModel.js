var SearchViewModel = (function () {
    function SearchViewModel(events, browserApi) {
        this.events = events;
        this.browserApi = browserApi;
        this.searchOptions = ko.observableArray(['Search Files', 'Search Directories']);
        this.selectedSearchOption = ko.observable(this.searchOptions()[0]);
        this.searchText = ko.observable();
        this.selectedRootNode = ko.observable();
        this.events.subscribe('rootNodeChanged', this.nodeInfoChanged, this);
    }
    SearchViewModel.prototype.nodeInfoChanged = function (node) {
        this.selectedRootNode(node);
    }
    SearchViewModel.prototype.search = function (node) {
        this.browserApi.search({ path: this.selectedRootNode().path, searchText: this.searchText() }, this.searchNodesComplete, this);
    }
    SearchViewModel.prototype.searchNodesComplete = function (node) {
        this.events.publish('searchResultsRetrieved', node);
        this.searchText('');
    }
    SearchViewModel.prototype.dispose = function (node) {
        this.events.unsubscribe('rootNodeChanged', this.nodeInfoChanged);
    }
    return SearchViewModel;
}());