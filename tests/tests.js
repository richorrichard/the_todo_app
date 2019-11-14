"use strict";

tests({

  '### Display Tasks': function() {},
  '- It should be able to display tasks': function() {
    tasks.create("This is a todo");
    
  },
  '### Manage Tasks': function() {},
  '- It should be able to clear all completed tasks.': function() {
    fail();
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
  '### Create Task': function() {},
  '- It should be able to create tasks.': function() {
    tasks.create('This is a task');
    eq(tasks.allTasks[0].task, 'This is a task');
    tasks.deleteAllTasks(); 
  },
  '- It should return the new task to allow usage of created task.': function() {
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
    tasks.create('This is a stored item');
    var storedTaskList = JSON.parse(localStorage.getItem('the_todo_app'));
    eq(storedTaskList.length, 1);
    tasks.deleteAllTasks();
  },
  
});