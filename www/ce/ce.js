var templatefiles = ["sidebarmenu","prompt","image","input"];
var loadedcontent = [];
window.basepath = window.basepath || "./";
templatefiles
    .forEach(t=> fetch( window.basepath + `ce/${t}/${t}.html`)
                    .then(async res => {
                        let content = await res.text();
                        document.body.insertAdjacentHTML("beforeend", content);
                        await(async ()=>new Promise((res,rej) => setTimeout(res, 2000) ));
                        fetch(window.basepath + `ce/${t}/${t}.js`).then(async res =>{
                                try{eval(await res.text()); }catch{}
                            loadedcontent.push(t);
                            if(loadedcontent.length == templatefiles.length)
                                setTimeout(() =>document.body.style.display = "block",1000);
                        });
                    }
    ));