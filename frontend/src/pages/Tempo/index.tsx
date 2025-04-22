import { format, addHours } from 'date-fns';

import {useEffect, useState} from "react"
import { useParams } from 'react-router-dom'

import useForm from "../../hooks/useForm"
import useFetch from "../../hooks/useFetch"
import SearchUserInput from "../../components/SearchUserInput"

//  ------- INTERFACES ------- //

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

interface TempoFormData extends Omit<TempoBase, 'startTimestamp' | 'endTimestamp'> {
  id?: number;
  startDay: string;
  startTime: string;
  endDay: string;
  endTime: string;
}

// -------------------

interface TempoModalProps {
  loadedTempo: TempoBase
  id: number
  onClose: () => void;
  triggerRender: () => void
}
// -------------


interface SimpleUser {
  id: number
  name: string
}

// -------- FORMATED VALUE FOR API ------- //

const formatTempoForAPI = (values: TempoFormData): TempoResponse => {

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

  let t:TempoResponse = {
    // id: values.id,
    name: values.name,
    startTimestamp: startDayTime,
    endTimestamp: endDayTime,
    place: values.place,
    fullDay: values.fullDay,
    description: values.description,
  }

  return t;
};

function Tempo({
  id,
  onClose = () => {},
  triggerRender = () => {},
  loadedTempo = {},
}: TempoModalProps) {

  // Controle dos usuarios // 


  const [users, setUsers] = useState<SimpleUser[]>([]);

  const [newUser, setNewUser] = useState({
    id: 0,
    name: ""
  })

  function resetNewUser() {
    setNewUser({
      id: 0,
      name: ""
    })
  }

  const handleAddUser = () => {
    if (newUser.name.trim()) {
      setUsers([...users, { id: newUser.id, name: newUser.name }]);
      resetNewUser(); // Clear input after adding
    }
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  
  // ------------- CONTROLE DO FORMS ------------- //


  const { id: paramId } = useParams<{ id?: string }>();
  // console.log(paramId)

  const tempoId = paramId ?? id;

  const { formValues, handleInputChange, getFormattedData, setForm} = useForm<TempoFormData>(
    {
      id: id ? id : 0,
      name: loadedTempo.name || "",
      startDay: loadedTempo.startTimestamp ? format(loadedTempo.startTimestamp, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      startTime: loadedTempo.startTimestamp ? format(loadedTempo.startTimestamp, "HH:mm") : "",
      endDay: loadedTempo.endTimestamp ? format(loadedTempo.endTimestamp, "yyyy-MM-dd") : format(addHours(new Date(), 1), "yyyy-MM-dd"),
      endTime: loadedTempo.endTimestamp ? format(loadedTempo.endTimestamp, "HH:mm") : "",
      place: loadedTempo.place || "",
      fullDay: loadedTempo.fullDay || false,
      description: loadedTempo.description || "",
    },
    formatTempoForAPI
  );


  // ------------------- CONTROLE DO FETCH ----------------

  const { data:data_get, fetchData:getTempo } = useFetch('http://localhost:8000/tempo/get/', {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  }, tempoId)

  const { data:data_created, fetchData:createTempo } = useFetch('http://localhost:8000/tempo/create', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...getFormattedData(),
      users
    })
  })

  const { data:data_updated, fetchData:updateTempo } = useFetch('http://localhost:8000/tempo/update/', {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      ...getFormattedData(),
      users
    })   
  }, formValues.id)

  // --- FETCH USERS!

  const { data:data_users, fetchData:getTempoUsers } = useFetch('http://localhost:8000/tempo/get/', {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }  
  }, tempoId+"/users")


  // --------------EVENT HANDLERS----------------------

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    console.log("formValues", formValues)
    console.log("getFormattedData", getFormattedData())
    console.log("formValues.startTimestamp", formValues.startTimestamp instanceof Date);

    formValues.id!=0
    ? await updateTempo()
    : await createTempo()
    onClose()
  }

  // useEffect(() => {
  //   if (paramId){
  //     getTempo()
  //     getTempoUsers()
  //   }
  // }, [paramId])

  useEffect(() => {

    if (tempoId) {
      getTempo()
      getTempoUsers()
    }
  }, [paramId, id])

// --------------------------------------

  useEffect(() => {
    if (data_get){
      const start = new Date(data_get.startTimestamp);
      const end = new Date(data_get.endTimestamp);
      // console.log(start)
      // console.log(end)
      setForm({
        id: data_get.id,
        name: data_get.name || "",
        startDay: data_get.startTimestamp ? format(new Date(start), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        startTime: data_get.startTimestamp ? format(new Date(start), "HH:mm") : "",
        endDay: data_get.endTimestamp ? format(new Date(end), "yyyy-MM-dd") : format(addHours(new Date(), 1), "yyyy-MM-dd"),
        endTime: data_get.endTimestamp ? format(new Date(end), "HH:mm") : "",
        place: data_get.place || "",
        fullDay: data_get.fullDay || false,
        description: data_get.description || "",
      })
    }
  }, [data_get])

  useEffect(() => {
    triggerRender()
  },[data_created, data_updated])

  // ---------------------- 


  useEffect(() => {
    if (newUser.name){
      handleAddUser()
    }
  },[newUser])

  useEffect(() => {
    if (data_users){
      // console.log(data_users)
      setUsers(data_users)
    }
  },[data_users])
 


  // --------- DEBUG ------------ //

  // useEffect(() => {
  //   if (formValues){
  //     console.log(formValues)
  //   }
  // },[formValues])

  // ----------------------

  return (

    <>
      {/*Modal Container*/}
      <form className="tempoForm-container" onSubmit={handleSubmit}>

        <div className="tempoForm-section section-col-12"> 
          <label><h3>Novo evento {formValues.id}</h3>
            <input name="name" placeholder="Título do Evento" value={formValues.name} onChange={handleInputChange} type="text" /><br />
          </label>
        </div>

        <div className="tempoForm-section section-col-08">
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
          </label>
        </div>

        <div className="tempoForm-section section-col-04">         

          {/*// USERS */}
          <div className="event-users">
            {users.map((user)=>{
              return(
              <div key={user.id}>
                <a href={"/profile/"+user.id}> {user.name} </a>
                <button type="button" className="reject" onClick={() => handleDeleteUser(user.id)}>Deletar</button>
              </div>
              )
            })}
            <div className="add-user-section">
              <SearchUserInput
                placeholder = "Procurar usuario..."
                onSelect={(item) => {
                  setNewUser(item);
                }}
              />
              {/*<input
                type="text"
                placeholder="Adicionar novo usuário"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
              />*/}
              <button className = "btn accept" type="button" onClick={handleAddUser}>Adicionar</button>
            </div>
          </div>
        </div>

        <div className="tempoForm-section section-col-12">         
            <label>Local
              <input name="place" placeholder="Local" value={formValues.place} onChange={handleInputChange} type="text" /><br />
            </label>

            <label>Descrição
            <input name="description" placeholder="Descrição" value={formValues.description} onChange={handleInputChange} type="text"/><br />
            </label>
        </div>
        
        <div className="tempoForm-section section-col-12">         
          <div className="form-footer">
            <button className= "btn cancel" type="button" onClick={onClose}>Fechar</button>
            <button className= "btn accept" type="submit">Salvar</button>
          </div>
        </div>

      </form>


    </>

  );
};

export default Tempo;
