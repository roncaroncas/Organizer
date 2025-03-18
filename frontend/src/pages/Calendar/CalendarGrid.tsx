import { useState, useEffect, useMemo } from "react";
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
  useEffect(() => {
    console.log("Re-rendering CalendarGrid");
    console.log("tasks:", tasks);
    console.log("mode:", mode);
  }, [tasks, mode]);

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
    if (data && data.length !== tasks.length) {
      setTasks(data);
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
    console.log(day)
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

// function changeDay(delta: number) {
//   setMode((prev) => {
//     return {...prev, day: addDays(prev.day, delta)}
//   });
// }

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

  const calendarDayBody = () => {

    const timeSlots = Array.from({ length: 24+1 }, (_, i) => {
      const hours = String(Math.floor(12* i / 12)).padStart(2, "0");
      const minutes = String((0* i % 12) * 5).padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    console.log(timeSlots)

    const dayTasks = tasks.filter(
      (task) => new Date(task.startDayTime).toDateString() === mode.day.toDateString()
    );


    return(
     <div>
      <div className = "dateTitle">
        <h2>{mode.mode + " - " + format(mode.day, "dd/MM/yyyy")}</h2>
      </div>
      <div className="dateContent">
        {timeSlots.map((time, index) => {
          return(
          <div key={time} className="card-container">
            <strong>{time}</strong>

            {dayTasks.filter(task => {
              const taskTime = format(new Date(task.startDayTime), "HH:mm");

              return taskTime >= time && taskTime < timeSlots[timeSlots.indexOf(time) + 1];
            }).map((task, index) => (
              <div key={index} className="card-container">
                ({task.id}) - <strong>{format(task.startDayTime, "HH:mm")}</strong>: {task.taskName}
              </div>
            ))}
          </div>
          )
        })}
      </div>
    </div>
    )
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

        {selectedTask && (
          <div className="modal-content">
            <TaskFormModal
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
