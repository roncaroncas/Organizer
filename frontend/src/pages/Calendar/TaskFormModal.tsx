import { format, addHours } from 'date-fns';

import {useEffect} from "react"

import useForm from "../../hooks/useForm"
import useFetch from "../../hooks/useFetch"



//  ------- INTERFACES ------- //
interface Task {
  id: number
  taskName: string;
  startDayTime: Date;
  endDayTime: Date;
  place: string;
  fullDay: boolean;
  taskDescription: string;
}

interface FormData {
  id: number,
  taskName: string,
  startDay: string,
  startTime: string,
  endDay: string,
  endTime: string,
  place: string,
  fullDay: boolean,
  taskDescription: string,
}

interface TaskModalProps {
  id: number
  initialTask: Partial<Task>
  closeModal: () => void;
  triggerRender: () => void
}

// -------- FORMATED VALUE FOR API ------- //

const formatTaskForAPI = (values: FormData): Task => {

  // MONTANDO startDateTime:
  // Parsing startDate and startTime
  const startDateParts = values.startDay.split("-").map(Number);
  const startTimeParts = values.startTime ? values.startTime.split(":").map(Number) : [0, 0]; // Default to 00:00 if undefined

  // Creating the final startDateTime
  const startDayTime = new Date(startDateParts[0], startDateParts[1] - 1, startDateParts[2], startTimeParts[0], startTimeParts[1]);

  // MONTANDO endDateTime:
  // Parsing endDate and endTime
  const endDateParts = values.endDay.split("-").map(Number);
  const endTimeParts = values.endTime ? values.endTime.split(":").map(Number) : [0, 0]; // Default to 00:00 if undefined

  // Creating the final endDateTime
  const endDayTime = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2], endTimeParts[0], endTimeParts[1]);

  let t:Task = {
    id: values.id,
    taskName: values.taskName,
    startDayTime: startDayTime,
    endDayTime: endDayTime,
    place: values.place,
    fullDay: values.fullDay,
    taskDescription: values.taskDescription,
  }
  
  return t;
};


function TaskFormModal({id, closeModal,  triggerRender, initialTask = {}}: TaskModalProps) {

  // ------------- CONTROLE DO FORMS ------------- //
  const { formValues, handleInputChange, /*getFormattedData */} = useForm<FormData>(
    {
      id: id ? id : 0,
      taskName: initialTask.taskName || "",
      startDay: initialTask.startDayTime ? format(initialTask.startDayTime, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      startTime: initialTask.startDayTime ? format(initialTask.startDayTime, "HH:mm") : "",
      endDay: initialTask.endDayTime ? format(initialTask.endDayTime, "yyyy-MM-dd") : format(addHours(new Date(), 1), "yyyy-MM-dd"),
      endTime: initialTask.endDayTime ? format(initialTask.endDayTime, "HH:mm") : "",
      place: initialTask.place || "",
      fullDay: initialTask.fullDay || false,
      taskDescription: initialTask.taskDescription || "",
    },
    formatTaskForAPI
  );

  // --------- DEBUG ------------ //

  useEffect(() => {
    console.log(formValues)
  },[])


  // ------------------- CONTROLE DO FETCH ----------------

  const { fetchData:createTask } = useFetch('http://localhost:8000/createTask', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formatTaskForAPI(formValues))
  }) 

  const { fetchData:updateTask } = useFetch('http://localhost:8000/updateTask', {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formatTaskForAPI(formValues))
    })

  // -------------- USE EFFECTS ---------------------- / /


  // --------------EVENT HANDLERS----------------------


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // console.log(formValues)
    formValues.id ? await updateTask() : await createTask()
    triggerRender()
    closeModal()
    console.log("Submitei")
  }

  return (

    <div>

      <div id="modalDiv" className="modal-shown">

        {/*Modal Container*/}
        <form className="modal-content" onSubmit={handleSubmit}>
            <p className="modal-title">Novo evento</p>

            <input name="taskName" placeholder="Título do Evento" value={formValues.taskName} onChange={handleInputChange} type="text" /><br />

            <div className="event-details">
              <section className="event-duration">
                <div>
                  <label> Hora Início </label>
                  <input
                    name="startDay" onChange={handleInputChange} type="date"
                    value={formValues.startDay}
                  />

                  {formValues.fullDay?
                    "":
                    <input name="startTime" onChange={handleInputChange} type="time"
                      value={formValues.startTime}
                    />
                  }
                </div>
               
                <div>
                  <label> Hora Fim </label>
                  <input name="endDay" onChange={handleInputChange} type="date"
                  value={formValues.endDay}/>
                  {formValues.fullDay? "":<input name="endTime" onChange={handleInputChange} type="time" 
                  value={formValues.endTime} />}
                </div>
              </section>
              
              <label>
                <input
                  name="fullDay"
                  type="checkbox"
                  onChange={handleInputChange}
                  // value={formValues.fullDay}/*/
                  checked={formValues.fullDay}
                />
                Dia Inteiro
              </label><br/>

              <input name="place" placeholder="Local" value={formValues.place} onChange={handleInputChange} type="text" /><br />
              <input name="taskDescription" placeholder="Descrição" value={formValues.taskDescription} onChange={handleInputChange} type="text"/><br />

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
