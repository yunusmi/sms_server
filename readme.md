<h1>SMS server for sending messages using GSM modem</h1>

<p>This application allows you to send text SMS and flash messages from your server with a connected GSM modem to recipients by phone number. The application also logs the sent messages and results, and displays them in the console in a beautiful and convenient way. The application is written in JavaScript via NodeJS & Express framework, and also uses the serialport-gsm library to access the connected USB devices via NodeJS. The application can be used both for monolithic applications and in a microservice architecture.</p>
<h2>Example of work</h2>

<p>This application makes it easy to send a message from your configured with this application server with connected GSM modem. To send a message, you need to send a POST request in JSON format from your application to your configured server. Example of the request:</p>

<pre><code>
  {
    "recipient": "+99362000000", // recipient's number (without spaces, in international format)
    "message": "Hello. this SMS from sms_server application" // message text
  }
</code></pre>

<p>The application will receive and process this request, access the modem and if no problems with the number and modem are detected, it will send a message to the specified number.</p>

<h2>Setup</h2>

<p><b>Note</b>: it is recommended to use new generations of modems, insert a SIM card with a replenished balance and/or a purchased subscription for sending (unlimited) SMS from your service provider.</p>

<h3>Prerequisites</h3>

<ul>
<li>Linux OS (recommended Ubuntu (20/04 or higher), CentOS 8)</li>
<li>Installed NodeJS version not lower than 12.0.0</li>
<li>Connected to USB port GSM modem with prepaid tariff SIM card</li>
<li>Standard Linux system drivers for working with USB ports</li>
<li>IP address (static)</li>
</ul>

<h3>Connecting and identifying the modem</h3>

<p>Before setting up, you need to connect the GSM modem with a SIM card to any available USB port on server. Next, you need to find out the address of the connected USB port by command:</p>

<pre><code>ls /dev/ttyUSB*
</code></pre>

<p>It will show the addresses of the connected USB ports (for example <b>/dev/ttyUSB0</b> or something similar, you need to remember the address of the port connected to the USB modem, it will come in handy later when setting up the application configuration). You can also use the command:</p>

<pre><code>dmesg | grep tty
</code></pre>

<p>which will display system messages about connected devices.</p>

<h3>Initialization and project setup</h3>

<p>Creating and setting up a folder for the project:</p>

<pre><code>mkdir sms_server && cd sms_server
</code></pre>

<p>Downloading the application from the stable branch of the GitHub project repository:</p>

<pre><code>git clone https://github.com/yunusmi/sms_server.git .
</code></pre>

<p>Installing project dependencies:</p>

<pre><code>npm install
</code></pre>

<p>Creating a .env file based on the .env.example template for storing the project configuration:</p>

<pre><code>cp .env.example .env && nano .env
</code></pre>

<p>In the opened file, you need to edit the following values:</p>

<ul>
<li><b>MODEM_PORT</b> - address of the connected USB port (the command <b>ls /dev/ttyUSB*</b> shows a list of connected ports, for example <b>/dev/ttyUSB0</b>, described in the previous steps)</li>
<li><b>MODEM_MODE</b> - modem operating mode. Can be <b>'SMS'</b> or <b>'PDU'</b>. By default <b>'SMS'</b>, but if the server and modem support <b>PDU</b>, you can specify <b>'PDU'</b> in the value of this variable</li>
<li><b>SMS_TYPE</b> - type of SMS sent. Can be a regular text message or a flash message. This variable must have a boolean value <b>(true/false)</b>. <b>False - if you want the system to send regular text SMS messages, true - if it should send flash messages. By default false</b></li>
<li><b>APP_PORT</b> - port for the NodeJS application <b>(usually 3000). By default 3000</b></li>
<li><b>APP_HOST</b> - host for the application <b>(usually localhost). By default localhost</b></li>
<li><b>TIMEOUT</b> - maximum time (in milliseconds) to wait for a response from the modem (due to some features of the modems of some manufacturers, the response from them can be expected for a long time, as they may not issue an error, but at the same time do not respond or respond for a long time). Therefore, you need to specify the maximum allowable time to wait for a response from the modem, after this time, the program will return an error to the client with the TimeOut status. <b>By default 30 000 ms. (30 seconds)</b></li>
</ul>

<h2>Launch and use</h2>
<p>Before using, you need to install a process manager. The process manager allows you to monitor and study the logs and performance of the application in real time, as well as reload it in case of errors. It is recommended to use pm2.
To install pm2, you need to enter the command:</p>

<pre><code>npm install pm2
</code></pre>

<p>then you can run the application by entering the command:</p>

<pre><code>pm2 start ./src/app.js
</code></pre>

<p>The application will start on the port and host specified in the .env file. </p>

<p>To monitor the performance of the application in real time, you need to enter the command:</p>

<pre><code>pm2 start ./src/app.js
</code></pre>

<p>To send a message, you need to send a POST request in JSON format from your application to the address <br>
<b>http://YOUR_SMS_CONFIGURED_SERVER_ADDRESS:APP_PORT/send-sms</b>.
Example request:</p>

<pre><code>
  {
    "recipient": "+99362000000", // recipient's number (without spaces, in international format)
    "message": "Hello. this SMS from sms_server application" // message text
  }
</code></pre>

<p>The application will return a response in JSON format with information about sending the message. Example response:</p>

<pre><code>
  {
    "success": true,
    "message": "Message successfully has sent to +99362000000"
  }
</code></pre>

<p>The application also logs the sent messages and results, and displays them in the console in a beautiful and convenient way. Example output:</p>

<pre><code>
[2021-12-15 16:15:23] [INFO] New request: +99362000000 - Hello. this SMS from sms_server application
[2021-12-15 16:15:23] [INFO] Start sending SMS to +99362000000
[2021-12-15 16:15:24] [INFO] Message successfully has sent to +99362000000
</code></pre>

<p>For client applications, the response from the server, whether errors or successful submissions, will contain short responses. For more detailed error research or tracking server response statuses, logging to a text file and output to the terminal console is provided. All log entries are stored in the <b>src/logs</b> directory. Every day, the system will create log entries for that day and save them in the same directory. The log file name starts with the current date and ends with <b>_log.txt</b></p>

<p>In the log entries, <b>status</b> - message sending status, <b>message</b> - text description of the status, <b>data</b> - all data about the sent message, including the recipient's number, message text and link to the message in the modem.</p>

<h2>Conclusion</h2>

<p>This project is distributed under the MIT license. You can use the full code of this project on your projects for free. </p>
<p align="center">If you need any help or consultations, you can contact me by email: <a href="mailto:contact@yunus-mil.ru">contact@yunus-mil.ru</a></p>
