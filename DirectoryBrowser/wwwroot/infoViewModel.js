var InfoViewModel = (function () {

    function InfoViewModel() {
        var self = this;
        self.rootDirectory = ko.observable('');
        self.directoryCount = ko.observable(0);
        self.fileCount = ko.observable(0);
        DB.Events.subscribe('rootNodeChanged', this.nodeInfoChanged, this);
    }

    InfoViewModel.prototype.nodeInfoChanged = function (node) {
        this.rootDirectory(node.name);
        this.directoryCount(node.directoryCount);
        this.fileCount(node.fileCount);
    }

    return InfoViewModel;
}());