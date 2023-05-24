
/*
Create form with title Registration Form
Add header with title Basic Details
Add field first name and second name and third name and fourth name and last name
Add field Date of Birth with type date
Add field Preferred user name with type text
Add field Password and confirm password with type password
*/

const baseline = {
    actions : ["ADD", "SET","CREATE"],
    nounobj : ["FORM", "HEADER", "FIELD"],
    // properties : ["TITLE", "NAME", "THEME"],
    // joiner : ["WITH"],
    // adder : ["ADD"]
   }

class Prompt extends HTMLElement {
    constructor(){
        super();
        (async () => await this.initializeComponent())();
    }

    async initializeComponent(){
        let placeholder = this.getAttribute("placeholder") || "Enter Command";
        let templateName = this.getAttribute("template") || "default";
        let templateContent =  document.querySelector("[for=prompt][theme=" + templateName +"]").content.cloneNode(true);
        templateContent.querySelector(".promptinput").setAttribute("placeholder",placeholder);

        // var shadowdom = this.attachShadow({mode:"open"});
        // shadowdom.appendChild(templateContent);
        // this.$hadow = shadowdom;
        this.appendChild(templateContent);
        this.querySelector(".promptbutton").addEventListener("click",(evt) =>{
            this.executeCommand(this.querySelector(".promptinput").value);
        })
        await this.initializeWebSpeech();        
        this.style.zIndex = 1000;
        this.style.position = "relative";
        this.classList.add("active");

    }    

    async executeCommand(result){
        var processedResult =  this.generateResultTree(result.toLowerCase());
        this.createAction(processedResult);
    }

    async initializeWebSpeech(){
        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
        //var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
        var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

        //var colors = [ 'create' , 'form' , 'control', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];

        var recognition = new SpeechRecognition();
        // if (SpeechGrammarList) {
        //     // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
        //     // This code is provided as a demonstration of possible capability. You may choose not to use it.
        //     var speechRecognitionList = new SpeechGrammarList();
        //     var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
        //     speechRecognitionList.addFromString(grammar, 1);
        //     recognition.grammars = speechRecognitionList;
        // }
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // var diagnostic = document.querySelector('.output');
        // var bg = document.querySelector('html');
        // var hints = document.querySelector('.hints');

        // var colorHTML= '';
        // colors.forEach(function(v, i, a){
        //     console.log(v, i);
        //     colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
        // });

       // hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';
        this.isrecording = true;
        this.querySelector(".promptbutton2").onclick = ()=> {
            this.toggleRecording();
        }



        this.toggleRecording = (ignoreresult=false) => {
            if(!this.isrecording){
                this.isrecording = true;
                recognition.start();
                this.querySelector(".promptbutton2").style.backgroundColor = "#00ff93";
            }else{
                this.isrecording = false;
                recognition.stop();
                this.querySelector(".promptbutton2").style.backgroundColor = "white";
            }
        }

        recognition.onresult = (event) => {
            // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
            // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
            // It has a getter so it can be accessed like an array
            // The first [0] returns the SpeechRecognitionResult at the last position.
            // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
            // These also have getters so they can be accessed like arrays.
            // The second [0] returns the SpeechRecognitionAlternative at position 0.
            // We then return the transcript property of the SpeechRecognitionAlternative object
            var result = event.results[0][0].transcript;
            this.executeCommand(result);
            this.querySelector(".promptbutton2").style.backgroundColor = "white";
            this.querySelector(".promptinput").value = result;
            
            // diagnostic.textContent = 'Result received: ' + color + '.';
            // bg.style.backgroundColor = color;
            console.log('Confidence: ' + event.results[0][0].confidence);
        }

        recognition.onspeechend = function() {
        recognition.stop();
        }

        recognition.onnomatch = function(event) {
        //diagnostic.textContent = "I didn't recognise that color.";
        }

        recognition.onerror = function(event) {
            //diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
        }



    }


