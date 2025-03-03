import {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom'

Date.prototype.getWeek = function (dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

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

function dateStr(date){
  return(
    date.getDate().toString().padStart(2, "0") + "/" +
    (date.getMonth()+1).toString().padStart(2, "0")  + "/" +
    date.getFullYear().toString()
  )
}

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
function CalendarGrid(){

  let navigate = useNavigate()

  const [calMode, setCalMode] = useState("Month") //Day, Week, Month
  const [dayHideShow, setDayHideShow] = useState([true, true, true, true, true, true, true]) //Day, Week, Month

  const [selectedDay, setSelectedDay]     = useState<number>(new Date(Date.now()))
  const [selectedWeek, setSelectedWeek]   = useState<number>(null)

  const [hiddenWeeks, setHiddenWeeks] = useState({})
  const [tasks, setTasks] = useState([])

  // const [calendarGrid, setCalendarGrid] = useState("")

  useEffect(() => {
    fetch('http://localhost:8000/myTasks', {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
      });
  }, []);


  /////////////Calendar GRID ///////////////////////////

  const monthNumberToLabelMap = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December',
  ]

  function handleClickWeek(wkNumber: number){
    setCalMode("Week")
    toggleRow(wkNumber)
    // console.log("estou na semana "+wkNumber.toString())
  }

  const toggleWeekExpansion = (weekNumber) => {
    setSelectedWeek((prevWeek) => (prevWeek === weekNumber ? null : weekNumber));
  };

  function handleClickDay(i: Date){
    console.log("me clicou u.U: " + i.toString())
    console.log(i)
    // navigate("/calendar/" + i.getFullYear() +"/" + (i.getMonth()+1).toString().padStart(2, "0") + "/" + i.getDate().toString().padStart(2, "0"))
  }

  function toggleColumn(weekDay: number){
    const updatedDayHideShow = [...dayHideShow];
    updatedDayHideShow[weekDay] = !updatedDayHideShow[weekDay];
    setDayHideShow(updatedDayHideShow);
    // console.log("To toglando coluna")
  }


  // MOVENDO DIAS/MÊS/ANO

  function lastDay(){
    console.log("antes dia!")
    setSelectedDay((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate()-1))
  }

  function nextDay(){
    console.log("proximo dia!")
    setSelectedDay((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate()+1))
  }


  function lastMonth(){
    console.log("antes mes!")
    setSelectedDay((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth()-1, prevDate.getDate()))
  }

  function nextMonth(){
    console.log("proximo mes!")
    setSelectedDay((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth()+1, prevDate.getDate()))
  }

  function lastYear(){
    console.log("antes ano!")
    setSelectedDay((prevDate) => new Date(prevDate.getFullYear()-1, prevDate.getMonth(), prevDate.getDate()))
  }

  function nextYear(){
    console.log("proximo ano!")
    setSelectedDay((prevDate) => new Date(prevDate.getFullYear()+1, prevDate.getMonth(), prevDate.getDate()))
  }


  // ----------------------------

  const dayDifference = selectedDay.getDate() - selectedDay.getDay();

  let day1 = new Date(
    selectedDay.getFullYear(),
    selectedDay.getMonth(),
    dayDifference <= 1 ? dayDifference : dayDifference - 7)


  // ---------- GRID ------------

  useEffect(() => {
    // updateCalendarGrid(selectedDay);
    console.log("trifou o use uefeito")
  }, [selectedDay]);

  let calendarGrid = []

  // HEAD

  calendarGrid.push(<div key="week" className="weekNumber"> <p> Week </p> </div>);

  const weekNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  weekNames.forEach((name, i) => {
    calendarGrid.push(
      <div key={name}
        onClick={() => toggleColumn(i)}
        className={[
          "calHeader",
          dayHideShow[i] ? "showCol" : "hideCol",
        ].join(' ')}
      >
        <div>{name}</div>
      </div>
    );
  });

  // BODY
  for (let i=0; i<42; i++){

    const d = new Date(
      day1.getFullYear(),
      day1.getMonth(),
      day1.getDate()+i)


    //Week number (Coluna a Esquerda)
    if (d.getDay() == 0){
      calendarGrid.push(
        <div
          key={"Week_"+d.getWeek()}
          className={
          [
            "weekNumber",
            // hiddenWeeks[d.getWeek()] ? "hideRow" : "showRow",
            selectedWeek == null ? "showRow" : (selectedWeek === d.getWeek() ? "focusRow" : "hideRow"),
          ].join(' ')}
          onClick={() => toggleWeekExpansion(d.getWeek())}
        >
          {d.getWeek()}
        </div>
      )
    }

    //Dias

    //FILTRANDO AS TAREFAS QUE POSSUEM o STARTDATE IGUAL AO DIA d
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.startDayTime)
      // if (taskDate.toDateString() === d.toDateString()){
      //   console.log (d, taskDate.toDateString(), d.toDateString())
      // }
      return taskDate.toDateString() === d.toDateString()
    })
    
    calendarGrid.push(
      <div id={d.toISOString()} key={dateStr(d)}
        className={
          [
            d.getMonth() === selectedDay.getMonth() ? "dayInMonthCal" : "dayOutMonthCal",
            dayHideShow[d.getDay()] ? "showCol" : "hideCol",
            selectedWeek == null ? "showRow" : (selectedWeek === d.getWeek() ? "focusRow" : "hideRow"),
          ].join(' ')}
      >

        <div id="dateTitle" onClick={() => handleClickDay(d)}>
          {dayHideShow[d.getDay()] ? dateStr(d) : dateStr(d).substring(0,2)}
        </div>
          
        <div id="dateContent">
          {(selectedWeek != d.getWeek() ? "("+dayTasks.length+")" :
            dayTasks.length == 0 ? "Dia Livre!" :
            dayTasks.map(task => (
            <div key={task.id}>
              {convertToLocalTime(task.startDayTime)}<br/>
              ({task.id}): {task.taskName} <br/>
              <br/>
            </div>)))}
        </div>

        <div id="dateButton" onClick={() => console.log("Voce quer adicionar tarefa do dia: " + dateStr(d))}>
          <a> (+) </a>
        </div>
      </div>
    );
  }

  return (
    <div>

      {/*<h1> Calendar </h1>*/}
        
      <h1>
        <a onClick= {lastDay}> (-) </a>
        <a> {selectedDay.getDate()} </a>
        <a onClick= {nextDay}> (+) </a>
        <a onClick= {lastMonth}> (-) </a>
        <a> {monthNumberToLabelMap[selectedDay.getMonth()]} </a>
        <a onClick= {nextMonth}> (+) </a>
        <a onClick= {lastYear}> (-) </a>
        <a> {selectedDay.getFullYear()} </a>
        <a onClick= {nextYear}> (+) </a>
      </h1>
    
      <div className = "calendarGrid">
        {calendarGrid}
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
