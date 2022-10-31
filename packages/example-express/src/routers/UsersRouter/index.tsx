import Limo, {Router, Get, Post} from "@limo/lib";
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

export const UserRouter = () => (
  <Router path="/users">
    <Get>
      <GetUser />
    </Get>
    <Post>
      <CreateUser />
    </Post>
    <Get path="/all">
      <GetUsers />
    </Get>
  </Router>
);
