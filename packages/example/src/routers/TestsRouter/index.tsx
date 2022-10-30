import { Limo, Router, Endpoint } from "@limo/lib";
import {findTest} from "../../data/tests";

export const TestRouter = () => (
  <Router path="/tests">
    <Endpoint path="/second" method="GET">
      {async (req, res) => {
        return await findTest(req.query.id);
      }}
    </Endpoint>
  </Router>
);
