import { useState, useEffect } from "react";
import { format, /*startOfMonth, endOfMonth, startOfWeek, endOfWeek, getISOWeek*/ } from "date-fns";
import { addDays, addMonths, addYears } from "date-fns";

import useFetch from "../../hooks/useFetch";
import useModal from "../../hooks/useModal";

import TaskFormModal from "./TaskFormModal";
import CalendarMonth from "./CalendarMonth";
import CalendarDay from "./CalendarDay";

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

interface ModeState {
  mode: "Month" | "Week" | "Day"
  param: number
  day: Date
}



type OnTaskClick = (task: Task) => void;




function CalendarGrid(){

  const [mode, setMode] = useState<ModeState>({
    mode: "Month",
    param: -1,
    day: new Date(Date.now())
  })

  const [tasks, setTasks] = useState<Task[]>([])

  // --------------- DEBUG ------------------------ //
  // useEffect(() => {
  //   console.log("Re-rendering CalendarGrid");
  //   console.log("tasks:", tasks);
  //   console.log("mode:", mode);
  // }, [tasks, mode]);

  // ------------------- FETCHES ---------------- //

  const { data, /*error, isLoading,*/ fetchData } = useFetch('http://localhost:8000/myTasks', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    fetchData();    
  }, []);

  // Update tasks only if data changes
  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  useEffect(() => {
    console.log("Mode updated: ", mode);    
  }, [mode]);


  // ----------------   CONTROLE DE MODAL ------------------

  const { isOpen, openModal, closeModal/*, toggleModal*/ } = useModal()
  const [selectedTask, setSelectedTask] = useState<Task>({
    id: 0,
    taskName: "",
    startDayTime: new Date(),
    endDayTime: new Date(),
    place: "",
    fullDay: false,
    taskDescription: "",
    status: "",
  })

  function resetSelectedTask(){
    setSelectedTask({
      id: 0,
      taskName: "",
      startDayTime: new Date(),
      endDayTime: new Date(),
      place: "",
      fullDay: false,
      taskDescription: "",
      status: ""}
      )
  }


  // ------------------ EVENT HANDLERS ---------------------------

  function setModeAsDay (day: Date):void {
    setMode({
      mode: "Day",
      param: 0,
      day: new Date (day),
    })
    return
  }

  function setModeAsMonth():void {
    let month = mode.day.getMonth()
    setMode({
      mode: "Month",
      param: month,
      day: new Date (mode.day),
    })
    return
  }

  const onTaskClick:OnTaskClick = (task: Task) => {

    setSelectedTask(task)
    openModal();
  }

  const onNewTaskClick = () => { 
    resetSelectedTask()
    openModal()
  }

  // ----- MOUSE HANDLER FOR MODAL:

  useEffect(() => {
    const handleClickOutModal = (event: MouseEvent) => {
      // Casting event target to HTMLDivElement to access the correct property
      if (event.target === document.getElementById('modalDiv')) {
        closeModal();
      }
    };

    window.addEventListener('click', handleClickOutModal);

    return () => window.removeEventListener('click', handleClickOutModal);
  }, [closeModal]);


  const triggerRender = () => {
    fetchData();
  }

  // --------------------  MOVENDO DIAS/MÊS/ANO --------------------


  // const DayInMonthContent = (day: Date, dayTasks: Task[], mode: ModeState, onTaskClick: OnTaskClick) => {

  //   return([

  //       <div key="dateTitle" className="dateTitle">
  //         <a onClick={() => setModeAsDay(day)}> 
  //           <strong>
  //             {format(day, "dd/MM/yyyy")}
  //           </strong>
  //         </a>
  //        <a onClick={() => {
  //           onNewTaskClick()
  //         }}>          
  //           (+)
  //         </a>
  //       </div>,
          

  //       <div key="dateContent" className="dateContent">
  //         {(mode.mode == "Week" && mode.param != getWeek(day)) ? (
  //           dayTasks.length === 0 ? (
  //             ""
  //           ) : (
  //             <>
  //               {dayTasks.slice(0, 3).map(task => (
  //                 <div key={"task__"+ task.id} className="calendarTask">
  //                   {format(task.startDayTime, "HH:mm")}
  //                   <span
  //                     style={{ color: "blue", cursor: "pointer" }}
  //                     onClick={() => onTaskClick(task)}
  //                   >        
  //                     ({task.id}): {task.taskName}
  //                   </span>

  //                 </div>
  //               ))}
  //               {dayTasks.length > 3 && (
  //                 <div>+{dayTasks.length - 3} more</div>
  //               )}
  //             </>
  //           )
  //         ) : (
  //           dayTasks.length === 0 ? (
  //             ""
  //           ) : (
  //             dayTasks.map(task => (
  //               <div key={"task__"+ task.id} className="calendarTask">
  //                 {format(task.startDayTime, "HH:mm")}
  //                 <a
  //                   href="#"
  //                   onClick={() => onTaskClick(task)}
  //                 >        
  //                   ({task.id}): {task.taskName}
  //                 </a>

  //               </div>
  //             ))
  //           )
  //         )}
  //       </div>    
  //   ]

  //   )
  // }

  const monthNumberToLabelMap = [
    'JAN', 'FEV', 'MAR',
    'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET',
    'OUT', 'NOV', 'DEZ',
  ]

