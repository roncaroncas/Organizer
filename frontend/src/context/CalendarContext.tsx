
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import useModal from "../hooks/useModal"
import useFetch from "../hooks/useFetch"

interface TempoBase {
  name: string
  startTimestamp: Date
  endTimestamp: Date
  place: string
  fullDay: boolean
  description: string
  status: string
  parentId?: number
}

interface TempoRequest extends TempoBase {
  //
}

interface TempoResponse extends TempoBase {
  id: number
}

interface CalendarContextType {
  refDate: Date
  setRefDate: (date: Date) => void
  selectedTempo: TempoResponse
  setSelectedTempo: (tempo: TempoResponse) => void
  resetSelectedTempo: () => void
  tempos: TempoResponse[]
  setTempos: (tempos: TempoResponse[]) => void
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  fetchData: () => void
  data: any
}

const CalendarContext = createContext<CalendarContextType | null>(null)


export const useCalendarContext = () => {
  const ctx = useContext(CalendarContext)
  if (!ctx) throw new Error("useCalendarContext must be used within CalendarProvider")
  return ctx
}



export const CalendarProvider = ({ children }: { children: ReactNode }) => {


  // ----  CONTROLE DE MODAL ----- //

  // Modal Hook
  const { isOpen, openModal, closeModal } = useModal()

  // Modal Click Out
  useEffect(() => {
    const handleClickOutModal = (event: MouseEvent) => {
      if (event.target === document.getElementById('modal-div')) {
        closeModal()
      }
    }
    window.addEventListener('click', handleClickOutModal)

    return () => window.removeEventListener('click', handleClickOutModal)
  }, [closeModal])




  // ---- REFERÊNCIA DE DATA ----- //

  const [refDate, setRefDate] = useState(new Date())


  // ---- CONTROLE DE REFERÊNCIA DE TEMPO ----- //

  const [selectedTempo, setSelectedTempo] = useState<TempoResponse>({
    id: 0,
    name: "",
    startTimestamp: new Date(),
    endTimestamp: new Date(),
    place: "",
    fullDay: false,
    description: "",
    status: "",
  })

  function resetSelectedTempo(){
    setSelectedTempo({
      id: 0,
      name: "",
      startTimestamp: new Date(refDate),
      endTimestamp: new Date(refDate),
      place: "",
      fullDay: false,
      description: "",
      status: ""}
      )
  }

  const openTempo = (tempo?:Tempo) => {

    if (tempo) {
      setSelectedTempo(tempo)
    } else {
      resetSelectedTempo()
    }
    openModal()
  }


  // ----   CONTROLE DE TEMPOS CARREGADOS ----------

  const [tempos, setTempos] = useState<TempoResponse[]>([])

  // Fetch dos tempos

  const { data, /*error, isLoading,*/ fetchData } = useFetch(
    'http://localhost:8000/tempo/getAll', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  useEffect(() => {
    fetchData()    
  }, [])

  useEffect(() => {
    if (data) {
      setTempos(
        data.map(t => ({
          ...t,
          startTimestamp: new Date(t.startTimestamp),
          endTimestamp: new Date(t.endTimestamp) 
        }))
      )
    }
  }, [data])


  // ----------  ERAS ------------- //

  const [selectedEra, setSelectedEra] = useState("Calendário")

  const eras = [
    "Calendário",
    "Alimentação",
    "Saúde",
    "Educação",
    "Trabalho",
    "Exercícios",
    "Bens",
  ]


  // ----   CONTROLE DO GRID ------ // 

  const [grid, setGrid] = useState<GridState>({
    mode: "Month",
  })

  function setGridMode (mode: GridState["mode"]){
    setGrid({
      mode: mode
    })
  }

  // -------  DEBUG  ---------

  // useEffect(() => {
  //   console.log("grid:", grid)    
  // }, [grid])


  // useEffect(() => {
  //   console.log("refDate:", format(refDate, "dd-MM-yy"))    
  // }, [refDate])

  // useEffect(() => {
  //   console.log("tempos:", tempos)
  // }, [tempos])

  // useEffect(() => {
  //   console.log("SelectedTempo:", selectedTempo)
  // }, [selectedTempo])

  // --------------------------

  return (
    <CalendarContext.Provider
      value={{
        isOpen, openModal, closeModal,
        grid, setGrid, setGridMode,
        refDate, setRefDate,
        selectedTempo, setSelectedTempo, resetSelectedTempo,
        openTempo,
        tempos, setTempos,
        selectedEra, setSelectedEra, eras,
        data, fetchData,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}
