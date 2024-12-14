Backend:
 pip install flask
 pip install pymongo
 pip install flask-bcrypt
 pip install flask-jwt-extended
 pip install flask_cors

First run the back end by "python3 app.py"


Open a new terminal and open front end folder.
Front end
In the terminal type: "nmp run dev"

MangoDB Compass:
Click on "Create New Connection"
Paste the following in URI: "mongodb://localhost:27017"
At name section name it "dore"


For PostMan
Click "+" right next to overview.
Change GET to POST
Paste this link :"http://127.0.0.1:5001/api/topics"
Click "Body"
Click "raw"
Paste the following:
{
    "name":"news",
    "description":"news"
}
Click send
