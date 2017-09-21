sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"TMS/model/models",
	"TMS/localservice/loginhandler",
	"TMS/localservice/tmshandler"
], function(UIComponent, Device, models, LoginHandler, TMSHandler) {
	"use strict";

	return UIComponent.extend("TMS.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			this.getRouter().initialize();

			var oAppStateModel = this.getModel("appstate");
			var oLoginModel = this.getModel("init_login");
			var oMainModel = this.getModel();
			LoginHandler.setModelReferences(oAppStateModel, oLoginModel);
			TMSHandler.setModelReferences(oAppStateModel, oMainModel);
		}
	});
});