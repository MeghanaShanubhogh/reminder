/* POST /reminder */
const util = require('./util.js')
const dynamoDB = require('aws-sdk/clients/dynamodb');
const moment = require('moment');
const { v4 : uuidv4} = require('uuid');

const documentCLient = new dynamoDB.DocumentClient( {region:"us-east-1"});
const tableName = process.env.reminder_table;


module.exports.handler = async(event)=>{
    try{
        let item = JSON.parse(event.body).Item;
        item.email_id = util.getUserEmail(event.headers);
        item.username = util.getUserName(event.headers);
        item.reminder_id = uuidv4();
        item.expiry_date = moment(item.alarm_time).unix();
        let params = {
            TableName:tableName,
            Item: item 
        };
        let data = await documentCLient.put(params).promise();
        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(item)
        }
    }
    catch(err)
    {
        console.log(err);
        return {
            statusCode: err.statusCode? err.statusCode:500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name : "Exception",
                message: err.message ? err.message : "Unknown error"
            })
        };
    }
    
};