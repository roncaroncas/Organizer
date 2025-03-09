import {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom'

import { format } from 'date-fns'
import classNames from 'classnames'

import useFetch from "../../hooks/useFetch"
import useModal from "../../hooks/useModal"

import TaskInCalendar from "./TaskInCalendar"

import TaskModal from "./TaskModal"


// ---------------- UTILS -----------------------

// Extend Date prototype to get week number
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
Date.prototype.getWeek = function (dowOffset) {

    dowOffset = typeof(dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(this.getFullYear(),0,1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((this.getTime() - newYear.getTime() - 
    (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if(day < 4) {
        weeknum = Math.floor((daynum+day-1)/7) + 1;
        if(weeknum > 52) {
            var nYear = new Date(this.getFullYear() + 1,0,1);
            var nday = nYear.getDay() - dowOffset;
            nday = nday >= 0 ? nday : nday + 7;
            /*if the next year starts before the middle of
              the week, it is week #1 of that year*/
            weeknum = nday < 4 ? 1 : 53;
        }
    }
    else {
        weeknum = Math.floor((daynum+day-1)/7);
    }
    return weeknum;
};


// ------------------------------

function CalendarGrid(){

  let navigate = useNavigate()

  // const [calMode, setCalMode] = useState("Month") //Day, Week, Month
  const [dayHideShow, setDayHideShow] = useState([true, true, true, true, true, true, true]) //Day, Week, Month

  const [selectedDay, setSelectedDay]     = useState<number>(new Date(Date.now()))
  const [selectedWeek, setSelectedWeek]   = useState<number>(null)

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

  useEffect(() => {
    const handleClickOutModal = (event) => {
      if (event.target === document.getElementById('modalDiv')) {
        closeModal();
      }
    };

    window.addEventListener('click', handleClickOutModal);

    return () => window.removeEventListener('click', handleClickOutModal);
  }, [closeModal]);

  const [newTask, setNewTask] = useState<boolean>(false)


  // ------------------ EVENT HANDLERS ---------------------------


  const handleClickWeekRow = (weekNumber: number) => {
    setSelectedWeek((prevWeek) => (prevWeek === weekNumber ? null : weekNumber))
  }

  const handleClickWeekColumn = (weekDay: number) =>
    setDayHideShow(prev => prev.map((day, index) => index === weekDay ? !day : day))

  const handleClickDay = (i: Date) => {
    console.log("Clicado em: " + i.toString())}

  const onTaskClick = (task) => {
    setSelectedTask(task); // Set the clicked task as active
    console.log(task)
    openModal();
    // FAZER FUNÇÃO PARA ATUALIZAR VALUES DO FORMS
    console.log("clicou a task: "+task.id)
  }


  // --------------------  MOVENDO DIAS/MÊS/ANO --------------------


  const monthNumberToLabelMap = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December',
  ]

  function changeDay(delta: int){
    setSelectedDay((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate()+delta))
    setSelectedWeek(null)
  }

  function changeMonth(delta: int){
    setSelectedDay((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth()+delta, prevDate.getDate()))
    setSelectedWeek(null)
  }

  function changeYear(delta: int){
    setSelectedDay((prevDate) => new Date(prevDate.getFullYear()+delta, prevDate.getMonth(), prevDate.getDate()))
    setSelectedWeek(null)
  }

  // -----------------------------------------------------

  const generateDayTasks = (date, tasks) =>
    tasks.filter(
      (task) => new Date(task.startDayTime).toDateString() === date.toDateString()
    )

  const DayCell = (date, dayTasks, selectedDay, selectedWeek, dayHideShow, handleClickDay, onTaskClick) => {

    const weekNumber = date.getWeek()  

    return(

      <div key={format(date, "dd/MM/yyyy")}
        className={classNames(
          [
            date.getMonth() === selectedDay.getMonth() ? "dayInMonthCal" : "dayOutMonthCal",
            dayHideShow[date.getDay()] ? "showCol" : "hideCol",
            selectedWeek == null ? "showRow" : (selectedWeek === date.getWeek() ? "focusRow" : "hideRow"),
          ])}
      >

        <div id="dateTitle" onClick={() => handleClickDay(date)}>
          <strong>{dayHideShow[date.getDay()] ? format(date, "dd/MM/yyyy") : format(date, "dd")}</strong>
        </div>
          
        <div id="dateContent">
          {selectedWeek !== date.getWeek() ? (
            dayTasks.length === 0 ? (
              "Dia Livre!"
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
              "Dia Livre!"
            ) : (
              dayTasks.map(task => (
                <div key={task.id}>
                  <TaskInCalendar task={task} onTaskClick={onTaskClick} />
                </div>
              ))
            )
          )}
        </div>

        


        <div id="dateButton" onClick={() => console.log("Voce quer adicionar tarefa do dia: " + format(date, "dd/MM/yyyy"))}>
          <a> (+) </a>
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
        onClick={() => handleClickWeekColumn(i)}
        className={classNames("calHeader", dayHideShow[i] ? "showCol" : "hideCol")}
      >
        <div>{name}</div>
      </div>
    ))
  ];


  // -----------CALENDAR BODY-----------------

  const calendarBody = (() =>{

    let bodyGrid = []

    // Primeiro dia que aparece no calendário do mês
    const day1 = new Date(
      selectedDay.getFullYear(),
      selectedDay.getMonth(),
      1 - new Date(selectedDay.getFullYear(), selectedDay.getMonth(), 1).getDay()
    );

    let i = 0
    let date = new Date(day1)

    while (
      date.getDay()!=0 || 
      date.getMonth() == selectedDay.getMonth() ||
      (date.getMonth() + 1) % 12 == selectedDay.getMonth()
      ){

      //FILTRANDO AS TAREFAS QUE POSSUEM o STARTDATE IGUAL AO DIA date
      const dayTasks = generateDayTasks(date, tasks)
      const weekNumber = date.getWeek()
      
      //Week number (Coluna a Esquerda)
      if (date.getDay() == 0){
        bodyGrid.push(
          <div
            key={"Week_"+weekNumber}
            className={classNames([
              "weekNumber",
              selectedWeek == null ? "showRow" : (selectedWeek === weekNumber ? "focusRow" : "hideRow"),
            ])}
            onClick={() => handleClickWeekRow(weekNumber)}
          >
            {weekNumber}
          </div>
        )
      }

      //Dias    
      bodyGrid.push(DayCell(date, dayTasks, selectedDay, selectedWeek, dayHideShow, handleClickDay, onTaskClick))

      // Iterando 
      i++
      date = new Date(
        day1.getFullYear(),
        day1.getMonth(),
        day1.getDate()+i)
    }

    return (bodyGrid)

  })()

  return (
    <div>

      {/* HEADER */}
        
      <h1>
        <a onClick= {() => changeDay(-1)}> (-) </a>
        <a> {selectedDay.getDate()} </a>
        <a onClick= {() => changeDay(+1)}> (+) </a>
        <a onClick= {() => changeMonth(-1)}> (-) </a>
        <a> {monthNumberToLabelMap[selectedDay.getMonth()]} </a>
        <a onClick= {() => changeMonth(+1)}> (+) </a>
        <a onClick= {() => changeYear(-1)}> (-) </a>
        <a> {selectedDay.getFullYear()} </a>
        <a onClick= {() => changeYear(+1)}> (+) </a>
        <button onClick={() => {
          setNewTask(true)
          openModal(true)
        }}>
        
          Novo Evento
        </button>
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
          {selectedDay.toString().padStart(2, "0")}
          /{(selectedDay.getMonth()+1).toString().padStart(2, "0")}
          /{selectedDay.getFullYear()} (Week: {selectedWeek})
        </a>
      </h4>
      
    </div>

  );
};

export default CalendarGrid;
