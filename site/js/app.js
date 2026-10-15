// ====== STATE ======
let st=JSON.parse(localStorage.getItem('dsprep_v4')||'{}');
if(!st.road)st.road={};if(!st.cal)st.cal={};if(!st.mcq)st.mcq={};if(!st.prob)st.prob={};
function sv(){localStorage.setItem('dsprep_v4',JSON.stringify(st))}

// ====== ROADMAP DATA ======
const ROADMAP=[
  typeof CPP_CONTENT!=='undefined'?CPP_CONTENT:null,
  // Old DSA category hidden - superseded by DSA Patterns below. The content still
  // lives in js/content-cpp-dsa.js; uncomment this line to bring the tab back.
  // typeof DSA_CONTENT!=='undefined'?DSA_CONTENT:null,
  typeof DSA_PATTERNS_CONTENT!=='undefined'?DSA_PATTERNS_CONTENT:null,
  typeof SYSDES_CONTENT!=='undefined'?SYSDES_CONTENT:null,
  typeof OS_CONTENT!=='undefined'?OS_CONTENT:null,
  typeof CN_CONTENT!=='undefined'?CN_CONTENT:null,
  typeof DBMS_CONTENT!=='undefined'?DBMS_CONTENT:null,
  typeof MERN_CONTENT!=='undefined'?MERN_CONTENT:null,
  typeof GENAI_CONTENT!=='undefined'?GENAI_CONTENT:null,
  typeof APTITUDE_CONTENT!=='undefined'?APTITUDE_CONTENT:null,
].filter(Boolean);

