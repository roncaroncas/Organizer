import {useState} from "react";
import {useNavigate} from 'react-router-dom'

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

  async function createTask(){

    let message = {
      'taskName': taskName,
      'startTime': startTime,
      'endTime': endTime,
      'place': place,
      'withHour': withHour,
      'longDescription' : longDescription,
    }
    console.log(message)
    const results = await fetch('http://localhost:8000/createTask', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
    })
      .then(data => data.json())
    // .then(data => data.blabla)

    return results

  }

  async function handleSubmit(event: any) {

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

  return (
    <div>

      <div className = "centralized-button">
        <form>
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
          <button onClick={handleSubmit}>Adicionar</button>
          <br/>
        </form>
      </div>  
      <br/>
   
    </div>

  );
};

export default AddNewTask;
