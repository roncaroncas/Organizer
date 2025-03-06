import React from "react"

import { format } from 'date-fns';
import TaskModal from "./TaskModal"


function TaskInCalendar({task, onTaskClick}) { 

  // FORMATO DE LISTA (INDEPENDENTE DA HORA)

  return( 
    <div key={task.id} className="calendarTask">
      {format(task.startDayTime, "HH:mm")}
      <span
        style={{ color: "blue", cursor: "pointer" }}
        onClick={() => onTaskClick(task)}
      >        
        ({task.id}): {task.taskName}
      </span>

    </div>
  )

}

export default TaskInCalendar