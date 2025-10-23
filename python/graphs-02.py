# 1. Complete the constructor:
#   - It should create an empty dictionary called graph as a data member.
# 2. Complete the add_edge method. It takes two vertices as inputs, and adds an edge to the adjacency list (the dictionary):
#   - Be sure to map both vertices to each other, it's a bidirectional edge.
#   - Handle the case where a set for a vertex doesn't exist yet.
#   - The resulting graph maps vertices to a set of all other vertices they share an edge with. For example:
    


class Graph:
    def __init__(self):
        self.graph = {} # this is a bidirectional graph

    def add_edge(self, u, v):     
        
        if u not in self.graph:
            self.graph[u] = set()
        adj_list = self.graph[u]
        adj_list.add(v)
        # add to the other vertice
        if v not in self.graph:
            self.graph[v] = set()
        adj_list = self.graph[v]
        adj_list.add(u)      
         
    def __str__(self):
        return str(self.graph)     

    # don't touch below this line

    def edge_exists(self, u, v):
        if u in self.graph and v in self.graph:
            return (v in self.graph[u]) and (u in self.graph[v])
        return False


def main():
    
    g = Graph()
    g.add_edge(2,3)
    g.add_edge(4,35)
    g.add_edge(2,7)
    print("print graph", g.graph)
    
main()    