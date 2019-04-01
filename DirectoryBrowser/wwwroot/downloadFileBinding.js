ko.bindingHandlers.downloadFileBinding = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        var element = $(element);
        function onClick(e) {
           
        }
        element.click(onClick);
    }
};