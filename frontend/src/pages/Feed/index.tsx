import {useEffect, useState} from "react";

import { format } from 'date-fns';

import Header from "../../components/Header";

function Feed ({ removeCookie }:{removeCookie:any})  {


  let [feed, setFeed] = useState([
    {
      id: 1,
      author: { id: 101, name: "Alice" },
      timestamp: "2025-03-09T12:00:00Z",
      text: "Hello world! This is my first post."
    },
    {
      id: 2,
      author: { id: 102, name: "Bob" },
      timestamp: "2025-03-09T13:15:00Z",
      text: "Just had a great workout! Feeling strong."
    },
    {
      id: 3,
      author: { id: 103, name: "Charlie" },
      timestamp: "2025-03-09T14:30:00Z",
      text: "Anyone up for a coding challenge?"
    },
    {
      id: 4,
      author: { id: 104, name: "David" },
      timestamp: "2025-03-09T15:00:00Z",
      text: "Enjoying a sunny day at the park!"
    },
    {
      id: 5,
      author: { id: 105, name: "Eve" },
      timestamp: "2025-03-09T16:20:00Z",
      text: "Just finished reading an amazing book!"
    },
    {
      id: 6,
      author: { id: 106, name: "Frank" },
      timestamp: "2025-03-09T17:45:00Z",
      text: "Cooking up something delicious tonight."
    },
    {
      id: 7,
      author: { id: 107, name: "Grace" },
      timestamp: "2025-03-09T18:30:00Z",
      text: "Excited for the weekend plans!"
    },
    {
      id: 8,
      author: { id: 108, name: "Hank" },
      timestamp: "2025-03-09T19:10:00Z",
      text: "Just hit a new personal best in my run!"
    },
    {
      id: 9,
      author: { id: 109, name: "Ivy" },
      timestamp: "2025-03-09T20:00:00Z",
      text: "Working on a new art piece, can't wait to share!"
    },
    {
      id: 10,
      author: { id: 110, name: "Jack" },
      timestamp: "2025-03-09T21:25:00Z",
      text: "Just watched an incredible movie!"
    },
    {
      id: 11,
      author: { id: 111, name: "Kim" },
      timestamp: "2025-03-09T22:15:00Z",
      text: "Late-night coding session in progress!"
    },
    {
      id: 12,
      author: { id: 112, name: "Leo" },
      timestamp: "2025-03-09T23:40:00Z",
      text: "Reflecting on a productive day."
    }
  ]);


  let structuredFeed = feed.map((post) => {

    return (
      <div key={post.id} className="card-container">
        <strong> {post.author.name} </strong>
        <p> {format(post.timestamp, "hh/MM/yy - hh:mm")}</p>
        <p> {post.text} </p>
      </div>
      )
  })



  return (
    <div>

      <Header removeCookie={removeCookie}/>

      <div className="pagebody">

        {/* --- Novo Post --- */}
        <div className="card-container">
          <h3> O que você está pensando? </h3>
          <input type="text"/>

          <button className ="btn accept">
            Publicar!
          </button>
        </div>

        <div className="container">
          <h3> Meu Feed! </h3>      
          {structuredFeed}
          <br/>

        </div>
       


      </div>
   
    </div>
  )
};

export default Feed;
