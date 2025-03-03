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

  let td = new Date()
  const [today, setToday] = useState<number>(new Date(td.getFullYear(),td.getMonth(),1))
  
  const [day, setDay]     = useState<number>(today.getDate())
  const [week, setWeek]   = useState<number>(null)
  const [month, setMonth] = useState<number>(today.getMonth())
  const [year, setYear]   = useState<number>(today.getFullYear())

  const [hiddenWeeks, setHiddenWeeks] = useState({})
  const [tasks, setTasks] = useState([])

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


  console.log(day, week, month)
  // tasks.map(task => console.log(task))

  /////////////Calendar GRID ///////////////////////////

  //// MONTH SELECTOR ////

  // const [calendarDate, setCalendarDate] = useState<number>(new Date())

  let day1 = new Date(year, month, day) 
  day1 = day1 - 86400*1000*day1.getDay()

  const monthNumberToLabelMap = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December',
  ]

  function handleClickWeek(wkNumber: number){
    setCalMode("Week")
    console.log("estou na semana "+wkNumber.toString())
    toggleRow(wkNumber)

  }

  function handleClickDay(i: Date){

    console.log("me clicou u.U: " + i.toString())
    console.log(i)
    // navigate("/calendar/" + i.getFullYear() +"/" + (i.getMonth()+1).toString().padStart(2, "0") + "/" + i.getDate().toString().padStart(2, "0"))
  }

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

    const d = new Date(i * 86400 * 1000 + day1);

    //Week number (Coluna a Esquerda)
    if (d.getDay() == 0){
      calendarGrid.push(
        <div
          key={"Week_"+d.getWeek()}
          className={
          [
            "weekNumber",
            // hiddenWeeks[d.getWeek()] ? "hideRow" : "showRow",
            week == null ? "showRow" : (week === d.getWeek() ? "focusRow" : "hideRow"),
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
            d.getMonth() === month ? "dayInMonthCal" : "dayOutMonthCal",
            dayHideShow[d.getDay()] ? "showCol" : "hideCol",
            week == null ? "showRow" : (week === d.getWeek() ? "focusRow" : "hideRow"),
          ].join(' ')}
      >

        <div id="dateTitle" onClick={() => handleClickDay(d)}>
          {dayHideShow[d.getDay()] ? dateStr(d) : dateStr(d).substring(0,2)}
        </div>
          
        <div id="dateContent">
          {(week != d.getWeek() ? "("+dayTasks.length+")" :
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

  function toggleColumn(weekDay: number){
    console.log("To toglando coluna")

    const updatedDayHideShow = [...dayHideShow];
    updatedDayHideShow[weekDay] = !updatedDayHideShow[weekDay];

    setDayHideShow(updatedDayHideShow);
    console.log("Updated dayHideShow state:", updatedDayHideShow);

  }

  const toggleWeekExpansion = (weekNumber) => {
    setWeek((prevWeek) => (prevWeek === weekNumber ? null : weekNumber));
  };

  return (
    <div>

      <h1> Calendar </h1>
      <h1>
        <a onClick={() => setMonth(month-1)}> (-) </a>
        <a> {monthNumberToLabelMap[month]} </a>
        <a onClick={() => setMonth(month+1)}> (+) </a>
        <a onClick={() => setYear(year-1)}> (-) </a>
        <a> {year} </a>
        <a onClick={() => setYear(year+1)}> (+) </a>
      </h1>
      <h2>
        {day.toString().padStart(2, "0")}
        /{(month+1).toString().padStart(2, "0")}
        /{year} (Week: {week})
      </h2>

      <div className = "calendarGrid">
        {calendarGrid}
      </div>
      
    </div>

  );
};

export default CalendarGrid;
