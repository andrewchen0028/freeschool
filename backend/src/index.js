const cors = require("cors");
const express = require("express");

const prisma = require('./prisma');
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime");
const Node = prisma.node;
const Link = prisma.link;
const Resource = prisma.resource;
const User = prisma.user;
const Sublink = prisma.sublink;
const ResourceComment = prisma.resourceComment;

const app = express();
app.use(express.json());
app.use(cors());

// TODO-current:
//  implement user authentication
//  https://fullstackopen.com/en/part4/user_administration#creating-users
const usersRouter = require("./controllers/users.js");
const loginRouter = require("./controllers/login.js");
const { user } = require("./prisma");
const { response } = require("express");
app.use("/users", usersRouter);
app.use("/login", loginRouter);

// TODO-medium:
//  organize "app.get/post/delete()" calls into routers, as shown above

// Called upon opening the graph from the homepage. Will eventually need to
// filter item visibility by score somehow - maybe this should be done by
// the client to avoid round-trip delay when using the score filter slider?
// (Also to avoid increasing server load with number of clients)

// Only returns elements which are not subnodes of other elements and links which connect those elements
app.get("/", async function getBaseGraph(_, response) {
  Node.findMany({
    where: {
      subNodeIdToNode: {
        none: {},
      },
    },
  }).then((nodes) => {
    nodeIds = nodes.map((node) => { return node.id });
    Link.findMany({
      where: {
        OR: [
          { source: { in: nodeIds } },
          { target: { in: nodeIds } },
        ]
      }
    }).then((links) => {
      return response.json({ nodes, links }).status(200).end();
    }).catch((error) => {
      console.warn(`getBaseGraph in backend index failed to get links: ${error}`);
      return response.status(500).end();
    })
  }).catch((error) => {
    console.warn(`getBaseGraph in backend index failed to get nodes: ${error}`);
    return response.status(500).end();
  });
});

app.get("/:nodeId/subgraph", function getSubgraph(request, response) {
  Node.findMany({
    where: {
      subNodeIdToNode: {
        some: { superId: parseInt(request.params.nodeId) },
      },
    },
  }).then((nodes) => {
    nodeIds = nodes.map((node) => { return node.id });
    Link.findMany({
      where: {
        OR: [
          { source: { in: nodeIds } },
          { target: { in: nodeIds } },
        ]
      }
    }).then((links) => {
      return response.json({ nodes, links }).status(200).end();
    }).catch((error) => {
      console.warn(`getBaseGraph in backend index failed to get links: ${error}`);
      return response.status(500).end();
    })
  }).catch((error) => {
    console.warn(`getBaseGraph in backend index failed to get nodes: ${error}`);
    return response.status(500).end();
  });
})

// Called upon opening a NodeWindow. Returns node metadata.
// (request.params.nodeId is of type string here, but needs to be int for db)
app.get("/:nodeId", function getNodeWindow(request, response) {
  Node.findUnique({
    where: { id: parseInt(request.params.nodeId) },
  }).then((node) => {
    return response.json(node).status(200).end();
  }).catch((error) => {
    console.warn(`Failed to get node: ${error}`);
    return response.status(500).end();
  });
});

// Called upon selecting Resources within a NodeWindow.
// this currently returns nothing because the RESET function isn't fixed yet
app.get("/:nodeId/resources", function getNodeResources(request, response) {
  Resource.findMany({
    where: { nodeId: parseInt(request.params.nodeId) }
  }).then((resources) => {
    return response.json(resources).status(200).end();
  }).catch((error) => {
    console.warn(`Failed to get resources: ${error}`);
    return response.status(500).end();
  });
});

// Called upon selecting Resources within a NodeWindow - fetches the comments for a resource
// TODO-high: Return comments in nested structure
app.get("/:nodeId/:resourceId/comments", function getResourceComments(request, response) {
  ResourceComment.findMany({
    where: { resourceId: parseInt(request.params.resourceId) }
  }).then((comments) => {
    return response.json(comments).status(200).end();
  }).catch((error) => {
    console.warn(`Failed to get resource comments: ${error}`);
    return response.status(500).end();
  });
});

// Called upon selecting Inlinks within a NodeWindow.
app.get("/:nodeId/inlinks", function getNodeInlinks(request, response) {
  // Maps findMany() result [{inlink}] to [{sourceNode, ...inlink}] to expose
  // sourceNode metadata to frontend
  Link.findMany({
    where: { target: parseInt(request.params.nodeId) }
  }).then((inlinks) => {
    Promise.all(inlinks.map((inlink) => (
      Node.findUnique({ where: { id: inlink.source } })
        .then((sourceNode) => ({ sourceNode, ...inlink }))
    ))).then((inlinks) => {
      return response.json(inlinks).status(200).end();
    });
  }).catch((error) => {
    console.warn(`Failed to get inlinks: ${error}`);
    return response.status(500).end();
  });
});

// Called upon selecting Outlinks within a NodeWindow.
// TODO-low: merge GET endpoints for inlinks/outlinks
app.get("/:nodeId/outlinks", function getNodeOutlinks(request, response) {
  // Maps findMany() result [{outlink}] to [{targetNode, ...outlink}] to expose
  // targetNode metadata to frontend
  Link.findMany({
    where: { source: parseInt(request.params.nodeId) }
  }).then((outlinks) => {
    Promise.all(outlinks.map((outlink) => (
      Node.findUnique({ where: { id: outlink.target } })
        .then((targetNode) => ({ targetNode, ...outlink }))
    ))).then((outlinks) => {
      return response.json(outlinks).status(200).end();
    });
  }).catch((error) => {
    console.warn(`Failed to get outlinks: ${error}`);
    return response.status(500).end();
  });
});

