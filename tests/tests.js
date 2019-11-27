"use strict";

function resetTasks(numTask) {
  tasks.deleteAllTasks();
  for (var i = 1; i <= numTask; i++) {
    tasks.create('This is task ' + i);
  }  
}

// TODO: Update all tasks to consistent reset format

tests({

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
    resetTasks(4);
    var task1 = tasks.allTasks[0];
    var task2 = tasks.allTasks[1];
    var task3 = tasks.allTasks[2];
    var task4 = tasks.allTasks[3];
    tasks.toggleComplete(task1.uuid);
    tasks.toggleComplete(task2.uuid);
    tasks.toggleComplete(task3.uuid);
    tasks.clearCompleted();
    eq(tasks.allTasks.length === 1, true);
    eq(tasks.allTasks[0].uuid, task4.uuid);
  },
  '- It should clear only completed tasks, not children of completed tasks.': function() {
    resetTasks(4);
    var task1 = tasks.allTasks[0];
    var task2 = tasks.allTasks[1];
    var task3 = tasks.allTasks[2];
    var task4 = tasks.allTasks[3];
    tasks.nestDownOne(task2.uuid);
    tasks.nestDownOne(task3.uuid);
    tasks.nestDownOne(task4.uuid);
    tasks.toggleComplete(task2.uuid);
    tasks.clearCompleted();
    eq(tasks.allTasks.length === 3, true);
    eq(tasks.allTasks[2].uuid, task4.uuid);
  },
  '### Delete Task(s)': function() {},
  '- It should be able to delete individual tasks.': function() {
    tasks.deleteAllTasks();
    var newTask1 = tasks.create('This is a task');
    var newTask2 = tasks.create('This is a task 2');
    var newTask3 = tasks.create('This is a task 3');
    tasks.deleteTask(newTask2.uuid);
    eq(tasks.allTasks.includes(newTask1), true);
    eq(tasks.allTasks.includes(newTask2), false);
    eq(tasks.allTasks.includes(newTask3), true);
  },
  '- It should only delete the task, not any child tasks.': function() {
    resetTasks(4);
    var task1 = tasks.allTasks[0];
    var task2 = tasks.allTasks[1];
    var task3 = tasks.allTasks[2];
    var task4 = tasks.allTasks[3];
    tasks.nestDownOne(task2.uuid);
    tasks.nestDownOne(task3.uuid);
    tasks.nestDownOne(task4.uuid);
    tasks.nestUpOne(task4.uuid);
    tasks.toggleComplete(task2.uuid);
    tasks.deleteTask(task2.uuid);
    eq(tasks.allTasks[1].uuid, task3.uuid);
    eq(task1.children.length, 0);
    eq(task3.parentUUID, 0);
  },
  '### Complete Task': function() {},
  '- It should be able to mark a task as complete.': function() {
    tasks.deleteAllTasks();
    var newTask = tasks.create('This is a task');
    tasks.toggleComplete(newTask.uuid);
    eq(newTask.completed, true);
  },
  '- It should be able to mark a task as incomplete.': function() {
    tasks.deleteAllTasks();
    var newTask = tasks.create('This is a task');
    tasks.toggleComplete(newTask.uuid); // true
    tasks.toggleComplete(newTask.uuid); // false
    eq(newTask.completed, false);
  },
  '### Update Task': function() {},
  '- It should be able to access a task by its uuid.': function() {
    tasks.deleteAllTasks();
    var newTask = tasks.create('foo');
    var uuid = newTask.uuid;
    eq(tasks.getTaskByUUID(uuid).task, 'foo');
  },
  '- It should be able to update a task based on uuid.': function() {
    tasks.deleteAllTasks();
    var newTask = tasks.create('foo');
    var uuid = newTask.uuid;
    tasks.update(uuid, {
      task: 'bar'
    });
    eq(newTask.task, 'bar');
  },
  '- It should be able to assign a parent task to any task.': function() {
    tasks.deleteAllTasks();
    var parentTask = tasks.create('This is a parent task');
    var childTask = tasks.create('This is a child task');
    tasks.update(childTask.uuid, {
      parentUUID: parentTask.uuid,
    });
    eq(childTask.parentUUID, parentTask.uuid);
  },
  '### Nesting Down': function() {},
  '- If task is the first task in array, it shouldn\'t be able to nest at all.': function() {
    tasks.deleteAllTasks();
    var task1 = tasks.create('This is allTasks[0]');
    var task2 = tasks.create('This is allTasks[1]');
    tasks.nestDownOne(task1.uuid);
    eq(task1.parentUUID, 0);
  },
  '- If task is already a child task, it should not nest any farther.': function() {
    resetTasks(2);
    var task1 = tasks.allTasks[0];
    var task2 = tasks.allTasks[1];
    tasks.nestDownOne(task2.uuid);
    eq(task2.parentUUID, task1.uuid);
    tasks.nestDownOne(task2.uuid);
    eq(task2.parentUUID, task1.uuid);
  },
  '- It should be able to nest one deeper than task above it.': function() {
    resetTasks(3);
    var task1 = tasks.allTasks[0];
    var task2 = tasks.allTasks[1];
    var task3 = tasks.allTasks[2];
    tasks.nestDownOne(task2.uuid);
    tasks.nestDownOne(task3.uuid);
    eq(task2.parentUUID, task1.uuid);
    eq(task3.parentUUID, task2.uuid);
  },
  '### Nesting Up': function() {},
  '- If a task has no parent, it shouldn\'t be able to nest up.': function() {
    resetTasks(2);
    var task1 = tasks.allTasks[0];
    var task2 = tasks.allTasks[1];
    tasks.nestUpOne(task2.uuid);
    eq(task2.parentUUID, 0);
  },
  '- If the task before has the same parent as the task, it should do nothing.': function() {
    resetTasks(4);
    var task1 = tasks.allTasks[0];
    var task2 = tasks.allTasks[1];
    var task3 = tasks.allTasks[2];
    var task4 = tasks.allTasks[3];
    tasks.nestDownOne(task2.uuid);
    tasks.update(task3.uuid, {
      parentUUID: task1.uuid
    });
    tasks.nestUpOne(task3.uuid);
    eq(task3.parentUUID, task1.uuid);
  },
  '- If there is another child task after current task, it should do nothing.': function() {
    resetTasks(4);
    var task2 = tasks.allTasks[1];
    var task3 = tasks.allTasks[2];
    var task4 = tasks.allTasks[3];
    tasks.nestDownOne(task2.uuid);
    tasks.nestDownOne(task3.uuid);
    tasks.update(task4.uuid, {
      parentUUID: task2.uuid
    });
    tasks.nestUpOne(task3.uuid);
    eq(task3.parentUUID, task2.uuid);
    eq(task4.parentUUID, task2.uuid);
  },
  '- If a task\'s parent is a top level task, it should unnest to level 0.': function() {
    resetTasks(2);
    var task2 = tasks.allTasks[1];
    tasks.nestDownOne(task2.uuid);
    tasks.nestUpOne(task2.uuid);
    eq(task2.parentUUID, 0);
  },
  '- If task is the last task in allTasks array, it should be able to nest up all the way to level 0.': function() {
    resetTasks(4);
    var task1 = tasks.allTasks[0];
    var task2 = tasks.allTasks[1];
    var task3 = tasks.allTasks[2];
    var task4 = tasks.allTasks[3];
    tasks.nestDownOne(task2.uuid);
    tasks.nestDownOne(task3.uuid);
    tasks.nestDownOne(task4.uuid);
    tasks.nestUpOne(task4.uuid);
    eq(task4.parentUUID, task2.uuid);
    tasks.nestUpOne(task4.uuid);
    eq(task4.parentUUID, task1.uuid);
    tasks.nestUpOne(task4.uuid);
    eq(task4.parentUUID, 0);
  },
  '### Create Task': function() {},
  '- It should be able to create tasks.': function() {
    tasks.deleteAllTasks(); 
    tasks.create('This is a task');
    eq(tasks.allTasks[0].task, 'This is a task');
  },
  '- It should return the new task to allow usage of created task.': function() {
    tasks.deleteAllTasks();
    var newTask = tasks.create('This is a child task');
    eq(tasks.allTasks[0].uuid, newTask.uuid);
  },
  '- It should give each task a unique ID': function() {
    tasks.deleteAllTasks();
    var task1 = tasks.create('This is a task');
    var task2 = tasks.create('This is a second task');
    eq(Boolean(task1.uuid), true);
    eq(task1.uuid !== task2.uuid, true);
  },
  '- It should be able to store tasks on localStorage.': function() {
    tasks.deleteAllTasks();
    tasks.create('This is a stored item');
    var storedTaskList = JSON.parse(localStorage.getItem('the_todo_app'));
    eq(storedTaskList.length, 1);
  },
  '### Initiate App': function() {},
  '- If `allTasks.length > 0`, it should render the page.': function () {
    tasks.deleteAllTasks();
    tasks.allTasks = [
      {task: 'This is manually added task 1', completed: false, parentUUID: 0, uuid: 123},
      {task: 'This is manually added task 2', completed: false, parentUUID: 0, uuid: 124},
      {task: 'This is manually added task 3', completed: false, parentUUID: 0, uuid: 125},
    ];
    tasks.init();
    var task1Element = document.querySelector('[data-u="123"]');
    eq(Boolean(task1Element), true);
  },
  '- If `allTasks.length === 0`, it should try and load from localStorage.': function () {
    tasks.deleteAllTasks();
    tasks.allTasks = [
      {task: 'This is manually added task 1', completed: false, parentUUID: 0, uuid: 123},
      {task: 'This is manually added task 2', completed: false, parentUUID: 0, uuid: 124},
      {task: 'This is manually added task 3', completed: false, parentUUID: 0, uuid: 125},
    ];
    tasks.setStorage();
    tasks.allTasks = [];
    tasks.init();
    var task1Element = document.querySelector('[data-u="123"]');
    eq(Boolean(task1Element), true);
  },
  '- If no allTasks, and no localStorage, it should create a new starter task.': function () {
    tasks.deleteAllTasks();
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
  '- It should show that tasks are completed when checked off.': function() {
    // Passes
  },
  '- It should show that tasks are nested under parent task.': function() {
    // Passes
  },
  '- It should allow users to clear completed tasks.': function() {
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
  '- If tab inside task, trigger `nestDownOne`.': function() {
    // Passes
  },
  '- If shift+tab inside task, trigger `nestUpOne`.': function() {
    // Passes
  },
  '- If cmd+delete, delete task.': function() {
    // Passes
  },
  '- If cmd+enter, toggle complete task.': function() {
    // Passes
  },
  '- If meta + up arrow, move to previous task.': function() {
    // Passes
  },
  '- If meta + down arrow, move to next task.': function() {
    // Passes
  },
  '- If arrow keys, move within input and don\'t fire listener': function() {
    // Passes
  },
  '- If task loses focus, update task': function() {
    fail();
  },

});

tasks.deleteAllTasks();
tasks.init();

