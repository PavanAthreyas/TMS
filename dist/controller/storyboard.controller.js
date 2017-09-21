sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"TMS/localservice/loginhandler",
	"TMS/localservice/tmshandler",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"TMS/localservice/formatter",
	"sap/ui/thirdparty/jqueryui/jquery-ui-core",
	"sap/ui/thirdparty/jqueryui/jquery-ui-widget",
	"sap/ui/thirdparty/jqueryui/jquery-ui-mouse",
	"sap/ui/thirdparty/jqueryui/jquery-ui-sortable",
	"sap/ui/thirdparty/jqueryui/jquery-ui-droppable",
	"sap/ui/thirdparty/jqueryui/jquery-ui-draggable"

], function(Controller, LoginHandler, TMSHandler, MessageToast, Filter, Formatter) {
	"use strict";

	return Controller.extend("TMS.controller.storyboard", {

		formatter: Formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf TMS.view.storyboard
		 */
		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("storyboard").attachPatternMatched(this._onObjectMatched, this);
		},

		/**
		 * Callback handler form hash pattern match
		 * @memberOf TMS.view.landingpage
		 * @param {sap.ui.base.Event} oEvent the hash pattern
		 */
		_onObjectMatched: function(oEvent) {
			this.oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			this.oMainModel = this.getView().getModel();
			var oParameter = oEvent.getParameter("arguments");
			var sUserId = oParameter.userid;
			this.oUser = LoginHandler.getUserById(sUserId);
			var sProjectId = oParameter.projectid;
			var oCurrentProjectScope = TMSHandler.getProjectById(sProjectId);
			TMSHandler.setProjectScope(oCurrentProjectScope);
			if (this.oUser) {
				LoginHandler.setCurrentUserDetails(this.oUser);
			} else {
				this.oRouter.navTo("login");
				var sMsg = this.oResourceBundle.getText("noauth");
				MessageToast.show(sMsg);
			}
			this.oAppStateModel = this.getView().getModel("appstate");

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf TMS.view.storyboard
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf TMS.view.storyboard
		 */
		onAfterRendering: function() {
			this.updateListDragging();
		},

		/**
		 * Callback handler on press event of create project button * 
		 * @memberOf TMS.view.storyboard 
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		handleStatusListTitleEdit: function(oEvent) {
			var aContents = oEvent.getSource().getParent().getContent();
			if (oEvent.getSource().getSrc() === "sap-icon://edit") {
				aContents[0].setVisible(false);
				aContents[1].setVisible(true);
				oEvent.getSource().setSrc("sap-icon://accept");
				this.oAppStateModel.refresh();
			} else if (oEvent.getSource().getSrc() === "sap-icon://accept") {
				aContents[0].setVisible(true);
				aContents[1].setVisible(false);
				oEvent.getSource().setSrc("sap-icon://edit");
			}
		},

		/**
		 * Callback handler on press event of add status list button * 
		 * @memberOf TMS.view.storyboard 
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		hanldeStatusAddEvent: function(oEvent) {
			if (oEvent.getParameter("clearButtonPressed")) {
				return;
			} else {
				var sStatusText = oEvent.getSource().getValue();
				if (sStatusText) {
					TMSHandler.addStatusList(sStatusText);
					oEvent.getSource().setValue("");
					this.updateListDragging();
				}
			}
		},

		/**
		 * Callback handler on press event of delet status list icon * 
		 * @memberOf TMS.view.storyboard 
		 * @param {sap.ui.base.Event} oEvent of the icon press event
		 */
		handleDeleteStatusList: function(oEvent) {
			var sStatusId = oEvent.getSource().data("statusid");
			TMSHandler.removeStatusList(sStatusId);
			this.updateListDragging();
		},

		/**
		 * Callback handler on press event of List update finshed * 
		 * @memberOf TMS.view.storyboard 
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		handleUpdateFinished: function() {
			this.updateListDragging();
		},

		/**
		 * Method to set the Draggable properties to UI elements * 
		 * @memberOf TMS.view.storyboard 
		 */
		updateListDragging: function() {
			var aStatusList = this.getView().byId("idStatusListContainer").getItems();
			var sIdString = "";
			var _self = this;
			if (aStatusList.length > 0) {
				for (var iCount = 0; iCount < aStatusList.length; iCount++) {
					sIdString += aStatusList[iCount].getDragID();
				}
				$(sIdString.slice(0, -1)).sortable({
					connectWith: ".ui-sortable",
					unbind: "update",
					update: function(e, ui) {
						if (!ui.sender) {
							_self.updateDrop(e, ui);
						}
					}
				}).disableSelection();
			}
		},

		/**
		 * Event Handle on Drag and Drop of UI elemenet 
		 * @jUery Global update event for Sortable functionality 
		 * @memberOf TMS.view.storyboard 
		 */
		updateDrop: function(e, ui) {
			var sItemID = ui.item.attr("id");
			var sContainerID = $("#" + e.toElement.id).closest('ul').attr('id');
			sContainerID = sContainerID.replace("-listUl", "");
			var sItemContext = sap.ui.getCore().byId(sItemID).getBindingContextPath();
			var oListUL = sap.ui.getCore().byId(sContainerID);
			var sCurrentContextTaskId = oListUL.getItems()[0].data("taskid");
			TMSHandler.updateItemDragged(sItemContext, sCurrentContextTaskId);

		},

		/**
		 * Callback handler on press event of icon click* 
		 * @memberOf TMS.view.storyboard 
		 */

		handleAddIconStatusClick: function() {
			var oStatusInput = this.getView().byId("idNewStatusFeild");
			oStatusInput.fireSearch();
		},

		/**
		 * Callback handler on press event of delete icon 
		 * @memberOf TMS.view.storyboard 
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		handleDeleteTaskIcon: function(oEvent) {
			var sId = oEvent.getSource().data("taskid");
			TMSHandler.removeTaskonID(sId);
		},

		/**
		 * Callback handler on press event of comment post
		 * @memberOf TMS.view.storyboard 
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		handleOnCommentPost: function(oEvent) {
			var sCommentText = oEvent.getParameter("value");
			var oTaskScope = this.oAppStateModel.getProperty("/taskscope");
			var oDate = new Date(),
				locale = "en-us",
				month = oDate.toLocaleString(locale, {
					month: "long"
				});
			var oTempComment = {
				"Author": this.oUser.id,
				"AuthorPicUrl": "",
				"Type": "info",
				"Date": month + " " + oDate.getDate() + " " + oDate.getFullYear(),
				"Text": sCommentText
			};
			var aCommentList = oTaskScope.commentlist;
			aCommentList.push(oTempComment);
			oTaskScope.comments = aCommentList.length;
			this.oAppStateModel.refresh();
		},
		/**
		 * Callback handler on press event of plus icon 
		 * @memberOf TMS.view.storyboard 
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		handleAddTaskinList: function(oEvent) {
			// create popover
			if (!this._oEditPopover) {
				this._oEditPopover = sap.ui.xmlfragment("TMS.view.fragments.statuslistedit", this);
				this.getView().addDependent(this._oEditPopover);
			}
			this.sTaskContext = oEvent.getSource().data("statusid");
			this.bEditTrue = false;
			var oNewTask = {
				"title": "",
				"description": "",
				"type": "",
				"dirtytype": "TY01",
				"priority": "",
				"dirtypriority": "PR01",
				"assignee": "",
				"comments": "0",
				"commentlist": [],
				"attachments": "0"
			};
			this.oAppStateModel.setProperty("/taskscope", oNewTask);
			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			var oIcon = oEvent.getSource();
			jQuery.sap.delayedCall(0, this, function() {
				this._oEditPopover.openBy(oIcon);
			});
		},

		/**
		 * Callback handler on press event of plus icon 
		 * @memberOf TMS.view.fragments.statuslist 
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		handleTaskCreate: function(oEvent) {
			var oTempTasks = this.oAppStateModel.getProperty("/taskscope");
			var aPriority = TMSHandler.getPrioritesbyID(oTempTasks.dirtypriority);
			var aType = TMSHandler.getTypesbyID(oTempTasks.dirtytype);
			oTempTasks.priority = aPriority;
			oTempTasks.type = aType;
			if (this.bEditTrue) {
				this.handleCloseEditPopover();
				this.oAppStateModel.refresh();
				return;
			}
			if (oTempTasks.title === "") {
				MessageToast.show("Please Enter a title to continue");
			} else {
				TMSHandler.addTaskToStatusList(this.sTaskContext, oTempTasks);
				this.handleCloseEditPopover();
			}
		},
		handleSuggestionItemSelected: function(oEvent) {
			if (oEvent.getParameter("selectedItem")) {
				var sId = oEvent.getParameter("selectedItem").getKey();
				var oTempTask = this.oAppStateModel.getProperty("/taskscope");
				oTempTask.assignee = sId;
			}

		},

		handleTaskEditPress: function(oEvent) {
			this._oPopover.close();
			var oTempTasks = this.oAppStateModel.getProperty("/taskscope");
			oTempTasks.dirtypriority = "";
			if (oTempTasks.priority.length === 3) {
				oTempTasks.dirtypriority = "PR01";
			} else if (oTempTasks.priority.length === 2) {
				oTempTasks.dirtypriority = "PR02";
			} else if (oTempTasks.priority.length === 1) {
				oTempTasks.dirtypriority = "PR03";
			}
			oTempTasks.dirtytype = oTempTasks.type.id;
			this.oAppStateModel.refresh();
			if (!this._oEditPopover) {
				this._oEditPopover = sap.ui.xmlfragment("TMS.view.fragments.statuslistedit", this);
				this.getView().addDependent(this._oEditPopover);
			}
			this.bEditTrue = true;

			jQuery.sap.delayedCall(0, this, function() {
				this._oEditPopover.openBy(this.oDisplayIcon);
			});
		},

		/**
		 * Callback handler on press event of create project button * 
		 * @memberOf TMS.view.fragment.statuslist 
		 * 
		 */
		handleCloseEditPopover: function() {
			this._oEditPopover.close();
		},

		/**
		 * Callback handler on press event of suggest username
		 * @memberOf TMS.view.storyboard 
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */
		handleSuggest: function(oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new Filter("firstname", sap.ui.model.FilterOperator.StartsWith, sTerm));
			}
			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
		},

		/**
		 * Callback handler on press event of display Task
		 * @memberOf TMS.view.storyboard 
		 * @param {sap.ui.base.Event} oEvent the button press event
		 */

		handleShowTaskIcon: function(oEvent) {
			var sTaskId = oEvent.getSource().data("taskid");
			var bSet = TMSHandler.setTaskScopeById(sTaskId);
			if (bSet) {
				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment("TMS.view.fragments.statuslistdisplay", this);
					this.getView().addDependent(this._oPopover);
				}
				this.oDisplayIcon = oEvent.getSource();
				jQuery.sap.delayedCall(0, this, function() {
					this._oPopover.openBy(this.oDisplayIcon);
				});
			}
		}

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf TMS.view.storyboard
		 */
		//	onExit: function() {
		//
		//	}

	});

});