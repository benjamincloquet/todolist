window.onload = function() {
  const toDoList = document.getElementById("to-do-list");
  const taskForm = toDoList.querySelector(".task-form");
  const toDoListSubmitCallback = createAndAddNewTaskFromForm.bind(toDoList);
  taskForm.onsubmit = toDoListSubmitCallback;
  const taskDisplay = toDoList.querySelector(".task-display");
  initTaskEventListeners.call(taskDisplay);

  loadTasks.call(toDoList);
};

const initTaskEventListeners = function()
{
  this.addEventListener('taskListContentModified', onTaskListContentModified.bind(this), true);
}

const loadTasks = function()
{
  storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks !== null)
  {
    for (let taskIndex = 0; taskIndex < storedTasks.length; taskIndex++)
    {
      createAndAddNewTask.call(this, storedTasks[taskIndex]);
    }
  }
}

const createAndAddNewTaskFromForm = function()
{
  const taskName = getTaskNameInFormInput.call(this);
  createAndAddNewTask.call(this, taskName);
  clearInputs.call(this);
  // don't refresh the page!
  return false;
}

const getTaskNameInFormInput = function()
{
  return this.querySelector(".task-form").querySelector(".task-form-name-input").value;
}

const createAndAddNewTask = function(taskName)
{
  const newTask = createTask.call(this, taskName);
  addTask.call(this, newTask);
}

const createTask = function(name)
{
  const taskForm = this.querySelector(".task-form");
  const task = document.createElement("li");
  addName.call(task, name);
  addButtons.call(task);
  task.classList.add('task', 'task-folded');
  return task;
}

const addName = function(name)
{
  const taskName = document.createElement("input");
  taskName.type = "text";
  taskName.value = name;
  taskName.classList.add('task-name');
  this.appendChild(taskName);
}

const addButtons = function()
{
  const buttons = document.createElement("div");
  buttons.classList.add('task-buttons');
  this.appendChild(buttons);
  addCheckButton.call(this);
  addRemoveButton.call(this);
}

const addRemoveButton = function()
{
  const task = this;
  const removeButton = createAndAddButton.call(this);
  const removeButtonText = document.createElement("i");
  removeButtonText.classList.add('far', 'fa-trash-alt', 'fa-2x');
  removeButton.appendChild(removeButtonText);
  removeButton.classList.add('btn', 'task-button', 'task-remove-button');
  removeButton.onclick = removeTask.bind(task);
}

const removeTask = function()
{
  this.classList.add('removed', 'task-folded');
  const event = new Event('taskListContentModified');
  this.dispatchEvent(event);
  setTimeout(this.remove(), 1000);
}

const addCheckButton = function()
{
  const task = this;
  const checkButton = createAndAddButton.call(this);
  const checkButtonText = document.createElement("i");
  checkButtonText.classList.add('fas', 'fa-check', 'fa-2x');
  checkButton.appendChild(checkButtonText);
  checkButton.classList.add('btn', 'task-button', 'task-check-button');
  checkButton.onclick = toggleCheckTask.bind(task);
}

const toggleCheckTask = function()
{
  const checkButtonIcon = this.querySelector(".task-check-button").querySelector("i");
  if (this.classList.contains("task-checked"))
  {
    this.classList.remove("task-checked");
    checkButtonIcon.classList.add("fa-check");
    checkButtonIcon.classList.remove("fa-redo-alt");
  }
  else
  {
    this.classList.add("task-checked");
    checkButtonIcon.classList.remove("fa-check");
    checkButtonIcon.classList.add("fa-redo-alt");
  }
}

const createAndAddButton = function()
{
  const task = this;
  const button = document.createElement("button");
  this.querySelector(".task-buttons").appendChild(button);
  return button;
}

const addTask = function(task)
{
  const taskList = this.querySelector(".task-list");
  taskList.appendChild(task);
  setTimeout(unfoldTask.bind(task), 1);
  const event = new Event('taskListContentModified');
  taskList.dispatchEvent(event);
}

const unfoldTask = function()
{
  this.classList.remove("task-folded");
}

const onTaskListContentModified = function()
{
  const tasks = this.querySelector("ul").querySelectorAll("li");
  const caption = this.querySelector(".task-list-caption");
  if (getActiveTasksCount.call(tasks) === 0)
  {
    caption.classList.remove("task-list-caption-not-empty");
  }
  else if (!caption.classList.contains("task-list-caption-not-empty")) {
    caption.classList.add("task-list-caption-not-empty");
  }

  saveTasksInStorage.call(this);
}

const getActiveTasksCount = function()
{
  let count = 0;
  for (let taskIndex = 0; taskIndex < this.length; taskIndex++)
  {
    if (isActive.call(this[taskIndex]))
    {
      count++;
    }
  }
  return count;
}

const saveTasksInStorage = function()
{
  const tasks = this.querySelector("ul").querySelectorAll("li");
  let taskNames = [];
  for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++)
  {
    if (isActive.call(tasks[taskIndex]))
    {
      taskNames.push(tasks[taskIndex].querySelector(".task-name").value);
    }
  }
  localStorage.setItem("tasks", JSON.stringify(taskNames));
}

const isActive = function()
{
  return !this.classList.contains('removed');
}

const clearInputs = function()
{
  this.querySelector(".task-form-name-input").value = "";
}