// ====== CALENDAR ======
const SP=[
{date:"2026-06-15",theme:"C++ Basics",tasks:[
{t:'Variables, Data Types & I/O',c:'C++',road:'cpp:basics:0'},
{t:'Operators & Type Casting',c:'C++',road:'cpp:basics:1'},
{t:'Control Flow (if/else, loops, switch)',c:'C++',road:'cpp:basics:2'},
{t:'Functions & Recursion Basics',c:'C++',road:'cpp:basics:3'},
{t:'Pointers & References',c:'C++',road:'cpp:basics:4'},
{t:'Preprocessor, Compilation & Memory Model',c:'C++',road:'cpp:basics:5'}
]},
{date:"2026-06-16",theme:"C++ STL",tasks:[
{t:'Vectors & Dynamic Arrays',c:'C++',road:'cpp:stl:0'},
{t:'Maps, Sets & Unordered Containers',c:'C++',road:'cpp:stl:1'},
{t:'Strings & String Operations',c:'C++',road:'cpp:stl:2'},
{t:'STL Algorithms & Iterators',c:'C++',road:'cpp:stl:3'},
{t:'Pairs, Tuples & Priority Queue',c:'C++',road:'cpp:stl:4'}
]},
{date:"2026-06-17",theme:"C++ OOP",tasks:[
{t:'Classes, Objects & Constructors',c:'C++',road:'cpp:oop:0'},
{t:'Inheritance & Polymorphism',c:'C++',road:'cpp:oop:1'},
{t:'Templates & Generic Programming',c:'C++',road:'cpp:oop:2'},
{t:'Operator Overloading',c:'C++',road:'cpp:oop:3'},
{t:'Exception Handling & RAII',c:'C++',road:'cpp:oop:4'},
{t:'Const Correctness, Design Patterns & Polymorphism Deep Dive',c:'C++',road:'cpp:oop:5'}
]},
{date:"2026-06-18",theme:"DSA Patterns - Two Pointers",tasks:[
{t:'P1 \u00b7 Converging Pointers',c:'DSA',road:'dsapat:tp:0'},
{t:'P2 \u00b7 Fast & Slow Pointers',c:'DSA',road:'dsapat:tp:1'},
{t:'P3 \u00b7 Fixed Separation (gap pointers)',c:'DSA',road:'dsapat:tp:2'},
{t:'P4 \u00b7 In-place Array Modification',c:'DSA',road:'dsapat:tp:3'},
{t:'P5 \u00b7 String Compare with Special Characters',c:'DSA',road:'dsapat:tp:4'},
{t:'P6 \u00b7 Expanding From Center',c:'DSA',road:'dsapat:tp:5'},
{t:'P7 \u00b7 String Reversal',c:'DSA',road:'dsapat:tp:6'}
]},
{date:"2026-06-19",theme:"Sliding Window & Trees I",tasks:[
{t:'P8 \u00b7 Fixed Size Window',c:'DSA',road:'dsapat:sw:0'},
{t:'P9 \u00b7 Variable Size Window',c:'DSA',road:'dsapat:sw:1'},
{t:'P10 \u00b7 Monotonic Deque for Window Max/Min',c:'DSA',road:'dsapat:sw:2'},
{t:'P11 \u00b7 Character Frequency Matching',c:'DSA',road:'dsapat:sw:3'},
{t:'P12 \u00b7 Level Order Traversal (BFS)',c:'DSA',road:'dsapat:tree:0'},
{t:'P13 \u00b7 Recursive Preorder (top-down)',c:'DSA',road:'dsapat:tree:1'},
{t:'P14 \u00b7 Recursive Inorder (BST order)',c:'DSA',road:'dsapat:tree:2'}
]},
{date:"2026-06-20",theme:"Trees II & Graphs I",tasks:[
{t:'P15 \u00b7 Recursive Postorder (bottom-up)',c:'DSA',road:'dsapat:tree:3'},
{t:'P16 \u00b7 Lowest Common Ancestor',c:'DSA',road:'dsapat:tree:4'},
{t:'P17 \u00b7 Serialization & Subtree Identity',c:'DSA',road:'dsapat:tree:5'},
{t:'P18 \u00b7 DFS \u2014 Connected Components / Islands',c:'DSA',road:'dsapat:graph:0'},
{t:'P19 \u00b7 BFS \u2014 Shortest Path on Grids',c:'DSA',road:'dsapat:graph:1'},
{t:'P20 \u00b7 DFS \u2014 Cycle Detection (directed)',c:'DSA',road:'dsapat:graph:2'},
{t:'P21 \u00b7 BFS Topological Sort (Kahn\u2019s Algorithm)',c:'DSA',road:'dsapat:graph:3'}
]},
{date:"2026-06-21",theme:"Graphs II - Traversal & Shortest Paths",tasks:[
{t:'P22 \u00b7 Deep Copy / Cloning a Graph',c:'DSA',road:'dsapat:graph:4'},
{t:'P23 \u00b7 Shortest Path (Dijkstra)',c:'DSA',road:'dsapat:graph:5'},
{t:'P24 \u00b7 Bellman-Ford & BFS with K Stops',c:'DSA',road:'dsapat:graph:6'},
{t:'P25 \u00b7 Union-Find (Disjoint Set Union)',c:'DSA',road:'dsapat:graph:7'},
{t:'P26 \u00b7 Strongly Connected Components',c:'DSA',road:'dsapat:graph:8'},
{t:'P27 \u00b7 Bridges & Articulation Points',c:'DSA',road:'dsapat:graph:9'},
{t:'P28 \u00b7 Minimum Spanning Tree (Kruskal / Prim)',c:'DSA',road:'dsapat:graph:10'}
]},
{date:"2026-06-22",theme:"Graphs III & DP I",tasks:[
{t:'P29 \u00b7 Bidirectional BFS',c:'DSA',road:'dsapat:graph:11'},
{t:'P30 \u00b7 Fibonacci Style (linear DP)',c:'DSA',road:'dsapat:dp:0'},
{t:'P31 \u00b7 Kadane \u2014 Max/Min Subarray',c:'DSA',road:'dsapat:dp:1'},
{t:'P32 \u00b7 Unbounded Knapsack (Coin Change)',c:'DSA',road:'dsapat:dp:2'},
{t:'P33 \u00b7 0/1 Knapsack & Subset Sum',c:'DSA',road:'dsapat:dp:3'},
{t:'P34 \u00b7 Word Break Style',c:'DSA',road:'dsapat:dp:4'},
{t:'P35 \u00b7 Longest Common Subsequence',c:'DSA',road:'dsapat:dp:5'}
]},
{date:"2026-06-23",theme:"DP II & Heaps I",tasks:[
{t:'P36 \u00b7 Edit Distance (Levenshtein)',c:'DSA',road:'dsapat:dp:6'},
{t:'P37 \u00b7 Grid DP (Unique Paths / Min Path Sum)',c:'DSA',road:'dsapat:dp:7'},
{t:'P38 \u00b7 Interval DP',c:'DSA',road:'dsapat:dp:8'},
{t:'P39 \u00b7 Catalan Numbers',c:'DSA',road:'dsapat:dp:9'},
{t:'P40 \u00b7 Longest Increasing Subsequence',c:'DSA',road:'dsapat:dp:10'},
{t:'P41 \u00b7 Stock Problems (state machine DP)',c:'DSA',road:'dsapat:dp:11'},
{t:'P42 \u00b7 Top K Elements',c:'DSA',road:'dsapat:heap:0'}
]},
{date:"2026-06-24",theme:"Heaps II & Backtracking I",tasks:[
{t:'P43 \u00b7 Two Heaps for Running Median',c:'DSA',road:'dsapat:heap:1'},
{t:'P44 \u00b7 K-Way Merge',c:'DSA',road:'dsapat:heap:2'},
{t:'P45 \u00b7 Heap for Scheduling & Minimum Cost',c:'DSA',road:'dsapat:heap:3'},
{t:'P46 \u00b7 Subsets (include / exclude)',c:'DSA',road:'dsapat:bt:0'},
{t:'P47 \u00b7 Permutations',c:'DSA',road:'dsapat:bt:1'},
{t:'P48 \u00b7 Combination Sum',c:'DSA',road:'dsapat:bt:2'},
{t:'P49 \u00b7 Parentheses Generation',c:'DSA',road:'dsapat:bt:3'}
]},
{date:"2026-06-25",theme:"Backtracking II & Greedy I",tasks:[
{t:'P50 \u00b7 Word Search / Grid Path Finding',c:'DSA',road:'dsapat:bt:4'},
{t:'P51 \u00b7 N-Queens / Constraint Satisfaction',c:'DSA',road:'dsapat:bt:5'},
{t:'P52 \u00b7 Palindrome Partitioning',c:'DSA',road:'dsapat:bt:6'},
{t:'P53 \u00b7 Interval Merging / Scheduling',c:'DSA',road:'dsapat:greedy:0'},
{t:'P54 \u00b7 Jump Game Reachability',c:'DSA',road:'dsapat:greedy:1'},
{t:'P55 \u00b7 Buy / Sell Stock (greedy view)',c:'DSA',road:'dsapat:greedy:2'},
{t:'P56 \u00b7 Gas Station Circuit',c:'DSA',road:'dsapat:greedy:3'}
]},
{date:"2026-06-26",theme:"Greedy II & Binary Search",tasks:[
{t:'P57 \u00b7 Task Scheduling',c:'DSA',road:'dsapat:greedy:4'},
{t:'P58 \u00b7 Sorting-Based Greedy',c:'DSA',road:'dsapat:greedy:5'},
{t:'P59 \u00b7 Binary Search on a Sorted Array',c:'DSA',road:'dsapat:bs:0'},
{t:'P60 \u00b7 Rotated Sorted Array',c:'DSA',road:'dsapat:bs:1'},
{t:'P61 \u00b7 Binary Search on the Answer',c:'DSA',road:'dsapat:bs:2'},
{t:'P62 \u00b7 First / Last Occurrence',c:'DSA',road:'dsapat:bs:3'},
{t:'P63 \u00b7 Median / Kth Across Two Sorted Arrays',c:'DSA',road:'dsapat:bs:4'}
]},
{date:"2026-06-27",theme:"Stack & Bit Manipulation I",tasks:[
{t:'P64 \u00b7 Valid Parentheses Matching',c:'DSA',road:'dsapat:stack:0'},
{t:'P65 \u00b7 Monotonic Stack',c:'DSA',road:'dsapat:stack:1'},
{t:'P66 \u00b7 Expression Evaluation',c:'DSA',road:'dsapat:stack:2'},
{t:'P67 \u00b7 Simulation with a Stack',c:'DSA',road:'dsapat:stack:3'},
{t:'P68 \u00b7 Min Stack & Stack Design',c:'DSA',road:'dsapat:stack:4'},
{t:'P69 \u00b7 Largest Rectangle in Histogram',c:'DSA',road:'dsapat:stack:5'},
{t:'P70 \u00b7 XOR \u2014 Finding the Single / Missing Number',c:'DSA',road:'dsapat:bits:0'}
]},
{date:"2026-06-28",theme:"Bits II & Linked Lists",tasks:[
{t:'P71 \u00b7 Counting Set Bits (Hamming Weight)',c:'DSA',road:'dsapat:bits:1'},
{t:'P72 \u00b7 Bitmask DP & Counting Bits',c:'DSA',road:'dsapat:bits:2'},
{t:'P73 \u00b7 Power of Two / Four Checks',c:'DSA',road:'dsapat:bits:3'},
{t:'P74 \u00b7 In-place Reversal',c:'DSA',road:'dsapat:ll:0'},
{t:'P75 \u00b7 Merging Sorted Lists',c:'DSA',road:'dsapat:ll:1'},
{t:'P76 \u00b7 Addition of Numbers',c:'DSA',road:'dsapat:ll:2'},
{t:'P77 \u00b7 Intersection Detection',c:'DSA',road:'dsapat:ll:3'},
{t:'P78 \u00b7 Reordering & Partitioning',c:'DSA',road:'dsapat:ll:4'}
]},
{date:"2026-06-29",theme:"Array & Matrix",tasks:[
{t:'P79 \u00b7 In-place Rotation',c:'DSA',road:'dsapat:mat:0'},
{t:'P80 \u00b7 Spiral Traversal',c:'DSA',road:'dsapat:mat:1'},
{t:'P81 \u00b7 In-place Marking',c:'DSA',road:'dsapat:mat:2'},
{t:'P82 \u00b7 Prefix / Suffix Products',c:'DSA',road:'dsapat:mat:3'},
{t:'P83 \u00b7 Plus One & Digit Arithmetic',c:'DSA',road:'dsapat:mat:4'},
{t:'P84 \u00b7 Filling In-place From the End',c:'DSA',road:'dsapat:mat:5'},
{t:'P85 \u00b7 Cyclic Sort',c:'DSA',road:'dsapat:mat:6'}
]},
{date:"2026-06-30",theme:"Strings, Design & DSA Review",tasks:[
{t:'P86 \u00b7 Palindrome Check',c:'DSA',road:'dsapat:str:0'},
{t:'P87 \u00b7 Anagram Check & Grouping',c:'DSA',road:'dsapat:str:1'},
{t:'P88 \u00b7 Roman Numerals',c:'DSA',road:'dsapat:str:2'},
{t:'P89 \u00b7 String to Integer & Parsing',c:'DSA',road:'dsapat:str:3'},
{t:'P90 \u00b7 Manual Simulation on Strings',c:'DSA',road:'dsapat:str:4'},
{t:'P91 \u00b7 String Matching (KMP & Rabin-Karp)',c:'DSA',road:'dsapat:str:5'},
{t:'P92 \u00b7 Repeated Substring Pattern',c:'DSA',road:'dsapat:str:6'},
{t:'P93 \u00b7 Designing Data Structures',c:'DSA',road:'dsapat:des:0'},
{t:'P94 \u00b7 Tries (Prefix Trees)',c:'DSA',road:'dsapat:des:1'},
{t:'Sprint: 5 Medium Problems (Mixed DSA)',c:'Practice'}
]},
{date:"2026-07-01",theme:"LLD - OOP & SOLID",tasks:[
{t:'OOP Concepts Deep Dive',c:'LLD',road:'sysdes:lld:0'},
{t:'Composition vs Inheritance',c:'LLD',road:'sysdes:lld:1'},
{t:'SRP & OCP',c:'LLD',road:'sysdes:lld:2'},
{t:'LSP, ISP & DIP',c:'LLD',road:'sysdes:lld:3'}
]},
{date:"2026-07-02",theme:"LLD - Design Patterns",tasks:[
{t:'Singleton & Factory Pattern',c:'LLD',road:'sysdes:patterns:0'},
{t:'Observer & Strategy Pattern',c:'LLD',road:'sysdes:patterns:1'},
{t:'Decorator & Adapter Pattern',c:'LLD',road:'sysdes:patterns:2'},
{t:'Builder & Command Pattern',c:'LLD',road:'sysdes:patterns:3'},
{t:'State, Proxy & Chain of Responsibility',c:'LLD',road:'sysdes:patterns:4'}
]},
{date:"2026-07-03",theme:"LLD - Case Study & App Design Round",tasks:[
{t:'Design Splitwise',c:'LLD',road:'sysdes:patterns:5'},
{t:'What this round actually is',c:'LLD',road:'sysdes:appdesign:0'},
{t:'The 45-minute method',c:'LLD',road:'sysdes:appdesign:1'},
{t:'Turning a vague prompt into a design',c:'LLD',road:'sysdes:appdesign:2'},
{t:'API design',c:'LLD',road:'sysdes:appdesign:3'}
]},
{date:"2026-07-03",theme:"App Design - Classes & Patterns",tasks:[
{t:'Class design in C++',c:'LLD',road:'sysdes:appdesign:4'},
{t:'The nine design principles',c:'LLD',road:'sysdes:appdesign:5'},
{t:'The patterns you will actually use',c:'LLD',road:'sysdes:appdesign:6'},
{t:'The rest of the pattern catalogue',c:'LLD',road:'sysdes:appdesign:7'},
{t:'Data modeling and schema design',c:'LLD',road:'sysdes:appdesign:8'}
]},
{date:"2026-07-03",theme:"App Design - Worked Problems",tasks:[
{t:'Problem 1: Library system',c:'LLD',road:'sysdes:appdesign:9'},
{t:'Problem 2: Parking lot',c:'LLD',road:'sysdes:appdesign:10'},
{t:'Problem 3: E-commerce cart and checkout',c:'LLD',road:'sysdes:appdesign:11'},
{t:'Problem bank',c:'LLD',road:'sysdes:appdesign:12'},
{t:'Common mistakes and a self-check',c:'LLD',road:'sysdes:appdesign:13'},
{t:'Cheat sheet',c:'LLD',road:'sysdes:appdesign:14'}
]},
{date:"2026-07-04",theme:"HLD - Fundamentals",tasks:[
{t:'Scalability Fundamentals',c:'HLD',road:'sysdes:hld:0'},
{t:'Caching & CDN Deep Dive',c:'HLD',road:'sysdes:hld:1'},
{t:'Load Balancing & Reverse Proxy',c:'HLD',road:'sysdes:hld:2'},
{t:'Back-of-the-Envelope Estimation',c:'HLD',road:'sysdes:hld:3'}
]},
{date:"2026-07-05",theme:"HLD - Advanced",tasks:[
{t:'Consistent Hashing',c:'HLD',road:'sysdes:hld:4'},
{t:'Data Models & Storage Engines',c:'HLD',road:'sysdes:hld:5'},
{t:'Replication & Partitioning',c:'HLD',road:'sysdes:hld:6'},
{t:'Transactions & Consistency',c:'HLD',road:'sysdes:hld:7'}
]},
{date:"2026-07-06",theme:"System Design Problems I",tasks:[
{t:'Rate Limiter',c:'HLD',road:'sysdes:designs:0'},
{t:'Key-Value Store',c:'HLD',road:'sysdes:designs:1'},
{t:'URL Shortener',c:'HLD',road:'sysdes:designs:2'},
{t:'Web Crawler',c:'HLD',road:'sysdes:designs:3'},
{t:'Notification System',c:'HLD',road:'sysdes:designs:4'}
]},
{date:"2026-07-07",theme:"System Design Problems II",tasks:[
{t:'News Feed',c:'HLD',road:'sysdes:designs:5'},
{t:'Chat System',c:'HLD',road:'sysdes:designs:6'},
{t:'Search Autocomplete',c:'HLD',road:'sysdes:designs:7'},
{t:'Design Stock Trading / Order Matching Engine',c:'HLD',road:'sysdes:designs:8'},
{t:'Design Payment System',c:'HLD',road:'sysdes:designs:9'}
]},
{date:"2026-07-08",theme:"Design & DSA Review",tasks:[
{t:'Sprint: 5 Hard Problems (Mixed Topics)',c:'Practice'},
{t:'Review All DSA Pattern Templates',c:'Review'},
{t:'Review LLD Design Patterns',c:'Review'},
{t:'Mock: LLD Discussion (30 min)',c:'Practice'}
]},
{date:"2026-07-09",theme:"OS - Processes & Scheduling",tasks:[
{t:'Process States, PCB & Context Switch',c:'OS',road:'os:proc:0'},
{t:'Process Creation & IPC',c:'OS',road:'os:proc:1'},
{t:'FCFS & SJF Scheduling',c:'OS',road:'os:sched:0'},
{t:'Round Robin & Priority Scheduling',c:'OS',road:'os:sched:1'},
{t:'MLFQ & Comparison of Algorithms',c:'OS',road:'os:sched:2'}
]},
{date:"2026-07-10",theme:"OS - Threads & Sync",tasks:[
{t:'Threads & Multithreading Models',c:'OS',road:'os:threads:0'},
{t:'Concurrency Patterns & Thread Safety',c:'OS',road:'os:threads:1'},
{t:'Mutex, Semaphores & Monitors',c:'OS',road:'os:sync:0'},
{t:'Classical Synchronization Problems',c:'OS',road:'os:sync:1'},
{t:'Read-Write Locks, Condition Variables & Barriers',c:'OS',road:'os:sync:2'}
]},
{date:"2026-07-11",theme:"OS - Deadlock & Memory",tasks:[
{t:'Deadlock Conditions & Prevention',c:'OS',road:'os:dead:0'},
{t:'Banker\'s Algorithm & Deadlock Detection',c:'OS',road:'os:dead:1'},
{t:'Paging & Page Tables',c:'OS',road:'os:mem:0'},
{t:'Page Replacement Algorithms',c:'OS',road:'os:mem:1'},
{t:'Segmentation & Segmented Paging',c:'OS',road:'os:mem:2'}
]},
{date:"2026-07-12",theme:"OS - VM & File Systems",tasks:[
{t:'Virtual Memory & Demand Paging',c:'OS',road:'os:vm:0'},
{t:'Thrashing & Working Set Model',c:'OS',road:'os:vm:1'},
{t:'File Allocation Methods',c:'OS',road:'os:fs:0'},
{t:'inode, FAT & Directory Structures',c:'OS',road:'os:fs:1'},
{t:'Disk Scheduling',c:'OS',road:'os:fs:2'},
{t:'RAID Levels',c:'OS',road:'os:fs:3'}
]},
{date:"2026-07-13",theme:"DBMS - ER Model & SQL",tasks:[
{t:'ER Diagrams & Relational Model',c:'DBMS',road:'dbms:er:0'},
{t:'Keys & Constraints',c:'DBMS',road:'dbms:er:1'},
{t:'Relational Algebra',c:'DBMS',road:'dbms:er:2'},
{t:'SQL Basics (DDL, DML, SELECT, WHERE, GROUP BY)',c:'DBMS',road:'dbms:sql:0'},
{t:'Joins',c:'DBMS',road:'dbms:sql:1'}
]},
{date:"2026-07-14",theme:"DBMS - Advanced SQL & Normalization",tasks:[
{t:'Subqueries & Nested Queries',c:'DBMS',road:'dbms:sql:2'},
{t:'Window Functions',c:'DBMS',road:'dbms:sql:3'},
{t:'Views, Indexes & Stored Procedures',c:'DBMS',road:'dbms:sql:4'},
{t:'CTEs, Set Operations & CASE',c:'DBMS',road:'dbms:sql:5'},
{t:'Normalization (1NF, 2NF, 3NF, BCNF)',c:'DBMS',road:'dbms:norm:0'}
]},
{date:"2026-07-15",theme:"DBMS - Transactions & Indexing",tasks:[
{t:'Denormalization',c:'DBMS',road:'dbms:norm:1'},
{t:'ACID Properties & Isolation Levels',c:'DBMS',road:'dbms:txn:0'},
{t:'Concurrency Control (Lock-Based, 2PL, MVCC, Timestamp Ordering)',c:'DBMS',road:'dbms:conc:0'},
{t:'B-Tree, B+ Tree & Hash Indexing',c:'DBMS',road:'dbms:idx:0'}
]},
{date:"2026-07-16",theme:"DBMS - Query Opt, Recovery & NoSQL",tasks:[
{t:'Query Processing & Optimization',c:'DBMS',road:'dbms:qopt:0'},
{t:'Recovery & Write-Ahead Logging (ARIES)',c:'DBMS',road:'dbms:recov:0'},
{t:'CAP Theorem',c:'DBMS',road:'dbms:nosql:0'},
{t:'NoSQL Database Types',c:'DBMS',road:'dbms:nosql:1'},
{t:'Practice: 20 Complex SQL Queries',c:'Practice'}
]},
{date:"2026-07-17",theme:"CN - Models & Data Link",tasks:[
{t:'OSI & TCP/IP Models',c:'CN',road:'cn:models:0'},
{t:'Physical Layer — Transmission & Encoding',c:'CN',road:'cn:physical:0'},
{t:'Transmission Media, Topologies & Switching',c:'CN',road:'cn:physical:1'},
{t:'Session Layer — Session Management & RPCs',c:'CN',road:'cn:session:0'},
{t:'Presentation Layer — Encryption, Encoding & Compression',c:'CN',road:'cn:presentation:0'},
{t:'Error Detection & Flow Control',c:'CN',road:'cn:dl:0'},
{t:'MAC Protocols & Ethernet',c:'CN',road:'cn:dl:1'},
{t:'Sliding Window Protocols',c:'CN',road:'cn:dl:2'}
]},
{date:"2026-07-18",theme:"CN - Network & Transport",tasks:[
{t:'IPv4 Addressing & Subnetting',c:'CN',road:'cn:net:0'},
{t:'Routing Protocols',c:'CN',road:'cn:net:1'},
{t:'IPv6 & ICMP',c:'CN',road:'cn:net:2'},
{t:'TCP 3-Way Handshake & Flow Control',c:'CN',road:'cn:trans:0'},
{t:'TCP Congestion Control & UDP',c:'CN',road:'cn:trans:1'}
]},
{date:"2026-07-19",theme:"CN - Transport, App & Security",tasks:[
{t:'Socket Programming',c:'CN',road:'cn:trans:2'},
{t:'HTTP/HTTPS & DNS',c:'CN',road:'cn:app:0'},
{t:'DHCP, FTP, SMTP & WebSockets',c:'CN',road:'cn:app:1'},
{t:'Cookies, Sessions, CORS & Authentication',c:'CN',road:'cn:app:2'},
{t:'Cryptography Deep Dive — DH, RSA, AES & TLS',c:'CN',road:'cn:presentation:1'},
{t:'SSL/TLS, Encryption & Firewalls',c:'CN',road:'cn:sec:0'},
{t:'Common Attacks (DDoS, MITM, DNS Spoofing, XSS)',c:'CN',road:'cn:sec:1'}
]},
{date:"2026-07-20",theme:"CS Fundamentals Review",tasks:[
{t:'OS Rapid Review & 15 MCQs',c:'Review'},
{t:'DBMS Rapid Review & 15 MCQs',c:'Review'},
{t:'CN Rapid Review & 15 MCQs',c:'Review'},
{t:'Practice: 20 Complex SQL Queries',c:'Practice'}
]},
{date:"2026-07-21",theme:"MERN - HTML, CSS & JS",tasks:[
{t:'HTML5 Semantic Elements & Accessibility',c:'MERN',road:'mern:html:0'},
{t:'CSS Flexbox & Grid Layout',c:'MERN',road:'mern:html:1'},
{t:'JavaScript ES6+ Features',c:'MERN',road:'mern:js:0'},
{t:'Closures, Promises & Async/Await',c:'MERN',road:'mern:js:1'},
{t:'Event Loop, Prototypes & this keyword',c:'MERN',road:'mern:js:2'}
]},
{date:"2026-07-22",theme:"TypeScript & React",tasks:[
{t:'TypeScript Essentials',c:'MERN',road:'mern:js:3'},
{t:'Components, JSX & Props',c:'MERN',road:'mern:react:0'},
{t:'Hooks (useState, useEffect, useRef, useMemo)',c:'MERN',road:'mern:react:1'},
{t:'Context API & React Router',c:'MERN',road:'mern:react:2'},
{t:'Performance Optimization & Custom Hooks',c:'MERN',road:'mern:react:3'}
]},
{date:"2026-07-23",theme:"React Testing & Node.js",tasks:[
{t:'Testing (Jest, React Testing Library, Cypress)',c:'MERN',road:'mern:react:4'},
{t:'Node.js Event Loop & Express Basics',c:'MERN',road:'mern:node:0'},
{t:'REST API Design & Best Practices',c:'MERN',road:'mern:node:1'},
{t:'Authentication (JWT, OAuth 2.0)',c:'MERN',road:'mern:node:2'}
]},
{date:"2026-07-24",theme:"Advanced Backend & MongoDB",tasks:[
{t:'Error Handling & Validation',c:'MERN',road:'mern:node:3'},
{t:'File Uploads & Security (Rate Limiting, Helmet)',c:'MERN',road:'mern:node:4'},
{t:'CRUD Operations & Aggregation Pipeline',c:'MERN',road:'mern:mongo:0'},
{t:'Mongoose ODM & Schema Design',c:'MERN',road:'mern:mongo:1'}
]},
{date:"2026-07-25",theme:"DevOps",tasks:[
{t:'Git Workflow & Branching Strategies',c:'MERN',road:'mern:devops:0'},
{t:'Docker Containers & Images',c:'MERN',road:'mern:devops:1'},
{t:'CI/CD with GitHub Actions',c:'MERN',road:'mern:devops:2'},
{t:'Monitoring & Logging (ELK/Prometheus)',c:'MERN',road:'mern:devops:3'}
]},
{date:"2026-07-26",theme:"Cloud & Deployment",tasks:[
{t:'AWS Core Services (EC2, S3, Lambda)',c:'MERN',road:'mern:cloud:0'},
{t:'Serverless Architecture',c:'MERN',road:'mern:cloud:1'},
{t:'Nginx, Load Balancing & Reverse Proxy',c:'MERN',road:'mern:cloud:2'},
{t:'MERN Sprint: 15 MCQs',c:'Practice'}
]},
{date:"2026-07-27",theme:"DSA Sprint - Linear",tasks:[
{t:'Solve: 3 Array/String Medium',c:'Practice'},
{t:'Solve: 2 LL/Stack Medium',c:'Practice'},
{t:'Solve: 2 Tree Medium',c:'Practice'},
{t:'Timed: 3 Problems in 45 min',c:'Practice'}
]},
{date:"2026-07-28",theme:"DSA Sprint - Advanced",tasks:[
{t:'Solve: 3 Graph Medium Problems',c:'Practice'},
{t:'Solve: 3 DP Medium Problems',c:'Practice'},
{t:'Solve: 1 Hard Problem (any topic)',c:'Practice'}
]},
{date:"2026-07-29",theme:"Mock Interview Day 1",tasks:[
{t:'Mock: 2 Medium + 1 Hard DSA (90 min)',c:'Practice'},
{t:'Mock: CS Fundamentals Q&A (30 min)',c:'Review'},
{t:'Mock: LLD Discussion (30 min)',c:'Review'},
{t:'Analysis: Document mistakes',c:'Review'}
]},
{date:"2026-07-30",theme:"Weak Area Drill",tasks:[
{t:'Drill: 5 Problems from Weakest Topic',c:'Practice'},
{t:'Review: Weakest CS Subject',c:'Review'},
{t:'Practice: 20 Mixed MCQs',c:'Practice'}
]},
{date:"2026-07-31",theme:"Mock Interview Day 2",tasks:[
{t:'Mock: Full Technical Round (60 min)',c:'Practice'},
{t:'Mock: System Design Discussion',c:'Review'},
{t:'Speed: 5 Medium in 75 min',c:'Practice'}
]},
{date:"2026-08-01",theme:"ML Foundations & Supervised",tasks:[
{t:'Bias-Variance Tradeoff & Model Evaluation',c:'GenAI',road:'genai:mlf:0'},
{t:'Feature Engineering & Data Preprocessing',c:'GenAI',road:'genai:mlf:1'},
{t:'Linear & Logistic Regression',c:'GenAI',road:'genai:sup:0'},
{t:'Decision Trees, Random Forests & Gradient Boosting',c:'GenAI',road:'genai:sup:1'},
{t:'SVM, KNN & Naive Bayes',c:'GenAI',road:'genai:sup:2'}
]},
{date:"2026-08-02",theme:"Unsupervised & Deep Learning",tasks:[
{t:'Clustering (K-Means, DBSCAN, Hierarchical)',c:'GenAI',road:'genai:unsup:0'},
{t:'Dimensionality Reduction (PCA, t-SNE)',c:'GenAI',road:'genai:unsup:1'},
{t:'Neural Network Fundamentals (Perceptrons, Backpropagation)',c:'GenAI',road:'genai:dl:0'},
{t:'Optimization (SGD, Adam, Learning Rate Scheduling)',c:'GenAI',road:'genai:dl:1'}
]},
{date:"2026-08-03",theme:"CNN, RNN & NLP",tasks:[
{t:'Convolutional Neural Networks (Architecture, Pooling, Famous Models)',c:'GenAI',road:'genai:cnn2:0'},
{t:'RNNs, LSTMs & GRUs',c:'GenAI',road:'genai:seq:0'},
{t:'Text Preprocessing & Word Embeddings (TF-IDF, Word2Vec, GloVe)',c:'GenAI',road:'genai:nlp:0'},
{t:'Attention Mechanism',c:'GenAI',road:'genai:nlp:1'}
]},
{date:"2026-08-04",theme:"LLMs & RAG",tasks:[
{t:'Transformer Architecture (Self-Attention, Multi-Head Attention)',c:'GenAI',road:'genai:llm:0'},
{t:'BERT, GPT & Modern LLMs',c:'GenAI',road:'genai:llm:1'},
{t:'Fine-Tuning & Prompt Engineering',c:'GenAI',road:'genai:llm:2'},
{t:'Vector Databases & Embeddings',c:'GenAI',road:'genai:rag:0'},
{t:'Retrieval-Augmented Generation Pipeline',c:'GenAI',road:'genai:rag:1'},
{t:'LangChain & Orchestration Frameworks',c:'GenAI',road:'genai:rag:2'}
]},
{date:"2026-08-05",theme:"Aptitude & Reasoning",tasks:[
{t:'Probability Fundamentals',c:'Aptitude',road:'apt:prob:0'},
{t:'Combinatorics',c:'Aptitude',road:'apt:prob:1'},
{t:'Logical Reasoning & Number Theory',c:'Aptitude',road:'apt:quant:0'},
{t:'Time, Speed & Distance',c:'Aptitude',road:'apt:arith:0'},
{t:'Time & Work',c:'Aptitude',road:'apt:arith:1'},
{t:'Percentages, Profit & Loss',c:'Aptitude',road:'apt:arith:2'},
{t:'Data Interpretation',c:'Aptitude',road:'apt:logic:0'},
{t:'Puzzles & Logical Arrangements',c:'Aptitude',road:'apt:logic:1'}
]},
{date:"2026-08-06",theme:"Full Mock Simulation",tasks:[
{t:'Mock: Online Round (3 DSA + 25 MCQs, 90 min)',c:'Practice'},
{t:'Mock: Technical Interview (60 min)',c:'Practice'},
{t:'Analysis: Score & Categorize',c:'Review'}
]},
{date:"2026-08-07",theme:"Speed Coding Sprint",tasks:[
{t:'Speed: 10 Easy in 60 min',c:'Practice'},
{t:'Speed: 5 Medium in 75 min',c:'Practice'},
{t:'Review: All DSA Pattern Templates',c:'Review'}
]},
{date:"2026-08-08",theme:"CS & Design Review",tasks:[
{t:'OS Cheat Sheet + 15 MCQs',c:'Review'},
{t:'DBMS Cheat Sheet + 15 MCQs',c:'Review'},
{t:'CN Cheat Sheet + 15 MCQs',c:'Review'},
{t:'LLD: Review Design Patterns',c:'Review'}
]},
{date:"2026-08-09",theme:"Hard Problem Marathon",tasks:[
{t:'Solve: 2 Hard Array/String',c:'Practice'},
{t:'Solve: 2 Hard Graph/DP',c:'Practice'},
{t:'Solve: 1 Hard Tree Problem',c:'Practice'},
{t:'Review: Edge Cases & Common Bugs',c:'Review'}
]},
{date:"2026-08-10",theme:"Final Sprint & Confidence",tasks:[
{t:'Company Past Questions (GFG, Glassdoor)',c:'Practice'},
{t:'Solve: 5 Medium (one per topic)',c:'Practice'},
{t:'Review: All Cheat Sheets',c:'Review'},
{t:'Review: Top 10 DSA Patterns',c:'Review'}
]}
];
// ====== NAV ======
// The calendar is the landing view and owns the bare URL - no hash - so a link to
// the site opens straight onto it. The roadmap and notes each own a hash and push a
// history entry, so the browser Back button walks back through the app instead of
// leaving the site on the first press.
function switchView(v,fromHistory){
  document.querySelectorAll('#mainNav a').forEach(x=>x.classList.remove('on'));
  const a=document.querySelector(`#mainNav a[data-v="${v}"]`);if(a)a.classList.add('on');
  const view=document.getElementById('v-'+v);
  if(!view)return;
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('on'));
  view.classList.add('on');
  const ai=document.getElementById('aiNote');
  if(ai)ai.classList.toggle('hide',v!=='road'&&v!=='way');
  if(v==='road')renderRoad();
  if(v==='way'&&typeof renderWay==='function')renderWay();
  if(v==='study'&&typeof studyAiView==='function')studyAiView();
  if(v==='cal'){renderPlanBar();renderCal();renderDP();renderDash()}
  // Notes manages its own deeper hashes; on a history restore it reads them itself.
  if(v==='notes'&&!fromHistory)notesGoList();
  else if(v!=='notes'&&!fromHistory){
    // The calendar drops the hash entirely rather than carrying a '#cal'.
    const h=v==='cal'?'':'#'+v;
    if((location.hash||'')!==h){try{history.pushState(null,'',h||location.pathname+location.search)}catch(e){}}
  }
  updTop();
}
function viewFromHash(){
  const h=location.hash||'';
  if(/^#notes/.test(h))return'notes';
  if(h==='#road')return'road';
  if(h==='#way')return'way';
  if(h==='#study')return'study';
  // No hash means the calendar; '#cal' stays understood so old links still land right.
  if(h===''||h==='#'||h==='#cal')return'cal';
  return null;
}
window.addEventListener('popstate',()=>{
  const v=viewFromHash();
  if(v==='notes'){switchView('notes',true);if(!notesRestoreFromHash())notesGoList(false)}
  else switchView(v||'cal',true);
});
document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>switchView(a.dataset.v)));