function changeDay(delta: number) {
  setMode((prev) => {
    return {...prev, day: addDays(prev.day, delta)}
  });
}

function changeMonth(delta: number) {
  setMode((prev) => {
    return {...prev, day: addMonths(prev.day, delta)}
  });
}

function changeYear(delta: number) {
  setMode((prev) => {
    return {...prev, day: addYears(prev.day, delta)}
  });
}

  // ------ CALENDAR DAY ------- //



//   const [tasksGeometry, setTasksGeometry] = useState<TaskGeometry[]>([]);
//   const taskRefs = useRef<{ [key: number]: HTMLDivElement}>({});

//   // // LOAD EMPTY TASKS GEOMETRY
//   useEffect(() => {
//     console.log("Resetando tasksGeometry!")
//     const dayTasks = tasks.filter(
//       (task) => new Date(task.startDayTime).toDateString() === mode.day.toDateString()
//     );
//     setTasksGeometry(
//       dayTasks.map((task) => ({
//         id: task.id,
//         width: 0, // Default width before measuring
//         horizontalOffset: 0, // Default offset before calculation
//         overlaps: []
//       }))
//     );
//   }, [tasks, mode]);

//   // CALCULATING OFFSETS
//   useEffect(() => {
//     console.log("tasksGeometry changed: ", tasksGeometry)
//     if (
//       tasksGeometry.some((task) => task.horizontalOffset === 0) &&
//       tasksGeometry.every((task) => task.width > 0)
//     ) {
//       console.log("Calculating offsets...");
//       const dayTasks = tasks.filter(
//         (task) => new Date(task.startDayTime).toDateString() === mode.day.toDateString()
//       );
//       calculateAllOffsetsGeometry(dayTasks);

//     }
//   }, [tasksGeometry]);

//   function setTaskGeometryWidth(task, width) {
//     const taskGeom = tasksGeometry.find((taskGeom) => taskGeom.id === task.id);
//     if (!taskGeom) return;

//     if (width != taskGeom.width){
//       setTasksGeometry((prevGeometry) =>
//         prevGeometry.map((t) =>
//           t.id === task.id ? { ...t, width, offset: 0 } : { ...t, offset: 0 } // resseta todos os offsets!
//         )
//       )
//     }
//   }

//   function setTaskOverlaps(task) {

//     const taskGeom = tasksGeometry.find((taskGeom:TaskGeometry) => taskGeom.id === task.id);
//     if (!taskGeom) return;

//     // Get the start and end times for the current task
//     const taskStart = new Date(task.startDayTime);
//     const taskEnd = new Date(task.endDayTime);

//     // Find overlapping tasks
//     const overlappingTasks = tasksGeometry.filter((otherTaskGeom:TaskGeometry) => {

//       const otherTask = tasks.find((t) => t.id === otherTaskGeom.id);

