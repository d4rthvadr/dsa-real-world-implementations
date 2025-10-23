class Graph:
    
    # 1. Complete the __init__ method.
    # [] Create a new data member called graph, it should be an empty list.
    # [] Fill the graph with n lists, where n is the number of vertices in the graph.
    # [] Each of these lists should contain n False values.
    
    # 2. Complete the add_edge method.
    # [] It takes two vertices as inputs
    # [] It adds an edge to the graph by setting the corresponding cells to True.
    # [] There are two cells in the matrix for each pair of vertices. For example, (2, 3) corresponds to these cells:
    
    def __init__(self, num_vertices):
        # self.graph = [False for _ in range(num_vertices)]
        self.graph = [[ False for _ in range(num_vertices) ] for _ in range(num_vertices)]


    def add_edge(self, u, v):
        # u is row and v is col
        
        if u < 0 or u >= len(self.graph):
            return False
        if len(self.graph) == 0:
            return False
        if v < 0 or v >= len(self.graph[0]):
            return False
        self.graph[u][v] = True

    # don't touch below this line

    def edge_exists(self, u, v):
        if u < 0 or u >= len(self.graph):
            return False
        if len(self.graph) == 0:
            return False
        row1 = self.graph[0]
        if v < 0 or v >= len(row1):
            return False
        return self.graph[u][v]


def main():
    
    g = Graph(4)
    print("Before edge addition", g.graph)
    g.add_edge(2,3)
    
    edges_to_add = [(2,3), (1,2), (3,3),(0,0), (0,3)]
    
    for edge in edges_to_add:
        print("----")
        print("addding edge: ", edge)
        g.add_edge(edge[0],edge[1])
        
    print("after adding edge", g.graph)
    
    for edge in edges_to_add:
        print("check if edge exists: ", g.edge_exists(edge[0],edge[1]))
    
    
main()    