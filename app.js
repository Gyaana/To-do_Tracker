document.addEventListener("DOMContentLoaded", function () {
  const LOCAL_STORAGE_KEY = "todoTasks"; // Key for storing tasks in localStorage
  const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []; // Retrieve tasks or initialize empty

  // Initialize FullCalendar
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next",
      center: "title",
      right: "",
    },
    events: tasks.map((task) => ({
      id: task.id,
      title: `${task.name} ❤️`,
      start: task.deadline,
      color: determineColor(task.deadline),
    })),
    eventClick: function (info) {
      const taskId = info.event.id;
      const taskIndex = tasks.findIndex((task) => task.id === taskId);

      if (taskIndex > -1 && confirm("Mark this task as completed?")) {
        // Remove task from the array and localStorage
        tasks.splice(taskIndex, 1);
        updateLocalStorage(tasks);

        // Remove task from the calendar
        info.event.remove();
      }
    },
  });
  calendar.render();

  // Add Task Form Submission
  document.getElementById("taskForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const taskName = document.getElementById("taskName").value;
    const taskDeadline = document.getElementById("taskDeadline").value;
    const taskId = `task-${Date.now()}`;

    // Add task to the tasks array
    const newTask = { id: taskId, name: taskName, deadline: taskDeadline };
    tasks.push(newTask);
    updateLocalStorage(tasks);

    // Add task to the calendar
    calendar.addEvent({
      id: taskId,
      title: `${taskName} ❤️`,
      start: taskDeadline,
      color: determineColor(taskDeadline),
    });

    // Reset form inputs
    document.getElementById("taskName").value = "";
    document.getElementById("taskDeadline").value = "";
  });

  // Update Heart Color Periodically
  setInterval(() => {
    const currentDate = moment();

    tasks.forEach((task) => {
      const taskEvent = calendar.getEventById(task.id);
      if (taskEvent) {
        const deadline = moment(task.deadline);
        const daysOverdue = currentDate.diff(deadline, "days");

        let color;
        if (daysOverdue > 14) color = "black";
        else if (daysOverdue > 7) color = "brown";
        else if (daysOverdue > 0) color = "red";
        else color = "green";

        taskEvent.setProp("color", color);
      }
    });
  }, 1000 * 60); // Update every minute

  // Helper Functions

  /**
   * Update localStorage with the latest task list
   */
  function updateLocalStorage(tasks) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }

  /**
   * Determine the color of the task based on the deadline
   */
  function determineColor(deadline) {
    const currentDate = moment();
    const deadlineDate = moment(deadline);
    const daysOverdue = currentDate.diff(deadlineDate, "days");

    if (daysOverdue > 14) return "black";
    if (daysOverdue > 7) return "brown";
    if (daysOverdue > 0) return "red";
    return "green";
  }
});
