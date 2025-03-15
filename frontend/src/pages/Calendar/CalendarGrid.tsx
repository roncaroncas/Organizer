import { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getISOWeek } from "date-fns";
import { addDays, addMonths, addYears } from "date-fns";
import classNames from 'classnames';

import useFetch from "../../hooks/useFetch";
import useModal from "../../hooks/useModal";

import TaskFormModal from "./TaskFormModal";


interface ModeState {
  mode: "Month" | "Week" | "Day"
  param: number | null
  day: Date | null
}

// ---------------- UTILS -----------------------

function getWeek(i) {
  return (i.getDay() === 0) ? getISOWeek(i) + 1 : getISOWeek(i);
}

function CalendarGrid(){

  let navigate = useNavigate()

  const [mode, setMode] = useState<ModeState>({
    mode: "Month",
    param: null,
    day: new Date(Date.now())
  })

  const [tasks, setTasks] = useState([])

  // --------------- DEBUG ------------------------ //
  // useEffect(() => {
  //   console.log("Re-rendering CalendarGrid");
  //   console.log("tasks:", tasks);
  //   console.log("mode:", mode);
  // }, [tasks, mode]);


  // ------------------- FETCHES ---------------- //

  const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/myTasks', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    fetchData();    
  }, []); // Fetch once when tasks are empty

  // Update tasks only if data changes (to avoid unnecessary re-renders)
  useEffect(() => {
    if (data && data.length !== tasks.length) {
      setTasks(data);
    }
  }, [data]); // Depend only on tasks length

  // ----------------   CONTROLE DE MODAL ------------------

  const { isOpen, openModal, closeModal, toggleModal } = useModal()
  const [selectedTask, setSelectedTask] = useState<task>(null)

  useEffect(() => {
    const handleClickOutModal = (event) => {
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

  // ------------------ EVENT HANDLERS ---------------------------


  const onTaskClick = (task) => {
    console.log(task)
    setSelectedTask(task)
    openModal();
  }

  const onNewTaskClick = (day) => {
    let task = {
        endDayTime : day,
        fullDay: false,
        id: null,
        place :"",
        startDayTime: day,
        status :"",
        taskDescription :"",
        taskName :"",
    }

    setSelectedTask(task)
    openModal(true)
  }

  // --------------------  MOVENDO DIAS/MÊS/ANO --------------------


  const DayContent = (day, dayTasks, mode, onTaskClick) => {

    return([

        <div key="dateTitle" className="dateTitle">
          <strong>{format(day, "dd/MM/yyyy")}</strong>
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



  // ------------------- CALENDAR ----------------------

  // -------------- CALENDAR HEAD ------------------

   const calendarHead = [
    // GRID HEADER
    <div key="weekHeader" className="weekNumber">
      <p> Week </p>
    </div>,

    ...["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((name, i) => (
      <div
        key={"weekHeader"+name}
        className={classNames("calHeader", "showColumn")}
      >
        <p>{name}</p>
      </div>
    ))
  ];

  // --------------- CALENDAR BODY ----------------

  // PREPARANDO OS DADOS:


// Inside your CalendarGrid component:

const calendarBody = useMemo(() => {

  // console.log("Recalculating calendar body...");

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
        content: DayContent(day, dayTasks, mode, onTaskClick),
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

  return (
    <>

      {/* HEADER */}
        
      <h1>
        <a onClick= {() => changeMonth(-1)}> (-) </a>
        <a> {monthNumberToLabelMap[mode.day.getMonth()]} </a>
        <a onClick= {() => changeMonth(+1)}> (+) </a>
        <a onClick= {() => changeYear(-1)}> (-) </a>
        <a> {mode.day.getFullYear()} </a>
        <a onClick= {() => changeYear(+1)}> (+) </a>
      </h1>
    
      {/* GRID */}
      <div className = "calendarGrid">
        {calendarHead}
        {calendarBody}
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
                setSelectedTask(null);   // Clear the selected event
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
