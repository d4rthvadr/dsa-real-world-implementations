class Graph:
    
    #     This method traverses a graph level by level starting from a specified vertex, and returns all vertices in the order they were visited. The breadth-first approach ensures we explore all vertices at the current distance from the start before moving further away.

    # 1. Initialize tracking structures:
    #   -   Create a list to track visited vertices
    #   -   Create a list to use as a queue for vertices waiting to be explored
    # 2. Begin the search:
    #   -   Add the starting vertex to the queue
    # 3. Process the queue until empty:
    #   -   Remove the first vertex from the queue and add it to the visited list
    #   -    Get a sorted list of this vertex's neighbors
    #       -   For each neighbor:
    # 4. If it is neither visited nor queued, add it to the queue
    #   -   When complete:
    #   -   Return the visited list containing vertices in the order they were discovered
    def breadth_first_search(self, start):
        
        if start is None or start not in self.graph:
            return []
        
        visited = []
        print("adding initial node")
        queue = [start]
        
        
        while (len(queue) > 0):
            start_node = queue.pop(0)
            
            if start_node not in visited:
                visited.append(start_node)

            for connected_node in self.graph[start_node]:
                if connected_node in visited or connected_node in queue :
                    continue
                queue.append(connected_node)
                
        return visited        
            

    # don't touch below this line

    def __init__(self):
        self.graph = {}

    def add_edge(self, u, v):
        self.graph.setdefault(u, set()).add(v)   
        self.graph.setdefault(v, set()).add(u)   
  


def main():
    graph = Graph()
    graph.add_edge(0, 1)
    graph.add_edge(0, 2)
    graph.add_edge(1, 3)
    graph.add_edge(2, 3)
    
    visited_nodes = graph.breadth_first_search(3)
    print("visited nodes: ", visited_nodes)


main()