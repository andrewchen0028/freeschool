import { LinkObject, NodeObject } from "force-graph"

export type Node = {
  title: string;
  __bckgRadius?: number;
} & NodeObject

export type Link = {
  id?: number;
} & LinkObject

export type AddNodeFunction = (node: Node) => void