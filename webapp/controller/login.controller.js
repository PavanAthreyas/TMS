sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"TMS/localservice/loginhandler",
	'sap/m/MessageToast'
], function(Controller, LoginHandler, MessageToast) {
	"use strict";

	return Controller.extend("TMS.controller.login", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TMS.view.login
		 */
		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf TMS.view.login
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf TMS.view.login
		 */
		onAfterRendering: function() {

		},

		/**
		 * Callback handler of Submit Button Press in login screen
		 * @memberOf TMS.view.login
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		handleLoginPress: function(oEvent) {
			var oUserNameFeild = this.getView().byId("idUserNameFeild");
			var oPassowrdFeild = this.getView().byId("idPasswordFeild");
			var sUserName = oUserNameFeild.getValue();
			var sPassword = oPassowrdFeild.getValue();

			if (!sUserName || !sPassword) {
				var sMsg = "Please Enter Valid Credentials";
				MessageToast.show(sMsg);
				return;
			}
			var oExistingUser = LoginHandler.authenticateUser(sUserName, sPassword);

			if (oExistingUser.hasOwnProperty("id")) {
				this.oRouter.navTo("dashboard", {
					userid: oExistingUser.id
				});
				oUserNameFeild.setValue("");
				oPassowrdFeild.setValue("");
			} else {
				MessageToast.show(oExistingUser.errmsg);
			}
		},

		/**
		 * Callback handler of Register Button Press in login screen
		 * @memberOf TMS.view.login
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */

		handleRegisterUser: function(oEvent) {
			var oNewUser = this.getView().getModel("appstate").getProperty("/newuser");
			var sMsg = LoginHandler.registerUser(oNewUser);
			this.handleCancelPress();
			MessageToast.show(sMsg);
		},

		/**
		 * Callback handler of Register Button Press in login screen
		 * @memberOf TMS.view.login
		 */

		handleShowRegister: function() {
			var oLoginPanel = this.getView().byId("idLoginPanel");
			var oRegisterPanel = this.getView().byId("idRegisterPanel");
			oLoginPanel.setVisible(false);
			oRegisterPanel.setVisible(true);
			var oNewUser = {};
			oNewUser.firstname = "";
			oNewUser.lastname = "";
			oNewUser.email = "";
			oNewUser.username = "";
			oNewUser.password = "";
			this.getView().getModel("appstate").setProperty("/newuser", oNewUser);
		},

		/**
		 * Callback handler of Cancel Button Press in login screen
		 * @memberOf TMS.view.login
		 */

		handleCancelPress: function() {
			var oLoginPanel = this.getView().byId("idLoginPanel");
			var oRegisterPanel = this.getView().byId("idRegisterPanel");
			oLoginPanel.setVisible(true);
			oRegisterPanel.setVisible(false);
		}

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf TMS.view.login
		 */
		//	onExit: function() {
		//
		//	}

	});

});