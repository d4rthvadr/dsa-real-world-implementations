class HashMap:
    

    def resize(self):
        pass

    def current_load(self):
        pass
    
    def key_to_index(self, key):
        return hash(key) % len(self.hashmap)
        
    def get_bucket(self, key):
        return self.hashmap[self.key_to_index(key)]
        
    def set(self, key, value):
        bucket = self.get_bucket(key)
        for i , (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
            
        # [(1,1), (2,2)]
        bucket.append((key, value))
        
    def get(self, key):
        bucket = self.get_bucket(key)
        for i , (k, v) in enumerate(bucket):
            if k == key:
                return v
        return None

    # don't touch below this line

    def __init__(self, size):
        self.hashmap = [[] for _ in range(size)]

    def __repr__(self):
        buckets = []
        for v in self.hashmap:
            if v != None:
                buckets.append(v)
        return str(buckets)
        

def main():
    
    hm = HashMap(4)
    hIndex = hm.key_to_index("bobby")
    hm.set("bobby", "valentino")
    
    b = []
    b.append((1, "one"))
    b.append((2, "two"))
    b.append((2, "two"))
    
    print("...in main", hm, b)
    
    for  k, (i, x) in enumerate(b):
        print("Enumerate: ",k, i, x)
    print("get value: ", hm.get("bobby"))
    

main()        
