import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'

interface Task {
  taskName: string;
  startDay: Date;
  startTime: string;
  endDay: Date;
  endTime: string;
  place: string;
  withHour: boolean;
  taskDescription: string;
}

function AddNewTask() {

  ///////////ADICIONAR TASK NOVA////////////////

  let navigate = useNavigate()

// PARAMETROS DO FORMS
  const [task, setTask] = useState<Task>({
    taskName: '',
    startDay: new Date(),
    startTime: "",
    endDay: new Date(),
    endTime: "",
    place: "",
    withHour: true,
    taskDescription: ""
  });

  // CONTROLE DE MODAL
  const [showModal, setShowModal] = useState<boolean>(false)

  window.addEventListener('click', (event) => handleClickOutModal(event))

  function handleClickOutModal(event) {
    if (event.target == document.getElementById('modalDiv')) {
      setShowModal(false)
    }
  }


async function createTask(){

    let fullStartDate = new Date(
      task.startDay.getFullYear(),
      task.startDay.getMonth(),
      task.startDay.getDay(),
      parseInt(task.startTime.slice(0,2)),
      parseInt(task.startTime.slice(3,5))
    )

    setTask(prevTask => {
      let newTask = { ...prevTask }
      newTask.startDay = fullStartDate
      return newTask
    })

    let fullEndDate = new Date(
      task.endDay.getFullYear(),
      task.endDay.getMonth(),
      task.endDay.getDay(),
      parseInt(task.endTime.slice(0,2)),
      parseInt(task.endTime.slice(3,5))
    )

    setTask(prevTask => {
      let newTask = { ...prevTask }
      newTask.endDay = fullEndDate
      return newTask
    })

    const formattedTask = {
      ...task,
      startDayTime: task.startDay.toISOString(),
      endDayTime: task.endDay.toISOString()
    };

    delete formattedTask.startDay
    delete formattedTask.startTime
    delete formattedTask.endDay
    delete formattedTask.endTime

    console.log(formattedTask)
    console.log("é o de cima")



   const data = await fetch('http://localhost:8000/createTask', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedTask)
    }).then(data => data.json())

    return data; 

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setTask(prevTask => {
      let newTask = { ...prevTask };

      if (name === "startDay") {
        newTask.startDay = new Date(value);
      } else if (name === "startTime") {
        newTask.startTime = value;
      } else if (name === "endDay") {
        newTask.endDay = new Date(value);
      } else if (name === "endTime") {
        newTask.endTime = value;
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
    const response = await createTask()
    console.log(response)
    if (response) {
      console.log("Evento adicionado! :D")
    } else {
      console.log("Evento nao adicionado :(")
    }

   // navigate(0) //jeito porco de atualizar a lista de tasks

  }


  return (

    <div>

      {/*Botão para abrir o Modal*/}
      <div className="button-container">
        <button onClick={() => setShowModal(!showModal)}>Criar Novo Evento</button>
      </div>

      {/*Modal div*/}
      <div id="modalDiv"
        className={[
          showModal ? "modal-shown" : "modal-hidden",
        ].join(' ')}
      >

        {/*Modal Container*/}

        <form className="modal-content" onSubmit={handleSubmit}>
          <p className="modal-title">Novo evento</p>

          <input name="taskName" placeholder="Título do Evento" onChange={handleInputChange} type="text" /><br />

          <div className="event-details">
            <section className="event-duration">
              <div>
                <label> Hora Início </label>
                <input name="startDay" placeholder="startDay" onChange={handleInputChange} type="date" />
                <input name="startTime" placeholder="startTime" onChange={handleInputChange} type="time" />
              </div>
              <div>
                <label> Hora Fim </label>
                <input name="endDay" placeholder="endDay" onChange={handleInputChange} type="date" />
                <input name="endTime" placeholder="endTime" onChange={handleInputChange} type="time" />
              </div>
            </section>
            <label>
              <input
                name="withHour"
                type="checkbox"
                onChange={handleInputChange}
              />
              Dia Inteiro
            </label><br />


            <input name="place" placeholder="Local" onChange={handleInputChange} type="text" /><br />
            <input name="taskDescription" placeholder="Descrição" onChange={handleInputChange} type="text" /><br />



          </div>
          <div className="form-footer">
            <button type="button" onClick={() => setShowModal(!showModal)}>Fechar</button>
            <button type="submit">Adicionar</button>
          </div>
        </form>

        <br />

      </div>
    </div>

  );
};

export default AddNewTask;
