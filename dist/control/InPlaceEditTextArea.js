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
		var oTextArea = Control.extend("TMS.control.InPlaceEditText", /** @lends sap.m.CheckBox.prototype */ {
			metadata: {
				properties: {
					editable: {
						type: "boolean",
						defaultValue: false
					},
					ellipsis: {
						type: "string",
						defaultValue: "..."
					},
					maxLength: {
						type: "int",
						defaultValue: 0
					},
					numberOfLines: {
						type: "int",
						defaultValue: 3
					},
					value: {
						type: "string",
						defaultValue: ""
					},
					showCharacterCounter: {
						type: "boolean",
						defaultValue: true
					}
				},
				aggregations: {
					// Hidden aggregations
					_characterCounter: {
						type: "sap.m.Text",
						multiple: false,
						visibility: "hidden"
					},
					_textView: {
						type: "sap.m.Text",
						multiple: false,
						visibility: "hidden"
					},
					_textArea: {
						type: "sap.m.TextArea",
						multiple: false,
						visibility: "hidden"
					}
				},
				events: {
					change: {}
				}
			},
			init: function() {
				// Init hidden aggregation: _characterCounter
				this.setAggregation("_characterCounter", new sap.m.Text().addStyleClass("jdUiEidIpeTxtACounter"));

				// Init hidden aggregation: _textArea
				this.setAggregation("_textArea", new sap.m.TextArea({
					width: "100%",
					change: [this._onValueChanged, this],
					liveChange: [this._onLiveValueChanged, this]
				}));

				if (!this.getShowCharacterCounter()) {
					this.getAggregation("_textArea").addStyleClass("jdUiEidPackageName");
				}
			},
			_updateCharacterCounter: function(iLiveText) {
				var iLength = 0;
				if (iLiveText) {
					iLength = iLiveText.length;
				}
				var sText = "" + (this.getMaxLength() - iLength) + " characters left";
				this.getAggregation("_characterCounter").setText(sText);
			},
			/**
			 * Setter for the maxLength property.
			 * 
			 * @param {int}
			 *            iValue the max length.
			 * @returns {jd.ui.eid.control.InPlaceEditableTextArea} <code>this</code> for method chaining.
			 */
			setMaxLength: function(iValue) {
				this.setProperty("maxLength", iValue);
				this.getAggregation("_textArea").setMaxLength(iValue);
				this._updateCharacterCounter();
				return this;
			},

			/**
			 * Custom setter for the editable property.
			 * 
			 * @param {boolean}
			 *            bValue The value to set.
			 * @returns The control instance.
			 */
			setEditable: function(bValue) {
				this.setProperty("editable", bValue);

				var oTextArea = this.getAggregation("_textArea");
				var oTextView = this.getAggregation("_textView");

				if (bValue) { // Make the control editable
					// Switch style classes
					this.addStyleClass("jdUiEidIpeEdit");
					this.addStyleClass("jdUiEidIpeTxtACounterVisible");
					oTextArea.removeStyleClass("hidden");
					oTextView.addStyleClass("hidden");

					// Align the dimensions of the text area with the text view
					oTextArea.setHeight(oTextView.$().height() + "px");
					var sTextViewWidth = oTextView.$().width();
					if (sTextViewWidth === 0) {
						oTextArea.setWidth("100%");
					} else {
						oTextArea.setWidth(oTextView.$().width() + "px");
					};

					// In order to achieve a behavior where the control returns into a read-only state
					// when
					// the text area is left,
					// we need to register for the text area's onBlur event. If we did this here
					// directly,
					// the change would be overwritten
					// since the control is rerendered (because we change the dimensions above). So we
					// need
					// to register for the event
					// in onAfterRendering. The timeout thing is a workaround for IE9. Without the
					// timeout,
					// the onBlur event listener
					// would be called when focusing the event, so that the control would immediately go
					// back into read-only mode.
					var that = this;
					oTextArea.onAfterRendering = function() {
						setTimeout(function() {
							oTextArea.focus();
							oTextArea.$().select();
							oTextArea.$().blur(function() {
								that.setEditable(false);
							});
						}, 100);
					};
				} else { // Male the control un-editable
					// Switch style classes
					this.removeStyleClass("jdUiEidIpeEdit");
					this.removeStyleClass("jdUiEidIpeTxtACounterVisible");
					oTextArea.addStyleClass("hidden");
					oTextView.removeStyleClass("hidden");
					// Reset onAfterRendering
					oTextArea.onAfterRendering = function() {};
				}

				return this;
			},

			/**
			 * Custom setter for the value property.
			 * 
			 * @param {string}
			 *            sValue The value to set.
			 * @returns The control instance.
			 */
			setValue: function(sValue) {
				this.setProperty("value", sValue);
				this.getAggregation("_textArea").setValue(sValue);
				this.getAggregation("_textView").setText(sValue);

				return this;
			},

			/**
			 * Custom setter for the ellipsis property.
			 * 
			 * @param {string}
			 *            sValue The value to set.
			 * @returns The control instance.
			 */
			setEllipsis: function(sValue) {
				this.setProperty("ellipsis", sValue);
				this.getAggregation("_textView").setEllipsis(sValue);

				return this;
			},

			/**
			 * Custom setter for numberOfLines property.
			 * 
			 * @param {int}
			 *            iValue The value to set.
			 * @returns The control instance.
			 */
			setNumberOfLines: function(iValue) {
				this.setProperty("numberOfLines", iValue);
				this.getAggregation("_textView").setNumberOfLines(iValue);
				this.getAggregation("_textArea").setRows(iValue);
				return this;
			},

			/**
			 * sets the value on both controls and sets the control to non editable after the user has changed the value. Delegates the event to the next
			 * event handler
			 * 
			 * @param {sap.ui.base.Event}
			 *            oEvent the event fired by the internal text area.
			 */
			_onValueChanged: function(oEvent) {
				this.setValue(oEvent.getSource().getValue());
				this.setEditable(false);
				this.fireChange(oEvent.getParameters());
			},

			/**
			 * Event handler for the <code>liveChange</code> event of the internal text area. Fires the control's liveChange event.
			 * 
			 * @param {sap.ui.base.Event}
			 *            oEvent the event fired by the internal text area.
			 */
			_onLiveValueChanged: function(oEvent) {
				this._updateCharacterCounter(oEvent.getParameter("liveValue"));
			},

			/**
			 * If the user clicks on the control and it's not editable right now, it should become editable. The switch back is entirely handled by the
			 * text area.
			 * 
			 * @param {jQuery.Event}
			 *            evt
			 */
			onclick: function(evt) {
				if (!this.getEditable()) {
					this.setEditable(true);
				}
			},

			renderer: function(oRm, oControl) {
				oRm.write("<div");
				oRm.writeControlData(oControl);
				oRm.addClass("jdUiEidIpeTxtA");
				oRm.writeClasses();
				if (oControl.getShowCharacterCounter()) {
					oRm.addStyle("height", "54px");
				} else {
					oRm.addStyle("height", "25px");
				}
				oRm.writeStyles();
				oRm.write(">");

				oRm.renderControl(oControl.getAggregation("_textView"));
				oRm.renderControl(oControl.getAggregation("_textArea"));

				if (oControl.getShowCharacterCounter()) {
					oRm.renderControl(oControl.getAggregation("_characterCounter"));
				}

				oRm.write("</div>");
			}

		});

		// oTextArea.prototype.ontap = function(oEvent) {
		// 	this.firePress();
		// };

		// oTextArea.prototype.onpress = function(oEvent) {
		// 	this.firePress();
		// };

		return oTextArea;

	}, /* bExport= */ true);