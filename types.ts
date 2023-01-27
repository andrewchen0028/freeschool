import { LinkObject, NodeObject } from "force-graph"

export type Node = {
  title: string;
  __bckgRadius?: number;
} & NodeObject

export type Link = {
  id?: number;
} & LinkObject

// Frontend-backend intermediary used for IOLink cards.
export type IOLink = {
  link: Link;
  source?: Node;
  target?: Node;
}