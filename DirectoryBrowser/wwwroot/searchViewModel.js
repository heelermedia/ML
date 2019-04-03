var SearchViewModel = (function () {

    function SearchViewModel() {
        var self = this;
        self.searchOptions = ko.observableArray(['Search Files', 'Search Directories']);
        self.selectedSearchOption = ko.observable(self.searchOptions()[0]);
        self.searchText = ko.observable();
        self.selectedRootNode = ko.observable();

        DB.Events.subscribe('rootNodeChanged', this.nodeInfoChanged, this);
    }

    SearchViewModel.prototype.nodeInfoChanged = function (node) {
        this.selectedRootNode(node);
    }

    SearchViewModel.prototype.search = function (node) {
        DB.BrowserApi.search({ path: this.selectedRootNode().path, searchText: this.searchText() }, this.searchNodesComplete, this);
    }

    SearchViewModel.prototype.searchNodesComplete = function (node) {
        DB.Events.publish('searchResultsRetrieved', node);
    }

    return SearchViewModel;
}());