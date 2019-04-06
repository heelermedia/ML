var nodeToMove = null;
ko.bindingHandlers.draggable = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        var el = $(element);
        var parentViewModel = bindingContext.$parent;

        el.draggable({
            cursor: "arrow",
            distance: 10,
            zIndex: 1000,
            helper: function (event) {
                var el = $(this);
                return el.clone();
            },
            start: function (event, ui) {
                nodeToMove = ko.contextFor(event.target).$data;
            },
            drag: function (event, ui) {
            },
            stop: function (event, ui) {
            }
        });

        el.droppable({
            over: function (event, ui) {

            },
            out: function (event, ui) {
               
            },
            drop: function (event, ui) {
                var dropNode = ko.contextFor(event.target).$data;
                console.log(dropNode.isDirectory());
                if (dropNode.isDirectory()) {
                    var moveNodesModel = {
                        nodesToMove: [nodeToMove.toDto(nodeToMove.keys)],
                        toNode: dropNode.toDto(dropNode.keys)
                    };
                    parentViewModel.moveNodes(moveNodesModel);
                }
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            el.draggable('destroy');
            el.droppable('destroy');
            parentViewModel = null;
            nodeToMove = null;
        });
    }
};