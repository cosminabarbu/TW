window.addEventListener("load", function(){

    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`;
    }

    document.getElementById("filtrare").onclick = function(){

        //input-uri
        let val_nume=document.getElementById("inp-nume").value.toLowerCase();

        let calorii = document.getElementsByName("gr_rad");
        let val_calorii;
        for(let r of calorii){
            if(r.checked){
                val_calorii=r.value;
            }
        }
        
        if(val_calorii!="toate"){
            [cal_a, cal_b] = val_calorii.split(":"); //le desparte dar sunt stringuri
           var cal_a = parseInt(cal_a);
           var cal_b = parseInt(cal_b); // convertim din string in int
        }
        //var le face disponibile oriunde
        //let le face disponibile doar in blocul curent de instructiuni

        let val_pret=document.getElementById("inp-pret").value;

        let val_categ=document.getElementById("inp-categorie").value;

        var produse=document.getElementsByClassName("produs");
        for(let prod of produse){
            prod.style.display="none";

            document.getElementById("resetare").onclick= function(){
       
                document.getElementById("inp-nume").value="";
               
                document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
                document.getElementById("inp-categorie").value="toate";
                document.getElementById("i_rad4").checked=true;
                var produse=document.getElementsByClassName("produs");
         
                for (let prod of produse){
                    prod.style.display="block";
                }
            }

            function sortare(){
                var produse=document.getElementsByClassName("produs");
                var v_produse = Array.from(produse);

                v_produse.sort(function(a,b){
                    var pret_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
                    var pret_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
                    if(pret_a == pret_b){
                        var nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
                        var nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
                        return nume_a.localeCompare(nume_b);
                    }
                    return pret_a - pret_b;
                })     
                
                for(let prod of v_produse){
                    prod.parentElement.appendChild(prod);
                }
              }

            document.getElementById("sortCrescNume").onclick=function(){
                sortare(1)
            }

            //valori din produs
            let nume=prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();

            let cond1=(nume.startsWith(val_nume));

            let prod_calorii=parseInt(prod.getElementsByClassName("val-calorii")[0].innerHTML);
            let cond2=(val_calorii=="toate" || cal_a <= prod_calorii && prod_calorii < cal_b);
            
            let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let cond3=(val_pret <= pret)

            let categorie=prod.getElementsByClassName("val-categorie")[0].innerHTML;
            let cond4=(val_categ=="toate" || val_categ==categorie);

            if(cond1 && cond2 && cond3 && cond4){
                prod.style.display="block";
            }
        }
    }

    window.onkeydown = function(e){
        if(e.key == "c" && e.altKey){
            if(document.getElementById("info-suma"))
                return;
            console.log("aici");
            var produse = document.getElementsByClassName("produs");
            let suma = 0;
            for(let prod of produse){
                if(prod.style.display!="none"){
                let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                suma+=pret;
                }
            }
    
            let p =document.createElement("p");
            p.innerHTML = suma;
            p.id="info-suma";
            ps = document.getElementById("p-suma");
            container = ps.parentNode;
            frate = ps.nextElementSibling;
            container.insertBefore(p,frate);
            setTimeout(function(){
                let info = document.getElementById("info-suma");
                if(info)
                info.remove();
            },1000) //1000 mili-sec
        }
    }


})