//       if (!otherTask || otherTask.id >= task.id) return false;

//       const otherStart = new Date(otherTask.startDayTime);
//       const otherEnd = new Date(otherTask.endDayTime);

//       // Check if the tasks overlap
//       return taskStart < otherEnd && taskEnd > otherStart;
//     });

//     const newOverlaps = overlappingTasks.map((t) => t.id);

//     // Update the state only if the overlaps have changed
//     if (JSON.stringify(newOverlaps) !== JSON.stringify(taskGeom.overlaps)) {
//       setTasksGeometry((prevGeometry) =>
//         prevGeometry.map((taskGeom) =>
//           taskGeom.id === task.id
//             ? { ...taskGeom, overlaps: newOverlaps } // Store overlap ids
//             : taskGeom
//         )
//       );
//     }
//   }

//   useEffect(() => {
//   }, [tasks]);

// function calculateAllOffsetsGeometry(dayTasks: Task[]) {

//   setTasksGeometry((prevGeometry) =>
//     prevGeometry.map((taskGeom, index) => {
//       // Find the task from dayTasks based on task id
//       const task = dayTasks.find((task: Task) => task.id === taskGeom.id);
//       if (!task) return taskGeom;

//       // Find overlapping tasks from the previous tasks (tasks processed before this one)
//       const overlappingTasks = prevGeometry.slice(0, index).filter((t) => {
//         const otherTask = dayTasks.find((task: Task) => task.id === t.id);
//         if (!otherTask) return false;

//         const taskStart = new Date(task.startDayTime);
//         const taskEnd = new Date(task.endDayTime);
//         const otherStart = new Date(otherTask.startDayTime);
//         const otherEnd = new Date(otherTask.endDayTime);

//         // Check if the tasks overlap
//         return taskStart < otherEnd && taskEnd > otherStart;
//       });

//       // Calculate the new horizontal offset based on the maximum offset of the overlapping tasks
//       const newOffset = 50 + // Starting position for the first task
//         Math.max(
//           0,
//           ...overlappingTasks.map((t) => {
//             const prevTaskGeom = prevGeometry.find((tg) => tg.id === t.id);
//             return prevTaskGeom ? prevTaskGeom.horizontalOffset + prevTaskGeom.width + 5 : 50;
//           })
//         );

