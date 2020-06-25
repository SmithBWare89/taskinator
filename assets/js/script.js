var formEl = document.querySelector("#task-form");
// Select the Unordered List
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;

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
     
    // Package data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    };

    createTaskEl(taskDataObj);
    formEl.reset();
 }

var createTaskEl = function(taskDataObj) {
  // Adding an li to the UL with class task-item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // Add task ID as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

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

pageContentEl.addEventListener("click", taskButtonHandler);
formEl.addEventListener("submit", taskFormHandler);