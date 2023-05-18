/* email notify */
const util = require('./util.js')
const SES = require('aws-sdk/clients/ses');
const moment = require('moment');
const ses = new SES({region: "us-east-1"});
const tableName = process.env.reminder_table;

const generateEmail = (dataObj)=>{
    console.log(dataObj);
    let alarm_dt_tm = moment.unix(decodeURIComponent(dataObj.expiry_date.N));
    let text = `Reminder Details:<b>${decodeURIComponent(dataObj.description.S)}</b>
                <br/>Details: <a href="https://my.example.com">Reminder</a><br/>
                <br/>Alarm Time:${alarm_dt_tm.format("dddd, Do MMM YYYY, h:mm:ss A")}<br/>`;
    let subject = `Reminder -  ${decodeURIComponent(dataObj.reminder.S)}`;
    let toAddress = decodeURIComponent(dataObj.email_id.S);
    let emailContent = {
        Destination: {
          ToAddresses: [toAddress]
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: text
            },
            Text: {
              Charset: "UTF-8",
              Data: text
            }
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject
          }
        },
        Source: "meghanaaws1@gmail.com",
        SourceArn: "arn:aws:ses:us-east-1:156326229501:identity/meghanaaws1@gmail.com",
        Tags: [
          {
            Name: "sender",
            Value: "Megx"
          }
        ]
      };
    return emailContent;
};

module.exports.handler = async(event)=>{
    try{
            let OldImage = event.Records[0].dynamodb.OldImage;
            let params = generateEmail(OldImage);
            let res = await ses.sendEmail(params).promise();
    }
    catch(err)
    {
        console.log("err"+err);
    }
    
};