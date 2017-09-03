import {User} from "./user";
import {Section} from "./section";
import {Machine} from "./machine";
export class Topology{
  public idT:number;
  public description:string;
  public name:string;
  public active:boolean;
  public author:User;
  public section:Section;
  public machines:Machine[]=[];

  constructor(){}
}
