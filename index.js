const express = require("express");
const fs = require('fs');
const path = require("path");
const sharp = require('sharp');
const sass=require('sass');
const {Client}=require('pg');

var client= new Client({database:"bd",
        user:"cosmina",
        password:"parola",
        host:"localhost",
        port:5432});
        
client.connect();


client.query("select * from bijuterii", function(err, rez){
    console.log("Eroare BD",err);
 
    console.log("Rezultat BD",rez.rows);
});

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
    optiuniMeniu:[]
}

client.query("select * from unnest(enum_range(null::tipuri_produse))", function(err, rezCateg){
    if(err){
        console.log(err);
    }
    else{
        obGlobal.optiuniMeniu = rezCateg.rows;
    }
});

obGlobal.optiuniMeniu



app= express();

console.log("Folder proiect: ", __dirname);
console.log("Cale fisier: ", __filename);
console.log("Director de lucru: ", process.cwd());

app.get("/produse",function(req, res){


    //TO DO query pentru a selecta toate produsele
    //TO DO se adauaga filtrarea dupa tipul produsului
    //TO DO se selecteaza si toate valorile din enum-ul categ_prajitura

    client.query("select * from unnest(enum_range(null::categ_bijuterie))", function(err,rezCateg){
        if(err){
            console.log(err);
            afiseazaEroare(res, 2);
        }
        else {
            let conditieWhere = "";
            if(req.query.tip)    
                conditieWhere= ` where tip_produs='${req.query.tip}' `;  //"where tip='"+req.query.tip+"'" 
    
            client.query("select * from bijuterii"+conditieWhere , function( err, rez){
                //console.log(300)
                if(err){
                    console.log(err);
                    afiseazaEroare(res, 2);
                }
                else{
                    console.log(rez);
                    res.render("pagini/produse", {produse:rez.rows, optiuni:rezCateg.rows});

                }
                    
            });
        }
    });




});


app.get("/produs/:id",function(req, res){
    // console.log(req.params);
   
    client.query(`select * from bijuterii where id=${req.params.id}`, function( err, rezultat){
        if(err){
            console.log(err);
            afiseazaEroare(res, 2);
        }
        else
            res.render("pagini/produs", {prod:rezultat.rows[0]});
    });
});

// client.query("select * from unnest(enum_range(null::categ_prajitura))",function(err, rez){
//     console.log(err);
//     console.log(rez);
// })



app.set("view engine", "ejs");
//motor de template
//app.set trebuie pus inainte de get-uri

app.use("/resurse", express.static(__dirname + "/resurse"));
//express.static e o functie care returneaza un obiect
//asa "livrez" resursele pentru site 

app.use("/node_modules", express.static(__dirname + "/node_modules"));

app.use("/*",function(req, res, next){
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    next();
});

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

app.get("/galerie", function (req, res) {
    res.render("pagini/galerie.ejs", {imagini: obGlobal.obImagini.imagini});
});


app.get("/*.ejs",function(req, res){
    afiseazaEroare(res, 400);
})

vectorFoldere = ["temp", "temp1", "backup"]

for(let folder of vectorFoldere){
    //let cale_folder = __dirname + "/" + folder;
    let cale_folder = path.join(__dirname, folder);
    //console.log(cale_folder);
    if(!fs.existsSync(cale_folder))
    fs.mkdirSync(cale_folder);
} //creeaza folderele daca nu exista deja



function compileazaCss(caleScss, caleCss){
    if(!caleCss) {
    //let vectorCale=caleScss.split("\\")
    //let numeFisExt=vectorCale[vectorCale.length-1] //nume fisier cu extensie
    let numeFisExt = path.basename(caleScss);
    let numeFis = numeFisExt.split(".")[0] ///"a.scss" -> ["a", "scss"]
    caleCss = numeFis + ".css"; 
   }
    
   if (!path.isAbsolute(caleScss))
      caleScss=path.join(obGlobal.folderScss, caleScss)
   if (!path.isAbsolute(caleCss))
      caleCss=path.join(obGlobal.folderCss, caleCss)
    ///la acest punct avem cai absolute in caleScss si caleCss

    // console.log("cale:", caleCss);
    
    // let vectorCale=caleCss.split("\\");
    // let numeFisCss=vectorCale[vectorCale.length-1];
   let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
   if(fs.existsSync(caleBackup))
   fs.mkdirSync(caleBackup, {recursive: true});

    let numeFisCss=path.basename(caleCss);
    if(fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup,numeFisCss)) //+(new Date()).getTime()
    }

    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss, rez.css)
    // console.log("compilare scss", rez);
}

//compileazaScss("a.scss");

vFisiere=fs.readdirSync(obGlobal.folderScss); //da vector de string uri cu numele fisierelor
    for(let numeFis of vFisiere){
        if(path.extname(numeFis) == ".scss"){
            compileazaCss(numeFis);
        }
    }


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    //console.log(eveniment, numeFis);
    if(eveniment == "change" || eveniment == "rename"){
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if(fs.existsSync(caleCompleta)){
            compileazaCss(caleCompleta);
        }
    }
})

app.get("/*", function(req, res){
    try{
    // console.log(req.url);
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
            // console.log(rezRandare);
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
    let caleAbsMic=path.join(caleAbs, "mic");
    //
    if(!fs.existsSync(caleAbsMediu))
    fs.mkdirSync(caleAbsMediu);

    if(!fs.existsSync(caleAbsMic))
    fs.mkdirSync(caleAbsMic);




    //for(let i=0; i<vErori.length; i++)
      
    for(let imag of vImagini) {
        [numeFis, ext]=imag.fisier.split("."); 
        imag.fisier_mediu="/"+path.join(obGlobal.obImagini.cale_galerie, "mediu", numeFis+".webp");
        // 
        imag.fisier_mic="/"+path.join(obGlobal.obImagini.cale_galerie, "mic", numeFis+".webp");

        let caleAbsFisMediu= path.join(__dirname,imag.fisier_mediu)
        sharp(path.join(caleAbs, imag.fisier)).resize(400).toFile(caleAbsFisMediu);

        let caleAbsFisMic=path.join(__dirname,imag.fisier_mic)
        sharp(path.join(caleAbs, imag.fisier)).resize(200).toFile(caleAbsFisMic);
 
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
