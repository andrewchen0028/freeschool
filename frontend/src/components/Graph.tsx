import axios from "axios";
import ForceGraph, { ForceGraphInstance, NodeObject } from "force-graph";
import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { url } from "..";

import { Node, Link } from "../../../types";
import { colors } from "../colors";
import { BottomBar } from "./BottomBar";
import { TopBar } from "./TopBar";

export function Graph() {
  const [nodes, setNodes] = useState<Node[]>();
  const [links, setLinks] = useState<Link[]>();
  const [hover, setHover] = useState<NodeObject | null>();

  const graphRef = useRef<ForceGraphInstance>();

  const resetGraph = useCallback(() => {
    axios.post(`${url}/`).then(() => {
      axios.get(`${url}/`).then((res) => {
        setNodes(res.data.nodes);
        setLinks(res.data.links);
      });
    });
  }, []);

  function addNode(node: Node) { setNodes(nodes ? [...nodes, node] : [node]); }

  useEffect(function initializeGraphRef() {
    graphRef.current = ForceGraph()
      (document.getElementById("graph") as HTMLElement);
    axios.get(`${url}/`).then((res) => {
      setNodes(res.data.nodes);
      setLinks(res.data.links);
    });
  }, []);

  // NOTE: Effect initializeGraph() must be separate from initializeGraphRef(),
  // otherwise the graph gets redrawn from scratch upon closing a node window.
  // 
  // TODO-low: implement interactive grid background
  //       (see https://github.com/vasturiano/react-force-graph/issues/321)
  useEffect(function initializeGraph() {
    function paintRing(node: Node, color: string,
      ctx: CanvasRenderingContext2D, radius: number) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
      ctx.fill();
    }

    (graphRef.current as ForceGraphInstance)
      .linkDirectionalArrowLength(4.0)
      .linkDirectionalArrowRelPos(0.5)
      .backgroundColor(colors.slate[200])
      .nodePointerAreaPaint((nodeObject, color, ctx) => {
        const node = nodes?.find(node => node.id === nodeObject.id);
        if (node) paintRing(node, color, ctx, node.__bckgRadius!);
      })
      .nodeCanvasObject((nodeObject, ctx, globalScale) => {
        // Package "force-graph" uses type "NodeObject" (e.g. as the parameter
        // type for "nodePointerAreaPaint()"), which doesn't contain property
        // "__bckgRadius". Therefore, we must find the "Node" object in state
        // before using "__bckgRadius."
        // TODO-high: find out how to "extend" the "NodeObject" class instead,
        // and make force-graph use the extended NodeObject directly, so that
        // we don't have to do this slow "find()" operation every time we
        // mouseover a node.
        const node = nodes?.find(node => node.id === nodeObject.id);

        if (graphRef.current && node) {
          const fontSize = graphRef.current.zoom() * 4 / globalScale;
          const ringRadius = 2 + ctx.measureText(node.title).width / 2;
          const ringColor = node === hover
            ? colors.neutral[400]
            : colors.neutral[300];
          paintRing(node, ringColor, ctx, ringRadius + 0.4);
          paintRing(node, colors.white, ctx, ringRadius);
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = colors.orange[600];
          ctx.fillText(node.title, node.x!, node.y!);
          node.__bckgRadius = ringRadius;
        }
      })
      .onNodeHover((nodeObject) => { setHover(nodeObject); });
  }, [graphRef, hover, nodes]);

  useEffect(function drawGraph() {
    if (nodes && links) graphRef.current?.graphData({ nodes, links });
  }, [graphRef, nodes, links]);

  return (<>
    <TopBar resetGraph={resetGraph} />
    <BottomBar />
    <div id="graph" className="h-screen w-screen" />
    <Outlet context={[addNode]} />
  </>);
}