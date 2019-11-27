"use strict";
 
var ENTERKEY = 13;
var ESCKEY = 27;
var TABKEY = 9;
var DELETEKEY = 8;
var LEFTARROWKEY = 37;
var UPARROWKEY = 38;
var RIGHTARROWKEY = 39;
var DOWNARROWKEY = 40;

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
    if (this.allTasks.length === 0) {
      if (this.getStorage().length > 0){
        this.allTasks = this.getStorage();
      } else {
        this.create('');
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
    
    var currentTask = this.allTasks.find(function(el) {
      if (el.uuid === uuid) {
        return el;
      }
    });

    return currentTask;
  },
  getIndexByUUID: function(uuid) {
    if (!this.allTasks) {
      throw new ReferenceError('Task list has not been created yet.');
    }
    
    var currentTaskIndex = this.allTasks.findIndex(function(el) {
      return el.uuid === uuid;
    });

    return currentTaskIndex;
  },
  getUUIDFromElement: function(domEl) {
    var UUIDString = domEl.dataset['u'];
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
      // console.log(e.which);
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
    var domEl = e.target;
    var uuid = parseInt(domEl.parentElement.dataset['u']);

    if (e.which === ESCKEY) {
      this.cancelUpdate(domEl, uuid);
    } else if (e.which === ENTERKEY && !e.metaKey) {
      this.create('');
    } else if (e.which === UPARROWKEY || e.which === DOWNARROWKEY || e.which === RIGHTARROWKEY || e.which === LEFTARROWKEY) {
      return;
    } else {
      this.update(uuid, {
        task: domEl.innerText
      });
      this.setFocusAtEnd(this.getTaskElementByUUID(uuid));
    }
  },
  updateKeydown: function(e) {
    var domEl = e.target;
    var uuid = parseInt(domEl.parentElement.dataset['u']);
    var prevTaskIndex;
    var prevTaskElement;
    var nextTaskIndex;
    var nextTaskElement;
    
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
    
    if (e.metaKey && e.which === UPARROWKEY) {
      e.preventDefault();
      prevTaskIndex = this.getIndexByUUID(uuid) - 1;
      if (this.allTasks[prevTaskIndex]) {
        prevTaskElement = this.getTaskElementByUUID(this.allTasks[prevTaskIndex].uuid);
        this.setFocusAtEnd(prevTaskElement);
      }
    }
    
    if (e.metaKey && e.which === DOWNARROWKEY) {
      e.preventDefault();
      nextTaskIndex = this.getIndexByUUID(uuid) + 1;
      if (this.allTasks[nextTaskIndex]) {
        nextTaskElement = this.getTaskElementByUUID(this.allTasks[nextTaskIndex].uuid);
        this.setFocusAtEnd(nextTaskElement);
      }
    }
  },
  cancelUpdate: function(domEl, uuid) {
    var currentTask = this.getTaskByUUID(uuid);
    domEl.innerText = currentTask.task;
    domEl.blur();
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
  update: function(uuid, updateObj) {
    /**
     * `updateObj` available properties:
     *    task: [string],
     *    parentUUID: [number]
     */

    var currentTask = this.getTaskByUUID(uuid);

    if (arguments.length > 1) {
      // Explictly set each property to prevent overwriting uuid etc.
      if (updateObj.hasOwnProperty('task')) {
        currentTask['task'] = updateObj.task;
      }

      if (updateObj.hasOwnProperty('parentUUID')) {
        var currentParentTaskUUID = currentTask.parentUUID;
        var currentParentTask = this.getTaskByUUID(currentParentTaskUUID);
        var newParentTaskUUID = updateObj.parentUUID;
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
    var currentTask = this.getTaskByUUID(uuid);
    var taskPosition = this.getIndexByUUID(uuid);
    var taskPrevious = this.allTasks[taskPosition - 1];
    var taskParent = this.getTaskByUUID(currentTask.parentUUID);

    if (taskPosition === 0) {
      return;
    }

    if (currentTask.parentUUID > 0) {
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
    
    this.update(uuid, {
      parentUUID: newTaskParentUUID
    });

    this.setFocusAtEnd(this.getTaskElementByUUID(uuid));
  },
  toggleComplete: function(uuid) {
    var currentTask = this.getTaskByUUID(uuid);
    currentTask['completed'] = !currentTask.completed;   
    this.setStorage();
    this.render(); 
    this.setFocusAtEnd(this.getTaskElementByUUID(uuid));
  },
  deleteTask: function(uuid) {
    var indexToDelete = this.getIndexByUUID(uuid);
    var previousItem = this.allTasks[indexToDelete - 1];
    var currentTask = this.getTaskByUUID(uuid);
    var parentTask = this.getTaskByUUID(currentTask.parentUUID);

    // remove item from its parent
    if (currentTask.parentUUID > 0) {
      var currentTaskChildIndex = parentTask.children.findIndex(function(el) {
        return el === currentTask; 
      });
      parentTask.children.splice(currentTaskChildIndex, 1);
    }
    // search for any task with this as its parent
    var parentMatchArray = this.allTasks.filter(function(el) {
      return el.parentUUID === uuid;
    });
    parentMatchArray.forEach(function(el) {
      el.parentUUID = 0;
    });

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
    var filteredTasks = this.allTasks.filter(function(el) {
      return el.completed === true;
    });
    filteredTasks.forEach(function(el) {
      this.deleteTask(el.uuid);
    }.bind(this));
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
  }
}

tasks.init();

