const express = require("express");
const fs = require('fs');

obGlobal={
    obErori:null,
    obImagini:null
}

app= express();
console.log("Folder proiect", __dirname);

app.set("view engine", "ejs");


app.use("/resurse", express.static(__dirname+"/resurse"));

// app.get("/ceva", function(req, res){
//     console.log("cale:", req.url)
//     res.send("<h1>altceva</h1> ip:"+req.ip);
// })

app.get(["/index","/", "/home"], function(req, res){
    res.render("pagini/index", {ip:req.ip, a:10, b:20});
})

app.get("/despre", function(req, res){
    res.render("pagini/despre");
})

app.use(/\/Resurse\/((?=[0-9])|(?=[a-z])|(?=[A-Z])))*$/, function (req, res) {
    res.send("Ceva");
    console.log(req.originalUrl);
    console.lof(req.url);
})

app.get("/*", function(req, res){
    res.render("pagini"+req.url, function(err, rezRandare){
        if(err){
         if(err.message.startsWith("Failed to lookup view"))
            afiseazaEroare(res, 404);
        else
            afiseazaEroare(res);
        console.log(err);
        res.send("Eroare");
        }
        else{
            console.log(rezRandare);
            res.send(rezRandare);
        }
    });
})

function initializeazaErori(){
    var continut=fs.readFileSync(__dirname+"/resurse/json/erori.json").toString("utf-8");
    console.log(continut);
    obGlobal.obErori=JSON.parse(continut);
    let vErori=obGlobal.obErori.info_erori
    //for(let i=0; i<vErori.length; i++)
      //  console.log(vErori[i].imagine)
    for(let eroare of vErori)
    eroare.imagine="/"+obGlobal.obErori.cale_baza
    }

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