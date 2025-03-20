import { useState, useEffect, useMemo, useRef } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getISOWeek } from "date-fns";
import { addDays, addMonths, addYears } from "date-fns";
import classNames from 'classnames';

import useFetch from "../../hooks/useFetch";
import useModal from "../../hooks/useModal";

import TaskFormModal from "./TaskFormModal";

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

// ---------------- UTILS -----------------------

function getWeek(i: Date) {
  return (i.getDay() === 0) ? getISOWeek(i) + 1 : getISOWeek(i);
}

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
      console.log("Atualizei o bagui")
    }
  }, [data]);

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

  function setModeAsDay (day: date):void {
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
    console.log("task clicqued")
    console.log(task)
    setSelectedTask(task)
    openModal();
  }

  const onNewTaskClick = (day: Date) => {
    let task = {
        endDayTime : day,
        fullDay: false,
        id: 0,
        place :"",
        startDayTime: day,
        status :"",
        taskDescription :"",
        taskName :"",
    }

    setSelectedTask(task)
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


  const DayInMonthContent = (day: Date, dayTasks: Task[], mode: ModeState, onTaskClick: OnTaskClick) => {

    return([

        <div key="dateTitle" className="dateTitle">
          <a onClick={() => setModeAsDay(day)}> 
            <strong>
              {format(day, "dd/MM/yyyy")}
            </strong>
          </a>
         <a onClick={() => {
            onNewTaskClick(day)
          }}>          
            (+)
          </a>
        </div>,
          

        <div key="dateContent" className="dateContent">
          {(mode.mode == "Week" && mode.param != getWeek(day)) ? (
            dayTasks.length === 0 ? (
              ""
            ) : (
              <>
                {dayTasks.slice(0, 3).map(task => (
                  <div key={"task__"+ task.id} className="calendarTask">
                    {format(task.startDayTime, "HH:mm")}
                    <span
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => onTaskClick(task)}
                    >        
                      ({task.id}): {task.taskName}
                    </span>

                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div>+{dayTasks.length - 3} more</div>
                )}
              </>
            )
          ) : (
            dayTasks.length === 0 ? (
              ""
            ) : (
              dayTasks.map(task => (
                <div key={"task__"+ task.id} className="calendarTask">
                  {format(task.startDayTime, "HH:mm")}
                  <a
                    href="#"
                    onClick={() => onTaskClick(task)}
                  >        
                    ({task.id}): {task.taskName}
                  </a>

                </div>
              ))
            )
          )}
        </div>    
    ]

    )
  }

  const monthNumberToLabelMap = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December',
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



  // ------------------- CALENDAR MONTH ----------------------

  // -------------- CALENDAR HEAD ------------------

const calendarMonthHead = [
  // GRID HEADER
  <div key="weekHeader" className="weekNumber">
    <p> Week </p>
  </div>,

  ...["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((name) => (
    <div
      key={"weekHeader"+name}
      className={classNames("calHeader", "showColumn")}
    >
      <p>{name}</p>
    </div>
  ))
];

  // --------------- CALENDAR BODY ----------------


// Inside your CalendarGrid component:

