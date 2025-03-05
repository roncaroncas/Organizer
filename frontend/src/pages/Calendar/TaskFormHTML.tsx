import React from "react"
import { format, addHours } from 'date-fns';

function TaskFormHTML({task, setTask, handleInputChange, handleSubmit, closeModal}) {


  return(
    <form className="modal-content" onSubmit={handleSubmit}>
      <p className="modal-title">Novo evento</p>

      <input name="taskName" placeholder="Título do Evento" value={task.taskName} onChange={handleInputChange} type="text" /><br />

      <div className="event-details">
        <section className="event-duration">
          <div>
            <label> Hora Início </label>
            <input
              name="startDay" placeholder="startDay" onChange={handleInputChange} type="date"
              value={format(task.startDayTime, 'yyyy-MM-dd')}/>
              {task.fullDay? "":<input name="startTime" placeholder="startTime" onChange={handleInputChange} type="time"
              value={format(task.startDayTime, 'HH:mm')} />}
          </div>
         
          <div>
            <label> Hora Fim </label>
            <input name="endDay" placeholder="endDay" onChange={handleInputChange} type="date"
            value={format(task.endDayTime, 'yyyy-MM-dd')}/>
            {task.fullDay? "":<input name="endTime" placeholder="endTime" onChange={handleInputChange} type="time" 
            value={format(task.endDayTime, 'HH:mm')} />}
          </div>
        </section>
        
        <label>
          <input
            name="fullDay"
            type="checkbox"
            onChange={handleInputChange}
            value={task.fullDay}
          />
          Dia Inteiro
        </label><br/>

        <input name="place" placeholder="Local" value={task.place} onChange={handleInputChange} type="text" /><br />
        <input name="taskDescription" placeholder="Descrição" value={task.taskDescription} onChange={handleInputChange} type="text"/><br />

      </div>
      <div className="form-footer">
        <button type="button" onClick={closeModal}>Fechar</button>
        <button type="submit">Adicionar</button>
      </div>
    </form>
  )

}

export default TaskFormHTML