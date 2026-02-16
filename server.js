require("dotenv").config();
const connectToDB = require("./src/config/database");
const app = require("./src/app");
const PORT = 3000;

connectToDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
