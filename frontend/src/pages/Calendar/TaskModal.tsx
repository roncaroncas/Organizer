import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { format, addHours } from 'date-fns';

import useModal from "../../hooks/useModal";
import useFetch from "../../hooks/useFetch"

import TaskFormHTML from "./TaskFormHTML"

interface Task {
  id?: number
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
    id: id ? parseInt(id): null,
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

  // console.log("Criei o taskModal!")

  // console.log(task)



  // ------------------- CONTROLE DO FETCH ----------------

  const { data, error, isLoading, fetchData:fetchData_post } = useFetch('http://localhost:8000/createTask', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...task,
      startDayTime: task.startDayTime.toISOString(),
      endDayTime: task.endDayTime.toISOString(),
    })
  }) 

  const {
    data:data_put,
    error:error_put,
    isLoading:isLoading_put,
    fetchData:fetchData_put
    } = useFetch('http://localhost:8000/updateTask', {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...task,
        startDayTime: task.startDayTime.toISOString(),
        endDayTime: task.endDayTime.toISOString(),
      })
    }) 


  // --------------EVENT HANDLERS----------------------

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    // const [tempFormValues, setTempFormValues] = useState({
    //   startDay: format(task.startDayTime, "yyyy-MM-dd"), // Pre-fill with initial value
    //   endDay: format(task.endDayTime, "yyyy-MM-dd")
    // })

    const { name, value, type, checked } = e.target;

    // console.log(name, value, type, checked)

    setTask(prevTask => {
      let newTask = { ...prevTask };

    if (name === "startDay" || name === "startTime") {

      // TA COM PROBLEMA PARA PREENCHER O ANO!
      console.log("value ", value)
      const [year_, month_, day] = (name === "startDay" ? value.split("-").map(Number) : [null, null, null])
      console.log("year_ ", year_)

      const year = (prevTask.startDayTime.getFullYear().toString().length == 4)
        ? year_
        : year_+10*prevTask.startDayTime.getFullYear()
      console.log("year ", year)
      
      // Não ta resolvido!
      
      // Update startDay or startTime, and recalculate startDayTime
      const date = (name === "startDay" ? (new Date(year, month_-1, day)) : new Date(prevTask.startDayTime))

      const [hours, minutes] = name === "startTime" ? value.split(":").map(Number) : [
        prevTask.startDayTime.getHours(),
        prevTask.startDayTime.getMinutes(),
      ];

      console.log("date :", date)
      console.log("params : ",
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes)


      newTask.startDayTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes)

      console.log(newTask.startDayTime)


    } else if (name === "endDay" || name === "endTime") {

      const [year_, month_, day] = (name === "endDay" ? value.split("-").map(Number) : [null, null, null])


      // Update endDay or endTime, and recalculate endDayTime
      const date = (name === "endDay" ? new Date(year_, month_-1, day) : new Date(prevTask.endDayTime))
      const time = (name === "endTime" ? value : format(prevTask.endDayTime,"HH:mm"))
      const [hours, minutes] = name === "endTime" ? value.split(":").map(Number) : [
        prevTask.endDayTime.getHours(),
        prevTask.endDayTime.getMinutes(),
      ];

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

    if (id){
      await fetchData_put() // Atualiza um evento EXISTENTE
    } else {
      await fetchData_post() // Cria um evento NOVO
    }
    

   // navigate(0) //jeito porco de atualizar a lista de tasks
  }

  return (

    <div>

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
