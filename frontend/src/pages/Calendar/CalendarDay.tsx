import {useState, useRef, useEffect} from 'react'

import { format /*, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getISOWeek */} from "date-fns";
// import { addDays, addMonths, addYears } from "date-fns";

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

interface TempoGeometry {
	id: number,
	overlaps: number[],
	horizontalOffset: number,
	width: number,
}


interface GridState {
	grid: "Month" | "Week" | "Day"
	param: number
	day: Date
}

interface CalendarDayProps{
	grid: GridState,
	tempos: Tempo[]
	onTempoClick: OnTempoClick
}

type OnTempoClick = (tempo: Tempo) => void;


// ------ CALENDAR DAY ------- //


function CalendarDay({grid, tempos, onTempoClick}:CalendarDayProps) {

  const [temposGeometry, setTemposGeometry] = useState<TempoGeometry[]>([]);
  const tempoRefs = useRef<{ [key: number]: HTMLDivElement}>({});

  // // LOAD EMPTY TASKS GEOMETRY
  useEffect(() => {
    console.log("Resetando temposGeometry!")
    console.log("tempos: ", tempos)
    const dayTempos = tempos.filter(
      (tempo) => new Date(tempo.startTimestamp).toDateString() === grid.day.toDateString()
    );
    setTemposGeometry(
      dayTempos.map((tempo) => ({
        id: tempo.id,
        width: 0, // Default
        horizontalOffset: 0, // Default
        overlaps: [], // Default
      }))
    );
  }, [tempos, grid]);

  // CALCULATING ALL WIDTHS
	function setTempoGeometryWidth(tempo: Tempo, width: number) {
    const tempoGeom = temposGeometry.find((tempoGeom) => tempoGeom.id === tempo.id);
    if (!tempoGeom) return;

    if (width != tempoGeom.width){
      setTemposGeometry((prevGeometry) =>
        prevGeometry.map((t) =>
          t.id === tempo.id ? { ...t, width, offset: 0 } : { ...t, offset: 0 } // resseta todos os offsets!
        )
      )
    }
  }

  // CALCULATING OFFSETS AFTER CALCULATE ALL WIDTHS!

  function calculateAllOffsetsGeometry(dayTempos: Tempo[]) {

	  setTemposGeometry((prevGeometry) =>
	    prevGeometry.map((tempoGeom, index) => {
	      // Find the tempo from dayTempos based on tempo id
	      const tempo = dayTempos.find((tempo: Tempo) => tempo.id === tempoGeom.id);
	      if (!tempo) return tempoGeom;

	      // Find overlapping tempos from the previous tempos (tempos processed before this one)
	      const overlappingTempos = prevGeometry.slice(0, index).filter((t) => {
	        const otherTempo = dayTempos.find((tempo: Tempo) => tempo.id === t.id);
	        if (!otherTempo) return false;

	        const tempoStart = new Date(tempo.startTimestamp);
	        const tempoEnd = new Date(tempo.endTimestamp);
	        const otherStart = new Date(otherTempo.startTimestamp);
	        const otherEnd = new Date(otherTempo.endTimestamp);

	        // Check if the tempos overlap
	        return tempoStart < otherEnd && tempoEnd > otherStart;
	      });

	      // Calculate the new horizontal offset based on the maximum offset of the overlapping tempos
	      const newOffset = 50 + // Starting position for the first tempo
	        Math.max(
	          0,
	          ...overlappingTempos.map((t) => {
	            const prevTempoGeom = prevGeometry.find((tg) => tg.id === t.id);
	            return prevTempoGeom ? prevTempoGeom.horizontalOffset + prevTempoGeom.width + 5 : 50;
	          })
	        );

	      return { ...tempoGeom, horizontalOffset: newOffset };
	    })
	  );
	}

  useEffect(() => {
    console.log("temposGeometry changed: ", temposGeometry)
    if (
      temposGeometry.some((tempo) => tempo.horizontalOffset === 0) &&
      temposGeometry.every((tempo) => tempo.width > 0)
    ) {
      console.log("Calculating offsets...");
      const dayTempos = tempos.filter(
        (tempo) => new Date(tempo.startTimestamp).toDateString() === grid.day.toDateString()
      );
      calculateAllOffsetsGeometry(dayTempos);

    }
  }, [temposGeometry]);


  // CALCULATE ALL OVERLAPS!
  function setTempoOverlaps(tempo: Tempo) {

    const tempoGeom = temposGeometry.find((tempoGeom:TempoGeometry) => tempoGeom.id === tempo.id);
    if (!tempoGeom) return;

    // Get the start and end times for the current tempo
    const tempoStart = new Date(tempo.startTimestamp);
    const tempoEnd = new Date(tempo.endTimestamp);

    // Find overlapping tempos
    const overlappingTempos = temposGeometry.filter((otherTempoGeom:TempoGeometry) => {

      const otherTempo = tempos.find((t) => t.id === otherTempoGeom.id);

      if (!otherTempo || otherTempo.id >= tempo.id) return false;

      const otherStart = new Date(otherTempo.startTimestamp);
      const otherEnd = new Date(otherTempo.endTimestamp);

      // Check if the tempos overlap
      return tempoStart < otherEnd && tempoEnd > otherStart;
    });

    const newOverlaps = overlappingTempos.map((t) => t.id);

    // Update the state only if the overlaps have changed
    if (JSON.stringify(newOverlaps) !== JSON.stringify(tempoGeom.overlaps)) {
      setTemposGeometry((prevTemposGeometry) =>
        prevTemposGeometry.map((tempoGeom) =>
          tempoGeom.id === tempo.id
            ? { ...tempoGeom, overlaps: newOverlaps } // Store overlap ids
            : tempoGeom
        )
      );
    }
  }

  // useEffect(() => {
  // }, [tempos]);



  const calendarDayBody = () => {
    let dph = 4 //Divisions Per Hour
    const timeSlots = Array.from({ length: 24*dph }, (_, i) => {
      const hours = String(Math.floor(i/dph)).padStart(2, "0");
      const minutes = String((i % dph) * 60/dph).padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    const dayTempos = tempos.filter(
      (tempo) => new Date(tempo.startTimestamp).toDateString() === grid.day.toDateString()
    );

    return (

      <div className="day-container">

        <div className="times-containers">

        {timeSlots.map((time) => {

          const [hours, minutes] = time.split(":");
          const isFullHour = minutes === "00"; // Check for full hour
          const isSixthHour = (parseInt(hours) % 6 === 0 && minutes === "00")

          return(
            <div key={time}
              className="time-container"
              style={{
              borderTop: isSixthHour
                ? "3px solid rgba(200, 100, 0, 0.6)" // Strong burnt orange
                : isFullHour
                ? "2px solid rgba(230, 150, 50, 0.4)" // Softer orange
                : "1px solid rgba(230, 170, 90, 0.2)" // Subtle tint
            }}
            >
              <span className="time-text" >
                {isFullHour ? time : ""}
              </span>
            </div>
          )})}
          </div>

        <div className = "tempos-containers">
          {dayTempos.map((tempo, tempoIndex) => {
            const tempoStart = new Date(tempo.startTimestamp);
            const tempoEnd = new Date(tempo.endTimestamp);
            const startIndex = tempoStart.getHours() + tempoStart.getMinutes() / 60;
            const endIndex = tempoEnd.getHours() + tempoEnd.getMinutes() / 60;
            const tempoHeight = Math.max(endIndex - startIndex, 2) * 2;

            console.log("tempoStart, tempoEnd, startIndex, endIndex, tempoHeight")
            console.log(tempoStart, tempoEnd, startIndex, endIndex, tempoHeight)

            // const overlappingTempos = dayTempos.filter((t, index) => {
            //   const otherStart = new Date(t.startTimestamp);
            //   const otherEnd = new Date(t.endTimestamp);
            //   return tempoStart <= otherEnd && tempoEnd >= otherStart && tempoIndex > index;
            // });

            const tempoGeom = temposGeometry.find((tg) => tg.id === tempo.id) || {
              width: 50,
              horizontalOffset: 0,
              overlaps: [],
              id: 0
            };

            return (
              <div
                key={tempoIndex}
                className="tempo-container"
                style={{
                  top: `${startIndex * 2}em`,
                  height: `${tempoHeight}em`,
                  left: `${tempoGeom.horizontalOffset}px`,
                }}
                onClick={() => {
                  onTempoClick(tempo);
                }}
                ref={(el) => {
                  if (el) {
                    tempoRefs.current[tempo.id] = el;
                    setTempoGeometryWidth(tempo, el.offsetWidth);
                    setTempoOverlaps(tempo) // Não precisava esperar renderizar para calcular isso...
                  }
                }}
              >
                <span>
                  ({tempo.id}) - <strong>{format(tempo.startTimestamp, "HH:mm")}</strong> to{" "}
                  <strong>{format(tempo.endTimestamp, "HH:mm")}</strong>: {tempo.name}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    );
  };


   return(
    <div className = "col-08">
        {calendarDayBody()}
    </div>
    )
}

export default CalendarDay;
