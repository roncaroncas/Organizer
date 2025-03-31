
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, getISOWeek } from "date-fns";
import { addDays, /*addMonths, addYears*/ } from "date-fns";

import {/*useEffect,*/ useMemo} from "react"

// import useForm from "../../hooks/useForm"
// import useFetch from "../../hooks/useFetch"

import classNames from 'classnames';

type OnTaskClick = (task: Task) => void;
type SetModeAsDay = (date: Date) => void;
type OnNewTaskClick = () => void;

interface ModeState {
  mode: "Month" | "Week" | "Day"
  param: number
  day: Date
}

interface Task {
  id: number
  taskName: string
  startDayTime: Date;
  endDayTime: Date
  place: string
  fullDay: boolean
  taskDescription: string
  status: string
}

interface CalendarMonthProps{
  mode: ModeState,
  tasks: Task[] ,
  onTaskClick: OnTaskClick ,
  setModeAsDay: SetModeAsDay,
  onNewTaskClick: OnNewTaskClick,
}

//  --------- UTILS --------- //

function getWeek(i: Date) {
  return (i.getDay() === 0) ? getISOWeek(i) + 1 : getISOWeek(i);
}

function CalendarMonth({mode, tasks,onTaskClick, setModeAsDay, onNewTaskClick}:CalendarMonthProps) {

  // ------ HEADER ----------- //

  const calendarMonthHead = [
    
    <div key="weekHeader" className="weekNumber">
      <p> Week </p>
    </div>,

    ...["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((name) => (
      <div
        key={"weekHeader"+name}
        className={classNames("calHeader", "showColumn")}
      >
        <p>{name}</p>
      </div>
    ))
  ];


  const DayInMonthContent = (day: Date, dayTasks: Task[], mode: ModeState, onTaskClick: OnTaskClick) => {

    return([

        <div key="dateTitle" className="dateTitle">
          <a onClick={() => setModeAsDay(day)}> 
            <strong>
              {format(day, "dd/MM/yyyy")}
            </strong>
          </a>
         <a onClick={() => {
            onNewTaskClick()
          }}>          
            (+)
          </a>
        </div>,          

        <div key="dateContent" className="dateContent">
          {(mode.mode == "Week" && mode.param != getWeek(day)) ? (
            dayTasks.length === 0 ? (
              ""
            ) : (
              <>
                {dayTasks.slice(0, 3).map(task => (
                  <div key={"task__"+ task.id} className="calendarTask">
                    {format(task.startDayTime, "HH:mm")}
                    <span
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => onTaskClick(task)}
                    >        
                      ({task.id}): {task.taskName}
                    </span>

                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div>+{dayTasks.length - 3} more</div>
                )}
              </>
            )
          ) : (
            dayTasks.length === 0 ? (
              ""
            ) : (
              dayTasks.map(task => (
                <div key={"task__"+ task.id} className="calendarTask">
                  {format(task.startDayTime, "HH:mm")}
                  <a
                    href="#"
                    onClick={() => onTaskClick(task)}
                  >        
                    ({task.id}): {task.taskName}
                  </a>

                </div>
              ))
            )
          )}
        </div>    
    ]

    )
  }

const calendarMonthBody = useMemo(() => {

  const monthStart = startOfMonth(mode.day);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const weeks = [];
  let day = startDate;

  while (day <= endDate) {
    const weekStart = day;
    const week = [];

    for (let i = 0; i < 7; i++) {
      const dayTasks = tasks.filter(
        (task) => new Date(task.startDayTime).toDateString() === day.toDateString()
      );
      week.push({
        day: day,
        content: DayInMonthContent(day, dayTasks, mode, onTaskClick),
      });
      day = addDays(day, 1);
    }
    weeks.push({ weekNumber: getWeek(weekStart), days: week });
  }

  return weeks.map((week) => {
    const weekKey = format(week.days[0].day, "yyyy-MM-dd")
    return [
      // Week number div
      <div
        key={weekKey}
        className={classNames([
          "weekNumber",
          mode.mode !== "Week" ? "showRow" : mode.param === week.weekNumber ? "focusRow" : "hideRow",
        ])}
      >
        {week.weekNumber}
      </div>,

      
      // Map over days and return a div for each day
      ...week.days.map((day) => {
        return(

        <div
          key={format(day.day, "yyyyMMdd").toString()}
          id={format(day.day, "yyyyMMdd").toString()}

          className={classNames([
            "showColumn",
            "showRow",
            day.day.getMonth() === mode.day.getMonth() ? "dayInMonthCal" : "dayOutMonthCal",
          ])}

          onClick={(e) => {
            if (e.target === e.currentTarget) {onNewTaskClick()}
          }}
        >
          {day.content}
        </div>
      )}),
    ];
  });
}, [mode.day, tasks]);


