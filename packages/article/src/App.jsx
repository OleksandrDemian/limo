import CustomJsxProcessor from "./CustomJsxProcessor";
import {UserRouter} from "./routes/Users";
import {FastifyApp} from "./components/FastifyApp";

export const App = () => {
  const port = 3000;
  const options = {
    logger: false,
  };
  
  const onStart = () => console.log(`App started on port ${port}`);

  return (
    <FastifyApp
      port={port}
      fastifyOptions={options}
      onStart={onStart}
    >
      <UserRouter/>
    </FastifyApp>
  );
}