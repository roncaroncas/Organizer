import {useState, useRef, useEffect} from 'react'

import { format /*, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getISOWeek */} from "date-fns";
// import { addDays, addMonths, addYears } from "date-fns";

interface Task {
	id: number
	taskName: string
	startDayTime: Date;
	endDayTime: Date
	place: string
	fullDay: boolean
	taskDescription: string
	status: string
}

interface TaskGeometry {
	id: number,
	overlaps: number[],
	horizontalOffset: number,
	width: number,
}


interface ModeState {
	mode: "Month" | "Week" | "Day"
	param: number
	day: Date
}

interface CalendarDayProps{
	mode: ModeState,
	tasks: Task[]
	onTaskClick: OnTaskClick
}

type OnTaskClick = (task: Task) => void;


// ------ CALENDAR DAY ------- //


function CalendarDay({mode, tasks, onTaskClick}:CalendarDayProps) {

  // const calendarDayHeader = [
// 	<div key="dayHeader">
  //     <h2>
  //       <span onClick={()=>changeDay(-1)}> - </span>
  //       {format(mode.day, "dd/MM/yyyy")}
  //       <span onClick={()=>changeDay(+1)}> + </span>
  //     </h2>
  //   </div>
  // ]

  const [tasksGeometry, setTasksGeometry] = useState<TaskGeometry[]>([]);
  const taskRefs = useRef<{ [key: number]: HTMLDivElement}>({});

  // // LOAD EMPTY TASKS GEOMETRY
  useEffect(() => {
    console.log("Resetando tasksGeometry!")
    const dayTasks = tasks.filter(
      (task) => new Date(task.startDayTime).toDateString() === mode.day.toDateString()
    );
    setTasksGeometry(
      dayTasks.map((task) => ({
        id: task.id,
        width: 0, // Default
        horizontalOffset: 0, // Default
        overlaps: [], // Default
      }))
    );
  }, [tasks, mode]);

  // CALCULATING ALL WIDTHS
	function setTaskGeometryWidth(task: Task, width: number) {
    const taskGeom = tasksGeometry.find((taskGeom) => taskGeom.id === task.id);
    if (!taskGeom) return;

    if (width != taskGeom.width){
      setTasksGeometry((prevGeometry) =>
        prevGeometry.map((t) =>
          t.id === task.id ? { ...t, width, offset: 0 } : { ...t, offset: 0 } // resseta todos os offsets!
        )
      )
    }
  }

  // CALCULATING OFFSETS AFTER CALCULATE ALL WIDTHS!

  function calculateAllOffsetsGeometry(dayTasks: Task[]) {

	  setTasksGeometry((prevGeometry) =>
	    prevGeometry.map((taskGeom, index) => {
	      // Find the task from dayTasks based on task id
	      const task = dayTasks.find((task: Task) => task.id === taskGeom.id);
	      if (!task) return taskGeom;

	      // Find overlapping tasks from the previous tasks (tasks processed before this one)
	      const overlappingTasks = prevGeometry.slice(0, index).filter((t) => {
	        const otherTask = dayTasks.find((task: Task) => task.id === t.id);
	        if (!otherTask) return false;

	        const taskStart = new Date(task.startDayTime);
	        const taskEnd = new Date(task.endDayTime);
	        const otherStart = new Date(otherTask.startDayTime);
	        const otherEnd = new Date(otherTask.endDayTime);

	        // Check if the tasks overlap
	        return taskStart < otherEnd && taskEnd > otherStart;
	      });

	      // Calculate the new horizontal offset based on the maximum offset of the overlapping tasks
	      const newOffset = 50 + // Starting position for the first task
	        Math.max(
	          0,
	          ...overlappingTasks.map((t) => {
	            const prevTaskGeom = prevGeometry.find((tg) => tg.id === t.id);
	            return prevTaskGeom ? prevTaskGeom.horizontalOffset + prevTaskGeom.width + 5 : 50;
	          })
	        );

	      return { ...taskGeom, horizontalOffset: newOffset };
	    })
	  );
	}

  useEffect(() => {
    console.log("tasksGeometry changed: ", tasksGeometry)
    if (
      tasksGeometry.some((task) => task.horizontalOffset === 0) &&
      tasksGeometry.every((task) => task.width > 0)
    ) {
      console.log("Calculating offsets...");
      const dayTasks = tasks.filter(
        (task) => new Date(task.startDayTime).toDateString() === mode.day.toDateString()
      );
      calculateAllOffsetsGeometry(dayTasks);

    }
  }, [tasksGeometry]);


  // CALCULATE ALL OVERLAPS!
  function setTaskOverlaps(task: Task) {

    const taskGeom = tasksGeometry.find((taskGeom:TaskGeometry) => taskGeom.id === task.id);
    if (!taskGeom) return;

    // Get the start and end times for the current task
    const taskStart = new Date(task.startDayTime);
    const taskEnd = new Date(task.endDayTime);

    // Find overlapping tasks
    const overlappingTasks = tasksGeometry.filter((otherTaskGeom:TaskGeometry) => {

      const otherTask = tasks.find((t) => t.id === otherTaskGeom.id);

      if (!otherTask || otherTask.id >= task.id) return false;

      const otherStart = new Date(otherTask.startDayTime);
      const otherEnd = new Date(otherTask.endDayTime);

      // Check if the tasks overlap
      return taskStart < otherEnd && taskEnd > otherStart;
    });

    const newOverlaps = overlappingTasks.map((t) => t.id);

    // Update the state only if the overlaps have changed
    if (JSON.stringify(newOverlaps) !== JSON.stringify(taskGeom.overlaps)) {
      setTasksGeometry((prevTasksGeometry) =>
        prevTasksGeometry.map((taskGeom) =>
          taskGeom.id === task.id
            ? { ...taskGeom, overlaps: newOverlaps } // Store overlap ids
            : taskGeom
        )
      );
    }
  }

  // useEffect(() => {
  // }, [tasks]);



  const calendarDayBody = () => {
    let dph = 4 //Divisions Per Hour
    const timeSlots = Array.from({ length: 24*dph }, (_, i) => {
      const hours = String(Math.floor(i/dph)).padStart(2, "0");
      const minutes = String((i % dph) * 60/dph).padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    console.log(timeSlots)

    const dayTasks = tasks.filter(
      (task) => new Date(task.startDayTime).toDateString() === mode.day.toDateString()
    );

    return (
      <div className="day-container">

        {timeSlots.map((time) => {

          const [hours, minutes] = time.split(":");
          const isFullHour = minutes === "00"; // Check for full hour
          const isSixthHour = (parseInt(hours) % 6 === 0 && minutes === "00")

          return(
            <div key={time}
              className="time-container"
              style={{
              borderTop: isSixthHour
                ? "3px solid rgba(200, 100, 0, 0.6)" // Strong burnt orange
                : isFullHour
                ? "2px solid rgba(230, 150, 50, 0.4)" // Softer orange
                : "1px solid rgba(230, 170, 90, 0.2)" // Subtle tint
            }}
            >
              <span className="time-text" >
                {isFullHour ? time : ""}
              </span>
            </div>
          )})}

        {dayTasks.map((task, taskIndex) => {
          const taskStart = new Date(task.startDayTime);
          const taskEnd = new Date(task.endDayTime);
          const startIndex = taskStart.getHours() + taskStart.getMinutes() / 60;
          const endIndex = taskEnd.getHours() + taskEnd.getMinutes() / 60;
          const taskHeight = Math.max(endIndex - startIndex, 0) * 2;

          // const overlappingTasks = dayTasks.filter((t, index) => {
          //   const otherStart = new Date(t.startDayTime);
          //   const otherEnd = new Date(t.endDayTime);
          //   return taskStart <= otherEnd && taskEnd >= otherStart && taskIndex > index;
          // });

          const taskGeom = tasksGeometry.find((tg) => tg.id === task.id) || {
            width: 50,
            horizontalOffset: 0,
            overlaps: [],
            id: 0
          };

          return (
            <div
              key={taskIndex}
              className="task-container"
              style={{
                top: `${startIndex * 2}em`,
                height: `${taskHeight}em`,
                left: `${taskGeom.horizontalOffset}px`,
              }}
              onClick={() => {
                onTaskClick(task);
              }}
              ref={(el) => {
                if (el) {
                  taskRefs.current[task.id] = el;
                  setTaskGeometryWidth(task, el.offsetWidth);
                  setTaskOverlaps(task) // Não precisava esperar renderizar para calcular isso...
                }
              }}
            >
              <span>
                ({task.id}) - <strong>{format(task.startDayTime, "HH:mm")}</strong> to{" "}
                <strong>{format(task.endDayTime, "HH:mm")}</strong>: {task.taskName}
              </span>
            </div>
          );
        })}
      </div>
    );
  };


   return(
    <div>
        {calendarDayBody()}
    </div>
    )
}

export default CalendarDay;
