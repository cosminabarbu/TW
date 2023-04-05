const express = require("express");
const fs = require('fs');
const path = require("path");
const sharp = require('sharp');

obGlobal={
    obErori:null,
    obImagini:null
}

app= express();

console.log("Folder proiect: ", __dirname);
console.log("Cale fisier: ", __filename);
console.log("Director de lucru: ", process.cwd());

app.set("view engine", "ejs");
//motor de template
//app.set trebuie pus inainte de get-uri

app.use("/resurse", express.static(__dirname + "/resurse"));
//express.static e o functie care returneaza un obiect
//asa "livrez" resursele pentru site 

app.use(/^\/resurse(\/[a-zA-Z0-9]*(?!\.)[a-zA-Z0-9]*)*$/, function (req, res) {
    afiseazaEroare(res, 403);
})

app.get("/favicon.ico", function(req, res){
res.sendFile(__dirname + "/resurse/ico/favicon.ico");
})
 
app.get(["/index","/", "/home"], function(req, res){
    res.render("pagini/index", {ip:req.ip, a:10, b:20, imagini:obGlobal.obImagini.imagini});
}) //render - compileaza ejs_ul si il trimite catre client

//app.get(/ [a-zA-Z0-9]\.ejs$/)

app.get("/despre", function(req, res){
    res.render("pagini/despre");
})

app.get("/promotii", function(req, res){
    res.render("pagini/promotii");
})


app.get("/*.ejs",function(req, res){
    afiseazaEroare(res, 400);
})

vectorFoldere = ["temp", "temp1"]

for(let folder of vectorFoldere){
    let cale_folder = path.join(__dirname, folder);
    if(!fs.existsSync(cale_folder))
    fs.mkdirSync(cale_folder);
} //creeaza folderele daca nu exista deja


app.get("/*", function(req, res){
    try{
    console.log(req.url);
    res.render("pagini"+req.url, function(err, rezRandare){
        if(err){
         if(err.message.startsWith("Failed to lookup view"))
            // afiseazaEroare(res,{_identificator= 404, _titlu= "ceva"}); //trimit ca obiect
            afiseazaEroare(res,404); //trimit ca parametrii
        else
            afiseazaEroare(res);
        // console.log(err);
        // res.send("Eroare");
        }
        else{
            console.log(rezRandare);
            res.send(rezRandare);
        }
    });

} catch(err){
        if(err.message.startsWith("Cannot find module")){
            afiseazaEroare(res,404);
        }
    }
}); //path general pentru fiecare pagina si in caz de not found, send error

function initializeazaErori(){
    var continut=fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf-8"); //asteptam raspuns (se pun intr o coada de taskuri)
//    console.log(continut);
    obGlobal.obErori=JSON.parse(continut);
    let vErori=obGlobal.obErori.info_erori
    //for(let i=0; i<vErori.length; i++)
      //  console.log(vErori[i].imagine)
    for(let eroare of vErori) {
    eroare.imagine="/"+obGlobal.obErori.cale_baza + "/" + eroare.imagine;
    }
}

 initializeazaErori();


 function initializeazaImagini(){
    var continut=fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8"); //asteptam raspuns (se pun intr o coada de taskuri)
    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;
    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(caleAbs,"mediu");
    //
    if(!fs.existsSync(caleAbsMediu))
    fs.mkdirSync(caleAbsMediu);



    //for(let i=0; i<vErori.length; i++)
      
    for(let imag of vImagini) {
        [numeFis, ext]=imag.fisier.split("."); 
        imag.fisier_mediu="/"+path.join(obGlobal.obImagini.cale_galerie, "mediu", numeFis+".webp");
        // 
        let caleAbsFisMediu= path.join(__dirname,imag.fisier_mediu)
        sharp(path.join(caleAbs, imag.fisier)).resize(400).toFile(caleAbsFisMediu);

 
        //eroare.imagine="/"+obGlobal.obErori.cale_baza + "/" + eroare.imagine;

        imag.fisier="/"+path.join(obGlobal.obImagini.cale_galerie, imag.fisier);
    }
}

 initializeazaImagini();

    function afiseazaEroare(res, _identificator, _titlu = "titlu default", _text, _imagine) {
        let vErori = obGlobal.obErori.info_erori;
        let eroare = vErori.find(function (element) {
            return element.identificator === _identificator;
        });
        if (eroare) {
            let titlu = _titlu == "titlu default" ? (eroare.titlu || _titlu) : _titlu;
            // daca programatorul seteaza titlul, se ia titlul din argument,
            //daca nu e setat, se ia cel din json, 
            // daca nu avem titlu nici in json, se ia titlul din valoarea default 
            let text = _text || eroare.text;
            let imagine = _imagine || eroare.imagine;
            if (eroare.status) {
                res.status(eroare.identificator).render("pagini/eroare", { titlu: titlu, text: text, imagine: imagine });
            } else {
                res.render("pagini/eroare", { titlu: titlu, text: text, imagine: obGlobal.obErori.cale_baza = "/" + errDef.imagine });
            }
        }
        else {
            let errDef = obGlobal.obErori.eroare_default;
            res.render("pagini/eroare", { titlu: errDef.titlu, text: errDef.text, imagine: errDef.imagine });
        }
    }



app.listen(8080);
console.log("Serverul a pornit");
