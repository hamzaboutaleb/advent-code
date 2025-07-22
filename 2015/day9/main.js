const fs = require("fs");

class Node {
  constructor(start, end, distance) {
    this.start = start;
    this.end = end;
    this.distance = distance;
  }
}

function parseInput(input) {
  const nodes = [];
  for (const line of input) {
    const [dir, distance] = line.split(" = ");
    const [star, end] = dir.split(" to ");
    const node = new Node(star, end, Number(distance));
    nodes.push(node);
  }
  return nodes;
}

function buildGraph(nodes) {
  const graph = {};
  for (let node of nodes) {
    const { start, end, distance } = node;
    if (!graph[start]) graph[start] = [];
    if (!graph[end]) graph[end] = [];

    graph[start].push([end, distance]);
    graph[end].push([start, distance]);
  }
  return graph;
}

function findAllRoutes(graph) {
  const routes = [];
  for (let [city, vertex] of Object.entries(graph)) {
    bfs(city);
  }

  function bfs(node, route = [], visited = new Set()) {
    visited.add(node);
    const neighbors = graph[node] || []
    let canAdd = true
    for (const [city, distance] of neighbors) {
      if (!visited.has(city)) {
        route.push([city, distance]);
        canAdd = false;
        bfs(city, route, visited);
        route.pop();
      }
    }
    visited.delete(node)
    if (canAdd) routes.push([...route]);
  }
  return routes
}

function shortestPath(routes) {
  let min = Infinity;

  routes.forEach(route => {
    const cost = route.reduce((acc, [_, v]) => acc + v, 0)
    min = Math.min(min, cost)
  })
  return min
}

function lognestPath(routes) {
  let min = -Infinity;

  routes.forEach(route => {
    const cost = route.reduce((acc, [_, v]) => acc + v, 0)
    min = Math.max(min, cost)
  })
  return min
}

const input = fs.readFileSync("input", "utf-8").trim().split("\n");
const nodes = parseInput(input);
const graph = buildGraph(nodes);
const routes = findAllRoutes(graph)
const minCost = shortestPath(routes)
const maxCost = lognestPath(routes)
console.log("minimum cost", minCost)
console.log("max cost", maxCost)

