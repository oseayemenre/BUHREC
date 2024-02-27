import { app } from ".";
import { PORT } from "./secret";

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
