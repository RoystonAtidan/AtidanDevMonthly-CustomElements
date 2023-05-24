class AppImage extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
      (async () => await this.initializeComponent())();
      
      // write element functionality in here
    }

    async initializeComponent(){
      //this.innerHTML = 'Do Something <input type="text"/>';
      let templateName = this.getAttribute("template") || "default";
      let templateContent =  document.querySelector("[for=image][theme=" + templateName +"]").content.cloneNode(true);
      templateContent.querySelector("img").src = this.getAttribute("src") ?? "";
      templateContent.querySelector(".caption").innerHTML = this.innerHTML;
      // htmlstr = htmlstr.replace("#IMGSRC", this.getAttribute("src") ?? "" );
      // htmlstr = htmlstr.replace("#CAPTION", this.innerHTML ?? "" );
      // this.innerHTML = htmlstr;
      this.innerHTML = "";
      this.appendChild(templateContent);

    }

  }


  
  customElements.define("at-image", AppImage);