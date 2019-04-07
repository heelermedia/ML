ko.bindingHandlers.downloadFileBinding = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var data = ko.unwrap(valueAccessor());
        var element = $(element);
        if (data) {
            if (navigator.msSaveBlob) { 
                navigator.msSaveBlob(data, bindingContext.$data.name);
            } else {
                var url = window.URL.createObjectURL(data);
                var a = $("<a>", { style: "display:none;" });
                a.attr("href", url);
                a.attr("download", bindingContext.$data.name);
                $("body").append(a);
                a[0].click();
                window.URL.revokeObjectURL(url);
                a.remove();
            }
        }
    }
};