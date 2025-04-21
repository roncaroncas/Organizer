import {useState, useRef, useEffect} from 'react'

import { format, startOfDay, endOfDay} from "date-fns";

import CellTimeDistributed from "../cell/CellTimeDistributed";

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

interface GridProps {
  refDate: Date;
  setRefDate: React.Dispatch<React.SetStateAction<Date>>;
  setGridMode: (mode: GridState["mode"]) => void;
  tempos: Tempo[];
  openTempo: (tempo?: Tempo) => void;
}


// ------ GRID DAY ------- //

function GridDay({
  refDate,
  setRefDate,
  tempos,
  setGridMode,
  openTempo,
}:GridProps ) {

  // Compute boundaries for the day in local time
  const startTime = startOfDay(refDate)
  const endTime = endOfDay(refDate)

  // Filter the tempos that start during this day
  const inDayTempos = tempos
    .filter((tempo) => {
      const start = new Date(tempo.startTimestamp);
      return start >= startTime && start <= endTime;
    })
    .sort((a, b) => new Date(a.startTimestamp).getTime() - new Date(b.startTimestamp).getTime());


  // -------- DEBUG --------- //

  // useEffect (() => {
  //   console.log(tempos)
  //   console.log(inDayTempos)
  // }, [tempos] )

  // ------------------------ //

  return(
    <CellTimeDistributed
      day={refDate}
      setGridMode={setGridMode}
      setRefDate={setRefDate}
      dayTempos={inDayTempos}
      openTempo={openTempo}
    />
  )
}

export default GridDay;
