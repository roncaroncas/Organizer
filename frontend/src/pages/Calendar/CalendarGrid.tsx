import {useState} from "react";
import {useNavigate} from 'react-router-dom'

function CalendarGrid(){

  let navigate = useNavigate()

  /////////////Calendar GRID ///////////////////////////

  //// MONTH SELECTOR ////

  const [calendarDate, setCalendarDate] = useState<number>(new Date())

  let day1 = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 0)
  day1 = day1 - 86400*1000*day1.getDay()

  const monthNumberToLabelMap = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]


  function dateStr(date){
    return(
      date.getDate().toString().padStart(2, "0") + "/" +
      (date.getMonth()+1).toString().padStart(2, "0")  + "/" +
      date.getFullYear().toString()
    )
  }

  function handleClickDay(i: Date){

    console.log("me clicou u.U: " + i.toString())
    console.log(i)
    navigate("/calendar/" + i.getFullYear() +"/" + (i.getMonth()+1).toString().padStart(2, "0") + "/" + i.getDate().toString().padStart(2, "0"))
  }

  let calendarGrid = Array.from(Array(42).keys()).map(function (i){

    let d = new Date(i*86400*1000+day1)  
    let dStr = dateStr(d)

    if (d.getMonth() == calendarDate.getMonth()) {

      return (        
        <div key={dateStr(d)} className="dayInMonthCal">

          <div onClick={() => handleClickDay(d)}>
            {dStr}
          </div>

          <div onClick={() => console.log("Voce quer adicionar tarefa do dia: " + dStr)}>
            <a> (+) </a>
          </div>

        </div>
      )
    } else {
      return (        
        <div key={dateStr(d)} className="dayOutMonthCal">

          <div onClick={() => handleClickDay(d)}>
            {dStr}
          </div>

          <div onClick={() => console.log("Voce quer adicionar tarefa do dia: " + dStr)}>
            <a> (+) </a>
          </div>

        </div>
      )
    }
  })

  return (
    <div>

      <h1> Calendar </h1>
      <h2> {calendarDate.getFullYear()} </h2>
      <h2> {monthNumberToLabelMap[calendarDate.getMonth()]} </h2>
      <div className = "calendarGrid">
        <div key="Dom" className="header"><p>D</p></div>
        <div key="Seg" className="header"><p>S</p></div>
        <div key="Ter" className="header"><p>T</p></div>
        <div key="Qua" className="header"><p>Q</p></div>
        <div key="Qui" className="header"><p>Q</p></div>
        <div key="Sex" className="header"><p>S</p></div>
        <div key="Sáb" className="header"><p>S</p></div>
        {calendarGrid}
      </div>
      
    </div>

  );
};

export default CalendarGrid;
