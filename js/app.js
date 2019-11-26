"use strict";

// TODO Alt version: Could move all of the functions on the task to inside a prototype, 
// and then simply call self.xx_method. Try that after getting this wrapped. 
var ENTERKEY = 13;
var ESCKEY = 27;
var TABKEY = 9;
var DELETEKEY = 8;

var constructors = {
  Task: function Task(task) {
    this.task = task;
    this.uuid = tasks.uuid();
    this.completed = false;
    this.parentUUID = 0;
    this.children = [];
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
  // Helper Methods
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
  getTaskElementByUUID: function(uuid) {
    var resultNodes = document.querySelectorAll('[data-u="' + uuid + '"] > .task');
    return resultNodes[0];
  },
  setFocusAtEnd: function(el) {
    var range = document.createRange();
    var sel = window.getSelection();
    var textNode = el.childNodes[0];
    if (textNode) {
      var length = el.innerText.length;
      range.setStart(textNode, length);
    } else {
      range.setStart(el, 0);
    }
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    el.focus();
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
    document.querySelector('.taskList').addEventListener('keydown', function(e) {
      if (e.target.className === 'task') {
        this.updateKeydown(e);
      }
      e.stopImmediatePropagation()
    }.bind(this));
    document.querySelector('.taskList').addEventListener('keyup', function(e) {
      if (e.target.className === 'task') {
        this.updateKeyup(e);
      }
      e.stopImmediatePropagation()
    }.bind(this));
    document.querySelector('.addTask').addEventListener('click', function(e) {
      this.create('');
      e.stopImmediatePropagation();
    }.bind(this));
    document.querySelector('.clearAll').addEventListener('click', function(e) {
      this.clearCompleted();
      e.stopImmediatePropagation();
    }.bind(this));
  },
  updateKeyup: function(e) {
    var elem = e.target;
    var uuid = parseInt(elem.parentElement.dataset['u']);
    // if esc, return and reset the string to stored value
    if (e.which === ESCKEY) {
      this.cancelUpdate(elem, uuid);
    } else if (e.which === ENTERKEY && !e.metaKey) {
      this.create('');
    } else {
      this.update(uuid, {
        task: elem.innerText
      });
      this.setFocusAtEnd(this.getTaskElementByUUID(uuid));
    }
  },
  updateKeydown: function(e) {
    var elem = e.target;
    var uuid = parseInt(elem.parentElement.dataset['u']);
    if (e.which === ENTERKEY) {
      e.preventDefault();
    }

    if (e.metaKey && e.which === DELETEKEY) {
      e.preventDefault();
      this.deleteTask(uuid);
    }

    if (e.metaKey && e.which === ENTERKEY) {
      e.preventDefault();
      this.toggleComplete(uuid);
    }

    if (e.shiftKey && e.which === TABKEY) {
      e.preventDefault();
      this.nestUpOne(uuid);
    }

    if (!e.shiftKey && e.which === TABKEY) {
      e.preventDefault();
      this.nestDownOne(uuid);
    }
  },
  cancelUpdate: function(el, uuid) {
    var task = this.getTaskByUUID(uuid);
    el.innerText = task.task;
    el.blur();
  },
  // CRUD
  create: function(taskText) {
    var newTask = new constructors.Task(taskText);
    if (this.allTasks.length > 1) {
      var previousTaskIndex = this.allTasks.length - 1;

      if (this.allTasks[previousTaskIndex].parentUUID !== 0) {
        var parentTaskUUID = this.allTasks[previousTaskIndex].parentUUID;
        var parentTask = this.getTaskByUUID(parentTaskUUID);
        newTask.parentUUID = parentTaskUUID;
        parentTask.children.push(newTask);
      } 
    } 
    this.allTasks.push(newTask);
    this.setStorage();
    this.render();
    this.setFocusAtEnd(this.getTaskElementByUUID(newTask.uuid));
    return newTask;
  },
  createOld: function(task) {
    var newTask = new constructors.Task(task);
    this.allTasks.push(newTask);
    this.setStorage();
    this.render();
    this.setFocusAtEnd(this.getTaskElementByUUID(newTask.uuid));
    return newTask;
  },
  update: function(uuid, updateObject) {
    /**
     * `updateObject` available properties:
     *    task: [string],
     *    parentUUID: [number]
     */

    var currentTask = this.getTaskByUUID(uuid);

    if (arguments.length > 1) {
      // Explictly set each property to prevent overwriting uuid etc.
      if (updateObject.hasOwnProperty('task')) {
        currentTask['task'] = updateObject['task'];
      }

      if (updateObject.hasOwnProperty('parentUUID')) {
        var currentParentTaskUUID = currentTask.parentUUID;
        var currentParentTask = this.getTaskByUUID(currentParentTaskUUID);
        var newParentTaskUUID = updateObject['parentUUID'];
        var newParentTask;
          
        if (currentParentTaskUUID > 0) {
          var currentTaskChildIndex = currentParentTask.children.findIndex(function(el) {
            return el === currentTask; 
          });
          currentParentTask.children.splice(currentTaskChildIndex, 1); // This is the remove from children
        }

        if (newParentTaskUUID > 0) {
          newParentTask = this.getTaskByUUID(newParentTaskUUID);
          newParentTask['children'].push(currentTask);
        }

        currentTask['parentUUID'] = newParentTaskUUID;
      }
    }

    this.setStorage();
    this.render();
  },
  nestDownOne: function(uuid) {
    var task = this.getTaskByUUID(uuid);
    var taskPosition = this.getIndexByUUID(uuid);
    var taskPrevious = this.allTasks[taskPosition - 1];
    var taskParent = this.getTaskByUUID(task.parentUUID);

    if (taskPosition === 0) {
      return;
    }

    // If is already child, do nothing.
    if (task.parentUUID > 0) {
      if (taskPrevious.uuid === taskParent.uuid) {
        return;
      }
    }
    
    // Else nest task down one level
    this.update(uuid, {
      parentUUID: taskPrevious.uuid
    });
    this.setFocusAtEnd(this.getTaskElementByUUID(uuid));
  },
  nestUpOne: function(uuid) {
    var currentTask = this.getTaskByUUID(uuid);
    var currentTaskIndex = this.getIndexByUUID(uuid);
    var taskParent = this.getTaskByUUID(currentTask.parentUUID);
    var newTaskParentUUID;
    
    // If no parent, do nothing
    if (currentTask.parentUUID === 0) {
      return;
    }

    // Check if previous task's parent is the same as current Task's parent
    if (tasks.allTasks.length - 1 === currentTaskIndex) {
      // Specific case for last item in the array
      newTaskParentUUID = taskParent.parentUUID;
    } else if (this.allTasks[currentTaskIndex - 1].parentUUID === currentTask.parentUUID) {
      return;
    // Check if another child task after current task
    } else if (this.allTasks[currentTaskIndex + 1].parentUUID === currentTask.parentUUID) {
      return;
    } else if (taskParent.parentUUID === 0) { 
      newTaskParentUUID = 0;
    } else {
      newTaskParentUUID = taskParent.parentUUID;
    }
    
    // Update task parent
    this.update(uuid, {
      parentUUID: newTaskParentUUID
    });

    this.setFocusAtEnd(this.getTaskElementByUUID(uuid));
  },
  toggleComplete: function(uuid) {
    var targetTask = this.getTaskByUUID(uuid);
    targetTask.completed = !targetTask.completed;   
    this.setStorage();
    this.render(); 
    this.setFocusAtEnd(this.getTaskElementByUUID(uuid));
  },
  deleteTask: function(uuid) {
    var indexToDelete = this.getIndexByUUID(uuid);
    var previousItem = this.allTasks[indexToDelete - 1];
    this.allTasks.splice(indexToDelete,1);
    this.setStorage();
    this.render();
    if (previousItem) {
      this.setFocusAtEnd(this.getTaskElementByUUID(previousItem.uuid));
    }
  },
  deleteAllTasks: function() { // This is just to help during testing
    this.allTasks = [];
    this.setStorage('the_todo_app', this.allTasks);
    this.render();
  },
  clearCompleted: function() {
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
    //var renderArray = this.renderWalker(this.allTasks); // identify filling context e.g. data
    var renderArray = this.allTasks.filter(function(el) {
      return el.parentUUID === 0;
    });
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
  },
}

tasks.init();

