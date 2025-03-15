import {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom'

import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getISOWeek } from "date-fns";
import { addDays, addMonths, addYears } from "date-fns";
import classNames from 'classnames'

import useFetch from "../../hooks/useFetch"
import useModal from "../../hooks/useModal"

import TaskInCalendar from "./TaskInCalendar"

import TaskModal from "./TaskModal"

// ---------------- UTILS -----------------------

function getWeek(i){

  // CORRIGINDO PARA A SEMANA COMEÇAR NO DOMINGO!
  if (i.getDay() == 0){
    return (getISOWeek(i)+1)
  }
  return (getISOWeek(i))
}

// ------------------------------

function CalendarGrid(){

  let navigate = useNavigate()

  const [mode, setMode] = useState({
    mode: "Month",
    param: null,
    day: new Date(Date.now())
  })

  const [tasks, setTasks] = useState([])


  // ------------------- CONTROLE DO FETCH ----------------

  const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/myTasks', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  // ----------------   CONTROLE DE MODAL ------------------

  const { isOpen, openModal, closeModal, toggleModal } = useModal()
  const [selectedTask, setSelectedTask] = useState<task>(null)
  const [newTask, setNewTask] = useState<boolean>(false)

  useEffect(() => {
    const handleClickOutModal = (event) => {
      if (event.target === document.getElementById('modalDiv')) {
        closeModal();
      }
    };

    window.addEventListener('click', handleClickOutModal);

    return () => window.removeEventListener('click', handleClickOutModal);
  }, [closeModal]);

  // ------------------ EVENT HANDLERS ---------------------------


  const onTaskClick = (task) => {
    setSelectedTask(task); // Set the clicked task as active
    openModal();
  }

  useEffect( () => {
    console.log(mode)
  }, [mode])


  // --------------------  MOVENDO DIAS/MÊS/ANO --------------------


  const monthNumberToLabelMap = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December',
  ]

  function changeDay(delta: int){
    setMode(prev =>{
      return({
        ...prev,
        day: addDays(prev.day, delta)
      })
    })
  }

  function changeMonth(delta: int){
    setMode(prev =>{
      return({
        ...prev,
        day: addMonths(prev.day, delta)
      })
    })
  }

  function changeYear(delta: int){
    setMode(prev =>{
      return({
        ...prev,
        day: addYears(prev.day, delta)
      })
    })
  }

  // -----------------------------------------------------

  const generateDayTasks = (date, tasks) =>
    tasks.filter(
      (task) => new Date(task.startDayTime).toDateString() === date.toDateString()
    )

  const DayContent = (date, dayTasks, selectedDay, onTaskClick) => {

    return(

      <div key={format(date, "dd-MM-yyyy")}
        className={classNames(
          [
            date.getMonth() === selectedDay.getMonth() ? "dayInMonthCal" : "dayOutMonthCal",
            "showCol",
            mode.mode != "Week" ? "showRow" : (mode.param === getWeek(date) ? "focusRow" : "hideRow"),
          ])}
      >

        <div className="dateTitle">
          <strong>{format(date, "dd/MM/yyyy")}</strong>
           <a onClick={() => {
              setNewTask(true)
              openModal(true)
            }}>          
              (+)
            </a>
        </div>
          
        <div className="dateContent">
          {(mode.mode == "Week" && mode.param != getWeek(date)) ? (
            dayTasks.length === 0 ? (
              ""
            ) : (
              <>
                {dayTasks.slice(0, 3).map(task => (
                  <div key={task.id}>
                    <TaskInCalendar task={task} onTaskClick={onTaskClick} />
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
                <div key={task.id}>
                  <TaskInCalendar task={task} onTaskClick={onTaskClick} />
                </div>
              ))
            )
          )}
        </div>    
      </div>

    )
  }


  // ------------------- CALENDAR ----------------------

  // -------------- CALENDAR HEAD ------------------

   const calendarHead = [
    // GRID HEADER
    <div key="week" className="weekNumber">
      <p> Week </p>
    </div>,

    ...["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((name, i) => (
      <div
        key={name}
        className={classNames("calHeader", "showCol")}
      >
        <div>{name}</div>
      </div>
    ))
  ];

  // --------------- CALENDAR BODY ----------------

  // PREPARANDO OS DADOS:

  const calendarBody = (() =>{

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
        const dayTasks = generateDayTasks(day, tasks)
        week.push({
          day: day,
          content: DayContent(day, dayTasks, mode.day, onTaskClick)});
        day = addDays(day, 1);
      }
      weeks.push({ weekNumber: getWeek(weekStart), days: week });
    }

    // PREPARANDO O HTML

    return weeks.map((week) => {

      return [
        // Week number div
        <div
          key={`weekNumber-${week.weekNumber}`}
          className={classNames([
            "weekNumber",
            mode.mode != "Week" ? "showRow" : (mode.param === week.weekNumber ? "focusRow" : "hideRow"),
          ])}
        >
          {week.weekNumber}
        </div>,

        // Map over days and return a div for each day
        ...week.days.map((day, index) => (
          <div key={`day-${index}`}>{day.content}</div>
        )),
      ];
    });

  })()

  return (
    <div>

      {/* HEADER */}
        
      <h1>
{/*      <a onClick= {() => changeDay(-1)}> (-) </a>
        <a> {mode.day.getDate()} </a>
        <a onClick= {() => changeDay(+1)}> (+) </a>*/}
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
            <TaskModal
              id = {selectedTask.id}
              closeModal={() => {
                setSelectedTask(null);   // Clear the selected event
                closeModal();             // Close the modal
              }}
              initialTask = {selectedTask}
            />
          </div>
        )}
        {newTask && (
          <div className="modal-content">
            <TaskModal
              closeModal={() => {
                setNewTask(false);        // Clear the selected event
                closeModal();             // Close the modal
              }}
            />
          </div>
        )}

      </div>
    
    
      <h4> Debug: 
        <a>
          {mode.mode} - {mode.param}
        </a>
      </h4>
      
    </div>

  );
};

export default CalendarGrid;
