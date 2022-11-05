import CustomJsxProcessor from "../CustomJsxProcessor";
import {Router} from "../components/Router";
import {Endpoint} from "../components/Endpoint";

const GetUser = async (req) => {
  const id = req.query.id;
  return Promise.resolve({
    id,
    message: `You requested user with id ${id}`,
  });
};

const GetAllUsers = async () => {
  return Promise.resolve({
    message: 'You requested all users',
  });
};

const PostUser = async (req) => {
  const { name, surname } = req.body;
  return Promise.resolve({
    message: `You posted user with name = "${name}" and surname = "${surname}"`,
  });
};

const NestedGet = async () => Promise.resolve({
  message: `This endpoint is nested`,
});

export const UserRouter = () => (
  <Router path="/users">
    <Endpoint method="GET">
      <GetUser />
    </Endpoint>
    <Endpoint method="POST">
      <PostUser />
    </Endpoint>
    <Endpoint method="GET" path="/all">
      <GetAllUsers />
    </Endpoint>

    {/* Nested routing, will inherit /users */}
    {/* Current implementation does not allow nested component routers */}
    <Router path="/nested">
      <Endpoint method="GET">
        <NestedGet />
      </Endpoint>
      <Endpoint method="GET" path="/no-component-example">
        {async (req, res) => {
          // you can use handlers without components
          const date = Date.now();
          return Promise.resolve({
            message: `This handler does not have component`,
            timestamp: date,
          });
        }}
      </Endpoint>
    </Router>
  </Router>
);