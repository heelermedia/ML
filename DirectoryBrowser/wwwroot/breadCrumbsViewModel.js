var BreadCrumbsViewModel = (function () {
    function BreadCrumbsViewModel(events, browserApi) {
        var self = this;
        this.events = events;
        this.browserApi = browserApi;
        this.breadCrumbs = ko.observableArray([]);
        this.events.subscribe('breadCrumbsChanged', this.breadCrumbsChanged, this);
        this.navigate = function (breadCrumb) {
            var crumb = { ...breadCrumb };
            crumb.path = crumb.serverPath;
            self.events.publish('nodeClicked', crumb);
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