// ====== ROADMAP ======
let roadCat=st.navCat||0,roadTab=st.navTab||0,openTopic=st.navTopic!=null?st.navTopic:-1,innerTab=st.navInner||'learn';

function catProg(cat){let d=0,t=0;cat.tabs.forEach(tab=>{tab.topics.forEach((_,ti)=>{t++;if(st.road[cat.id+':'+tab.id+':'+ti])d++})});return{d,t,p:t?Math.round(d/t*100):0}}
function tabProg(cat,tab){let d=0;tab.topics.forEach((_,ti)=>{if(st.road[cat.id+':'+tab.id+':'+ti])d++});return{d,t:tab.topics.length,p:tab.topics.length?Math.round(d/tab.topics.length*100):0}}
function totalProg(){let d=0,t=0;ROADMAP.forEach(c=>c.tabs.forEach(tb=>tb.topics.forEach((_,ti)=>{t++;if(st.road[c.id+':'+tb.id+':'+ti])d++})));return{d,t,p:t?Math.round(d/t*100):0}}

function renderRoadSide(){
  if(!ROADMAP.length){document.getElementById('roadSide').innerHTML='<div class="empty-msg" style="font-size:14px;padding:20px">Loading...</div>';return}
  document.getElementById('roadSide').innerHTML=ROADMAP.map((cat,ci)=>{
    const p=catProg(cat),fc=p.p===100?'complete':p.p>0?'partial':'';
    return`<div class="road-cat ${ci===roadCat?'on':''}" onclick="selCat(${ci})"><div class="rc-t">${cat.t}</div><div class="rc-bar"><div class="fill ${fc}" style="width:${p.p}%"></div></div><div class="rc-pct">${p.d}/${p.t} &middot; ${p.p}%</div></div>`;
  }).join('');
}

