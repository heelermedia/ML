function initialize() {

    window.DirectoryBrowser = DB = {};

    DB.BrowserApi = new BrowserApi();

    DB.Models = {};

    DB.ViewModels = {};
    DB.ViewModels.BrowserViewModel = BrowserViewModel;
    DB.ViewModels.InfoViewModel = InfoViewModel;
    DB.ViewModels.NodeViewModel = NodeViewModel;
    DB.ViewModels.SearchViewModel = SearchViewModel;

    DB.Events = new Events();

    ko.applyBindings(new DB.ViewModels.BrowserViewModel(), document.getElementById('browser'));

    ko.applyBindings(new DB.ViewModels.InfoViewModel(), document.getElementById('info'));

    ko.applyBindings(new DB.ViewModels.SearchViewModel(), document.getElementById('searchView'));

}

initialize();