class SideBarMenu extends HTMLElement {
    constructor(){
        super();
        (async () => await this.initializeComponent())();

    }

    async initializeComponent(){
        let logo = this.getAttribute("logo");
        let title = this.getAttribute("title");
        let templateName = this.getAttribute("template") || "default";
        let menustr = this.innerText.trim();
        await new Promise((res,rej)=> setTimeout(res,500));
        let templateContent =  document.querySelector("[for=sidebarmenu][theme=" + templateName +"]").content.cloneNode(true);
        templateContent.querySelector("#appheader").innerText = title;

        var $logo = templateContent.querySelector("#sidebarlogo")
        if(logo){
            $logo.src = logo;
        }else{
            $logo.style.display = "none";
        }

        var shadowdom = this.attachShadow({mode:"open"});
        shadowdom.appendChild(templateContent);
       
        menustr.split("\n").forEach(function(m){
            let mcomp = m.split("=>");
            let $li = document.createElement("li");
            let $div = document.createElement("div");
            $div.innerText = mcomp[0].trim();
            $li.appendChild($div);
            shadowdom.querySelector("ul.nav").appendChild($li);
            $div.addEventListener("click", () => {
                document.querySelector("iframe#contentiframe").src = mcomp[1].trim();
              //  document.querySelector("iframe#sourceiframe").src = "viewsource:"+ mcomp[1].trim();
                
            })

        });

        

        this.classList.add("active");
    }    
}


customElements.define("atidan-menu",SideBarMenu);