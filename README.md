# System Design Algorithm

A growing collection of system design concepts implemented in C++, built while studying for software engineering interviews. Each algorithm gets its own section below, along with the theory behind it, the problem it solves, and a working implementation.

## Contents

- [Consistent Hashing](#consistent-hashing)
- More to come as prep continues (load balancing strategies, rate limiters, caching policies, etc.)

---

## Consistent Hashing

### Problem

When distributing requests across multiple servers, a naive approach uses `hash(request) % N`, where `N` is the number of servers. This works fine for a fixed `N`, but breaks down badly the moment a server is added or removed — changing `N` changes the result of nearly every `% N` calculation, causing almost all requests to remap to a different server.

In real systems, this mapping is often used to maintain per-server caches (e.g. a user's session or profile data lives on whichever server handles their requests). When the mapping shifts en masse, those caches become useless overnight, and every server has to rebuild from scratch via slow database lookups — exactly when the system is under the most load.

### Solution

Consistent hashing places both servers and requests as points on a conceptual ring (hash space `0` to `M-1`, wrapping around). A request is handled by the first server encountered walking **clockwise** from its position.

This means adding or removing a server only affects the load of its **immediate neighbor** on the ring — every other server's region, and its cache, stays untouched. In theory, only about `1/N` of requests get remapped, instead of nearly all of them.

### Implementation details

- **Data structure:** `std::map<size_t, string>` (`ring`) — keeps server positions sorted automatically (Red-Black tree internally), giving `O(log N)` insert, erase, and lookup.
- **Routing:** Uses `lower_bound()` to find the first server position ≥ a request's hashed position. If none exists (`end()`), wraps around to `ring.begin()` — the server with the smallest position, completing the ring.
- **Collision handling:** If a server's hashed position is already occupied, the server ID is salted (`serverName-0`, `serverName-1`, ...) and rehashed until a free position is found, avoiding silent overwrites of an existing server.
- **Position tracking:** A second map, `location` (`string → vector<size_t>`), tracks which ring position(s) belong to each server, so `removeServer` can reliably clean up the correct entries without scanning the whole ring.

### Files

| File | Description |
|---|---|
| `/consistent_hashing.cpp` | Core implementation: `getPosition`, `addServer`, `removeServer`, `routeRequest` |

### Example

```cpp
addServer("ServerA");
addServer("ServerB");
addServer("ServerC");

routeRequest("user1");
removeServer("ServerB");
routeRequest("user1"); // -> unaffected if user1 wasn't in ServerB's range
```

### Status

- [x] Basic ring with `lower_bound` routing
- [x] Wraparound handling
- [x] Collision handling on server add
- [x] Position tracking for clean removal
- [ ] True virtual nodes (K positions per server, for more even load distribution)
