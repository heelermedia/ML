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
                //track start position
                //startPosition = ui.offset.left;
                //index of table header in row 0 => n
                //startIndex = $(this).index();


                nodeToMove = ko.contextFor(event.target).$data;

            },
            drag: function (event, ui) {
                //track position delta 
                //i will use this to determine over indicator position
                //dragDelta = ui.offset.left;
                //var helper = $(ui.helper);
                ////dragging right
                //if (dragDelta > startPosition) {
                //    //check threshold before swapping icon
                //    if (dragDelta <= (startPosition + 10)) {
                //        helper.find(".fa-plus").removeClass("fa-plus").addClass("fa-ban");
                //    }
                //} else {
                //    //dragging left
                //    //check threshold before swapping icon
                //    if (dragDelta >= (startPosition - 10)) {
                //        helper.find(".fa-plus").removeClass("fa-plus").addClass("fa-ban");
                //    }
                //}
            },
            stop: function (event, ui) {
                //$("#OverI").remove();
                //startPosition = -1;
                //dragDelta = -1;
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