const calendarMonthBody = useMemo(() => {

  const monthStart = startOfMonth(mode.day);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const weeks = [];
  let day = startDate;

  while (day <= endDate) {
    const weekStart = day;
    const week = [];

    for (let i = 0; i < 7; i++) {
      const dayTasks = tasks.filter(
        (task) => new Date(task.startDayTime).toDateString() === day.toDateString()
      );
      week.push({
        day: day,
        content: DayInMonthContent(day, dayTasks, mode, onTaskClick),
      });
      day = addDays(day, 1);
    }
    weeks.push({ weekNumber: getWeek(weekStart), days: week });
  }

  return weeks.map((week) => {
    const weekKey = format(week.days[0].day, "yyyy-MM-dd")
    return [
      // Week number div
      <div
        key={weekKey}
        className={classNames([
          "weekNumber",
          mode.mode !== "Week" ? "showRow" : mode.param === week.weekNumber ? "focusRow" : "hideRow",
        ])}
      >
        {week.weekNumber}
      </div>,

      
      // Map over days and return a div for each day
      ...week.days.map((day) => {
        return(

        <div
          key={format(day.day, "yyyyMMdd").toString()}
          id={format(day.day, "yyyyMMdd").toString()}

          className={classNames([
            "showColumn",
            "showRow",
            day.day.getMonth() === mode.day.getMonth() ? "dayInMonthCal" : "dayOutMonthCal",
          ])}

          onClick={(e) => {
            if (e.target === e.currentTarget) {onNewTaskClick(day.day)}
          }}
        >
          {day.content}
        </div>
      )}),
    ];
  });
}, [mode.day, tasks]); // Only re-calculate when mode.day or tasks change


  // ------ CALENDAR DAY ------- //

  const calendarDayHeader = [
    <div key="dayHeader">
      <h2>
        <span onClick={()=>changeDay(-1)}> (-) </span>
        {format(mode.day, "dd/MM/yyyy")}
        <span onClick={()=>changeDay(+1)}> (+) </span>
      </h2>
    </div>
  ]

  const taskRef = useRef(null);
  const [taskRightPos, setTaskRightmostPositions] = useState({});

  const onTaskRendered = (taskId, rightmostPosition) => {
    if (taskRightPos[taskId] != rightmostPosition) {
      // console.log(taskId, taskRightPos[taskId], rightmostPosition, "me chamaram de novo puts")
      setTaskRightmostPositions((prevState) => ({
        ...prevState,
        [taskId]: rightmostPosition, // Store the rightmost position
      }));
    }
  };

  const calendarDayBody = () => {

    // TODO: CORRIGIR O BUG QUE QUEBRA QUANDO UM EVENTO ACABA EM HORARIO CHEIO E O OUTRO COMEÇA NO MESMO HORARIO CHEIO
    // NAO FAÇO IDEIA DO PORQUE kkkkkkkkkk

    const timeSlots = Array.from({ length: 24 }, (_, i) => {
      const hours = String(Math.floor(12* i / 12)).padStart(2, "0");
      const minutes = String((0* i % 12) * 5).padStart(2, "0");
      return `${hours}:${minutes}`;
    });


    const dayTasks = tasks.filter(
      (task) => new Date(task.startDayTime).toDateString() === mode.day.toDateString()
    );


  return (
    <div className="day-container">
      {timeSlots.map((time, index) => {
        
        // Filter tasks that span this specific time slot
        const tasksStartsInTime = dayTasks.filter(task => {
          const taskStart = new Date(task.startDayTime);
          // const taskEnd = new Date(task.endDayTime);
          const timeSlotStart = new Date(`${mode.day.toDateString()} ${time}`);
          const timeSlotEnd = new Date(timeSlotStart.getTime() + 60 * 60 * 1000); // 1 hour slot
          return taskStart <= timeSlotEnd && taskStart > timeSlotStart;
        });

        const tasksInTime = dayTasks.filter(task => {
          const taskStart = new Date(task.startDayTime);
          const taskEnd = new Date(task.endDayTime);
          const timeSlotStart = new Date(`${mode.day.toDateString()} ${time}`);
          const timeSlotEnd = new Date(timeSlotStart.getTime() + 60 * 60 * 1000); // 1 hour slot
          return taskStart <= timeSlotEnd && taskStart > timeSlotStart;
        });

        console.log(time, tasksStartsInTime)


        return (
          <div key={time} className="hour-container">
            <strong>{time}</strong>
            {tasksStartsInTime.map((task, taskIndex) => {

              // Calculate the start and end hour indexes
              const taskStart = new Date(task.startDayTime);
              const taskEnd = new Date(task.endDayTime);

              const startIndex = taskStart.getHours()+taskStart.getMinutes()/60; // Start hour
              const endIndex = taskEnd.getHours()+taskEnd.getMinutes()/60; // End hour

              const taskHeight = Math.max((endIndex - startIndex),1) * 2; // Estimate height in 'em' based on hours spanned

              const overlappingTasks = tasksInTime.filter((t) => {
                const otherStart = new Date(t.startDayTime);
                const otherEnd = new Date(t.endDayTime);
                return taskStart < otherEnd && taskEnd > otherStart; // Check if times overlap
              });

              console.log(task.id, overlappingTasks)

              // Calculate dynamic left offset based on previous tasks' widths
              const horizontalOffset = taskIndex === 0 
                ? 100 // Starting position for the first task (you can adjust this)
                : Math.max(
                    100, // Starting position for the first task (you can adjust this)
                    ...overlappingTasks.filter((t, index) => index < taskIndex).map(t => {
                      // Get the width of each previous overlapping task
                      const previousTaskWidth = taskRightPos[t.id] || 50; // Use previously calculated width

                      // Calculate the `left` position based on the previous task's width and spacing
                      return previousTaskWidth + 5; // Add spacing between tasks
                    })
                  );

              return (
                <div
                  key={taskIndex}
                  className="task-container"
                  style={{
                    // Position the task based on start time
                    top: `${(startIndex - index) * 2}em`, // Adjusts task starting position vertically
                    height: `${taskHeight}em`, // Adjusts the task's vertical span
                    left: `${horizontalOffset}px`, // Shift horizontally to prevent overlap
                  }}
                  onClick = {() => {onTaskClick(task)}}
                  ref={(ref) => {
                    if (ref) {
                      // Calculate the rightmost position (left + width)
                      const rightmostPosition = ref.offsetLeft + ref.offsetWidth;

                      // Call your function to store or use the rightmost position
                      onTaskRendered(task.id, rightmostPosition);
                    }
                  }}
                >
                  <span >
                  ({task.id}) - <strong>{format(task.startDayTime, "HH:mm")} </strong>
                  to <strong>{format(task.endDayTime, "HH:mm")}</strong>: {task.taskName}
                  </span>
                </div>

              );
            })}
          </div>
        );
      })}
    </div>
  );
}
  



  // ----- RETURN -------- //

  return (
    <>

      {/* HEADER */}
      <div className="card-container">
        <h1>
          <span onClick= {() => changeMonth(-1)}> (-) </span>
          <span onClick= {() => setModeAsMonth()}> {monthNumberToLabelMap[mode.day.getMonth()]} </span>
          <span onClick= {() => changeMonth(+1)}> (+) </span>
          <span onClick= {() => changeYear(-1)}> (-) </span>
          <span> {mode.day.getFullYear()} </span>
          <span onClick= {() => changeYear(+1)}> (+) </span>
        </h1>
      </div>
    

      {/* MONTHGRID */}
      <div className = "card-container">
        {mode.mode == "Month"? 
        <div className = "calendarGrid">
          {calendarMonthHead}
          {calendarMonthBody}
        </div>
        : mode.mode == "Day"?
        <div>
          {calendarDayHeader}
          {calendarDayBody()}
        </div>
        :

        ""
        }
      </div>



      {/*MODAL*/}
      <div 
      className={classNames(["calendarModal",
          isOpen ? "modal-shown" : "modal-hidden",
        ])}>

        {selectedTask.id != 0 && (
          <div className="modal-content">
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
          </div>
        )}
      </div>
    
    
      <h4> Debug: 
        <a>
          {mode.mode} - {mode.param}
        </a>
      </h4>
      
    </>

  );
};

export default CalendarGrid;
