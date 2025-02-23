import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom'

import { Box, Button, Container, Flex, Stack, Text, 
  Input, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot,
  DialogTitle, DialogTrigger, DialogActionTrigger} from "@chakra-ui/react";

import Header from "./Header";


function Friends ({cookie, removeCookie})  {

/////////////TABELA DE AMIGOS ///////////////////////////////

  const [friendList, setFriendList] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/myFriends', {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          setFriendList(data['friends'])
        })}, [])

  let structuredFriends = friendList.map( function (friend){
    return (
      <tr key={friend[0]+Math.random()}>
        <td>{friend[0]}</td>
        <td><a href={"/profile/"+friend[0]}>{friend[1]}</a></td>
      </tr>
    )
  })

///////////ADICIONAR AMIGO //////////////////////////////

  const [friendId, setFriendId] = useState('')
  let navigate = useNavigate()

  async function addFriend(friendId) {

    console.log(friendId)
    
    const results = await fetch('http://localhost:8000/addFriend', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({friendId})
      })
    .then(data => data.json())
    // .then(data => data.blabla)

    return results
  }

  async function handleSubmit(event) {

    event.preventDefault() //DEVE TER UM JEITO MELHOR DO QUE ISSO AQUI 
    const response = await addFriend (friendId)
    console.log(response)

    if (response) {
      console.log("Amigo adicionado! :D")
    } else {
      console.log("Amigo nao existe :(")
    }

    navigate(0)

  }


///////////////////////////////////////////////////
  return (

    <div>
      <Header removeCookie={removeCookie}/>

      <br/>

          <DialogRoot key={"top"} placement={"top"} motionPreset="slide-in-bottom">

        <table key="tableFriends">
          <thead>
            <tr>
              <th>Friend_Id</th>
              <th>Friend_Name</th>
            </tr>
          </thead>
          <tbody>
            {structuredFriends}
          </tbody>
        </table>

        <br/>

        <div className = "centralized-button">

          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Adicionar Amigo!
            </Button>
          </DialogTrigger>

          <DialogContent color="white">
            <DialogHeader>
              <DialogTitle>Adicionar Amigo</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Stack gap="4">
              <Input placeholder="Friend Id" onChange={(e) => setFriendId(e.target.value)}/>
              </Stack>
            </DialogBody>

            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>
              <Button onClick={handleSubmit}>Adicionar</Button>
            </DialogFooter>

            {/*<DialogCloseTrigger />*/}
          </DialogContent>

        </div>  
      </DialogRoot>


      <br/>


    </div>  
  )
}

export default Friends;
