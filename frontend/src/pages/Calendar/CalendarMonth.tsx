
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getISOWeek } from "date-fns";
import { addDays, /*addMonths, addYears*/ } from "date-fns";

import {/*useEffect,*/ useMemo} from "react"

// import useForm from "../../hooks/useForm"
// import useFetch from "../../hooks/useFetch"

import classNames from 'classnames';

type OnTempoClick = (tempo: Tempo) => void;
type SetGridAsDay = (date: Date) => void;
type OnNewTempoClick = () => void;

interface GridState {
  grid: "Month" | "Week" | "Day"
  param: number
  day: Date
}

interface Tempo {
  id: number
  name: string
  startTimestamp: Date;
  endTimestamp: Date
  place: string
  fullDay: boolean
  description: string
  status: string
}

interface CalendarMonthProps{
  grid: GridState,
  tempos: Tempo[] ,
  onTempoClick: OnTempoClick ,
  setGridAsDay: SetGridAsDay,
  onNewTempoClick: OnNewTempoClick,
}

//  --------- UTILS --------- //

function getWeek(i: Date) {
  return (i.getDay() === 0) ? getISOWeek(i) + 1 : getISOWeek(i);
}

function CalendarMonth({grid, tempos, onTempoClick, setGridAsDay, onNewTempoClick}: CalendarMonthProps) {

  // ------ HEADER ----------- //


  const DayInMonthContent = (day: Date, dayTempos: Tempo[], grid: GridState, onTempoClick: OnTempoClick) => {

    return([

        <div key="dateTitle" className="dateTitle">
          <a onClick={() => setGridAsDay(day)}> 
            <strong>
              {format(day, "dd/MM/yyyy")}
            </strong>
          </a>
         <a onClick={() => {
            onNewTempoClick()
          }}>          
            (+)
          </a>
        </div>,          

        <div key="dateContent" className="dateContent">
          {(grid.grid == "Week" && grid.param != getWeek(day)) ? (
            dayTempos.length === 0 ? (
              ""
            ) : (
              <>
                {dayTempos.slice(0, 3).map(tempo => (
                  <div key={"tempo__"+ tempo.id} className="calendarTempo">
                    {format(tempo.startTimestamp, "HH:mm")}
                    <span
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => onTempoClick(tempo)}
                    >        
                      ({tempo.id}): {tempo.name}
                    </span>

                  </div>
                ))}
                {dayTempos.length > 3 && (
                  <div>+{dayTempos.length - 3} more</div>
                )}
              </>
            )
          ) : (
            dayTempos.length === 0 ? (
              ""
            ) : (
              dayTempos.map(tempo => (
                <div key={"tempo__"+ tempo.id} className="calendarTempo">
                  {format(tempo.startTimestamp, "HH:mm")}
                  <a
                    href="#"
                    onClick={() => onTempoClick(tempo)}
                  >        
                    ({tempo.id}): {tempo.name}
                  </a>

                </div>
              ))
            )
          )}
        </div>    
    ]

    )
  }

const calendarMonthBody = useMemo(() => {

  const monthStart = startOfMonth(grid.day);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const weeks = [];
  let day = startDate;

  while (day <= endDate) {
    const weekStart = day;
    const week = [];

    for (let i = 0; i < 7; i++) {
      const dayTempos = tempos.filter(
        (tempo) => new Date(tempo.startTimestamp).toDateString() === day.toDateString()
      );
      week.push({
        day: day,
        content: DayInMonthContent(day, dayTempos, grid, onTempoClick),
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
        className="calendar-cell label"
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
            "calendar-cell",
            day.day.getMonth() === grid.day.getMonth() ? "selectedMonth" : "notSelectedMonth"
          ])}

          onClick={(e) => {
            if (e.target === e.currentTarget) {onNewTempoClick()}
          }}
        >
          {day.content}
        </div>
      )}),
    ];
  });
}, [grid.day, tempos]);


  return(
    <>
      {calendarMonthBody}
    </>
    )
}

export default CalendarMonth;
