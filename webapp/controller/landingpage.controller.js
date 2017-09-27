sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"TMS/localservice/loginhandler",
	"TMS/localservice/tmshandler",
	"TMS/localservice/formatter",
	'sap/m/MessageToast'
], function(Controller, LoginHandler, TMSHandler, Formatter, MessageToast) {
	"use strict";

	return Controller.extend("TMS.controller.landingpage", {

		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TMS.view.landingpage
		 */
		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("dashboard").attachPatternMatched(this._onObjectMatched, this);
		},

		/**
		 * Callback handler form hash pattern match
		 * @memberOf TMS.view.landingpage
		 * @param {sap.ui.base.Event} oEvent the hash pattern
		 */
		_onObjectMatched: function(oEvent) {
			this.oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			this.oMainModel = this.getView().getModel();
			this.sUserId = oEvent.getParameter("arguments").userid;
			var oUser = LoginHandler.getUserById(this.sUserId);
			if (oUser) {
				LoginHandler.setCurrentUserDetails(oUser);
			} else {
				this.oRouter.navTo("login");
				var sMsg = this.oResourceBundle.getText("noauth");
				MessageToast.show(sMsg);
			}

			var iCount = this.getView().getModel("init_login").getData().length;
			TMSHandler.setProjectParameters(iCount);
		},

		/**
		 * Callback handler on press event of create project button
		 * @memberOf TMS.view.landingpage
		 */
		handleCreateProject: function() {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("TMS.view.fragments.addproject", this);
				this.getView().addDependent(this._oDialog);
			}
			this.bProjectEdit = false;
			var oTempProject = {};
			oTempProject.title = "";
			oTempProject.description = "";
			var oDate = new Date(),
				locale = "en-us",
				month = oDate.toLocaleString(locale, {
					month: "long"
				});
			oTempProject.createddate = month + " " + oDate.getDate() + " " + oDate.getFullYear();
			oTempProject.scope = "";
			oTempProject.statuslist = [];
			this.getView().getModel("appstate").setProperty("/newproject", oTempProject);
			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			jQuery.sap.delayedCall(0, this, function() {
				this._oDialog.open();
			});
		},

		/**
		 * Callback handler on press event of create project button
		 * @memberOf TMS.view.fragment.addproject
		 */
		handleCloseDialog: function() {
			this._oDialog.close();
		},

		/**
		 * Callback handler on press event of create project button
		 * @memberOf TMS.view.fragment.addproject
		 */
		hanldeProjectCreate: function() {
			var oTempProject = this.getView().getModel("appstate").getProperty("/newproject");
			if (this.getView().byId("idProjectEdit").getIcon() === "sap-icon://accept") {
				oTempProject.scope = "Actions";
			} else {
				oTempProject.scope = "Display";
			}

			if (!this.bProjectEdit && oTempProject.title !== "") {
				TMSHandler.registerProject(oTempProject);
				this._oDialog.close();

			} else if (oTempProject.title === "") {
				MessageToast.show("Please enter a Project Title");
			} else {
				this.oMainModel.refresh();
				this._oDialog.close();
			}

		},

		/**
		 * Callback handler on press event of Edit project button
		 * @memberOf TMS.view.landingpage
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		handleProjectEditPress: function(oEvent) {
			var sIconName = oEvent.getSource().getIcon();
			var aProjectList = this.oMainModel.getProperty("/ProjectCollection");
			var iLen = aProjectList.length;
			var iCount;
			if (sIconName === "sap-icon://edit") {
				oEvent.getSource().setIcon("sap-icon://accept");
				for (iCount = 0; iCount < iLen; iCount++) {
					aProjectList[iCount]["scope"] = "Actions";
				}
			} else {
				oEvent.getSource().setIcon("sap-icon://edit");
				for (iCount = 0; iCount < iLen; iCount++) {
					aProjectList[iCount]["scope"] = "Display";
				}
			}

			this.oMainModel.refresh();

		},

		/**
		 * Callback handler on press event of Project Tile
		 * @memberOf TMS.view.landingpage
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		HandleProjectPress: function(oEvent) {
			var sScope = oEvent.getSource().getScope();
			var sClassName = oEvent.getSource().getScopeClassName();
			var sPath = oEvent.getSource().getBindingContext().sPath;
			if (sClassName === "closebutton") {
				TMSHandler.removeProject(sPath);
			} else if (sScope === "Actions") {
				this.openEditPerspective(sPath);
				this.bProjectEdit = true;
			} else if (sScope === "Display") {
				var sCurrentProjectScope = TMSHandler.getProjectById(this.oMainModel.getProperty(sPath).id);
				TMSHandler.setProjectScope(sCurrentProjectScope);
				this.oRouter.navTo("storyboard", {
					userid: this.sUserId,
					projectid: this.oMainModel.getProperty(sPath).id
				});
			}

		},

		/**
		 * Method called when the user clicks on project in edit mode
		 * @memberOf TMS.view.landingpage
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		openEditPerspective: function(sPath) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("TMS.view.fragments.addproject", this);
				this.getView().addDependent(this._oDialog);
			}

			var oTempProject = this.oMainModel.getProperty(sPath);
			this.getView().getModel("appstate").setProperty("/newproject", oTempProject);

			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			jQuery.sap.delayedCall(0, this, function() {
				this._oDialog.open();
			});
		}

	});
});