//   // ------------- CONTROLE DO FORMS ------------- //
//   const { formValues, handleInputChange, /*getFormattedData */} = useForm<FormData>(
//     {
//       id: id ? id : 0,
//       taskName: initialTask.taskName || "",
//       startDay: initialTask.startDayTime ? format(initialTask.startDayTime, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
//       startTime: initialTask.startDayTime ? format(initialTask.startDayTime, "HH:mm") : "",
//       endDay: initialTask.endDayTime ? format(initialTask.endDayTime, "yyyy-MM-dd") : format(addHours(new Date(), 1), "yyyy-MM-dd"),
//       endTime: initialTask.endDayTime ? format(initialTask.endDayTime, "HH:mm") : "",
//       place: initialTask.place || "",
//       fullDay: initialTask.fullDay || false,
//       taskDescription: initialTask.taskDescription || "",
//     },
//     formatTaskForAPI
//   );

//   // --------- DEBUG ------------ //

//   useEffect(() => {
//     console.log(formValues)
//   },[])


//   // ------------------- CONTROLE DO FETCH ----------------

//   const { data, fetchData:createTask } = useFetch('http://localhost:8000/createTask', {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(formatTaskForAPI(formValues))
//   }) 

//   const { data:data_updated, fetchData:updateTask } = useFetch('http://localhost:8000/updateTask', {
//       method: "PUT",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formatTaskForAPI(formValues))
//     })

//   // -------------- USE EFFECTS ---------------------- / /


//   // --------------EVENT HANDLERS----------------------


//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault()
//     formValues.id!=0 ? await updateTask() : await createTask()
//     closeModal()
//   }

//   useEffect(() => {
//     triggerRender()
//   },[data, data_updated])

//   return (

//     <div>

//       <div id="modalDiv" className="modal-shown">

//         {/*Modal Container*/}
//         <form className="modal-content" onSubmit={handleSubmit}>
//             <p className="modal-title">Novo evento</p>

//             <input name="taskName" placeholder="Título do Evento" value={formValues.taskName} onChange={handleInputChange} type="text" /><br />

//             <div className="event-details">
//               <section className="event-duration">
//                 <div>
//                   <label> Hora Início </label>
//                   <input
//                     name="startDay" onChange={handleInputChange} type="date"
//                     value={formValues.startDay}
//                   />

//                   {formValues.fullDay?
//                     "":
//                     <input name="startTime" onChange={handleInputChange} type="time"
//                       value={formValues.startTime}
//                     />
//                   }
//                 </div>
               
//                 <div>
//                   <label> Hora Fim </label>
//                   <input name="endDay" onChange={handleInputChange} type="date"
//                   value={formValues.endDay}/>
//                   {formValues.fullDay? "":<input name="endTime" onChange={handleInputChange} type="time" 
//                   value={formValues.endTime} />}
//                 </div>
//               </section>
              
//               <label>
//                 <input
//                   name="fullDay"
//                   type="checkbox"
//                   onChange={handleInputChange}
//                   // value={formValues.fullDay}/*/
//                   checked={formValues.fullDay}
//                 />
//                 Dia Inteiro
//               </label><br/>

//               <input name="place" placeholder="Local" value={formValues.place} onChange={handleInputChange} type="text" /><br />
//               <input name="taskDescription" placeholder="Descrição" value={formValues.taskDescription} onChange={handleInputChange} type="text"/><br />

//             </div>
//             <div className="form-footer">
//               <button type="button" onClick={closeModal}>Fechar</button>
//               <button type="submit">Salvar</button>

//             </div>
//           </form>
//         <br />

//       </div>
//     </div>

//   );
// };

  return(
    <div className = "calendarGrid">
      {calendarMonthHead}
      {calendarMonthBody}
    </div>
    )
}

export default CalendarMonth;
