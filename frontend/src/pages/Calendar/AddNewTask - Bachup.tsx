import { useState, useEffect, useRef } from "react"
import {useNavigate} from 'react-router-dom'

interface Task {
  taskName: string;
  startTime: string;
  endTime: string;
  place: string;
  withHour: string;
  longDescription: string;
}

function AddNewTask ()  {

///////////ADICIONAR TASK NOVA////////////////

  let navigate = useNavigate()

  // TA TUDO DEFINIDO COMO STRING!, TEM QUE ACERTAR!

  const [taskName, setTaskName] = useState('')
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [place, setPlace] = useState<string>('')
  const [withHour, setWithHour] = useState<string>("")
  const [longDescription, setLongDescription] = useState<string>('')

  const [showModal, setShowModal] = useState<boolean>(false)

  async function createTask(){

    const message = {
      'taskName': taskName,
      'startTime': startTime,
      'endTime': endTime,
      'place': place,
      'withHour': withHour,
      'longDescription' : longDescription,
    }

    await fetch('http://localhost:8000/createTask', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    }).then(data => data.json())

    return null

  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault() //DEVE TER UM JEITO MELHOR DO QUE ISSO AQUI 
    const response = await createTask ()
    console.log(response)

    if (response) {
      console.log("Evento adicionado! :D")
    } else {
      console.log("Evento nao adicionado :(")
    }

    //jeito porco de atualizar a lista de tasks
    navigate(0)

  }

  window.addEventListener('click', (event) => handleClickOutModal(event))

  function handleClickOutModal(event) {
    if (event.target == document.getElementById('modalDiv')) {
        setShowModal(false)
    }
  }


  return (

    <div>

      {/*Botão para abrir o Modal*/}
      <div className="button-container">
        <button onClick={() => setShowModal(!showModal)}>Crie um Novo Evento</button>
      </div>

      {/*Modal div*/}
      <div id="modalDiv"
        className={[
          showModal ? "modal-shown" : "modal-hidden",
        ].join(' ')}
      >

        {/*Modal Container*/}
           
        <form className = "modal-content">
          <p> Crie um novo Evento! </p> 
          <input placeholder="taskName" onChange={(e) => setTaskName(e.target.value)}></input>
          <br/>
          <input placeholder = "startTime" onChange={(e) => setStartTime(e.target.value)}></input>
          <br/>
          <input placeholder = "endTime" onChange={(e) => setEndTime(e.target.value)}></input>
          <br/>
          <input placeholder = "place" onChange={(e) => setPlace(e.target.value)}></input>
          <br/>
          <input placeholder = "withHour" onChange={(e) => setWithHour(e.target.value)}></input>
          <br/>
          <input placeholder = "longDescription" onChange={(e) => setLongDescription(e.target.value)}></input>
          <br/>
          
          <div className="button-container">
            <button onClick={handleSubmit}>Adicionar</button>
          </div>

          <div className="button-container">
            <button onClick={() => setShowModal(!showModal)}>Close</button>
          </div>

        </form>     

        <br/>
   
      </div>  
    </div>

  );
};

export default AddNewTask;
