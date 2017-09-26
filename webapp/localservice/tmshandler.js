/*
 *    Util file to hanlde and manage changes on the Project/Task scope.
 *   central file to set/get/register changes made by the user
 */

sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Method to set the reference of model to the TMS Hanlder file
		 * @memberOf TMS.localService.TMSHandler
		 * @param {Object} - oAppStateModel - Model instance of the app state
		 *        {Object} - oAppStateModel - Model instance Main model with master data
		 */
		setModelReferences: function(oAppStateModel, oMainModel) {
			this.oAppStateModel = oAppStateModel;
			this.oMainModel = oMainModel;
		},

		/**
		 * Method to register a new project
		 * @memberOf TMS.localService.TMSHandler
		 * @param {Object} - oTempProject - Project default object
		 */
		registerProject: function(oTempProject) {
			var aProjectsList = this.oMainModel.getProperty("/ProjectCollection");
			oTempProject.id = "0" + aProjectsList.length + 1;
			aProjectsList.push(oTempProject);
			this.oMainModel.refresh();
		},

		/**
		 * Method to delete a project
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sPath - path value of the current project instance
		 */
		removeProject: function(sPath) {
			var aProjectsList = this.oMainModel.getProperty("/ProjectCollection");
			aProjectsList.splice(sPath.slice(-1), 1);
			this.oMainModel.refresh();
		},

		/**
		 * Method to get the project instance from projectid
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sID - id of the project
		 * @return {Object} - returns a JSON object with the selected/clicked prject details
		 */
		getProjectById: function(sID) {
			var aProjectsList = this.oMainModel.getProperty("/ProjectCollection");

			function findProject(projects) {
				return projects.id === sID;
			}
			return aProjectsList.find(findProject);
		},

		/**
		 * Method to set the project instance to appstate model
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sID - id of the project
		 */
		setProjectScope: function(sCurrentProjectScope) {
			this.oAppStateModel.setProperty("/currentproject", sCurrentProjectScope);
		},

		/**
		 * Method to add/register new task
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sStatusId - id of the status-list
		 *		  {object} - oTempTask - Object containing task details
		 */
		addTaskToStatusList: function(sStatusId, oTempTask) {
			var aStatusList = this.oAppStateModel.getProperty("/currentproject").statuslist;
			var aTasks = this.oMainModel.getProperty("/TasksCollection");

			function findStatusList(oList) {
				return oList.id === sStatusId;
			}
			var iIndex = aStatusList.findIndex(findStatusList);
			oTempTask.id = "T" + aTasks.length;
			aStatusList[iIndex].tasklist.push(oTempTask);
			aTasks.push(oTempTask);
			this.oMainModel.refresh();
			this.oAppStateModel.refresh();
		},

		/**
		 * Method to set the current taks to the app state scope
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sTaskId - id of the Task being edited
		 * @return {boolean} - returns true when the current taks is set to edit scope
		 */
		setTaskScopeById: function(sTaskId) {
			var oCurrentProject = this.oAppStateModel.getProperty("/currentproject");
			var aStatusList = oCurrentProject.statuslist;
			var matches = [];
			var iSIndex, iTindex;
			aStatusList.forEach(function(status, iStatusIndex) {
				matches = matches.concat(status.tasklist.filter(function(task, iTaskIndex) {
					if (task.id === sTaskId) {
						iSIndex = iStatusIndex;
						iTindex = iTaskIndex;
					}
				}));
			});
			var oCurrentTask = aStatusList[iSIndex].tasklist[iTindex];
			this.oAppStateModel.setProperty("/taskscope", oCurrentTask);
			this.oAppStateModel.refresh();
			return true;
		},

		/**
		 * Method to set the remove taks from the status list
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sTaskId - id of the Task being edited
		 *		  {boolean} - bDragged - flag to know whether a task was dragged
		 */
		removeTaskonID: function(sTaskId, bDragged) {
			var oCurrentProject = this.oAppStateModel.getProperty("/currentproject");
			var aStatusList = oCurrentProject.statuslist;
			var matches = [];
			var iSIndex, iTindex;
			aStatusList.forEach(function(status, iStatusIndex) {
				matches = matches.concat(status.tasklist.filter(function(task, iTaskIndex) {
					if (task.id === sTaskId) {
						iSIndex = iStatusIndex;
						iTindex = iTaskIndex;
					}
				}));
			});

			aStatusList[iSIndex].tasklist.splice(iTindex, 1);
			this.oAppStateModel.refresh();
			if (bDragged) {
				this.removeTaksFromTaskCollection(sTaskId);
			}
		},

		/**
		 * Method to get a paticular task form task collection Master data
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sTaskId - id of the Task
		 * @return {Object} - returns a JSON object containing task details
		 */
		getTasksFromTaskCollection: function(sTaskId) {
			var aTasks = this.oMainModel.getProperty("/TasksCollection");

			function findTask(oList) {
				return oList.id === sTaskId;
			}
			return aTasks.findIndex(findTask);
		},

		/**
		 * Method to remove a task fromt the Main model
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sTaskId - id of the Task
		 */
		removeTaksFromTaskCollection: function(sTaskId) {
			var aTasks = this.oMainModel.getProperty("/TasksCollection");

			var iIndex = this.getTasksFromTaskCollection(sTaskId);
			aTasks.splice(iIndex, 1);
			this.oMainModel.refresh();
		},

		/**
		 * Method to add/register a new status list to the project
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sStatusText - the name of the status list entered by user
		 */
		addStatusList: function(sStatusText) {
			var oCurrentProject = this.oAppStateModel.getProperty("/currentproject");
			var aStatusList = oCurrentProject.statuslist;
			var oNewStatus = {
				id: "S" + aStatusList.length,
				title: sStatusText,
				tasklist: []
			};
			aStatusList.push(oNewStatus);
			this.oAppStateModel.refresh();
		},

		/**
		 * Method to remove a status list to the project
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sStatusId - id of the Status list
		 */
		removeStatusList: function(sStatusId) {
			var oCurrentProject = this.oAppStateModel.getProperty("/currentproject");
			var aStatusList = oCurrentProject.statuslist;

			function findStatusList(oList) {
				return oList.id === sStatusId;
			}
			var iIndex = aStatusList.findIndex(findStatusList);
			aStatusList.splice(iIndex, 1);
			this.oAppStateModel.refresh();
		},

		/**
		 * Method to get the priority array for a particular task
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sPriorityId - id of the Selected Priority
		 * @return {Object} - returns a JSON object with the priority details
		 */
		getPrioritesbyID: function(sPriorityId) {
			var aPriorites = this.oMainModel.getProperty("/PrioritiesCollection");
			var aList = [];

			if (sPriorityId === "PR01") {
				aList.push(aPriorites[0], aPriorites[1], aPriorites[2]);
			} else if (sPriorityId === "PR02") {
				aList.push(aPriorites[1], aPriorites[2]);
			} else if (sPriorityId === "PR03") {
				aList.push(aPriorites[2]);
			}

			return aList;
		},

		/**
		 * Method to get the status list id when Task id is knows
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sTaskId - id of the Task
		 *  @return {int} - returns a index value of the selected task
		 */
		getStatusListIndexByTaskId: function(sTaskId) {
			var oCurrentProject = this.oAppStateModel.getProperty("/currentproject");
			var aStatusList = oCurrentProject.statuslist;

			function findStatusList(oList) {
				for (var iCount = 0; iCount < oList.tasklist.length; iCount++) {
					if (oList.tasklist[iCount].id === sTaskId) {
						return oList.id;
					}
				}
			}
			return aStatusList.findIndex(findStatusList);
		},

		/**
		 * Method to get the status list id when status list id is known
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sTaskId - id of the Task
		 *  @return {int} - returns a index value of the selected task
		 */
		getStatusListIndexbyID: function(sStatusId) {
			var oCurrentProject = this.oAppStateModel.getProperty("/currentproject");
			var aStatusList = oCurrentProject.statuslist;

			function findStatusList(oList) {
				return oList.id === sStatusId;
			}
			return aStatusList.findIndex(findStatusList);
		},

		/**
		 * Method to get the type object when the user selects a particular type
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sTypeId - id of the selected type
		 *  @return {Object} - returns a JSON object with the Type of task details
		 */

		getTypesbyID: function(sTypeId) {
			var aTypes = this.oMainModel.getProperty("/TypesCollection");

			function findTypes(oList) {
				return oList.id === sTypeId;
			}
			return aTypes.find(findTypes);
		},

		/**
		 * Method to handle the drag user action
		 * @memberOf TMS.localService.TMSHandler
		 * @param {string} - sDragElementContext - id of the selected typesPath of the task which was dragged and dropped
		 *		  {string} - sDropContextTaskId - id of the context where the task was dropped.
		 */
		updateItemDragged: function(sDragElementContext, sStatusId) {
			var oCurrentProject = this.oAppStateModel.getProperty("/currentproject");
			var aStatusList = oCurrentProject.statuslist;
			var oItem = this.oAppStateModel.getProperty(sDragElementContext);
			var iIndex = this.getStatusListIndexbyID(sStatusId);
			this.removeTaskonID(oItem.id);
			aStatusList[iIndex].tasklist.push(oItem);
			this.oAppStateModel.refresh();
		}
	};

});