// Called upon posting a node.
app.post("/node", function postNode(request, response) {
  Node.create({
    data: { title: request.body.title }
  }).then((node) => {
    return response.json(node).status(200).end();
  }).catch(
    (error) => {
      switch (error.code) {
        case "P2002":
          console.warn(`Attempted to add duplicate node: `
            + `${request.body.title}`);
          return response.status(409).end();
        default:
          console.warn(`Failed to add node ${request.body.title}: `
            + `${error}`);
          return response.status(500).end();
      }
    });
});

// Called upon posting a node vote.
app.post("/:nodeId/vote/:vote", async function postNodeVote(request, response) {
  switch (request.params.vote) {
    case "upvote":
      await Node.update({
        data: { score: { increment: 1 } },
        where: { id: parseInt(request.params.nodeId) }
      });
      return response.status(200).end();
    case "downvote":
      await Node.update({
        data: { score: { decrement: 1 } },
        where: { id: parseInt(request.params.nodeId) }
      });
      return response.status(200).end();
    default:
      console.error("Received invalid vote");
      return response.status(400).end();
  }
});

// Called upon posting a resource.
app.post("/:nodeId/resource", function postResource(request, response) {
  Resource.create({
    data: {
      url: request.body.url,
      node: { connect: { id: parseInt(request.params.nodeId) } }
    }
  }).then(() => {
    return response.status(200).end();
  }).catch(/** @param {PrismaClientKnownRequestError} error */
    (error) => {
      switch (error.code) {
        case "P2002":
          console.warn(`Attempted to add duplicate resource: `
            + `${request.body.url}`);
          return response.status(409).end();
        default:
          console.warn(`Failed to add resource ${request.body.url}: `
            + `${error}`);
          return response.status(500).end();
      }
    });
});

// Called upon posting an inlink.
app.post("/:nodeId/inlink", async function postInlink(request, response) {
  let sourceNode = await Node.findUnique({ where: { title: request.body.sourceNodeTitle } });

  Link.create({
    data: {
      sourceNode: { connect: { id: sourceNode.id } },
      targetNode: { connect: { id: parseInt(request.params.nodeId) } }
    }
  }).then((inlink) => {
    return response.json(inlink).status(200).end();
  }).catch(/** @param {PrismaClientKnownRequestError} error */
    (error) => {
      console.warn(error);
      // TODO-medium: Add actual error handling
      return response.status(500).end();
    });
});

// Called upon posting an outlink.
// TODO-low: merge POST endpoints for inlinks/outlinks
app.post("/:nodeId/outlink", async function postOutlink(request, response) {
  let targetNode = await Node.findFirst({ where: { title: request.body.targetNodeTitle } });
  Link.create({
    data: {
      sourceNode: { connect: { id: parseInt(request.params.nodeId) } },
      targetNode: { connect: { id: targetNode.id } }
    }
  }).then((outlink) => {
    return response.json(outlink).status(200).end();
  }).catch(/** @param {PrismaClientKnownRequestError} error */
    (error) => {
      console.warn(error);
      return response.status(500).end();
    });
});

// Return the user object given a user id
app.get("/:userId/username", async function getUsername(request, response) {
  let userIdInt = parseInt(request.params.userId);
  let user = await User.findUnique({
    where: {
      id: userIdInt
    }
  }).catch((error) => console.warn(error));
  if (user == null) {
    throw ("Didn't find a user with userId ", userIdInt);
  } else {
    return response.json(user).status(200).end();
  }
});

// DEBUG ONLY
app.delete("/", async function resetDatabase(_, response) {
  // Had to change order to keep referential integrity - would be better if we could set "cascade: true" here
  await Link.deleteMany();
  await Sublink.deleteMany();
  await ResourceComment.deleteMany();
  await Resource.deleteMany();
  await Node.deleteMany();
  await User.deleteMany();

  await Node.createMany({
    data: [
      { id: 0, title: "Calculus 1" },
      { id: 1, title: "Calculus 2" },
      { id: 2, title: "Continuity" },
      { id: 3, title: "Limits" },
      { id: 4, title: "Derivatives" },
    ]
  });

  await Link.createMany({
    data: [
      { id: 0, source: 0, target: 1 },
      { id: 2, source: 3, target: 4 },
      { id: 1, source: 2, target: 3 },
    ]
  });

  await Sublink.createMany({
    data: [
      { id: 0, superId: 0, subId: 2 },
      { id: 1, superId: 0, subId: 3 },
      { id: 2, superId: 0, subId: 4 }
    ]
  });

  await Resource.createMany({
    data: [
      { id: 0, nodeId: 0, url: "https://www.fbi.gov" },
      { id: 1, nodeId: 0, url: "https://www.atf.gov" },
      { id: 2, nodeId: 1, url: "https://www.nsa.gov" },
      { id: 3, nodeId: 1, url: "https://www.cia.gov" },
    ]
  });

  await ResourceComment.createMany({
    data: [
      { id: 0, text: "Why is this here?", resourceId: 0 },
      { id: 1, text: "You didn't try to bribe the FBI agent, did you?", resourceId: 0, parentCommentId: 0 }
    ]
  });

  // username joe, password mama
  await prisma.user.create({ data: { username: "joe", passwordHash: "$2b$10$zmtkFvfj25ANZ9wZjQYcXeWjhTUZk1LgHyZ9a2nRzyvFYjVd2g4AK" } });

  return response.status(200).end();
}
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});