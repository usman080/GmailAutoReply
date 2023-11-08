// googleapis:- This is required to get the access of api services and enabling different librabries to get the access of email api.
// Oauth2 :- This class is used to authenticate the user and get refresh token to access the gmail api.
const {google} = require("googleapis")


// 1.This id , secret and redirected uri obtained from the Google Cloud Console.
//     https://console.developers.google.com by creating project there and setting up project.
//
// 2.This refreshtoken is generated from the redirected uri https://developers.google.com/  oauthplayground
//     and here authorized this https://mail.google.com scope api by email and in setting of scope api by putting client id and client secret then when authorizes done this generate
//     authorization code .
//
// 3.Exchange authorization code for refresh token by clicking on exchange text.
//
// 5.All the steps described in detail explaination available in readme.md check it .

const CLIENT_ID = "Your Client Id";
const CLIENT_SECRET = "Your Client Secret";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN ="Your Refresh Token";


//Here I have authenticated the user like "Login with GoogleAPI". which uses the refressh token to get email access.
const oauthuser = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oauthuser.setCredentials({refresh_token:REFRESH_TOKEN});

//As we have to reply one user only once. So I am maintaining the list of replied users using set as we know set store unique values.
const repliedUsers = new Set();

// This is my main function where i get the list of messages whiich are unread.
// Then I extract the from to and subject from the header of email and get their values.
// after that checking if already replied or not through the set.
// then using send class from gmail.data.messgaes to send the reply .
// To createthe reply I have created on function createreplyraw(From,To,Subject) as we have to reply in the mail format with same context or subject.
// Aslo as mentioned in the feature we have to label the mails which are replied by us . so that our client can analyse easily
// For that I have created createLabel(labelname) and used modify class of gmail.users.messages package.
async function checkNewMails() {
    try{
        const gmail = google.gmail({version: "v1", auth: oauthuser});

        const res = await gmail.users.messages.list({
            userId: "me",
            q: "is:unread",
        });
        const messages = res.data.messages;
        if (messages && messages.length > 0) {
            for (const message of messages) {
                const email = await gmail.users.messages.get({
                    userId: "me",
                    id: message.id,
                });
                //Extracrting the information from the mail header
                const from = email.data.payload.headers.find(
                    (header) => header.name === "From"
                );
                const toHeader = email.data.payload.headers.find(
                    (header) => header.name === "To"
                );
                const Subject = email.data.payload.headers.find(
                    (header) => header.name === "Subject"
                );
                const From = from.value;
                const To = toHeader.value;
                const sub = Subject.value;
                console.log("Email come From", From);
                console.log("To Email", To);
                if (repliedUsers.has(From)) {
                    console.log("Already replied to :", From);
                    continue
                }
                const thread = await gmail.users.threads.get({
                    userId: "me",
                    id: message.threadId,
                });
                const replies = thread.data.messages.slice(1);

                if (replies.length === 0) {
                    await gmail.users.messages.send({
                        userId: "me",
                        requestBody: {
                            raw: await createReplyRaw(To, From, sub),
                        },
                    });
                    const label = "onVacation";
                    await gmail.users.messages.modify({
                        userId: "me",
                        id: message.id,
                        requestBody: {
                            addLabelIds: [await createLabel(label)],
                        },
                    });

                    console.log("Sent reply to email:", From);

                    repliedUsers.add(From);
                }
            }
        }
    }catch(error){
        console.error("Something is Wrong:",error);
    }
}
// this is the reply creating function
async function createReplyRaw(To, From, Subject) {
    const emailContent = `From:${To}\nTo: ${From}\nSubject: ${Subject}\n\nThank You for message. But I am on Leave right now...`;
    return Buffer.from(emailContent)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

//here we modify the label of the mails
async function createLabel(labelName) {
    const gmail = google.gmail({version:"v1",auth: oauthuser});
    const res = await gmail.users.labels.list({
        userId: "me"
    });
    const labels = res.data.labels;
    const existingLabel = labels.find((label) => label.name===labelName);
    if(existingLabel){
        return existingLabel.id;
    }
    const newLabel = await gmail.users.labels.create({
        userId: "me",
        requestBody:{
            name:labelName,
            labelListVisibility:"labelShow",
            messageListVisibility: "show",
        },
    });
    return newLabel.data.id;
}


// As mentioned in the challange we are checking for new mails randomly after 45-120 seconds.
// function getRandom(min,max)
// {
//     return Math.floor(Math.random()*(max-min+1)+min);
// }
//
// setInterval(checkNewMails,getRandom(45,120)*1000);
function executeInRandomInterval() {
    checkNewMails().then(() => {
        // Generate a random delay between 45 and 120 seconds
        const delay = Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000;
        // Call this function again after the delay
        setTimeout(executeInRandomInterval, delay);
    });
}

executeInRandomInterval();
/*
Where I can Improve My Code:
1.Security: As I am using direct tokens and keys for authentication which can reduce the security of user. and also might expposing user's privacy.
2.User Experience: As my application quiet unfamilar to the non technical person to use it. So there can be optimization so that the user experience might be easier and smoother.\
3.Execution error: It may be possible in some user's devices the code might get runtime errors due to their configuration issues. also this is reduced by creating the good user interface and hiding our backend processes.
4.Flexibility: as this point also comes in user experience. as we can optimize this code by giving the option to user for different people different reply template
 As right the one template is sending to all users. so there can be improvement.   
 */
