import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { format, addHours } from 'date-fns';

import useForm from "../../hooks/useForm"
import useFetch from "../../hooks/useFetch"



//  ------- INTERFACES ------- //
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

// -------- FORMATED VALUE FOR API ------- //

const formatTaskForAPI = (task: Task) => {

  // MONTANDO startDateTime:
  // Parsing startDate and startTime
  const startDateParts = task.startDay.split("-").map(Number);
  const startTimeParts = task.startTime ? task.startTime.split(":").map(Number) : [0, 0]; // Default to 00:00 if undefined

  // Creating the final startDateTime
  const startDayTime = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2], startTimeParts[0], startTimeParts[1]);

  // MONTANDO endDateTime:
  // Parsing endDate and endTime
  const endDateParts = task.endDay.split("-").map(Number);
  const endTimeParts = task.endTime ? task.endTime.split(":").map(Number) : [0, 0]; // Default to 00:00 if undefined

  // Creating the final endDateTime
  const endDayTime = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2], endTimeParts[0], endTimeParts[1]);

  // Removendo as variáveis que não quero com Destructuring
  const { startDay, startTime, endDay, endTime, ...task_ } = task; 

  return {
    ...task_,
    startDayTime: startDayTime.toISOString(), // Send as a single ISO string
    endDayTime: endDayTime.toISOString(),     // Send as a single ISO string
  };
};

function TaskFormModal({id, closeModal,  triggerRender, initialTask = {}}: TaskModalProps) {


  ///////////ADICIONAR TASK NOVA////////////////
  let navigate = useNavigate()


  // ------------- CONTROLE DO FORMS ------------- //
  const { formValues: task, handleInputChange, getFormattedData } = useForm<Task>(
    {
      id: id ? parseInt(id) : undefined,
      taskName: initialTask.taskName || "",
      startDay: initialTask.startDayTime ? format(initialTask.startDayTime, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      startTime: initialTask.startDayTime ? format(initialTask.startDayTime, "HH:mm") : "",
      endDay: initialTask.endDayTime ? format(initialTask.endDayTime, "yyyy-MM-dd") : format(addHours(new Date(), 1), "yyyy-MM-dd"),
      endTime: initialTask.endDayTime ? format(initialTask.endDayTime, "HH:mm") : "",
      place: initialTask.place || "",
      fullDay: initialTask.fullDay || false,
      taskDescription: initialTask.taskDescription || "",
    },
    formatTaskForAPI // Pass the formatting function to convert to backend format
  );

  // --------- DEBUG ------------ //

  useEffect(() => {
    console.log(task)
  },[])

  console.log(task)


  // ------------------- CONTROLE DO FETCH ----------------

  const { fetchData:createTask } = useFetch('http://localhost:8000/createTask', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formatTaskForAPI(task))
  }) 

  const { fetchData:updateTask } = useFetch('http://localhost:8000/updateTask', {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formatTaskForAPI(task))
    })

  // -------------- USE EFFECTS ---------------------- / /


  // --------------EVENT HANDLERS----------------------


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // console.log(task)
    id ? await updateTask() : await createTask()
    triggerRender()
    closeModal()
    // navigate(0) //jeito porco de atualizar a lista de tasks
    console.log("Submitei")
  }

  return (

    <div>

      <div id="modalDiv" className="modal-shown">

        {/*Modal Container*/}
        <form className="modal-content" onSubmit={handleSubmit}>
            <p className="modal-title">Novo evento</p>

            <input name="taskName" placeholder="Título do Evento" value={task.taskName} onChange={handleInputChange} type="text" /><br />

            <div className="event-details">
              <section className="event-duration">
                <div>
                  <label> Hora Início </label>
                  <input
                    name="startDay" onChange={handleInputChange} type="date"
                    value={task.startDay}
                  />

                  {task.fullDay?
                    "":
                    <input name="startTime" onChange={handleInputChange} type="time"
                      value={task.startTime}
                    />
                  }
                </div>
               
                <div>
                  <label> Hora Fim </label>
                  <input name="endDay" onChange={handleInputChange} type="date"
                  value={task.endDay}/>
                  {task.fullDay? "":<input name="endTime" onChange={handleInputChange} type="time" 
                  value={task.endTime} />}
                </div>
              </section>
              
              <label>
                <input
                  name="fullDay"
                  type="checkbox"
                  onChange={handleInputChange}
                  // value={task.fullDay}/*/
                  checked={task.fullDay}
                />
                Dia Inteiro
              </label><br/>

              <input name="place" placeholder="Local" value={task.place} onChange={handleInputChange} type="text" /><br />
              <input name="taskDescription" placeholder="Descrição" value={task.taskDescription} onChange={handleInputChange} type="text"/><br />

            </div>
            <div className="form-footer">
              <button type="button" onClick={closeModal}>Fechar</button>
              <button type="submit">Salvar</button>

            </div>
          </form>
        <br />

      </div>
    </div>

  );
};

export default TaskFormModal;
