import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { format, addHours } from 'date-fns';

import useModal from "../../hooks/useModal";
import useFetch from "../../hooks/useFetch"

import TaskForm from "./TaskForm"

interface Task {
  taskName: string;
  startDay: Date;
  startTime: string;
  endDay: Date;
  endTime: string;
  place: string;
  fullDay: boolean;
  taskDescription: string;
}

interface AddNewTaskProps {
  initialTask?: Partial<Task>;
}

function AddNewTask({ initialTask = {} }: AddNewTaskProps) {

  ///////////ADICIONAR TASK NOVA////////////////
  let navigate = useNavigate()

  // PARAMETROS DO FORMS
  const [task, setTask] = useState<Task>({
    taskName: '',
    startDay: new Date(),
    startTime: format(new Date(), 'HH:mm'),
    endDay: addHours(new Date(), 1),
    endTime: format(addHours(new Date(), 1), 'HH:mm'),
    place: "",
    fullDay: false,
    taskDescription: "",
    ...initialTask
  });

  // ----------------   CONTROLE DE MODAL ------------------

  const { isOpen, openModal, closeModal, toggleModal } = useModal()

  useEffect(() => {
    const handleClickOutModal = (event) => {
      if (event.target === document.getElementById('modalDiv')) {
        closeModal();
      }
    };

    window.addEventListener('click', handleClickOutModal);

    return () => window.removeEventListener('click', handleClickOutModal);
  }, [closeModal]);

  // ------------------- CONTROLE DO FETCH ----------------


  const { data, error, isLoading, fetchData } = useFetch('http://localhost:8000/createTask', {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...task,
        startDayTime: new Date(
        task.startDay.getFullYear(),
        task.startDay.getMonth(),
        task.startDay.getDate(),
        parseInt(task.startTime.slice(0,2)),
        parseInt(task.startTime.slice(3,5))
      ).toISOString(),

      endDayTime: new Date(
        task.endDay.getFullYear(),
        task.endDay.getMonth(),
        task.endDay.getDate(),
        parseInt(task.endTime.slice(0,2)),
        parseInt(task.endTime.slice(3,5))
      ).toISOString()
    })
  }) 


  // ----------------------------------------

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
    await fetchData()
   // navigate(0) //jeito porco de atualizar a lista de tasks

  }


  return (

    <div>
      {/*Botão para abrir o Modal*/}
      <div className="button-container">
        <button onClick={openModal}>Criar Novo Evento</button>
      </div>

      {/*Modal div*/}
      <div id="modalDiv"
        className={[
          isOpen ? "modal-shown" : "modal-hidden",
        ].join(' ')}
      >

        {/*Modal Container*/}

        <TaskForm
          task = {task}
          setTask = {setTask}
          handleInputChange = {handleInputChange}
          handleSubmit = {handleSubmit}
          closeModal = {closeModal}
        />
        <br />
        
      </div>
    </div>

  );
};

export default AddNewTask;
