import {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom'

import { format } from 'date-fns';
import classNames from 'classnames';

import useFetch from "../../hooks/useFetch"


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

function convertToLocalTime(dateStr) {
  const date = new Date(dateStr);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const localTime = new Date();
  localTime.setHours(hours, minutes, 0, 0);
  return localTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}


// ------------------------------

function CalendarGrid(){

  let navigate = useNavigate()

  const [calMode, setCalMode] = useState("Month") //Day, Week, Month
  const [dayHideShow, setDayHideShow] = useState([true, true, true, true, true, true, true]) //Day, Week, Month

  const [selectedDay, setSelectedDay]     = useState<number>(new Date(Date.now()))
  const [selectedWeek, setSelectedWeek]   = useState<number>(null)

  const [tasks, setTasks] = useState([])

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


  // ------------------ EVENT HANDLERS ---------------------------


  const handleClickWeek = (wkNumber: number) => {
    setCalMode("Week")
    toggleWeekExpansion(wkNumber)
  }

  const toggleWeekExpansion = (weekNumber: number) => {
    setSelectedWeek((prevWeek) => (prevWeek === weekNumber ? null : weekNumber));
  }

  const handleClickDay = (i: Date) => {
    console.log("Clicado em: " + i.toString())
  }

  const toggleColumn = (weekDay: number) => {
    const updatedDayHideShow = [...dayHideShow]
    updatedDayHideShow[weekDay] = !updatedDayHideShow[weekDay]
    setDayHideShow(updatedDayHideShow)
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

  const createDayCell = (date, dayTasks, weekNumber) => (

    <div id={date.toISOString()} key={format(date, "dd/MM/yyyy")}
      className={
        [
          date.getMonth() === selectedDay.getMonth() ? "dayInMonthCal" : "dayOutMonthCal",
          dayHideShow[date.getDay()] ? "showCol" : "hideCol",
          selectedWeek == null ? "showRow" : (selectedWeek === date.getWeek() ? "focusRow" : "hideRow"),
        ].join(' ')}
    >

      <div id="dateTitle" onClick={() => handleClickDay(date)}>
        {dayHideShow[date.getDay()] ? format(date, "dd/MM/yyyy") : format(date, "dd")}
      </div>
        
      <div id="dateContent">
        {(selectedWeek != date.getWeek() ? "("+dayTasks.length+")" :
          dayTasks.length == 0 ? "Dia Livre!" :
          dayTasks.map(task => (
          <div key={task.id}>
            {convertToLocalTime(task.startDayTime)}<br/>
            ({task.id}): {task.taskName} <br/>
            <br/>
          </div>)))}
      </div>

      <div id="dateButton" onClick={() => console.log("Voce quer adicionar tarefa do dia: " + format(date, "dd/MM/yyyy"))}>
        <a> (+) </a>
      </div>
    </div>

  )


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
        onClick={() => toggleColumn(i)}
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
            className={
            [
              "weekNumber",
              selectedWeek == null ? "showRow" : (selectedWeek === weekNumber ? "focusRow" : "hideRow"),
            ].join(' ')}
            onClick={() => handleClickWeek(weekNumber)}
          >
            {weekNumber}
          </div>
        )
      }

      //Dias    
      bodyGrid.push(createDayCell(date, dayTasks, weekNumber))

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

      {/*<h1> Calendar </h1>*/}
        
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
      </h1>
    
      <div className = "calendarGrid">
        {calendarHead}
        {calendarBody}
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
