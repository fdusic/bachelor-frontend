import {User} from "./user";
import {Section} from "./section";
export class Topology{
  public idT:number;
  public description:string;
  public name:string;
  public version:number;
  public author:User;
  public section:Section;

  constructor(){}
}
