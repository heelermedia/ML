var BreadCrumbsViewModel = (function () {
    function BreadCrumbsViewModel(events, browserApi) {
        var self = this;
        this.events = events;
        this.browserApi = browserApi;
        this.breadCrumbs = ko.observableArray([]);
        this.events.subscribe('breadCrumbsChanged', this.breadCrumbsChanged, this);
        this.navigate = function (breadCrumb) {
            breadCrumb.path = breadCrumb.serverPath;
            self.events.publish('nodeClicked', breadCrumb);
        };
    };
    BreadCrumbsViewModel.prototype.breadCrumbsChanged = function (historyStack) {
        this.breadCrumbs(historyStack);
    };
    BreadCrumbsViewModel.prototype.dispose = function (node) {
        this.events.unsubscribe('breadCrumbsChanged', this.breadCrumbsChanged);
    }
    return BreadCrumbsViewModel;
}());
