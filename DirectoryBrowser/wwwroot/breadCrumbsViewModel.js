var BreadCrumbsViewModel = (function () {
    function BreadCrumbsViewModel() {
        var self = this;
        self.breadCrumbs = ko.observableArray([]);
        DB.Events.subscribe('breadCrumbsChanged', this.breadCrumbsChanged, this);
    };
    BreadCrumbsViewModel.prototype.breadCrumbsChanged = function (historyStack) {
        this.breadCrumbs(historyStack);
    };

    BreadCrumbsViewModel.prototype.navigate = function (breadCrumb) {
        var crumb = { ...breadCrumb };
        crumb.path = crumb.serverPath;
        DB.Events.publish('nodeClicked', crumb);
    };
    return BreadCrumbsViewModel;
}());
