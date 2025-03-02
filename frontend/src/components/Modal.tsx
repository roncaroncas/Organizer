import { useState, useEffect, useRef } from "react"
import {useNavigate} from 'react-router-dom'


function Modal ({page})  {

  const [showModal, setShowModal] = useState<boolean>(false)

  return (

    <div>

      {/*Botão para abrir o Modal*/}
      <div className="button-container">
        <button onClick={() => setShowModal(!showModal)}>Novo</button>
      </div>

      {/*Modal div*/}
      <div id="modalDiv"
        className={[
          showModal ? "modal-shown" : "modal-hidden",
        ].join(' ')}
      >

        {/*Modal Container*/}           
        {page}

        {/*Botões do Modal */}
        <div className="button-container">
            <button onClick={handleSubmit}>Salvar</button>
          </div>

        <div className="button-container">
          <button onClick={() => setShowModal(!showModal)}>Fechar</button>
        </div>     

        <br/>
   
      </div>  
    </div>

  );
};

export default AddNewTask;
