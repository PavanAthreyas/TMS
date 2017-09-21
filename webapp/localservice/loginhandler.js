sap.ui.define([], function() {
	"use strict";

	return {

		setModelReferences: function(oAppStateModel, oLoginModel) {
			this.oAppStateModel = oAppStateModel;
			this.oLoginModel = oLoginModel;
		},

		setCurrentUserDetails: function(oExistingUser) {
			this.oAppStateModel.setProperty("/loggedinuser", oExistingUser);
		},

		getCurrentUserDetails: function() {
			return this.oAppStateModel.getProperty("/loggedinuser");
		},

		getUserById: function(sUserId) {
			var aUsers = this.oLoginModel.getProperty("/");

			function findUsers(users) {
				return users.id === sUserId;
			}
			return aUsers.find(findUsers);
		},

		authenticateUser: function(sUserName, sPassword) {

			var aUsers = this.oLoginModel.getProperty("/");

			function findUsers(users) {
				return users.username === sUserName;
			}
			var oExistingUser = aUsers.find(findUsers);
			if (oExistingUser) {
				if (sUserName === oExistingUser.username && sPassword === oExistingUser.password) {
					this.setCurrentUserDetails(oExistingUser);
					return oExistingUser;
				} else {
					return {
						"errmsg": "Please Check your Credentials"
					};
				}
			} else {
				return {
					"errmsg": "User Doesn Not Exits. Please Register"
				};
			}
		},

		registerUser: function(oNewUser) {
			var aUsers = this.oLoginModel.getProperty("/");
			oNewUser.id = "0" + aUsers.length + 1;
			aUsers.push(oNewUser);
			return "New user has been successfully added. Please login to TMS ";
		}

	};

});