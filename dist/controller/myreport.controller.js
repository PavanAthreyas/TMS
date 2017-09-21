sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"TMS/localservice/loginhandler",
	"sap/m/MessageToast",
	"TMS/localservice/formatter"
], function(Controller, LoginHandler, MessageToast, Formatter) {
	"use strict";

	return Controller.extend("TMS.controller.myreport", {

		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TMS.view.myreport
		 */
		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("report").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function(oEvent) {
			this.oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			this.oMainModel = this.getView().getModel();
			var oParameter = oEvent.getParameter("arguments");
			var sUserId = oParameter.userid;
			this.oUser = LoginHandler.getUserById(sUserId);
			if (this.oUser) {
				LoginHandler.setCurrentUserDetails(this.oUser);
			} else {
				this.oRouter.navTo("login");
				var sMsg = this.oResourceBundle.getText("noauth");
				MessageToast.show(sMsg);
			}
			this.oAppStateModel = this.getView().getModel("appstate");
			this.updateUserFilters();
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf TMS.view.myreport
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf TMS.view.myreport
		 */
		onAfterRendering: function() {

		},

		updateUserFilters: function() {
			// create new filter  
			var aFilters = [];
			var oUserFilter = new sap.ui.model.Filter("assignee", sap.ui.model.FilterOperator.EQ, this.oUser.id);
			aFilters.push(oUserFilter);
			var oVizFrame = this.getView().byId("idVizFrame");
			oVizFrame.getDataset().getBinding("data").filter(aFilters);
			var oList = this.getView().byId("idTaskMyList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters);
		}

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf TMS.view.myreport
		 */
		//	onExit: function() {
		//
		//	}

	});

});