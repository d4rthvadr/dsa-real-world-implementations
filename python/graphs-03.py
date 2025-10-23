class Graph:

    
    def adjacent_nodes(self, node):
        
        if not node in self.graph:
            return None 
        
        return self.graph[node]

            
            

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

    adjacent_nodes = graph.adjacent_nodes(1)
    # {0, 3}
    a = set()
    a.add(2)
    a.add(4)
    a.add(10)
    print("a-->",a)
    print("print graph", adjacent_nodes)
    
main()    