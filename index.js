const express = require('express');
const app = express();
const {connection} = require('./db');
const cors = require('cors');
const {userRouter} = require("./routes/user.routes");
const {employeeRouter} = require("./routes/employee.routes")
require('dotenv').config();

app.use(cors())
app.use(express.json());

app.use("/user", userRouter)
app.use("/employees", employeeRouter);

app.listen(process.env.port, async () => {
 try {
    await connection
    console.log('connected to db');
    console.log(`server is runing at port ${process.env.port}`)
 } catch (error) {
    console.log(error)
 }

})