
function initialize() {

    var json = {
        "type": "container",
        "id": "container",
        "viewDefinitions": [
            {
                "type": "infoView",
                "viewModel": "InfoViewModel",
                "id": "info"
            },
            {
                "type": "searchView",
                "viewModel": "SearchViewModel",
                "id": "searchView"
            },
            {
                "type": "breadCrumbsView",
                "viewModel": "BreadCrumbsViewModel",
                "id": "breadcrumbs"
            },
            {
                "type": "browserView",
                "viewModel": "BrowserViewModel",
                "id": "browser"
            }
        ]
    };



    window.DirectoryBrowser = DB = {};

    DB.BrowserApi = new BrowserApi();

  

    DB.ViewModels = {};
    DB.ViewModels.BrowserViewModel = BrowserViewModel;
    DB.ViewModels.InfoViewModel = InfoViewModel;
    DB.ViewModels.NodeViewModel = NodeViewModel;
    DB.ViewModels.SearchViewModel = SearchViewModel;
    DB.ViewModels.BreadCrumbsViewModel = BreadCrumbsViewModel;


    DB.Events = new Events();


    DB.Renderer = new Renderer(DB.ViewModels);

    //ko.applyBindings(new DB.ViewModels.BreadCrumbsViewModel(), document.getElementById('breadcrumbs'));

    //ko.applyBindings(new DB.ViewModels.BrowserViewModel(), document.getElementById('browser'));

    //ko.applyBindings(new DB.ViewModels.InfoViewModel(), document.getElementById('info'));

    //ko.applyBindings(new DB.ViewModels.SearchViewModel(), document.getElementById('searchView'));

    DB.Renderer.render('body', json);

    DB.Router = new Router();
}


window.onload = function () {
    initialize();
}
