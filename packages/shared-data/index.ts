import { LinkObject, NodeObject } from "force-graph"

export interface Node extends NodeObject {
  title: string;
  __bckgRadius?: number;
}

export interface Link extends LinkObject {
  id?: number;
}