const mysql = require('mysql');
require('dotenv').config();

var config ={
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dateStrings: true
}

var con = mysql.createPool(config);

con.getConnection(function(err){
    if(err){
        console.log(config,err);
    }else{
        console.log('Database',process.env.DB_DATABASE,'connected successfully');
    }
});

module.exports = con;