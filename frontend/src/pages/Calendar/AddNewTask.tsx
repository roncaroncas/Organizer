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
  longDescription: string;
}

function AddNewTask() {

  ///////////ADICIONAR TASK NOVA////////////////

  let navigate = useNavigate()

  // PARAMETROS DO FORMS
  const [task, setTask] = useState<Task>({
    taskName: '',
    startDayTime: new Date(),
    endDayTime: new Date(),
    place: '',
    withHour: true,
    longDescription: ''
  });

  // CONTROLE DE MODAL
  const [showModal, setShowModal] = useState<boolean>(false)

  window.addEventListener('click', (event) => handleClickOutModal(event))

  function handleClickOutModal(event) {
    if (event.target == document.getElementById('modalDiv')) {
      setShowModal(false)
    }
  }


  async function createTask() {

    await fetch('http://localhost:8000/createTask', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...task,
        startDay: task.startDay.toISOString(),
        endDay: task.endDay.toISOString()
      })
    }).then(data => data.json())

    return null
  }

  // EVENT HANDLERS

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    console.log(name, value, type, checked);

    setTask(prevTask => {

      if (type === "checkbox") {
        return {
          ...prevTask,
          [name]: checked
        };
      } else if (type === "date") {
        return {
          ...prevTask,
          [name]: value ? new Date(value) : null
        };
      } else if (type === "time") {
        return {
          ...prevTask,
          [name]: value
        };
      } else if (type === "datetime-local") {
        return {
          ...prevTask,
          [name]: value ? new Date(value) : null
        };
      } else {
        return {
          ...prevTask,
          [name]: value
        };
      }
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

    navigate(0) //jeito porco de atualizar a lista de tasks

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
