import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { ControllerGlobal } from './ControllerGlobal';

const TableFirstFollow = (props) => {
  const {
    state: { terminal, resolver, log, topEntry, grammar, action },
    actions: { next, ResolverSentence }
  } = ControllerGlobal();

  const lastStep = resolver[resolver.length - 1] || [];
  const read = log[log.length - 1];
  let pile = (lastStep[0] || '$S').split('').reverse();
  let entry = (lastStep[1] || '$').split('');
  const readLog = (lastStep[2] || '').includes('Read');

  if (read === pile[0] && read === entry[0]) {
    pile.shift();
    entry.shift();
  }

  const buildTable = () => {
    return grammar.map(({ key, list }) => {
      const row = {};
      terminal.forEach(t => (row[t] = ''));
      list.forEach(({ nonTerminal, initial, production }) => {
        initial.forEach(t => {
          row[t] = `${nonTerminal} -> ${production}`;
        });
      });

      delete row['$'];

      return {
        key,
        cells: Object.keys(row).sort().map(t => row[t])
      };
    });
  };

  const tableData = buildTable();

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>Table Driven Parser Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">
        <div className="d-flex justify-content-around">
          <div>
            <h5>Grammar</h5>
            <p className="m-0">S ::= aBb | bAc | cCb</p>
            <p className="m-0">A ::= aCb | ε</p>
            <p className="m-0">B ::= aCa | bAb</p>
            <p className="m-0">C ::= aB | cAc</p>
          </div>
          <div>
            <h5>First</h5>
            <p className="m-0">S = {'{a, b, c}'}</p>
            <p className="m-0">A = {'{a, ε}'}</p>
            <p className="m-0">B = {'{a, b}'}</p>
            <p className="m-0">C = {'{a, c}'}</p>
          </div>
          <div>
            <h5>Follow</h5>
            <p className="m-0">S = {'{$}'}</p>
            <p className="m-0">A = {'{b, c}'}</p>
            <p className="m-0">B = {'{a, b}'}</p>
            <p className="m-0">C = {'{a, b}'}</p>
          </div>
        </div>

        <div className="d-flex flex-column justify-content-center align-items-center mt-4">
          <table className="table table-bordered table-striped">
            <thead className="sticky-top">
              <tr>
                <th className="text-center">Pile</th>
                <th></th>
                {terminal.map(t => (
                  <th key={t} className="text-center">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={tableData.length + 4} className="text-center align-bottom">
                  {pile.map((char, idx) => <span key={idx}>{char}<br /></span>)}
                </td>
              </tr>
              {tableData.map(({ key, cells }, rowIndex) => (
                <tr key={rowIndex}>
                  <th className="text-center">{key}</th>
                  {cells.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={`text-center ${action === cell && topEntry === terminal[colIndex] ? 'bg-success' : ''}`}
                    >
                      {cell}
                    </td>
                  ))}
                  <td></td>
                </tr>
              ))}
              <tr>
                <td className={`text-center py-3 ${readLog ? 'bg-success' : ''}`}>Read</td>
                <td colSpan="4" className="text-left py-3">{log}</td>
                <td className="text-center">
                <Button className="btn btn-warning" style={{ border: 'none', fontWeight: 'bolder' }} onClick={next}>Next</Button>
                </td>
              </tr>
              <tr>
                <td className="text-center py-3">Entry</td>
                <td colSpan="4" className="text-left py-3">{entry.join('')}</td>
                <td className="text-center py-3">
                <Button style={{ backgroundColor: 'green', color: 'black', border: 'none', fontWeight: 'bolder' }} onClick={ResolverSentence} >Resolver Sentence</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TableFirstFollow;