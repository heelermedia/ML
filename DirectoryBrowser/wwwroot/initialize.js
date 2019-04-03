
function initialize() {

    window.DirectoryBrowser = DB = {};

    DB.BrowserApi = new BrowserApi();

    DB.Models = {};

    DB.ViewModels = {};
    DB.ViewModels.BrowserViewModel = BrowserViewModel;
    DB.ViewModels.InfoViewModel = InfoViewModel;
    DB.ViewModels.NodeViewModel = NodeViewModel;
    DB.ViewModels.SearchViewModel = SearchViewModel;
    DB.ViewModels.BreadCrumbsViewModel = BreadCrumbsViewModel;


    DB.Events = new Events();

    ko.applyBindings(new DB.ViewModels.BreadCrumbsViewModel(), document.getElementById('breadcrumbs'));

    ko.applyBindings(new DB.ViewModels.BrowserViewModel(), document.getElementById('browser'));

    ko.applyBindings(new DB.ViewModels.InfoViewModel(), document.getElementById('info'));

    ko.applyBindings(new DB.ViewModels.SearchViewModel(), document.getElementById('searchView'));

    DB.Router = new Router();
}


window.onload = function () {
    initialize();
}
