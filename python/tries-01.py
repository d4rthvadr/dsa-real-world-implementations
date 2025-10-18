class Trie:
    
    def __init__(self):
        self.root = {}
        self.end_symbol = "*"
        
    
    #     Starting with the root of the trie, assign the current dictionary to a variable.
    # Loop over the letters in the word.
    # If the current letter is not in the current dictionary, return False.
    # Update current to point to the dictionary at the letter key.
    # Once you get to the last letter, return True if end_symbol is in the current dictionary, and False if it isn't.    
    def exists(self, word):
        
        current = self.root
        for ch in word:
            if ch not in current:
                return False
            current = current[ch]
            
        # exhausted the word search
        return self.end_symbol in current

        
    def add(self, word):
        
        current = self.root
        for ch in word:
            if ch not in current:
                current[ch] = {}
            current = current[ch]
            
        # mark completion of word    
        current[self.end_symbol] = True    



def main():
    
    t = Trie()

    t.add("developer")
    t.add("development")
    t.add("devops")
    t.add("devin")
    t.add("deviation")
    
    print("final trie: ", t.root)
    print("check if word exists: ", t.exists("devin2"))
    

if __name__ == "__main__":
    main()