function renderRoadTabs(){
  if(!ROADMAP.length)return;
  // st.navCat/navTab are saved indices - a category or tab removed since the last
  // visit would leave them pointing past the end, so clamp before indexing.
  if(roadCat>=ROADMAP.length)roadCat=0;
  if(roadTab>=ROADMAP[roadCat].tabs.length)roadTab=0;
  const cat=ROADMAP[roadCat],cp=catProg(cat);
  document.getElementById('roadHead').innerHTML=`<h2>${cat.t}</h2><div class="rh-sub">${cp.d}/${cp.t} topics &middot; ${cp.p}%</div>`;
  document.getElementById('roadTabs').innerHTML=cat.tabs.map((tab,ti)=>{
    const p=tabProg(cat,tab);
    return`<button class="road-tab ${ti===roadTab?'on':''}" onclick="selTab(${ti})">${tab.t} <span style="color:#444;font-size:12px">${p.d}/${p.t}</span></button>`;
  }).join('');
  renderRoadTopics();
}

function renderRoadTopics(){
  if(!ROADMAP.length){document.getElementById('roadTopics').innerHTML='<div class="empty-msg">Content loading...</div>';return}
  const cat=ROADMAP[roadCat],tab=cat.tabs[roadTab],p=tabProg(cat,tab);
  const fc=p.p===100?'complete':p.p>0?'partial':'';
  let h=`<div class="tab-prog"><div class="bar"><div class="fill ${fc}" style="width:${p.p}%"></div></div><span>${p.d}/${p.t} completed</span></div>`;
  h+=tab.topics.map((topic,ti)=>{
    const key=cat.id+':'+tab.id+':'+ti;
    const done=!!st.road[key];
    const isOpen=openTopic===ti;
    const tp=typeof topic==='object'?topic:{t:topic};
    const split=splitSpotlight(tp.learn);
    const mcqCount=(tp.mcqs?tp.mcqs.length:0)+split.qCount;
    let card=`<div class="topic-card"><div class="topic-hdr" onclick="toggleOpen(${ti})"><input type="checkbox" ${done?'checked':''} onclick="event.stopPropagation()" onchange="tgDone('${key}')"/><span class="th-name ${done?'done':''}">${tp.t}</span>`;
    if(mcqCount)card+=`<span class="th-badge">Practice &middot; ${mcqCount}</span>`;
    if(tp.problems&&tp.problems.length)card+=`<span class="th-badge">Leetcode &middot; ${tp.problems.length}</span>`;
    if(tp.code)card+=`<span class="th-badge">Code</span>`;
    card+=`<span class="th-arrow ${isOpen?'open':''}">&#9654;</span></div>`;
    if(isOpen){
      const hasCode=!!tp.code;
      const hasProb=tp.problems&&tp.problems.length;
      const hasMcq=tp.mcqs&&tp.mcqs.length;
      const hasSpotlight=!!split.spotlight;
      const hasPractice=hasMcq||hasSpotlight;
      card+=`<div class="topic-body open">`;
      card+=`<div class="inner-tabs">`;
      card+=`<button class="inner-tab ${innerTab==='learn'?'on':''}" onclick="swInner('learn')">Learn</button>`;
      if(hasCode)card+=`<button class="inner-tab ${innerTab==='code'?'on':''}" onclick="swInner('code')">Code</button>`;
      if(hasProb)card+=`<button class="inner-tab ${innerTab==='problems'?'on':''}" onclick="swInner('problems')">Leetcode (${tp.problems.length})</button>`;
      if(hasPractice)card+=`<button class="inner-tab ${innerTab==='mcq'?'on':''}" onclick="swInner('mcq')">Practice Problems (${mcqCount})</button>`;
      card+=`</div>`;
      // Learn pane
      card+=`<div class="inner-pane ${innerTab==='learn'?'on':''}">`;
      if(split.learn)card+=`<div class="tc-section"><div class="tc-text">${split.learn}</div></div>`;
      if(tp.ref)card+=`<div class="tc-section"><div class="tc-label">Reference</div><div class="tc-text">${tp.ref}</div></div>`;
      card+=`</div>`;
      // Code pane
      if(hasCode){
        card+=`<div class="inner-pane ${innerTab==='code'?'on':''}">`;
        card+=`<div class="tc-section"><div class="tc-code">${hlCode(tp.code)}</div></div>`;
        card+=`</div>`;
      }
      // Leetcode pane
      if(hasProb){
        const solvedCount=tp.problems.filter((_,pi)=>st.prob[key+':'+pi]).length;
        card+=`<div class="inner-pane ${innerTab==='problems'?'on':''}">`;
        card+=`<div class="prob-prog">${solvedCount}/${tp.problems.length} solved</div>`;
        card+=`<ul class="tc-problems">`;
        tp.problems.forEach((pr,pi)=>{const[name,url,diff]=pr;const pkey=key+':'+pi;const solved=!!st.prob[pkey];card+=`<li class="${solved?'solved':''}"><input type="checkbox" ${solved?'checked':''} onchange="tgProb('${pkey}')"/><a href="${url}" target="_blank">${name}</a><span class="diff diff-${diff}">${diff}</span></li>`});
        card+=`</ul></div>`;
      }
      // Practice Problems pane (Interview Spotlight + MCQs)
      if(hasPractice){
        card+=`<div class="inner-pane ${innerTab==='mcq'?'on':''}">`;
        if(hasSpotlight)card+=`<div class="tc-section"><div class="tc-text spotlight-qa">${split.spotlight}</div></div>`;
        if(hasMcq){
          card+=`<div class="tc-section"><div class="tc-text spotlight-qa">`;
          tp.mcqs.forEach((m,mi)=>{
            const mkey=key+':'+mi;const picked=st.mcq[mkey];
            const qn=split.qCount+mi+1;
            card+=`<div class="mcq-item"><p class="learn-p"><b>Q${qn}: ${m.q}</b></p><div class="mcq-opts">`;
            m.o.forEach((opt,oi)=>{
              let cls='mcq-opt';
              if(picked!==undefined){cls+=' picked';if(oi===m.a)cls+=' correct';else if(oi===picked)cls+=' wrong'}
              card+=`<div class="${cls}" onclick="pickMCQ('${mkey}',${oi},${m.a})"><span class="mcq-radio"></span>${opt}</div>`;
            });
            card+=`</div></div>`;
          });
          card+=`</div></div>`;
        }
        card+=`</div>`;
      }
      card+=`</div>`;
    }
    card+=`</div>`;return card;
  }).join('');
  const host=document.getElementById('roadTopics');
  host.innerHTML=h;
  document.querySelectorAll('.learn-code:not(.hl)').forEach(el=>{el.classList.add('hl');el.innerHTML=hlCode(el.textContent)});
}

