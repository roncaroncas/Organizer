import {useEffect, useState} from "react";
import { FormEvent } from 'react';

import Header from "../../components/Header"
import useFetch from "../../hooks/useFetch"
import useForm from "../../hooks/useForm"

interface User {
  id: number,
  name: string,
};

interface Group {
  id: number,
  name: string,
  description: string,
  users: User[],
};

interface FormData {
  name: string,
  description: string,
}

function FriendGroups ()  {


 let [groups, setGroups] = useState<Group[]>([])

 // let [newGroup, setNewGroup] = useState<Group>({
 //  name: "",
 //  description: "",
 // })



  // ------ FORMS ----- //

  const initialValues: FormData = {
    name: "",
    description: "",
  }

  const formatForAPI = (values: FormData):Group => {
    return {
      id: 0,
      name: values.name,
      description: values.description,
      users: [],
    };
  };

  const { formValues, handleInputChange, getFormattedData/*, resetForm*/ } = useForm<FormData>(initialValues, formatForAPI);
  const formattedData = getFormattedData()

  
 //---- FETCHES ------ //

  //Fetch groupsData
  const { data, /*error, isLoading,*/ fetchData } = useFetch('http://localhost:8000/group/getAll', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  //Fetch addNewGroup
  const { data: data_post, /*error: error_post, isLoading: isLoading_post,*/ fetchData: fetchData_post } = useFetch('http://localhost:8000/group/add', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formattedData),
  });

  useEffect(() => {
    fetchData()
  }, [,data_post])

  useEffect(() => {
    if (data) {
      setGroups(data)
    }
  }, [data])




  useEffect(() => {
    console.log(groups)
  }, [groups])

  // -------- HANDLERS ------------ // 


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    fetchData_post()
  }

  // ---------------------------------------- //

  let structuredGroups = groups.map((group: Group) => {

    return (
      <div key={group.id} className="container">
        <div className ="card-container">
          <a href={"/group/"+group.id.toString()}> <strong> {group.name} </strong> </a> 
          <p> {group.description} </p>

          {group.users.slice(0, 3).map((user: User) => {

            return (
              <div key={user.id}>
                <p> {user.name} </p>
              </div>
              )
          })}

          {group.users.length > 3 && (
            <div>+{group.users.length - 3} more</div>
          )}         
        </div>
        <br/>
      </div>
      )
  })



  return (
    <div>

      <Header/>

      <div className="pagebody">

        <div className="card-container">
          <h3> Meus Grupos! </h3>
        </div>

        {structuredGroups}
        <br/>
       
       {/* --- Novo Grupo --- */}
        <div className="card-container">
          <form onSubmit={handleSubmit}>
            <h3> Novo Grupo! </h3>
            <input type="text" name="name" placeholder="Group Name" value={formValues.name} onChange={handleInputChange}/>
            <input type="text" name="description" placeholder="Group Description" value={formValues.description} onChange={handleInputChange}/>

            <button className ="btn accept">
              Criar
            </button>
          </form>
        </div>


       {/* --- Procurar Grupo --- */}
{/*        <div className="card-container">
          <h3> Procurar Grupo! </h3>
          <input type="text" placeholder="Group Name"/>

          <button className ="btn accept">
            Procurar Grupo!
          </button>
        </div>*/}

      </div>
   
    </div>
  )
};

export default FriendGroups;
