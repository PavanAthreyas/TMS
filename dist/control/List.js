sap.ui.define([
	'jquery.sap.global',
	'sap/m/List'
], function(jQuery, List) {
	"use strict";

	var oList = List.extend("TMS.control.List", {
		metadata: {
			properties: {
				"isDraggable": {
					type: "boolean",
					defaultValue: false,
					bindable: "bindable"
				},
				"dragID": {
					type: "string",
					defaultValue: null
				},
				aggregations: {
					cardholder: {
						type: "sap.ui.core.Control",
						multiple: true,
						bindable: "bindable"
					}
				}

			}
		},
		renderer: {
			renderContainerAttributes: function(rm, oControl) {
				if (oControl.getIsDraggable()) {
					oControl.setDragID("#" + oControl.getId("listUl") + ",");
				}
			}
		}

	});

	return oList;

});