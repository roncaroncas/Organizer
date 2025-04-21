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
}

interface CellProps {
  day: Date;
  dayTempos: Tempo[];
  setRefDate: React.Dispatch<React.SetStateAction<Date>>
  setGridMode: (mode: GridState["grid"]) => void;
  openTempo: (tempo?: Tempo) => void;
}


// ------ CALENDAR DAY ------- //


function CellTimeDistributed({
  day,
  dayTempos,
  setRefDate,
  setGridMode,
  openTempo,
}: CellProps) {


  // ------------------- TIME CONTAINERS ------------------- //

  const timeContainersHandler = () => {
    let dph = 4 //Divisions Per Hour
    const timeSlots = Array.from({ length: 24*dph }, (_, i) => {
      const hours = String(Math.floor(i/dph)).padStart(2, "0");
      const minutes = String((i % dph) * 60/dph).padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    return (
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
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  openTempo();
                }
              }}
            >

              <span className="time-text" >
                {isFullHour ? time : ""}
              </span>

            </div>
          )}
        )}
      </div>
    )

  }

  // -------------------- TEMPO CONTAINERS ---------------------- //

  const [temposGeometry, setTemposGeometry] = useState<TempoGeometry[]>([]);
  const tempoRefs = useRef<{ [key: number]: HTMLDivElement}>({});

  // -- Start or Clear ALL tempoGeometry
  function startAllTempoGeometry(dayTempos: Tempo[]) {
    setTemposGeometry(
      dayTempos.map((tempo) => ({
        id: tempo.id,
        width: 0,
        horizontalOffset: 0,
        overlaps: [],
      }))
    );
  }


  // -- Calculating overlaps for ONE tempoGeometry
  function setTempoGeometryOverlaps(tempo: Tempo) {

    const tempoGeom = temposGeometry.find((tempoGeom:TempoGeometry) => tempoGeom.id === tempo.id);
    if (!tempoGeom) return;

    // Get the start and end times for the current tempo
    const tempoStart = new Date(tempo.startTimestamp);
    const tempoEnd = new Date(tempo.endTimestamp);

    // Find overlapping tempos
    const overlappingTempos = temposGeometry.filter((otherTempoGeom:TempoGeometry) => {

      const otherTempo = dayTempos.find((t) => t.id === otherTempoGeom.id);

      if (!otherTempo || otherTempo.id >= tempo.id) return false;

      const otherStart = new Date(otherTempo.startTimestamp);
      const otherEnd = new Date(otherTempo.endTimestamp);

      // console.log(tempoStart < otherEnd)

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

  // -- Calculating width for ONE tempoGeometry
	function setTempoGeometryWidths(tempo: Tempo, width: number) {
    const tempoGeom = temposGeometry.find((tempoGeom) => tempoGeom.id === tempo.id);
    if (!tempoGeom) return;

    if (width != tempoGeom.width){
      setTemposGeometry((prevGeometry) =>
        prevGeometry.map((t) =>
          t.id === tempo.id
            ? { ...t, width, horizontalOffset: 0 }
            : { ...t, horizontalOffset: 0 } // resseta todos os horizontalOffset!
        )
      )
    }
  }

  // -- Calculating offsets for ONE tempoGeometry considering tempos width

  function setTempoGeometryOffset(tempo: Tempo) {
    setTemposGeometry((prevGeometry) => {
      const index = prevGeometry.findIndex((tg) => tg.id === tempo.id);
      if (index === -1) return prevGeometry;

      let tempoStart = new Date(tempo.startTimestamp);
      let tempoEnd = new Date(tempo.endTimestamp);


      const overlappingTempos = prevGeometry.slice(0, index).filter((t) => {
        const otherTempo = dayTempos.find((tempo) => tempo.id === t.id);
        if (!otherTempo) return false;

        let otherStart = new Date(otherTempo.startTimestamp);
        let otherEnd = new Date(otherTempo.endTimestamp);

        return tempoStart < otherEnd && tempoEnd > otherStart;
      });

      const newOffset = 10 + Math.max(
        30,
        ...overlappingTempos.map((t) => {
          const prevTempoGeom = prevGeometry.find((tg) => tg.id === t.id);
          return prevTempoGeom
            ? prevTempoGeom.horizontalOffset + prevTempoGeom.width + 5
            : 50;
        })
      );

      return prevGeometry.map((tg) =>
        tg.id === tempo.id ? { ...tg, horizontalOffset: newOffset } : tg
      );
    });
  }


  // ----- Calling the functions for geometry!

  // 1. When the day or dayTempos change → reset geometries
  useEffect(() => {
    startAllTempoGeometry(dayTempos);
    // console.log("TempoGeometry initialized:", temposGeometry)
  }, [dayTempos, day]);

  // 2. After geometries are initialized → set widths (based on rendered refs)
  useEffect(() => {
    if (temposGeometry.length) {
      dayTempos.forEach((tempo) => {
        const el = tempoRefs.current[tempo.id];
        if (el) {
          setTempoGeometryWidths(tempo, el.offsetWidth);
        }
      })
      // console.log("TempoGeometry update (WIDTH):", temposGeometry)
    }
  }, [temposGeometry]); // triggers after initial geometry is set

  // 3. Once we have geometry (especially widths), compute overlaps
  useEffect(() => {
    if (temposGeometry.length && temposGeometry.every((t) => t.width !== 0)) {
      dayTempos.forEach((tempo) => {
        setTempoGeometryOverlaps(tempo);
      });
      // console.log("TempoGeometry update (OVERLAPS):", temposGeometry)
    }      
  }, [temposGeometry]); // runs anytime geometry changes

  // 4. Once overlaps and widths are in → compute horizontal offsets
  useEffect(() => {
    const allHaveWidths = temposGeometry.every((t) => t.width > 0);
    const someStillOffsetZero = temposGeometry.some((t) => t.horizontalOffset === 0);

    if (allHaveWidths && someStillOffsetZero) {
      // debugger
      dayTempos.forEach((tempo) => {
        setTempoGeometryOffset(tempo);
      });
      // console.log("TempoGeometry update (OFFSETS):", temposGeometry)
    }
  }, [temposGeometry]);


  const tempoContainersHandler = () => {

    return (

      <div className = "tempos-containers">
        {dayTempos.map((tempo, tempoIndex) => {
          const tempoStart = new Date(tempo.startTimestamp);
          const tempoEnd = new Date(tempo.endTimestamp);
          const startIndex = tempoStart.getHours() + tempoStart.getMinutes() / 60;
          const endIndex = tempoEnd.getHours() + tempoEnd.getMinutes() / 60;

          const emPerHour = 2;
          const tempoHeight = Math.max(endIndex - startIndex, 1) * emPerHour;

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
                minWidth: '40%'
              }}
              onClick={() => {
                openTempo(tempo);
              }}
              ref={(el) => {
                if (el) {
                  tempoRefs.current[tempo.id] = el;
                  //setTempoGeometryWidths(tempo, el.offsetWidth);
                  //setTempoGeometryOverlaps(tempo) // Não precisava esperar renderizar para calcular isso...
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

      )
  }

   return(
    <>
      <div className="day-container col-08">

        {timeContainersHandler()}
        {tempoContainersHandler()}
 
      </div>
    </>
    )
}

export default CellTimeDistributed;
