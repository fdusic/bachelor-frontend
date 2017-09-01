import {ConnectionType} from "./connection-type";
import {Machine} from "./machine";
import {Interface} from "./interface";
import {Topology} from "./topology";

export class ConnectedMachines{
  public idCM:number;
  public machine1:Machine;
  public machine2:Machine;
  public connectionType:ConnectionType;
  public iface:Interface;
  public topology:Topology;

  constructor(){}
}
