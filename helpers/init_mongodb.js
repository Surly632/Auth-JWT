const mongoose = require('mongoose');

mongoose
.connect(process.env.MONGO_URL)
.then(()=>{console.log('Connected to the database...');})
.catch((err)=>{console.log(err.message);})

mongoose.connection.on('connected',()=>{
    console.log('Mongoose connected to the database...');
})
mongoose.connection.on('error',(err)=>{
     console.log(err.message);
})
mongoose.connection.on('disconnected',()=>{
    console.log('Mongoose is disconnected from the database');
})
process.on('SIGINT',async()=>{
    await mongoose.connection.close();
    process.exit(0);
})
