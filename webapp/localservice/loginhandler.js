sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Method to set the reference of model to the TMS Hanlder file
		 * @memberOf TMS.localService.loginhanlder
		 * @param {Object} - oAppStateModel - Model instance of the app state
		 *        {Object} - oAppStateModel - Model instance Main model with master data
		 */
		setModelReferences: function(oAppStateModel, oLoginModel) {
			this.oAppStateModel = oAppStateModel;
			this.oLoginModel = oLoginModel;
		},

		/**
		 * Method to set the User Details to appstate model
		 * @memberOf TMS.localService.loginhanlder
		 * @param {Object} - oExistingUser - User details from Master data
		 */
		setCurrentUserDetails: function(oExistingUser) {
			this.oAppStateModel.setProperty("/loggedinuser", oExistingUser);
		},

		/**
		 * Method to get the user details from appstate model
		 * @memberOf TMS.localService.loginhanlder
		 *  @return {Object} - returns a JSON object with the user details
		 */
		getCurrentUserDetails: function() {
			return this.oAppStateModel.getProperty("/loggedinuser");
		},

		/**
		 * Method to get the  user details from master data
		 * @memberOf TMS.localService.loginhanlder
		 * @param {string} - sUserId -user id based on login action
		 * @return {Object} - returns a JSON object with the user details
		 */
		getUserById: function(sUserId) {
			var aUsers = this.oLoginModel.getProperty("/");

			function findUsers(users) {
				return users.id === sUserId;
			}
			return aUsers.find(findUsers);
		},

		/**
		 * Method handler to check the user details on submit actions
		 * @memberOf TMS.localService.loginhanlder
		 * @param {string} - sUserName -Entered user name
		 *        {string} - sPassword -Entered password
		 * @return {string} - returns appropriate message based on user inputs
		 */
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

		/**
		 * Method handler to check the user details on submit actions
		 * @memberOf TMS.localService.loginhanlder
		 * @param {Object} - oNewUser -JSON Object with New user registeration details
		 * @return {string} - returns appropriate message based on user inputs
		 */

		registerUser: function(oNewUser) {
			var aUsers = this.oLoginModel.getProperty("/");
			oNewUser.id = "0" + aUsers.length + 1;
			aUsers.push(oNewUser);
			return "New user has been successfully added. Please login to TMS ";
		}

	};

});