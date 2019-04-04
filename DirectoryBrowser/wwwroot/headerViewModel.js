var HeaderViewModel = (function () {
    function HeaderViewModel(events, browserApi) {
        this.events = events;
        this.browserApi = browserApi;
    };
    HeaderViewModel.prototype.tearOutBrowser = function () {
        this.events.publish('tearOutBrowser', null);
    };
    return HeaderViewModel;
}());
