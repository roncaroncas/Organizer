import { format } from "date-fns";


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

interface CellProps {
  day: Date;
  dayTempos: Tempo[];
  setRefDate: React.Dispatch<React.SetStateAction<Date>>
  setGridMode: (mode: GridState["grid"]) => void;
  openTempo: (tempo?: Tempo) => void;
}


function CellSimpleTempoList ({
	day,
	dayTempos,
  setRefDate,
  setGridMode,
  openTempo,
}: CellProps) {

	return(
		<>
	    <div
        key="dateTitle"
        className="dateTitle"
        onClick={() => {setRefDate(new Date(day)); setGridMode("Day")}}
        style={{cursor: "pointer"}}
      >
	      <span> <strong> {format(day, "dd")} </strong> </span>
	    </div>


	    <div
        key="dateContent"
        className="dateContent"
        // onClick={() => {setRefDate(new Date(day)); openTempo()}}
      >
	      {(
          <>
            {dayTempos.slice(0, 3).map(tempo => (
              <div
                key={"tempo__"+ tempo.id}
                className="calendarTempo"
                onClick={() => openTempo(tempo)}
                style={{cursor: "pointer"}}
              >

                <span style={{fontSize:"1em", cursor: "pointer"}}>
                  {format(tempo.startTimestamp, "HH:mm")}{/*-{format(tempo.startTimestamp, "HH:mm")}*/}
                </span>

                <span style={{ fontSize:"0.6em", verticalAlign: "top" }}>        
                  ({tempo.id})
                </span>

                <span>
                  {" "}{tempo.name}
                </span>

              </div>

            ))}

            {dayTempos.length > 3 && (
              <div>+{dayTempos.length - 3} more</div>
            )}
          </>
	        
	      )}
	    </div>    
	</>

	)
}

export default CellSimpleTempoList