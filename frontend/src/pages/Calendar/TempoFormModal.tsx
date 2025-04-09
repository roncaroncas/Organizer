import { format, addHours } from 'date-fns';

import {useEffect, useState} from "react"

import useForm from "../../hooks/useForm"
import useFetch from "../../hooks/useFetch"



//  ------- INTERFACES ------- //

// -------------------

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
  initialTempo: TempoBase
  id: number
  closeModal: () => void;
  triggerRender: () => void
}

// -------- FORMATED VALUE FOR API ------- //

const formatTempoForAPI = (values: TempoFormData): Tempo => {

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
    id: values.id,
    name: values.name,
    startTimestamp: startDayTime,
    endTimestamp: endDayTime,
    place: values.place,
    fullDay: values.fullDay,
    description: values.description,
  }

  return t;
};


function TempoFormModal({id, closeModal,  triggerRender, initialTempo = {}}: TempoModalProps) {
  

  // ------------- CONTROLE DO FORMS ------------- //
  const { formValues, handleInputChange, /*getFormattedData */} = useForm<TempoFormData>(
    {
      id: id ? id : 0,
      name: initialTempo.name || "",
      startDay: initialTempo.startTimestamp ? format(initialTempo.startTimestamp, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      startTime: initialTempo.startTimestamp ? format(initialTempo.startTimestamp, "HH:mm") : "",
      endDay: initialTempo.endTimestamp ? format(initialTempo.endTimestamp, "yyyy-MM-dd") : format(addHours(new Date(), 1), "yyyy-MM-dd"),
      endTime: initialTempo.endTimestamp ? format(initialTempo.endTimestamp, "HH:mm") : "",
      place: initialTempo.place || "",
      fullDay: initialTempo.fullDay || false,
      description: initialTempo.description || "",
    },
    formatTempoForAPI
  );


  // ------------------- CONTROLE DO FETCH ----------------

  const { data, fetchData:createTempo } = useFetch('http://localhost:8000/tempo/create', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formatTempoForAPI(formValues))
  })

  const { data:data_updated, fetchData:updateTempo } = useFetch('http://localhost:8000/tempo/update', {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formatTempoForAPI(formValues))
    })

  // --------------EVENT HANDLERS----------------------


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    formValues.id!=0 ? await updateTempo() : await createTempo()
    closeModal()
  }

  useEffect(() => {
    triggerRender()
  },[data, data_updated])


  // ---------------------- 

  const [users, setUsers] = useState([
    // { id: 1, name: 'Usuário 1' },
    // { id: 2, name: 'Usuário 2' },
  ]);

  const [newUser, setNewUser] = useState('')

  const handleAddUser = () => {
    if (newUser.trim()) {
      setUsers([...users, { id: users.length + 1, name: newUser }]);
      setNewUser(''); // Clear input after adding
    }
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };


  // --------- DEBUG ------------ //

  useEffect(() => {
    if (formValues){
      console.log(formValues)
    }
  },[formValues])

  // ----------------------

  return (

    <div id="modalDiv" className="modal-shown">

      {/*Modal Container*/}
      <form className="modal-container" onSubmit={handleSubmit}>

        <div className="modal-section modal-section-col-12"> 
          <label><h3>Novo evento</h3>
            <input name="name" placeholder="Título do Evento" value={formValues.name} onChange={handleInputChange} type="text" /><br />
          </label>
        </div>

        <div className="modal-section modal-section-col-08">
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

        <div className="modal-section modal-section-col-04">         

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
              <input
                type="text"
                placeholder="Adicionar novo usuário"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
              />
              <button className = "btn accept" type="button" onClick={handleAddUser}>Adicionar</button>
            </div>
          </div>
        </div>

        <div className="modal-section modal-section-col-12">         
            <label>Local
              <input name="place" placeholder="Local" value={formValues.place} onChange={handleInputChange} type="text" /><br />
            </label>

            <label>Descrição
            <input name="description" placeholder="Descrição" value={formValues.description} onChange={handleInputChange} type="text"/><br />
            </label>
        </div>
        
        <div className="modal-section modal-section-col-12">         
          <div className="form-footer">
            <button className= "btn cancel" type="button" onClick={closeModal}>Fechar</button>
            <button className= "btn accept" type="submit">Salvar</button>
          </div>
        </div>

      </form>

      <br/>

    </div>

  );
};

export default TempoFormModal;
