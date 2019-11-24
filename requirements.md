# Requirements

### Create Task
- ✓ It should be able to create tasks.
- ✓ It should return the new task to allow usage of created task.
- ✓ Each task should have a unique ID.
- ✓ It should be able to store tasks on localStorage.

### Update Task
- ✓ It should be able to access a task by its uuid
- ✓ It should be able to update a task based on uuid
- ✓ It should be able to assign a parent task to any task.
- ✓ It should be able to change which tasks are parent tasks.
- ✓ It should be able to remove all parent tasks from a task.
- ✓ If `allTasks[0]`, it shouldn't be able to nest at all.
- ✓ If `parentUUID`, it shouldn't be able to nest any farther.
- ✓ It should make task `i-1` the parent task.
- ✓ If no `parentUUID`, it shouldn't nest up at all.
- ✓ If parent, `parentUUID` should be set to parent's `parentUUID`.

### Complete Task
- ✓ It should be able to mark a task as complete.
- ✓ It should be able to mark a task as incomplete.

### Delete Task(s)
- ✓ It should be able to delete individual tasks.

### Manage Tasks
- ✓ It should be able to clear all completed tasks.

### Render Tasks
- ✓ It should display task list.
- ✓ It should display child tasks as nested tasks visually.

### Initiate App
- ✓ If `allTasks.length > 0`, it should render the page.
- ✓ If `allTasks.length === 0`, it should try and load from localStorage.
- ✓ If no allTasks, and no localStorage, it should create a new starter task.

### Needed Helper Requirements
- ✓ It should be able to get a task UUID from the DOM element.
- ✓ It should be able to retrieve a task by its UUID.
- ✓ It should be able to retrieve a task's index in the array by its UUID.
<!-- it needs more here. Keep the Helpers tested and accountable -->

### Interface Requirements
- It should allow tasks to be completed.
- It should show that tasks are completed when checked off. 
- It should allow tasks to be deleted.
- It should allow tasks to be nested under parent task.
- It should allow users to clear completed tasks

### Listeners/Events
- If click on radio, toggle complete task.
- If single click on task, enter edit.
- If click on new task button add blank task and focus.
- If tab, trigger `nestDownOne`. 
- If shift+tab, trigger `nestUpOne`.
- If arrow keys, move up and down between tasks.
- If cmd+delete, delete task.
- If cmd+enter, toggle complete task.