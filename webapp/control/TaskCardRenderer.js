sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer'],
	function(jQuery, Renderer) {
		"use strict";

		/**
		 * Task Card renderer.
		 *
		 * @author Pavan Athreyas S J
		 * @namespace
		 */
		var ProjectCardRenderer = {};

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.m.Text} oText An object representation of the control that should be rendered.
		 */
		ProjectCardRenderer.render = function(oRm, oControl) {
			// get control values
			var sTitle = oControl.getTitle(),
				sDescription = oControl.getDescription(),
				sScope = oControl.getScope(),
				sCreatedDate = oControl.getCreatedDate(),
				iListCount = oControl.getListCount(),
				iTaskCount = oControl.getTaskCount(),
				iMemberCount = oControl.getMemberCount();

			// start writing html
			oRm.write("<div");
			oRm.addClass("card-container");
			oRm.writeControlData(oControl);
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<div");
			oRm.addClass("card-top create");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<span");
			oRm.addClass("project-type create");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped("Project");
			if (sScope === "Actions") {
				oRm.write("<div");
				oRm.addClass("closebutton");
				oRm.writeClasses();
				oRm.write(">");
				oRm.write("x");
				oRm.write("</div>");
			}
			oRm.write("</span>");
			oRm.write("<div");
			oRm.addClass("blur");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("progress create"); //May be create a class to set as property
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getStatus());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<span>");
			oRm.writeEscaped(oControl.getStatus()); //Status Percentage (last status tasks/ total tasks)
			oRm.write("</span>");
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("content");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<div");
			oRm.addClass("details");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<span>");
			oRm.writeEscaped("Created on: " + sCreatedDate);
			oRm.write("</span>");
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("title");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(sTitle);
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("summary");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(sDescription);
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("project-info");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<div");
			oRm.addClass("info");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<span>");
			oRm.writeEscaped(iListCount); //listCount property
			oRm.write("</span>");
			oRm.write("<span>");
			oRm.writeEscaped("Status List");
			oRm.write("</span>");
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("info");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<span>");
			oRm.writeEscaped(iTaskCount); //taskCount property
			oRm.write("</span>");
			oRm.write("<span>");
			oRm.writeEscaped("Tasks");
			oRm.write("</span>");
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("info");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<span>");
			oRm.writeEscaped(iMemberCount); //memberCount property
			oRm.write("</span>");
			oRm.write("<span>");
			oRm.writeEscaped("Members");
			oRm.write("</span>");
			oRm.write("</div>");

			oRm.write("</div>");

			oRm.write("</div>");
			
			oRm.write("</div>");


		};

		return ProjectCardRenderer;

	}, /* bExport= */ true);