"use strict";

// TODO Alt version: Could move all of the functions on the task to inside a prototype, 
// and then simply call self.xx_method. Try that after getting this wrapped. 

var constructors = {
  Task: function Task(task) {
    this.task = task;
    this.uuid = tasks.uuid();
    this.completed = false;
    this.parentUUID = undefined;
  },
}

var tasks = {
  allTasks: [],
  init: function() {
    // Check if localStorage contains matching tasks
    if (this.allTasks.length === 0) {
      if (this.getStorage().length > 0){
        this.allTasks = this.getStorage();
      } else {
        var firstTask = this.create('');
      }
    } 
    
    this.render();
    this.bindEvents();
  },
  uuid: function() {
    var uuid = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return uuid;
  },
  getTaskByUUID: function(uuid) {
    if (!this.allTasks) {
      throw new ReferenceError('Task list has not been created yet.');
    }
    
    var matchingItem = this.allTasks.find(function(value) {
      if (value.uuid === uuid) {
        return value;
      }
    });

    return matchingItem;
  },
  getIndexByUUID: function(uuid) {
    if (!this.allTasks) {
      throw new ReferenceError('Task list has not been created yet.');
    }
    
    var matchingIndex = this.allTasks.findIndex(function(value, index) {
      return value.uuid === uuid;
    });

    return matchingIndex;
  },
  getUUIDFromElement: function(domElement) {
    var UUIDString = domElement.dataset['u'];
    return parseInt(UUIDString);
  },
  // Manage Data
  setStorage: function() {
    localStorage.setItem('the_todo_app', JSON.stringify(this.allTasks));
  },
  getStorage: function() {
    var storedTaskList = JSON.parse(localStorage.getItem('the_todo_app'));
    if (storedTaskList) {
      return storedTaskList;
    } else {
      return [];
    }
  },
  // Interface 
  bindEvents: function() {
    document.querySelector('.taskList').addEventListener('click', function(e) {
      if (e.target.className === 'checkbox') {
        this.toggleComplete(this.getUUIDFromElement(e.target.parentElement));
      }
      e.stopImmediatePropagation();
    }.bind(this));
    document.querySelector('.taskList').addEventListener('keydown', function() {
      if (e.target.className === 'task') {
        this.updateKeydown(e.target.parentElement);
      }
    }.bind(this));
    document.querySelector('.taskList').addEventListener('keyup', function() {
      if (e.target.className === 'task') {
        this.updateKeyup(e.target.parentElement);
      }
    }.bind(this));
    document.querySelector('.addTask').addEventListener('click', this.create.bind(this));

    /**
     * This is where I broke off – need to add the tests first and then then link up the 
     * handlers to the the proper events.
     * 
     * Sidenote – need to add the 'completed' class to the tasks too for the style.
     */
    
    // TODO: need to add another for handling the clear list functionality. Should put
    // that in the bottom right corner.
  },
  updateKeyup: function(e) {},
  updateKeydown: function(e) {},
  // CRUD
  create: function(task) {
    var newTask = new constructors.Task(task);
    this.allTasks.push(newTask);
    this.setStorage();
    this.render();
    return newTask;
  },
  update: function(uuid, updateObject) {
    /**
     * `updateObject` available properties:
     *    task: [string],
     *    parentUUID: [number]
     */

    var targetTask = this.getTaskByUUID(uuid);
    if (arguments.length > 1) {
      // Explictly set each property to prevent overwriting uuid etc.
      if (updateObject.hasOwnProperty('task')) {
        targetTask['task'] = updateObject['task'];
      }

      if (updateObject.hasOwnProperty('parentUUID')) {
        targetTask['parentUUID'] = updateObject['parentUUID'];
      }
    }
    this.setStorage();
    this.render();
  },
  nestDownOne: function(uuid) {
    // If first item, do nothing.
    var task = this.getTaskByUUID(uuid);
    var taskPosition = this.getIndexByUUID(uuid);
    var taskPrevious = this.allTasks[taskPosition - 1];
    var taskParent = this.getTaskByUUID(task.parentUUID);

    if (taskPosition === 0) {
      return;
    }
    // If is already child, do nothing.
    if (taskParent) {
      if (taskPrevious.uuid === taskParent.uuid) {
        return;
      }
    }
    
    // Else, make task[i-1] parent task
    this.update(uuid, {
      parentUUID: taskPrevious.uuid
    });

  },
  nestUpOne: function(uuid) {
    var task = this.getTaskByUUID(uuid);
    var taskParent = this.getTaskByUUID(task.parentUUID);
    
    // If no parent, do nothing
    if (!taskParent) {
      return;
    }
    // Otherwise, set it to parent's parent
    this.update(uuid, {
      parentUUID: taskParent.parentUUID
    });
  },
  toggleComplete: function(uuid) {
    var targetTask = this.getTaskByUUID(uuid);
    targetTask.completed = !targetTask.completed;   
    this.setStorage();
    this.render(); 
  },
  deleteTask: function(uuid) {
    var indexToDelete = this.getIndexByUUID(uuid);
    this.allTasks.splice(indexToDelete,1);
    this.setStorage();
  },
  deleteAllTasks: function() { // This is just to help during testing
    this.allTasks = [];
    this.setStorage('the_todo_app', this.allTasks);
    this.render();
  },
  clearCompleted() {
    var filteredTasks = this.allTasks.filter(function(value) {
      return value.completed === false;
    });
    this.allTasks = filteredTasks;
    this.setStorage();
    this.render();
  },
  render: function() {
    var taskList = document.getElementById('taskList');
    var taskTemplateSource = document.getElementById('taskTemplate').innerHTML; // get empty template
    var taskTemplate = Handlebars.compile(taskTemplateSource); // gives you a hook to plug data into 
    Handlebars.registerPartial('renderTask', taskTemplate);

    // Need to load with the array here
    var renderArray = this.renderWalker(this.allTasks); // identify filling context e.g. data
    var html = taskTemplate(renderArray); // render the template WITH the data
    taskList.innerHTML = html;
  },
  renderWalker: function(inputArray) {    
    // walker function courtesy of StackOverflow
    function buildTree(allTasks, parentUUID) {
      var branch = [];

      for (var task of allTasks) {
        if (task.parentUUID === parentUUID) {
          var children = buildTree(allTasks, task.uuid);
          if (children) {
            task.children = children;
          }
          branch.push(task);
        }
      }

      return branch;
    }

    var tree = buildTree.call(this, inputArray);
    return tree;
  }
}

tasks.init();

