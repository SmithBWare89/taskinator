var formEl = document.querySelector("#task-form");
// Select the Unordered List
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var tasks = [];

var taskFormHandler = function() {
    // Stops button from submitting data and refreshing page
    event.preventDefault();
    // Storing the values of the input and dropdown box in variables
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
      alert("You need to fill out the task form!");
      return false;
    }
    var isEdit = formEl.hasAttribute("data-task-id");
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
      var taskID = formEl.getAttribute("data-task-id");
      completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
    // Package data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };

    createTaskEl(taskDataObj);
    }
    formEl.reset();
 }

var createTaskEl = function(taskDataObj) {
  // Adding an li to the UL with class task-item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // Add task ID as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);
  listItemEl.setAttribute("draggable", "true");

  // Creating a div below the li with class task-info
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  // Inserting HTML to display stored values of Input and Dropdown
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" +
    taskDataObj.type + "</span>";

  // Pass in the counter ID to the associate the actions task
  var taskActionsEl = createTaskActions(taskIdCounter);
  // Create the task info
  listItemEl.appendChild(taskInfoEl);
  // Create the task actions bar
  listItemEl.appendChild(taskActionsEl);

  // Create the entire to-do
  tasksToDoEl.appendChild(listItemEl);

  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);
  saveTasks();

  // Increment taskID counter by 1
  taskIdCounter++;
}

var createTaskActions = function(taskID) {
  // Create container to hold buttons
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // Create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskID);

  // Add button to container
  actionContainerEl.appendChild(editButtonEl);

  // Create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskID);

  // Add delete button to container
  actionContainerEl.appendChild(deleteButtonEl);

  // Create dropdown
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskID);

  // Add dropdown to container
  actionContainerEl.appendChild(statusSelectEl);

  // Array holds choices to be added for select
  // Makes it easier to add additional options later on (e.g, email to-do to someone)
  var statusChoices = ["To Do", "In Progress", "Completed"];
  
  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);
  
    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;  
}

var taskButtonHandler = function() {
  // get target element from event
  var targetEl = event.target;

  // delete button was clicked
  if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }

  // edit button was clicked
  else if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
}

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  // create array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if task[i].id doesn't match the value of taskId, let's keep that task and push it into
    // the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be in the same array as updatedTaskArr
  tasks = updatedTaskArr;
  saveTasks();
}

var editTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  document.querySelector("input[name='task-name']").value = taskName;

  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("select[name='task-type']").value = taskType;

  document.querySelector("#save-task").textContent = "Save Task";
}

var completeEditTask = function(taskNameInput, taskTypeInput, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;
  // update task's in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      // At each iteration of this for loop, we are checking to see if that individual task's id property matches the taskId argument we passed into completeEditTask().
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
  saveTasks();
}

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
  
    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
      tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "in progress") {
      tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "completed") {
      tasksCompletedEl.appendChild(taskSelected);
    }
  saveTasks();
}

var dragTaskHandler = function(event) {
  // Grab the task ID of the item we're dragging
  var taskId = event.target.getAttribute("data-task-id");
  // Stores the taskID in the dataTransfer property of the event
  event.dataTransfer.setData("text/plain", taskId);
  // Verifies that we've gotten the data from dataTransfer
  var getId = event.dataTransfer.getData("text/plain");
} 

var dropZoneDragHandler = function() {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) {
    event.preventDefault();
    taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
  }
}

var dropTaskHandler = function() {
  var id = event.dataTransfer.getData("text/plain");
  var draggableElement = document.querySelector("[data-task-id='" + id + "']"); 
  var dropZoneEl = event.target.closest(".task-list");
  var statusType = dropZoneEl.id;
  var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
  if (statusType === "tasks-to-do") {
    // Changes the selected index to display in dropdown menu
    statusSelectEl.selectedIndex = 0;
  } 
  else if (statusType === "tasks-in-progress") {
    statusSelectEl.selectedIndex = 1;
  } 
  else if (statusType === "tasks-completed") {
    statusSelectEl.selectedIndex = 2;
  }
  dropZoneEl.appendChild(draggableElement);
  dropZoneEl.removeAttribute("style");
  saveTasks();
}

var dragLeaveHandler = function() {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) {
    taskListEl.removeAttribute("style");
  }
}

var saveTasks = function() {
  localStorage.setItem("tasks", tasks);
}

var loadTasks = function() {
  // Obtain task items from localStorage
  // Convert from string back into array
  // Iterate through array and create task elements on page
}

pageContentEl.addEventListener("click", taskButtonHandler);
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);