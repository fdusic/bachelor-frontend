import {Section} from "./section";
import {Interface} from "./interface";
import {ConnectionType} from "./connection-type";
export class Machine{

  public idM:number;
  public section:Section;
  public name:string;
  public description:string;
  public image:string;
  public supportsInterface:Interface[]=[];
  public supportsProtocol: ConnectionType[] = [];


  constructor(){}
}
