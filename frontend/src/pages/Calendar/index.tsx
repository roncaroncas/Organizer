import {useState, useEffect} from "react";

import { memo } from "react"

import Header from "../../components/Header"
import DraggableWrapper from "../../components/DraggableWrapper"

// import AllTasksTable from "./AllTasksTable"
import CalendarTempos from "./CalendarTempos"
import CalendarGrid from "./CalendarGrid"
import SidebarLayout from "./SidebarLayout"
import TempoForm from "./TempoForm";

import useModal from "../../hooks/useModal";
import useFetch from "../../hooks/useFetch";

interface TempoBase {
  name: string
  startTimestamp: Date
  endTimestamp: Date
  place: string
  fullDay: boolean
  description: string
  status: string
  parentId? : number
}

interface TempoRequest extends TempoBase {
  //
}

interface TempoResponse extends TempoBase {
  id: number
}

function Calendar ()  {

  // ----  CONTROLE DE MODAL ----- //

  // Modal Hook
  const { isOpen, openModal, closeModal } = useModal()

  // Modal Click Out
  useEffect(() => {
    const handleClickOutModal = (event: MouseEvent) => {
      if (event.target === document.getElementById('modal-div')) {
        closeModal();
      }
    };
    window.addEventListener('click', handleClickOutModal);

    return () => window.removeEventListener('click', handleClickOutModal);
  }, [closeModal]);


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
      startTimestamp: new Date(),
      endTimestamp: new Date(),
      place: "",
      fullDay: false,
      description: "",
      status: ""}
      )
  }

  // ----   CONTROLE DE TEMPOS CARREGADOS ----------

  const [tempos, setTempos] = useState<TempoResponse[]>([])

  // Fetch dos tempos

  const { data, /*error, isLoading,*/ fetchData } = useFetch(
    'http://localhost:8000/tempo/getAll', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    fetchData();    
  }, []);

  useEffect(() => {
    if (data) {
      setTempos(
        data.map(t => ({
          ...t,
          startTimestamp: new Date(t.startTimestamp),
          endTimestamp: new Date(t.endTimestamp) 
        }))
      );
    }
  }, [data]);


  // --------------------------------


  return (
    <>
      <Header/>
      <div className="pagebody calendarbody">
        <div className="sidebar">
          <SidebarLayout/>
        </div>

        <div className="main-content">
          <CalendarGrid

            isOpen = {isOpen}
            openModal = {openModal}
            closeModal = {closeModal}

            selectedTempo = {selectedTempo}
            setSelectedTempo = {setSelectedTempo}
            resetSelectedTempo = {resetSelectedTempo}

            tempos = {tempos}
            setTempos = {setTempos}
            data = {data}
            fetchData = {fetchData}

          />
        </div>
        
        <div id="modal-div" className={isOpen ? "modal-shown" : "modal-hidden"}>
          <DraggableWrapper>
          <TempoForm
            key = {selectedTempo.id}
            id = {selectedTempo.id}
            onClose={() => {
              resetSelectedTempo()
              closeModal();
            }}
            triggerRender = {fetchData} // faz um fetch para atualizar dados e forçar update da tela
            loadedTempo = {selectedTempo}
            />
          </DraggableWrapper>
        </div>
        

      </div>

    </>




  );
};

export default memo(Calendar);
