import { useMemo } from "react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, getISOWeek, addDays } from "date-fns"
import classNames from 'classnames'

import CellSimpleTempoList from "../cell/CellSimpleTempoList";

type OpenTempo = (tempo: Tempo) => void;
type SetGridMode = (date: Date) => void;
type openTempo = (tempo?: Tempo) => void;

// ------ Types ---------

interface Tempo {
  id: number
  name: string
  startTimestamp: Date
  endTimestamp: Date
  place: string
  fullDay: boolean
  description: string
  status: string
}

interface GridState {
  mode: "Month" | "Week" | "Day"
}

interface GridProps {
  refDate: Date;
  setRefDate: React.Dispatch<React.SetStateAction<Date>>;
  setGridMode: (mode: GridState["mode"]) => void;
  tempos: Tempo[];
  openTempo: (tempo?: Tempo) => void;
}


//  --------- Utilities --------- //

function getWeek(i: Date) {
  return (i.getDay() === 0) ? getISOWeek(i) + 1 : getISOWeek(i);
}

function getCalendarWeeks({
  refDate,
  setRefDate,
  tempos,
  setGridMode,
  openTempo,
}:GridProps) {
  const WeekStart = startOfWeek(refDate);
  const WeekEnd = endOfWeek(WeekStart);
  const startDate = startOfWeek(WeekStart);
  const endDate = endOfWeek(WeekEnd);

  const weeks = [];
  let thisDay = startDate;

  while (thisDay <= endDate) {
    const weekStart = thisDay;
    const week = [];

    for (let i = 0; i < 7; i++) {
      const dayTempos = tempos.filter(
        (tempo) => new Date(tempo.startTimestamp).toDateString() === thisDay.toDateString()
      );

      week.push({
        day: thisDay,
        content: (
          <CellSimpleTempoList
            day={thisDay}
            setGridMode={setGridMode}
            setRefDate={setRefDate}
            dayTempos={dayTempos}
            openTempo={openTempo}
          />
        ),
      });

      thisDay = addDays(thisDay, 1);
    }

    weeks.push({ weekNumber: getWeek(weekStart), days: week });
  }

  return weeks;
}

// ----------- Component --------- //

function GridWeek({
  refDate,
  setRefDate,
  setGridMode,
  tempos,
  openTempo,
}:GridProps ) {

  const calendarWeekBody = useMemo(() => {

    const calendarWeeks = getCalendarWeeks({
      refDate,
      setRefDate,
      tempos,
      openTempo,
      setGridMode,
    });

    // console.log(calendarWeeks)
    
    return calendarWeeks.map((week) => {
      const weekKey = format(week.days[0].day, "yyyy-MM-dd")
      // console.log(week)

      return [
        // Week number div
        <div
          key={"Week" + weekKey}
          className="calendar-cell label"
          onClick = {() => setGridMode("Month")}
        >
          {week.weekNumber}
        </div>,

        // Map over days and return a div for each day
        ...week.days.map((day) => {
          // console.log(day.day)
          return (
            <div
              key={format(day.day, "yyyy-MM-dd")}
              id={format(day.day, "yyyy-MM-dd")}
              className={classNames("calendar-cell selectedMonth")}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  openTempo();
                }
              }}
            >
              {day.content}
            </div>
          );
        }),
      ];
    });
  }, [tempos]);

  return(
    <>
      {calendarWeekBody}
    </>
    )
}

export default GridWeek;
