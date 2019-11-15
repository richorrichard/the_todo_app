"use strict";

// TODO Alt version: Could move all of the functions on the task to inside a prototype, 
// and then simply call self.xx_method. Try that after getting this wrapped. 

// Task Constructor

// Need to add a case for loading the page the first time and checking to see if there IS anything in localstorage. I'll lose constructor
// inheritence, but that's fine.

var constructors = {
  Task: function Task(task) {
    this.task = task;
    this.uuid = tasks.uuid();
    this.completed = false;
    this.parentUUID = undefined;
  },
}

var tasks = {
  init: function() {
    this.render();
  },
  allTasks: [],
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
      if (value.uuid === uuid) {
        return index;
      }
    });

    return matchingIndex;
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
  // CRUD Interactions
  create: function(task) {
    var newTask = new constructors.Task(task);
    this.allTasks.push(newTask);
    this.setStorage();
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
  },
  toggleComplete: function(uuid) {
    var targetTask = this.getTaskByUUID(uuid);
    targetTask.completed = !targetTask.completed;    
  },
  deleteTask: function(uuid) {
    var indexToDelete = this.getIndexByUUID(uuid);
    this.allTasks.splice(indexToDelete,1);
    this.setStorage();
  },
  deleteAllTasks: function() { // This is just to help during testing
    this.allTasks = [];
    this.setStorage('the_todo_app', this.allTasks);
  },
  render: function() {
    var taskList = document.getElementById('task-list');
    var templateSource = document.getElementById('test-template').innerHTML; // get empty template
    var template = Handlebars.compile(templateSource); // gives you a hook to plug data into 
    
    var context = {title: 'Title Time bitches!', body: 'This is the body bitches'}; // identify filling context e.g. data
    var html = template(context); // render the template WITH the data
    taskList.innerHTML = html;
  },
}