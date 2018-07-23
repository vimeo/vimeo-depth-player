import * as dat from 'dat.gui';

export default class GuiManager{
    constructor(){
        //Create the gui
        this.gui = new dat.GUI();

        this.guiFunctions = {};
    }

    add(object, param, rangeMin, rangeMax){
        if(rangeMin){
            this.gui.add(object, param, rangeMin, rangeMax);
        } else {
            this.gui.add(object, param);
        }
    }

    addVector3(vector, folder){
        if(folder){
            this.folder = this.gui.addFolder(folder);
        }

        for(let child in vector){
            if(child == 'x' || child == 'y' || child == 'z'){
                if(folder){
                    this.folder.add(vector, child);
                } else {
                    this.gui.add(vector, child);
                }
            }
        }

    }

    addObject(object){
        for(let child in object){
            this.gui.add(object, child);
        }
    }

    addFunction(name, callback){
      let buttonName = name.toString();
      this.guiFunctions = {
        [buttonName]: callback
      };
      this.gui.add(this.guiFunctions, buttonName);
    }
}
