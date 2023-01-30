import axios from "axios";
import ForceGraph, { LinkObject, NodeObject } from "force-graph";

import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
import { ForceGraphInstance } from "force-graph";

import { url } from "..";
import colors from "../colors";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import { Node } from "shared-data";

// TODO-low: make graph react to window size changes.
export default function Graph() {
  // Hold force-graph NodeObject objects in state, even though they don't have
  // the "title" and "__bckgRadius" properties: just cast NodeObjects using
  // "as Node" before using those properties.
  const [nodes, setNodes] = useState<NodeObject[]>([]);
  const [links, setLinks] = useState<LinkObject[]>([]);
  const [hover, setHover] = useState<NodeObject | null>();

  const graphRef = useRef<ForceGraphInstance>();
  const navigate = useNavigate();

  // DEBUG ONLY: Reset database
  const resetGraph = useCallback(() => {
    axios.delete(`${url}/`).then(() => {
      axios.get(`${url}/`).then((response) => {
        setNodes(response.data.nodes);
        setLinks(response.data.links);
      });
    });
  }, []);

  function addNode(node: NodeObject) { setNodes([...nodes, node]); }
  function addLink(link: LinkObject) { setLinks([...links, link]); }

  useEffect(function initializeGraphRef() {
    graphRef.current = ForceGraph()
      (document.getElementById("graph") as HTMLElement);
    axios.get(`${url}/`).then((response) => {
      setNodes(response.data.nodes);
      setLinks(response.data.links);
    });
  }, []);

  // NOTE: Effect initializeGraph() must be separate from initializeGraphRef(), 
  // otherwise the graph gets redrawn from scratch upon closing a node window.
  // TODO-low: implement interactive grid background
  //       (see https://github.com/vasturiano/react-force-graph/issues/321)
  useEffect(function initializeGraph() {
    function paintRing(node: NodeObject, color: string,
      ctx: CanvasRenderingContext2D, radius: number) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(node.x!, node.y!, radius, 0, Math.PI * 2, false);
      ctx.fill();
    }

    if (graphRef.current) graphRef.current
      .linkDirectionalArrowLength(4.0)
      .linkDirectionalArrowRelPos(0.5)
      .backgroundColor(colors.slate[200])
      .nodePointerAreaPaint((nodeObject, color, ctx) => {
        paintRing(nodeObject, color, ctx, (nodeObject as Node).__bckgRadius!);
      })
      .nodeCanvasObject((nodeObject, ctx, globalScale) => {
        let node = nodeObject as Node;
        const fontSize = graphRef.current!.zoom() * 4 / globalScale;
        const bckgColor = colors.white;
        const ringColor = colors.neutral[node === hover ? 400 : 300];
        node.__bckgRadius = 2 + ctx.measureText(node.title).width / 2;
        paintRing(node, ringColor, ctx, node.__bckgRadius + 0.4);
        paintRing(node, bckgColor, ctx, node.__bckgRadius);
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = colors.orange[600];
        ctx.fillText(node.title, node.x!, node.y!);
      })
      .onNodeHover((nodeObject) => { setHover(nodeObject); })
      .onNodeClick((nodeObject) => {
        navigate(`${nodeObject.id}/${(nodeObject as Node).title}`);
      });
  }, [graphRef, hover, navigate]);

  useEffect(function redrawGraph() {
    if (graphRef.current) { graphRef.current.graphData({ nodes, links }); }
  }, [graphRef, nodes, links]);

  return (
    <div>
      <TopBar resetGraph={resetGraph} />
      <BottomBar />
      <div id="graph" className="h-screen w-screen" />
      <Outlet context={[addNode, addLink]} />
    </div>
  );
}