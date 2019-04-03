

var Renderer = (function () {

    function Renderer() {
    }

    Renderer.prototype.container = function (viewDefinition) {
        var container = $('<div>', { class: 'container' });
        var content = this.getContentTemplates(config.contentTemplates);
        container.append(content);
        return container;
    }

    Renderer.prototype.infoView = function (viewDefinition) {
      
        var header = $('<nav>', { id: 'info', class: 'sticky-top flex-md-nowrap pt-2' });

        var row = $('<div>', { class: 'row' });
        var columnA = $('<div>', { class: 'col-lg-4' });

        var ul = $('<ul>', { class: 'list-inline mb-0 ' });
        var li = $('<li>', { class: 'list-inline-item' });
        var logoAction = $('<a>', { href: 'javascript:void(0)', title: 'Directory Browser' });
        var folderIcon = this.svgs('folder');
        logoAction.append(folderIcon);
        ul.append(li.append(logoAction));

        var li = $('<li>', { class: 'list-inline-item' });
        var h5 = $('<h5>', { class: 'text-uppercase head text-primary mb-0' });
        h5.append('Directory Browser');
        ul.append(li.append(h5));
     
        columnA.append(ul);

        var columnB = $('<div>', { class: 'col-lg-8' });
        var innerRow = $('<div>', { class: 'row' });

        var innerColumnA = $('<div>', { class: 'col-lg-6 text-right' });
        var pA = $('<p>', { class: 'text-uppercase pb-0 mb-0' });
        pA.append('Active Directory:');
        var spanA = $('<p>', { 'data-bind': 'text: rootDirectory', class: 'font-weight-bold text-primary' });
        innerColumnA.append(pA.append(spanA));

        var innerColumnB = $('<div>', { class: 'col-lg-6 text-right' });
        var pB = $('<p>', { class: 'text-uppercase pb-0 mb-0' });
        pB.append('Directories:');
        var spanB = $('<p>', { 'data-bind': 'text: directoryCount', class: 'font-weight-bold text-primary' });
        innerColumnB.append(pB.append(spanB));

        var innerColumnC = $('<div>', { class: 'col-lg-6 text-right' });
        var pC = $('<p>', { class: 'text-uppercase pb-0 mb-0' });
        pC.append('Files:');
        var spanC = $('<p>', { 'data-bind': 'text: fileCount', class: 'font-weight-bold text-primary' });
        innerColumnC.append(pC.append(spanC));

        innerRow.append(innerColumnA).append(innerColumnB).append(innerColumnC);
        columnB.append(innerRow);

        row.append(columnA).append(columnB);

        header.append(row);

        return header;

    }

    Renderer.prototype.searchView = function (viewDefinition) {
        var searchView = $('<div>', { id: 'searchView', class: 'row' });
        var leftColumn = $('<div>', { class: 'col-lg-6' });
        var searchTextFormGroup = $('<div>', { class: 'form-group mb-2' });
        var searchTextLabel = $('<label>', { class: 'sr-only', for: 'searchText' });
        var searchInput = $('<input>', { 'data-bind': 'textInput:searchText', type: 'text', class: 'form-control form-control-sm', id: 'searchText', placeholder: 'Search Text' });
        searchTextFormGroup.append(searchTextLabel).append(searchInput);
        leftColumn.append(searchTextFormGroup);
        var rightColumn = $('<div>', { class: 'col-lg-6' });
        var searchAction = $('<a>', { 'data-bind': 'click:search', href: 'javascript:void(0)', class: 'mb-2' });
        rightColumn.append(searchAction);
        searchView.append(leftColumn);
        searchView.append(rightColumn);
        return searchView;
    }


    Renderer.prototype.breadCrumbsView = function (viewDefinition) {
        var breadCrumbs = $('<div>', { id: 'breadcrumbs', class: 'row' });
        var column = $('<div>', { class: 'col-lg-6' });
        var nav = $('<nav>', {});
        var ol = $('<ol>', { 'data-bind': 'foreach: breadCrumbs', class: 'breadcrumb' });
        var li = $('<li>', { class: 'breadcrumb-item' });
        var navigateAction = $('<a>', { 'data-bind': 'click:$parent.navigate, text:nodeName, attr: { title: nodeName }', href: 'javascript:void(0)' });
        li.append(navigateAction);
        ol.append(li);
        nav.append(ol);
        column.append(nav);
        breadCrumbs.append(column);
        return breadCrumbs;
    }

    Renderer.prototype.browserView = function (viewDefinition) {

        var browser = $('<div>', { id: 'browser', class: 'row' });
        var column = $('<div>', { class: 'col-lg-12' });
        browser.append(column);

        var ul = $('<ul>', { 'data-bind': 'foreach:nodes', class: 'pl-3' });
        var li = $('<li>', { 'data-bind': 'draggable:{ data: $data }', class: 'pl-3' });
        ul.append(li);

        browser.append(column.append(ul));

        var row = $('<div>', { class: 'row' });
        browser.append(row);

        var innerColumnA = $('<div>', { class: 'col-lg-3' });
        row.append(innerColumnA);

        var showFolderIcon = this.svgs('folder');
        showFolderIcon.attr({ 'data-bind': 'visible: showFolder' });

        var showFolderPlus = this.svgs('folderPlus');
        showFolderPlus.attr({ 'data-bind': 'visible: showFolderPlus' });

        var showFolderIcon = this.svgs('fileText')
        showFolderIcon.attr({ 'data-bind': 'visible: isFile' });

        var nodeClickedAction = $('<a>', { 'data-bind': 'click:nodeClicked', href: 'javascript:void(0)', class: 'nodeAction', title: 'Explore' });
        var actionText = $('<span>', { 'data-bind': 'text:name' });
        nodeClickedAction.append(actionText);

        innerColumnA.append(showFolderIcon).append(showFolderPlus).append(showFolderIcon).append(nodeClickedAction);

        row.append(innerColumnA);


        var innerColumnB = $('<div>', { 'data-bind': 'visible: isDirectory', class: 'col-lg-9 text-right' });
        var fileUploadInput = $('<input>', { 'data-bind': 'event:{ change:filesSelected }, visible:!showNewFolderNameInput()', type: 'file', class: 'custom-file-input' });
        //TODO: add multiple
        innerColumnB.append(fileUploadInput);

        var addDirectoryAction = $('<a>', { 'data-bind': 'click:addNewDirectory, visible:!showNewFolderNameInput()', href: 'javascript:void(0)', class: 'nodeAction', title: 'Add New Directory' });
        var showFolderIcon = this.svgs('plus');
        addDirectoryAction.append(showFolderIcon);
        innerColumnB.append(addDirectoryAction);

        var newDirectoryNameInput = $('<input>', { 'data-bind': 'textInput:newDirectoryName, visible:showNewFolderNameInput', type: 'text', class: 'form-control form-control-sm col-lg-3 ml-2 float-right', placeholder: 'Name New Directory' });
        innerColumnB.append(newDirectoryNameInput);

        var saveNewDirectoryAction = $('<a>', { 'data-bind': 'click:saveNewDirectory, visible:showNewFolderNameInput', href: 'javascript:void(0)', class: 'nodeAction', title: 'Save New Directory' });
        var saveIcon = this.svgs('save');
        saveNewDirectoryAction.append(saveIcon);
        innerColumnB.append(saveNewDirectoryAction);

        var removeNodesAction = $('<a>', { 'data-bind': 'click:removeNodes', href: 'javascript:void(0)', class: 'nodeAction', title: 'Delete Directory' });
        var closeIcon = this.svgs('x');
        removeNodesAction.append(closeIcon);
        innerColumnB.append(removeNodesAction);

        row.append(innerColumnB);


        var innerColumnC = $('<div>', { 'data-bind': 'visible: !isDirectory()', class: 'col-lg-9 text-right' });

        var downloadFileAction = $('<a>', { 'data-bind': 'click:downloadFile, downloadFileBinding: fileData', href: 'javascript:void(0)', class: 'nodeAction', title: 'Download File' });
        var downloadIcon = this.svgs('download');
        downloadFileAction.append(downloadIcon);
        innerColumnC.append(downloadFileAction);

        var removeNodesAction = $('<a>', { 'data-bind': 'click:removeNodes', href: 'javascript:void(0)', class: 'nodeAction', title: 'Delete File' });
        var removeNodesIcon = this.svgs('x');
        removeNodesAction.append(removeNodesIcon);
        innerColumnC.append(removeNodesAction);

        row.append(innerColumnC);

        return browser;

    }

    Renderer.prototype.svgs = function (key) {
        var svgs = {
            folder: `<svg  class="feather feather-folder" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                       <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>`,
            folderPlus: `<svg class="feather feather-folder-plus" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        <line x1="12" y1="11" x2="12" y2="17"></line>
                        <line x1="9" y1="14" x2="15" y2="14"></line>
                    </svg>`,
            fileText: `<svg class="feather feather-file-text" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>`,
            upload: `<svg data-bind="visible:!showNewFolderNameInput()" class="feather feather-upload text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>`,
            plus: `<svg class="feather feather-plus" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>`,
            save: `<svg class="feather feather-save" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>`,
            x: `<svg class="feather feather-x" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>`,
            download: `<svg class="feather feather-download" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>`,
            gear: `<svg class="feather feather-settings sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>`
        };
        return $(svgs[key]);
    }

    Renderer.prototype.getContentTemplates = function (viewDefinition) {
        var ct = [];
        var contentTemplates = contentTemplates || [];
        var contentTemplatesLength = contentTemplates.length;
        while (contentTemplatesLength--) {
            var contentTemplate = contentTemplates.shift();
            var element = this.getView(contentTemplate.type, contentTemplate);
            ct.push(element);
            contentTemplates.push(contentTemplate);
        }
        return ct;
    }

    Renderer.prototype.render = function (regionKey, viewDefinition, viewModel) {
        var view = this.getView(viewDefinition.type, viewDefinition);
        $(regionKey).append(view)
        //ko.applyBindings(viewModel, document.getElementById(id));
    }

    Renderer.prototype.getView = function (key) {
        return this[key] && this[key].apply(this, [].slice.call(arguments, 1));
    };

    return Renderer;
}());

