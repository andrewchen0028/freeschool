import axios from "axios";
import ForceGraph, { ForceGraphInstance, GraphData, LinkObject, NodeObject } from "force-graph";
import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { url } from "..";
import colors from "../colors";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import { Node } from "shared-data";

// TODO-low: make graph react to window size changes.
export default function Graph() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [hover, setHover] = useState<NodeObject | null>();

  const graphRef = useRef<ForceGraphInstance>();
  const navigate = useNavigate();
  const { superNodeTitle } = useParams();

  const paintRing = useCallback((node: NodeObject, color: string,
    ctx: CanvasRenderingContext2D, radius: number) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(node.x!, node.y!, radius, 0, Math.PI * 2, false);
    ctx.fill();
  }, []);

  function addNode(node: NodeObject) { setGraphData({ ...graphData, nodes: [...graphData.nodes, node] }); }
  function addLink(link: LinkObject) { setGraphData({ ...graphData, links: [...graphData.links, link] }); }

  useEffect(function initializeGraphRef() {
    graphRef.current = ForceGraph()
      (document.getElementById("graph") as HTMLElement)
      .linkDirectionalArrowLength(4.0)
      .linkDirectionalArrowRelPos(0.5)
      .backgroundColor(colors.slate[200]);
    axios.get(`${url}/graph/${superNodeTitle}`).then((res) => {
      res.data.nodes
        ? setGraphData({ nodes: res.data.nodes, links: res.data.links })
        : console.warn(`${superNodeTitle} has no subnodes`);
    });
  }, [superNodeTitle]);

  // NOTE: Effect initializeGraph() must be separate from initializeGraphRef(), 
  // otherwise the graph gets redrawn from scratch upon closing a node window.
  // TODO-low: implement interactive grid background
  //       (see https://github.com/vasturiano/react-force-graph/issues/321)
  useEffect(function initializeGraph() {
    graphRef.current!
      .onNodeClick((nodeObject) => {
        navigate(`/${superNodeTitle}/${(nodeObject as Node).title}`);
      })
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
      .onNodeRightClick((nodeObject) => { navigate(`/${(nodeObject as Node).title}`); });
  }, [graphRef, superNodeTitle, hover, paintRing, navigate]);

  useEffect(function redrawGraph() {
    graphRef.current!.graphData(graphData)
  }, [graphRef, graphData]);

  return (
    <div>
      <TopBar />
      <BottomBar />
      <div id="graph" className="h-screen w-screen" />
      <Outlet context={[addNode, addLink]} />
    </div>
  );
}

export type addNodeFunction = (node: NodeObject) => void;
export type addLinkFunction = (link: LinkObject) => void;