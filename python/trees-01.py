import random


user_names = [
            "Blake",
            "Ricky",
            "Shelley",
            "Dave",
            "George",
            "John",
            "James",
            "Mitch",
            "Williamson",
            "Burry",
            "Vennett",
            "Shipley",
            "Geller",
            "Rickert",
            "Carrell",
            "Baum",
            "Brownfield",
            "Lippmann",
            "Moses",
        ]
class User:
    def __init__(self, id):
        self.id = id
        self.user_name = f"{user_names[id % len(user_names)]}#{id}"

    def __eq__(self, other):
        return isinstance(other, User) and self.id == other.id

    def __lt__(self, other):
        return isinstance(other, User) and self.id < other.id

    def __gt__(self, other):
        return isinstance(other, User) and self.id > other.id

    def __repr__(self):
        return "".join(self.user_name)


class BSTNode:
    def __init__(self, val=None):
        self.left = None
        self.right = None
        self.val = val
       
    #     Check if the current node is empty (has no value). If it is, return None. This represents an empty tree or a leaf node where deletion has already occurred.
    # If the value to delete is less than the current node's value:
    # If there's a left child, recursively delete the value from the left subtree and update the left child reference with the result.
    # Return the current node.
    # If the value to delete is greater than the current node's value:
    # If there's a right child, recursively delete the value from the right subtree and update the right child reference with the result.
    # Return the current node.
    # If the value to delete equals the current node's value, we've found the node to delete:
    # If there is no right child, return the left child. This bypasses the current node, effectively deleting it.
    # If there is no left child, return the right child, accomplishing the same thing.
    # If there are both left and right children, we need to find the new "successor": the smallest node in the right subtree, which is the value next largest after the current node's value.
    # Find the smallest node in the right subtree by walking down the current right child's left branches until reaching a node with no left child.
    # Replace the current node's value with this successor's value.
    # Delete the successor node from the right subtree by recursively calling delete, and update the right child reference with the result.
    # Return the current node.    
    def delete(self, val):
        if not self.val:
            return None

        if  val < self.val:
             # go left
            if self.left:
                self.left =  self.left.delete(val)
            return self
                
        elif val > self.val:  
            if self.right:
                self.right = self.right.delete(val)
        else:        
            # found node to delete
            
            # Case 1
            if not self.left:
                return self.right
                
            # Case 2    
            if not self.right:
                return self.left
                
            # Case 3
            # Has both left and right children
            # Find successor in min of right child
            successor = self.right.get_min()
            # assign to current node
            self.val = successor
            # and delete val from right tree
            self.right = self.right.delete(successor)
            return self
            
            
            
    
    def get_min(self):
        # we are going to assume the tree has only positive values or ids
        
        # check if we reached a leaf node
        if not self.left:
            return self.val
            
        return self.left.get_min()    


    def get_max(self):
        if not self.right:
            return self.val
            
        return self.right.get_max()  

    # don't touch below this line    

    def insert(self, val):
        if not val:
            return
        
        if not self.val:
            self.val = val
            return
        
        if self.val == val:
            return # no duplicates
        
        if self.val > val:
            if not self.left:
                self.left = BSTNode(val)
            else:
                self.left.insert(val)
                
        # since we are here val > right
        if not self.right:
            self.right = BSTNode(val)
        else:
            self.right.insert(val)
        
def get_users(num):
    random.seed(1)
    users = []
    ids = []
    for i in range(num * 3):
        ids.append(i)
    random.shuffle(ids)
    ids = ids[:num]
    for id in ids:
        users.append(User(id))
    return users
    
    
def print_inorder(root):
    
    if not root:
        return
    print_inorder(root.left)
    print(root.val)
    print_inorder(root.right)
    
def main():
    
    users = get_users(6)
    print("Generated Users:", users)
    
    root = BSTNode()
    for u in users:
        root.insert(u)
        
    print("\nInorder traversal (sorted by ID):")
    # Test min/max
    print("\nmin user:", root.get_min())
    print("max user:", root.get_max())

     # Test deletion
    print("\nDeleting:", users[0])
    root = root.delete(users[0])
    print("Inorder after deleting", users[0])
    print_inorder(root)

    

main()    