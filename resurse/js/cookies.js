

//setCookie("a",10, 1000) 1s= 10^3 milis
function setCookie(nume, val, timpExpirare){//timpExpirare in milisecunde
    //function setCookie(nume, val, cale, timpExpirare){//timpExpirare in milisecunde
    d=new Date();
    d.setTime(d.getTime()+timpExpirare)
    document.cookie=`${nume}=${val}; expires=${d.toUTCString()}`;
//document.cookie=`${nume}=${val}=${cale}; expires=${d.toUTCString()}`;
}

function getCookie(nume){
    vectorParametri=document.cookie.split(";") // ["a=10","b=ceva"] //cookies sunt separate prin ;
    for(let param of vectorParametri){
        if (param.trim().startsWith(nume+"=")) //verificam ca incepe cu numele speficic si "=" dupa
            return param.split("=")[1] //sa obtinem al doilea element
    }
    return null;
}

function deleteCookie(nume){
    console.log(`${nume}; expires=${(new Date()).toUTCString()}`)
    document.cookie=`${nume}=0; expires=${(new Date()).toUTCString()}`;
}


window.addEventListener("load", function(){
    if (getCookie("acceptat_banner")){
        document.getElementById("banner").style.display="none";
    }

    this.document.getElementById("ok_cookies").onclick=function(){
        setCookie("acceptat_banner",true,60000);
        document.getElementById("banner").style.display="none"
    }
})
