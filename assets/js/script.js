var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

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
    
    formEl.reset();
    
    // Package data as an object
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    };

    createTaskEl(taskDataObj);
 }
var createTaskEl = function(taskDataObj) {
  // Adding an li to the UL with class task-item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // Creating a div below the li with class task-info
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  // Inserting HTML to display stored values of Input and Dropdown
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" +
    taskDataObj.type + "</span>";

  listItemEl.appendChild(taskInfoEl);
  tasksToDoEl.appendChild(listItemEl);
}

formEl.addEventListener("submit", taskFormHandler);