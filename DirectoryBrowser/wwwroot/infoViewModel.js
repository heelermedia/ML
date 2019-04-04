var InfoViewModel = (function () {

    function InfoViewModel(events, browserApi) {
        this.events = events;
        this.browserApi = browserApi;
        this.rootDirectory = ko.observable('');
        this.directoryCount = ko.observable(0);
        this.fileCount = ko.observable(0);
        this.events.subscribe('rootNodeChanged', this.nodeInfoChanged, this);
    }

    InfoViewModel.prototype.nodeInfoChanged = function (node) {
        this.rootDirectory(node.name);
        this.directoryCount(node.directoryCount);
        this.fileCount(node.fileCount);
    }

    return InfoViewModel;
}());