//       return { ...taskGeom, horizontalOffset: newOffset };
//     })
//   );
// }

  // const calendarDayBody = () => {
  //   let dph = 4 //Divisions Per Hour
  //   const timeSlots = Array.from({ length: 24*dph }, (_, i) => {
  //     const hours = String(Math.floor(i/dph)).padStart(2, "0");
  //     const minutes = String((i % dph) * 60/dph).padStart(2, "0");
  //     return `${hours}:${minutes}`;
  //   });

  //   console.log(timeSlots)

  //   const dayTasks = tasks.filter(
  //     (task) => new Date(task.startDayTime).toDateString() === mode.day.toDateString()
  //   );

  //   return (
  //     <div className="day-container">

  //       {timeSlots.map((time) => {

  //         const [hours, minutes] = time.split(":");
  //         const isFullHour = minutes === "00"; // Check for full hour
  //         const isSixthHour = (parseInt(hours) % 6 === 0 && minutes === "00")

  //         return(
  //           <div key={time}
  //             className="time-container"
  //             style={{
  //             borderTop: isSixthHour
  //               ? "3px solid rgba(200, 100, 0, 0.6)" // Strong burnt orange
  //               : isFullHour
  //               ? "2px solid rgba(230, 150, 50, 0.4)" // Softer orange
  //               : "1px solid rgba(230, 170, 90, 0.2)" // Subtle tint
  //           }}
  //           >
  //             <span className="time-text" >
  //               {isFullHour ? time : ""}
  //             </span>
  //           </div>
  //         )})}

  //       {dayTasks.map((task, taskIndex) => {
  //         const taskStart = new Date(task.startDayTime);
  //         const taskEnd = new Date(task.endDayTime);
  //         const startIndex = taskStart.getHours() + taskStart.getMinutes() / 60;
  //         const endIndex = taskEnd.getHours() + taskEnd.getMinutes() / 60;
  //         const taskHeight = Math.max(endIndex - startIndex, 0) * 2;

  //         // const overlappingTasks = dayTasks.filter((t, index) => {
  //         //   const otherStart = new Date(t.startDayTime);
  //         //   const otherEnd = new Date(t.endDayTime);
  //         //   return taskStart <= otherEnd && taskEnd >= otherStart && taskIndex > index;
  //         // });

  //         const taskGeom = tasksGeometry.find((tg) => tg.id === task.id) || {
  //           width: 50,
  //           horizontalOffset: 0,
  //           overlaps: [],
  //           id: 0
  //         };

  //         return (
  //           <div
  //             key={taskIndex}
  //             className="task-container"
  //             style={{
  //               top: `${startIndex * 2}em`,
  //               height: `${taskHeight}em`,
  //               left: `${taskGeom.horizontalOffset}px`,
  //             }}
  //             onClick={() => {
  //               onTaskClick(task);
  //             }}
  //             ref={(el) => {
  //               if (el) {
  //                 taskRefs.current[task.id] = el;
  //                 setTaskGeometryWidth(task, el.offsetWidth);
  //                 setTaskOverlaps(task)
  //               }
  //             }}
  //           >
  //             <span>
  //               ({task.id}) - <strong>{format(task.startDayTime, "HH:mm")}</strong> to{" "}
  //               <strong>{format(task.endDayTime, "HH:mm")}</strong>: {task.taskName}
  //             </span>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };



  // ----- RETURN -------- //

  return (
    <>

      {/* HEADER */}
      <div className="card-container">
        <h1 style={{ margin: "0px 0px 0px 20px", textAlign: "left", display: "flex", gap: "40px", fontSize: "2em" }}>
          {/* Year Section */}
          <div style={{ display: "flex", width: "100px", alignItems: "center" }}>
            <span>{mode.day.getFullYear()}</span>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "30px", fontSize: "0.5em", alignItems: "center" }}>
              <span onClick={() => changeYear(+1)} style={{ cursor: "pointer" }}>+</span>
              <span onClick={() => changeYear(-1)} style={{ cursor: "pointer" }}>-</span>
            </div>
          </div>

          {/* Month Section with Fixed Width */}
          <div style={{ display: "flex", alignItems: "center"}}>
            <span onClick={() => setModeAsMonth()} style={{ width: "140px", textAlign: "center" }}>
              {monthNumberToLabelMap[mode.day.getMonth()]}
            </span>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px", fontSize: "0.5em", alignItems: "center" }}>
              <span onClick={() => changeMonth(+1)} style={{ cursor: "pointer" }}>+</span>
              <span onClick={() => changeMonth(-1)} style={{ cursor: "pointer" }}>-</span>
            </div>
          </div>
        </h1>
      </div>    

      {/* MONTHGRID */}
      <div className = "card-container">
        {mode.mode == "Month"? 
        <CalendarMonth mode={mode} tasks={tasks} onTaskClick={onTaskClick} setModeAsDay={setModeAsDay} onNewTaskClick={onNewTaskClick}/>
        : mode.mode == "Day"?
        <>
          <div key="dayHeader">
            <h2>
              <span onClick={()=>changeDay(-1)}> - </span>
              {format(mode.day, "dd/MM/yyyy")}
              <span onClick={()=>changeDay(+1)}> + </span>
            </h2>
          </div>
          <CalendarDay mode={mode} tasks={tasks} onTaskClick={onTaskClick} />
        </>
        :
        ""
        }
      </div>

      {/*MODAL*/}
      <div className={isOpen ? "modal-shown" : "modal-hidden"}>
        {
          <TaskFormModal
            key = {selectedTask.id}
            id = {selectedTask.id}
            closeModal={() => {
              resetSelectedTask();   // Clear the selected event
              closeModal();             // Close the modal
            }}
            triggerRender = {triggerRender}
            initialTask = {selectedTask}
          />
        }
      </div>
      
    </>

  );
};

export default CalendarGrid;



