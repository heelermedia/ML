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
        //this.selectedRootNode(node);
    }

    SearchViewModel.prototype.search = function (node) {
    }

    return SearchViewModel;
}());