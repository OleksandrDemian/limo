import { Limo, Router, Endpoint } from "@limo/lib";
import {addUser, findUser, getUsers} from "../../data/users";

const GetUser = async (req, res) => {
  const id = req.query.id;
  return await findUser(id);
}

const CreateUser = async (req, res) => {
  const user = req.body;
  await addUser(user);
};

const GetUsers = async (req, res) => {
  return await getUsers();
}

// export const createUsersRoute = (fastify: FastifyInstance) => {
//   fastify.get('/users', GetUser);
//   fastify.post('/users', CreateUser);
// }

export const UserRouter = () => (
  <Router path="/users">
    <Endpoint path="/" method="GET">
      <GetUser />
    </Endpoint>
    <Endpoint path="/" method="POST">
      <CreateUser />
    </Endpoint>
    <Endpoint path="/all">
      <GetUsers />
    </Endpoint>
  </Router>
);
