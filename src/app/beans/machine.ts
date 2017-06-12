import {Section} from "./section";
import {Interface} from "./interface";
export class Machine{

  public idM:number;
  public section:Section;
  public name:string;
  public description:string;
  public image:string;
  public supportsInterface:Interface[]=[];


  constructor(){}
}
