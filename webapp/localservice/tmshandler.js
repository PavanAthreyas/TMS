sap.ui.define([], function() {
	"use strict";

	return {

		setModelReferences: function(oAppStateModel, oMainModel) {
			this.oAppStateModel = oAppStateModel;
			this.oMainModel = oMainModel;
		},

		registerProject: function(oTempProject) {
			var aProjectsList = this.oMainModel.getProperty("/ProjectCollection");
			oTempProject.id = "0" + aProjectsList.length + 1;
			aProjectsList.push(oTempProject);
			this.oMainModel.refresh();
		},

		removeProject: function(sPath) {
			var aProjectsList = this.oMainModel.getProperty("/ProjectCollection");
			aProjectsList.splice(sPath.slice(-1), 1);
			this.oMainModel.refresh();
		},

		getProjectById: function(sID) {
			var aProjectsList = this.oMainModel.getProperty("/ProjectCollection");

			function findProject(projects) {
				return projects.id === sID;
			}
			return aProjectsList.find(findProject);
		},

		setProjectScope: function(sCurrentProjectScope) {
			this.oAppStateModel.setProperty("/currentproject", sCurrentProjectScope);
		},

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

		removeTaskonID: function(sTaskId, sDragged) {
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
			if (sDragged) {
				this.removeTaksFromTaskCollection(sTaskId);
			}
		},

		getTasksFromTaskCollection: function(sTaskId) {
			var aTasks = this.oMainModel.getProperty("/TasksCollection");

			function findTask(oList) {
				return oList.id === sTaskId;
			}
			return aTasks.findIndex(findTask);
		},

		removeTaksFromTaskCollection: function(sTaskId) {
			var aTasks = this.oMainModel.getProperty("/TasksCollection");

			var iIndex = this.getTasksFromTaskCollection(sTaskId);
			aTasks.splice(iIndex, 1);
			this.oMainModel.refresh();
		},

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

		getTypesbyID: function(sTypeId) {
			var aTypes = this.oMainModel.getProperty("/TypesCollection");

			function findTypes(oList) {
				return oList.id === sTypeId;
			}
			return aTypes.find(findTypes);
		},

		updateItemDragged: function(sDragElementContext, sDropContextTaskId) {
			var oCurrentProject = this.oAppStateModel.getProperty("/currentproject");
			var aStatusList = oCurrentProject.statuslist;
			var oItem = this.oAppStateModel.getProperty(sDragElementContext);
			var iIndex = this.getStatusListIndexByTaskId(sDropContextTaskId);
			this.removeTaskonID(oItem.id);
			aStatusList[iIndex].tasklist.push(oItem);
			this.oAppStateModel.refresh();
		}
	};

});