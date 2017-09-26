sap.ui.define(['jquery.sap.global',
		'sap/ui/core/Control'
	],
	function(jQuery, Control) {
		"use strict";

		/**
		 * Constructor for a new Status Card.
		 *
		 * @param {string} [sId] The ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] The Initial settings for the new control
		 *
	
		 *
		 * @constructor
		 * @public
		 * @alias TMS.control.Taskcard
		 */
		var oStatusCard = Control.extend("TMS.control.TaskCard", /** @lends sap.m.CheckBox.prototype */ {
			metadata: {
				properties: {
					"title": {
						type: "string",
						defaultValue: null,
						bindable: "bindable"
					},
					"description": {
						type: "string",
						defaultValue: null,
						bindable: "bindable"
					},
					"status": {
						type: "string",
						defaultValue: null,
						bindable: "bindable"
					},
					"active": {
						type: "int",
						defaultValue: 0,
						bindable: "bindable"
					},
					"createdDate": {
						type: "string",
						bindable: "bindable"
					},
					"listCount": {
						type: "int",
						defaultValue: 0
					},
					"taskCount": {
						type: "int",
						defaultValue: 0
					},
					"memberCount": {
						type: "int",
						defaultValue: 0
					},
					"scope": {
						type: "string",
						defaultValue: "Display",
						bindable: "bindable"
					},
					"scopeClassName": {
						type: "string"
					}

				},
				aggregations: {},
				associations: {},
				events: {
					press: {}
				},
				renderer: "TMS.control.TaskCardRenderer"
			}
		});

		oStatusCard.prototype.ontap = function(oEvent) {
			var sClassName = oEvent.target.className;
			this.setScopeClassName(sClassName);
			this.firePress();
		};

		oStatusCard.prototype.onpress = function(oEvent) {
			this.firePress();
		};

		return oStatusCard;

	}, /* bExport= */ true);