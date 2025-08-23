import * as https from 'node:https';
import inquirer from 'inquirer';
import fs from 'node:fs';
import { stringify } from 'node:querystring';
import { Agent } from 'node:http';
function saveInFile (data){
    const objects = JSON.parse(data);
    const repos = objects.map(repo => repo.name);
    fs.writeFile("./repos.txt",repos.join("\n"),'utf-8',(err)=>{
        if(err)console.log("sorry something happened !");
        else console.log("data is written will");
    })
}


function getUserRepos(username){
    const options = {
        headers: {
            "User-Agent": "node.js",
            "Accept": "application/vnd.github.v3+json"
        }
    };


    https.get(`https://api.github.com/users/${username.trim()}/repos`,options, res =>{//MohamedHusseinTammaa
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
        let data = "";
        res.on("data", (d)=>{
            data +=d;
        });
        res.on("end",()=>{
            if(res.statusCode===200){
                saveInFile(data);
            }
            else {
                console.log("sorry error within github !")
            }
        })
    }).on('error', (e) => {
        console.error(e);
    });
}

inquirer.prompt([
    {
        "type" : "input",
        "message" : "give me the user name sir",
        "name" : "username"
    }
  ])
  .then((answers) => {
    getUserRepos(answers.username);
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("error taking your answers");
      
    } else {
      // Something else went wrong
    }
  });