const mongoose = require("mongoose");
const { DB_URI } = require("./env.config");

const connectDatabase = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(
        `MongoDB connected`, // with server: ${data.connection.host}
      );
    })
    .catch((err) => {
      console.error(`Database connection failed: ${err.message}`);
      process.exit(1);
    });
};

module.exports = connectDatabase;
