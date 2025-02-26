import {useState} from "react";
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

function CalendarGrid(){

  let navigate = useNavigate()

  const [calMode, setCalMode] = useState("Month") //Day, Week, Month
  const [dayHideShow, setDayHideShow] = useState([true, true, true, true, true, true, true]) //Day, Week, Month

  let td = new Date()
  const [today, setToday] = useState<number>(new Date(td.getFullYear(),td.getMonth(),1))
  
  const [day, setDay]     = useState<number>(today.getDate())
  const [week, setWeek]   = useState<number>(today.getWeek())
  const [month, setMonth] = useState<number>(today.getMonth())
  const [year, setYear]   = useState<number>(today.getFullYear())

  console.log(day, week, month)

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

  }

  function handleClickDay(i: Date){

    console.log("me clicou u.U: " + i.toString())
    console.log(i)
    navigate("/calendar/" + i.getFullYear() +"/" + (i.getMonth()+1).toString().padStart(2, "0") + "/" + i.getDate().toString().padStart(2, "0"))
  }

  let calendarGrid = []

  for (var i=0; i<42; i++){

    let d = new Date(i*86400*1000+day1)

    //Colocando o dia da semana na primeira coluna
    if (d.getDay() == 0){
      calendarGrid.push(
        <div key={"Week_"+d.getWeek()} onClick={() => handleClickWeek(d.getWeek())}>
          {d.getWeek()}
        </div>
      )
    }

    if (d.getMonth() == month) {
      calendarGrid.push(
        <div key={dateStr(d)} className="dayInMonthCal">
          <div onClick={() => handleClickDay(d)}>
            {dateStr(d)}
          </div>

          <div onClick={() => console.log("Voce quer adicionar tarefa do dia: " + dateStr(d))}>
            <a> (+) </a>
          </div>
        </div>
      )
    } else {
      calendarGrid.push(
        <div key={dateStr(d)} className="dayOutMonthCal">

          <div onClick={() => handleClickDay(d)}>
             {dateStr(d)}
           </div>

           <div onClick={() => console.log("Voce quer adicionar tarefa do dia: " + dateStr(d))}>
             <a> (+) </a>
           </div>
         </div>
      )
    }
  }

  function toggleWeekDayHS(weekDay: number){
    console.log("To toglando")
    // let days = dayHideShow
    dayHideShow[weekDay] = !(dayHideShow[weekDay])

    setDayHideShow([...dayHideShow])
    console.log(dayHideShow)
  }

  // console.log(dayHideShow)

  return (
    <div>

      <h1> Calendar </h1>
      <h1>
        <a onClick={() => setMonth(month-1)}> (-) </a>
        <a> {monthNumberToLabelMap[month]} </a>
        <a onClick={() => setMonth(month+1)}> (+) </a>
        </h1>
      <h1>
        <a onClick={() => setYear(year-1)}> (-) </a>
        <a> {year} </a>
        <a onClick={() => setYear(year+1)}> (+) </a>
      </h1>
      <h2> State: {calMode}</h2>
      <h2> HideShow WeekDay: {"["+dayHideShow.toString()+"]"} </h2> 
      <h2>
        {day.toString().padStart(2, "0")}
        /{(month+1).toString().padStart(2, "0")}
        /{year} (Week: {week})
      </h2>
      {/*<h2> {monthNumberToLabelMap[calendarDate.getMonth()]} </h2>*/}
      <div className = "calendarGrid">
        <div key="week"> <p> Week </p> </div> 
        <div key="Dom" className="header" onClick={() => toggleWeekDayHS(0)}><p>D</p></div>
        <div key="Seg" className="header" onClick={() => toggleWeekDayHS(1)}><p>S</p></div>
        <div key="Ter" className="header" onClick={() => toggleWeekDayHS(2)}><p>T</p></div>
        <div key="Qua" className="header" onClick={() => toggleWeekDayHS(3)}><p>Q</p></div>
        <div key="Qui" className="header" onClick={() => toggleWeekDayHS(4)}><p>Q</p></div>
        <div key="Sex" className="header" onClick={() => toggleWeekDayHS(5)}><p>S</p></div>
        <div key="Sáb" className="header" onClick={() => toggleWeekDayHS(6)}><p>S</p></div>
        {calendarGrid}
      </div>
      
    </div>

  );
};

export default CalendarGrid;
