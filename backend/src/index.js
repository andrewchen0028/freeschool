const cors = require("cors");
const express = require("express");

const { Node, Link, Resource } = require("./models/index");
const sequelize = require("./util/db");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", function getGraph(_, response) {
  Promise.all([
    Node.findAll({ logging: false }),
    Link.findAll({ logging: false }).then((links) => {
      return links.map((link) => ({
        id: link.id,
        source: link.sourceNodeId,
        target: link.targetNodeId,
      }));
    })
  ]).then(([nodes, links]) => {
    return response.json({ nodes, links }).status(200).end();
  });
});

app.get("/:id/:title", function getNodeWindow(request, response) {
  Resource.findAll({
    where: { nodeId: request.params.id },
    logging: false
  }).then((resources) => {
    return response.json(resources).status(200).end();
  })
});

// DEBUG ONLY
app.delete("/", async function resetDatabase(_, response) {
  await Node.drop({ cascade: true, logging: false });
  await Link.drop({ cascade: true, logging: false });
  await Resource.drop({ cascade: true, logging: false });
  await sequelize.sync({});

  await Node.bulkCreate([
    { title: "Calculus 1" },
    { title: "Calculus 2" }
  ], { logging: false });

  await Link.create({ sourceNodeId: 1, targetNodeId: 2 }, { logging: false });

  await Resource.bulkCreate([
    { title: "Resource A", nodeId: 1 },
    { title: "Resource B", nodeId: 1 },
    { title: "Resource C", nodeId: 2 },
    { title: "Resource D", nodeId: 2 },
  ], { logging: false });

  return response.status(200).end();

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});