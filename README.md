# GmailAutoReplyBot
It is NodeJS based application for the auto reply to your mail when you are on vacation.

Getting Started

First Thing to do go to Google Cloud Console and set up the OAuth 2.0 authentication for your application, follow these steps:

1. Go to the Google Cloud Console (https://console.developers.google.com) and create a new project. Provide a suitable name for your project and click on the "Create" button.
2. Once the project is created, click on the project name to navigate to the project dashboard.
3. In the left sidebar, click on the "Credentials" tab under the "APIs & Services" section.
4. On the Credentials page, click on the "Create credentials" button and select "OAuth client ID" from the dropdown menu.
5. Select the application type as "Web application" and provide a name for the OAuth 2.0 client ID.
6. In the "Authorized redirect URIs" field, enter the redirect URI where you want to receive the authorization code. For this code, you can use 
 "https://developers.google.com/oauthplayground".
7. Click on the "Create" button to create the OAuth client ID. You will see a modal displaying the client ID and client secret. Copy the values of the client ID and client secret. and also enable gmail api
8. Now, open the OAuth 2.0 Playground (https://developers.google.com/oauthplayground).
9. In the OAuth 2.0 Playground, click on the settings icon (gear icon) on the top right corner. In the "OAuth 2.0 configuration" section, enter the client ID and client secret obtained in the previous step.
10. Scroll down and find the "Step 1: Select & authorize APIs" section. In the input box, enter https://mail.google.com and select the appropriate Gmail API scope. 11. Click on the "Authorize APIs" button. It will redirect you to the Google account login page. Sign in with the Google account associated with the Gmail account you want to use for auto-reply.
12. After successful authorization, the OAuth 2.0 Playground will display an authorization code. Copy this code.
13. Now, click on the "Exchange authorization code for tokens" button. It will exchange the authorization code for a refresh token.
14. The OAuth 2.0 Playground will display the refresh token. Copy the refresh token value.
15. Now, in code given by me, replace the  CLIENT_ID with the client ID value. Replace CLEINT_SECRET with the client secret value. Replace REDIRECT_URI with the redirect URI value. Replace REFRESH_TOKEN with the refresh token value.
16. Also Enable Gmail api on the google console where your project is created. go to enabling api and service then serach for gmail api and enable it.

# Currently Working on this Improvements 

Where I can Improve My Code:
1. Security: As I am using direct tokens and keys for authentication which can reduce the security of user. and also might expposing user's privacy.
2. User Experience: As my application quiet unfamilar to the non technical person to use it. So there can be optimization so that the user experience might be easier and smoother.\
3. Execution error: It may be possible in some user's devices the code might get runtime errors due to their configuration issues. also this is reduced by creating the good user interface and hiding our backend processes.
4. Flexibility: as this point also comes in user experience. as we can optimize this code by giving the option to user for different people different reply template
 As right the one template is sending to all users. so there can be improvement.   


The easiest way to use my application is :

# Get the latest snapshot
[git clone https://github.com//Auto_reply_gmail_api_app.git](https://github.com/usman080/GmailAutoReply.git)

# Install NPM dependencies
npm install

#Install googleapis and nodemon
npm install googleapis nodemon

# Then simply start your app
npm start

