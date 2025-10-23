


class Trie:

    # Check for complete words:
        # If the current level contains an end marker, add the current prefix to the words collection.
    # Process each character in the current level in sorted order. For each character (except end markers):
        # Extend the prefix with the current character (e.g., current_prefix + character, rather than modifying the prefix in place).
        # Recursively search the child level with the extended prefix.
    # Return all words found.
    def search_level(self, current_level, current_prefix, words):
        pass

   
    # Create an empty list to store matching words.
    # Keep track of the current trie level, starting at the root.
    # Iterate through each character in the prefix:
    # If the character doesn't exist in the current level, return an empty list: no words start with this prefix.
    # If the character does exist, move to the child level corresponding to the current character.
    # By now, the current level should correspond to the last character in the prefix. Use the search_level function to find all words starting from this level and return them.
    def words_with_prefix(self, prefix):
        
        current_level = self.root
        for ch in prefix:
            if not ch in current_level:
                return []  # no words start with this prefix
            currentLevel = currentLevel[ch]
                    
        return self.collectWords(prefix, currentLevel)
          

    
    def collect_words(self, prefix, current_level, matched_words = None ):
        
        if matched_words is None:
            matched_words = []
    
        for n in current_level: # e,i
            if n == self.end_symbol:
                matched_words.append(prefix)
                continue
            self.collectWords(prefix + n, current_level[n], matched_words)
        
        return matched_words            
            
        
    def exists(self, word):
        
        prefix_match_depth = 0;
        current_level = self.root
        for ch in word:     
            if ch in current_level:
                current_level = current_level[ch]
                prefix_match_depth += 1
        
        return self.end_symbol in current_level, prefix_match_depth    

    # don't touch below this line

    def __init__(self):
        self.root = {}
        self.end_symbol = "*"
        

    def add(self, word):
        current_level = self.root
        for letter in word:
            if letter not in current_level:
                current_level[letter] = {}
            current_level = current_level[letter]
        current_level[self.end_symbol] = True


t = Trie()

t.add("developer")
t.add("development")
t.add("devops")
t.add("devin")
t.add("deviation")

prefixWord = "d"
print("found word with prefix?: ", prefixWord, t.words_with_prefix(prefixWord))


