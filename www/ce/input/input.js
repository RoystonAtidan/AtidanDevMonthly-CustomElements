class Input extends HTMLElement {
    constructor(){
        super();
        (async () => await this.initializeComponent())();
    }

    async initializeComponent(){
        let inputtype = this.getAttribute("type") || "text";
        let inputname = this.getAttribute("label") || "Unknown";
        let innercontent = this.innerText.trim();
        let templateName = this.getAttribute("template") || "default";
        let templateContent =  document.querySelector("[for=input][theme=" + templateName +"]").content.cloneNode(true);
        if(inputtype == "checkbox"){
            templateContent.querySelector(".checklabel").innerText = inputname;
            templateContent.querySelector(".input").setAttribute("type",inputtype);
        }else if(inputtype == "select"){
            var $select = document.createElement("select");
            $select.classList.add("inpselect")
            innercontent.split("\n").forEach(function(m){
                let mcomp = m.split("=>");
                let $option = document.createElement("option");
                $option.innerText = mcomp[1].trim();
                $option.value = mcomp[0].trim();
                $select.appendChild($option);
            });
            templateContent.querySelector(".inputlabel").innerText = inputname;
            templateContent.querySelector(".input").insertAdjacentElement("afterend",$select);
            templateContent.querySelector(".input").style.display = "none";
        }else{
            templateContent.querySelector(".inputlabel").innerText = inputname;
            templateContent.querySelector(".input").setAttribute("type",inputtype);
        }

        var shadowdom = this.attachShadow({mode:"open"});
        this.innerHTML = "";
        shadowdom.appendChild(templateContent);
        this.$hadow = shadowdom;



        //this.appendChild(templateContent);
        this.classList.add("active");

    }    

   
}


customElements.define("atidan-input",Input);