function splitSpotlight(html){
  if(!html)return{learn:'',spotlight:'',qCount:0};
  const marker='<div class="learn-section"><div class="learn-h">Interview Spotlight</div>';
  const idx=html.indexOf(marker);
  if(idx<0)return{learn:html,spotlight:'',qCount:0};
  const raw=html.substring(idx);
  const qCount=(raw.match(/<b>Q\d*[:.]/g)||[]).length;
  const spotlight=raw.replace('<div class="learn-h">Interview Spotlight</div>','');
  return{learn:html.substring(0,idx),spotlight,qCount};
}

function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function hlCode(raw){
  const e=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const tokens=[];let i=0;
  while(i<raw.length){
    if(raw[i]==='/'&&raw[i+1]==='/'){let j=i;while(j<raw.length&&raw[j]!=='\n')j++;tokens.push({t:'com',v:raw.slice(i,j)});i=j;continue}
    if(raw[i]==='/'&&raw[i+1]==='*'){let j=raw.indexOf('*/',i+2);if(j<0)j=raw.length-2;j+=2;tokens.push({t:'com',v:raw.slice(i,j)});i=j;continue}
    if(raw[i]==='"'||raw[i]==="'"){const q=raw[i];let j=i+1;while(j<raw.length&&raw[j]!==q){if(raw[j]==='\\')j++;j++}j++;tokens.push({t:'str',v:raw.slice(i,j)});i=j;continue}
    if(raw[i]==='#'){let j=i;while(j<raw.length&&raw[j]!=='\n'){if(raw[j]==='\\'&&raw[j+1]==='\n')j+=2;else j++}tokens.push({t:'pre',v:raw.slice(i,j)});i=j;continue}
    if(/[0-9]/.test(raw[i])&&(i===0||/[\s,=+\-*/%(<>!&|^~?:;\[]/.test(raw[i-1]))){let j=i;while(j<raw.length&&/[0-9a-fA-FxXbBlLuU.]/.test(raw[j]))j++;tokens.push({t:'num',v:raw.slice(i,j)});i=j;continue}
    if(/[a-zA-Z_]/.test(raw[i])){let j=i;while(j<raw.length&&/[a-zA-Z0-9_]/.test(raw[j]))j++;tokens.push({t:'id',v:raw.slice(i,j)});i=j;continue}
    tokens.push({t:'p',v:raw[i]});i++;
  }
  const kw=new Set(['int','float','double','char','bool','void','long','short','unsigned','signed','auto','const','static','extern','inline','virtual','override','explicit','volatile','mutable','constexpr','class','struct','enum','union','namespace','template','typename','typedef','using','public','private','protected','friend','operator','new','delete','this','return','if','else','for','while','do','switch','case','default','break','continue','goto','try','catch','throw','true','false','nullptr','NULL','sizeof','static_cast','dynamic_cast','const_cast','reinterpret_cast','noexcept','final','abstract','var','let','const','function','async','await','import','export','from','def','lambda','yield','pass','raise','except','finally','with','as','in','not','and','or','is','None','True','False','self','cls','print']);
  const ty=new Set(['string','vector','map','unordered_map','set','unordered_set','pair','tuple','queue','deque','stack','priority_queue','list','array','bitset','shared_ptr','unique_ptr','weak_ptr','optional','variant','any','size_t','int8_t','int16_t','int32_t','int64_t','uint8_t','uint16_t','uint32_t','uint64_t','Node','TreeNode','ListNode','Graph','String','Array','Object','Promise','Map','Set','Number','Boolean','Symbol','BigInt','Date','RegExp','Error','Function','dict','List','Tuple','Dict','Optional','Union','Any','DataFrame','Series','ndarray','Tensor']);
  const flow=new Set(['return','if','else','for','while','do','switch','case','default','break','continue','goto','try','catch','throw','async','await','yield','except','finally','raise','pass']);
  const bi=new Set(['cout','cin','endl','printf','scanf','puts','getline','push_back','pop_back','emplace_back','insert','erase','find','begin','end','size','empty','front','back','top','push','pop','sort','reverse','min','max','swap','abs','make_pair','make_tuple','stoi','stol','stof','stod','to_string','substr','length','resize','reserve','clear','count','lower_bound','upper_bound','next','prev','distance','accumulate','transform','fill','memset','main','console','log','require','module','exports','fetch','setTimeout','setInterval','addEventListener','querySelector','getElementById','createElement','appendChild','innerHTML','textContent','forEach','map','filter','reduce','slice','splice','concat','join','split','trim','replace','match','includes','indexOf','keys','values','entries','assign','freeze','stringify','parse','then','resolve','reject','len','range','enumerate','zip','sorted','reversed','append','extend','remove','items','get','update','format','join','strip','split','isinstance','type','super','hasattr','getattr','setattr']);
  let h='';
  for(const tk of tokens){
    const v=e(tk.v);
    if(tk.t==='com')h+=`<span class="hl-com">${v}</span>`;
    else if(tk.t==='str')h+=`<span class="hl-str">${v}</span>`;
    else if(tk.t==='pre')h+=`<span class="hl-pre">${v}</span>`;
    else if(tk.t==='num')h+=`<span class="hl-num">${v}</span>`;
    else if(tk.t==='id'){
      if(flow.has(tk.v))h+=`<span class="hl-flow">${v}</span>`;
      else if(kw.has(tk.v))h+=`<span class="hl-kw">${v}</span>`;
      else if(ty.has(tk.v))h+=`<span class="hl-ty">${v}</span>`;
      else if(bi.has(tk.v))h+=`<span class="hl-fn">${v}</span>`;
      else h+=`<span class="hl-id">${v}</span>`;
    }else h+=v;
  }
  return h;
}
function selCat(ci){roadCat=ci;roadTab=0;openTopic=-1;st.navCat=ci;st.navTab=0;st.navTopic=-1;sv();renderRoadSide();renderRoadTabs()}
function selTab(ti){roadTab=ti;openTopic=-1;st.navTab=ti;st.navTopic=-1;sv();renderRoadTabs()}
function toggleOpen(ti){openTopic=openTopic===ti?-1:ti;innerTab='learn';st.navTopic=openTopic;st.navInner='learn';sv();renderRoadTopics();if(openTopic>=0){setTimeout(()=>{const el=document.querySelector('.topic-body.open');if(el)el.scrollIntoView({behavior:'smooth',block:'nearest'})},50)}}
function swInner(tab){innerTab=tab;st.navInner=tab;sv();renderRoadTopics()}
function tgDone(key){
  st.road[key]=!st.road[key];if(!st.road[key])delete st.road[key];
  sv();renderRoadSide();renderRoadTabs();updTop();
  // The calendar reads st.road for scheduled topics, so keep it in step.
  if(document.getElementById('v-cal').classList.contains('on')){renderPlanBar();renderCal();renderDP();renderDash()}
}
function pickMCQ(mkey,picked,correct){st.mcq[mkey]=picked;sv();renderRoadTopics()}
function tgProb(pkey){st.prob[pkey]=!st.prob[pkey];if(!st.prob[pkey])delete st.prob[pkey];sv();renderRoadTopics()}
function renderRoad(){renderRoadSide();renderRoadTabs()}

function goToRoad(roadKey){
  const parts=roadKey.split(':');if(parts.length<3)return;
  const[catId,tabId,topicIdx]=parts;
  const ci=ROADMAP.findIndex(c=>c.id===catId);if(ci<0)return;
  roadCat=ci;
  const ti=ROADMAP[ci].tabs.findIndex(t=>t.id===tabId);if(ti<0)return;
  roadTab=ti;openTopic=parseInt(topicIdx);innerTab='learn';
  switchView('road');
}

// ====== CALENDAR ======
// SP above is the curriculum: an ordered 57-day syllabus. Those dates are never
// shown. The dates the user sees come from re-pacing that same ordered task list
// across whatever range they pick, so every plan covers all of it.

const PLANS=[
  {id:'1m',months:1,name:'Sprint',rest:[0],reviewEvery:0,
   blurb:'Everything, fast. Six days a week, heavy days, no slack. For a deadline you cannot move.'},
  {id:'2m',months:2,name:'Focused',rest:[0],reviewEvery:0,
   blurb:'The intended pace. Six days a week, one topic block per day. The default.'},
  {id:'4m',months:4,name:'Steady',rest:[0,6],reviewEvery:6,
   blurb:'Weekdays only, lighter days, a review day roughly every two weeks. Fits alongside a job.'},
  {id:'6m',months:6,name:'Thorough',rest:[0,6],reviewEvery:5,
   blurb:'Weekdays only, the lightest load, frequent review days. Most room to go deep.'},
];

// One flat, ordered list of everything to be done, with a stable key per task so
// ticking something off survives switching to a different plan later.
const CURRICULUM=(function(){
  const out=[];
  SP.forEach(dy=>dy.tasks.forEach(t=>{
    out.push({t:t.t,c:t.c,road:t.road||null,theme:dy.theme,key:t.road?null:'sp:'+out.length});
  }));
  return out;
})();

function ds(y,m,d){return`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
function dsOf(d){return ds(d.getFullYear(),d.getMonth(),d.getDate())}
function parseDs(s){return new Date(s+'T12:00:00')}
function todayDs(){return dsOf(new Date())}
function addMonths(s,n){
  const d=parseDs(s),day=d.getDate();
  d.setMonth(d.getMonth()+n);
  if(d.getDate()<day)d.setDate(0);   // 31 Jan + 1 month -> 28/29 Feb, not 3 Mar
  d.setDate(d.getDate()-1);          // an N-month plan ends the day before the anniversary
  return dsOf(d);
}
function fmtDs(s){return parseDs(s).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}

// Every date in range that the plan actually studies on.
function studyDates(plan,start,end){
  const out=[],d=parseDs(start),e=parseDs(end);
  let guard=0;
  while(d<=e&&guard++<4000){
    if(plan.rest.indexOf(d.getDay())<0)out.push(dsOf(d));
    d.setDate(d.getDate()+1);
  }
  return out;
}

// Split the curriculum into n consecutive chunks of roughly equal size, nudging
// each break towards a topic-boundary so a day does not start mid-subject.
function packInto(units,n){
  const groups=[];let idx=0;
  for(let d=0;d<n;d++){
    const daysLeft=n-d,left=units.length-idx;
    if(left<=0){groups.push([]);continue}
    const cap=left-(daysLeft-1);                       // keep >=1 for each later day
    let take=Math.max(1,Math.min(Math.round(left/daysLeft),cap));
    const slack=Math.max(1,Math.floor(take*0.45));
    for(let sft=1;sft<=slack;sft++){
      const back=take-sft,fwd=take+sft;
      if(back>=1&&idx+back<units.length&&units[idx+back].theme!==units[idx+back-1].theme){take=back;break}
      if(fwd<=cap&&idx+fwd<units.length&&units[idx+fwd].theme!==units[idx+fwd-1].theme){take=fwd;break}
    }
    groups.push(units.slice(idx,idx+take));idx+=take;
  }
  if(idx<units.length&&groups.length)groups[groups.length-1]=groups[groups.length-1].concat(units.slice(idx));
  return groups;
}

function themeOf(g){
  const seen=[];g.forEach(u=>{if(seen.indexOf(u.theme)<0)seen.push(u.theme)});
  if(seen.length<=2)return seen.join(' & ');
  return seen[0]+' +'+(seen.length-1)+' more';
}

let SCHED=[],SCHED_MAP={};
function buildSchedule(){
  SCHED=[];SCHED_MAP={};
  if(!st.plan)return;
  const plan=PLANS.find(p=>p.id===st.plan.id);
  if(!plan||!st.plan.start||!st.plan.end||st.plan.end<st.plan.start)return;

  const dates=studyDates(plan,st.plan.start,st.plan.end);
  if(!dates.length)return;

  // Reserve review days, but never so many that content has nowhere to go.
  const isReview={};
  if(plan.reviewEvery&&dates.length>plan.reviewEvery*2){
    dates.forEach((_,i)=>{if(i>0&&i<dates.length-1&&(i+1)%plan.reviewEvery===0)isReview[i]=true});
  }
  const contentCount=dates.length-Object.keys(isReview).length;
  const groups=packInto(CURRICULUM,contentCount);

  let gi=0,recent=[];
  dates.forEach((date,i)=>{
    if(isReview[i]){
      const themes=recent.slice(-3);recent=[];
      if(!themes.length)return;
      const tasks=themes.map(th=>({t:'Review: '+th,c:'Review',road:null,key:'rev:'+i+':'+th}));
      tasks.push({t:'Solve 3 problems from the last block',c:'Practice',road:null,key:'rev:'+i+':solve'});
      SCHED.push({date:date,theme:'Review & consolidate',tasks:tasks,review:true});
    }else{
      const g=groups[gi++];
      if(!g||!g.length)return;
      g.forEach(u=>{if(recent.indexOf(u.theme)<0)recent.push(u.theme)});
      SCHED.push({date:date,theme:themeOf(g),tasks:g});
    }
  });
  SCHED.forEach(d=>SCHED_MAP[d.date]=d);
}

// ---- progress ----
// Road-linked tasks read and write st.road, so calendar and roadmap stay in step
// and progress is not lost when the plan is regenerated on new dates.
function taskDone(t){return t.road?!!st.road[t.road]:!!st.cal[t.key]}
function tgTask(date,i){
  const dy=SCHED_MAP[date];if(!dy)return;
  const t=dy.tasks[i];if(!t)return;
  if(t.road){st.road[t.road]=!st.road[t.road];if(!st.road[t.road])delete st.road[t.road]}
  else{st.cal[t.key]=!st.cal[t.key];if(!st.cal[t.key])delete st.cal[t.key]}
  sv();renderPlanBar();renderCal();renderDP();renderDash();updTop();renderRoadSide();renderRoadTabs();
}
function getDay(d){return SCHED_MAP[d]}
function dayProg(d){
  const dy=SCHED_MAP[d];if(!dy)return{dn:0,tot:0,p:0};
  let dn=0;dy.tasks.forEach(t=>{if(taskDone(t))dn++});
  return{dn,tot:dy.tasks.length,p:dy.tasks.length?Math.round(dn/dy.tasks.length*100):0};
}
function planTotals(){
  let tot=0,dn=0;
  SCHED.forEach(d=>d.tasks.forEach(t=>{tot++;if(taskDone(t))dn++}));
  return{tot,dn,p:tot?Math.round(dn/tot*100):0};
}

// ---- plan setup UI ----
let planDraft=null;
function editPlan(){
  const cur=st.plan||{};
  planDraft={id:cur.id||'2m',start:cur.start||todayDs(),end:cur.end||''};
  if(!planDraft.end)planDraft.end=addMonths(planDraft.start,PLANS.find(p=>p.id===planDraft.id).months);
  renderPlanBar();
}
function cancelPlan(){planDraft=null;renderPlanBar()}
function pickPlan(id){
  planDraft.id=id;
  planDraft.end=addMonths(planDraft.start,PLANS.find(p=>p.id===id).months);
  renderPlanBar();
}
function setPlanDate(which,v){
  if(!v)return;
  planDraft[which]=v;
  if(which==='start')planDraft.end=addMonths(v,PLANS.find(p=>p.id===planDraft.id).months);
  renderPlanBar();
}
function draftStats(){
  const plan=PLANS.find(p=>p.id===planDraft.id);
  if(planDraft.end<planDraft.start)return{err:'End date is before the start date.'};
  const dates=studyDates(plan,planDraft.start,planDraft.end);
  if(dates.length<5)return{err:'That range leaves only '+dates.length+' study day'+(dates.length===1?'':'s')+'. Pick a longer range.'};
  const reviews=plan.reviewEvery&&dates.length>plan.reviewEvery*2?Math.max(0,Math.floor((dates.length-1)/plan.reviewEvery)):0;
  const contentDays=dates.length-reviews;
  const per=CURRICULUM.length/contentDays;
  return{days:dates.length,reviews:reviews,per:per,
         warn:per>12?'That is a very heavy load per day.':(per<1.5?'That range is longer than the content needs — days will be light.':'')};
}
function savePlan(){
  const stt=draftStats();if(stt.err)return;
  st.plan={id:planDraft.id,start:planDraft.start,end:planDraft.end};
  planDraft=null;sv();buildSchedule();
  selDate=SCHED.length?SCHED[0].date:selDate;
  const f=parseDs(selDate);calM=f.getMonth();calY=f.getFullYear();
  renderPlanBar();renderCal();renderDP();renderDash();
}
function clearPlan(){
  if(!confirm('Remove the schedule? Topics you have already ticked off stay done.'))return;
  delete st.plan;planDraft=null;sv();buildSchedule();
  renderPlanBar();renderCal();renderDP();renderDash();
}

function renderPlanBar(){
  const el=document.getElementById('planBar');if(!el)return;

  if(!planDraft&&st.plan&&SCHED.length){
    const plan=PLANS.find(p=>p.id===st.plan.id),tt=planTotals();
    el.innerHTML=`<div class="plan-live">
      <div class="pl-main">
        <span class="pl-name">${plan.name}</span>
        <span class="pl-meta">${fmtDs(st.plan.start)} &rarr; ${fmtDs(st.plan.end)} &middot; ${SCHED.length} study days &middot; ${tt.dn}/${tt.tot} tasks done</span>
      </div>
      <div class="pl-act">
        <button onclick="editPlan()">Change plan</button>
        <button class="ghost" onclick="clearPlan()">Clear</button>
      </div>
      <div class="pl-bar"><div class="fill ${tt.p===100?'complete':tt.p>0?'partial':''}" style="width:${tt.p}%"></div></div>
    </div>`;
    return;
  }

  if(!planDraft){
    el.innerHTML=`<div class="plan-empty">
      <div><b>No schedule yet.</b> Pick how long you have and the dates get filled in for you.</div>
      <button onclick="editPlan()">Set up a plan</button>
    </div>`;
    return;
  }

  const stt=draftStats();
  const cards=PLANS.map(p=>`
    <div class="pcard${p.id===planDraft.id?' on':''}" onclick="pickPlan('${p.id}')">
      <div class="pc-h"><span class="pc-mon">${p.months} month${p.months>1?'s':''}</span><span class="pc-nm">${p.name}</span></div>
      <div class="pc-b">${p.blurb}</div>
    </div>`).join('');

  const note=stt.err?`<div class="pnote err">${stt.err}</div>`
    :`<div class="pnote${stt.warn?' warn':''}">${stt.days} study days${stt.reviews?', '+stt.reviews+' of them review days':''} &middot; about <b>${stt.per.toFixed(1)} tasks a day</b> to finish all ${CURRICULUM.length}.${stt.warn?' '+stt.warn:''}</div>`;

  el.innerHTML=`<div class="plan-setup">
    <div class="ps-h">How long do you have?</div>
    <div class="pcards">${cards}</div>
    <div class="ps-dates">
      <label>Start <input type="date" value="${planDraft.start}" onchange="setPlanDate('start',this.value)"></label>
      <label>Finish by <input type="date" value="${planDraft.end}" onchange="setPlanDate('end',this.value)"></label>
      <button class="prim" ${stt.err?'disabled':''} onclick="savePlan()">Fill my calendar</button>
      ${st.plan?'<button class="ghost" onclick="cancelPlan()">Cancel</button>':''}
    </div>
    ${note}
  </div>`;
}

let _now=new Date(),calM=_now.getMonth(),calY=_now.getFullYear(),selDate=todayDs();

function renderCal(){
  const M=['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('calTitle').textContent=M[calM]+' '+calY;
  const g=document.getElementById('calGrid');g.innerHTML='';
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d=>{const e=document.createElement('div');e.className='cal-dh';e.textContent=d;g.appendChild(e)});
  const fd=new Date(calY,calM,1).getDay(),dim=new Date(calY,calM+1,0).getDate();
  const ts=todayDs();
  for(let i=0;i<fd;i++){const e=document.createElement('div');e.className='cal-d empty';g.appendChild(e)}
  for(let d=1;d<=dim;d++){
    const s=ds(calY,calM,d),dy=getDay(s),pr=dayProg(s);
    const e=document.createElement('div');
    const sc=dy?(pr.p===100?' full':pr.p>0?' part':''):'';
    e.className='cal-d'+(s===selDate?' sel':'')+(s===ts?' today':'')+sc+(dy&&dy.review?' rev':'');
    e.onclick=()=>{selDate=s;renderCal();renderDP()};
    let h=`<div class="dn">${d}</div>`;
    if(dy){const fc=pr.p===100?'complete':pr.p>0?'partial':'';h+=`<div class="dt">${dy.theme}</div><div class="dp"><div class="fill ${fc}" style="width:${pr.p}%"></div></div>`}
    e.innerHTML=h;g.appendChild(e);
  }
}

function renderDP(){
  const p=document.getElementById('dayPanel');const dy=getDay(selDate);
  if(!dy){
    p.innerHTML=st.plan?'<div class="empty-msg">Nothing scheduled for this day</div>'
      :'<div class="empty-msg">Set up a plan to fill your calendar</div>';
    return;
  }
  const dn=parseDs(selDate).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  const pr=dayProg(selDate);const dpc=pr.p===100?'complete':pr.p>0?'partial':'';
  let h=`<h3>${dy.theme}</h3><div class="ds">${dn}</div>`;
  h+=`<div class="day-prog"><div class="fill ${dpc}" style="width:${pr.p}%"></div></div><div class="day-pct">${pr.dn} of ${pr.tot} done</div>`;
  h+='<ul class="tl">';
  dy.tasks.forEach((t,i)=>{
    const done=taskDone(t);
    const roadLink=t.road?`<span class="go-link" onclick="event.stopPropagation();goToRoad('${t.road}')">Open in Roadmap &rarr;</span>`:'';
    h+=`<li class="ti ${done?'done':''}"><input type="checkbox" ${done?'checked':''} onchange="tgTask('${selDate}',${i})"/><div class="tt">${t.t}${roadLink}</div><span class="cat">${t.c}</span></li>`;
  });
  h+='</ul>';p.innerHTML=h;
}

function calNav(d){calM+=d;if(calM>11){calM=0;calY++}if(calM<0){calM=11;calY--}renderCal()}
function calToday(){const t=new Date();calM=t.getMonth();calY=t.getFullYear();selDate=todayDs();renderCal();renderDP()}

// ====== DASHBOARD ======
function renderDash(){
  let rh='';
  ROADMAP.forEach(cat=>{const p=catProg(cat);const fc=p.p===100?'complete':p.p>0?'partial':'';rh+=`<div class="prog-card"><div class="pc-name">${cat.t}</div><div class="pc-bar"><div class="fill ${fc}" style="width:${p.p}%"></div></div><div class="pc-val">${p.d}/${p.t} &middot; ${p.p}%</div></div>`});
  document.getElementById('roadProg').innerHTML=rh||'<div style="color:#666;font-size:14px">No content loaded</div>';
}

// ====== UTILS ======
function toast(msg){const t=document.getElementById('toast');t.innerHTML=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}
function updTop(){const p=totalProg();document.getElementById('hProg').textContent=p.p+'%';document.getElementById('hTop').textContent=p.d+'/'+p.t}

// ====== INIT ======
buildSchedule();
if(st.plan&&SCHED.length&&!SCHED_MAP[selDate]){
  // Open on the plan if today falls outside it, so the calendar is never blank.
  const first=SCHED[0].date,last=SCHED[SCHED.length-1].date;
  const anchor=todayDs()<first?first:(todayDs()>last?last:selDate);
  const a=parseDs(anchor);calM=a.getMonth();calY=a.getFullYear();selDate=anchor;
}
renderRoad();updTop();
(function(){
  const v=viewFromHash();
  if(v==='notes'){switchView('notes',true);if(!notesRestoreFromHash())notesGoList(false)}
  else if(v==='road')switchView('road',true);
  else if(v==='way')switchView('way',true);
  else if(v==='study')switchView('study',true);
  else{
    switchView('cal',true);
    // Strip a legacy '#cal' so the calendar always sits on the bare URL.
    if(location.hash){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}
  }
})();
