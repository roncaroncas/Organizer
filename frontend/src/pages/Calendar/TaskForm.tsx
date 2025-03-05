import React from "react"
import { format, addHours } from 'date-fns';

function TaskForm({task, setTask, handleInputChange, handleSubmit, closeModal}) { 

  return(
    <form className="modal-content" onSubmit={handleSubmit}>
      <p className="modal-title">Novo evento</p>

      <input name="taskName" placeholder="Título do Evento" onChange={handleInputChange} type="text" /><br />

      <div className="event-details">
        <section className="event-duration">
          <div>
            <label> Hora Início </label>
            <input
              name="startDay" placeholder="startDay" onChange={handleInputChange} type="date"
              value={format(task.startDay, 'yyyy-MM-dd')}/>
              {task.fullDay? "":<input name="startTime" placeholder="startTime" onChange={handleInputChange} type="time"
              value={task.startDay.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} />}
          </div>
         
          <div>
            <label> Hora Fim </label>
            <input name="endDay" placeholder="endDay" onChange={handleInputChange} type="date"
              value={format(task.endDay, 'yyyy-MM-dd')}/>
            {task.fullDay? "":<input name="endTime" placeholder="endTime" onChange={handleInputChange} type="time" 
            value={task.endDay.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} />}
          </div>
        </section>
        
        <label>
          <input
            name="fullDay"
            type="checkbox"
            onChange={handleInputChange}
          />
          Dia Inteiro
        </label><br/>

        <input name="place" placeholder="Local" onChange={handleInputChange} type="text" /><br />
        <input name="taskDescription" placeholder="Descrição" onChange={handleInputChange} type="text"/><br />

      </div>
      <div className="form-footer">
        <button type="button" onClick={closeModal}>Fechar</button>
        <button type="submit">Adicionar</button>
      </div>
    </form>
  )

}

export default TaskForm