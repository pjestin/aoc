use regex::Regex;
use std::collections::{HashMap, HashSet};
use std::fs::File;
use std::io::{BufReader, Lines};

struct Edge {
  distance: i32,
  destination: String,
}

struct Vertex {
  name: String,
  edges: Vec<Edge>,
}

fn add_edge(
  graph: &mut HashMap<String, Vertex>,
  origin: &String,
  destination: &String,
  distance: i32,
) {
  if !graph.contains_key(origin) {
    graph.insert(
      origin.clone(),
      Vertex {
        name: origin.clone(),
        edges: vec![],
      },
    );
  }
  let origin_vertex = graph.get_mut(origin).unwrap();
  origin_vertex.edges.push(Edge {
    distance: distance,
    destination: destination.clone(),
  });
}

const PATTERN: &str = r"(\w+) to (\w+) = (\d+)";

fn parse_graph<'a>(lines: Lines<BufReader<File>>) -> HashMap<String, Vertex> {
  let mut graph: HashMap<String, Vertex> = HashMap::new();
  lines.for_each(|line| {
    let unwrapped_line = line.unwrap();
    let re = Regex::new(PATTERN).unwrap();
    let cap = re.captures(unwrapped_line.as_str()).unwrap();
    let origin: String = cap[1].to_string();
    let destination: String = cap[2].to_string();
    let distance = cap[3].parse::<i32>().unwrap();
    add_edge(&mut graph, &origin, &destination, distance);
    add_edge(&mut graph, &destination, &origin, distance);
  });
  graph
}

fn find_shortest_distance(
  graph: &HashMap<String, Vertex>,
  start: &Vertex,
  visited: &mut HashSet<String>,
) -> i32 {
  let mut new_visited = visited.clone();
  new_visited.insert(start.name.clone());
  if new_visited.len() == graph.len() {
    return 0;
  }
  start
    .edges
    .iter()
    .filter(|edge| !visited.contains(&edge.destination))
    .map(|edge| {
      let destination_vertex: &Vertex = &graph[&edge.destination];
      edge.distance + find_shortest_distance(graph, &destination_vertex, &mut new_visited)
    })
    .min()
    .unwrap()
}

pub fn find_shortest_distance_to_visit_all(lines: Lines<BufReader<File>>) -> i32 {
  let graph: HashMap<String, Vertex> = parse_graph(lines);
  graph
    .values()
    .map(|vertex| {
      let mut visited: HashSet<String> = HashSet::new();
      find_shortest_distance(&graph, vertex, &mut visited)
    })
    .min()
    .unwrap()
}

fn find_longest_distance(
  graph: &HashMap<String, Vertex>,
  start: &Vertex,
  visited: &mut HashSet<String>,
) -> i32 {
  let mut new_visited = visited.clone();
  new_visited.insert(start.name.clone());
  if new_visited.len() == graph.len() {
    return 0;
  }
  start
    .edges
    .iter()
    .filter(|edge| !visited.contains(&edge.destination))
    .map(|edge| {
      let destination_vertex: &Vertex = &graph[&edge.destination];
      edge.distance + find_longest_distance(graph, &destination_vertex, &mut new_visited)
    })
    .max()
    .unwrap()
}

pub fn find_longest_distance_to_visit_all(lines: Lines<BufReader<File>>) -> i32 {
  let graph: HashMap<String, Vertex> = parse_graph(lines);
  graph
    .values()
    .map(|vertex| {
      let mut visited: HashSet<String> = HashSet::new();
      find_longest_distance(&graph, vertex, &mut visited)
    })
    .max()
    .unwrap()
}

#[cfg(test)]
mod tests {
  use crate::day09::{find_longest_distance_to_visit_all, find_shortest_distance_to_visit_all};
  use crate::file_utils::read_lines;

  #[test]
  fn test_find_shortest_distance_to_visit_all() {
    assert_eq!(
      605,
      find_shortest_distance_to_visit_all(read_lines("./res/day09/input-test.txt").unwrap())
    );
    assert_eq!(
      117,
      find_shortest_distance_to_visit_all(read_lines("./res/day09/input.txt").unwrap())
    );
  }

  #[test]
  fn test_find_longest_distance_to_visit_all() {
    assert_eq!(
      982,
      find_longest_distance_to_visit_all(read_lines("./res/day09/input-test.txt").unwrap())
    );
    assert_eq!(
      909,
      find_longest_distance_to_visit_all(read_lines("./res/day09/input.txt").unwrap())
    );
  }
}
