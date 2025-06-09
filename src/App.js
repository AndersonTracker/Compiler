 
import './App.css';
import { ControllerGlobal } from './Utils/ControllerGlobal';
import { Toaster } from 'react-hot-toast';

function App() {
  const { state: { sentence }, actions: { changeSentenceGrammar }} = ControllerGlobal();

  return (
    <>
      <Toaster />
      <div className="mt-3 d-flex justify-content-center">
        <div className="col-md-11">
          <h1 className="m-2 text-center border">Table Parser
          </h1>
          <div className=" justify-content-between my-3">

            <div className="input-group w-auto gap-3">
              <input value={sentence} onChange={(e) => changeSentenceGrammar(e.target.value)} type="text" className="form-control" placeholder="Sentence to analyze" />
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default App;
