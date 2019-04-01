function initialize() {

    window.DirectoryBrowser = DB = {};

    DB.BrowserApi = new BrowserApi();

    DB.Models = {};
    DB.Models.Node = Node;

    DB.ViewModels = {};
    DB.ViewModels.BrowserViewModel = BrowserViewModel;
    DB.ViewModels.InfoViewModel = InfoViewModel;
    DB.ViewModels.NodeViewModel = NodeViewModel;

    DB.Events = new Events();

    ko.applyBindings(new DB.ViewModels.BrowserViewModel(), document.getElementById('browser'));

    ko.applyBindings(new DB.ViewModels.InfoViewModel(), document.getElementById('info'));

}

initialize();