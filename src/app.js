const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);

  return response.status(200).json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) return response.status(400).json({ error: "Project not found" });

  if(title == undefined && url == undefined && techs == undefined) {
    return response.status(401).json({ warning: "You need insert a info for update" });
  }

  // if(likes >= 0 || likes <= 0) {
  //   return response.status(401).json({ warning: "You can't change of like numbers" });
  // }
  
  const updatedRepo = {
    id: repositories[repoIndex].id,
    title: title != undefined ? title : repositories[repoIndex].title,
    url: url != undefined ? url : repositories[repoIndex].url,
    techs: techs != undefined ? techs : repositories[repoIndex].techs,
    likes: repositories[repoIndex].likes
  };

  repositories[repoIndex] = updatedRepo;

  return response.status(200).json(updatedRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) return response.status(400).json({ error: "Project not found" });

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) return response.status(400).json({ error: "Project not found" });

  const likerepo = {
    id,
    title: repositories[repoIndex].title,
    url: repositories[repoIndex].url,
    techs: repositories[repoIndex].techs,
    likes: repositories[repoIndex].likes + 1,
  }

  repositories[repoIndex] = likerepo;

  return response.status(200).json(likerepo.likes);
});

module.exports = app;
