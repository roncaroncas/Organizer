import React from "react";

import Header from "./Header";


function Calendar ({removeCookie})  {

  return (
    <Header removeCookie={removeCookie}/>
  );
};

export default Calendar;
