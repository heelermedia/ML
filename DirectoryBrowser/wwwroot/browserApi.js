var BrowserApi = (function () {
    function BrowserApi() {
    }
    BrowserApi.prototype.fetch = function (config, context) {
        var request = new XMLHttpRequest();
        request.responseType = 'json';
        if (config.data && config.data.isFileDownload) {
            request.responseType = 'blob';
        }
        request.open(config.verb, config.url, true);
        request.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                if (config.callback) {
                    config.callback.call(context, this.response);
                }
            }
        };
        switch (config.verb) {
            case 'GET':
                request.send();
                break;
            case 'POST':
            case 'PUT':
            case 'DELETE':
                if (config.data && config.data.isFileUpload) {
                    request.setRequestHeader("X-File-Path", config.data.path);
                    request.send(config.data.files);
                } else {
                    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    request.send(JSON.stringify(config.data));
                }
                break;
            default: break;
        }
    }
    BrowserApi.prototype.getBrowserNodes = function (path, callback, context) {
        var ajaxConfig = {
            verb: 'GET',
            url: `http://localhost:63674/api/browsing?path=${path}`,
            callback: callback
        };
        this.fetch(ajaxConfig, context);
    }
    BrowserApi.prototype.uploadFiles = function (formData, callback, context) {
        var ajaxConfig = {
            verb: 'POST',
            url: `http://localhost:63674/api/browsing/UploadFiles`,
            callback: callback,
            data: formData
        };
        this.fetch(ajaxConfig, context);
    }
    BrowserApi.prototype.moveNodes = function (moveNodesModel, callback, context) {
        var ajaxConfig = {
            verb: 'POST',
            url: `http://localhost:63674/api/browsing/MoveNodes`,
            callback: callback,
            data: moveNodesModel
        };
        this.fetch(ajaxConfig, context);
    }
    BrowserApi.prototype.copyNodes = function (copyNodes, callback, context) {

    }
    BrowserApi.prototype.createDirectory = function (createDirectoryModel, callback, context) {
        var ajaxConfig = {
            verb: 'PUT',
            url: `http://localhost:63674/api/browsing/CreateDirectory`,
            callback: callback,
            data: createDirectoryModel
        };
        this.fetch(ajaxConfig, context);
    }
    BrowserApi.prototype.createFile = function (createFileModel, callback, context) {
        var ajaxConfig = {
            verb: 'PUT',
            url: `http://localhost:63674/api/browsing/createFile`,
            callback: callback,
            data: createFileModel
        };
        this.fetch(ajaxConfig, context);
    }
    BrowserApi.prototype.downloadFile = function (downloadFileModel, callback, context) {
        var ajaxConfig = {
            verb: 'GET',
            url: `http://localhost:63674/api/browsing/DownloadFile?path=${downloadFileModel.path}`,
            callback: callback,
            data: downloadFileModel
        };
        this.fetch(ajaxConfig, context);
    }
    BrowserApi.prototype.removeNodes = function (removeNodesModel, callback, context) {
        var ajaxConfig = {
            verb: 'DELETE',
            url: `http://localhost:63674/api/browsing`,
            callback: callback,
            data: removeNodesModel
        };
        this.fetch(ajaxConfig, context);
    }
    BrowserApi.prototype.search = function (searchModel, callback, context) {
        var ajaxConfig = {
            verb: 'POST',
            url: `http://localhost:63674/api/browsing/Search`,
            callback: callback,
            data: searchModel
        };
        this.fetch(ajaxConfig, context);
    }
    return BrowserApi;
}());