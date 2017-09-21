sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer'],
	function(jQuery, Renderer) {
		"use strict";

		/**
		 * Task Card renderer.
		 *
		 * @author Pavan Athreyas S J
		 * @namespace
		 */
		var TaskCardRenderer = {};

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.m.Text} oText An object representation of the control that should be rendered.
		 */
		TaskCardRenderer.render = function(oRm, oControl) {
			// get control values
			var sTitle = oControl.getTitle(),
				sDescription = oControl.getDescription(true);

			// start writing html
			oRm.write("<div");
			oRm.addClass("card");
			oRm.writeControlData(oControl);
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<div");
			oRm.addClass("content");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<div");
			oRm.addClass("front");
			oRm.writeClasses();

			oRm.write(">");

			oRm.writeEscaped(sTitle);

			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("back");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<p>");
			oRm.writeEscaped(sDescription);
			oRm.write("</p>");
			oRm.write("</div>");

			oRm.write("</div>");
			oRm.write("</div>");

		};

		return TaskCardRenderer;

	}, /* bExport= */ true);