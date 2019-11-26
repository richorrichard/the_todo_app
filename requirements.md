# Requirements

### Render Tasks
- ✓ It should display task list.
- ✓ It should display child tasks as nested tasks visually.
### Manage Tasks
- ✓ It should be able to clear all completed tasks.

### Delete Tasks
- ✓ It should be able to delete individual tasks.

### Complete Tasks
- ✓ It should be able to mark a task as complete.
- ✓ It should be able to mark a task as incomplete.

### Update Tasks
- ✓ It should be able to access a task by its uuid.
- ✓ It should be able to update a task based on uuid'
- ✓ It should be able to assign a parent task to any task.

### Nesting Down
- ✓ If task is the first task in array, it shouldn\'t be able to nest at all.
- ✓ If task is already a child task, it should not nest any farther.
- ✓ It should be able to nest one deeper than task above it.

### Nesting Up
- ✓ If a task has no parent, it shouldn\'t be able to nest up.
- ✓ If the task before has the same parent as the task, it should do nothing.
- ✓ If there is another child task after current task, it should do nothing.
- ✓ If a task\'s parent is a top level task, it should unnest to level 0.
- ✓ If task is the last task in allTasks array, it should be able to nest up all the way to level 0.

### Create Task
- ✓ It should be able to create tasks.
- ✓ It should return the new task to allow usage of created task.
- ✓ It should give each task a unique ID'
- ✓ It should be able to store tasks on localStorage.

### Initiate App
- ✓ If `allTasks.length > 0`, it should render the page.
- ✓ If `allTasks.length === 0`, it should try and load from localStorage.
- ✓ If no allTasks, and no localStorage, it should create a new starter task.

### Needed Helper Requirements
- ✓ It should be able to get a task UUID from the DOM element.
- ✓ It should be able to retrieve a task by its UUID.
- ✓ It should be able to retrieve a task\'s index in the array by its UUID.

### Interface Requirements
- ✓ It should show that tasks are completed when checked off.
- ✓ It should show that tasks are nested under parent task.
- ✓ It should allow users to clear completed tasks'
- ✓ It should allow tasks to be deleted.

### Listeners/Events
- ✓ If click on radio, toggle complete task.
- ✓ If typing inside task, update task.
- ✓ If click on new task button add blank task and focus.
- ✓ If cmd+delete, delete task.
- ✓ If tab inside task, trigger `nestDownOne`.
- ✓ If shift+tab inside task, trigger `nestUpOne`
- ✓ If cmd+delete, delete task.
- ✓ If cmd+enter, toggle complete task.