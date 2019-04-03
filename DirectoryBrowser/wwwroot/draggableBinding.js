
var nodeToMove = null;

ko.bindingHandlers.draggable = {

    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        //get bound value object
        var value = ko.unwrap(valueAccessor());
        var element = $(element);
        var parentViewModel = bindingContext.$parent;

        //make th's draggable
        element.draggable({
            cursor: "arrow",
            distance: 10,
            zIndex: 1000,
            //helper: function (event) {
            //    //create helper and adjust to be correct width and height to match table head
            //    var el = $(this);
            //    var width = el.outerWidth(),
            //        height = el.outerHeight();
            //    dragHelperTemplate.attr({ "style": "width:" + width + "px;height:" + height + "px;z-index:9999;" });
            //    return dragHelperTemplate;
            //},
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
                dragDelta = ui.offset.left;
                var helper = $(ui.helper);
                //dragging right
                if (dragDelta > startPosition) {
                    //check threshold before swapping icon
                    if (dragDelta <= (startPosition + 10)) {
                        helper.find(".fa-plus").removeClass("fa-plus").addClass("fa-ban");
                    }
                } else {
                    //dragging left
                    //check threshold before swapping icon
                    if (dragDelta >= (startPosition - 10)) {
                        helper.find(".fa-plus").removeClass("fa-plus").addClass("fa-ban");
                    }
                }
            },
            stop: function (event, ui) {
                //$("#OverI").remove();
                //startPosition = -1;
                //dragDelta = -1;
            }
        });

        //create an over indicator template - two arrows one up one down
        //var overIndicatorTemplate = $("<ul>", { "id": "OverI", "class": "over-indicator" });
        //var lia = $("<li>", { "class": "" });
        //var lib = $("<li>", {});
        //var adown = $("<i>", { "class": "fa fa-arrow-down" });
        //lia.append(adown);
        //var aup = $("<i>", { "class": "fa fa-arrow-up" });
        //lib.append(aup);
        //overIndicatorTemplate.append(lia).append(lib);

        //make th's droppable
        element.droppable({
            over: function (event, ui) {

                //var helper = $(ui.helper);
                //helper.find(".fa-ban").removeClass("fa-ban").addClass("fa-plus");

                ////width and height of over icon
                //var iconHeight = 14;
                //var iconWidth = 13;

                ////on over show target arrows at the correct position by using 
                ////widths, heights, and offsets
                //var el = $(this);
                //var elHeight = el.height();
                //var elWidth = el.width();
                //var offset = el.offset();
                //var top = offset.top + "px";

                //var left = -1;
                ////using the dragDelta variable determine the horizontal placement of the over indicators
                //if (dragDelta > startPosition) {
                //    //if delta greater than start position place over indicator @ offset.left + elWidth
                //    left = (offset.left + elWidth) + "px";
                //} else {
                //    //other wise place it with out adding the th element width
                //    left = (offset.left - iconWidth) + "px";
                //}

                //overIndicatorTemplate.attr({ "style": "z-index:9999;position:absolute;top:" + top + ";left:" + left });

                //overIndicatorTemplate
                //    .find(".fa-arrow-down")
                //    .attr({ "style": "z-index:9999;position:absolute;left:7px;font-size:18px;" })
                //    //animate the tiny arrows towards each other
                //    .animate({ top: "-=" + iconHeight }, 200);

                //overIndicatorTemplate
                //    .find(".fa-arrow-up")
                //    .attr({ "style": "z-index:9999;position:absolute;left:7px;font-size:18px;" })
                //    //animate the tiny arrows towards each other
                //    .animate({ top: "+=" + (elHeight + iconHeight) }, 200);

                //$('body').append(overIndicatorTemplate.fadeIn());
            },
            out: function (event, ui) {
                // $("#OverI").remove();
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

                //public class MoveNodes {
                //    public List<Node> NodesToMove { get; set; } = new List<Node>();
                //    public Node ToNode { get; set; }
                //}

                //var itemData = $(ui.draggable).data().item;

                ////issuing a message for anyone who subscribed to this
                //HC.conductor.publish(HC.events.draggableDropped, element);

                //if (itemData && itemData.active === false) {
                //    itemData.active = true;
                //} else {
                //    itemData = null;
                //}
                ////the index of the drop target of the drag again a table header
                //endIndex = $(this).index();
                //$("#DataGrid").hide();
                //reOrderingFunc(startIndex, endIndex, itemData);
                //setTimeout(function () { $("#DataGrid").show(); }, 50);

                //$("#OverI").remove();

                //startPosition = -1;
                //dragDelta = -1;
            }
        });

    }

};