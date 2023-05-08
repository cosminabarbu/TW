window.onload=function(){
    document.getElementById("filtrate").onclick = function(){
        let val_nume=document.getElementById("inp-nume").value;

        var produse=document.getElementsByClassName("produs");
        for(let prod of produse){
            prod.style.display="none";
            let nume=prod.getElementsByClassName("val-nume")[0].innerHTML;

            let cond1=(val_nume==nume);

            if(cond1){
                prod.style.display="block";
            }
        }
    }
}


