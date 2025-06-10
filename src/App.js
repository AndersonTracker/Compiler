 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import { ControllerGlobal } from './utils/ControllerGlobal';
import { Toaster } from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import TableFirstFollow from './utils/TableFirstFollow';

function App() {
  const [OpenModal, setOpenModal] = useState(false);
  const { state: { resolver, iteration } } = ControllerGlobal();
  const tableRef = useRef(null);
  const { 
    state: { sentence }, 
    actions: { 
      SentenceSuccess,
      next,
      SentenceError,
      changeSentenceGrammar,
      ResolverSentence
    }} = ControllerGlobal();

  useEffect(() => {
    const scrollContainer = document.getElementById('table');
    if (iteration <= 1) document.getElementById('tablecontainer')?.scrollTo({ top: 0, behavior: 'smooth' });
    const linhaDesejada = scrollContainer?.rows?.[iteration];
    linhaDesejada?.scrollIntoView({ behavior: 'smooth' });
  }, [iteration]);

  return (
    <>
      <Toaster />
      <div className="mt-3 d-flex justify-content-center">
        <div className="col-md-11">
          <h3 className="m-2 text-center border">Table Driven Parser
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
                <Button style={{ backgroundColor: 'green', color: 'black', border: 'none', fontWeight: 'bolder' }} onClick={ResolverSentence} >Resolver Sentence</Button>
                
                <Button style={{ backgroundColor: 'black', color: 'white', border: 'none', fontWeight: 'bolder', marginLeft: "auto"}} onClick={() => setOpenModal(true)} >Table</Button>
                <TableFirstFollow show={OpenModal} onHide={() => setOpenModal(false)} />
            </div>
           
          </div>
          <div className="table-wrapper-scroll-y my-custom-scrollbar mt-4" id="tablecontainer" ref={tableRef}>
            <table className="table table-bordered table-striped" id="table">
              <thead className="sticky-top">
                <tr className="text-center">
                  <th>#</th>
                  <th>Pile</th>
                  <th>Entry</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {resolver.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{rowIndex + 1}</td>
                    {row.map((td, tdIndex) => (
                      <td key={tdIndex}>{td}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div >
    </>
  );
}

export default App;
