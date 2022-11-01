import {Limo, Router, Endpoint, Get} from "@limo/lib";
import {findTest} from "../../data/tests";

const returnId = (req, res) => req.query.id;

export const TestRouter = () => (
  <Router path="/tests">
    <Endpoint path="/second" method="GET">
      {async (req, res) => {
        return await findTest(req.query.id);
      }}
    </Endpoint>
    <Get>{returnId}</Get>
    <Router path="/users">
      <Get>
        {(req, res) => [{ name: 'Hello' }, { name: 'World' }]}
      </Get>
      <Router path="/:id">
        <Get>
          {(req, res) => ({ id: req.params.id })}
        </Get>
      </Router>
    </Router>
  </Router>
);
