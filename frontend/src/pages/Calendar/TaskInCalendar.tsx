import React from "react"

import { format } from 'date-fns';
import TaskModal from "./TaskModal"



function TaskInCalendar({task, onTaskClick}) { 

  return( 
    <div key={task.id} className="calendarTask">
      {format(task.startDayTime, "HH:mm")}<br/>
      ({task.id}): {task.taskName} <br/>
      <span
        style={{ color: "blue", cursor: "pointer" }}
        onClick={() => onTaskClick(task)}
      >
        {task.id}
      </span>

      <br/>
    </div>
  )

}

export default TaskInCalendar