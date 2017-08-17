// PRE REQUISITES .............................................................

1. Install npm
2. Install elasticsearch https://www.elastic.co/downloads/elasticsearch
3. npm -g install static-server
4. npm install -g firebase-tools
4. git clone https://github.com/firebase/flashlight.git

// TO RUN .....................................................................

BAT FILE TO EXECUTE ALL

cd C:\Projects                          //MAIN SOURCE
cd elasticsearch-*						//ELASTICSEARCH FOLDER
cd bin
start elasticsearch.bat
cd C:\Projects
cd elasticsearch*						//FLASHLIGHT FOLDER
start node app.js
cd C:\Projects
cd mr*
start static-server						//MR SIMPLE FOLDER
cd C:/Program Files (x86)/Google/Chrome/Application
start chrome.exe http://localhost:9080/

//Usefull commands.............................................................

http://localhost:9200/firebase/PR/-KcEaAdSNGshoBHcebyw
http://localhost:9200/firebase/_count
http://okfnlabs.org/blog/2013/07/01/elasticsearch-query-tutorial.html