# Minority Report

### Chicago Crime Data
For convenience we have put the data in the repository.  
Data:  [CHICAGO DATA PORTAL](https://data.cityofchicago.org/Public-Safety/Crimes-2017/d62x-nvdr)

### Install all the dependencies

Run the code below in terminal to install all the dependencies:  

`$ npm install`

### GeoJson Generation

We wrote a parser to convert data into Mapbox format.  
To convert the csv file you just have to run:  

`$ node data-parser.js`

### Running the Server

By a running a simple python server index.html will be served on 8000(changeable):  

`$ python -m SimpleHTTPServer 8000`

