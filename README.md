# Data Structures & Algorithms - Real World Implementations

A practical learning repository demonstrating how fundamental data structures and algorithms power real-world applications.

## 🎯 Goal

This repository aims to bridge the gap between theoretical computer science concepts and their practical applications. Instead of isolated algorithm implementations, each project showcases how DSA concepts solve actual problems in software systems.

**Core Philosophy:**

- 📚 **Learn by Building**: Understand DSA through real-world use cases
- 🔄 **Continuous Learning**: Regular updates with new implementations
- 🌉 **Theory to Practice**: See how textbook concepts become production code
- 💡 **Pattern Recognition**: Identify when and why to use specific data structures

## 🗂️ Project Structure

```
DSA-implementations/
├── python/              # Python implementations
│   ├── hashmap-01.py
│   ├── linked-list.py
│   ├── trees-01.py
│   └── tries-01.py
├── typescript/          # TypeScript implementations
│   └── src/
│       ├── dsa/         # Pure DSA implementations
│       └── [apps]/      # Real-world applications
└── single-linked-list.js
```

## 🚀 Real-World Applications

### 1. **Plugin System** ([`plugin.ts`](typescript/src/plugin.ts), [`plugin.optimized.ts`](typescript/src/plugin.optimized.ts), [`plugin.optimized.trie.ts`](typescript/src/plugin.optimized.trie.ts))

**DSA Concepts**: Hash Maps, Tries, Event-Driven Architecture

A production-ready editor plugin system demonstrating:

- **Hash Map**: O(1) plugin lookup and event handler mapping
- **Trie**: Hierarchical event routing (e.g., `user.onStart`, `user.onSave`)
- **Queue**: Async event execution with microtask scheduling

**Real-world Applications**:

- VS Code extensions system
- WordPress plugins
- Browser extension APIs
- Middleware pipelines

**Evolution**:

1. Basic implementation with O(n) plugin iteration
2. Optimized with O(1) event lookup using Maps
3. Advanced trie-based hierarchical event routing

### 2. **Music Player** ([`music-player.ts`](typescript/src/music-player.ts))

**DSA Concepts**: Queue, State Machine, Linked List

A type-safe music player with queue management:

- **Queue**: Song playlist with next/previous navigation
- **State Machine**: Play/pause state transitions
- **Array/Linked List**: Sequential song ordering

**Real-world Applications**:

- Spotify/Apple Music queue systems
- YouTube playlist management
- Podcast players
- Video streaming buffers

### 3. **GitHub Actions Simulator** ([`github-action.ts`](typescript/src/github-action.ts))

**DSA Concepts**: Graphs, Topological Sort, State Management

Simulates GitHub Actions workflow execution:

- **Directed Acyclic Graph (DAG)**: Job dependencies
- **Topological Sort**: Execution order resolution
- **State Machine**: Job lifecycle management

**Real-world Applications**:

- CI/CD pipelines (GitHub Actions, CircleCI)
- Task dependency systems
- Build orchestration tools
- Workflow engines

### 4. **Form Builder** ([`form-builder.ts`](typescript/src/form-builder.ts))

**DSA Concepts**: Builder Pattern, Validation Chains

Dynamic form construction with validation:

- **Builder Pattern**: Fluent API for form creation
- **Chain of Responsibility**: Validation pipeline
- **Composite Pattern**: Nested form structures

**Real-world Applications**:

- Survey platforms (Typeform, Google Forms)
- Admin panels
- Dynamic configuration UIs
- E-commerce checkout flows

### 5. **AST Parser** ([`ast.ts`](typescript/src/ast.ts))

**DSA Concepts**: Trees, Recursion, Tree Traversal

Abstract Syntax Tree implementation:

- **Tree**: Hierarchical code representation
- **Depth-First Search**: Tree traversal for code analysis
- **Recursion**: Expression evaluation

**Real-world Applications**:

- Compilers and interpreters
- Code formatters (Prettier)
- Linters (ESLint)
- Transpilers (Babel, TypeScript)

### 6. **Cooldown System** ([`cooldown-spell.rpg.ts`](typescript/src/cooldown-spell.rpg.ts))

**DSA Concepts**: Priority Queue, Time-based Scheduling

RPG-style ability cooldown management:

