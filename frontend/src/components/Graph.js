import axios from "axios";
import ForceGraph from "force-graph";

import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
import { ForceGraphInstance } from "force-graph";

import url from "..";
import colors from "../colors";
import TopBar from "./TopBar";

export default function Graph() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [hover, setHover] = useState();

  // Typedef here so we get intellisense on `graphRef.current` elsewhere
  /** @type {React.MutableRefObject<ForceGraphInstance | undefined>} */
  const graphRef = useRef();
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

  useEffect(function initializeGraphRef() {
    graphRef.current = ForceGraph()(document.getElementById("graph"));
    axios.get(`${url}/`).then((response) => {
      setNodes(response.data.nodes);
      setLinks(response.data.links);
    });
  }, []);

  // NOTE: Effect initializeGraph() must be separate from initializeGraphRef(), 
  // otherwise the graph gets redrawn from scratch upon closing a node window.
  useEffect(function initializeGraph() {
    function paintRing(node, color, ctx, radius) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, false);
      ctx.fill();
    }

    graphRef.current
      .linkDirectionalArrowLength(4.0)
      .linkDirectionalArrowRelPos(0.5)
      .backgroundColor(colors.slate[200])
      .nodePointerAreaPaint((node, color, ctx) => {
        paintRing(node, color, ctx, node.__bckgRadius);
      })
      .nodeCanvasObject((node, ctx, globalScale) => {
        const fontSize = graphRef.current.zoom() * 4 / globalScale;
        const ringRadius = 2 + ctx.measureText(node.id).width / 2;
        const ringColor = node === hover
          ? colors.neutral[400]
          : colors.neutral[300];
        paintRing(node, ringColor, ctx, ringRadius + 0.4);
        paintRing(node, colors.white, ctx, ringRadius);
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = colors.orange[600];
        ctx.fillText(node.id.replace("-", " "), node.x, node.y);
        node.__bckgRadius = ringRadius;
      })
      .onNodeHover((node) => { setHover(node); })
      .onNodeClick((node) => { navigate(`${node.id.replace(" ", "-")}`); });
  }, [graphRef, hover, navigate]);

  useEffect(function redrawGraph() {
    if (graphRef.current) { graphRef.current.graphData({ nodes, links }); }
  }, [graphRef, nodes, links]);

  return (
    <div>
      <TopBar resetGraph={resetGraph} />
      <div id="graph" className="h-screen w-screen" />
      <Outlet />
    </div>
  );
}