     generateResultTree(s1){
        s1 = s1.toLowerCase();
        var result = {};
        for(var act of baseline.actions){    
            var acttmp = s1.match(new RegExp("^" + act, "gi" ));
            if(acttmp != null){
                result.action = {name : acttmp}; 
                s1 = s1.split(" ").splice(1).join(" ")
                break;
            }
        }
        
        if(!result.action) return "action not found";
        
        if(s1.trim().startsWith("a "))s1 = s1.split(" ").splice(1).join(" ");

        
        for(var noun of baseline.nounobj){    
            var nountmp = s1.match(new RegExp("^" + noun, "gi" ));
            if(nountmp != null){
                result.action.for = {name : nountmp}; 
                s1 = s1.split(" ").splice(1).join(" ")
                break;
            }
        }

        
        //console.log(result);
        //debugger;
         s1 = s1.trim();
         var fieldarr = [];
         var proparr = [];
        if(s1.trim().startsWith("with ")){
            proparr = s1.substring(s1.indexOf(" with ")+ 6).split(" and ");
            s1 = s1.split(" ").splice(1).join(" ");
            //var proparr = s1.split(" and" );
        }else if(s1.indexOf(" with ") > 0){
            fieldarr = s1.substring(0,s1.indexOf(" with ")).split(" and ");
            proparr = s1.substring(s1.indexOf(" with ")+ 6).split(" and ");
        }else{
            fieldarr = s1.trim().split(" and ");        
        }

     
        result.action.for.props = {};
        for(var prop of proparr){
            result.action.for.props[prop.split(" ")[0]] = prop.split(" ").splice(1).join(" ");
        }

        result.action.for.fields = fieldarr;
        //debugger;
        return result;
    }

    createAction(s1) {
        var $ele = null;
        if(s1?.action?.name == "add" || s1?.action?.name == "create" ){
            if(s1?.action?.for?.name == "form"){
                
                let $ele = document.createElement("div");                                
                $ele.classList.add("container");
                $ele.classList.add("demoform");
                var props = s1?.action?.for?.props;
                for(let prop in props){
                    prop = prop.replaceAll(" ", "").trim().toLowerCase();
                    if(prop == "id")$ele.id = props[prop];                        
                    else if(prop == "title"){
                        let $h1 = document.createElement("h1");  
                        $h1.innerText = props[prop]; 
                        $h1.classList.add("formtitle");
                        $ele.appendChild($h1);                       
                    }                    
                }

                var $formcontent = document.createElement("div");
                $formcontent.id = "formcontent";
                $ele.appendChild($formcontent);

                document.body.appendChild($ele);

            }else if(s1?.action?.for?.name == "header"){
                let $ele = document.createElement("h3");  
                let fieldarr = s1?.action?.for?.fields || [];  
                if(fieldarr.length == 1){
                    $ele.innerText = fieldarr[0];
                }
                var props = s1?.action?.for?.props;
                for(let prop in props){
                    prop = prop.replaceAll(" ", "").trim().toLowerCase();
                    if(prop == "id")$ele.id = props[prop];                        
                    else if(prop == "title"){ 
                        $ele.innerText = props[prop];            
                    }                    
                }
                    
                document.querySelector(".container #formcontent").insertAdjacentHTML("beforeend",$ele.outerHTML);
                 
            }else if(s1?.action?.for?.name == "field" || s1?.action?.for?.name == "fields"){
                let fieldarr = s1?.action?.for?.fields || [];
                if(fieldarr.length == 0)fieldarr = ["field" + parseInt(Math.random()*100000)];
                let props = s1?.action?.for?.props;
                for(var field of fieldarr){
                    let $ele = document.createElement("atidan-input");
                    $ele.id = field.replaceAll(" ", "").toLowerCase();
                    $ele.type = "text";
                    let fieldtxt = "";
                    for(let prop in props){
                        prop = prop.replaceAll(" ", "").trim().toLowerCase();
                        if(prop == "id")$ele.id = props[prop];                      
                        else if(prop == "label"){
                            $ele.setAttribute(prop,props[prop]);
                            $ele.id = props[prop].replaceAll(" ", "").toLowerCase();
                        } else $ele.setAttribute(prop,props[prop]);
                        //else if(prop == "type")$ele.setAttribute(prop,props[prop]);
                    }

                    if(!$ele.getAttribute("label")){
                            $ele.setAttribute("label",field);                        
                    }
                    
                    document.querySelector(".container  #formcontent").insertAdjacentHTML("beforeend",$ele.outerHTML);
                 
                } 
            }
        }
    }



}


customElements.define("atidan-prompt",Prompt);