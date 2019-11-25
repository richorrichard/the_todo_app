"use strict";

tests({

  /*
  '### Render Tasks': function() {},
  '- It should display task list.': function() {
    tasks.deleteAllTasks();
    var task1 = tasks.create('This is task 1');
    var renderedElement = tasks.getTaskElementByUUID(task1.uuid);
    eq(Boolean(renderedElement), true);
  },
  '- It should display child tasks as nested tasks visually.': function() {
    tasks.deleteAllTasks();
    var task1 = tasks.create('This is task 1');
    var task2 = tasks.create('This is task 2');
    tasks.update(task2.uuid, {
      parentUUID: task1.uuid,
    });
    var renderedElement = tasks.getTaskElementByUUID(task2.uuid).parentElement;
    var classListe = Object.values(renderedElement.classList);
    eq(classListe.includes('child'), true);
  },
  '### Manage Tasks': function() {},
  '- It should be able to clear all completed tasks.': function() {
    // debugger;
    tasks.deleteAllTasks();
    var task1 = tasks.create('This is task 1');
    var task2 = tasks.create('This is task 2');
    tasks.toggleComplete(task1.uuid);
    tasks.clearCompleted();
    eq(tasks.allTasks.length === 1, true);
    eq(tasks.allTasks[0].uuid, task2.uuid);
    tasks.deleteAllTasks();
  },
  '### Delete Task(s)': function() {},
  '- It should be able to delete individual tasks.': function() {
    var newTask1 = tasks.create('This is a task');
    var newTask2 = tasks.create('This is a task 2');
    var newTask3 = tasks.create('This is a task 3');
    tasks.deleteTask(newTask2.uuid);
    eq(tasks.allTasks.includes(newTask1), true);
    eq(tasks.allTasks.includes(newTask2), false);
    eq(tasks.allTasks.includes(newTask3), true);
    tasks.deleteAllTasks();
  },
  '### Complete Task': function() {},
  '- It should be able to mark a task as complete.': function() {
    var newTask = tasks.create('This is a task');
    tasks.toggleComplete(newTask.uuid);
    eq(newTask.completed, true);
  },
  '- It should be able to mark a task as incomplete.': function() {
    var newTask = tasks.create('This is a task');
    tasks.toggleComplete(newTask.uuid); // true
    tasks.toggleComplete(newTask.uuid); // false
    eq(newTask.completed, false);
  },
  '### Update Task': function() {},
  '- It should be able to access a task by its uuid.': function() {
    var newTask = tasks.create('foo');
    var uuid = newTask.uuid;
    eq(tasks.getTaskByUUID(uuid).task, 'foo');
    tasks.deleteAllTasks();
  },
  '- It should be able to update a task based on uuid': function() {
    var newTask = tasks.create('foo');
    var uuid = newTask.uuid;
    tasks.update(uuid, {
      task: 'bar'
    });
    eq(newTask.task, 'bar');
    tasks.deleteAllTasks();
  },
  '- It should be able to assign a parent task to any task.': function() {
    var parentTask = tasks.create('This is a parent task');
    var childTask = tasks.create('This is a child task');
    tasks.update(childTask.uuid, {
      parentUUID: parentTask.uuid,
    });
    eq(childTask.parentUUID, parentTask.uuid);
    tasks.deleteAllTasks();
  },
  '- It should be able to change which tasks are parent tasks.': function() {
    var parentTask1 = tasks.create('This is the first parent task');
    var parentTask2 = tasks.create('This is the new parent task');
    var childTask = tasks.create('This is a child task');
    tasks.update(childTask.uuid, {
      parentUUID: parentTask1.uuid,
    });
    eq(childTask.parentUUID, parentTask1.uuid);
    tasks.update(childTask.uuid, {
      parentUUID: parentTask2.uuid,
    });
    eq(childTask.parentUUID, parentTask2.uuid);
    tasks.deleteAllTasks();
  },
  '- It should be able to remove all parent tasks from a task.': function() {
    var parentTask = tasks.create('This is a parent task');
    var childTask = tasks.create('This is a child task');
    tasks.update(childTask.uuid, {
      parentUUID: parentTask.uuid,
    });
    eq(childTask.parentUUID, parentTask.uuid);
    tasks.update(childTask.uuid, {
      parentUUID: undefined,
    });
    eq(childTask.parentUUID, undefined);
    tasks.deleteAllTasks();
  },
  '- It should make task `i-1` the parent task.': function() {
    var task1 = tasks.create('This is task 1');
    var task2 = tasks.create('This is task 2');
    tasks.nestDownOne(task2.uuid);
    
    eq(task2.parentUUID, task1.uuid);
    tasks.deleteAllTasks();
  },
  '- If `allTasks[0]`, it shouldn\'t be able to nest at all.': function() {
    tasks.deleteAllTasks();
    var task1 = tasks.create('This is allTasks[0]');
    var task2 = tasks.create('This is allTasks[1]');
    tasks.nestDownOne(task1.uuid);
    
    eq(task1.parentUUID, undefined);
    tasks.deleteAllTasks();
  },
  '- If `parentUUID`, it shouldn\'t be able to nest any farther.': function() {
    
    // data to use for all tests
    var task1 = tasks.create('This is task 1');
    var task2 = tasks.create('This is task 2');
    var task3 = tasks.create('This is task 3');
    var task4 = tasks.create('This is task 4');
    var task5 = tasks.create('This is task 5');
    
    tasks.update(task3.uuid, {parentUUID: task2.uuid,});
    tasks.update(task5.uuid, {parentUUID: task4.uuid,});
    
    // try to take down again
    tasks.nestDownOne(task3.uuid);
    tasks.nestDownOne(task4.uuid);
    tasks.nestDownOne(task4.uuid);
    eq(task3.parentUUID, task2.uuid);
    eq(task4.parentUUID, task3.uuid);
    eq(task5.parentUUID, task4.uuid);
    tasks.deleteAllTasks();
  },
  '- If no `parentUUID`, it shouldn\'t nest up at all.': function() {
    var task1 = tasks.create('This is allTasks[0]');
    tasks.nestUpOne(task1.uuid);
    eq(task1.parentUUID, undefined);
    tasks.deleteAllTasks();
  },
  '- If parent, `parentUUID` should be set to parent\'s `parentUUID`.': function() {
    var task1 = tasks.create('This is task 1');
    var task2 = tasks.create('This is task 2');
    var task3 = tasks.create('This is task 3');
    var task4 = tasks.create('This is task 4');
    tasks.nestDownOne(task2.uuid);
    tasks.nestDownOne(task4.uuid);
    tasks.nestDownOne(task3.uuid);
    tasks.nestUpOne(task2.uuid);
    tasks.nestUpOne(task4.uuid);
    eq(task2.parentUUID, undefined);
    eq(task4.parentUUID, task2.uuid);
    tasks.deleteAllTasks();
  },
  '### Create Task': function() {},
  '- It should be able to create tasks.': function() {
    tasks.create('This is a task');
    eq(tasks.allTasks[0].task, 'This is a task');
    tasks.deleteAllTasks(); 
  },
  '- It should return the new task to allow usage of created task.': function() {
    tasks.deleteAllTasks();
    var newTask = tasks.create('This is a child task');
    eq(tasks.allTasks[0].uuid, newTask.uuid);
    tasks.deleteAllTasks();
  },
  '- It should give each task a unique ID': function() {
    var task1 = tasks.create('This is a task');
    var task2 = tasks.create('This is a second task');
    eq(Boolean(task1.uuid), true);
    eq(task1.uuid !== task2.uuid, true);
    tasks.deleteAllTasks();
  },
  '- It should be able to store tasks on localStorage.': function() {
    tasks.deleteAllTasks();
    tasks.create('This is a stored item');
    var storedTaskList = JSON.parse(localStorage.getItem('the_todo_app'));
    eq(storedTaskList.length, 1);
    tasks.deleteAllTasks();
  },
  '### Initiate App': function() {},
  '- If `allTasks.length > 0`, it should render the page.': function () {
    tasks.deleteAllTasks();
    tasks.allTasks = [
      {task: 'This is manually added task 1', completed: false, uuid: 123},
      {task: 'This is manually added task 2', completed: false, uuid: 124},
      {task: 'This is manually added task 3', completed: false, uuid: 125},
    ];
    tasks.init();
    var task1Element = document.querySelector('[data-u="123"]');
    eq(Boolean(task1Element), true);
  },
  '- If `allTasks.length === 0`, it should try and load from localStorage.': function () {
    tasks.deleteAllTasks();
    tasks.allTasks = [
      {task: 'This is manually added task 1', completed: false, uuid: 123},
      {task: 'This is manually added task 2', completed: false, uuid: 124},
      {task: 'This is manually added task 3', completed: false, uuid: 125},
    ];
    tasks.setStorage();
    tasks.allTasks = [];
    tasks.init();
    var task1Element = document.querySelector('[data-u="123"]');
    eq(Boolean(task1Element), true);
  },
  '- If no allTasks, and no localStorage, it should create a new starter task.': function () {
    tasks.deleteAllTasks();
    // debugger;
    tasks.init();
    var task1Element = document.querySelector('.taskList > div');
    eq(Boolean(task1Element), true);
  },
  '### Needed Helper Requirements': function() {},
  '- It should be able to get a task UUID from the DOM element.': function() {
    tasks.deleteAllTasks();
    var task = tasks.create('This is a task');
    var task1Element = document.querySelector('[data-u="' + task.uuid + '"]');
    eq(Boolean(task1Element), true);
    
  },
  '- It should be able to retrieve a task by its UUID.': function() {
    tasks.deleteAllTasks();
    var task = tasks.create('This is a task');
    var testUUID = tasks.allTasks[0].uuid;
    eq(tasks.getTaskByUUID(testUUID), task);
  },
  '- It should be able to retrieve a task\'s index in the array by its UUID.': function() {
    tasks.deleteAllTasks();
    var task = tasks.create('This is a task');
    eq(tasks.getIndexByUUID(task.uuid), 0);
  },
  '### Interface Requirements': function() {},
  '- It should show that tasks are completed when checked off. ': function() {
    // Passes
  },
  '- It should show that tasks are nested under parent task.': function() {
    // Passes
  },
  '- It should allow users to clear completed tasks': function() {
    // Passes
  },
  '- It should allow tasks to be deleted.': function() {
    // Passes
  },
  '### Listeners/Events': function() {},
  '- If click on radio, toggle complete task.': function() {
    // Passes
  },
  '- If typing inside task, update task.': function() {
    // Passes
  },
  '- If click on new task button add blank task and focus.': function() {
    // Passes
  },
  '- If cmd+delete, delete task.': function() {
    // Passes
  },
  '- If tab inside task, trigger `nestDownOne`. ': function() {
    // Passes
  },
  '- If shift+tab inside task, trigger `nestUpOne`.': function() {
    // Passes
  },
  '- ✓ If cmd+delete, delete task.': function() {
    // Passes
  },
  '- If cmd+enter, toggle complete task.': function() {
    // Passes
  },
  */
});
