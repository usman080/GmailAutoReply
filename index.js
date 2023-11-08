const {google} = require("googleapis")

const CLIENT_ID = "Your Client Id";
const CLIENT_SECRET = "Your Client Secret";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN ="Your Refresh Code";

const oauthuser = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oauthuser.setCredentials({refresh_token:REFRESH_TOKEN});

const repliedUsers = new Set();

async function createReplyRaw(To, From, Subject) {
    const emailContent = `From:${To}\nTo: ${From}\nSubject: ${Subject}\n\nThank You for message. But I am on Leave right now...`;
    return Buffer.from(emailContent)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

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

function getRandom(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

setInterval(checkNewMails,getRandom(45,120)*1000);
