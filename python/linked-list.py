
class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

    def set_next(self, node):
        self.next = node

    def __repr__(self):
        return str(self.val)

class LinkedList:
    
    def __init__(self):
        self.head = None
        self.tail = None
    # Complete the remove_from_head method. It should remove the first node from the list (the head) and return it.
    
    # If the list is empty, just return None.
    # The head should now point to the next node in the list (if there is one).
    # The tail should be None if the list is now empty
    # The old head's Node should no longer point to anything
    
    def remove_from_head(self):
        if self.head is None:
            return
        
        old_head, self.head = self.head, self.head.next
        old_head.next = None
        
        if not self.head:
            self.tail = self.head
        
        return old_head    
    
    def add_to_head(self, val):

        node =  Node(val)
        if self.head is None:
            self.head = node
            self.tail = node
            return
        
        node.set_next(self.head)
        self.head = node
            

    # don't touch below this line

    def add_to_tail(self, val):
        node = Node(val)
        if self.head is None:
            self.head = node
            self.tail = node
            return
        
        self.tail.set_next(node)
        self.tail = node
        
    def add(self, val):
        if val is None:
            return 
        self.add_to_tail(val)



    def __iter__(self):
        node = self.head
        while node is not None:
            yield node
            node = node.next

    def __repr__(self):
        nodes = []
        for node in self:
            nodes.append(node.val)
        return " -> ".join(nodes)
        

def printList(ll):
    for val in ll:
        print(val)
    print("print tail", ll.tail)    
    
def main():
    
    ll = LinkedList()
    ll.add("first")
    ll.add("second")
    ll.add("third")
    ll.add_to_tail("five")
    ll.add_to_tail("ten")
   
    printList(ll)

    # testing
    print("after head removal 1")
    ll.remove_from_head() 
    printList(ll)
    
    print("after head removal 2")
    ll.remove_from_head() 
    printList(ll)


main()    