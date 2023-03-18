import axios from "axios";
import ForceGraph, { ForceGraphInstance, GraphData, LinkObject, NodeObject } from "force-graph";
import { useCallback, useEffect, useRef, useState, useContext } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { url } from "..";
import colors from "../colors";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import { Node, User } from "shared-data";
import { UserContext } from "./UserContext";

// TODO-low: make graph react to window size changes.
export default function Graph() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [hover, setHover] = useState<NodeObject | null>();

  const graphRef = useRef<ForceGraphInstance>();
  const navigate = useNavigate();
  const { superNodeTitle } = useParams();
  const [user, setUser] = useState<User>({id: -1, username: ""});

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
      .linkDirectionalArrowLength(3.0)
      .linkDirectionalArrowRelPos(0.5)
      .linkAutoColorBy(() => colors.white)
      .backgroundColor(colors.blackDenim);
    axios.get(`${url}/${superNodeTitle}`).then((res) => {
      switch (res.status) {
        case 200:
          setGraphData({ nodes: res.data.nodes, links: res.data.links })
          break;
        case 204:
          setGraphData({ nodes: [], links: [] })
          console.warn(`${superNodeTitle} has no subnodes`);
          break;
        default:
          console.warn(`Unrecognized HTTP status: ${res.status}`);
          break;
      }
    }).catch((err) => { console.warn(err.response.data); });
  }, [superNodeTitle]);

  // NOTE: Effect initializeGraph() must be separate from initializeGraphRef(), 
  // otherwise the graph gets redrawn from scratch upon closing a node window.
  // TODO-low: implement interactive grid background
  //       (see https://github.com/vasturiano/react-force-graph/issues/321)
  useEffect(function initializeGraph() {
    let robotoThin = new FontFace(
      "Roboto",
      "url(https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1MmgVxFIzIXKMnyrYk.woff2)",
    );
    robotoThin.load().then((font) => {
      document.fonts.add(font);
      graphRef.current!
        .onNodeClick((nodeObject) => {
          navigate(`/${superNodeTitle}/${(nodeObject as Node).title}`);
        })
        .nodePointerAreaPaint((nodeObject, color, ctx) => {
          paintRing(nodeObject, color, ctx, (nodeObject as Node).__bckgRadius!);
        })
        .nodeCanvasObject((nodeObject, ctx, globalScale) => {
          let node = nodeObject as Node;
          const bckgColor = colors.slate[700];
          ctx.shadowColor = colors.nearWhite;
          ctx.shadowBlur = 8;
          node.__bckgRadius = Math.max(ctx.measureText(node.title).width / 2 + 2, 12);
          paintRing(node, bckgColor, ctx, node.__bckgRadius);
          const fontSize = graphRef.current!.zoom() * 4 / globalScale;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = colors.nearWhite;
          ctx.shadowBlur = 0;
          ctx.shadowColor = colors.nearWhite;
          ctx.font = `${fontSize}px Roboto`;
          ctx.fillText(node.title, node.x!, node.y!);
        })
        .onNodeHover((nodeObject) => { setHover(nodeObject); })
        .onNodeRightClick((nodeObject) => { navigate(`/${(nodeObject as Node).title}`); });
    })
  }, [graphRef, superNodeTitle, hover, paintRing, navigate]);

  useEffect(function redrawGraph() {
    graphRef.current!.graphData(graphData)
  }, [graphRef, graphData]);

  return (
    <div className="bg-black-denim z-1">
      <UserContext.Provider value={{user}}>
        <Outlet context={[addNode, addLink]} />
        <BottomBar />
        <div id="graph" className="h-screen w-screen pt-20 overflow-hidden z-1" />
        <UserContext.Consumer>
            {({user}) => {
              <TopBar user={user}/>
            }}
        </UserContext.Consumer>
      </UserContext.Provider>
    </div>
  );
}

export type addNodeFunction = (node: NodeObject) => void;
export type addLinkFunction = (link: LinkObject) => void;