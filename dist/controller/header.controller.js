sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"TMS/localservice/loginhandler"
], function(Controller, LoginHandler) {
	"use strict";

	return Controller.extend("TMS.controller.header", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TMS.view.header
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf TMS.view.header
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf TMS.view.header
		 */
		// onAfterRendering: function() {
		//
		// },

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf TMS.view.header
		 */
		//	onExit: function() {
		//
		//	}

		/**
		 * Event handler form Home Button Press
		 * @memberOf TMS.view.header
		 */
		handleHomePress: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("dashboard", {
				userid: this.getView().getModel("appstate").getProperty("/loggedinuser").id
			});
		},

		/**
		 * Event handler on Menu Item click
		 * @memberOf TMS.view.header
		 * @param {sap.ui.base.Event} oEvent of the button click
		 */
		handleMenuItemPress: function(oEvent) {
			var sKey = oEvent.getParameter("item").getKey();
			if (sKey === "2") {
				this.handleLogoutRequest();
			} else {
				// this.handlePersonalizationClick();
			}
		},

		/**
		 * Event handler on view report button click
		 * @memberOf TMS.view.header
		 */
		handleReportPress: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("report", {
				userid: this.getView().getModel("appstate").getProperty("/loggedinuser").id
			});
		},

		/**
		 * Event handler on logout action
		 * @memberOf TMS.view.header
		 */
		handleLogoutRequest: function() {
			LoginHandler.setCurrentUserDetails({});
			this.getOwnerComponent().getRouter().navTo("login");
		}

	});

});