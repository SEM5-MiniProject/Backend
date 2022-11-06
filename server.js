const connectDB = require('./db/connect');
const log = require('./log');
const app = require('./bin/app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  log.info(`http://localhost:${PORT}`);
});
