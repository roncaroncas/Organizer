import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { format, addHours } from 'date-fns';

import useModal from "../../hooks/useModal";
import useFetch from "../../hooks/useFetch"

import TaskFormHTML from "./TaskFormHTML"

interface Task {
  taskName: string;
  startDayTime: Date;
  endDayTime: Date;
  place: string;
  fullDay: boolean;
  taskDescription: string;
}

interface TaskModalProps {
  id: string
  initialTask?: Partial<Task>;
}

function TaskModal({id, closeModal,  initialTask = {} }: TaskModalProps) {

  ///////////ADICIONAR TASK NOVA////////////////
  let navigate = useNavigate()

  // PARAMETROS DO FORMS
  const [task, setTask] = useState<Task>({
    taskName:
      initialTask.taskName || "",
    startDayTime:
      initialTask.startDayTime
      ? new Date(initialTask.startDayTime)
      : new Date(),
    endDayTime:
      initialTask.endDayTime
      ? new Date(initialTask.endDayTime)
      : addHours(new Date(), 1),
    place: initialTask.place || "",
    fullDay: initialTask.fullDay || false,
    taskDescription: initialTask.taskDescription || "",

  });

  console.log("Criei o taskModal!")

  console.log(task)



  // ------------------- CONTROLE DO FETCH ----------------


  const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/createTask', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...task,
      startDayTime: task.startDayTime.toISOString(),
      endDayTime: task.endDayTime.toISOString(),
    })
  }) 

  // const { data_put, error_put, isLoading_put, fetchData_put } = useFetch('http://localhost:8000/updateTask', {
  //   method: "PUT",
  //   credentials: "include",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     ...task,
  //     startDayTime: task.startDayTime.toISOString(),
  //     endDayTime: task.endDayTime.toISOString(),
  //   })
  // }) 


  // --------------EVENT HANDLERS----------------------

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    console.log(name, value, type, checked)

    setTask(prevTask => {
      let newTask = { ...prevTask };

    if (name === "startDay" || name === "startTime") {

      // Update startDay or startTime, and recalculate startDayTime
      const date = (name === "startDay" ? new Date(value) : new Date(prevTask.startDayTime))
      const time = (name === "startTime" ? value : format(prevTask.startDayTime,"HH:mm"))
      const hours = time.slice(0, 2)
      const minutes = time.slice(-2)

      newTask.startDayTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes)


    } else if (name === "endDay" || name === "endTime") {

      // Update endDay or endTime, and recalculate endDayTime
      const date = (name === "endDay" ? new Date(value) : new Date(prevTask.endDayTime))
      const time = (name === "endTime" ? value : format(prevTask.endDayTime,"HH:mm"))
      const hours = time.slice(0, 2)
      const minutes = time.slice(-2)

      newTask.endDayTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes)

      } else if (type === "checkbox") {
        newTask[name] = checked;
      } else {
        newTask[name] = value;
      }
      return newTask;    

    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log(task)
    await fetchData() // Cria um evento NOVO
    

   // navigate(0) //jeito porco de atualizar a lista de tasks
  }

  return (

    <div>
      {/*Botão para abrir o Modal*/}
      {/*<div className="button-container">
        <button onClick={() => openModal()}> {id ? "Atualizar Evento":"Criar Novo Evento"} </button>
        {id}
      </div>*/}

      {/*{console.log(task)}*/}

      {/*Modal div*/}
      <div id="modalDiv"
        className="modal-shown"
      >

        {/*Modal Container*/}
        <TaskFormHTML
          task = {task}
          setTask = {setTask}
          handleInputChange = {handleInputChange}
          handleSubmit = {handleSubmit}
          closeModal = {closeModal}
        />
        <br />

      </div>
    </div>

  );
};

export default TaskModal;
