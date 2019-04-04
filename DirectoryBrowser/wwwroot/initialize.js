function initialize() {

    var json = {
        "type": "container",
        "id": "container",
        "isModal": false,
        "useContainerCssClass": true,
        "viewDefinitions": [
            {
                "type": "headerView",
                "viewModel": "HeaderViewModel",
                "id": "header"
            },
            {
                "type": "searchView",
                "viewModel": "SearchViewModel",
                "id": "searchView"
            },
            {
                "type": "container",
                "useContainerCssClass": false,
                "viewDefinitions": [
                    {
                        "type": "breadCrumbsView",
                        "viewModel": "BreadCrumbsViewModel",
                        "id": "breadcrumbs"
                    },
                    {
                        "type": "infoView",
                        "viewModel": "InfoViewModel",
                        "id": "infoView"
                    },
                ]
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

    DB.Events = new Events();

    DB.ViewModels = {};
    DB.ViewModels.HeaderViewModel = HeaderViewModel;
    DB.ViewModels.BrowserViewModel = BrowserViewModel;
    DB.ViewModels.InfoViewModel = InfoViewModel;
    DB.ViewModels.NodeViewModel = NodeViewModel;
    DB.ViewModels.SearchViewModel = SearchViewModel;
    DB.ViewModels.BreadCrumbsViewModel = BreadCrumbsViewModel;

    DB.Renderer = new Renderer(DB);
    DB.Renderer.render('body', json);
    DB.Router = new Router(DB.Events);
}

window.onload = function () {
    initialize();
}
