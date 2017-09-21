sap.ui.define(['TMS/localservice/loginhandler'], function(LoginHandler) {
	"use strict";

	return {

		setPriorityText: function(aPrioList, sLabel) {
			var sString = "";

			if (!sLabel) {
				sString = "Priority: ";
			}
			if (aPrioList.length === 3) {
				return sString + "High";
			}
			if (aPrioList.length === 2) {
				return sString + "Medium";
			}
			if (aPrioList.length === 1) {
				return sString + "Low";
			} else {
				return "No Priority";
			}
		},

		setUserName: function(sId) {
			var oUserDetails = LoginHandler.getUserById(sId);
			if (oUserDetails) {
				return oUserDetails.firstname + " " + oUserDetails.lastname;
			} else {
				return sId;
			}
		}
	};

});