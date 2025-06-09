 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import { ControllerGlobal } from './Utils/ControllerGlobal';
import { Toaster } from 'react-hot-toast';

function App() {
  
  const { 
    state: { sentence }, 
    actions: { 
      SentenceSuccess,
      next,
      SentenceError,
      changeSentenceGrammar 
    }} = ControllerGlobal();

  return (
    <>
      <Toaster />
      <div className="mt-3 d-flex justify-content-center">
        <div className="col-md-11">
          <h3 className="m-2 text-center border">Table Parser
          </h3>
          <div className=" justify-content-between my-3">

            <div className="input-group w-auto gap-3">
              <input value={sentence} onChange={(e) => changeSentenceGrammar(e.target.value)} type="text" className="form-control" placeholder="Sentence to analyze" />
              <div className="d-flex input-group-append gap-3">
                <Button className="btn" style={{ backgroundColor: 'green', color: 'black', border: 'none', fontWeight: 'bolder' }} onClick={() => SentenceSuccess()}>Sentence success</Button>
                <Button className="btn" style={{ backgroundColor: 'red', color: 'black', border: 'none', fontWeight: 'bolder' }} onClick={() => SentenceError()}>Sentence error</Button>
              </div>
            </div>
            <div className="d-flex input-group-append gap-3 mt-2">
                <Button className="btn btn-warning" style={{ border: 'none', fontWeight: 'bolder' }} onClick={next}>Next</Button>
                <Button style={{ backgroundColor: 'green', color: 'black', border: 'none', fontWeight: 'bolder' }} >Resolver Sentence</Button>
                
                <Button style={{ backgroundColor: 'black', color: 'white', border: 'none', fontWeight: 'bolder', marginLeft: "auto"}} >Table</Button>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default App;
