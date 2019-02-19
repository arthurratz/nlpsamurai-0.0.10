# NLP-Samurai@0.0.10 (Node.js-Demo)

![fig_title](https://user-images.githubusercontent.com/24288051/52999348-37c04c00-342e-11e9-9027-806afe34ac64.jpg)

### How To Install And Use This Project

NLP-Samurai@0.0.10 requires [Node.js](https://nodejs.org/) v4+ to run.

### Prerequisites

To install and use NLP-Samurai@0.0.10 Node.js demo, you must install the following software:

 - [Node.js 10.15.1 LTS for Windows (x64)](https://www.nodejs.org/)
 - [MySQL Community Server (Current Generally Available Release: 8.0.15)](https://dev.mysql.com/downloads/)

After you've successfully install these products and properly setup MySQL server you can proceed with the next installation and configuration steps.

### Step 1: Create Database And Import Data

1. Open MySQL Workbench 8.0 CE and locate **Data Import/Restore** option under **Administration** tab by clicking it in the sidebar leftside your MySQL Workbench window:
![fig1](https://user-images.githubusercontent.com/24288051/52999349-37c04c00-342e-11e9-9998-9af308c5dd60.jpg)
2. In the **Administration - Data Import/Restore** tab of the MySQL Workbench window, select **Import from Disk** tab below and toggle select file [**...**] button:
3. Select a folder containing **nlp-samurai_db.sql** file. In this case, this file is located in the main projects folder, for example: (**<path-on-your-drive>/nlp_samurai/nlp_samurai/**). After you've selected a proper directory containing this sql-file, **nlp-samurai_db** database schema icon will appear under the **Select Database Objects To Import** list view:
![fig2](https://user-images.githubusercontent.com/24288051/52999350-37c04c00-342e-11e9-929e-fffb6efe39a9.jpg)
4. Finally, locate and click **Start Import** button in the bottom-right corner of the **Import from Disk** tab, to launch the database creation and data import process.
![fig3](https://user-images.githubusercontent.com/24288051/52999351-3858e280-342e-11e9-9b14-ca9be87abb9a.jpg)

### Step 2: Installing Node.js Modules Dependencies

The NLP-Samurai@0.0.10 project relies on using the number of Node.js modules, from npmjs.org repository, created by the other side-developers. To install these modules you must use the following command in the Node.js command prompt:

``` sh
<path-on-your-drive>\nlp_samurai\nlp_samurai\>npm install --save
```

By executing the following command all required Node.js modules, specified in ***package.json*** file will be installed to the **<path-on-your-drive>\nlp_samurai\nlp_samurai\node_modules** folder.

### Step 3: Running NLP-Samurai@0.0.10 Express Server:

Finally, all what you have to do next is to launch NLP-Samurai@0.0.10 server web-application. To do this you must type in the following in your Node.js command prompt:
``` sh
<path-on-your-drive>\nlp_samurai\nlp_samurai\>npm update & npm start
```
### Step 4: Using NLP-Samurai@0.0.10 Application Installed

To do use NLP-Samurai@0.0.10 web application, all what you have to do is to open your local web-browser and type in the following address in the address bar at the top:

``` sh
http://localhost:3000/
```
***That's all folks, enjoy using the application!***

### Author

***Author: Arthur V. Ratz @ CodeProject (CPOL License)***

### License

***CPOL - CodeProject's Open License***"# nlp-samurai-0.0.10" 
"# nlp-samurai-0.0.10" 
"# nlp-samurai-0.0.10" 
"# nlp-samurai-0.0.10" 
"# nlp-samurai-0.0.10" 
"# nlpsamurai-0.0.10" 
