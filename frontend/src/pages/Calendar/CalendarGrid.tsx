import { useState, useEffect } from "react";
import { format, /*startOfMonth, endOfMonth, startOfWeek, endOfWeek, getISOWeek*/ } from "date-fns";
import { addDays, addMonths, addYears } from "date-fns";

import useFetch from "../../hooks/useFetch";
import useModal from "../../hooks/useModal";

import TaskFormModal from "./TaskFormModal";
import CalendarMonth from "./CalendarMonth";
import CalendarDay from "./CalendarDay";

interface Task {
  id: number
  taskName: string
  startTimestamp: Date;
  endTimestamp: Date
  place: string
  fullDay: boolean
  description: string
  status: string
}

interface ModeState {
  mode: "Month" | "Week" | "Day"
  param: number
  day: Date
}


type OnTaskClick = (task: Task) => void;


function CalendarGrid(){

  const [mode, setMode] = useState<ModeState>({
    mode: "Month",
    param: -1,
    day: new Date(Date.now())
  })

  const [tasks, setTasks] = useState<Task[]>([])

  // --------------- DEBUG ------------------------ //
  // useEffect(() => {
  //   console.log("Re-rendering CalendarGrid");
  //   console.log("tasks:", tasks);
  //   console.log("mode:", mode);
  // }, [tasks, mode]);

  // ------------------- FETCHES ---------------- //

  const { data, /*error, isLoading,*/ fetchData } = useFetch('http://localhost:8000/tempo/getAll', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    fetchData();    
  }, []);

  // Update tasks only if data changes
  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  // useEffect(() => {
  //   console.log("Mode updated: ", mode);    
  // }, [mode]);


  // ----------------   CONTROLE DE MODAL ------------------

  const { isOpen, openModal, closeModal/*, toggleModal*/ } = useModal()
  const [selectedTask, setSelectedTask] = useState<Task>({
    id: 0,
    name: "",
    startTimestamp: new Date(),
    endTimestamp: new Date(),
    place: "",
    fullDay: false,
    description: "",
    status: "",
  })

  function resetSelectedTask(){
    setSelectedTask({
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


  // ------------------ EVENT HANDLERS ---------------------------

  function setModeAsDay (day: Date):void {
    setMode({
      mode: "Day",
      param: 0,
      day: new Date (day),
    })
    return
  }

  function setModeAsMonth():void {
    let month = mode.day.getMonth()
    setMode({
      mode: "Month",
      param: month,
      day: new Date (mode.day),
    })
    return
  }

  const onTaskClick:OnTaskClick = (task: Task) => {

    setSelectedTask(task)
    openModal();
  }

  const onNewTaskClick = () => { 
    resetSelectedTask()
    openModal()
  }

  // ----- MOUSE HANDLER FOR MODAL:

  useEffect(() => {
    const handleClickOutModal = (event: MouseEvent) => {
      // Casting event target to HTMLDivElement to access the correct property
      if (event.target === document.getElementById('modalDiv')) {
        closeModal();
      }
    };

    window.addEventListener('click', handleClickOutModal);

    return () => window.removeEventListener('click', handleClickOutModal);
  }, [closeModal]);


  const triggerRender = () => {
    fetchData();
  }

  const monthNumberToLabelMap = [
    'JAN', 'FEV', 'MAR',
    'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET',
    'OUT', 'NOV', 'DEZ',
  ]

function changeDay(delta: number) {
  setMode((prev) => {
    return {...prev, day: addDays(prev.day, delta)}
  });
}

function changeMonth(delta: number) {
  setMode((prev) => {
    return {...prev, day: addMonths(prev.day, delta)}
  });
}

function changeYear(delta: number) {
  setMode((prev) => {
    return {...prev, day: addYears(prev.day, delta)}
  });
}


  // ----- RETURN -------- //

  return (
    <>

      {/* HEADER */}
      <div className="card-container">
        <h1 style={{ margin: "0px 0px 0px 20px", textAlign: "left", display: "flex", gap: "40px", fontSize: "2em" }}>
          {/* Year Section */}
          <div style={{ display: "flex", width: "100px", alignItems: "center" }}>
            <span>{mode.day.getFullYear()}</span>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "30px", fontSize: "0.5em", alignItems: "center" }}>
              <span onClick={() => changeYear(+1)} style={{ cursor: "pointer" }}>+</span>
              <span onClick={() => changeYear(-1)} style={{ cursor: "pointer" }}>-</span>
            </div>
          </div>

          {/* Month Section with Fixed Width */}
          <div style={{ display: "flex", alignItems: "center"}}>
            <span onClick={() => setModeAsMonth()} style={{ width: "140px", textAlign: "center" }}>
              {monthNumberToLabelMap[mode.day.getMonth()]}
            </span>
            <div style={{ display: "flex", flexDirection: "column", marginLeft: "10px", fontSize: "0.5em", alignItems: "center" }}>
              <span onClick={() => changeMonth(+1)} style={{ cursor: "pointer" }}>+</span>
              <span onClick={() => changeMonth(-1)} style={{ cursor: "pointer" }}>-</span>
            </div>
          </div>
        </h1>
      </div>    

      {/* MONTHGRID */}
      <div className = "card-container">
        {mode.mode == "Month"? 
        <CalendarMonth mode={mode} tasks={tasks} onTaskClick={onTaskClick} setModeAsDay={setModeAsDay} onNewTaskClick={onNewTaskClick}/>
        : mode.mode == "Day"?
        <>
          <div key="dayHeader">
            <h2>
              <span onClick={()=>changeDay(-1)}> - </span>
              {format(mode.day, "dd/MM/yyyy")}
              <span onClick={()=>changeDay(+1)}> + </span>
            </h2>
          </div>
          <CalendarDay mode={mode} tasks={tasks} onTaskClick={onTaskClick} />
        </>
        :
        ""
        }
      </div>

      {/*MODAL*/}
      <div className={isOpen ? "modal-shown" : "modal-hidden"}>
        {
          <TaskFormModal
            key = {selectedTask.id}
            id = {selectedTask.id}
            closeModal={() => {
              resetSelectedTask();   // Clear the selected event
              closeModal();             // Close the modal
            }}
            triggerRender = {triggerRender}
            initialTask = {selectedTask}
          />
        }
      </div>
      
    </>

  );
};

export default CalendarGrid;