- **Priority Queue**: Time-ordered ability availability
- **Heap**: Efficient next-available-ability lookup
- **Scheduling**: Time-based state updates

**Real-world Applications**:

- Game ability systems (League of Legends, WoW)
- Rate limiting APIs
- Task scheduling
- Caching systems with TTL

## 📊 DSA Concepts Overview

| Data Structure     | Use Cases                              | Projects                    |
| ------------------ | -------------------------------------- | --------------------------- |
| **Hash Map**       | O(1) lookup, caching, indexing         | Plugin system, form builder |
| **Trie**           | Prefix matching, routing, autocomplete | Plugin event routing        |
| **Queue**          | Sequential processing, buffering       | Music player, job queue     |
| **Tree**           | Hierarchical data, parsing             | AST parser, file systems    |
| **Graph**          | Dependencies, networks                 | GitHub Actions DAG          |
| **Priority Queue** | Scheduling, event systems              | Cooldown system             |
| **Linked List**    | Sequential access, undo/redo           | Music queue navigation      |

## 🛠️ Technologies

- **TypeScript**: Type-safe implementations with modern JavaScript
- **Python**: Clean, readable algorithm demonstrations
- **JavaScript**: Lightweight DSA examples

## 📈 Learning Path

1. **Start Simple**: Review basic DSA implementations in `typescript/src/dsa/` and `python/`
2. **See Applications**: Explore how each concept is applied in real projects
3. **Compare Approaches**: Check multiple implementations (plugin system has 3 versions)
4. **Build Variants**: Fork and create your own variations

## 🎓 Key Learnings

### When to Use Hash Maps

- **Plugin System**: Fast O(1) event handler lookup instead of O(n) array iteration
- **Trade-off**: Memory for speed - store handlers indexed by event name

### When to Use Tries

- **Plugin System**: Hierarchical event routing (`user.onStart`, `admin.settings.save`)
- **Benefit**: Efficient prefix matching and namespace organization

### When to Use Queues

- **Music Player**: Natural fit for playlist management with FIFO ordering
- **GitHub Actions**: Job execution queue respecting dependencies

### When to Use Trees

- **AST Parser**: Code is naturally hierarchical (expressions, statements, blocks)
- **Form Builder**: Nested form sections and field groups

### When to Use Graphs

- **GitHub Actions**: Jobs have dependencies forming a DAG
- **Requirement**: Topological sort to determine execution order

## 🚧 Continuous Development

This repository is a living document of my DSA learning journey. New implementations and optimizations are added regularly.

### Upcoming Projects

- [ ] **LRU Cache**: Browser cache simulation
- [ ] **Rate Limiter**: API throttling system
- [ ] **Autocomplete**: Search suggestion engine
- [ ] **Undo/Redo System**: Editor history management
- [ ] **Pathfinding**: Game navigation (A\*, Dijkstra)
- [ ] **Diff Algorithm**: Git-style file comparison

## 💡 Why This Approach?

**Traditional Learning:**

```python
# Implement a queue
class Queue:
    def enqueue(item): pass
    def dequeue(): pass
```

**Real-World Learning:**

```typescript
// Use a queue to build a music player
class MusicPlayer {
  queue: SongQueue;
  play(songId: string) {
    /* manages queue state */
  }
  next() {
    /* queue.dequeue() */
  }
}
```

The second approach:

- ✅ Shows **WHY** the data structure exists
- ✅ Reveals **WHEN** to apply it
- ✅ Demonstrates **HOW** it solves real problems
- ✅ Provides **CONTEXT** for interviews and design discussions

## 🤝 Contributing

This is a personal learning repository, but suggestions and feedback are welcome! Feel free to:

- Open issues with implementation improvements
- Suggest new real-world applications
- Share alternative approaches

## 📚 Resources

- [Introduction to Algorithms (CLRS)](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)
- [Grokking Algorithms](https://www.manning.com/books/grokking-algorithms)
- [LeetCode](https://leetcode.com/) - Problem practice
- [NeetCode](https://neetcode.io/) - Problem patterns

## 📝 License

MIT License - Feel free to learn from and adapt these implementations.

---

**Remember**: Data structures aren't just academic exercises—they're the building blocks of every application you use daily. This repository helps you see them in action! 🚀
