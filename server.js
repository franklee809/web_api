const express = require('express');
const connectDB = require('./config/db');
const app = express();
var cors = require('cors');
const path = require('path');
// Connect to the database
connectDB();


// Initialize Middleware
app.use(express.json({extended: true}));
app.use(cors());

// app.get('/', (req, res) => {  Uncomment to make use
//     res.send('API'); 
// })

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/home', require('./routes/api/home'));

if(process.env.NODE_ENV === 'production'){
    // Set static folder 
    app.use(express.static('client/build'))

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client','build','index.html'));
    })
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log('SERVER listening on port: ', PORT ));