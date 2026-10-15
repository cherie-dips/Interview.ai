const SYSDES_CONTENT = {
  id: 'sysdes', t: 'System Design',
  tabs: [
    {
      id: "lld", t: "LLD Basics",
      topics: [
        {
    t: "OOP Concepts Deep Dive",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Imagine you are designing a <b>trading engine</b>. The system must handle multiple order types (Market, Limit, Stop-Loss), route them through different exchanges, apply risk checks, and generate audit trails. Without OOP, you would end up with a monolithic procedural codebase where every new order type requires modifying dozens of functions. With OOP, each order type is a class, exchanges are abstracted behind interfaces, and new instruments can be added without touching existing code. Every LLD interview at top quant firms begins here &mdash; if you cannot model real-world entities as classes with clean encapsulation and polymorphic behaviour, you cannot design systems.</p><p class="learn-p">OOP is not just academic theory. It is the <b>backbone of every design pattern</b>, every SOLID principle, and every class diagram you will draw on the whiteboard. Mastering these four pillars &mdash; Encapsulation, Abstraction, Inheritance, and Polymorphism &mdash; is the single highest-leverage investment for your LLD interview.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">Object-Oriented Programming organises software around <b>objects</b> that bundle <b>state</b> (data) and <b>behaviour</b> (methods). The four pillars are:</p><div class="learn-code">                    +---------------------------+\n                    |     OOP Four Pillars      |\n                    +---------------------------+\n                    |                           |\n          +---------+---------+       +---------+---------+\n          | Encapsulation     |       | Abstraction       |\n          | (Hide internals,  |       | (Expose only      |\n          |  control access)  |       |  essential API)    |\n          +-------------------+       +-------------------+\n                    |                           |\n          +---------+---------+       +---------+---------+\n          | Inheritance       |       | Polymorphism      |\n          | (IS-A reuse,      |       | (Same interface,  |\n          |  class hierarchy) |       |  different impl)  |\n          +-------------------+       +-------------------+</div><p class="learn-p"><b>Encapsulation</b> bundles data and methods inside a class, restricting access via <code>private</code>, <code>protected</code>, <code>public</code>. <b>Abstraction</b> hides complexity behind clean interfaces (pure virtual functions in C++). <b>Inheritance</b> lets derived classes reuse and extend base class functionality. <b>Polymorphism</b> allows the same interface to trigger different behaviour at compile time (overloading, templates) or runtime (virtual dispatch via vtable).</p><div class="learn-tip"><b>Tip:</b> In interviews, think of these pillars not as definitions to recite, but as <b>design tools</b>. When asked to design a system, ask yourself: What should be hidden? (Encapsulation) What interface should clients see? (Abstraction) What is the type hierarchy? (Inheritance) Where do I need extensibility? (Polymorphism).</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p">The key building blocks of OOP in C++ are:</p><ul class="learn-list"><li><b>Classes &amp; Objects</b> &mdash; The blueprint (class) and instance (object). Classes define data members and member functions.</li><li><b>Access Specifiers</b> &mdash; <code>private</code> (default for class), <code>protected</code>, <code>public</code>. Control who can access what.</li><li><b>Constructors &amp; Destructors</b> &mdash; Special member functions for object lifecycle. The <b>Rule of Five</b>: if you define any of {destructor, copy constructor, copy assignment, move constructor, move assignment}, define all five. The <b>Rule of Zero</b>: prefer designs where compiler-generated versions are correct (use smart pointers, RAII containers).</li><li><b>Virtual Functions &amp; vtable</b> &mdash; The <code>virtual</code> keyword enables dynamic dispatch. Each class with virtual functions has a vtable (array of function pointers). Each object has a hidden vptr pointing to its class\'s vtable.</li><li><b>Abstract Classes &amp; Pure Virtual Functions</b> &mdash; A class with at least one <code>= 0</code> function cannot be instantiated. Acts as an interface contract.</li><li><b>Friend Functions &amp; Classes</b> &mdash; The <code>friend</code> keyword grants access to private members. Use sparingly &mdash; it breaks encapsulation.</li><li><b>Multiple Inheritance &amp; Virtual Inheritance</b> &mdash; C++ allows inheriting from multiple bases. The Diamond Problem arises when two bases share a common ancestor; solved with <code>virtual</code> inheritance.</li></ul><div class="learn-code">// Key classes / APIs in a typical OOP design\nclass Shape {                          // Abstract base\npublic:\n    virtual double area() const = 0;   // Pure virtual\n    virtual ~Shape() = default;        // Virtual destructor!\n};\nclass Circle : public Shape {          // Concrete derived\n    double radius;\npublic:\n    Circle(double r) : radius(r) {}\n    double area() const override { return 3.14159 * radius * radius; }\n};</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Let\'s walk through building a polymorphic shape system step by step, as you would in an interview:</p><p class="learn-p"><b>Step 1: Define the abstraction.</b> What operations do all shapes support? At minimum: <code>area()</code> and <code>name()</code>. Make them pure virtual.</p><p class="learn-p"><b>Step 2: Implement concrete classes.</b> Each shape overrides the virtual functions with its own formula.</p><p class="learn-p"><b>Step 3: Use polymorphism.</b> Client code works with <code>Shape*</code> or <code>unique_ptr&lt;Shape&gt;</code>, never concrete types.</p><div class="learn-code">// Step 1: Abstraction\nclass Shape {\npublic:\n    virtual double area() const = 0;\n    virtual string name() const = 0;\n    virtual ~Shape() = default;\n};\n\n// Step 2: Concrete implementations\nclass Circle : public Shape {\n    double r;\npublic:\n    Circle(double r) : r(r) {}\n    double area() const override { return 3.14159 * r * r; }\n    string name() const override { return "Circle"; }\n};\n\nclass Rectangle : public Shape {\n    double w, h;\npublic:\n    Rectangle(double w, double h) : w(w), h(h) {}\n    double area() const override { return w * h; }\n    string name() const override { return "Rectangle"; }\n};\n\n// Step 3: Polymorphic client code\nvoid printAreas(const vector&lt;unique_ptr&lt;Shape&gt;&gt;&amp; shapes) {\n    for (auto&amp; s : shapes)\n        cout &lt;&lt; s-&gt;name() &lt;&lt; ": " &lt;&lt; s-&gt;area() &lt;&lt; endl;\n    // Adding Triangle requires ZERO changes here!\n}</div><p class="learn-p">Notice: adding a new <code>Triangle</code> class requires <b>zero changes</b> to <code>printAreas</code>. This is OCP in action, powered by polymorphism.</p><p class="learn-p"><b>vtable Mechanics:</b> When <code>s-&gt;area()</code> is called, the compiler emits code that: (1) follows the object\'s hidden <code>vptr</code> to the vtable, (2) indexes into the vtable to find the <code>area</code> slot, (3) calls the function pointer stored there. This is why virtual calls have a small overhead (~1 pointer indirection) compared to static dispatch.</p></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><p class="learn-p"><b>Compile-time Polymorphism (CRTP):</b> The Curiously Recurring Template Pattern achieves polymorphism without vtable overhead:</p><div class="learn-code">template&lt;typename Derived&gt;\nclass ShapeBase {\npublic:\n    double area() const {\n        return static_cast&lt;const Derived*&gt;(this)-&gt;areaImpl();\n    }\n};\nclass Circle : public ShapeBase&lt;Circle&gt; {\n    double r;\npublic:\n    double areaImpl() const { return 3.14159 * r * r; }\n};</div><p class="learn-p"><b>Trade-offs:</b></p><table class="learn-table"><tr><th>Approach</th><th>Pros</th><th>Cons</th></tr><tr><td>Virtual Functions</td><td>Runtime flexibility, easy to add types</td><td>vtable overhead, heap allocation</td></tr><tr><td>CRTP</td><td>Zero overhead, inlining</td><td>No runtime polymorphism, code bloat</td></tr><tr><td>std::variant + std::visit</td><td>Value semantics, no heap</td><td>Closed set of types, recompile to add</td></tr></table><p class="learn-p"><b>Other Variations:</b> Type erasure (like <code>std::function</code>) combines runtime flexibility with value semantics. <code>std::any</code> provides type-safe void pointers. In high-frequency trading systems, CRTP and <code>std::variant</code> are preferred over virtual dispatch in hot paths due to cache and branch-prediction benefits.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Pitfall 1: Forgetting the virtual destructor.</b> If a base class lacks a virtual destructor, deleting a derived object through a base pointer causes <b>undefined behaviour</b>. Always declare <code>virtual ~Base() = default;</code> when you have virtual functions.</div><div class="learn-warn"><b>Pitfall 2: The Diamond Problem.</b> With multiple inheritance, if classes B and C both inherit from A, then D inheriting from both B and C gets two copies of A\'s members. Fix: use <code>virtual</code> inheritance (<code>class B : virtual public A</code>).</div><div class="learn-warn"><b>Pitfall 3: Object slicing.</b> Assigning a derived object to a base object by value <b>slices off</b> the derived part. Always use pointers or references for polymorphism: <code>Shape&amp; s = circle;</code> not <code>Shape s = circle;</code>.</div><div class="learn-warn"><b>Pitfall 4: Calling virtual functions in constructors.</b> During construction of a <code>Base</code> subobject, the vtable still points to <code>Base</code>\'s methods, not <code>Derived</code>\'s. Virtual calls in constructors/destructors do NOT dispatch to the derived class.</div><div class="learn-warn"><b>Pitfall 5: Confusing overloading with overriding.</b> Overloading = same function name, different parameters (compile-time). Overriding = same signature in derived class with <code>override</code> keyword (runtime). Forgetting <code>override</code> can silently create a new function instead of overriding.</div><div class="learn-tip"><b>Interview Trap:</b> "What happens if you call a pure virtual function from a constructor?" &mdash; Undefined behaviour (typically a linker error or crash). The derived class\'s vtable is not yet installed during base construction.</div></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>OOP Mechanism</th><th>Resolved At</th><th>Overhead</th><th>Flexibility</th><th>Use When</th></tr><tr><td>Function Overloading</td><td>Compile-time</td><td>None</td><td>Low &mdash; types fixed</td><td>Same operation on different parameter types</td></tr><tr><td>Templates (CRTP)</td><td>Compile-time</td><td>None (inlined)</td><td>Medium &mdash; types fixed at compile</td><td>Performance-critical paths, static polymorphism</td></tr><tr><td>Virtual Functions</td><td>Runtime</td><td>1 pointer indirection</td><td>High &mdash; add types freely</td><td>Open type hierarchies, plugin architectures</td></tr><tr><td>std::variant + visit</td><td>Compile-time</td><td>None (inlined)</td><td>Low &mdash; closed type set</td><td>Small fixed set of types, value semantics</td></tr><tr><td>Type Erasure</td><td>Runtime</td><td>Heap + indirection</td><td>High</td><td>Heterogeneous containers with value semantics</td></tr></table><table class="learn-table"><tr><th>Access Specifier</th><th>Same Class</th><th>Derived Class</th><th>Outside</th></tr><tr><td>public</td><td>Yes</td><td>Yes</td><td>Yes</td></tr><tr><td>protected</td><td>Yes</td><td>Yes</td><td>No</td></tr><tr><td>private</td><td>Yes</td><td>No</td><td>No</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain the four pillars of OOP with a real system example.</b><br>A: In a trading system: <b>Encapsulation</b> &mdash; Order class hides internal state (price, quantity) and exposes methods like <code>execute()</code>. <b>Abstraction</b> &mdash; <code>Exchange</code> interface hides whether we\'re connecting to NYSE or NASDAQ. <b>Inheritance</b> &mdash; <code>MarketOrder</code> and <code>LimitOrder</code> extend <code>Order</code>. <b>Polymorphism</b> &mdash; the matching engine calls <code>order-&gt;validate()</code> and the right implementation runs.</p><p class="learn-p"><b>Q2: What is the difference between overloading and overriding?</b><br>A: Overloading: same function name, different parameter lists, resolved at <b>compile time</b>. Overriding: same function signature in a derived class, resolved at <b>runtime</b> via vtable. Use <code>override</code> keyword in C++ to prevent accidental signature mismatches.</p><p class="learn-p"><b>Q3: Explain the vtable mechanism in C++.</b><br>A: Each class with virtual functions gets a vtable (static array of function pointers). Each object contains a hidden vptr pointing to its class\'s vtable. On a virtual call like <code>base-&gt;func()</code>, the compiler dereferences vptr, indexes into the vtable, and calls the function pointer. This adds one level of indirection (~2-5ns overhead per call).</p><p class="learn-p"><b>Q4: What is object slicing and how do you prevent it?</b><br>A: When a derived object is assigned to a base object <b>by value</b>, the derived-specific data is "sliced off." Prevent by always using pointers (<code>unique_ptr&lt;Base&gt;</code>) or references (<code>Base&amp;</code>) for polymorphic types. You can also delete the copy constructor of the base class.</p><p class="learn-p"><b>Q5: When would you use an abstract class vs a pure interface?</b><br>A: Use an abstract class when you want to provide <b>shared default implementation</b> (e.g., a template method skeleton). Use a pure interface (all pure virtual) when you want <b>maximum decoupling</b> and different implementations share no code. In C++, both are abstract classes; the distinction is convention.</p><p class="learn-p"><b>Q6: Explain the Diamond Problem and virtual inheritance.</b><br>A: If D inherits from B and C, both of which inherit from A, D gets two copies of A. This causes ambiguity when accessing A\'s members. Virtual inheritance (<code>class B : virtual public A</code>) ensures only one shared A subobject exists. The trade-off: virtual inheritance adds a vbase pointer and makes construction order more complex (the most-derived class must initialize the virtual base).</p><p class="learn-p"><b>Q7: What is the Rule of Five vs Rule of Zero?</b><br>A: Rule of Five: if you define any of {destructor, copy ctor, copy assign, move ctor, move assign}, define all five &mdash; because defining one means the compiler-generated versions are likely wrong. Rule of Zero: design classes so compiler defaults work (use <code>unique_ptr</code>, <code>vector</code>, RAII wrappers). Prefer Rule of Zero; use Rule of Five only for low-level resource-managing classes.</p></div>',
    code: `// ===== OOP Concepts Deep Dive — C++ Implementation =====
#include <iostream>
#include <string>
#include <vector>
#include <memory>
using namespace std;

// --- Abstraction & Encapsulation ---
class Shape {
public:
    virtual double area() const = 0;
    virtual string name() const = 0;
    virtual ~Shape() = default;
};

// --- Inheritance & Polymorphism ---
class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override { return 3.14159 * radius * radius; }
    string name() const override { return "Circle"; }
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    string name() const override { return "Rectangle"; }
};

// --- Compile-time polymorphism (overloading) ---
class Printer {
public:
    void print(int x)    { cout << "int: " << x << endl; }
    void print(double x) { cout << "double: " << x << endl; }
    void print(const string& s) { cout << "string: " << s << endl; }
};

// --- CRTP (static polymorphism, zero overhead) ---
template<typename Derived>
class ShapeBase {
public:
    double area() const {
        return static_cast<const Derived*>(this)->areaImpl();
    }
    string name() const {
        return static_cast<const Derived*>(this)->nameImpl();
    }
};

class FastCircle : public ShapeBase<FastCircle> {
    double r;
public:
    FastCircle(double r) : r(r) {}
    double areaImpl() const { return 3.14159 * r * r; }
    string nameImpl() const { return "FastCircle"; }
};

// --- Diamond Problem & Virtual Inheritance ---
class A { public: int val = 0; virtual ~A() = default; };
class B : virtual public A {};
class C : virtual public A {};
class D : public B, public C {};  // only one copy of A::val

// --- Rule of Five example ---
class Buffer {
    int* data;
    size_t sz;
public:
    // Constructor
    Buffer(size_t n) : data(new int[n]()), sz(n) {}

    // Destructor
    ~Buffer() { delete[] data; }

    // Copy constructor (deep copy)
    Buffer(const Buffer& o) : data(new int[o.sz]), sz(o.sz) {
        copy(o.data, o.data + sz, data);
    }

    // Copy assignment (copy-and-swap idiom)
    Buffer& operator=(const Buffer& o) {
        if (this != &o) {
            delete[] data;
            sz = o.sz;
            data = new int[sz];
            copy(o.data, o.data + sz, data);
        }
        return *this;
    }

    // Move constructor (steal resources)
    Buffer(Buffer&& o) noexcept : data(o.data), sz(o.sz) {
        o.data = nullptr; o.sz = 0;
    }

    // Move assignment
    Buffer& operator=(Buffer&& o) noexcept {
        if (this != &o) {
            delete[] data;
            data = o.data; sz = o.sz;
            o.data = nullptr; o.sz = 0;
        }
        return *this;
    }

    size_t size() const { return sz; }
};

// --- Object Slicing Demo ---
void demonstrateSlicing() {
    Circle c(5);
    // Shape s = c;          // SLICING! Derived data lost. Won't compile (abstract)
    Shape& ref = c;          // OK — polymorphic reference
    Shape* ptr = &c;         // OK — polymorphic pointer
    cout << ref.area() << endl;
    cout << ptr->area() << endl;
}

int main() {
    // Runtime polymorphism via vtable
    vector<unique_ptr<Shape>> shapes;
    shapes.push_back(make_unique<Circle>(5));
    shapes.push_back(make_unique<Rectangle>(4, 6));
    for (auto& s : shapes)
        cout << s->name() << " area = " << s->area() << endl;

    // Compile-time polymorphism (overloading)
    Printer p;
    p.print(42);
    p.print(3.14);
    p.print("hello");

    // CRTP — zero overhead polymorphism
    FastCircle fc(5);
    cout << fc.name() << " area = " << fc.area() << endl;

    // Diamond problem — only one A::val
    D d;
    d.val = 42;  // Unambiguous thanks to virtual inheritance
    cout << "Diamond D::val = " << d.val << endl;

    // Rule of Five
    Buffer b1(100);
    Buffer b2 = b1;             // Copy constructor
    Buffer b3 = move(b1);       // Move constructor
    cout << "b2 size: " << b2.size() << ", b3 size: " << b3.size() << endl;

    demonstrateSlicing();
    return 0;
}`,
    problems: [
      ["Design a Class Hierarchy for Shapes","https://www.geeksforgeeks.org/virtual-function-cpp/","Easy"],
      ["Number of Recent Calls (OOP Queue)","https://leetcode.com/problems/number-of-recent-calls/","Easy"],
      ["Design HashMap","https://leetcode.com/problems/design-hashmap/","Easy"],
      ["Design Browser History","https://leetcode.com/problems/design-browser-history/","Medium"],
      ["Implement Stack using Queues","https://leetcode.com/problems/implement-stack-using-queues/","Easy"],
      ["Design Linked List","https://leetcode.com/problems/design-linked-list/","Medium"],
    ],
    mcqs: [
      {"q":"Which keyword in C++ is used to achieve run-time polymorphism?","o":["static","virtual","template","friend"],"a":1},
      {"q":"The Diamond Problem in C++ multiple inheritance is solved using:","o":["virtual inheritance","friend classes","private inheritance","templates"],"a":0},
      {"q":"Which of the following is NOT a pillar of OOP?","o":["Encapsulation","Concurrency","Polymorphism","Abstraction"],"a":1},
      {"q":"What happens when a virtual function is called inside a base class constructor?","o":["The derived class version is called","Compilation error","The base class version is called","Undefined behaviour (may crash)"],"a":2},
      {"q":"Object slicing occurs when:","o":["A derived pointer is cast to base pointer","A derived object is assigned to a base object by value","A base pointer is deleted without virtual destructor","A virtual function is not overridden"],"a":1},
      {"q":"The Rule of Five applies when a class:","o":["Has exactly five member variables","Uses five levels of inheritance","Has five public methods","Defines any one of the five special member functions"],"a":3},
      {"q":"CRTP (Curiously Recurring Template Pattern) provides:","o":["Runtime polymorphism with vtable","Static (compile-time) polymorphism with zero overhead","Dynamic casting between types","Automatic garbage collection"],"a":1},
      {"q":"Which is true about pure virtual functions?","o":["They prevent the base class from being instantiated","They must have an implementation in the base class","They cannot be overridden","They are resolved at compile time"],"a":0}
    ],
  },
  {
    t: "Composition vs Inheritance",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Consider designing a <b>notification system</b>. Traders need alerts via email, SMS, Slack, and Bloomberg terminal. Your first instinct might be an inheritance hierarchy: <code>Notification</code> &rarr; <code>EmailNotification</code> &rarr; <code>UrgentEmailNotification</code>. But what about an urgent Slack notification? Or a formatted SMS? You quickly hit a <b>combinatorial explosion</b> of subclasses. This is the classic problem that composition solves. By composing a notification with a <code>Channel</code> (email/SMS/Slack), a <code>Formatter</code> (plain/HTML/JSON), and a <code>Priority</code> (normal/urgent), you get N+M+K classes instead of N&times;M&times;K.</p><p class="learn-p">The "Composition over Inheritance" principle from the Gang of Four book is one of the <b>most frequently tested</b> concepts in LLD interviews. Interviewers will give you a poorly designed class hierarchy and ask you to refactor it &mdash; or present a greenfield design where composition is clearly superior. Understanding when each approach is appropriate (not just "always prefer composition") is what separates strong candidates.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p"><b>Inheritance</b> models an IS-A relationship: a <code>Dog</code> IS-A <code>Animal</code>. The derived class inherits both interface and implementation. <b>Composition</b> models a HAS-A relationship: a <code>Car</code> HAS-A <code>Engine</code>. The outer class contains an instance of the inner class and delegates to it.</p><div class="learn-code">  INHERITANCE (IS-A)              COMPOSITION (HAS-A)\n  ==================              ====================\n\n  +-------------+                 +-------------+\n  |   Animal    |                 |    Car      |\n  |-------------|                 |-------------|\n  | + speak()   |                 | - engine: Engine\n  +------+------+                 | + start()   |\n         |                        +------+------+\n         |                               |\n  +------+------+                 +------+------+\n  |    Dog      |                 |   Engine    |\n  |-------------|                 |-------------|\n  | + speak()   |                 | + ignite()  |\n  +-------------+                 +-------------+\n\n  Dog IS-A Animal                 Car HAS-A Engine\n  Dog inherits speak()            Car delegates to engine.ignite()\n  Tight coupling                  Loose coupling\n  Fixed at compile time           Swappable at runtime</div><p class="learn-p">The Gang of Four principle: <b>"Favor object composition over class inheritance."</b> This does not mean never use inheritance &mdash; it means default to composition, and use inheritance only when you need polymorphic substitution with a genuine IS-A relationship.</p></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p">Key building blocks for composition vs inheritance decisions:</p><ul class="learn-list"><li><b>Inheritance Mechanics</b> &mdash; C++ supports <code>public</code>, <code>protected</code>, and <code>private</code> inheritance. Only <code>public</code> inheritance models IS-A. Private inheritance is "implemented-in-terms-of" &mdash; a form of composition using inheritance syntax.</li><li><b>Composition Mechanics</b> &mdash; A class holds a member variable (or pointer/reference) of another class. If via pointer, the composed object can be swapped at runtime.</li><li><b>Aggregation vs Composition</b> &mdash; Both are HAS-A. <b>Composition</b>: the inner object\'s lifetime is managed by the outer (Car owns Engine; Engine is destroyed with Car). UML: filled diamond. <b>Aggregation</b>: the inner object exists independently (Department has Professors; Professors outlive the Department). UML: empty diamond.</li><li><b>Delegation</b> &mdash; The outer class forwards calls to the inner object. This is the mechanism by which composition achieves code reuse.</li><li><b>Strategy Pattern</b> &mdash; The canonical design pattern for composition with interfaces: define an algorithm interface, compose the client with a concrete strategy, swap at runtime.</li><li><b>Decorator Pattern</b> &mdash; Wraps an object to add behaviour without subclassing. The wrapper and the wrappee share an interface (via inheritance), but the wrapper delegates to the wrappee (via composition). This is composition + inheritance working together.</li></ul><div class="learn-code">// Aggregation: University does not own Professors\nclass Professor { string name; };\nclass Department {\n    vector&lt;Professor*&gt; faculty;   // aggregation: professors exist independently\n};\n\n// Composition: Car owns Engine\nclass Engine { void start(); };\nclass Car {\n    Engine engine;                // composition: engine dies with car\n};</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Let\'s walk through the classic <b>Fragile Base Class Problem</b> &mdash; the most important example of why composition is preferred.</p><p class="learn-p"><b>The Bug:</b> You have a <code>HashSet</code> with <code>add()</code> and <code>addAll()</code>. You want to count insertions, so you create <code>CountingSet</code> inheriting from <code>HashSet</code>.</p><div class="learn-code">class HashSet {\npublic:\n    int addCount = 0;\n    virtual void add(int e)     { addCount++; /* insert */ }\n    virtual void addAll(vector&lt;int&gt;&amp; v) {\n        for (int e : v) add(e);   // calls virtual add!\n    }\n};\n\nclass CountingSet : public HashSet {\npublic:\n    void add(int e) override    { addCount++; HashSet::add(e); }\n    void addAll(vector&lt;int&gt;&amp; v) override {\n        addCount += v.size();\n        HashSet::addAll(v);       // Calls this-&gt;add() via virtual dispatch!\n    }\n};\n\n// CountingSet cs;\n// vector&lt;int&gt; v = {1,2,3};\n// cs.addAll(v);\n// cs.addCount == 9!  (expected 3)</div><p class="learn-p"><b>What went wrong:</b> <code>CountingSet::addAll</code> adds 3 to count, then calls <code>HashSet::addAll</code>, which loops and calls <code>this-&gt;add()</code>. But <code>this</code> is a <code>CountingSet</code>, so virtual dispatch calls <code>CountingSet::add()</code>, which adds 1 each time. Then <code>HashSet::add()</code> adds 1 more. Total: 3 + 3 + 3 = 9. This is the <b>Fragile Base Class Problem</b> &mdash; the derived class cannot safely rely on the base class\'s internal implementation details.</p><p class="learn-p"><b>The Fix &mdash; Composition (Wrapper/Decorator):</b></p><div class="learn-code">class ISet {\npublic:\n    virtual void add(int e) = 0;\n    virtual void addAll(const vector&lt;int&gt;&amp; v) = 0;\n    virtual ~ISet() = default;\n};\n\nclass MyHashSet : public ISet {\npublic:\n    void add(int e) override { /* actual insert */ }\n    void addAll(const vector&lt;int&gt;&amp; v) override {\n        for (int e : v) add(e);   // calls MyHashSet::add\n    }\n};\n\nclass CountingSetWrapper : public ISet {\n    unique_ptr&lt;ISet&gt; inner;   // COMPOSITION, not inheritance\n    int addCount = 0;\npublic:\n    CountingSetWrapper(unique_ptr&lt;ISet&gt; s) : inner(move(s)) {}\n    void add(int e) override {\n        addCount++;\n        inner-&gt;add(e);         // delegates to inner, no virtual trap\n    }\n    void addAll(const vector&lt;int&gt;&amp; v) override {\n        addCount += v.size();\n        inner-&gt;addAll(v);      // inner::addAll calls inner::add, NOT this-&gt;add\n    }\n    int getCount() const { return addCount; }\n};</div><p class="learn-p">Now <code>inner-&gt;addAll(v)</code> calls <code>MyHashSet::add</code> (not <code>CountingSetWrapper::add</code>), because <code>inner</code> is a separate object. No double counting. The wrapper is completely decoupled from the inner implementation.</p></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><p class="learn-p"><b>Strategy Pattern (Behavioural Composition):</b> The quintessential composition pattern. Define an algorithm interface, inject a concrete implementation at runtime.</p><div class="learn-code">class ISortStrategy {\npublic:\n    virtual void sort(vector&lt;int&gt;&amp; data) = 0;\n    virtual ~ISortStrategy() = default;\n};\nclass QuickSort : public ISortStrategy {\n    void sort(vector&lt;int&gt;&amp; data) override { /* quicksort */ }\n};\nclass MergeSort : public ISortStrategy {\n    void sort(vector&lt;int&gt;&amp; data) override { /* mergesort */ }\n};\nclass DataProcessor {\n    unique_ptr&lt;ISortStrategy&gt; strategy;  // composed\npublic:\n    void setStrategy(unique_ptr&lt;ISortStrategy&gt; s) { strategy = move(s); }\n    void process(vector&lt;int&gt;&amp; data) { strategy-&gt;sort(data); }\n};</div><p class="learn-p"><b>Decorator Pattern (Composition + Shared Interface):</b> Both the decorator and the decorated object implement the same interface. The decorator delegates to the inner object and adds behaviour.</p><p class="learn-p"><b>Private Inheritance (Composition via Inheritance Syntax):</b> In C++, <code>class Timer : private Clock</code> means Timer is implemented using Clock but is NOT substitutable for Clock. It\'s equivalent to composition but allows access to protected members and enables EBO (Empty Base Optimization). Use it rarely and only when composition doesn\'t work (e.g., you need to override a virtual function of the "composed" class).</p><p class="learn-p"><b>Mixin Pattern:</b> Use multiple inheritance from small, focused base classes to compose behaviours. Similar to ISP-style interfaces but with implementations.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Pitfall 1: Inheritance for code reuse only.</b> If you catch yourself inheriting just to reuse methods (not to model IS-A), stop and use composition. <code>Stack</code> should NOT inherit from <code>Vector</code> just because both have push/pop-like operations. Java\'s <code>Stack extends Vector</code> is a famous design mistake.</div><div class="learn-warn"><b>Pitfall 2: Deep inheritance hierarchies.</b> More than 2-3 levels deep is a code smell. Every additional level increases coupling and makes the fragile base class problem worse. Prefer flat hierarchies with composition.</div><div class="learn-warn"><b>Pitfall 3: Overusing composition.</b> If you have a genuine, stable IS-A relationship that needs polymorphic dispatch, inheritance is correct. Making everything composition-based can lead to unnecessary boilerplate and indirection.</div><div class="learn-warn"><b>Pitfall 4: Confusing aggregation with composition.</b> In an interview, if asked to draw a UML diagram, use filled diamond for composition (lifetime ownership) and empty diamond for aggregation (independent lifetime). Getting this wrong signals weak modelling skills.</div><div class="learn-tip"><b>Interview Trap:</b> "Isn\'t the Decorator pattern using inheritance?" &mdash; Yes, for the <b>interface</b> (shared type). But the core reuse mechanism is <b>composition</b> (delegation to the wrapped object). Decorator uses inheritance for type conformance and composition for code reuse. This distinction is frequently tested.</div></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Aspect</th><th>Inheritance</th><th>Composition</th></tr><tr><td>Relationship</td><td>IS-A (subtype)</td><td>HAS-A (contains)</td></tr><tr><td>Coupling</td><td>Tight &mdash; child depends on parent internals</td><td>Loose &mdash; interact via interfaces</td></tr><tr><td>Flexibility</td><td>Static &mdash; fixed at compile time</td><td>Dynamic &mdash; swap at runtime</td></tr><tr><td>Code Reuse</td><td>Inherits interface + implementation</td><td>Reuses only implementation</td></tr><tr><td>Fragile Base Class</td><td>Yes &mdash; parent changes can break child</td><td>No &mdash; changes are encapsulated</td></tr><tr><td>Polymorphism</td><td>Built-in via virtual dispatch</td><td>Achieved by composing interfaces</td></tr><tr><td>Testing</td><td>Hard to mock base class</td><td>Easy to mock composed dependencies</td></tr><tr><td>Memory Layout</td><td>Single object, contiguous</td><td>Possible pointer indirection</td></tr><tr><td>Construction</td><td>Base constructed first automatically</td><td>Must explicitly construct members</td></tr></table><table class="learn-table"><tr><th>Design Pattern</th><th>Uses Inheritance?</th><th>Uses Composition?</th><th>Primary Mechanism</th></tr><tr><td>Strategy</td><td>Interface only</td><td>Yes (core)</td><td>Composition</td></tr><tr><td>Decorator</td><td>For type conformance</td><td>Yes (delegation)</td><td>Both</td></tr><tr><td>Template Method</td><td>Yes (core)</td><td>No</td><td>Inheritance</td></tr><tr><td>Observer</td><td>Interface only</td><td>Yes (subscriber list)</td><td>Composition</td></tr><tr><td>Adapter</td><td>Class adapter: yes</td><td>Object adapter: yes</td><td>Either</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Why does the Gang of Four say "Favor composition over inheritance"?</b><br>A: Composition provides: (1) loose coupling &mdash; classes interact via interfaces, not internal details; (2) runtime flexibility &mdash; you can swap composed objects; (3) avoidance of the fragile base class problem; (4) easier unit testing &mdash; dependencies can be mocked. Inheritance creates tight coupling where derived classes depend on base class implementation details.</p><p class="learn-p"><b>Q2: When IS inheritance the right choice?</b><br>A: When there is a genuine IS-A relationship that satisfies LSP, when you need polymorphic dispatch via a shared base type, and when the type hierarchy is stable and unlikely to cause combinatorial explosion. Example: <code>Shape</code> &rarr; <code>Circle</code>, <code>Rectangle</code> is a natural and stable hierarchy.</p><p class="learn-p"><b>Q3: Explain the Fragile Base Class Problem with an example.</b><br>A: The HashSet/CountingSet example: <code>HashSet::addAll</code> internally calls <code>add()</code>. The derived <code>CountingSet</code> overrides both, but <code>addAll</code> triggers virtual dispatch to the derived <code>add()</code>, causing double-counting. The derived class broke because it depended on the base class\'s internal implementation. Fix: use composition &mdash; wrap a HashSet instead of inheriting from it.</p><p class="learn-p"><b>Q4: What is the difference between aggregation and composition?</b><br>A: Both are HAS-A. <b>Composition</b>: the container owns the contained object and manages its lifetime (Car owns Engine). <b>Aggregation</b>: the contained object exists independently (Department references Professors). In code: composition uses value members or <code>unique_ptr</code>; aggregation uses raw pointers, references, or <code>shared_ptr</code>.</p><p class="learn-p"><b>Q5: How does the Decorator pattern combine inheritance and composition?</b><br>A: The decorator inherits the same interface as the object it wraps (for type compatibility), but it <b>composes</b> the wrapped object (holds a pointer to it) and delegates calls to it. This means you can stack decorators: <code>BufferedStream(EncryptedStream(FileStream))</code>. Each decorator adds behaviour while preserving the original interface.</p><p class="learn-p"><b>Q6: What is private inheritance in C++ and when would you use it?</b><br>A: Private inheritance means "implemented-in-terms-of" &mdash; the derived class uses the base class\'s implementation but is NOT substitutable for it. It\'s like composition but with access to protected members and the ability to override virtual functions. Use it when you need to override a virtual function of the "composed" class (e.g., for a timer callback) or to leverage Empty Base Optimization (EBO).</p><p class="learn-p"><b>Q7: Refactor this: class Stack extends ArrayList. What\'s wrong?</b><br>A: A Stack is NOT an ArrayList &mdash; it should not expose <code>get(i)</code>, <code>set(i, val)</code>, or <code>remove(i)</code>. This violates both IS-A semantics and ISP (clients get methods they shouldn\'t use). Fix: Stack should <b>contain</b> an ArrayList (composition) and expose only <code>push()</code>, <code>pop()</code>, and <code>peek()</code>.</p></div>',
    code: `// ===== Composition vs Inheritance — C++ Demo =====
#include <iostream>
#include <memory>
#include <vector>
using namespace std;

// ----- Bad design: Inheritance for code reuse -----
class BadHashSet {
public:
    int addCount = 0;
    virtual void add(int e)  { addCount++; }
    virtual void addAll(const vector<int>& v) {
        for (int e : v) add(e);   // virtual dispatch!
    }
    virtual ~BadHashSet() = default;
};

class BadCountingSet : public BadHashSet {
public:
    void add(int e) override {
        addCount++;                // +1
        BadHashSet::add(e);        // +1 again => double-counted!
    }
    void addAll(const vector<int>& v) override {
        addCount += v.size();      // +N
        BadHashSet::addAll(v);     // calls this->add() => +N more
    }
};

// ----- Good design: Composition (wrapper / decorator) -----
class ISet {
public:
    virtual void add(int e) = 0;
    virtual void addAll(const vector<int>& v) = 0;
    virtual ~ISet() = default;
};

class MyHashSet : public ISet {
public:
    void add(int e) override { /* actual set insert */ }
    void addAll(const vector<int>& v) override {
        for (int e : v) add(e);
    }
};

class CountingSetWrapper : public ISet {
    unique_ptr<ISet> inner;     // composition
    int addCount = 0;
public:
    CountingSetWrapper(unique_ptr<ISet> s) : inner(move(s)) {}
    void add(int e) override {
        addCount++;
        inner->add(e);           // delegates — no double count
    }
    void addAll(const vector<int>& v) override {
        addCount += v.size();
        inner->addAll(v);        // inner::addAll calls inner::add, NOT this->add
    }
    int getCount() const { return addCount; }
};

// ----- Strategy via Composition -----
class ISortStrategy {
public:
    virtual void sort(vector<int>& data) = 0;
    virtual ~ISortStrategy() = default;
};
class BubbleSort : public ISortStrategy {
public:
    void sort(vector<int>& data) override {
        for (size_t i = 0; i < data.size(); i++)
            for (size_t j = 0; j + 1 < data.size() - i; j++)
                if (data[j] > data[j+1]) swap(data[j], data[j+1]);
    }
};
class MergeSort : public ISortStrategy {
public:
    void sort(vector<int>& data) override {
        // mergesort implementation...
        cout << "MergeSort applied" << endl;
    }
};
class DataProcessor {
    unique_ptr<ISortStrategy> strategy;
public:
    void setStrategy(unique_ptr<ISortStrategy> s) { strategy = move(s); }
    void process(vector<int>& data) {
        if (strategy) strategy->sort(data);
    }
};

// ----- Decorator Pattern: Composition + Interface Sharing -----
class IStream {
public:
    virtual void write(const string& data) = 0;
    virtual ~IStream() = default;
};

class FileStream : public IStream {
public:
    void write(const string& data) override {
        cout << "[File] " << data << endl;
    }
};

class EncryptedStream : public IStream {
    unique_ptr<IStream> inner;  // composition
public:
    EncryptedStream(unique_ptr<IStream> s) : inner(move(s)) {}
    void write(const string& data) override {
        string encrypted = "ENC(" + data + ")";
        inner->write(encrypted);  // delegate
    }
};

class BufferedStream : public IStream {
    unique_ptr<IStream> inner;
    vector<string> buffer;
public:
    BufferedStream(unique_ptr<IStream> s) : inner(move(s)) {}
    void write(const string& data) override {
        buffer.push_back(data);
        if (buffer.size() >= 3) flush();
    }
    void flush() {
        for (auto& d : buffer) inner->write(d);
        buffer.clear();
    }
};

int main() {
    // Demonstrate the inheritance bug
    BadCountingSet bcs;
    vector<int> nums = {1, 2, 3};
    bcs.addAll(nums);
    cout << "Bad count (expected 3): " << bcs.addCount << endl; // prints 9!

    // Demonstrate the composition fix
    auto cs = CountingSetWrapper(make_unique<MyHashSet>());
    cs.addAll(nums);
    cout << "Good count (expected 3): " << cs.getCount() << endl; // prints 3

    // Strategy pattern — swap algorithms at runtime
    DataProcessor dp;
    dp.setStrategy(make_unique<BubbleSort>());
    vector<int> data = {3, 1, 2};
    dp.process(data);

    dp.setStrategy(make_unique<MergeSort>());
    dp.process(data);

    // Decorator — stack behaviours via composition
    auto stream = make_unique<BufferedStream>(
        make_unique<EncryptedStream>(
            make_unique<FileStream>()
        )
    );
    stream->write("order1");
    stream->write("order2");
    stream->write("order3");  // triggers flush: 3 encrypted writes

    return 0;
}`,
    problems: [
      ["Design Parking System","https://leetcode.com/problems/design-parking-system/","Easy"],
      ["Shuffle an Array","https://leetcode.com/problems/shuffle-an-array/","Medium"],
      ["Design Underground System","https://leetcode.com/problems/design-underground-system/","Medium"],
      ["LRU Cache","https://leetcode.com/problems/lru-cache/","Medium"],
      ["Design Twitter","https://leetcode.com/problems/design-twitter/","Medium"],
    ],
    mcqs: [
      {"q":"Which relationship does Composition model?","o":["IS-A","HAS-A","USES-A","EXTENDS-A"],"a":1},
      {"q":"The 'Fragile Base Class' problem is a risk associated with:","o":["Composition","Aggregation","Inheritance","Encapsulation"],"a":2},
      {"q":"Which design principle says 'Program to an interface, not an implementation'?","o":["Single Responsibility","Open-Closed","Dependency Inversion","Liskov Substitution"],"a":2},
      {"q":"The Decorator pattern uses:","o":["Only inheritance","Only composition","Inheritance for interface conformance and composition for delegation","Neither inheritance nor composition"],"a":2},
      {"q":"What does a filled diamond represent in UML?","o":["Inheritance","Aggregation","Composition (strong ownership)","Dependency"],"a":2},
      {"q":"Java's Stack extends Vector is a violation of:","o":["Only SRP","Only ISP","IS-A semantics — Stack is not a Vector","DIP"],"a":2},
      {"q":"Private inheritance in C++ is most similar to:","o":["Public inheritance","Composition (implemented-in-terms-of)","Aggregation","Friend classes"],"a":1},
      {"q":"Which pattern lets you swap algorithms at runtime via composition?","o":["Singleton","Template Method","Strategy","Factory Method"],"a":2}],
  },
  {
    t: "SRP & OCP",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">You\'re building a <b>trade execution reporting system</b>. The <code>TradeReport</code> class currently: (1) fetches trade data from the database, (2) calculates P&amp;L metrics, (3) formats the report as HTML, (4) emails it to portfolio managers, and (5) logs the operation. When the email API changes, you must modify the same class that handles P&amp;L logic &mdash; risking breaking the financial calculations. When a new report format (PDF) is needed, you modify the same class that handles database queries. This is a maintenance nightmare that violates SRP.</p><p class="learn-p">Meanwhile, a new compliance rule requires adding "wash sale" detection to the P&amp;L calculator. With OCP-violating code, this means modifying the existing, tested calculation function with new if-else branches. Every modification risks introducing bugs in production-critical financial calculations. With OCP, you add a new <code>WashSaleRule</code> class implementing a <code>ComplianceRule</code> interface &mdash; zero changes to existing code.</p><p class="learn-p">SRP and OCP are the first two SOLID principles, and they are the most commonly tested in LLD interviews. Interviewers will present a "God class" and ask you to refactor it, or give you a system with hardcoded if-else chains and ask you to make it extensible.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p"><b>Single Responsibility Principle (SRP):</b> "A class should have only one reason to change." &mdash; Robert C. Martin. Each class should encapsulate one <b>axis of change</b>. If business rules change, only the business-logic class is modified. If the database schema changes, only the repository class is modified.</p><p class="learn-p"><b>Open-Closed Principle (OCP):</b> "Software entities should be open for extension but closed for modification." &mdash; Bertrand Meyer. You should be able to add new behaviour without changing existing, tested code. This is achieved through <b>abstraction</b> and <b>polymorphism</b>.</p><div class="learn-code">  SRP: One Class = One Reason to Change\n  ======================================\n\n  BEFORE (God Class):               AFTER (Separated):\n  +------------------+              +------------------+\n  |   TradeReport    |              |   TradeReport    |\n  |------------------|              |  (P&amp;L logic only) |\n  | + fetchData()    |              +------------------+\n  | + calcPnL()      |              +------------------+\n  | + formatHTML()   |    ====&gt;     |  ReportFormatter |\n  | + sendEmail()    |              |  (format only)   |\n  | + log()          |              +------------------+\n  +------------------+              +------------------+\n  5 reasons to change               |  EmailSender     |\n                                    +------------------+\n                                    +------------------+\n                                    |  TradeRepository |\n                                    +------------------+\n\n  OCP: Extend Without Modifying\n  ==============================\n\n  BEFORE (if-else chain):           AFTER (polymorphism):\n  if (type == "circle")             Shape* s = getShape();\n    area = pi*r*r;                  area = s-&gt;area();\n  else if (type == "rect")          // Adding Triangle:\n    area = w*h;                     // just create new class,\n  // Adding Triangle:               // ZERO changes here\n  // must modify this function!</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p">Key components for applying SRP and OCP:</p><ul class="learn-list"><li><b>SRP Building Blocks:</b><ul class="learn-list"><li><b>Domain Classes</b> &mdash; Hold business data and business rules only (e.g., <code>Invoice</code>, <code>Order</code>).</li><li><b>Repository / DAO Classes</b> &mdash; Handle persistence (database CRUD operations).</li><li><b>Service Classes</b> &mdash; Orchestrate business workflows across domain objects.</li><li><b>Formatter / Presenter Classes</b> &mdash; Handle output formatting (HTML, JSON, PDF).</li><li><b>Notifier Classes</b> &mdash; Handle communication (email, SMS, push notifications).</li><li><b>Logger / Auditor Classes</b> &mdash; Handle cross-cutting concerns.</li></ul></li><li><b>OCP Building Blocks:</b><ul class="learn-list"><li><b>Abstract Base Classes / Interfaces</b> &mdash; Define extension points. Clients depend on these, not concrete classes.</li><li><b>Strategy Pattern</b> &mdash; Encapsulate varying algorithms behind a common interface. Swap at runtime.</li><li><b>Template Method Pattern</b> &mdash; Define an algorithm skeleton in a base class; derived classes fill in the steps.</li><li><b>Plugin Architecture</b> &mdash; Load new functionality without recompiling existing code.</li><li><b>Registry / Factory</b> &mdash; Map identifiers to concrete classes. Adding a new type = registering a new entry.</li></ul></li></ul><div class="learn-code">// SRP: each class has one job\nclass Invoice {\n    double amount;\npublic:\n    Invoice(double a) : amount(a) {}\n    double getAmount() const { return amount; }\n    string format() const { return "Invoice: $" + to_string(amount); }\n};\nclass InvoiceRepository {\npublic:\n    void save(const Invoice&amp; inv, const string&amp; path) { /* file I/O */ }\n};\nclass InvoicePrinter {\npublic:\n    void print(const Invoice&amp; inv) { cout &lt;&lt; inv.format(); }\n};</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Let\'s walk through applying both SRP and OCP to a <b>discount system</b> &mdash; a classic interview scenario.</p><p class="learn-p"><b>Step 1 (Violating both SRP and OCP):</b></p><div class="learn-code">// BAD: This class does everything and uses if-else chains\nclass OrderProcessor {\npublic:\n    double calculateTotal(double price, string discountType) {\n        double discount = 0;\n        if (discountType == "flat")     discount = 10;\n        else if (discountType == "pct") discount = price * 0.1;\n        else if (discountType == "bogo") discount = price * 0.5;\n        // Must modify this function for every new discount!\n        double total = price - discount;\n        // Also saves to DB here (SRP violation)\n        cout &lt;&lt; "Saved to DB" &lt;&lt; endl;\n        // Also sends email (SRP violation)\n        cout &lt;&lt; "Email sent" &lt;&lt; endl;\n        return total;\n    }\n};</div><p class="learn-p"><b>Step 2 (Apply SRP):</b> Separate concerns into distinct classes.</p><div class="learn-code">class DiscountCalculator { double apply(double price); };\nclass OrderRepository    { void save(const Order&amp; o); };\nclass NotificationService { void notify(const Order&amp; o); };\nclass OrderService {\n    DiscountCalculator&amp; calc;\n    OrderRepository&amp; repo;\n    NotificationService&amp; notifier;\npublic:\n    void processOrder(Order&amp; o) {\n        o.total = calc.apply(o.price);\n        repo.save(o);\n        notifier.notify(o);\n    }\n};</div><p class="learn-p"><b>Step 3 (Apply OCP):</b> Make the discount calculator extensible without modification.</p><div class="learn-code">class DiscountStrategy {\npublic:\n    virtual double apply(double price) const = 0;\n    virtual string name() const = 0;\n    virtual ~DiscountStrategy() = default;\n};\nclass NoDiscount : public DiscountStrategy {\npublic:\n    double apply(double price) const override { return price; }\n    string name() const override { return "No Discount"; }\n};\nclass FlatDiscount : public DiscountStrategy {\n    double amount;\npublic:\n    FlatDiscount(double a) : amount(a) {}\n    double apply(double price) const override {\n        return max(0.0, price - amount);\n    }\n    string name() const override { return "Flat $" + to_string(amount); }\n};\nclass PercentDiscount : public DiscountStrategy {\n    double pct;\npublic:\n    PercentDiscount(double p) : pct(p) {}\n    double apply(double price) const override {\n        return price * (1.0 - pct / 100.0);\n    }\n    string name() const override { return to_string(pct) + "% off"; }\n};\n\n// Billing NEVER changes when new discounts are added\nclass Billing {\npublic:\n    double checkout(double price, const DiscountStrategy&amp; disc) {\n        return disc.apply(price);  // OCP: closed for modification\n    }\n};</div><p class="learn-p">Now adding a <code>BuyOneGetOneFree</code> discount requires creating one new class &mdash; zero changes to <code>Billing</code>, <code>OrderService</code>, or any existing discount class.</p></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><p class="learn-p"><b>OCP via Template Method:</b> Define the algorithm skeleton in a base class; subclasses override specific steps.</p><div class="learn-code">class DataExporter {\npublic:\n    void exportData() {       // template method — fixed skeleton\n        auto data = fetch();  // step 1: fetch (override)\n        auto formatted = format(data);  // step 2: format (override)\n        write(formatted);     // step 3: write (override)\n    }\nprotected:\n    virtual string fetch() = 0;\n    virtual string format(const string&amp; data) = 0;\n    virtual void write(const string&amp; output) = 0;\n};\nclass CSVExporter : public DataExporter {\n    string fetch() override { return "raw data"; }\n    string format(const string&amp; data) override { return "csv:" + data; }\n    void write(const string&amp; output) override { /* write CSV file */ }\n};</div><p class="learn-p"><b>OCP via Registry/Factory:</b> New types register themselves; the factory never changes.</p><div class="learn-code">class ShapeFactory {\n    static map&lt;string, function&lt;unique_ptr&lt;Shape&gt;()&gt;&gt; registry;\npublic:\n    static void reg(string name, function&lt;unique_ptr&lt;Shape&gt;()&gt; creator) {\n        registry[name] = creator;\n    }\n    static unique_ptr&lt;Shape&gt; create(const string&amp; name) {\n        return registry[name]();\n    }\n};\n// Registration — no changes to factory code\nShapeFactory::reg("circle", []{ return make_unique&lt;Circle&gt;(1); });\nShapeFactory::reg("rect",   []{ return make_unique&lt;Rectangle&gt;(1,1); });</div><p class="learn-p"><b>SRP Variation &mdash; Facade:</b> When you split a God class into many small classes, you may expose too many classes to clients. A <b>Facade</b> provides a simple interface that orchestrates the underlying SRP-conformant classes, hiding complexity without violating SRP.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Pitfall 1: "One class = one method" misunderstanding.</b> SRP says one <b>reason to change</b>, not one method. A <code>UserValidator</code> may have <code>validateEmail()</code>, <code>validateAge()</code>, <code>validatePassword()</code> &mdash; all are one responsibility: validating user data.</div><div class="learn-warn"><b>Pitfall 2: Over-engineering SRP.</b> Splitting every single function into its own class creates a "ravioli" codebase &mdash; too many tiny classes with no cohesion. Use the "reasons to change" test: would these methods change for different reasons? If not, they belong together.</div><div class="learn-warn"><b>Pitfall 3: OCP does not mean "never modify code."</b> OCP means design your <b>hot extension points</b> so they don\'t require modification. Bug fixes, refactoring, and changes to stable core logic are fine. Predict the axes of change and abstract those.</div><div class="learn-warn"><b>Pitfall 4: Premature abstraction.</b> Don\'t apply OCP everywhere on day one. Wait for the <b>first</b> actual change, then refactor to make that axis extensible. "Three strikes and you refactor" &mdash; the first time, just do it; the second time, wince but do it; the third time, refactor.</div><div class="learn-tip"><b>Interview Trap:</b> "Does a logger in every class violate SRP?" &mdash; No. Logging is a <b>cross-cutting concern</b>, not a responsibility. Each class still has one responsibility; it just also logs. However, if logging logic is complex, extract it into a separate logging service and inject it (which also satisfies DIP).</div></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Aspect</th><th>SRP</th><th>OCP</th></tr><tr><td>Core Question</td><td>Does this class have one reason to change?</td><td>Can I add behaviour without modifying existing code?</td></tr><tr><td>Violation Smell</td><td>God class, "and" in class description</td><td>Long if-else / switch chains, frequent modifications</td></tr><tr><td>Solution Technique</td><td>Extract class, separate concerns into layers</td><td>Polymorphism, Strategy, Template Method, Factory</td></tr><tr><td>Risk if Ignored</td><td>Ripple effects: unrelated changes break each other</td><td>Regression bugs: every extension touches tested code</td></tr><tr><td>Risk if Over-Applied</td><td>Ravioli code: too many tiny classes</td><td>Premature abstraction: needless indirection</td></tr><tr><td>Related Patterns</td><td>Facade, Repository, Service Layer</td><td>Strategy, Template Method, Factory, Observer</td></tr></table><table class="learn-table"><tr><th>OCP Implementation</th><th>Mechanism</th><th>Best For</th><th>Trade-off</th></tr><tr><td>Strategy Pattern</td><td>Composition + interface</td><td>Varying algorithms</td><td>Extra classes per strategy</td></tr><tr><td>Template Method</td><td>Inheritance + hooks</td><td>Fixed algorithm skeleton with varying steps</td><td>Tight coupling to base</td></tr><tr><td>Factory + Registry</td><td>Map of creators</td><td>Dynamic type creation</td><td>Runtime lookup overhead</td></tr><tr><td>Observer/Event</td><td>Publish-subscribe</td><td>Reacting to changes</td><td>Debugging event chains</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What does "one reason to change" actually mean?</b><br>A: It means one <b>stakeholder</b> or <b>axis of change</b>. If the CFO wants a different P&amp;L formula and the CTO wants a different database, those are two reasons to change &mdash; so P&amp;L logic and persistence should be in separate classes. A reason to change = a different person or role that might request a modification.</p><p class="learn-p"><b>Q2: Identify the SRP violation: class UserService { void register(); void sendEmail(); void logActivity(); }</b><br>A: Three responsibilities: user management, email communication, activity logging. Refactor into <code>UserService</code> (registration logic), <code>EmailService</code> (sending emails), and <code>ActivityLogger</code> (logging). <code>UserService</code> depends on the other two via interfaces (also satisfying DIP).</p><p class="learn-p"><b>Q3: How do you decide WHERE to apply OCP?</b><br>A: Identify the <b>axes of change</b> &mdash; what is most likely to change or be extended? Apply OCP there. For a payment system, the discount type is likely to change (new promotions), so abstract it. The checkout flow is stable, so hardcoding it is fine. Don\'t abstract everything; abstract the volatile parts.</p><p class="learn-p"><b>Q4: Can OCP and SRP conflict?</b><br>A: Rarely, but yes. Applying OCP may introduce new classes and interfaces that increase complexity. Meanwhile, SRP might split things so finely that applying OCP to each tiny class adds unnecessary abstraction. The balance is: SRP first (get clean separation of concerns), then OCP on the axes that actually change.</p><p class="learn-p"><b>Q5: Refactor this OCP violation: double calculateTax(string country, double amount) with if-else for each country.</b><br>A: Create a <code>TaxStrategy</code> interface with <code>double calculate(double amount)</code>. Implement <code>USTax</code>, <code>UKTax</code>, <code>IndiaTax</code>, etc. Use a factory or registry to map country codes to strategies. The <code>calculateTax</code> function becomes: <code>return taxRegistry.get(country).calculate(amount);</code> &mdash; never needs modification.</p><p class="learn-p"><b>Q6: What is the "God Class" anti-pattern and how does SRP fix it?</b><br>A: A God Class is a class that knows too much and does too much &mdash; it has dozens of methods spanning multiple responsibilities. Fix: identify distinct responsibilities (data access, business logic, formatting, notification), extract each into its own class, and have the original class delegate to them. The original class either becomes a thin orchestrator or is eliminated entirely.</p><p class="learn-p"><b>Q7: How does the Observer pattern achieve OCP?</b><br>A: The subject (e.g., <code>OrderService</code>) fires events without knowing who is listening. New observers (email notifier, audit logger, analytics tracker) can subscribe without modifying the subject. The subject is closed for modification; new behaviours are added by registering new observers (extension).</p></div>',
    code: `// ===== SRP & OCP — C++ Implementation =====
#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <fstream>
#include <map>
#include <functional>
using namespace std;

// =================== SRP ===================
// BAD: Invoice does formatting AND persistence AND printing
class BadInvoice {
    double amount;
public:
    BadInvoice(double a) : amount(a) {}
    string format()    { return "Invoice: $" + to_string(amount); }
    void saveToFile()  { ofstream("invoice.txt") << format(); }
    void printInvoice(){ cout << format() << endl; }
    // 3 reasons to change: format logic, file I/O, print logic
};

// GOOD: Responsibilities separated — each class has ONE reason to change
class Invoice {
    double amount;
public:
    Invoice(double a) : amount(a) {}
    double getAmount() const { return amount; }
    string format() const {
        return "Invoice: $" + to_string(amount);
    }
};

class InvoicePersistence {
public:
    void saveToFile(const Invoice& inv, const string& path) {
        ofstream(path) << inv.format();
    }
};

class InvoicePrinter {
public:
    void print(const Invoice& inv) {
        cout << inv.format() << endl;
    }
};

// =================== OCP ===================
// Strategy pattern: open for extension, closed for modification

class DiscountStrategy {
public:
    virtual double apply(double price) const = 0;
    virtual string name() const = 0;
    virtual ~DiscountStrategy() = default;
};

class NoDiscount : public DiscountStrategy {
public:
    double apply(double price) const override { return price; }
    string name() const override { return "No Discount"; }
};

class FlatDiscount : public DiscountStrategy {
    double amount;
public:
    FlatDiscount(double a) : amount(a) {}
    double apply(double price) const override {
        return max(0.0, price - amount);
    }
    string name() const override {
        return "Flat $" + to_string(amount) + " off";
    }
};

class PercentDiscount : public DiscountStrategy {
    double pct;
public:
    PercentDiscount(double p) : pct(p) {}
    double apply(double price) const override {
        return price * (1.0 - pct / 100.0);
    }
    string name() const override {
        return to_string(pct) + "% off";
    }
};

// NEW: Adding a discount — ZERO changes to existing classes
class BuyOneGetOneFree : public DiscountStrategy {
public:
    double apply(double price) const override {
        return price * 0.5;  // 50% off
    }
    string name() const override { return "Buy 1 Get 1 Free"; }
};

class TieredDiscount : public DiscountStrategy {
    vector<pair<double, double>> tiers; // {threshold, pct}
public:
    TieredDiscount(vector<pair<double,double>> t) : tiers(move(t)) {}
    double apply(double price) const override {
        double pct = 0;
        for (auto& [threshold, discount] : tiers)
            if (price >= threshold) pct = discount;
        return price * (1.0 - pct / 100.0);
    }
    string name() const override { return "Tiered Discount"; }
};

// Billing — NEVER needs modification for new discounts (OCP)
class Billing {
public:
    double checkout(double price, const DiscountStrategy& disc) {
        double final_price = disc.apply(price);
        cout << disc.name() << ": $" << price
             << " -> $" << final_price << endl;
        return final_price;
    }
};

// =================== OCP via Registry ===================
class Shape {
public:
    virtual double area() const = 0;
    virtual string name() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
    string name() const override { return "Circle"; }
};

class Rect : public Shape {
    double w, h;
public:
    Rect(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    string name() const override { return "Rectangle"; }
};

// Factory registry — adding new shapes = registering, not modifying
class ShapeFactory {
    map<string, function<unique_ptr<Shape>()>> registry;
public:
    void reg(const string& name, function<unique_ptr<Shape>()> creator) {
        registry[name] = creator;
    }
    unique_ptr<Shape> create(const string& name) {
        if (registry.count(name)) return registry[name]();
        return nullptr;
    }
};

int main() {
    // SRP demo
    Invoice inv(250.0);
    InvoicePrinter().print(inv);
    InvoicePersistence().saveToFile(inv, "/tmp/invoice.txt");

    // OCP demo — add new discounts without changing Billing
    Billing billing;
    billing.checkout(100, NoDiscount());
    billing.checkout(100, FlatDiscount(15));
    billing.checkout(100, PercentDiscount(20));
    billing.checkout(100, BuyOneGetOneFree());
    billing.checkout(500, TieredDiscount({{100, 5}, {200, 10}, {500, 15}}));

    // Registry demo
    ShapeFactory factory;
    factory.reg("circle", []{ return make_unique<Circle>(5); });
    factory.reg("rect",   []{ return make_unique<Rect>(3, 4); });
    auto s = factory.create("circle");
    if (s) cout << s->name() << " area: " << s->area() << endl;

    return 0;
}`,
    problems: [
      ["Design an Ordered Stream","https://leetcode.com/problems/design-an-ordered-stream/","Easy"],
      ["Design a Food Rating System","https://leetcode.com/problems/design-a-food-rating-system/","Medium"],
      ["Online Stock Span","https://leetcode.com/problems/online-stock-span/","Medium"],
      ["Design a Text Editor","https://leetcode.com/problems/design-a-text-editor/","Hard"],
      ["All O'one Data Structure","https://leetcode.com/problems/all-oone-data-structure/","Hard"],
    ],
    mcqs: [
      {"q":"SRP states that a class should have:","o":["Only one method","Only one member variable","Only one reason to change","Only one constructor"],"a":2},
      {"q":"Which design pattern is a direct application of the Open-Closed Principle?","o":["Singleton","Strategy","Builder","Prototype"],"a":1},
      {"q":"In OCP, 'closed for modification' means:","o":["The source file is read-only","Existing tested code need not be changed to add new behaviour","The class cannot be inherited","Private members cannot be changed"],"a":1},
      {"q":"A class that generates reports AND saves them to disk violates:","o":["OCP","LSP","SRP","ISP"],"a":2},
      {"q":"Which is the best technique to satisfy OCP for varying algorithms?","o":["Adding more if-else branches","Using the Strategy pattern with polymorphism","Making all methods static","Using global variables"],"a":1},
      {"q":"'Three strikes and you refactor' relates to:","o":["Avoiding premature abstraction — refactor after seeing repeated change","Always refactoring after three commits","Deleting code after three bugs","Testing three times before deploying"],"a":0},
      {"q":"A Facade pattern helps with SRP by:","o":["Combining all classes into one","Providing a simple interface that orchestrates SRP-conformant classes","Eliminating all interfaces","Making all methods private"],"a":1},
      {"q":"The Observer pattern achieves OCP because:","o":["It uses the Singleton pattern","New observers can subscribe without modifying the subject","It prevents inheritance","It eliminates all coupling"],"a":1}
    ],
  },
  {
    t: "LSP, ISP & DIP",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Imagine you\'re designing a <b>portfolio analytics platform</b>. A base class <code>FinancialInstrument</code> has methods <code>getPrice()</code>, <code>calculateYield()</code>, and <code>calculateDividend()</code>. A new developer adds <code>CryptoCurrency</code> as a subclass. But cryptocurrencies don\'t have dividends, so <code>calculateDividend()</code> throws an exception. Client code that iterates over all instruments and calls <code>calculateDividend()</code> now crashes unpredictably &mdash; this is an <b>LSP violation</b>.</p><p class="learn-p">Meanwhile, the <code>ITrader</code> interface requires implementing <code>executeEquityTrade()</code>, <code>executeFXTrade()</code>, <code>executeDerivativeTrade()</code>, and <code>executeCryptoTrade()</code>. An equity-only desk must implement methods it will never use &mdash; this is an <b>ISP violation</b>.</p><p class="learn-p">Finally, the <code>RiskEngine</code> directly instantiates <code>MySQLRiskRepository</code> for persistence. When the team needs to switch to a time-series database for better performance, they must modify the core risk calculation code &mdash; this is a <b>DIP violation</b>.</p><p class="learn-p">These three principles (L, I, D of SOLID) are tested together because they\'re deeply interconnected: ISP ensures interfaces are small enough that implementers can satisfy LSP, and DIP ensures high-level modules depend on those clean interfaces. Mastering all three is essential for LLD rounds.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p"><b>Liskov Substitution Principle (LSP):</b> "If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering the correctness of the program." &mdash; Barbara Liskov, 1987. Subtypes must honour the <b>behavioural contract</b> of the base type: same preconditions (or weaker), same postconditions (or stronger), and preserved invariants.</p><p class="learn-p"><b>Interface Segregation Principle (ISP):</b> "Clients should not be forced to depend on interfaces they do not use." &mdash; Robert C. Martin. Prefer many small, focused interfaces over one large "fat" interface. Each interface represents one <b>cohesive capability</b>.</p><p class="learn-p"><b>Dependency Inversion Principle (DIP):</b> "High-level modules should not depend on low-level modules. Both should depend on abstractions." &mdash; Robert C. Martin. The dependency arrow should point toward abstractions, not concrete implementations.</p><div class="learn-code">  LSP: Substitutability Contract\n  ==============================\n  Base:     setWidth(w), setHeight(h) ==&gt; area() == w * h\n  Derived:  Square.setWidth(5), Square.setHeight(10)\n            ==&gt; area() == 100 (not 50!) ==&gt; CONTRACT BROKEN!\n\n  ISP: Small Focused Interfaces\n  ==============================\n  BAD:  IWorker { work(), eat(), sleep() }  -- Robot can\'t eat/sleep!\n  GOOD: IWorkable { work() }\n        IFeedable { eat() }\n        ISleepable { sleep() }\n        Human : IWorkable, IFeedable, ISleepable\n        Robot : IWorkable\n\n  DIP: Depend on Abstractions\n  ==============================\n  BAD:  OrderService ---&gt; MySQLDatabase\n  GOOD: OrderService ---&gt; IDatabase &lt;--- MySQLDatabase\n                                    &lt;--- PostgresDatabase\n        (arrow inverted: both depend on abstraction)</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p">Key components for applying LSP, ISP, and DIP:</p><ul class="learn-list"><li><b>LSP Building Blocks:</b><ul class="learn-list"><li><b>Behavioural Contracts</b> &mdash; Preconditions (what the method requires), postconditions (what it guarantees), and class invariants (what is always true).</li><li><b>Design by Contract</b> &mdash; Derived classes may weaken preconditions (accept more) and strengthen postconditions (guarantee more), but never the reverse.</li><li><b>Immutable Value Objects</b> &mdash; One fix for LSP: if shapes are immutable (no setters), the Rectangle-Square problem disappears.</li></ul></li><li><b>ISP Building Blocks:</b><ul class="learn-list"><li><b>Role Interfaces</b> &mdash; Each interface represents one role a class plays. A <code>Printer</code> class might implement <code>IPrintable</code>, <code>IScannable</code>, and <code>IFaxable</code> as separate interfaces.</li><li><b>Multiple Inheritance of Interfaces</b> &mdash; C++ supports this naturally. Each abstract base class with only pure virtual functions acts as an interface.</li></ul></li><li><b>DIP Building Blocks:</b><ul class="learn-list"><li><b>Dependency Injection (DI)</b> &mdash; The technique to implement DIP. Three forms: constructor injection, setter injection, interface injection. Constructor injection is preferred (dependencies are explicit and immutable).</li><li><b>Inversion of Control (IoC) Container</b> &mdash; A framework that manages object creation and dependency wiring (e.g., Spring in Java). In C++, typically done manually or with lightweight libraries.</li><li><b>Abstract Factory</b> &mdash; Provides an interface for creating families of related objects without specifying concrete classes.</li></ul></li></ul><div class="learn-code">// LSP: Behavioural contract for a collection\nclass ICollection {\npublic:\n    // Precondition: none (accept anything)\n    // Postcondition: size() increases by 1\n    virtual void add(int e) = 0;\n    virtual int size() const = 0;\n    virtual ~ICollection() = default;\n};\n// Derived classes MUST honour: after add(x), size is old_size + 1\n// If a ReadOnlyCollection throws on add(), it violates LSP!</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>LSP &mdash; The Rectangle-Square Problem (step by step):</b></p><p class="learn-p"><b>Step 1: The naive design.</b> "A square IS-A rectangle" in math, so:</p><div class="learn-code">class Rectangle {\nprotected:\n    int width, height;\npublic:\n    virtual void setWidth(int w)  { width = w; }\n    virtual void setHeight(int h) { height = h; }\n    int area() const { return width * height; }\n};\nclass Square : public Rectangle {\npublic:\n    void setWidth(int w) override  { width = w; height = w; }\n    void setHeight(int h) override { width = h; height = h; }\n};</div><p class="learn-p"><b>Step 2: The violation.</b> Client code expects independent width and height:</p><div class="learn-code">void resize(Rectangle&amp; r) {\n    r.setWidth(5);\n    r.setHeight(10);\n    assert(r.area() == 50);  // FAILS for Square! area == 100\n}</div><p class="learn-p"><b>Step 3: The fix.</b> Make them siblings under a common Shape interface:</p><div class="learn-code">class Shape {\npublic:\n    virtual double area() const = 0;\n    virtual ~Shape() = default;\n};\nclass GoodRectangle : public Shape {\n    double w, h;\npublic:\n    GoodRectangle(double w, double h) : w(w), h(h) {}\n    double area() const override { return w * h; }\n};\nclass GoodSquare : public Shape {\n    double side;\npublic:\n    GoodSquare(double s) : side(s) {}\n    double area() const override { return side * side; }\n};</div><p class="learn-p"><b>ISP &mdash; Splitting a fat interface:</b></p><div class="learn-code">// BAD: Fat interface forces Robot to implement eat()\nclass IWorker {\npublic:\n    virtual void work() = 0;\n    virtual void eat() = 0;\n    virtual ~IWorker() = default;\n};\nclass Robot : public IWorker {\n    void work() override { /* OK */ }\n    void eat() override { /* Can\'t eat! Throw? No-op? Both are bad. */ }\n};\n\n// GOOD: Segregated interfaces\nclass IWorkable  { public: virtual void work() = 0; virtual ~IWorkable() = default; };\nclass IFeedable  { public: virtual void eat() = 0;  virtual ~IFeedable() = default; };\nclass Human : public IWorkable, public IFeedable {\n    void work() override { /* ... */ }\n    void eat()  override { /* ... */ }\n};\nclass Robot : public IWorkable {\n    void work() override { /* works 24/7 */ }\n};</div><p class="learn-p"><b>DIP &mdash; Inverting the dependency:</b></p><div class="learn-code">// BAD: High-level depends on low-level\nclass OrderService {\n    MySQLDatabase db;  // concrete dependency!\npublic:\n    void placeOrder(string data) { db.insert(data); }\n};\n\n// GOOD: Both depend on abstraction\nclass IDatabase {\npublic:\n    virtual void insert(string data) = 0;\n    virtual ~IDatabase() = default;\n};\nclass MySQLDatabase : public IDatabase {\n    void insert(string data) override { /* MySQL */ }\n};\nclass OrderService {\n    IDatabase&amp; db;  // depends on abstraction!\npublic:\n    OrderService(IDatabase&amp; db) : db(db) {}  // constructor injection\n    void placeOrder(string data) { db.insert(data); }\n};</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><p class="learn-p"><b>LSP Variations:</b></p><ul class="learn-list"><li><b>Covariant return types</b> &mdash; C++ allows a derived class\'s overriding function to return a more specific type (e.g., <code>Derived*</code> instead of <code>Base*</code>). This is LSP-safe because the returned type is still substitutable.</li><li><b>Exception specifications</b> &mdash; A derived class should not throw exceptions that the base class doesn\'t declare. Throwing <code>UnsupportedOperationException</code> in an overridden method is an LSP violation.</li><li><b>History Constraint</b> &mdash; A subtype should not allow state transitions that the base type doesn\'t allow. If <code>ImmutablePoint</code> extends <code>Point</code>, but <code>Point</code> has setters, code holding a <code>Point&amp;</code> might try to mutate it &mdash; violating the immutability invariant.</li></ul><p class="learn-p"><b>ISP Variations:</b></p><ul class="learn-list"><li><b>Header Interfaces</b> &mdash; Extract a subset of a class\'s methods into an interface. Clients depend on the subset they need.</li><li><b>Adapter Pattern</b> &mdash; When you can\'t change a fat interface, create an adapter that implements a slim interface and delegates to the fat one.</li></ul><p class="learn-p"><b>DIP Variations:</b></p><ul class="learn-list"><li><b>Constructor Injection</b> (preferred) &mdash; Dependencies passed via constructor. Explicit, immutable, easy to test.</li><li><b>Setter Injection</b> &mdash; Dependencies set via setter methods. Allows changing at runtime but risks partially-constructed objects.</li><li><b>Service Locator</b> &mdash; A registry that provides dependencies on request. Hides dependencies (harder to test); avoid in new code.</li><li><b>Abstract Factory</b> &mdash; Creates families of related objects. The factory interface depends on abstractions; concrete factories create concrete objects.</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Pitfall 1: "IS-A in the real world = IS-A in code."</b> A square IS-A rectangle mathematically, but <code>Square</code> should NOT inherit from <code>Rectangle</code> if their behavioural contracts differ. OOP inheritance is about <b>behavioural substitutability</b>, not set theory.</div><div class="learn-warn"><b>Pitfall 2: Empty method stubs or UnsupportedOperationException.</b> If an implementing class has methods that do nothing or throw, it\'s either an ISP violation (fat interface) or an LSP violation (subtype breaks contract). Both signal a design problem.</div><div class="learn-warn"><b>Pitfall 3: Confusing DIP with Dependency Injection.</b> DIP is the <b>principle</b> (depend on abstractions). Dependency Injection is a <b>technique</b> to implement it. You can satisfy DIP without a DI framework by manually passing interfaces via constructors.</div><div class="learn-warn"><b>Pitfall 4: Over-segregating interfaces.</b> Creating an interface for every single method leads to interface explosion. Each interface should represent a <b>cohesive role</b>, not a single method. Group related methods that change together.</div><div class="learn-warn"><b>Pitfall 5: Depending on abstractions that are too abstract.</b> An <code>IAnything</code> interface with <code>doSomething()</code> is useless. Abstractions should be meaningful and represent a clear contract. The interface should be <b>owned by the high-level module</b> (not the low-level one).</div><div class="learn-tip"><b>Interview Trap:</b> "Does using an interface always satisfy DIP?" &mdash; No. If the interface is defined in the low-level module\'s package and merely mirrors its methods, the dependency arrow still flows downward. For true DIP, the <b>high-level module defines the interface</b> it needs, and the low-level module conforms to it. The abstraction is owned by the policy layer.</div></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Principle</th><th>Key Question</th><th>Violation Smell</th><th>Fix Strategy</th></tr><tr><td>LSP</td><td>Can any subtype replace the base type without breaking correctness?</td><td><code>instanceof</code> checks, <code>UnsupportedOperationException</code>, unexpected behaviour</td><td>Redesign hierarchy, use composition, make objects immutable</td></tr><tr><td>ISP</td><td>Are interfaces cohesive and minimal?</td><td>Empty method stubs, classes implementing unused methods</td><td>Split into role-based interfaces, use multiple inheritance</td></tr><tr><td>DIP</td><td>Do high-level modules depend on abstractions?</td><td>Direct instantiation of concrete classes in business logic, <code>new ConcreteClass()</code></td><td>Introduce interfaces, use constructor injection, apply factory pattern</td></tr></table><table class="learn-table"><tr><th>SOLID Principle</th><th>Relationship to Others</th></tr><tr><td>SRP</td><td>Enables ISP (one responsibility = one focused interface)</td></tr><tr><td>OCP</td><td>Enabled by DIP (depend on abstractions to extend without modifying)</td></tr><tr><td>LSP</td><td>Constrains inheritance (subtype contracts must hold)</td></tr><tr><td>ISP</td><td>Supports LSP (smaller interfaces are easier to satisfy fully)</td></tr><tr><td>DIP</td><td>Enables OCP (abstractions are extension points)</td></tr></table><table class="learn-table"><tr><th>DI Technique</th><th>Mechanism</th><th>Pros</th><th>Cons</th></tr><tr><td>Constructor Injection</td><td>Pass dependencies via constructor</td><td>Explicit, immutable, easy to test</td><td>Constructor parameter list can grow</td></tr><tr><td>Setter Injection</td><td>Set dependencies via setter methods</td><td>Optional dependencies, runtime swapping</td><td>Risk of partially constructed objects</td></tr><tr><td>Service Locator</td><td>Global registry provides dependencies</td><td>Simple to use</td><td>Hides dependencies, hard to test</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain the Rectangle-Square problem and how to fix it.</b><br>A: <code>Square</code> inheriting from <code>Rectangle</code> violates LSP because <code>Square::setWidth</code> also changes height, breaking the postcondition that width and height are independent. Client code calling <code>setWidth(5); setHeight(10); assert(area()==50)</code> fails. Fix: make Rectangle and Square siblings under a common Shape interface with only <code>area()</code>, no mutating setters that violate invariants. Alternatively, use immutable value objects.</p><p class="learn-p"><b>Q2: How does ISP prevent LSP violations?</b><br>A: If interfaces are small and focused, implementing classes only commit to methods they can meaningfully support. A fat interface forces implementers to provide methods they can\'t fulfil, leading to empty stubs or exceptions (LSP violations). By segregating interfaces, each implementer can fully satisfy the contracts of the interfaces it chooses to implement.</p><p class="learn-p"><b>Q3: What is the difference between DIP and Dependency Injection?</b><br>A: DIP is a design <b>principle</b>: high-level modules should depend on abstractions, not concrete details. Dependency Injection is a <b>technique</b> to achieve DIP: instead of a class creating its own dependencies, they are "injected" from outside (via constructor, setter, or interface). You can satisfy DIP without a DI framework &mdash; just program to interfaces and pass them in constructors.</p><p class="learn-p"><b>Q4: Give an example of DIP in a trading system.</b><br>A: The <code>RiskEngine</code> (high-level) should depend on <code>IMarketDataProvider</code> (abstraction), not on <code>BloombergFeed</code> (concrete). Both <code>BloombergFeed</code> and <code>ReutersFeed</code> implement <code>IMarketDataProvider</code>. The <code>RiskEngine</code> is constructed with an <code>IMarketDataProvider&amp;</code>. Switching data providers requires zero changes to risk calculation code.</p><p class="learn-p"><b>Q5: How do you spot an ISP violation in existing code?</b><br>A: Look for: (1) classes with methods that throw <code>UnsupportedOperationException</code> or have empty bodies; (2) interfaces where most implementers only use a subset of methods; (3) changes to one method in an interface forcing recompilation of clients that don\'t use that method. The fix is to split the interface into smaller, role-based interfaces.</p><p class="learn-p"><b>Q6: Why should the high-level module own the interface in DIP?</b><br>A: If the low-level module defines the interface, the high-level module still depends on the low-level module\'s package. For true inversion, the high-level module defines what interface it needs (e.g., <code>IRepository</code> defined in the domain layer), and the low-level module (e.g., <code>MySQLRepository</code> in the infrastructure layer) conforms to it. This ensures the domain layer has zero dependencies on infrastructure.</p><p class="learn-p"><b>Q7: How do all five SOLID principles work together in a real system?</b><br>A: In an order management system: <b>SRP</b> &mdash; separate OrderService, OrderRepository, NotificationService. <b>OCP</b> &mdash; new order types (LimitOrder, StopOrder) are added without modifying the matching engine. <b>LSP</b> &mdash; all order types can substitute for the base Order in the matching engine without breaking invariants. <b>ISP</b> &mdash; IExecutable, ICancellable, IModifiable are separate interfaces; a MarketOrder implements IExecutable but not IModifiable. <b>DIP</b> &mdash; the matching engine depends on IOrderRepository, not MySQLOrderRepository. Each principle reinforces the others.</p></div>',
    code: `// ===== LSP, ISP & DIP — C++ Implementation =====
#include <iostream>
#include <string>
#include <memory>
#include <vector>
#include <cassert>
using namespace std;

// =================== LSP ===================
// BAD: Square violates LSP when inheriting Rectangle
class Rectangle {
protected:
    int w, h;
public:
    Rectangle(int w, int h) : w(w), h(h) {}
    virtual void setWidth(int nw)  { w = nw; }
    virtual void setHeight(int nh) { h = nh; }
    int area() const { return w * h; }
    virtual ~Rectangle() = default;
};

class BadSquare : public Rectangle {
public:
    BadSquare(int side) : Rectangle(side, side) {}
    void setWidth(int s) override  { w = s; h = s; }  // breaks contract!
    void setHeight(int s) override { w = s; h = s; }
};

// LSP violation demo:
void resizeAndCheck(Rectangle& r) {
    r.setWidth(5);
    r.setHeight(10);
    // Post-condition: area == width * height == 50
    cout << "Area (expect 50): " << r.area() << endl;
    // BadSquare gives 100! LSP violated.
}

// GOOD: Use a common Shape interface — no conflicting setters
class Shape {
public:
    virtual double area() const = 0;
    virtual string name() const = 0;
    virtual ~Shape() = default;
};

class GoodRectangle : public Shape {
    double w, h;
public:
    GoodRectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    string name() const override { return "Rectangle"; }
};

class GoodSquare : public Shape {
    double side;
public:
    GoodSquare(double s) : side(s) {}
    double area() const override { return side * side; }
    string name() const override { return "Square"; }
};

// Both fully satisfy Shape's contract — LSP holds
void printShapes(const vector<unique_ptr<Shape>>& shapes) {
    for (auto& s : shapes)
        cout << s->name() << " area: " << s->area() << endl;
}

// =================== ISP ===================
// BAD: Fat interface
class IBadWorker {
public:
    virtual void work() = 0;
    virtual void eat() = 0;
    virtual void sleep() = 0;
    virtual ~IBadWorker() = default;
};

class BadRobot : public IBadWorker {
public:
    void work() override { cout << "Robot working" << endl; }
    void eat() override { /* CAN'T EAT! Empty stub = ISP violation */ }
    void sleep() override { /* CAN'T SLEEP! */ }
};

// GOOD: Segregated interfaces
class IWorkable {
public:
    virtual void work() = 0;
    virtual ~IWorkable() = default;
};

class IFeedable {
public:
    virtual void eat() = 0;
    virtual ~IFeedable() = default;
};

class ISleepable {
public:
    virtual void sleep() = 0;
    virtual ~ISleepable() = default;
};

class Human : public IWorkable, public IFeedable, public ISleepable {
public:
    void work()  override { cout << "Human working" << endl; }
    void eat()   override { cout << "Human eating" << endl; }
    void sleep() override { cout << "Human sleeping" << endl; }
};

class Robot : public IWorkable {   // Only implements what it can do
public:
    void work() override { cout << "Robot working 24/7" << endl; }
};

// Client code depends only on what it needs (ISP)
void doWork(IWorkable& worker) { worker.work(); }
void feedWorker(IFeedable& worker) { worker.eat(); }

// =================== DIP ===================
// Abstraction — owned by the high-level module (domain layer)
class INotificationService {
public:
    virtual void send(const string& to, const string& msg) = 0;
    virtual ~INotificationService() = default;
};

class IOrderRepository {
public:
    virtual void save(const string& orderData) = 0;
    virtual ~IOrderRepository() = default;
};

// Low-level modules conform to the abstraction
class EmailService : public INotificationService {
public:
    void send(const string& to, const string& msg) override {
        cout << "Email to " << to << ": " << msg << endl;
    }
};

class SMSService : public INotificationService {
public:
    void send(const string& to, const string& msg) override {
        cout << "SMS to " << to << ": " << msg << endl;
    }
};

class SlackService : public INotificationService {
public:
    void send(const string& to, const string& msg) override {
        cout << "Slack to #" << to << ": " << msg << endl;
    }
};

class MySQLRepository : public IOrderRepository {
public:
    void save(const string& data) override {
        cout << "MySQL: saved " << data << endl;
    }
};

class PostgresRepository : public IOrderRepository {
public:
    void save(const string& data) override {
        cout << "Postgres: saved " << data << endl;
    }
};

// High-level module depends on abstractions, NOT concrete services
class OrderProcessor {
    INotificationService& notifier;
    IOrderRepository& repo;
public:
    // Constructor injection — the DI technique
    OrderProcessor(INotificationService& n, IOrderRepository& r)
        : notifier(n), repo(r) {}

    void processOrder(const string& customer, const string& orderData) {
        cout << "Processing order..." << endl;
        repo.save(orderData);
        notifier.send(customer, "Your order is confirmed!");
    }
};

int main() {
    // ---- LSP Demo ----
    cout << "=== LSP Demo ===" << endl;
    Rectangle r(5, 10);
    resizeAndCheck(r);      // 50 — correct

    BadSquare sq(5);
    resizeAndCheck(sq);     // 100 — LSP violated!

    // Good design — both satisfy Shape's contract
    vector<unique_ptr<Shape>> shapes;
    shapes.push_back(make_unique<GoodRectangle>(5, 10));
    shapes.push_back(make_unique<GoodSquare>(7));
    printShapes(shapes);

    // ---- ISP Demo ----
    cout << "\n=== ISP Demo ===" << endl;
    Human h;
    Robot bot;
    doWork(h);          // Human working
    doWork(bot);        // Robot working 24/7
    feedWorker(h);      // Human eating
    // feedWorker(bot); // Won't compile — Robot isn't IFeedable. ISP working!

    // ---- DIP Demo ----
    cout << "\n=== DIP Demo ===" << endl;
    EmailService email;
    MySQLRepository mysqlRepo;
    OrderProcessor op1(email, mysqlRepo);
    op1.processOrder("alice@example.com", "ORD-001");

    // Swap implementations — ZERO changes to OrderProcessor
    SlackService slack;
    PostgresRepository pgRepo;
    OrderProcessor op2(slack, pgRepo);
    op2.processOrder("trading-desk", "ORD-002");

    return 0;
}`,
    problems: [
      ["Design Add and Search Words","https://leetcode.com/problems/design-add-and-search-words-data-structure/","Medium"],
      ["Implement Queue using Stacks","https://leetcode.com/problems/implement-queue-using-stacks/","Easy"],
      ["Design Circular Queue","https://leetcode.com/problems/design-circular-queue/","Medium"],
      ["Min Stack","https://leetcode.com/problems/min-stack/","Medium"],
      ["Design Hit Counter","https://leetcode.com/problems/design-hit-counter/","Medium"],
    ],
    mcqs: [
      {"q":"The Rectangle-Square problem is a classic violation of which SOLID principle?","o":["SRP","OCP","LSP","DIP"],"a":2},
      {"q":"ISP recommends:","o":["One large interface covering all functionality","Many small, cohesive interfaces","No interfaces at all — use concrete classes","At most two interfaces per class"],"a":1},
      {"q":"In DIP, what should high-level modules depend on?","o":["Low-level modules directly","Concrete implementations","Abstractions (interfaces)","Global variables"],"a":2},
      {"q":"An implementing class that throws UnsupportedOperationException in an inherited method likely violates:","o":["SRP only","Both LSP and ISP","OCP only","DIP only"],"a":1},
      {"q":"Which Dependency Injection technique is generally preferred?","o":["Service Locator","Setter Injection","Constructor Injection","Global variables"],"a":2},
      {"q":"For true DIP, who should own/define the interface?","o":["The low-level module","The high-level module (policy layer)","A shared utility library","The database layer"],"a":1},
      {"q":"ISP supports LSP because:","o":["Smaller interfaces are easier to fully satisfy without breaking contracts","ISP eliminates all inheritance","ISP forces single inheritance","ISP prevents abstract classes"],"a":0},
      {"q":"Which pattern is commonly used to implement DIP?","o":["Singleton","Observer","Abstract Factory with Constructor Injection","Flyweight"],"a":2}
    ],
  }
      ]
    },
    {
      id: "patterns", t: "Patterns & Case Studies",
      topics: [
        {
    t: "Singleton & Factory Pattern",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Trading systems rely on a <b>single configuration manager</b> that all modules read from — you cannot have two configs with different risk limits or you risk catastrophic position errors. Similarly, when the system receives a market data event, a <b>factory</b> must instantiate the correct order type (Market, Limit, StopLoss) without the core engine knowing every concrete class. Singleton and Factory are the two most commonly asked <b>creational patterns</b> in LLD interviews. Mastering them — including thread-safety nuances — is non-negotiable.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p"><b>Singleton</b> ensures a class has <b>exactly one instance</b> with a <b>global access point</b>. <b>Factory Method</b> defines an interface for creating objects but lets <b>subclasses decide</b> which class to instantiate. <b>Abstract Factory</b> creates <b>families of related objects</b> without specifying concrete classes.</p><div class="learn-code">┌─────────────────────────── SINGLETON ───────────────────────────┐\n│                                                                 │\n│   Client A ───┐                                                 │\n│                ├──► getInstance() ──► [Single Instance]          │\n│   Client B ───┘         ▲                   │                   │\n│                         │                   ▼                   │\n│                    private ctor        Shared State              │\n│                    deleted copy        (config, logger, pool)    │\n└─────────────────────────────────────────────────────────────────┘\n\n┌─────────────────────────── FACTORY METHOD ──────────────────────┐\n│                                                                 │\n│   Creator (abstract)                                            │\n│     │  └─ createProduct() = 0   ◄── factory method              │\n│     │  └─ someOperation() { p = createProduct(); p-&gt;use(); }   │\n│     │                                                           │\n│     ├── ConcreteCreatorA ──► createProduct() → ProductA         │\n│     └── ConcreteCreatorB ──► createProduct() → ProductB         │\n│                                                                 │\n│   Product (interface)                                           │\n│     ├── ProductA                                                │\n│     └── ProductB                                                │\n└─────────────────────────────────────────────────────────────────┘</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>Singleton components:</b></p><ul class="learn-list"><li><b>Private constructor</b> — prevents external instantiation.</li><li><b>Deleted copy/move</b> — <code>Singleton(const Singleton&amp;) = delete;</code></li><li><b>Static getInstance()</b> — returns the sole instance. Meyers\' Singleton uses a local static variable (C++11 thread-safe).</li><li><b>Thread-safety mechanism</b> — Meyers\' static, <code>std::call_once</code>, or double-checked locking with <code>std::atomic</code>.</li></ul><p class="learn-p"><b>Factory components:</b></p><ul class="learn-list"><li><b>Product interface</b> — abstract base class (<code>IShape</code>, <code>INotification</code>).</li><li><b>Concrete Products</b> — <code>Circle</code>, <code>Square</code>, <code>EmailNotification</code>, etc.</li><li><b>Creator</b> — declares the factory method (<code>virtual unique_ptr&lt;Product&gt; create() = 0</code>).</li><li><b>Concrete Creators</b> — override factory method to return specific products.</li><li><b>Simple Factory</b> (not GoF) — a static method with if-else / map-based creation.</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>Meyers\' Singleton (recommended C++11):</b></p><div class="learn-code">class ConfigManager {\npublic:\n    static ConfigManager&amp; getInstance() {\n        static ConfigManager instance;   // thread-safe in C++11\n        return instance;\n    }\n    string get(const string&amp; key) {\n        lock_guard&lt;mutex&gt; lock(mtx);\n        return config[key];\n    }\n    void set(const string&amp; key, const string&amp; val) {\n        lock_guard&lt;mutex&gt; lock(mtx);\n        config[key] = val;\n    }\n    ConfigManager(const ConfigManager&amp;) = delete;\n    ConfigManager&amp; operator=(const ConfigManager&amp;) = delete;\nprivate:\n    ConfigManager() { /* load from file */ }\n    unordered_map&lt;string, string&gt; config;\n    mutex mtx;\n};</div><p class="learn-p"><b>Factory Method with registration (extensible):</b></p><div class="learn-code">class IOrder {\npublic:\n    virtual void execute() = 0;\n    virtual ~IOrder() = default;\n};\nclass MarketOrder : public IOrder {\npublic:\n    void execute() override { cout &lt;&lt; "Market order executed at best price"; }\n};\nclass LimitOrder : public IOrder {\npublic:\n    void execute() override { cout &lt;&lt; "Limit order placed with price cap"; }\n};\n\nclass OrderFactory {\n    using Creator = function&lt;unique_ptr&lt;IOrder&gt;()&gt;;\n    unordered_map&lt;string, Creator&gt; registry;\npublic:\n    void registerType(const string&amp; name, Creator c) {\n        registry[name] = c;\n    }\n    unique_ptr&lt;IOrder&gt; create(const string&amp; type) {\n        auto it = registry.find(type);\n        if (it == registry.end()) throw invalid_argument("Unknown: " + type);\n        return it-&gt;second();\n    }\n};\n// Usage: factory.registerType("market", [](){ return make_unique&lt;MarketOrder&gt;(); });</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><ul class="learn-list"><li><b>Meyers\' Singleton vs Double-Checked Locking</b> — Meyers\' is simpler and guaranteed thread-safe in C++11. DCL requires <code>std::atomic</code> to prevent reordering. Prefer Meyers\'.</li><li><b>Simple Factory vs Factory Method vs Abstract Factory</b> — Simple Factory centralizes creation in one static method; Factory Method defers to subclasses; Abstract Factory produces families of related objects.</li><li><b>Registry-based Factory</b> — Use a <code>map&lt;string, Creator&gt;</code> so new types can be registered without modifying factory code. Follows OCP.</li><li><b>Abstract Factory</b> — creates families of related objects without specifying concrete classes:</li></ul><div class="learn-code">// Abstract Factory: UI toolkit for different platforms\nclass IButton { public: virtual void render() = 0; virtual ~IButton() = default; };\nclass ITextBox { public: virtual void render() = 0; virtual ~ITextBox() = default; };\n\nclass WinButton : public IButton { void render() override { cout &lt;&lt; "[Win Button]"; } };\nclass WinTextBox : public ITextBox { void render() override { cout &lt;&lt; "[Win TextBox]"; } };\nclass MacButton : public IButton { void render() override { cout &lt;&lt; "[Mac Button]"; } };\nclass MacTextBox : public ITextBox { void render() override { cout &lt;&lt; "[Mac TextBox]"; } };\n\nclass IUIFactory {\npublic:\n    virtual unique_ptr&lt;IButton&gt; createButton() = 0;\n    virtual unique_ptr&lt;ITextBox&gt; createTextBox() = 0;\n    virtual ~IUIFactory() = default;\n};\nclass WinFactory : public IUIFactory {\n    unique_ptr&lt;IButton&gt; createButton() override { return make_unique&lt;WinButton&gt;(); }\n    unique_ptr&lt;ITextBox&gt; createTextBox() override { return make_unique&lt;WinTextBox&gt;(); }\n};\nclass MacFactory : public IUIFactory {\n    unique_ptr&lt;IButton&gt; createButton() override { return make_unique&lt;MacButton&gt;(); }\n    unique_ptr&lt;ITextBox&gt; createTextBox() override { return make_unique&lt;MacTextBox&gt;(); }\n};\n// Client code works with IUIFactory* — adding LinuxFactory requires ZERO changes</div><ul class="learn-list"><li><b>Dependency Injection as alternative to Singleton</b> — Instead of global access, pass dependencies via constructors. More testable but more boilerplate.</li><li><b>Enum Singleton (Java)</b> — In Java, <code>enum Singleton { INSTANCE; }</code> is the recommended approach (serialization-safe, thread-safe).</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Singleton pitfalls:</b><br/>1. <b>Hidden global state</b> — makes unit testing extremely difficult; mock frameworks struggle with singletons.<br/>2. <b>Destruction order</b> — if Singleton A depends on Singleton B, destruction order is undefined in C++. Use the Schwarz Counter idiom or avoid cross-singleton dependencies.<br/>3. <b>DCL without atomic</b> — without <code>std::atomic</code>, the compiler/CPU may reorder the write to the pointer before the constructor finishes, exposing a partially constructed object to another thread.<br/>4. <b>Serialization</b> — in Java, deserializing a Singleton creates a new instance unless you override <code>readResolve()</code>.<br/>5. <b>Subclassing</b> — Singleton with private constructor cannot be subclassed. If needed, use a protected constructor and a registry approach.</div><div class="learn-warn"><b>Factory pitfalls:</b><br/>1. <b>String-based creation</b> — typos in type strings cause runtime errors. Consider using enums or template parameters.<br/>2. <b>Forgetting to register</b> — with registry-based factory, forgetting to register a new type causes silent failures.<br/>3. <b>Returning raw pointers</b> — always return <code>unique_ptr</code> from factories to clarify ownership.</div></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Aspect</th><th>Singleton</th><th>Simple Factory</th><th>Factory Method</th><th>Abstract Factory</th></tr><tr><td>Intent</td><td>One instance only</td><td>Centralize creation</td><td>Defer to subclasses</td><td>Families of objects</td></tr><tr><td>Participants</td><td>1 class</td><td>1 factory class</td><td>Creator + ConcreteCreators</td><td>AbstractFactory + ConcreteFactories</td></tr><tr><td>OCP</td><td>N/A</td><td>Violates (modify factory for new types)</td><td>Follows (new subclass)</td><td>Follows (new factory)</td></tr><tr><td>Use when</td><td>Exactly 1 instance needed</td><td>Simple creation logic</td><td>Subclasses decide type</td><td>Related object families</td></tr><tr><td>Thread-safety</td><td>Critical concern</td><td>Usually stateless (safe)</td><td>Inherited from Singleton if creator is one</td><td>Same as Factory Method</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you make Singleton thread-safe in C++?</b><br>A: Use Meyers\' Singleton (local static). C++11 guarantees thread-safe initialization of function-local statics ([stmt.dcl] para 4). Alternatively, use <code>std::call_once</code> with <code>std::once_flag</code>.</p><p class="learn-p"><b>Q2: What is the problem with double-checked locking?</b><br>A: Without <code>std::atomic</code>, the pointer assignment can be reordered before the constructor completes, allowing another thread to see a partially constructed object.</p><p class="learn-p"><b>Q3: How does Factory Method follow Open-Closed Principle?</b><br>A: Adding a new product only requires a new ConcreteCreator subclass — existing code is not modified.</p><p class="learn-p"><b>Q4: When would you use Abstract Factory over Factory Method?</b><br>A: When you need to create families of related objects (e.g., WindowsButton + WindowsTextBox vs MacButton + MacTextBox) that must be used together consistently.</p><p class="learn-p"><b>Q5: How would you test code that uses a Singleton?</b><br>A: Prefer Dependency Injection — pass the dependency as a constructor parameter or use an interface. If stuck with Singleton, provide a <code>resetForTesting()</code> method (not ideal but pragmatic).</p><p class="learn-p"><b>Q6: Can you use Factory with Singleton together?</b><br>A: Yes, commonly the Factory itself is a Singleton (one factory instance), and it creates multiple product instances. Example: <code>ConnectionPoolFactory::getInstance().createPool("mysql")</code>.</p><p class="learn-p"><b>Q7: What is the Prototype pattern and how does it relate?</b><br>A: Prototype creates new objects by cloning an existing instance (<code>clone()</code> method). It is an alternative creational pattern used when object construction is expensive but copying is cheap.</p></div>',
    code: `// ===== Singleton & Factory Pattern — Enhanced C++ Implementation =====
#include <iostream>
#include <string>
#include <memory>
#include <unordered_map>
#include <functional>
#include <mutex>
using namespace std;

// =================== MEYERS' SINGLETON ===================
class Logger {
public:
    static Logger& getInstance() {
        static Logger instance;   // C++11 thread-safe
        return instance;
    }
    void log(const string& msg) {
        lock_guard<mutex> lock(mtx);
        cout << "[LOG " << (++count) << "] " << msg << endl;
    }
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;
private:
    Logger() : count(0) { cout << "Logger created (once)" << endl; }
    int count;
    mutex mtx;
};

// =================== SIMPLE FACTORY ===================
class Notification {
public:
    virtual void send(const string& msg) = 0;
    virtual ~Notification() = default;
};
class EmailNotification : public Notification {
public:
    void send(const string& msg) override {
        cout << "Email: " << msg << endl;
    }
};
class SMSNotification : public Notification {
public:
    void send(const string& msg) override {
        cout << "SMS: " << msg << endl;
    }
};
class PushNotification : public Notification {
public:
    void send(const string& msg) override {
        cout << "Push: " << msg << endl;
    }
};
class NotificationFactory {
public:
    static unique_ptr<Notification> create(const string& type) {
        if (type == "email") return make_unique<EmailNotification>();
        if (type == "sms")   return make_unique<SMSNotification>();
        if (type == "push")  return make_unique<PushNotification>();
        throw invalid_argument("Unknown type: " + type);
    }
};

// =================== FACTORY METHOD ===================
class Transport {
public:
    virtual void deliver(const string& pkg) = 0;
    virtual ~Transport() = default;
};
class Truck : public Transport {
public:
    void deliver(const string& pkg) override {
        cout << "Truck delivers: " << pkg << endl;
    }
};
class Ship : public Transport {
public:
    void deliver(const string& pkg) override {
        cout << "Ship delivers: " << pkg << endl;
    }
};
class Logistics {
public:
    virtual unique_ptr<Transport> createTransport() = 0;  // factory method
    void planDelivery(const string& pkg) {
        auto t = createTransport();
        t->deliver(pkg);
    }
    virtual ~Logistics() = default;
};
class RoadLogistics : public Logistics {
public:
    unique_ptr<Transport> createTransport() override {
        return make_unique<Truck>();
    }
};
class SeaLogistics : public Logistics {
public:
    unique_ptr<Transport> createTransport() override {
        return make_unique<Ship>();
    }
};

// =================== REGISTRY-BASED FACTORY ===================
class IOrder {
public:
    virtual void execute() = 0;
    virtual ~IOrder() = default;
};
class MarketOrder : public IOrder {
public:
    void execute() override { cout << "Market order at best price" << endl; }
};
class LimitOrder : public IOrder {
public:
    void execute() override { cout << "Limit order with price cap" << endl; }
};
class OrderFactory {
    using Creator = function<unique_ptr<IOrder>()>;
    unordered_map<string, Creator> registry;
public:
    void registerType(const string& name, Creator c) {
        registry[name] = c;
    }
    unique_ptr<IOrder> create(const string& type) {
        auto it = registry.find(type);
        if (it == registry.end()) throw invalid_argument("Unknown: " + type);
        return it->second();
    }
};

int main() {
    // Singleton
    Logger::getInstance().log("App started");
    Logger::getInstance().log("Processing trade");

    // Simple Factory
    auto n = NotificationFactory::create("email");
    n->send("Trade confirmed");

    // Factory Method
    unique_ptr<Logistics> logistics = make_unique<RoadLogistics>();
    logistics->planDelivery("Electronics");
    logistics = make_unique<SeaLogistics>();
    logistics->planDelivery("Furniture");

    // Registry Factory
    OrderFactory factory;
    factory.registerType("market", [](){ return make_unique<MarketOrder>(); });
    factory.registerType("limit",  [](){ return make_unique<LimitOrder>(); });
    auto order = factory.create("market");
    order->execute();
    return 0;
}`,
    problems: [
      ["Design Bitset","https://leetcode.com/problems/design-bitset/","Medium"],
      ["Implement Trie (Prefix Tree)","https://leetcode.com/problems/implement-trie-prefix-tree/","Medium"],
      ["Design a File System","https://leetcode.com/problems/design-file-system/","Medium"],
      ["Implement Magic Dictionary","https://leetcode.com/problems/implement-magic-dictionary/","Medium"]
    ],
    mcqs: [
      {"q":"In C++11, the recommended thread-safe Singleton implementation uses:","o":["Double-checked locking with mutex","Meyers' Singleton (local static variable)","Global static instance with eager init","std::call_once with std::once_flag"],"a":1},
      {"q":"The Factory Method pattern defers object creation to:","o":["The client code","A static method in the base class","Subclasses that override the factory method","A configuration file"],"a":2},
      {"q":"Which is a valid criticism of the Singleton pattern?","o":["It uses too much memory","It makes unit testing harder due to hidden global state","It is too complex to implement correctly","It cannot work in multi-threaded programs"],"a":1},
      {"q":"A Registry-based Factory improves upon Simple Factory by:","o":["Being faster at runtime","Allowing new types to be added without modifying the factory class","Using less memory","Being thread-safe by default"],"a":1},
      {"q":"What happens with double-checked locking if the pointer is not std::atomic?","o":["Compilation error","Deadlock","Another thread may see a partially constructed object","Memory leak"],"a":2},
      {"q":"Abstract Factory differs from Factory Method because it:","o":["Uses static methods","Creates families of related objects","Is thread-safe","Returns raw pointers"],"a":1}
    ]
  },
  {
    t: "Observer & Strategy Pattern",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">In a trading platform, when a stock price changes, dozens of subsystems must react: the <b>risk engine</b> recalculates exposure, the <b>P&amp;L dashboard</b> updates, <b>stop-loss triggers</b> fire, and <b>compliance alerts</b> check thresholds. Hardwiring each dependency would create spaghetti code. The <b>Observer pattern</b> decouples the price feed (subject) from all consumers (observers). Meanwhile, the order execution engine may need to switch between VWAP, TWAP, and Iceberg algorithms at runtime — a textbook <b>Strategy pattern</b> application. These two behavioural patterns appear in almost every system design interview.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p"><b>Observer</b> defines a <b>one-to-many dependency</b>: when the subject changes, all registered observers are notified. <b>Strategy</b> defines a <b>family of algorithms</b>, encapsulates each, and makes them <b>interchangeable</b> at runtime.</p><div class="learn-code">┌────────────── OBSERVER ──────────────┐\n│                                      │\n│   Subject (Observable)               │\n│   ┌──────────────────────┐           │\n│   │ - observers: list    │           │\n│   │ + attach(observer)   │           │\n│   │ + detach(observer)   │           │\n│   │ + notify()           │──────┐    │\n│   └──────────────────────┘      │    │\n│                                 ▼    │\n│   ┌──────┐ ┌──────┐ ┌──────┐        │\n│   │ Obs1 │ │ Obs2 │ │ Obs3 │        │\n│   │update│ │update│ │update│        │\n│   └──────┘ └──────┘ └──────┘        │\n└──────────────────────────────────────┘\n\n┌────────────── STRATEGY ──────────────┐\n│                                      │\n│   Context ────► IStrategy            │\n│                   │                  │\n│          ┌────────┼────────┐         │\n│          ▼        ▼        ▼         │\n│     StrategyA  StrategyB  StrategyC  │\n│     (VWAP)     (TWAP)    (Iceberg)   │\n│                                      │\n│   context.setStrategy(new TWAP());   │\n│   context.execute();                 │\n└──────────────────────────────────────┘</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>Observer participants:</b></p><ul class="learn-list"><li><b>IObserver</b> — interface with <code>update()</code> method.</li><li><b>ISubject</b> — interface with <code>attach()</code>, <code>detach()</code>, <code>notify()</code>.</li><li><b>ConcreteSubject</b> — stores state, calls <code>notify()</code> on state change.</li><li><b>ConcreteObserver</b> — implements <code>update()</code> to react to changes.</li></ul><p class="learn-p"><b>Strategy participants:</b></p><ul class="learn-list"><li><b>IStrategy</b> — interface declaring the algorithm method.</li><li><b>ConcreteStrategies</b> — implement specific algorithms.</li><li><b>Context</b> — holds a pointer to IStrategy, delegates algorithm execution.</li></ul><p class="learn-p"><b>Push vs Pull Observer:</b></p><ul class="learn-list"><li><b>Push</b>: Subject sends data in update call — <code>update(price, volume)</code>. Simple but observers may get unneeded data.</li><li><b>Pull</b>: Subject sends itself — <code>update(Subject* src)</code>, observer queries what it needs. More flexible.</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>Observer — Stock Price Feed:</b></p><div class="learn-code">class IObserver {\npublic:\n    virtual void update(const string&amp; event, float data) = 0;\n    virtual ~IObserver() = default;\n};\n\nclass StockFeed {\n    vector&lt;IObserver*&gt; observers;\n    float price = 0;\npublic:\n    void attach(IObserver* o) { observers.push_back(o); }\n    void detach(IObserver* o) {\n        observers.erase(remove(observers.begin(), observers.end(), o),\n                        observers.end());\n    }\n    void setPrice(float p) {\n        price = p;\n        for (auto* obs : observers)\n            obs-&gt;update("price_change", price);\n    }\n};\n\nclass RiskEngine : public IObserver {\n    void update(const string&amp; event, float data) override {\n        cout &lt;&lt; "[Risk] Recalculating exposure at $" &lt;&lt; data;\n    }\n};</div><p class="learn-p"><b>Strategy — Sorting/Compression:</b></p><div class="learn-code">class ICompression {\npublic:\n    virtual void compress(const string&amp; file) = 0;\n    virtual ~ICompression() = default;\n};\nclass ZipCompression : public ICompression {\npublic:\n    void compress(const string&amp; file) override {\n        cout &lt;&lt; "ZIP: " &lt;&lt; file;\n    }\n};\nclass GzipCompression : public ICompression {\npublic:\n    void compress(const string&amp; file) override {\n        cout &lt;&lt; "GZIP: " &lt;&lt; file;\n    }\n};\n\nclass Archiver {\n    unique_ptr&lt;ICompression&gt; strategy;\npublic:\n    void setStrategy(unique_ptr&lt;ICompression&gt; s) { strategy = move(s); }\n    void archive(const string&amp; file) { strategy-&gt;compress(file); }\n};</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><ul class="learn-list"><li><b>Observer vs Pub-Sub</b> — Observer is direct (subject knows observers). Pub-Sub uses an intermediary broker (Kafka, Redis). Pub-Sub is distributed Observer.</li><li><b>Reactive Extensions (Rx)</b> — Observer on steroids: observable streams with map/filter/reduce operators. RxJava, RxCpp.</li><li><b>Event Bus / Mediator</b> — centralizes event routing; subjects and observers don\'t know each other. Good for complex graphs.</li><li><b>Strategy vs Template Method</b> — Strategy uses composition (runtime swap); Template Method uses inheritance (compile-time). Strategy is more flexible.</li><li><b>Strategy vs State</b> — Both encapsulate behaviour in separate classes. Strategy swaps algorithms externally; State transitions happen internally.</li><li><b>std::function as lightweight Strategy</b> — In modern C++, you can use <code>std::function</code> or lambdas instead of a full Strategy hierarchy for simple cases.</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Observer pitfalls:</b><br/>1. <b>Dangling pointers</b> — if an observer is destroyed without detaching, the subject holds a dangling pointer. Use <code>weak_ptr</code> or ensure detach in destructor.<br/>2. <b>Notification storms</b> — cascading updates where observer A modifies subject, triggering another notify. Guard with a <code>notifying</code> flag.<br/>3. <b>Order dependence</b> — if observers depend on notification order, your design is fragile. Observers should be independent.<br/>4. <b>Thread-safety</b> — modifying the observer list while iterating causes UB. Copy the list before notifying, or use a concurrent container.</div><div class="learn-warn"><b>Strategy pitfalls:</b><br/>1. <b>Null strategy</b> — always check that a strategy is set before calling, or use Null Object pattern as default.<br/>2. <b>Strategy explosion</b> — if you have too many simple strategies, consider using lambdas or function pointers.<br/>3. <b>Context-strategy coupling</b> — if strategies need too much data from the context, you may need to pass a context reference or use a parameter object.</div></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Aspect</th><th>Observer</th><th>Strategy</th></tr><tr><td>Relationship</td><td>One-to-many</td><td>One-to-one (context to strategy)</td></tr><tr><td>Purpose</td><td>Notify dependents of state changes</td><td>Swap algorithm at runtime</td></tr><tr><td>Direction</td><td>Subject pushes to observers</td><td>Context delegates to strategy</td></tr><tr><td>Cardinality</td><td>Multiple observers simultaneously</td><td>One active strategy at a time</td></tr><tr><td>Who initiates change</td><td>Subject (on state change)</td><td>Client code (sets strategy)</td></tr><tr><td>Real examples</td><td>Event listeners, MVC, Kafka</td><td>Sorting, payment, compression</td></tr><tr><td>Key principle</td><td>Loose coupling (subject ↔ observer)</td><td>Composition over inheritance</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you prevent memory leaks in Observer pattern (C++)?</b><br>A: Use <code>weak_ptr</code> in the subject\'s observer list. Before notifying, check if the weak_ptr is still valid. Alternatively, detach in the observer\'s destructor.</p><p class="learn-p"><b>Q2: Push vs Pull model — which is better?</b><br>A: Push is simpler for uniform data. Pull is better when observers need different subsets. Modern systems often use pull with lazy evaluation.</p><p class="learn-p"><b>Q3: How does Pub-Sub differ from Observer?</b><br>A: Pub-Sub introduces a message broker between publishers and subscribers. They don\'t know each other. Observer has direct references. Pub-Sub scales better in distributed systems.</p><p class="learn-p"><b>Q4: Can you combine Observer and Strategy?</b><br>A: Yes. Example: Observer notifies subscribers, and the notification delivery mechanism (email, SMS, push) is a Strategy on each observer.</p><p class="learn-p"><b>Q5: When would you use a lambda instead of Strategy pattern?</b><br>A: When the algorithm is a single function with no state. E.g., <code>sort(v.begin(), v.end(), [](int a, int b){ return a &gt; b; });</code>. Full Strategy is better when algorithms have state or multiple methods.</p><p class="learn-p"><b>Q6: What is the relationship between Observer and MVC?</b><br>A: In MVC, the Model is the Subject and the View is the Observer. When Model data changes, the View is notified to re-render.</p></div>',
    code: `// ===== Observer & Strategy Pattern — Enhanced C++ Implementation =====
#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <algorithm>
using namespace std;

// =================== OBSERVER PATTERN ===================
class IObserver {
public:
    virtual void update(const string& event, float data) = 0;
    virtual ~IObserver() = default;
};

class ISubject {
public:
    virtual void attach(IObserver* o) = 0;
    virtual void detach(IObserver* o) = 0;
    virtual void notify(const string& event) = 0;
    virtual ~ISubject() = default;
};

class StockMarket : public ISubject {
    vector<IObserver*> observers;
    float price = 0;
public:
    void attach(IObserver* o) override { observers.push_back(o); }
    void detach(IObserver* o) override {
        observers.erase(
            remove(observers.begin(), observers.end(), o),
            observers.end());
    }
    void notify(const string& event) override {
        // Copy list to avoid issues if observer detaches during notify
        auto copy = observers;
        for (auto* obs : copy)
            obs->update(event, price);
    }
    void setPrice(float p) {
        price = p;
        notify("price_change");
    }
    float getPrice() const { return price; }
};

class RiskEngine : public IObserver {
public:
    void update(const string& event, float data) override {
        cout << "[Risk] Recalculating exposure at $" << data << endl;
    }
};

class PnLDashboard : public IObserver {
public:
    void update(const string& event, float data) override {
        cout << "[P&L] Updated mark-to-market: $" << data << endl;
    }
};

class StopLossMonitor : public IObserver {
    float threshold;
public:
    StopLossMonitor(float t) : threshold(t) {}
    void update(const string& event, float data) override {
        if (data < threshold)
            cout << "[StopLoss] TRIGGERED at $" << data << " (threshold: $" << threshold << ")" << endl;
        else
            cout << "[StopLoss] OK at $" << data << endl;
    }
};

// =================== STRATEGY PATTERN ===================
class CompressionStrategy {
public:
    virtual void compress(const string& file) = 0;
    virtual ~CompressionStrategy() = default;
};

class ZipCompression : public CompressionStrategy {
public:
    void compress(const string& file) override {
        cout << "ZIP compressing: " << file << endl;
    }
};

class GzipCompression : public CompressionStrategy {
public:
    void compress(const string& file) override {
        cout << "GZIP compressing: " << file << endl;
    }
};

class LZ4Compression : public CompressionStrategy {
public:
    void compress(const string& file) override {
        cout << "LZ4 compressing (fastest): " << file << endl;
    }
};

class FileCompressor {
    unique_ptr<CompressionStrategy> strategy;
public:
    void setStrategy(unique_ptr<CompressionStrategy> s) {
        strategy = move(s);
    }
    void compressFile(const string& file) {
        if (!strategy) {
            cout << "No strategy set!" << endl;
            return;
        }
        strategy->compress(file);
    }
};

int main() {
    // Observer demo — stock market
    StockMarket market;
    RiskEngine risk;
    PnLDashboard pnl;
    StopLossMonitor stop(140.0);

    market.attach(&risk);
    market.attach(&pnl);
    market.attach(&stop);

    market.setPrice(150.0);    // all notified, stop-loss OK
    cout << "---" << endl;
    market.setPrice(135.0);    // stop-loss TRIGGERED

    market.detach(&pnl);       // PnL unsubscribes
    cout << "---" << endl;
    market.setPrice(142.0);    // only risk + stop notified

    cout << "\\n=== Strategy demo ===" << endl;
    FileCompressor compressor;
    compressor.setStrategy(make_unique<ZipCompression>());
    compressor.compressFile("report.pdf");

    compressor.setStrategy(make_unique<LZ4Compression>());
    compressor.compressFile("realtime_data.bin");

    compressor.setStrategy(make_unique<GzipCompression>());
    compressor.compressFile("logs.txt");
    return 0;
}`,
    problems: [
      ["Design Twitter","https://leetcode.com/problems/design-twitter/","Medium"],
      ["Sort an Array","https://leetcode.com/problems/sort-an-array/","Medium"],
      ["Design a Leaderboard","https://leetcode.com/problems/design-a-leaderboard/","Medium"],
      ["Online Stock Span","https://leetcode.com/problems/online-stock-span/","Medium"]
    ],
    mcqs: [
      {"q":"The Observer pattern defines a:","o":["One-to-one dependency","Many-to-many dependency","One-to-many dependency","No dependency"],"a":2},
      {"q":"The Strategy pattern is a direct application of which SOLID principles?","o":["SRP and LSP","OCP and DIP (program to interfaces, swap at runtime)","ISP and SRP","LSP and OCP"],"a":1},
      {"q":"In the Observer pattern, a memory leak can occur when:","o":["Too many observers are added","The subject is destroyed before observers","An observer is destroyed without detaching from the subject","The notify method is called too frequently"],"a":2},
      {"q": "In a trading system, switching between VWAP, TWAP, and market-making algorithms at runtime is best modeled by:", "o": ["Observer pattern", "Strategy pattern", "Decorator pattern", "Singleton pattern"], "a": 1},
      {"q":"Push model Observer differs from Pull model because:","o":["Push sends all data in the update call; Pull lets observer query subject","Push is faster","Pull requires more observers","Push uses less memory"],"a":0},
      {"q":"Strategy pattern is preferred over inheritance-based polymorphism when:","o":["You need compile-time binding","You want to change algorithm at runtime without modifying the class","You have only one algorithm","You need multiple inheritance"],"a":1},
      {"q":"Pub-Sub differs from Observer because:","o":["Pub-Sub is synchronous","Pub-Sub uses a message broker so publishers and subscribers are decoupled","Pub-Sub can only have one subscriber","Observer is asynchronous"],"a":1},
      {"q":"When notifying observers in a multithreaded system, you should:","o":["Lock the observer list and notify while holding the lock","Copy the observer list, release the lock, then notify the copy","Never notify observers from multiple threads","Use global variables"],"a":1}
    ]
  },
  {
    t: "Decorator & Adapter Pattern",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">In a trading system, a raw market data connection provides basic price data. But different modules need <b>additional capabilities layered on</b>: logging every tick, compressing the data stream, encrypting it for compliance, throttling for rate limits. Instead of creating <code>LoggingEncryptedCompressedThrottledConnection</code>, you use the <b>Decorator pattern</b> to stack capabilities. Meanwhile, when integrating a new exchange API that speaks FIX protocol while your system expects REST-like objects, the <b>Adapter pattern</b> bridges the gap without modifying either side. These two structural patterns are essential for maintaining clean, extensible architectures.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p"><b>Decorator</b> dynamically adds behaviour to objects by wrapping them. Both the decorator and the original implement the <b>same interface</b>, enabling stacking. <b>Adapter</b> converts one interface to another, making incompatible classes work together.</p><div class="learn-code">┌──────────────────── DECORATOR (Stacking) ────────────────────┐\n│                                                               │\n│  Component (interface)                                        │\n│    ├── ConcreteComponent (base object)                        │\n│    └── BaseDecorator (wraps a Component)                      │\n│          ├── DecoratorA (adds behaviour A + delegates)         │\n│          ├── DecoratorB (adds behaviour B + delegates)         │\n│          └── DecoratorC (adds behaviour C + delegates)         │\n│                                                               │\n│  Stacking:                                                    │\n│  ┌──────────────────────────────────────────────┐             │\n│  │ DecoratorC                                    │             │\n│  │  ┌──────────────────────────────────────┐     │             │\n│  │  │ DecoratorA                            │     │             │\n│  │  │  ┌──────────────────────────────┐     │     │             │\n│  │  │  │ ConcreteComponent             │     │     │             │\n│  │  │  └──────────────────────────────┘     │     │             │\n│  │  └──────────────────────────────────────┘     │             │\n│  └──────────────────────────────────────────────┘             │\n└───────────────────────────────────────────────────────────────┘\n\n┌──────────────────── ADAPTER ─────────────────────────────────┐\n│                                                               │\n│  Client ──► Target Interface ◄── Adapter ──► Adaptee          │\n│             (what client expects)    │     (legacy/3rd party)  │\n│                                     │                         │\n│                              translates calls                 │\n└───────────────────────────────────────────────────────────────┘</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>Decorator components:</b></p><ul class="learn-list"><li><b>Component</b> — abstract interface (e.g., <code>IStream</code>, <code>Coffee</code>).</li><li><b>ConcreteComponent</b> — base object being decorated (e.g., <code>FileStream</code>, <code>Espresso</code>).</li><li><b>BaseDecorator</b> — holds a <code>unique_ptr&lt;Component&gt;</code>, delegates all calls.</li><li><b>ConcreteDecorators</b> — override methods, add behaviour before/after delegating (e.g., <code>BufferedDecorator</code>, <code>MilkDecorator</code>).</li></ul><p class="learn-p"><b>Adapter components:</b></p><ul class="learn-list"><li><b>Target</b> — interface the client expects.</li><li><b>Adaptee</b> — existing class with an incompatible interface.</li><li><b>Object Adapter</b> — uses composition: holds adaptee as a member.</li><li><b>Class Adapter</b> — uses multiple inheritance: inherits from both Target and Adaptee (less common, C++ specific).</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>Decorator — Coffee shop pricing:</b></p><div class="learn-code">class Coffee {\npublic:\n    virtual double cost() const = 0;\n    virtual string description() const = 0;\n    virtual ~Coffee() = default;\n};\nclass Espresso : public Coffee {\npublic:\n    double cost() const override { return 4.0; }\n    string description() const override { return "Espresso"; }\n};\nclass MilkDecorator : public Coffee {\n    unique_ptr&lt;Coffee&gt; coffee;\npublic:\n    MilkDecorator(unique_ptr&lt;Coffee&gt; c) : coffee(move(c)) {}\n    double cost() const override { return coffee-&gt;cost() + 1.5; }\n    string description() const override {\n        return coffee-&gt;description() + " + Milk";\n    }\n};\nclass SugarDecorator : public Coffee {\n    unique_ptr&lt;Coffee&gt; coffee;\npublic:\n    SugarDecorator(unique_ptr&lt;Coffee&gt; c) : coffee(move(c)) {}\n    double cost() const override { return coffee-&gt;cost() + 0.5; }\n    string description() const override {\n        return coffee-&gt;description() + " + Sugar";\n    }\n};\n\n// Stacking: Espresso($4) + Milk($1.5) + Sugar($0.5) = $6.0\nauto c = make_unique&lt;Espresso&gt;();\nc = make_unique&lt;MilkDecorator&gt;(move(c));\nc = make_unique&lt;SugarDecorator&gt;(move(c));</div><p class="learn-p"><b>Adapter — Legacy printer integration:</b></p><div class="learn-code">class IPrinter {\npublic:\n    virtual void print(const string&amp; text) = 0;\n    virtual ~IPrinter() = default;\n};\n\nclass OldPrinter {\npublic:\n    void printOldWay(const string&amp; text) {\n        cout &lt;&lt; "*** " &lt;&lt; text &lt;&lt; " ***";\n    }\n};\n\nclass PrinterAdapter : public IPrinter {\n    OldPrinter legacy;   // composition (Object Adapter)\npublic:\n    void print(const string&amp; text) override {\n        legacy.printOldWay(text);  // translate call\n    }\n};</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><ul class="learn-list"><li><b>Decorator vs Inheritance</b> — With N features, inheritance needs up to 2^N subclasses. Decorator needs N decorator classes, combined freely at runtime.</li><li><b>Java I/O Streams</b> — Classic Decorator: <code>BufferedReader(InputStreamReader(FileInputStream(...)))</code>. Each layer adds buffering, character conversion, etc.</li><li><b>Object Adapter vs Class Adapter</b> — Object Adapter (composition) is preferred: more flexible, no multiple inheritance issues. Class Adapter (MI) only works in C++.</li><li><b>Facade vs Adapter</b> — Facade simplifies a complex subsystem behind a unified interface. Adapter converts one interface to another. Facade is about simplification; Adapter is about compatibility.</li><li><b>Adapter for testing</b> — Wrap external services (DB, API) with adapters implementing an interface. In tests, swap with mock adapters.</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Decorator pitfalls:</b><br/>1. <b>Identity crisis</b> — a decorated object is NOT the same type as the original. <code>dynamic_cast&lt;Espresso*&gt;(decoratedCoffee)</code> fails. If you need type identity, Decorator is wrong.<br/>2. <b>Order matters</b> — <code>Encrypt(Compress(data))</code> is different from <code>Compress(Encrypt(data))</code>. Document the expected stacking order.<br/>3. <b>Too many small classes</b> — Decorator can lead to class proliferation. Consider if simple composition or lambda-based decoration is cleaner.<br/>4. <b>Decorator removing behaviour</b> — Decorators should add, not subtract. If you need to remove behaviour, the pattern is being misused.</div><div class="learn-warn"><b>Adapter pitfalls:</b><br/>1. <b>Leaky abstractions</b> — if the adapter exposes adaptee-specific behaviour or exceptions, the abstraction leaks.<br/>2. <b>Two-way adapters</b> — sometimes you need to adapt in both directions, which complicates the design. Consider a Mediator instead.<br/>3. <b>Performance overhead</b> — each adapter call adds indirection. For hot paths (millions of calls/sec), measure impact.</div></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Aspect</th><th>Decorator</th><th>Adapter</th><th>Proxy</th><th>Facade</th></tr><tr><td>Intent</td><td>Add behaviour dynamically</td><td>Convert incompatible interface</td><td>Control access</td><td>Simplify complex subsystem</td></tr><tr><td>Interface</td><td>Same as wrapped object</td><td>Different from adaptee</td><td>Same as real object</td><td>New simplified interface</td></tr><tr><td>Wrapping</td><td>Same-type wrapping, stackable</td><td>Wraps different-type object</td><td>Wraps same-type object</td><td>Wraps entire subsystem</td></tr><tr><td>Stacking</td><td>Yes (multiple decorators)</td><td>Usually single</td><td>Usually single</td><td>Single</td></tr><tr><td>When decided</td><td>Runtime</td><td>Design/compile time</td><td>Design time</td><td>Design time</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How does Decorator differ from Proxy?</b><br>A: Structurally identical — both wrap an object with the same interface. The difference is intent: Decorator adds behaviour; Proxy controls access (caching, auth, lazy init).</p><p class="learn-p"><b>Q2: Give a real-world Decorator example.</b><br>A: Java I/O: <code>new BufferedReader(new InputStreamReader(new FileInputStream("f.txt")))</code>. Each layer adds buffering, encoding, etc. In C++, any stream wrapper pipeline.</p><p class="learn-p"><b>Q3: When would you NOT use Decorator?</b><br>A: When you need type identity (dynamic_cast), when the number of method delegations makes it inefficient, or when the interface is large and every method must be forwarded.</p><p class="learn-p"><b>Q4: Object Adapter vs Class Adapter — which is preferred?</b><br>A: Object Adapter (composition) is almost always preferred. It avoids multiple inheritance complications and allows the adaptee to be swapped at runtime.</p><p class="learn-p"><b>Q5: How do you test decorated objects?</b><br>A: Test each decorator independently by wrapping a mock component. Verify that the decorator correctly delegates and adds its behaviour.</p><p class="learn-p"><b>Q6: Can Decorator be used with final/sealed classes?</b><br>A: Yes, because Decorator uses composition, not inheritance of the concrete class. It only requires the component interface.</p></div>',
    code: `// ===== Decorator & Adapter Pattern — Enhanced C++ Implementation =====
#include <iostream>
#include <string>
#include <memory>
using namespace std;

// =================== DECORATOR PATTERN ===================
class Pizza {
public:
    virtual double cost() const = 0;
    virtual string description() const = 0;
    virtual ~Pizza() = default;
};

class Margherita : public Pizza {
public:
    double cost() const override { return 8.0; }
    string description() const override { return "Margherita"; }
};

class FarmHouse : public Pizza {
public:
    double cost() const override { return 10.0; }
    string description() const override { return "Farm House"; }
};

// Base decorator
class ToppingDecorator : public Pizza {
protected:
    unique_ptr<Pizza> pizza;
public:
    ToppingDecorator(unique_ptr<Pizza> p) : pizza(move(p)) {}
};

class ExtraCheese : public ToppingDecorator {
public:
    ExtraCheese(unique_ptr<Pizza> p) : ToppingDecorator(move(p)) {}
    double cost() const override { return pizza->cost() + 2.0; }
    string description() const override {
        return pizza->description() + " + Extra Cheese";
    }
};

class Mushroom : public ToppingDecorator {
public:
    Mushroom(unique_ptr<Pizza> p) : ToppingDecorator(move(p)) {}
    double cost() const override { return pizza->cost() + 1.5; }
    string description() const override {
        return pizza->description() + " + Mushroom";
    }
};

class Jalapeno : public ToppingDecorator {
public:
    Jalapeno(unique_ptr<Pizza> p) : ToppingDecorator(move(p)) {}
    double cost() const override { return pizza->cost() + 1.0; }
    string description() const override {
        return pizza->description() + " + Jalapeno";
    }
};

// =================== ADAPTER PATTERN ===================
// Target interface
class IMediaPlayer {
public:
    virtual void play(const string& filename) = 0;
    virtual ~IMediaPlayer() = default;
};

// Adaptees with incompatible interfaces
class VLCPlayer {
public:
    void playVLC(const string& file) {
        cout << "VLC playing: " << file << endl;
    }
};

class FFmpegPlayer {
public:
    void playFFmpeg(const string& file) {
        cout << "FFmpeg playing: " << file << endl;
    }
};

// Object Adapters
class VLCAdapter : public IMediaPlayer {
    VLCPlayer vlc;
public:
    void play(const string& filename) override {
        vlc.playVLC(filename);
    }
};

class FFmpegAdapter : public IMediaPlayer {
    FFmpegPlayer ffmpeg;
public:
    void play(const string& filename) override {
        ffmpeg.playFFmpeg(filename);
    }
};

class MusicApp {
    unique_ptr<IMediaPlayer> player;
public:
    void setPlayer(unique_ptr<IMediaPlayer> p) { player = move(p); }
    void playFile(const string& f) { player->play(f); }
};

int main() {
    // Decorator demo: stackable toppings
    unique_ptr<Pizza> order = make_unique<Margherita>();
    order = make_unique<ExtraCheese>(move(order));
    order = make_unique<Mushroom>(move(order));
    order = make_unique<Jalapeno>(move(order));
    cout << order->description() << endl;  // Margherita + Extra Cheese + Mushroom + Jalapeno
    cout << "Total: $" << order->cost() << endl;  // 8+2+1.5+1 = 12.5

    cout << "---" << endl;

    // Adapter demo
    MusicApp app;
    app.setPlayer(make_unique<VLCAdapter>());
    app.playFile("song.mp3");

    app.setPlayer(make_unique<FFmpegAdapter>());
    app.playFile("video.mkv");
    return 0;
}`,
    problems: [
      ["Peeking Iterator","https://leetcode.com/problems/peeking-iterator/","Medium"],
      ["Flatten Nested List Iterator","https://leetcode.com/problems/flatten-nested-list-iterator/","Medium"],
      ["LRU Cache","https://leetcode.com/problems/lru-cache/","Medium"],
      ["Iterator for Combination","https://leetcode.com/problems/iterator-for-combination/","Medium"]
    ],
    mcqs: [
      {"q":"The Decorator pattern provides a flexible alternative to:","o":["Encapsulation","Subclassing for extending functionality","Using static methods","Composition"],"a":1},
      {"q":"What distinguishes Adapter from Decorator?","o":["Adapter adds behaviour; Decorator changes interface","Adapter changes interface; Decorator adds behaviour","Both add behaviour","Both change interface"],"a":1},
      {"q":"Java I/O streams (BufferedReader wrapping InputStreamReader wrapping FileInputStream) exemplify:","o":["Adapter pattern","Strategy pattern","Decorator pattern","Observer pattern"],"a":2},
      {"q":"Object Adapter is preferred over Class Adapter because:","o":["It is faster","It avoids multiple inheritance and allows runtime adaptee swaps","It uses less memory","It is simpler to implement"],"a":1},
      {"q":"A key limitation of the Decorator pattern is:","o":["It cannot add new methods","decorated objects lose their type identity under dynamic_cast","It only works with interfaces","It cannot be combined with Factory"],"a":1},
      {"q":"Facade differs from Adapter because Facade:","o":["Converts one interface to another","Simplifies a complex subsystem behind a unified interface","Adds new behaviour","Controls access"],"a":1}
    ]
  },
  {
    t: "Builder & Command Pattern",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Constructing a complex trade order requires dozens of parameters: instrument, quantity, price, order type, time-in-force, routing preference, risk limits, and optional fields like trailing stop percentage. A <b>telescoping constructor</b> with 15+ parameters is unmaintainable. The <b>Builder pattern</b> creates readable, validated order objects step-by-step. Meanwhile, the trading desk needs <b>undo/redo</b> capability for order modifications, <b>macro recording</b> for batch operations, and <b>audit logging</b> of every action — all classic <b>Command pattern</b> use cases. These patterns are frequently combined in enterprise systems.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p"><b>Builder</b> separates the construction of a complex object from its representation. It constructs objects step-by-step using named method calls. <b>Command</b> encapsulates a request as an object, enabling parameterization, queuing, logging, and undo/redo.</p><div class="learn-code">┌───────────────── BUILDER ────────────────────┐\n│                                               │\n│   Client                                      │\n│     │                                         │\n│     ▼                                         │\n│   Builder                                     │\n│     .setField1(val1)  ──► returns Builder&amp;    │\n│     .setField2(val2)  ──► returns Builder&amp;    │\n│     .setField3(val3)  ──► returns Builder&amp;    │\n│     .build()          ──► returns Product      │\n│                             │                  │\n│                             ▼                  │\n│                        [Validated Product]      │\n└───────────────────────────────────────────────┘\n\n┌───────────────── COMMAND ────────────────────┐\n│                                               │\n│  Client creates ConcreteCommand               │\n│     │   (binds Receiver + action)             │\n│     ▼                                         │\n│  Invoker ──► command.execute()                │\n│     │           │                             │\n│     │           ▼                             │\n│     │       Receiver.action()                 │\n│     │                                         │\n│     └──► history.push(command)                │\n│              │                                │\n│              ▼                                │\n│          command.undo()   (reverse action)    │\n└───────────────────────────────────────────────┘</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>Builder participants:</b></p><ul class="learn-list"><li><b>Product</b> — the complex object being built (e.g., <code>HttpRequest</code>, <code>TradeOrder</code>).</li><li><b>Builder</b> — provides setters that return <code>Builder&amp;</code> for method chaining (fluent interface).</li><li><b>build()</b> — finalizes and validates, then returns the product.</li><li><b>Director</b> (optional, GoF variant) — orchestrates the building steps in a predefined sequence.</li></ul><p class="learn-p"><b>Command participants:</b></p><ul class="learn-list"><li><b>ICommand</b> — interface with <code>execute()</code> and <code>undo()</code>.</li><li><b>ConcreteCommand</b> — binds a receiver to an action, stores state for undo.</li><li><b>Receiver</b> — the object that performs the actual work (e.g., <code>TextEditor</code>, <code>Light</code>).</li><li><b>Invoker</b> — stores and executes commands, maintains history stack for undo.</li><li><b>MacroCommand</b> — a composite of multiple commands executed together.</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>Builder — HTTP Request:</b></p><div class="learn-code">class HttpRequest {\npublic:\n    string method, url, body;\n    vector&lt;pair&lt;string,string&gt;&gt; headers;\n    int timeout = 30;\n\n    class Builder {\n        HttpRequest req;\n    public:\n        Builder(const string&amp; method, const string&amp; url) {\n            req.method = method;\n            req.url = url;\n        }\n        Builder&amp; addHeader(const string&amp; k, const string&amp; v) {\n            req.headers.push_back({k, v}); return *this;\n        }\n        Builder&amp; setBody(const string&amp; body) {\n            req.body = body; return *this;\n        }\n        Builder&amp; setTimeout(int t) {\n            req.timeout = t; return *this;\n        }\n        HttpRequest build() {\n            if (req.url.empty())\n                throw invalid_argument("URL is required");\n            return req;\n        }\n    };\n};\n\nauto req = HttpRequest::Builder("POST", "/api/trade")\n    .addHeader("Auth", "Bearer token")\n    .setBody("{...}")\n    .setTimeout(60)\n    .build();</div><p class="learn-p"><b>Command — Text Editor with Undo:</b></p><div class="learn-code">class ICommand {\npublic:\n    virtual void execute() = 0;\n    virtual void undo() = 0;\n    virtual ~ICommand() = default;\n};\n\nclass TextEditor {\n    string text;\npublic:\n    void insertText(const string&amp; t) { text += t; }\n    void deleteChars(int n) {\n        if (n &lt;= text.size()) text.erase(text.size() - n);\n    }\n    string getText() const { return text; }\n};\n\nclass InsertCommand : public ICommand {\n    TextEditor&amp; editor;\n    string toInsert;\npublic:\n    InsertCommand(TextEditor&amp; e, string t)\n        : editor(e), toInsert(t) {}\n    void execute() override { editor.insertText(toInsert); }\n    void undo() override { editor.deleteChars(toInsert.size()); }\n};\n\nclass CommandManager {\n    stack&lt;unique_ptr&lt;ICommand&gt;&gt; undoStack;\n    stack&lt;unique_ptr&lt;ICommand&gt;&gt; redoStack;\npublic:\n    void executeCommand(unique_ptr&lt;ICommand&gt; cmd) {\n        cmd-&gt;execute();\n        undoStack.push(move(cmd));\n        while (!redoStack.empty()) redoStack.pop();  // clear redo\n    }\n    void undo() {\n        if (!undoStack.empty()) {\n            undoStack.top()-&gt;undo();\n            redoStack.push(move(undoStack.top()));\n            undoStack.pop();\n        }\n    }\n    void redo() {\n        if (!redoStack.empty()) {\n            redoStack.top()-&gt;execute();\n            undoStack.push(move(redoStack.top()));\n            redoStack.pop();\n        }\n    }\n};</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><ul class="learn-list"><li><b>Builder vs Constructor overloading</b> — Builder shines with 4+ optional parameters. Below that, constructor overloads or default arguments may suffice.</li><li><b>Builder with validation</b> — The <code>build()</code> method should validate invariants (required fields, value ranges) and throw if invalid. This creates a "parse, don\'t validate" boundary.</li><li><b>Director pattern</b> — A Director encapsulates common build sequences. E.g., <code>MealDirector::buildVegMeal(builder)</code> calls <code>builder.addItem("Veg Burger").addItem("Coke").build()</code>.</li><li><b>Command for transactions</b> — Execute a sequence of commands. If any fails, undo all previously executed (saga pattern).</li><li><b>Command queuing</b> — Serialize commands to a queue for deferred execution (job queues, task schedulers).</li><li><b>Memento + Command</b> — Instead of undo logic per command, save state snapshots (Memento) before each command. Undo restores the snapshot.</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Builder pitfalls:</b><br/>1. <b>Forgetting required fields</b> — Builder allows partial construction. Always validate in <code>build()</code>. Consider required parameters in the Builder constructor.<br/>2. <b>Mutable after build</b> — if the product is mutable, changes after <code>build()</code> bypass validation. Consider making the product immutable (const fields, no setters).<br/>3. <b>Builder reuse</b> — can a Builder be reused after <code>build()</code>? Decide: reset the Builder state or make it single-use.</div><div class="learn-warn"><b>Command pitfalls:</b><br/>1. <b>Complex undo state</b> — some operations are hard to reverse (e.g., deleting from a DB). Store enough state in the command to reconstruct.<br/>2. <b>Redo after new command</b> — executing a new command should clear the redo stack (you\'re forking the timeline).<br/>3. <b>Macro undo</b> — undoing a macro should reverse all sub-commands in reverse order. Test this carefully.<br/>4. <b>Memory growth</b> — unlimited history eats memory. Set a max undo depth and evict old commands.</div></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Aspect</th><th>Builder</th><th>Command</th></tr><tr><td>Category</td><td>Creational</td><td>Behavioural</td></tr><tr><td>Purpose</td><td>Construct complex objects step by step</td><td>Encapsulate requests as objects</td></tr><tr><td>Key benefit</td><td>Readable construction, validation at build time</td><td>Undo/redo, queuing, logging of operations</td></tr><tr><td>Returns</td><td>The built product object</td><td>Executes/undoes actions on receivers</td></tr><tr><td>GoF variant</td><td>Director + Builder + Product</td><td>Invoker + Command + Receiver</td></tr><tr><td>Modern shortcut</td><td>Named parameters (Python kwargs, C++20 designated init)</td><td>std::function / lambdas for simple commands</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the telescoping constructor problem?</b><br>A: When a class has many parameters, you create multiple constructors with increasing parameter counts. It becomes unreadable and error-prone. Builder solves this with named method calls.</p><p class="learn-p"><b>Q2: How does Builder differ from Factory?</b><br>A: Factory creates an object in one step (caller doesn\'t control construction). Builder constructs step-by-step with caller controlling each step. Builder is for complex objects; Factory for simple creation.</p><p class="learn-p"><b>Q3: How do you implement redo in Command pattern?</b><br>A: Maintain two stacks: undo and redo. On undo, move command to redo stack. On redo, move back. On new command, clear redo stack.</p><p class="learn-p"><b>Q4: What is a Macro Command?</b><br>A: A composite of multiple commands executed together. <code>execute()</code> runs all sub-commands in order. <code>undo()</code> reverses them in LIFO order. Used for batch operations.</p><p class="learn-p"><b>Q5: Can Command be combined with Builder?</b><br>A: Yes. Use Builder to construct complex Command objects with many parameters, then pass the built command to the Invoker.</p><p class="learn-p"><b>Q6: How does Command pattern relate to event sourcing?</b><br>A: Event sourcing stores all state changes as a sequence of events (commands). To reconstruct state, replay all events. Each event is essentially a persisted command.</p></div>',
    code: `// ===== Builder & Command Pattern — Enhanced C++ Implementation =====
#include <iostream>
#include <string>
#include <vector>
#include <stack>
#include <memory>
using namespace std;

// =================== BUILDER PATTERN ===================
class HttpRequest {
public:
    string method, url, body;
    vector<pair<string,string>> headers;
    int timeout = 30;
    bool followRedirects = true;

    void print() const {
        cout << method << " " << url << endl;
        for (auto& [k,v] : headers)
            cout << "  " << k << ": " << v << endl;
        if (!body.empty()) cout << "  Body: " << body << endl;
        cout << "  Timeout: " << timeout << "s" << endl;
    }

    class Builder {
        HttpRequest req;
    public:
        Builder(const string& method, const string& url) {
            req.method = method;
            req.url = url;
        }
        Builder& addHeader(const string& k, const string& v) {
            req.headers.push_back({k, v});
            return *this;
        }
        Builder& setBody(const string& body) {
            req.body = body;
            return *this;
        }
        Builder& setTimeout(int t) {
            req.timeout = t;
            return *this;
        }
        HttpRequest build() {
            if (req.url.empty())
                throw invalid_argument("URL is required");
            return req;
        }
    };
};

// =================== COMMAND PATTERN ===================
// Receiver
class Light {
    string room;
    bool on = false;
    int brightness = 100;
public:
    Light(string r) : room(r) {}
    void turnOn()  { on = true;  cout << room << " light ON" << endl; }
    void turnOff() { on = false; cout << room << " light OFF" << endl; }
    void dim(int level) {
        brightness = level;
        cout << room << " dimmed to " << level << "%" << endl;
    }
    void restore(int level) {
        brightness = level;
        cout << room << " restored to " << level << "%" << endl;
    }
    int getBrightness() const { return brightness; }
};

// Command interface
class ICommand {
public:
    virtual void execute() = 0;
    virtual void undo() = 0;
    virtual ~ICommand() = default;
};

class TurnOnCommand : public ICommand {
    Light& light;
public:
    TurnOnCommand(Light& l) : light(l) {}
    void execute() override { light.turnOn(); }
    void undo()    override { light.turnOff(); }
};

class DimCommand : public ICommand {
    Light& light;
    int newLevel, prevLevel;
public:
    DimCommand(Light& l, int level) : light(l), newLevel(level), prevLevel(0) {}
    void execute() override {
        prevLevel = light.getBrightness();
        light.dim(newLevel);
    }
    void undo() override { light.restore(prevLevel); }
};

// Invoker with undo + redo
class RemoteControl {
    stack<unique_ptr<ICommand>> undoStack;
    stack<unique_ptr<ICommand>> redoStack;
public:
    void press(unique_ptr<ICommand> cmd) {
        cmd->execute();
        undoStack.push(move(cmd));
        while (!redoStack.empty()) redoStack.pop();
    }
    void undoLast() {
        if (!undoStack.empty()) {
            cout << ">> UNDO: ";
            undoStack.top()->undo();
            redoStack.push(move(undoStack.top()));
            undoStack.pop();
        }
    }
    void redoLast() {
        if (!redoStack.empty()) {
            cout << ">> REDO: ";
            redoStack.top()->execute();
            undoStack.push(move(redoStack.top()));
            redoStack.pop();
        }
    }
};

// Macro Command
class MacroCommand : public ICommand {
    vector<unique_ptr<ICommand>> commands;
public:
    void add(unique_ptr<ICommand> c) { commands.push_back(move(c)); }
    void execute() override {
        for (auto& c : commands) c->execute();
    }
    void undo() override {
        for (int i = commands.size() - 1; i >= 0; i--)
            commands[i]->undo();
    }
};

int main() {
    // Builder demo
    auto req = HttpRequest::Builder("POST", "https://api.example.com/trade")
        .addHeader("Content-Type", "application/json")
        .addHeader("Authorization", "Bearer token123")
        .setBody(R"({"symbol": "AAPL", "qty": 100})")
        .setTimeout(60)
        .build();
    req.print();

    cout << "\\n--- Command demo ---\\n";
    Light bedroom("Bedroom");
    RemoteControl remote;

    remote.press(make_unique<TurnOnCommand>(bedroom));
    remote.press(make_unique<DimCommand>(bedroom, 50));

    remote.undoLast();   // undo dim
    remote.undoLast();   // undo turn on
    remote.redoLast();   // redo turn on
    return 0;
}`,
    problems: [
      ["Implement Stack using Queues","https://leetcode.com/problems/implement-stack-using-queues/","Easy"],
      ["Min Stack","https://leetcode.com/problems/min-stack/","Medium"],
      ["Design Tic-Tac-Toe","https://leetcode.com/problems/design-tic-tac-toe/","Medium"],
      ["Snapshot Array","https://leetcode.com/problems/snapshot-array/","Medium"]
    ],
    mcqs: [
      {"q":"The Builder pattern primarily solves the problem of:","o":["Too many subclasses","Telescoping constructors with many parameters","Thread-safety in object creation","Circular dependencies"],"a":1},
      {"q":"In the Command pattern, which component stores command history for undo?","o":["Receiver","Command","Invoker","Client"],"a":2},
      {"q":"Which is NOT a use case for the Command pattern?","o":["Undo/Redo operations","Task queuing","Object construction","Macro recording"],"a":2},
      {"q": "A Builder returns the constructed object via:", "o": ["The constructor", "A build() method called after setting all parameters", "The destructor", "A static factory method"], "a": 1},
      {"q": "The Command pattern's main advantage over direct function calls is:", "o": ["Faster execution", "Commands can be queued, logged, undone, and serialized", "Fewer lines of code", "Better memory efficiency"], "a": 1},
      {"q":"When a new command is executed, the correct handling of the redo stack is:","o":["Keep it unchanged","Clear it completely","Add the new command to it","Reverse it"],"a":1},
      {"q":"The Builder's build() method should:","o":["Always return null for invalid states","Validate invariants and throw if invalid","Be called before any setter","Return a Builder reference"],"a":1},
      {"q":"A Director in the GoF Builder pattern:","o":["Constructs the product directly","Orchestrates the building steps in a predefined sequence","Is the same as the Builder","Creates multiple Builder instances"],"a":1}
    ]
  },
  {
    t: "State, Proxy & Chain of Responsibility",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">In a trading system, an order flows through a <b>state machine</b>: NEW → VALIDATED → RISK_CHECKED → SENT → PARTIALLY_FILLED → FILLED. Each state has different valid transitions and behaviours. The <b>State pattern</b> eliminates giant switch statements. Trade data is expensive to fetch from the exchange API, so a <b>Proxy</b> caches responses transparently — the caller doesn\'t know it\'s hitting cache vs live API. Before a trade reaches execution, it passes through authentication, risk checks, compliance rules, and rate limiting — a classic <b>Chain of Responsibility</b> pipeline where each handler either processes or passes the request along.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p"><b>State</b> (behavioural) lets an object alter its behaviour when its internal state changes — the object appears to change its class. <b>Proxy</b> (structural) provides a surrogate to control access to another object. <b>Chain of Responsibility</b> (behavioural) passes a request along a chain of handlers; each either handles it or forwards it.</p><div class="learn-code">┌──────── STATE MACHINE (Vending Machine) ────────┐\n│                                                   │\n│  Idle ──insertCoin──► HasCoin ──select──► Dispensing\n│   ▲                                         │     │\n│   └──── (stock &gt; 0) ◄── dispense() ────────┘     │\n│                              │                    │\n│                        (stock == 0)               │\n│                              ▼                    │\n│                        OutOfStock                 │\n└───────────────────────────────────────────────────┘\n\n┌──────── PROXY ──────────────────────────────────┐\n│                                                   │\n│  Client ──► IService ◄── CachingProxy             │\n│                              │                    │\n│                        ┌─────┴─────┐              │\n│                        │  cache?   │              │\n│                        │  HIT: ret │              │\n│                        │  MISS: ───┼──► RealDB    │\n│                        └───────────┘              │\n└───────────────────────────────────────────────────┘\n\n┌──────── CHAIN OF RESPONSIBILITY ────────────────┐\n│                                                   │\n│  Request ──► [Auth] ──► [RateLimit] ──► [Logging] │\n│                │            │             │       │\n│             pass/fail    pass/fail     pass/fail  │\n│             (next)       (next)        (handle)   │\n└───────────────────────────────────────────────────┘</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>State pattern:</b></p><ul class="learn-list"><li><b>Context</b> — the object whose behaviour varies (<code>VendingMachine</code>, <code>TCPConnection</code>). Holds a pointer to current State.</li><li><b>IState</b> — interface declaring all state-dependent methods.</li><li><b>Concrete States</b> — <code>IdleState</code>, <code>HasCoinState</code>, <code>DispensingState</code>. Each handles transitions and delegates to the context.</li></ul><p class="learn-p"><b>Proxy types:</b></p><ul class="learn-list"><li><b>Caching Proxy</b> — caches expensive results; returns cached data on repeat calls.</li><li><b>Protection Proxy</b> — checks permissions before forwarding to the real object.</li><li><b>Virtual Proxy</b> — lazy-initializes the real object (e.g., large image placeholder).</li><li><b>Remote Proxy</b> — represents an object in a different address space (RPC/RMI stub).</li><li><b>Logging Proxy</b> — logs all method calls before forwarding.</li></ul><p class="learn-p"><b>Chain of Responsibility:</b></p><ul class="learn-list"><li><b>Handler (abstract)</b> — has <code>setNext()</code> and <code>handle()</code>. Default handle delegates to next handler.</li><li><b>Concrete Handlers</b> — <code>AuthHandler</code>, <code>RateLimitHandler</code>, <code>LoggingHandler</code>. Each decides to process or pass.</li><li><b>Request</b> — the data flowing through the chain.</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>State — Vending Machine (key transitions):</b></p><div class="learn-code">class VendingMachine;\nclass IState {\npublic:\n    virtual void insertCoin(VendingMachine&amp; vm) = 0;\n    virtual void selectProduct(VendingMachine&amp; vm) = 0;\n    virtual void dispense(VendingMachine&amp; vm) = 0;\n    virtual ~IState() = default;\n};\n\nclass IdleState : public IState {\npublic:\n    void insertCoin(VendingMachine&amp; vm) override {\n        cout &lt;&lt; "Coin inserted.";\n        vm.setState(make_unique&lt;HasCoinState&gt;());\n    }\n    void selectProduct(VendingMachine&amp;) override {\n        cout &lt;&lt; "Insert coin first!";\n    }\n    void dispense(VendingMachine&amp;) override {}\n};</div><p class="learn-p"><b>Caching Proxy:</b></p><div class="learn-code">class IDataService {\npublic:\n    virtual string fetch(const string&amp; key) = 0;\n    virtual ~IDataService() = default;\n};\nclass RealDB : public IDataService {\npublic:\n    string fetch(const string&amp; key) override {\n        cout &lt;&lt; "[DB] Expensive query: " &lt;&lt; key;\n        return "data_" + key;\n    }\n};\nclass CachingProxy : public IDataService {\n    RealDB db;\n    unordered_map&lt;string, string&gt; cache;\npublic:\n    string fetch(const string&amp; key) override {\n        auto it = cache.find(key);\n        if (it != cache.end()) {\n            cout &lt;&lt; "[CACHE HIT] " &lt;&lt; key;\n            return it-&gt;second;\n        }\n        string v = db.fetch(key);\n        cache[key] = v;\n        return v;\n    }\n};</div><p class="learn-p"><b>Chain of Responsibility:</b></p><div class="learn-code">class Handler {\n    shared_ptr&lt;Handler&gt; next;\npublic:\n    void setNext(shared_ptr&lt;Handler&gt; h) { next = h; }\n    virtual bool handle(Request&amp; r) {\n        return next ? next-&gt;handle(r) : true;\n    }\n    virtual ~Handler() = default;\n};\nclass AuthHandler : public Handler {\npublic:\n    bool handle(Request&amp; r) override {\n        if (r.token.empty()) {\n            cout &lt;&lt; "[Auth] REJECTED";\n            return false;\n        }\n        cout &lt;&lt; "[Auth] OK";\n        return Handler::handle(r);   // pass to next\n    }\n};</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><ul class="learn-list"><li><b>State vs Strategy</b> — Both encapsulate behaviour in separate classes. State transitions happen <b>internally</b> (the object changes its own state). Strategy is set <b>externally</b> by the client.</li><li><b>State table</b> — For simple state machines, use a transition table (<code>map&lt;{state, event}, nextState&gt;</code>) instead of full State pattern classes.</li><li><b>Proxy vs Decorator</b> — Structurally identical (wrap same interface). Intent differs: Proxy controls access; Decorator adds behaviour.</li><li><b>CoR vs Middleware</b> — Express.js middleware is CoR. Each middleware calls <code>next()</code>. Django middleware, Java servlet filters — all CoR.</li><li><b>CoR vs if-else chain</b> — CoR allows <b>runtime reconfiguration</b> of handler order. If-else is fixed at compile time.</li><li><b>Combining patterns</b> — State + CoR: each state can define a validation chain. Proxy + CoR: proxy that routes through a handler pipeline.</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>State pitfalls:</b><br/>1. <b>State explosion</b> — too many states and transitions become unmanageable. Consider hierarchical state machines (HSM) for complex systems.<br/>2. <b>Shared state</b> — creating new state objects each transition wastes memory. Use Flyweight (shared state instances) for stateless state objects.<br/>3. <b>Transition logic placement</b> — put transitions in the state objects (decentralized) or in the context (centralized)? Decentralized is more OCP-friendly.</div><div class="learn-warn"><b>Proxy pitfalls:</b><br/>1. <b>Cache invalidation</b> — "the two hardest problems in CS." Ensure cached data doesn\'t go stale.<br/>2. <b>Proxy transparency</b> — clients should not know they\'re using a proxy. If the proxy changes behaviour (not just access), it becomes a Decorator.</div><div class="learn-warn"><b>CoR pitfalls:</b><br/>1. <b>Unhandled requests</b> — if no handler processes the request, it silently drops. Consider a final "catch-all" handler.<br/>2. <b>Long chains</b> — too many handlers add latency. Profile and optimize for hot paths.<br/>3. <b>Order dependence</b> — handler order matters. Auth must come before business logic. Document the expected chain order.</div></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Pattern</th><th>Category</th><th>Use When</th><th>Key Benefit</th><th>Example</th></tr><tr><td>State</td><td>Behavioural</td><td>Behaviour depends on internal state</td><td>Eliminates conditionals, OCP for new states</td><td>Vending machine, TCP, order workflow</td></tr><tr><td>Proxy</td><td>Structural</td><td>Control access / caching / lazy init</td><td>Transparent access control</td><td>Caching proxy, auth proxy, lazy image</td></tr><tr><td>CoR</td><td>Behavioural</td><td>Multiple handlers, pipeline processing</td><td>Dynamic, reorderable request processing</td><td>Middleware, approval chain, logging levels</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How does State differ from Strategy?</b><br>A: State transitions are managed internally by the state objects themselves. Strategy is set externally by the client. State objects know about each other (for transitions); strategies are independent.</p><p class="learn-p"><b>Q2: What is the difference between Proxy and Decorator?</b><br>A: Same structure (wrap same interface), different intent. Proxy controls access (cache, auth, lazy init). Decorator adds new behaviour (logging, encryption).</p><p class="learn-p"><b>Q3: Where is Chain of Responsibility used in real systems?</b><br>A: Express.js middleware pipeline, Java servlet filters, Django middleware, Spring interceptors, Unix pipe commands, DOM event bubbling.</p><p class="learn-p"><b>Q4: How do you handle cache invalidation in a Caching Proxy?</b><br>A: TTL-based expiry, write-through invalidation (update cache on write), event-driven invalidation (observer on data source). Choose based on consistency requirements.</p><p class="learn-p"><b>Q5: Can Chain of Responsibility handlers modify the request?</b><br>A: Yes. Each handler can enrich, validate, or transform the request before passing it. This is how middleware adds headers, parses body, etc.</p></div>',
    code: `// ===== State, Proxy & Chain of Responsibility — Enhanced C++ =====
#include <iostream>
#include <string>
#include <memory>
#include <unordered_map>
using namespace std;

// ========== STATE PATTERN — Vending Machine ==========
class VendingMachine;
class IState {
public:
    virtual void insertCoin(VendingMachine& vm) = 0;
    virtual void selectProduct(VendingMachine& vm) = 0;
    virtual void dispense(VendingMachine& vm) = 0;
    virtual string name() const = 0;
    virtual ~IState() = default;
};

class IdleState : public IState {
public:
    void insertCoin(VendingMachine& vm) override;
    void selectProduct(VendingMachine&) override {
        cout << "[Idle] Insert coin first!" << endl;
    }
    void dispense(VendingMachine&) override {}
    string name() const override { return "Idle"; }
};

class HasCoinState : public IState {
public:
    void insertCoin(VendingMachine&) override {
        cout << "[HasCoin] Returning extra coin." << endl;
    }
    void selectProduct(VendingMachine& vm) override;
    void dispense(VendingMachine&) override {}
    string name() const override { return "HasCoin"; }
};

class DispensingState : public IState {
public:
    void insertCoin(VendingMachine&) override { cout << "[Dispensing] Wait..." << endl; }
    void selectProduct(VendingMachine&) override { cout << "[Dispensing] Wait..." << endl; }
    void dispense(VendingMachine& vm) override;
    string name() const override { return "Dispensing"; }
};

class OutOfStockState : public IState {
public:
    void insertCoin(VendingMachine&) override { cout << "[OutOfStock] Refunding." << endl; }
    void selectProduct(VendingMachine&) override { cout << "[OutOfStock] Empty." << endl; }
    void dispense(VendingMachine&) override {}
    string name() const override { return "OutOfStock"; }
};

class VendingMachine {
    unique_ptr<IState> state;
    int stock;
public:
    VendingMachine(int s) : stock(s) { state = make_unique<IdleState>(); }
    void setState(unique_ptr<IState> s) { state = move(s); }
    int getStock() const { return stock; }
    void decrementStock() { --stock; }
    void insertCoin()    { state->insertCoin(*this); }
    void selectProduct() { state->selectProduct(*this); }
    void dispense()      { state->dispense(*this); }
};

void IdleState::insertCoin(VendingMachine& vm) {
    cout << "[Idle] Coin inserted." << endl;
    vm.setState(make_unique<HasCoinState>());
}
void HasCoinState::selectProduct(VendingMachine& vm) {
    if (vm.getStock() > 0) {
        vm.setState(make_unique<DispensingState>());
        vm.dispense();
    } else {
        vm.setState(make_unique<OutOfStockState>());
    }
}
void DispensingState::dispense(VendingMachine& vm) {
    vm.decrementStock();
    cout << "[Dispensing] Product delivered!" << endl;
    vm.setState(vm.getStock() > 0
        ? unique_ptr<IState>(make_unique<IdleState>())
        : unique_ptr<IState>(make_unique<OutOfStockState>()));
}

// ========== PROXY — Caching Proxy ==========
class IDataService {
public:
    virtual string fetch(const string& key) = 0;
    virtual ~IDataService() = default;
};

class RealDB : public IDataService {
public:
    string fetch(const string& key) override {
        cout << "  [DB] Expensive query: " << key << endl;
        return "data_" + key;
    }
};

class CachingProxy : public IDataService {
    RealDB db;
    unordered_map<string, string> cache;
public:
    string fetch(const string& key) override {
        auto it = cache.find(key);
        if (it != cache.end()) {
            cout << "  [CACHE HIT] " << key << endl;
            return it->second;
        }
        string v = db.fetch(key);
        cache[key] = v;
        return v;
    }
};

// ========== CHAIN OF RESPONSIBILITY ==========
struct Request { string user, token, body; int requestCount; };

class Handler {
    shared_ptr<Handler> next;
public:
    void setNext(shared_ptr<Handler> h) { next = h; }
    virtual bool handle(Request& r) {
        return next ? next->handle(r) : true;
    }
    virtual ~Handler() = default;
};

class AuthHandler : public Handler {
public:
    bool handle(Request& r) override {
        if (r.token.empty()) {
            cout << "[Auth] REJECTED — no token" << endl;
            return false;
        }
        cout << "[Auth] OK" << endl;
        return Handler::handle(r);
    }
};

class RateLimitHandler : public Handler {
    int limit;
public:
    RateLimitHandler(int l) : limit(l) {}
    bool handle(Request& r) override {
        if (r.requestCount > limit) {
            cout << "[Rate] REJECTED — limit exceeded" << endl;
            return false;
        }
        cout << "[Rate] OK" << endl;
        return Handler::handle(r);
    }
};

class LoggingHandler : public Handler {
public:
    bool handle(Request& r) override {
        cout << "[Log] " << r.user << ": " << r.body << endl;
        return Handler::handle(r);
    }
};

int main() {
    // State demo
    cout << "=== State Pattern ===" << endl;
    VendingMachine vm(1);
    vm.insertCoin();
    vm.selectProduct();  // dispenses, stock=0
    vm.insertCoin();     // refunded — out of stock

    // Proxy demo
    cout << "\\n=== Proxy Pattern ===" << endl;
    CachingProxy proxy;
    proxy.fetch("user1");   // DB hit
    proxy.fetch("user1");   // CACHE HIT
    proxy.fetch("user2");   // DB hit

    // CoR demo
    cout << "\\n=== Chain of Responsibility ===" << endl;
    auto auth = make_shared<AuthHandler>();
    auto rate = make_shared<RateLimitHandler>(100);
    auto logger = make_shared<LoggingHandler>();
    auth->setNext(rate);
    rate->setNext(logger);

    Request ok{"alice", "tok123", "GET /api", 5};
    auth->handle(ok);

    Request noToken{"bob", "", "GET /api", 1};
    auth->handle(noToken);

    Request rateExceeded{"charlie", "tok456", "GET /api", 200};
    auth->handle(rateExceeded);

    return 0;
}`,
    problems: [
      ["LRU Cache (Proxy/Cache)","https://leetcode.com/problems/lru-cache/","Medium"],
      ["Design Browser History","https://leetcode.com/problems/design-browser-history/","Medium"],
      ["Design Authentication Manager","https://leetcode.com/problems/design-authentication-manager/","Medium"]
    ],
    mcqs: [
      {"q":"In the State pattern, where is transition logic defined?","o":["In the client code","In each concrete state class","In the context class only","In a config file"],"a":1},
      {"q":"Which pattern provides a surrogate to control access to another object?","o":["Decorator","Adapter","Proxy","Facade"],"a":2},
      {"q":"Chain of Responsibility differs from simple if-else because:","o":["It is faster","Handlers can be added/removed/reordered at runtime","It uses less memory","It only works with 3 handlers"],"a":1},
      {"q":"State differs from Strategy because:","o":["State uses inheritance; Strategy uses composition","State transitions are managed internally; Strategy is set externally","State is structural; Strategy is behavioural","State cannot have multiple states"],"a":1},
      {"q":"The structural difference between Proxy and Decorator is:","o":["Proxy uses inheritance; Decorator uses composition","There is no structural difference — only intent differs","Proxy wraps a different interface","Decorator cannot be stacked"],"a":1},
      {"q":"In CoR, if no handler processes a request, the best practice is:","o":["Throw an exception","Silently drop it","Add a catch-all handler at the end of the chain","Return null"],"a":2}
    ]
  },

  {
    t: "Design Splitwise",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Designing a <b>Splitwise-like expense sharing system</b> is a favourite LLD interview question at top tech companies. It tests your ability to model <b>complex financial relationships</b>, apply the <b>Strategy pattern</b> for different split types, handle <b>rounding errors</b> in currency calculations, and implement a <b>debt simplification algorithm</b> that minimizes transactions. The problem touches on graph theory (net balances as flows), numerical precision, and clean API design — all critical for financial software.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">Users create groups, add expenses with different split methods (equal, exact, percentage), and the system tracks who owes whom. The balance sheet maintains pairwise debts, and a simplification algorithm minimizes the number of settlement transactions.</p><div class="learn-code">┌────────────────────── CLASS DIAGRAM ──────────────────────┐\n│                                                           │\n│  User                        Group                       │\n│  ├── id, name, email         ├── id, name               │\n│  └── phone                   ├── members: vector&lt;User*&gt; │\n│                              └── expenses: vector&lt;Expense&gt;\n│                                                           │\n│  Expense                     ISplitStrategy              │\n│  ├── id, description         ├── split(total, users)     │\n│  ├── paidBy: userId          ├── validate(total, users)  │\n│  ├── amount: double          │                           │\n│  └── shares: map&lt;uid,amt&gt;   ├── EqualSplit              │\n│                              ├── ExactSplit              │\n│  BalanceManager              └── PercentSplit            │\n│  ├── balances[A][B]: double                              │\n│  ├── addExpense(Expense)                                 │\n│  ├── showBalance(userId)                                 │\n│  └── simplifyDebts(group)                                │\n└───────────────────────────────────────────────────────────┘\n\n  Expense Flow:\n  Alice pays $300 dinner, split equally among Alice, Bob, Charlie\n  ┌─────────────────────────────────────┐\n  │ Alice paid: $300                    │\n  │ Each share: $100                    │\n  │ Alice owes herself: $0 (skip)       │\n  │ Bob owes Alice: $100                │\n  │ Charlie owes Alice: $100            │\n  └─────────────────────────────────────┘\n\n  Debt Simplification (Greedy):\n  Net: Alice=+200, Bob=-120, Charlie=-80\n  ┌──────────────────────────────────┐\n  │ Bob pays Alice $120              │\n  │ Charlie pays Alice $80           │\n  │ (2 transactions instead of N)    │\n  └──────────────────────────────────┘</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><ul class="learn-list"><li><b>User</b> — id, name, email, phone. Identified by unique userId.</li><li><b>Group</b> — id, name, list of members, list of expenses. Groups scope expense sharing.</li><li><b>Expense</b> — id, description, amount, paidBy (userId), shares (map of userId to amount owed). Created using a split strategy.</li><li><b>ISplitStrategy (Strategy)</b> — interface with <code>split(total, userIds)</code> and <code>validate(total, userIds)</code>.</li><li><b>EqualSplit</b> — divides total equally. Handles rounding by assigning remainder to the last person.</li><li><b>ExactSplit</b> — each user\'s amount is specified explicitly. Validates that amounts sum to total.</li><li><b>PercentSplit</b> — each user pays a percentage. Validates that percentages sum to 100%.</li><li><b>BalanceManager</b> — tracks pairwise debts. <code>balances[A][B] &gt; 0</code> means B owes A. Supports simplification.</li><li><b>ExpenseManager (Singleton)</b> — central manager for creating expenses, querying balances, and simplifying debts.</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>Split Strategies:</b></p><div class="learn-code">class ISplitStrategy {\npublic:\n    virtual unordered_map&lt;string, double&gt;\n        split(double total, const vector&lt;string&gt;&amp; userIds) = 0;\n    virtual bool validate(double total,\n        const vector&lt;string&gt;&amp; userIds) = 0;\n    virtual ~ISplitStrategy() = default;\n};\n\nclass EqualSplit : public ISplitStrategy {\npublic:\n    unordered_map&lt;string, double&gt;\n    split(double total, const vector&lt;string&gt;&amp; userIds) override {\n        unordered_map&lt;string, double&gt; shares;\n        double share = round(total / userIds.size() * 100) / 100;\n        double sum = 0;\n        for (size_t i = 0; i &lt; userIds.size(); i++) {\n            if (i == userIds.size() - 1)\n                shares[userIds[i]] = total - sum; // remainder\n            else\n                shares[userIds[i]] = share;\n            sum += shares[userIds[i]];\n        }\n        return shares;\n    }\n    bool validate(double, const vector&lt;string&gt;&amp; u) override {\n        return !u.empty();\n    }\n};</div><p class="learn-p"><b>Balance tracking and debt simplification:</b></p><div class="learn-code">class BalanceManager {\n    // balances[A][B] &gt; 0 means B owes A\n    unordered_map&lt;string, unordered_map&lt;string, double&gt;&gt; bal;\npublic:\n    void addExpense(const Expense&amp; exp) {\n        string payer = exp.getPaidBy();\n        for (auto&amp; [uid, share] : exp.getShares()) {\n            if (uid == payer) continue;\n            bal[payer][uid] += share;    // uid owes payer\n            bal[uid][payer] -= share;    // symmetric\n        }\n    }\n\n    void simplifyDebts(const vector&lt;string&gt;&amp; members) {\n        // 1. Compute net balance per user\n        unordered_map&lt;string, double&gt; net;\n        // ... compute net from pairwise balances ...\n        // 2. Separate into creditors (+) and debtors (-)\n        // 3. Greedy: match largest creditor with largest debtor\n        //    settle min(credit, debt), repeat\n    }\n};</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><ul class="learn-list"><li><b>Strategy for splits</b> — EqualSplit, ExactSplit, PercentSplit. Adding WeightedSplit or CustomSplit requires only a new class — OCP.</li><li><b>Factory for expenses</b> — <code>ExpenseFactory::create(type, amount, payer, participants)</code> with the right split strategy.</li><li><b>Observer for notifications</b> — notify participants when added to an expense. Async notification via message queue.</li><li><b>Debt simplification variants</b> — Greedy (match largest creditor/debtor) gives O(N log N) with N-1 transactions. Optimal (minimize transactions) is NP-hard (subset-sum). Greedy is practical.</li><li><b>Net balance approach</b> — instead of tracking pairwise debts, compute net per user. Simplification reduces all debts to at most N-1 transactions.</li><li><b>Multi-currency</b> — track currency per expense, convert on display using exchange rates. Complex but realistic extension.</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Rounding errors:</b> Splitting $100 among 3 gives $33.33 each = $99.99 total, not $100. Solution: compute N-1 shares as <code>round(amount/N)</code> and give the last person <code>total - sum_of_others</code>. The payer absorbs the rounding difference. Always mention this in interviews.</div><div class="learn-warn"><b>Other edge cases:</b><br/>1. <b>Self-expense</b> — payer is also a participant. Their share is subtracted from what they paid, so they don\'t owe themselves.<br/>2. <b>Zero balance</b> — after settlement, remove or zero-out the pair entry. Don\'t display "$0.00 owed."<br/>3. <b>Negative amounts</b> — reject expenses with negative amounts or shares.<br/>4. <b>Exact split validation</b> — shares must sum to total. If off by even $0.01, reject.<br/>5. <b>Percent split validation</b> — percentages must sum to 100%. Handle floating-point comparison with epsilon.<br/>6. <b>User not in group</b> — expense participants must be group members. Validate on expense creation.<br/>7. <b>Concurrent expense creation</b> — two users adding expenses simultaneously. BalanceManager updates must be synchronized.</div></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>Time Complexity</th><th>Notes</th></tr><tr><td>Add expense (equal split)</td><td><span class="learn-complexity">O(N) where N = participants</span></td><td>Compute shares + update balances</td></tr><tr><td>Add expense (exact split)</td><td><span class="learn-complexity">O(N)</span></td><td>Validate sum + update balances</td></tr><tr><td>Show balance for user</td><td><span class="learn-complexity">O(P) where P = partners</span></td><td>Iterate user\'s balance map</td></tr><tr><td>Simplify debts (greedy)</td><td><span class="learn-complexity">O(N log N)</span></td><td>Sort creditors + debtors, then linear match</td></tr><tr><td>Optimal debt simplification</td><td><span class="learn-complexity">O(2^N) — NP-hard</span></td><td>Subset-sum / backtracking. Not needed in practice.</td></tr><tr><td>Space for balances</td><td><span class="learn-complexity">O(N^2) worst case</span></td><td>Pairwise balance map</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you handle rounding when splitting $100 among 3 people?</b><br>A: Compute share = round($100/3) = $33.33 for the first two. The third person gets $100 - $66.66 = $33.34. The last person absorbs the remainder.</p><p class="learn-p"><b>Q2: What design pattern handles different split types?</b><br>A: Strategy pattern. <code>ISplitStrategy</code> with <code>EqualSplit</code>, <code>ExactSplit</code>, <code>PercentSplit</code>. Adding a new split type requires only a new strategy class — no modification to existing code.</p><p class="learn-p"><b>Q3: How does debt simplification work?</b><br>A: 1) Compute net balance per user. 2) Separate into creditors (positive) and debtors (negative). 3) Greedy: match largest creditor with largest debtor, settle min(credit, debt), repeat. Produces at most N-1 transactions.</p><p class="learn-p"><b>Q4: Is minimizing transactions NP-hard?</b><br>A: Yes, the exact minimum is NP-hard (reducible to subset-sum). But the greedy approach gives at most N-1 transactions, which is good enough for practical purposes.</p><p class="learn-p"><b>Q5: How do you validate an ExactSplit?</b><br>A: Sum all specified amounts and check <code>abs(sum - total) &lt; epsilon</code>. Use epsilon (e.g., 0.01) because floating-point comparison with == is unreliable.</p><p class="learn-p"><b>Q6: How would you extend this for multi-currency?</b><br>A: Store currency per expense. Maintain balances per currency pair, or convert to a base currency using exchange rates at expense creation time. Display balances in the user\'s preferred currency.</p></div>',
    code: `// ===== Design Splitwise — Enhanced C++ Implementation =====
#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include <cmath>
#include <algorithm>
using namespace std;

// ---------- User ----------
class User {
    string id, name, email;
public:
    User(string id, string name, string email)
        : id(id), name(name), email(email) {}
    string getId() const { return id; }
    string getName() const { return name; }
};

// ---------- Split Strategy ----------
class ISplitStrategy {
public:
    virtual unordered_map<string, double>
        split(double total, const vector<string>& userIds) = 0;
    virtual bool validate(double total, const vector<string>& userIds) = 0;
    virtual ~ISplitStrategy() = default;
};

class EqualSplit : public ISplitStrategy {
public:
    unordered_map<string, double>
    split(double total, const vector<string>& userIds) override {
        unordered_map<string, double> shares;
        double share = round(total / userIds.size() * 100) / 100;
        double sum = 0;
        for (size_t i = 0; i < userIds.size(); i++) {
            if (i == userIds.size() - 1)
                shares[userIds[i]] = total - sum;
            else
                shares[userIds[i]] = share;
            sum += shares[userIds[i]];
        }
        return shares;
    }
    bool validate(double, const vector<string>& users) override {
        return !users.empty();
    }
};

class ExactSplit : public ISplitStrategy {
    unordered_map<string, double> exactAmounts;
public:
    void setAmount(const string& userId, double amt) {
        exactAmounts[userId] = amt;
    }
    unordered_map<string, double>
    split(double, const vector<string>&) override {
        return exactAmounts;
    }
    bool validate(double total, const vector<string>&) override {
        double sum = 0;
        for (auto& [_, amt] : exactAmounts) sum += amt;
        return abs(sum - total) < 0.01;
    }
};

class PercentSplit : public ISplitStrategy {
    unordered_map<string, double> percents;
public:
    void setPercent(const string& userId, double pct) {
        percents[userId] = pct;
    }
    unordered_map<string, double>
    split(double total, const vector<string>&) override {
        unordered_map<string, double> shares;
        for (auto& [uid, pct] : percents)
            shares[uid] = round(total * pct / 100 * 100) / 100;
        return shares;
    }
    bool validate(double, const vector<string>&) override {
        double sum = 0;
        for (auto& [_, pct] : percents) sum += pct;
        return abs(sum - 100.0) < 0.01;
    }
};

// ---------- Expense ----------
class Expense {
    static int nextId;
    int id;
    string description, paidBy;
    double amount;
    unordered_map<string, double> shares;
public:
    Expense(string desc, string payer, double amt,
            unique_ptr<ISplitStrategy> strategy,
            const vector<string>& participants)
        : id(nextId++), description(desc), paidBy(payer), amount(amt) {
        if (!strategy->validate(amt, participants))
            throw invalid_argument("Invalid split");
        shares = strategy->split(amt, participants);
    }
    string getPaidBy() const { return paidBy; }
    const unordered_map<string, double>& getShares() const { return shares; }
    double getAmount() const { return amount; }
    string getDescription() const { return description; }
};
int Expense::nextId = 1;

// ---------- Balance Manager ----------
class BalanceManager {
    unordered_map<string, unordered_map<string, double>> balances;
public:
    void addExpense(const Expense& exp) {
        string payer = exp.getPaidBy();
        for (auto& [userId, share] : exp.getShares()) {
            if (userId == payer) continue;
            balances[payer][userId] += share;
            balances[userId][payer] -= share;
        }
    }

    void showBalance(const string& userId) {
        cout << "Balances for " << userId << ":" << endl;
        if (balances.find(userId) == balances.end()) {
            cout << "  No balances." << endl;
            return;
        }
        for (auto& [other, amount] : balances[userId]) {
            if (abs(amount) < 0.01) continue;
            if (amount > 0)
                cout << "  " << other << " owes you $"
                     << round(amount * 100) / 100 << endl;
            else
                cout << "  You owe " << other << " $"
                     << round(-amount * 100) / 100 << endl;
        }
    }

    void simplifyDebts(const vector<string>& groupMembers) {
        unordered_map<string, double> net;
        for (auto& uid : groupMembers) net[uid] = 0;
        for (auto& uid : groupMembers)
            for (auto& [other, amt] : balances[uid])
                net[uid] += amt;

        vector<pair<double, string>> creditors, debtors;
        for (auto& [uid, bal] : net) {
            if (bal > 0.01) creditors.push_back({bal, uid});
            else if (bal < -0.01) debtors.push_back({-bal, uid});
        }
        sort(creditors.rbegin(), creditors.rend());
        sort(debtors.rbegin(), debtors.rend());

        cout << "\\nSimplified transactions:" << endl;
        int i = 0, j = 0;
        while (i < (int)creditors.size() && j < (int)debtors.size()) {
            double settle = min(creditors[i].first, debtors[j].first);
            cout << "  " << debtors[j].second << " pays "
                 << creditors[i].second << " $" << settle << endl;
            creditors[i].first -= settle;
            debtors[j].first -= settle;
            if (creditors[i].first < 0.01) i++;
            if (debtors[j].first < 0.01) j++;
        }
    }
};

int main() {
    User alice("u1", "Alice", "alice@mail.com");
    User bob("u2", "Bob", "bob@mail.com");
    User charlie("u3", "Charlie", "charlie@mail.com");
    vector<string> group = {"u1", "u2", "u3"};

    BalanceManager bm;

    // Expense 1: Alice pays $300, equal split
    auto eq = make_unique<EqualSplit>();
    Expense e1("Dinner", "u1", 300, move(eq), group);
    bm.addExpense(e1);
    cout << "Added: Alice paid $300 for Dinner (equal split)" << endl;

    // Expense 2: Bob pays $120, exact split
    auto ex = make_unique<ExactSplit>();
    ex->setAmount("u1", 40);
    ex->setAmount("u2", 40);
    ex->setAmount("u3", 40);
    Expense e2("Cab", "u2", 120, move(ex), group);
    bm.addExpense(e2);
    cout << "Added: Bob paid $120 for Cab (exact split)" << endl;

    cout << endl;
    bm.showBalance("u1");
    cout << endl;
    bm.showBalance("u2");
    cout << endl;
    bm.showBalance("u3");

    bm.simplifyDebts(group);
    return 0;
}`,
    problems: [
      ["Optimal Account Balancing","https://leetcode.com/problems/optimal-account-balancing/","Hard"],
      ["Minimize Rounding Error to Meet Target","https://leetcode.com/problems/minimize-rounding-error-to-meet-target/","Medium"],
      ["Split Array Into Consecutive Subsequences","https://leetcode.com/problems/split-array-into-consecutive-subsequences/","Medium"],
      ["Evaluate Division","https://leetcode.com/problems/evaluate-division/","Medium"]
    ],
    mcqs: [
      {"q":"In Splitwise, different split methods (Equal, Exact, Percent) are best modeled using:","o":["Inheritance only","Strategy pattern","Singleton pattern","Observer pattern"],"a":1},
      {"q":"Minimizing the number of transactions to settle debts in a group is:","o":["O(n) solvable with sorting","NP-hard in general, greedy is a good approximation","Always solved with 2 transactions","Not possible"],"a":1},
      {"q":"When splitting $100 equally among 3 people, the rounding issue is best handled by:","o":["Ignoring the extra cent","Having the last person absorb the remainder","Rounding up all shares","Using integers only"],"a":1},
      {"q":"The BalanceManager tracks balances[A][B] > 0 meaning:","o":["A owes B","B owes A","A and B are even","A paid B"],"a":1},
      {"q":"ExactSplit validation should check that:","o":["All amounts are positive","Specified amounts sum to the total (within epsilon)","The number of users is even","The payer is included"],"a":1},
      {"q":"The greedy debt simplification algorithm produces at most:","o":["N transactions","N-1 transactions","N^2 transactions","2 transactions"],"a":1},
            {"q": "Which design pattern allows adding WeightedSplit without modifying existing split classes?", "o": ["Singleton", "Open-Closed Principle via Strategy pattern", "Observer", "Proxy"], "a": 1},
            {"q": "In PercentSplit validation, what must be checked before creating the expense?", "o": ["All percentages are equal", "Percentages sum to 100% (within epsilon)", "Number of participants is even", "The payer has the highest percentage"], "a": 1}]
  },

      ]
    },
    {
      id: "hld", t: "HLD Fundamentals",
      topics: [
        {
    t: "Scalability Fundamentals",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Imagine you are the lead engineer at a startup that just got featured on the front page of Hacker News. Your single PostgreSQL server, comfortably handling 500 requests per second, is suddenly drowning under 50,000 req/s. Pages time out, the database connection pool is exhausted, and your on-call phone is buzzing non-stop. This is the exact scenario interviewers explore: <b>how do you evolve an architecture from a prototype to a system serving millions?</b></p><p class="learn-p">Twitter went from a monolithic Ruby on Rails app to a distributed system handling 500M+ tweets per day and 600M+ read requests per second. Instagram ran on a single Django server for months before scaling to 25M users. Understanding scalability means knowing <b>when</b> to scale, <b>what</b> to scale, and the trade-offs of each approach.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">Scalability is the ability of a system to handle a growing amount of work by adding resources while maintaining acceptable performance. Performance is measured in requests per second (QPS), latency (p50, p95, p99), concurrent users, or data volume. There are two fundamental approaches:</p><table class="learn-table"><tr><th>Strategy</th><th>How</th><th>Pros</th><th>Cons</th><th>Ceiling</th></tr><tr><td><b>Vertical Scaling (Scale Up)</b></td><td>Bigger machine: more CPU, RAM, disk</td><td>Simple, no code changes, no distributed complexity</td><td>Hardware ceiling, single point of failure, expensive</td><td>~256 cores, ~12 TB RAM, ~100 Gbps NIC</td></tr><tr><td><b>Horizontal Scaling (Scale Out)</b></td><td>More machines behind a load balancer</td><td>Near-linear capacity growth, fault-tolerant</td><td>Complexity: statelessness, data partitioning, coordination</td><td>Practically unlimited</td></tr></table><div class="learn-code">Single-Server Architecture:\n[Client] --&gt; [DNS] --&gt; [Single Server]\n                         |-- Web Server (Nginx)\n                         |-- App Server (Node/Java)\n                         |-- Database (PostgreSQL)\n                         |-- Cache (in-process)\n\nHorizontally Scaled Architecture:\n[Clients] --&gt; [CDN] --&gt; [Load Balancer (L7)]\n                            |--&gt; [App Server 1] --|\n                            |--&gt; [App Server 2] --|--&gt; [Cache Cluster (Redis)]\n                            |--&gt; [App Server N] --|        |\n                                                         v\n                                                  [DB Leader (writes)]\n                                                   /        \\\n                                           [Follower 1]  [Follower 2]\n                                             (reads)       (reads)</div><p class="learn-p"><b>Key insight:</b> Vertical scaling hits hard walls. A single server maxes out at ~256 CPU cores, ~12 TB RAM. AWS\'s largest instance (u-24tb1.112xlarge) costs $218/hour. Beyond that ceiling, or for fault tolerance, you <b>must</b> go horizontal.</p></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p">Horizontal scaling requires mastering several foundational components:</p><ul class="learn-list"><li><b>Stateless Application Servers:</b> Any server can handle any request because no server stores user-specific data locally. Sessions are externalized to Redis or encoded in JWTs.</li><li><b>Load Balancers:</b> Distribute requests across servers. L4 (transport) for raw throughput, L7 (application) for content-based routing.</li><li><b>Database Replication:</b> Leader-follower for read scaling (most apps are 100:1 read:write). Leader-leader for multi-DC writes.</li><li><b>Database Sharding:</b> Split data across multiple DB instances by range, hash, or consistent hashing.</li><li><b>Caching Layers:</b> In-process (Caffeine, &lt;1ms), distributed (Redis, 1-2ms), CDN (edge, &lt;20ms global).</li><li><b>Message Queues:</b> Kafka, RabbitMQ decouple producers from consumers, enabling async processing and buffering spikes.</li><li><b>Service Mesh / Microservices:</b> Break monolith into independently deployable services (user-service, order-service, etc.).</li></ul><div class="learn-tip"><b>Tip:</b> Start vertical (simple), plan horizontal (inevitable). Most successful startups begin with a monolith on a single box and add horizontal components as bottlenecks emerge. Premature scaling introduces complexity without benefit.</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Let\'s walk through scaling a social media app from 1K to 10M DAU, step by step:</p><ol class="learn-list"><li><b>1K DAU (~1 req/s):</b> Single server running Nginx + Node.js + PostgreSQL. Total cost: $50/month on a VPS. No scaling needed.</li><li><b>10K DAU (~10 req/s):</b> Separate the database onto its own server. Add Redis for session storage. Two servers, ~$200/month.</li><li><b>100K DAU (~100 req/s):</b> Add a load balancer with 2-3 app servers. Set up PostgreSQL read replicas. Introduce CDN for static assets. Latency drops from 200ms to 50ms for static content.</li><li><b>1M DAU (~1,000 req/s, peak ~5,000):</b> Add Redis caching layer (95% hit rate reduces DB load to 50 req/s). Move to managed services (RDS, ElastiCache). Introduce background job queue (Sidekiq/Bull) for emails, notifications.</li><li><b>10M DAU (~10,000 req/s, peak ~50,000):</b> Shard the database by user_id. Move to microservices architecture. Implement rate limiting. Add monitoring (Prometheus, Grafana). The team grows from 3 to 30 engineers.</li></ol><div class="learn-code">Cost Progression:\n  1K DAU:  $50/mo   (1 server)\n 10K DAU:  $200/mo  (2 servers)\n100K DAU:  $2K/mo   (5 servers + CDN)\n  1M DAU:  $20K/mo  (15 servers + managed services)\n 10M DAU:  $200K/mo (50+ servers + dedicated infra team)</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Pattern</th><th>Approach</th><th>When to Use</th><th>Trade-off</th></tr><tr><td><b>Monolith</b></td><td>Single deployable unit</td><td>Early stage, small team (&lt;10 devs)</td><td>Simple but becomes a bottleneck as team grows</td></tr><tr><td><b>Microservices</b></td><td>Independent services per domain</td><td>Large team, need independent deployments</td><td>Operational complexity, distributed debugging</td></tr><tr><td><b>Serverless</b></td><td>Functions as a service (Lambda)</td><td>Bursty workloads, event-driven</td><td>Cold starts (100-500ms), vendor lock-in, 15-min limit</td></tr><tr><td><b>CQRS</b></td><td>Separate read and write models</td><td>Read-heavy with complex queries</td><td>Eventual consistency between read/write stores</td></tr><tr><td><b>Event Sourcing</b></td><td>Store events, derive state</td><td>Audit trails, financial systems</td><td>Complex replay, eventual consistency</td></tr></table><p class="learn-p"><b>Stateful vs Stateless:</b> Horizontal scaling requires stateless application servers. Three approaches to externalize state: (1) <b>Centralized session store</b> (Redis) with O(1) lookup, (2) <b>Client-side tokens</b> (JWT) with no server-side state but revocation challenges, (3) <b>Sticky sessions</b> at the LB level (simple but creates uneven load and fails on server death).</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Cascading Failure:</b> Your cache goes down. Normally it absorbs 95% of traffic (5K of 100K req/s reach the DB). Now 100K req/s hit the DB directly -- a 20x spike. The DB dies, taking the entire system offline. Mitigation: cache replication (Redis Sentinel/Cluster), circuit breakers, and graceful degradation.</div><div class="learn-warn"><b>Split-Brain During Failover:</b> The leader DB appears dead (network partition), a follower is promoted. The old leader comes back -- now two leaders accept writes simultaneously. Data diverges permanently. Prevention: fencing tokens, epoch numbers, or consensus algorithms (Raft/Paxos).</div><ul class="learn-list"><li><b>Thundering Herd:</b> A popular cache key expires, 10K simultaneous requests flood the DB. Fix: cache locking (SETNX), probabilistic early refresh, or never-expire with background refresh.</li><li><b>Connection Pool Exhaustion:</b> 20 app servers x 100 DB connections = 2,000 connections. PostgreSQL default max is 100. Fix: PgBouncer connection pooler, or reduce per-server pool size.</li><li><b>Replication Lag:</b> A user updates their profile, then immediately views it routed to a stale follower. They see old data. Fix: read-after-write consistency (read your own writes from the leader).</li><li><b>Hot Shards:</b> Celebrity user with 100M followers causes one shard to receive 100x the writes. Fix: further sub-sharding or dedicated "hot" partition infrastructure.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Component</th><th>Single Server Capacity</th><th>Scaling Strategy</th><th>Complexity</th></tr><tr><td>Web/App Server</td><td>5,000-10,000 QPS</td><td>Horizontal (stateless, behind LB)</td><td>Low</td></tr><tr><td>Redis Cache</td><td>100,000 QPS</td><td>Redis Cluster (hash slots)</td><td>Medium</td></tr><tr><td>PostgreSQL (OLTP)</td><td>5,000-10,000 QPS</td><td>Read replicas + sharding</td><td>High</td></tr><tr><td>Kafka Broker</td><td>200,000-500,000 msg/s</td><td>Add brokers + partitions</td><td>Medium</td></tr><tr><td>Elasticsearch</td><td>1,000-5,000 QPS (search)</td><td>Sharding + replicas</td><td>High</td></tr></table><table class="learn-table"><tr><th>Availability Target</th><th>Downtime/Year</th><th>Architecture Required</th></tr><tr><td>99% (two nines)</td><td>3.65 days</td><td>Single server with manual recovery</td></tr><tr><td>99.9% (three nines)</td><td>8.76 hours</td><td>Redundant servers with automated failover</td></tr><tr><td>99.99% (four nines)</td><td>52.6 minutes</td><td>Multi-AZ, no single points of failure</td></tr><tr><td>99.999% (five nines)</td><td>5.26 minutes</td><td>Multi-region, active-active</td></tr></table><p class="learn-p"><b>Availability math:</b> Components in series multiply: 5 components at 99.9% each = 0.999^5 = 99.5%. Adding redundancy: each component with failover = 1 - (1-0.999)^2 = 99.9999%. Series of 5: 99.9995%.</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Walk me through scaling a system from 100 to 100K req/s.</b><br>A: Start by identifying the bottleneck (CPU, memory, DB, network). Add caching (95% hit rate reduces DB load 20x). Add read replicas (scale reads). Horizontally scale stateless app servers behind an LB. Shard the database for write scaling. Introduce CDN for static content. Add async processing via message queues for non-critical paths.</p><p class="learn-p"><b>Q2: When would you choose vertical over horizontal scaling?</b><br>A: Vertical when: early stage (simplicity &gt; scalability), your DB is relational and hard to shard, the workload fits in one machine\'s capacity. Horizontal when: you need fault tolerance, the workload exceeds one machine, you need geographic distribution, or the team needs independent deployability.</p><p class="learn-p"><b>Q3: How do you handle state in a horizontally scaled system?</b><br>A: Externalize all state: sessions in Redis (O(1) lookup, ~1ms), user data in a shared DB, file uploads in object storage (S3). Application servers become stateless -- any server can handle any request. JWT tokens can encode session data client-side but are harder to revoke.</p><p class="learn-p"><b>Q4: Your database is the bottleneck at 10K writes/s. What do you do?</b><br>A: (1) Write-behind caching to batch writes. (2) Shard by user_id with consistent hashing. (3) Use an append-only log (Kafka) as the write buffer, consumers update the DB asynchronously. (4) Switch to a write-optimized store (Cassandra with LSM trees). (5) CQRS: separate write store from read store.</p><p class="learn-p"><b>Q5: How does Netflix handle 200M concurrent streams?</b><br>A: CDN (Open Connect) pre-positions content at ISP edge servers. Microservices architecture (700+ services). Hystrix circuit breakers for fault isolation. Chaos engineering (Chaos Monkey) to test resilience. Regional failover with active-active multi-region deployment.</p><p class="learn-p"><b>Q6: What is backpressure and why does it matter?</b><br>A: Backpressure is the mechanism to push back against excessive load. Without it, a traffic spike overwhelms one component, queues grow, memory exhausts, and the server OOMs -- cascading through the entire system. Techniques: load shedding (503), rate limiting (per-client caps), adaptive concurrency, circuit breakers.</p><p class="learn-p"><b>Q7: How do you calculate if one database can handle your load?</b><br>A: Estimate QPS = DAU x actions_per_user / 86,400. Peak = 3-5x average. Compare against DB capacity (~5-10K QPS for PostgreSQL OLTP). If peak QPS &gt; single DB capacity, you need read replicas (for reads) or sharding (for writes). Also check storage: rows x row_size x retention period.</p></div>',
    code: `// === Scalability Architecture Patterns ===

// 1. Basic single-server setup
Client -> DNS -> Single Server (Web + App + DB)

// 2. Separated tiers with horizontal scaling
Client -> DNS -> Load Balancer
                    |-> Web Server 1  --|
                    |-> Web Server 2  --|-> Cache (Redis Cluster)
                    |-> Web Server N  --|     |
                                             v
                                     DB Leader (writes)
                                      /     \\
                              DB Follower 1  DB Follower 2
                                  (reads)      (reads)

// 3. Stateless server with externalized session
app.get('/dashboard', async (req, res) => {
  // Session fetched from Redis, not local memory
  const session = await redis.get(\`session:\${req.cookies.sid}\`);
  if (!session) return res.redirect('/login');
  // ANY server can handle this request -- true horizontal scaling
  const user = JSON.parse(session);
  res.render('dashboard', { user });
});

// 4. Database sharding by user_id
function getShard(userId, numShards) {
  return murmurHash(userId) % numShards;
}
// With consistent hashing: adding a shard moves ~1/N keys
// Without: adding a shard moves ~(N-1)/N keys

// 5. Cache-aside pattern (most common)
async function getUser(userId) {
  const cacheKey = \`user:\${userId}\`;
  let user = await redis.get(cacheKey);
  if (user) return JSON.parse(user);       // cache HIT

  user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  await redis.setex(cacheKey, 300, JSON.stringify(user)); // 5 min TTL
  return user;                             // cache MISS -> fill cache
}

// 6. Availability calculation
// Components in series: A_total = A1 * A2 * ... * An
// 5 components at 99.9% each:
//   0.999^5 = 99.5% (too low for most SLAs)
// Add redundancy per component:
//   Each: 1 - (1-0.999)^2 = 99.9999%
//   Series of 5: 0.999999^5 ≈ 99.9995%

// 7. Back-of-envelope: scaling for 10M DAU
// Read:write = 100:1
// Avg QPS  = 10M * 10 req/day / 86400 ≈ 1,157 req/s
// Peak QPS = 5x average ≈ 5,800 req/s
// Peak reads  ≈ 5,742 req/s  (need 1-2 read replicas)
// Peak writes ≈ 58 req/s     (single leader is fine)

// 8. Backpressure: rate limiter with token bucket
class TokenBucketRateLimiter {
  constructor(capacity, refillRate) {
    this.tokens = capacity;
    this.capacity = capacity;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }

  allow() {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false; // rate limited (503)
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}`,
    problems: [
      ["Scale From Zero to Millions of Users","https://bytebytego.com/courses/system-design-interview/scale-from-zero-to-millions-of-users","Medium"],
      ["Design a URL Shortener (Scaling Focus)","https://codemia.io/system-design","Medium"],
      ["System Design Primer: Scalability","https://github.com/donnemartin/system-design-primer","Hard"],
      ["Guided System Design Practice","https://www.hellointerview.com/practice/system-design","Hard"]
    ],
    mcqs: [
      {"q":"A system has 5 components in series, each with 99.9% availability. What is the overall availability?","o":["99.9%","99.5%","99.95%","95%"],"a":1},
      {"q":"Which scaling approach requires the application to be stateless?","o":["Vertical scaling","Horizontal scaling","Both","Neither"],"a":1},
      {"q":"With hash(key) % 4 sharding, adding a 5th shard requires moving approximately what percentage of data?","o":["20%","25%","50%","80%"],"a":3},
      {"q":"What is the primary risk of a cache crash in a system with 95% cache hit ratio?","o":["Data loss in cache","20x load spike on the database","Stale data served to users","Session invalidation"],"a":1},
      {"q":"A single PostgreSQL server with proper indexing can typically handle approximately:","o":["500 QPS","5,000-10,000 QPS","100,000 QPS","1,000,000 QPS"],"a":1},
      {"q":"Which pattern best describes Netflix's approach to fault isolation across 700+ microservices?","o":["Monolithic error handling","Circuit breakers (Hystrix)","Global exception handler","Retry with exponential backoff only"],"a":1},
      {"q":"When should you choose vertical scaling over horizontal scaling?","o":["When you need fault tolerance","When simplicity matters and workload fits one machine","When you need geographic distribution","When the team has 50+ developers"],"a":1},
      {"q":"In a stateless architecture, where should user sessions be stored?","o":["In application server memory","On the local filesystem","In a centralized store like Redis or as client-side JWTs","In the load balancer's memory"],"a":2}
    ],
  },
  {
    t: "Caching & CDN Deep Dive",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Facebook serves 2 billion users and handles over 10 million requests per second. Without caching, every single request would hit their database cluster -- an impossible load. Their Memcached layer handles ~75% of all reads, and their TAO (The Associations and Objects) cache layer handles another 20%. Only ~5% of requests actually touch the database. <b>Caching is the single most impactful performance optimization in system design.</b></p><p class="learn-p">Interviewers probe your understanding of caching deeply: not just "add Redis," but <b>which caching pattern</b>, <b>how to handle invalidation</b>, <b>what happens when the cache fails</b>, and <b>how to prevent thundering herds</b>. These are the questions that separate senior engineers from juniors.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">A cache stores frequently accessed data in a faster storage layer (RAM vs disk). The fundamental metric is the <b>cache hit ratio</b>: the percentage of requests served from cache. A 95% hit ratio means the database sees only 5% of total traffic -- a 20x reduction.</p><div class="learn-code">Multi-Level Cache Architecture:\n\n[Client Browser]\n    |-- L0: Browser Cache (HTTP Cache-Control headers)\n    v\n[CDN Edge Server]\n    |-- L1: CDN Cache (200+ global PoPs, &lt;20ms latency)\n    v\n[API Gateway / Reverse Proxy]\n    |-- L2: Proxy Cache (Nginx/Varnish, shared across routes)\n    v\n[Application Server]\n    |-- L3: In-Process Cache (Caffeine/Guava, 100MB, &lt;1ms)\n    v\n[Distributed Cache]\n    |-- L4: Redis/Memcached Cluster (10-100GB, 1-2ms)\n    v\n[Database]\n    |-- L5: DB Buffer Pool (InnoDB buffer pool, OS page cache)\n    v\n[Disk (SSD/HDD)]</div><p class="learn-p">Five core caching patterns define how data flows between cache and database:</p><table class="learn-table"><tr><th>Pattern</th><th>Read Flow</th><th>Write Flow</th><th>Consistency</th><th>Best For</th></tr><tr><td><b>Cache-Aside</b></td><td>App checks cache; miss: query DB, fill cache</td><td>App writes DB, invalidates cache</td><td>Eventual (stale until invalidated)</td><td>General purpose, read-heavy</td></tr><tr><td><b>Read-Through</b></td><td>Cache itself fetches from DB on miss</td><td>App writes DB, cache auto-refreshes</td><td>Eventual</td><td>Simpler app code, ORM-friendly</td></tr><tr><td><b>Write-Through</b></td><td>Same as read-through</td><td>Write to cache AND DB synchronously</td><td>Strong (both updated atomically)</td><td>Strong consistency required</td></tr><tr><td><b>Write-Behind</b></td><td>Same as read-through</td><td>Write to cache, async flush to DB</td><td>Eventual (risk: data loss on crash)</td><td>Write-heavy (analytics counters)</td></tr><tr><td><b>Write-Around</b></td><td>Same as cache-aside</td><td>Write directly to DB, skip cache</td><td>Eventual</td><td>Data written once, rarely re-read</td></tr></table></div><div class="learn-section"><div class="learn-h">Building Blocks</div><ul class="learn-list"><li><b>Redis:</b> In-memory data structure store. Supports strings, hashes, lists, sets, sorted sets. Single-threaded (no lock contention), ~100K ops/sec per instance. Redis Cluster for horizontal scaling (16,384 hash slots). Redis Sentinel for HA failover.</li><li><b>Memcached:</b> Simpler, multi-threaded, slightly faster for plain key-value. No persistence, no data structures beyond strings. Used by Facebook for their massive cache layer.</li><li><b>CDN (CloudFront, Akamai, Fastly):</b> 200+ edge locations caching static assets. Reduces latency from 200ms (cross-ocean) to &lt;20ms (nearby edge). Two modes: Pull (fetch on first request) and Push (pre-upload content).</li><li><b>Bloom Filters:</b> Probabilistic data structure. Can tell you if a key <b>definitely does not exist</b> (no false negatives). ~10 bits per element for 1% false positive rate. 10M keys = ~12MB. Used to defend against cache penetration.</li><li><b>Eviction Policies:</b> LRU (least recently used -- temporal locality), LFU (least frequently used -- stable hot set), ARC (adaptive -- self-tunes between recency and frequency), TTL (time-to-live expiry).</li><li><b>Consistent Hashing:</b> Used by cache clusters to distribute keys across nodes. Adding/removing a node moves only ~1/N keys instead of ~(N-1)/N with modular hashing.</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Let\'s trace a cache-aside read and write for a product catalog (e-commerce site with 10M products):</p><ol class="learn-list"><li><b>Read (cache hit):</b> User requests product ID 42. App computes cache key "product:42". Redis.GET("product:42") returns the cached JSON in 1ms. Total latency: ~5ms. The database is never touched.</li><li><b>Read (cache miss):</b> User requests product ID 99999. Redis.GET("product:99999") returns null. App queries PostgreSQL: SELECT * FROM products WHERE id = 99999 (10ms). App writes to Redis: SETEX("product:99999", 300, json) with 5-minute TTL. Returns data to user. Total latency: ~15ms. Subsequent requests for product 99999 will be cache hits for 5 minutes.</li><li><b>Write (invalidation):</b> Admin updates product 42\'s price from $99 to $89. App writes to PostgreSQL: UPDATE products SET price = 89 WHERE id = 42. App invalidates cache: Redis.DEL("product:42"). The next read will be a cache miss and will fetch the fresh $89 price.</li><li><b>Why invalidate, not update?</b> If two concurrent writes (price to $89 and $79) both try to update the cache, a race condition can leave the cache with $89 while the DB has $79. Invalidation avoids this: the next read always fetches the true DB state.</li></ol><div class="learn-code">Invalidation Race Condition (if you UPDATE cache instead of DELETE):\nThread A: UPDATE DB price=89 ... UPDATE cache price=89\nThread B: UPDATE DB price=79 ... UPDATE cache price=79\nPossible interleaving:\n  A: DB=89, B: DB=79, A: cache=89, B: cache=79  ✓ correct\n  A: DB=89, B: DB=79, B: cache=79, A: cache=89  ✗ DB=79, cache=89!\nWith DELETE instead:\n  A: DB=89, B: DB=79, DEL cache, DEL cache  ✓ next read gets DB=79</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><p class="learn-p"><b>Cache Invalidation Strategies</b> (Phil Karlton: "the two hardest problems in CS are cache invalidation and naming things"):</p><table class="learn-table"><tr><th>Strategy</th><th>How</th><th>Latency</th><th>Complexity</th><th>Best For</th></tr><tr><td><b>TTL-based</b></td><td>Each entry auto-expires after N seconds</td><td>Up to TTL seconds stale</td><td>Simple</td><td>Tolerance for brief staleness</td></tr><tr><td><b>Event-based</b></td><td>Publish invalidation event on write (Kafka/SNS)</td><td>Near-real-time (~100ms)</td><td>Complex</td><td>Microservices, multi-node caches</td></tr><tr><td><b>Version-based</b></td><td>Version number in cache key; increment on write</td><td>Instant (old keys unreachable)</td><td>Medium</td><td>Immutable content, static assets</td></tr><tr><td><b>Lease-based</b></td><td>Cache grants a lease; writer must acquire lease to update</td><td>Instant</td><td>Complex</td><td>Facebook TAO (thundering herd prevention)</td></tr></table><p class="learn-p"><b>CDN Strategies:</b></p><ul class="learn-list"><li><b>Pull CDN:</b> CDN fetches from origin on first cache miss. Simpler, good for long-tail content (e-commerce with millions of products). First user sees higher latency.</li><li><b>Push CDN:</b> You upload content proactively to CDN. Good for known popular content (Netflix pre-positions movies at edge servers before release day).</li><li><b>Stale-While-Revalidate:</b> Serve stale content immediately while fetching fresh content in the background. User gets fast response; cache updates asynchronously. Best of both worlds for non-critical-freshness data.</li><li><b>Content-hashed URLs:</b> Filenames like app.a1b2c3.js change when content changes. Set CDN TTL to 1 year. Deploying a new version = new filename = new cache entry. Never worry about invalidation for static assets.</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Thundering Herd / Cache Stampede:</b> A popular cache key (e.g., homepage feed viewed 100K times/minute) expires. Thousands of simultaneous requests miss the cache and flood the database. The DB, normally handling 5% of traffic, gets a 20x spike and dies. Solutions: (1) Cache locking with Redis SETNX -- only one request rebuilds, others wait. (2) Probabilistic early refresh -- each request has a small chance of refreshing before TTL. (3) Never-expire with background refresh -- guaranteed fast but slightly stale.</div><div class="learn-warn"><b>Cache Penetration:</b> Requests for non-existent keys always miss the cache and hit the DB. An attacker can exploit this by querying user_id=-1, -2, -3, etc. Defenses: (1) Cache null values with short TTL (60s). (2) Bloom filter at the API layer -- reject keys that definitely don\'t exist. (3) Input validation -- reject obviously invalid keys.</div><div class="learn-warn"><b>Cache Avalanche:</b> Many cache keys expire at the same time (e.g., all set with the same TTL at startup). The DB gets a sudden spike. Fix: add random jitter to TTLs (e.g., 300 +/- 30 seconds).</div><ul class="learn-list"><li><b>Cold Start:</b> After a restart, the cache is empty and the DB takes the full load. Pre-warm by replaying recent access logs or loading the top-N most popular keys before routing production traffic.</li><li><b>Stale Read After Write:</b> In cache-aside, there\'s a brief window between DB write and cache invalidation where a read could fetch stale data from cache. In write-through, this window is eliminated but at the cost of higher write latency.</li><li><b>Memory Pressure:</b> Redis running at 90% memory triggers aggressive eviction. Keys you expect to be cached are silently evicted. Monitor memory usage and set maxmemory-policy appropriately (allkeys-lru for cache, noeviction for data store).</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Cache Solution</th><th>Throughput</th><th>Latency</th><th>Data Structures</th><th>Persistence</th><th>Best For</th></tr><tr><td>In-Process (Caffeine)</td><td>100M+ ops/s</td><td>&lt;1 &mu;s</td><td>Map only</td><td>None</td><td>Per-server hot data, config</td></tr><tr><td>Redis</td><td>100K ops/s per node</td><td>~1ms (network)</td><td>Strings, hashes, sets, sorted sets, streams</td><td>RDB snapshots, AOF</td><td>Shared cache, sessions, leaderboards</td></tr><tr><td>Memcached</td><td>200K ops/s per node</td><td>~0.5ms</td><td>Strings only</td><td>None</td><td>Simple high-throughput caching</td></tr><tr><td>CDN (CloudFront)</td><td>1M+ req/s per PoP</td><td>&lt;20ms (edge)</td><td>HTTP responses</td><td>N/A</td><td>Static assets, API response caching</td></tr></table><table class="learn-table"><tr><th>Eviction Policy</th><th>Evicts</th><th>Strength</th><th>Weakness</th><th>Use When</th></tr><tr><td>LRU</td><td>Least recently accessed</td><td>Great temporal locality</td><td>Sequential scans evict hot items</td><td>General purpose</td></tr><tr><td>LFU</td><td>Least frequently accessed</td><td>Keeps truly popular items</td><td>Old popular items linger</td><td>Stable hot set (product catalog)</td></tr><tr><td>ARC</td><td>Adapts between LRU and LFU</td><td>Self-tuning</td><td>Complex to implement</td><td>Unpredictable access patterns</td></tr><tr><td>Random</td><td>Random item</td><td>Simple, no metadata overhead</td><td>May evict hot items</td><td>Uniform access patterns</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Compare cache-aside vs write-through. When do you use each?</b><br>A: Cache-aside is the most common -- app manages cache, reads populate on miss, writes invalidate. Best for read-heavy workloads with tolerance for brief staleness. Write-through writes to both cache and DB synchronously -- best when you need strong consistency (e.g., financial data). Trade-off: write-through has higher write latency but guarantees cache freshness.</p><p class="learn-p"><b>Q2: How do you prevent thundering herd on a popular cache key?</b><br>A: Three strategies: (1) Distributed lock (Redis SETNX) -- only one request rebuilds, others wait or get stale data. (2) Probabilistic early refresh -- before TTL expires, each request has a small probability of refreshing. (3) Never-expire with async refresh -- a background worker refreshes periodically. Facebook\'s TAO uses a lease-based approach: the first reader that misses gets a "lease" to rebuild, others wait.</p><p class="learn-p"><b>Q3: A Bloom filter defends against cache penetration. How does it work?</b><br>A: A Bloom filter is a bit array with k hash functions. To add a key: set k bit positions. To check: if ALL k positions are set, the key "might exist" (small false positive rate). If ANY position is 0, the key "definitely does not exist." For 10M keys with 1% FP rate: ~12MB of memory. Check the Bloom filter before hitting cache/DB -- reject keys that definitely don\'t exist.</p><p class="learn-p"><b>Q4: Your multi-level cache (L1 in-process, L2 Redis) has consistency issues across 50 app servers. How do you fix it?</b><br>A: When data updates at L2 (Redis), L1 caches on 50 servers are stale. Solutions: (1) Short L1 TTL (10-30 seconds) -- simple, brief staleness. (2) Pub/sub invalidation -- Redis publishes invalidation events, each server subscribes and clears its L1. (3) Versioned keys -- increment version on write, L1 entries with old version are treated as misses.</p><p class="learn-p"><b>Q5: CDN push vs pull -- which for Netflix, which for an e-commerce site?</b><br>A: Netflix: push CDN. They know which movies are popular and pre-position them at edge servers before peak hours (8-11 PM). E-commerce with 10M products: pull CDN -- cache on first request, since you can\'t predict which of 10M products will be requested next. Use content-hashed URLs (product-image-a1b2c3.jpg) with 1-year TTL for static assets.</p><p class="learn-p"><b>Q6: How would you warm a cold cache after a Redis restart?</b><br>A: (1) Replay recent access logs to pre-load the top-N hot keys. (2) Shadow traffic: mirror production reads to the new cache cluster before routing real traffic. (3) Gradual traffic shift: route 1% traffic to the new cluster, let it warm naturally, then increase. (4) Redis RDB snapshot: restore from the most recent snapshot (may have some stale data but better than cold).</p><p class="learn-p"><b>Q7: Cache avalanche: many keys expire at once. How do you prevent it?</b><br>A: Add random jitter to TTLs. Instead of all keys expiring at 300s, set TTL = 300 + random(-30, +30). This spreads expirations over a 60-second window instead of a single moment. Also: never bulk-load cache entries with identical TTLs at startup.</p></div>',
    code: `// === Caching Patterns & CDN Architecture ===

// 1. Cache-Aside (Lazy Loading) Pattern
async function getUserProfile(userId) {
  const cacheKey = \`user:\${userId}\`;
  let data = await redis.get(cacheKey);
  if (data) return JSON.parse(data);       // HIT

  data = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 min TTL
  return data;                             // MISS -> fill
}

// On update: INVALIDATE (delete), don't update (avoids race conditions)
async function updateUser(userId, newData) {
  await db.query('UPDATE users SET ... WHERE id = ?', [userId, newData]);
  await redis.del(\`user:\${userId}\`);     // invalidate, NOT update
}

// 2. Write-Through Pattern
async function writeThrough(key, value) {
  await redis.set(key, JSON.stringify(value));  // cache
  await db.update(key, value);                  // DB (sync)
  // Both are always consistent
}

// 3. Write-Behind (Write-Back) Pattern
async function writeBehind(key, value) {
  await redis.set(key, JSON.stringify(value));  // cache (fast)
  writeQueue.push({ key, value, ts: Date.now() });
  // Background worker flushes to DB every 100ms
  // RISK: cache crash before flush = data loss!
}

// 4. Cache Stampede Prevention with Distributed Lock
async function getWithLock(key) {
  let val = await redis.get(key);
  if (val) return JSON.parse(val);

  const lockKey = key + ':lock';
  const acquired = await redis.set(lockKey, '1', 'NX', 'EX', 5);
  if (acquired) {
    try {
      val = await db.query(key);
      await redis.setex(key, 300, JSON.stringify(val));
      return val;
    } finally {
      await redis.del(lockKey);
    }
  }
  // Another thread is rebuilding -- wait and retry
  await sleep(50);
  return getWithLock(key);
}

// 5. Bloom Filter for Cache Penetration Defense
// Space: ~10 bits per element for 1% false positive rate
// 10M keys -> ~12MB Bloom filter
class BloomFilterCache {
  constructor() {
    this.bloom = new BloomFilter(10_000_000, 0.01); // 10M keys, 1% FP
  }
  async get(key) {
    if (!this.bloom.mightContain(key)) {
      return null;  // definitely doesn't exist -- skip DB
    }
    return this.cacheAsideGet(key);
  }
}

// 6. Multi-level cache with pub/sub invalidation
class MultiLevelCache {
  constructor() {
    this.l1 = new LocalCache(100_000, 30); // 100K items, 30s TTL
    this.l2 = redis;
    // Subscribe to invalidation channel
    redisSub.subscribe('cache:invalidate', (key) => {
      this.l1.delete(key);
    });
  }

  async get(key) {
    // L1: in-process (<1ms)
    let val = this.l1.get(key);
    if (val) return val;
    // L2: Redis (~1ms network)
    val = await this.l2.get(key);
    if (val) { this.l1.set(key, val); return JSON.parse(val); }
    // L3: Database (~10-50ms)
    val = await db.query(key);
    await this.l2.setex(key, 300, JSON.stringify(val));
    this.l1.set(key, val);
    return val;
  }

  async invalidate(key) {
    await this.l2.del(key);
    this.l1.delete(key);
    // Notify all other servers to clear their L1
    await redisPub.publish('cache:invalidate', key);
  }
}

// 7. CDN Configuration (Cache-Control headers)
// Static assets with content hash:
//   Cache-Control: public, max-age=31536000, immutable
// HTML pages (SPA entry point):
//   Cache-Control: no-cache  (always revalidate with ETag)
// API responses:
//   Cache-Control: private, max-age=0
// Stale-while-revalidate:
//   Cache-Control: max-age=60, stale-while-revalidate=3600`,
    problems: [
      ["Design a Web Cache","https://codemia.io/system-design/design-a-web-cache","Medium"],
      ["9 Caching Strategies for System Design","https://dev.to/somadevtoo/9-caching-strategies-for-system-design-interviews-369g","Easy"],
      ["Grokking System Design: Caching","https://www.designgurus.io/course/grokking-the-system-design-interview","Hard"]
    ],
    mcqs: [
      {"q":"In cache-aside pattern, what should happen when data is updated in the database?","o":["Update the cache entry with the new value","Invalidate (delete) the cache entry","Do nothing and wait for TTL expiry","Write to cache first, then database"],"a":1},
      {"q":"Which cache eviction policy is most vulnerable to sequential scan patterns?","o":["LFU","LRU","ARC","Random"],"a":1},
      {"q":"A Bloom filter used to defend against cache penetration can produce:","o":["False negatives only","False positives only","Both false positives and false negatives","Neither"],"a":1},
      {"q":"What is stale-while-revalidate in CDN caching?","o":["Serve expired content while fetching fresh content in background","Reject requests for stale content","Automatically purge all edge caches","Redirect to origin when cache expires"],"a":0},
      {"q":"Which caching pattern risks data loss if the cache crashes?","o":["Cache-aside","Write-through","Write-behind (write-back)","Read-through"],"a":2},
      {"q":"To prevent cache avalanche (many keys expiring at once), you should:","o":["Use longer TTLs","Add random jitter to TTLs","Use write-through pattern","Disable cache eviction"],"a":1},
      {"q":"Facebook's Memcached layer handles ~75% of reads. If it fails, the DB load increases by approximately:","o":["2x","4x","10x","20x"],"a":1},
      {"q":"For a SPA (Single Page App), which asset should NOT be cached with a long TTL?","o":["app.a1b2c3.js","styles.d4e5f6.css","index.html","vendor.g7h8i9.js"],"a":2}
    ],
  },
  {
    t: "Load Balancing & Reverse Proxy",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When GitHub experienced a major outage in 2018, a network partition caused a MySQL split-brain: Orchestrator promoted a replica while the old primary was still alive, leading to divergent writes, which promptly collapsed under the load. Load balancers are the traffic cops of distributed systems -- they determine which server handles each request, detect and route around failures, and enable zero-downtime deployments. At the scale of algorithmic trading, a load balancer that adds 1ms of latency to every request costs real money.</p><p class="learn-p">In interviews, you\'ll be asked to choose between L4 and L7 load balancing, design health checks that detect "gray failures" (servers that are slow but not dead), and explain how to deploy new code to 100 servers without dropping a single request.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">A <b>load balancer</b> distributes incoming traffic across multiple backend servers to improve throughput, reduce latency, and provide fault tolerance. A <b>reverse proxy</b> sits in front of backend servers and handles cross-cutting concerns (SSL termination, compression, caching, rate limiting). In practice, most load balancers are also reverse proxies (NGINX, HAProxy, AWS ALB).</p><div class="learn-code">Load Balancer Architecture:\n\n[Internet] --HTTPS--&gt; [Load Balancer (L7)]\n                         |-- SSL Termination (TLS 1.3)\n                         |-- Rate Limiting (1000 req/s per IP)\n                         |-- Compression (gzip/brotli)\n                         |-- Health Checks (every 10s)\n                         |\n                         |--HTTP--&gt; [App Server 1] (weight=4, 4 cores)\n                         |--HTTP--&gt; [App Server 2] (weight=8, 8 cores)\n                         |--HTTP--&gt; [App Server 3] (weight=2, 2 cores)\n\nL7 Content-Based Routing:\n                         /api/*    --&gt; API Server Pool\n                         /static/* --&gt; Static File Server / CDN\n                         /ws/*     --&gt; WebSocket Server Pool\n                         /admin/*  --&gt; Admin Server (internal only)</div><table class="learn-table"><tr><th>Algorithm</th><th>How It Works</th><th>Best For</th><th>Weakness</th></tr><tr><td><b>Round Robin</b></td><td>Requests go 1, 2, 3, 1, 2, 3...</td><td>Homogeneous servers, uniform requests</td><td>Ignores server capacity and request weight</td></tr><tr><td><b>Weighted Round Robin</b></td><td>Higher-capacity servers get more traffic proportionally</td><td>Heterogeneous servers (4-core vs 8-core)</td><td>Doesn\'t account for current load</td></tr><tr><td><b>Least Connections</b></td><td>Routes to server with fewest active connections</td><td>Variable request durations (mix of 1ms and 5s)</td><td>Doesn\'t account for server capacity differences</td></tr><tr><td><b>IP Hash</b></td><td>hash(client_ip) % N determines server</td><td>Session affinity without cookies</td><td>Uneven if IP distribution is skewed</td></tr><tr><td><b>Least Response Time</b></td><td>Routes to server with fastest recent response</td><td>Optimal user experience</td><td>Complex to measure accurately at scale</td></tr><tr><td><b>Random</b></td><td>Randomly select a server</td><td>Large server pools where simplicity matters</td><td>Can be uneven with small pools</td></tr></table></div><div class="learn-section"><div class="learn-h">Building Blocks</div><ul class="learn-list"><li><b>NGINX:</b> Most popular reverse proxy + LB. Handles ~50K concurrent connections per worker. Supports L7 routing, SSL termination, caching, rate limiting. Config-driven, reload without downtime.</li><li><b>HAProxy:</b> Purpose-built for load balancing. Lower latency than NGINX for pure proxying. Excellent L4 and L7 support. Used by GitHub, Stack Overflow, Reddit.</li><li><b>Envoy:</b> Modern proxy designed for service meshes (Istio/Kubernetes). Sidecar pattern: one Envoy per pod. Built-in circuit breaking, retries, observability (distributed tracing).</li><li><b>AWS ALB (Application Load Balancer):</b> Managed L7 LB. Auto-scales, integrates with ECS/EKS, supports path-based routing, WebSocket, gRPC. No infrastructure to manage.</li><li><b>AWS NLB (Network Load Balancer):</b> Managed L4 LB. Ultra-low latency (~100 microseconds added). Handles millions of connections. Best for TCP/UDP, game servers, streaming.</li><li><b>VRRP (Virtual Router Redundancy Protocol):</b> Two LBs share a virtual IP. If active LB fails, passive takes over in seconds. Used for HA LB pairs.</li><li><b>BGP Anycast:</b> Multiple LBs worldwide advertise the same IP address. Network routing sends each client to the nearest LB. Used by Cloudflare, Google.</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Let\'s trace a request through an L7 load balancer with health checks, SSL termination, and graceful deployment:</p><ol class="learn-list"><li><b>Client sends HTTPS request</b> to api.example.com. DNS resolves to the LB\'s IP (or anycast IP for global LB).</li><li><b>TLS handshake:</b> LB terminates SSL using TLS 1.3 (1 RTT handshake, 0 RTT for resumption). Decrypts the request. Backend servers never see HTTPS -- they receive plain HTTP over the internal VPC network.</li><li><b>L7 inspection:</b> LB parses the HTTP request. Path is /api/users/123. Based on routing rules, this goes to the "api-server" upstream pool.</li><li><b>Server selection:</b> Using least-connections algorithm, LB checks: Server A has 45 active connections, Server B has 12, Server C is marked UNHEALTHY (failed 3 consecutive health checks). LB routes to Server B.</li><li><b>Response:</b> Server B processes the request (10ms), returns HTTP 200. LB compresses the response with gzip (if client accepts), adds security headers (HSTS, X-Frame-Options), and forwards to the client.</li><li><b>Health check (background):</b> Every 10 seconds, LB sends GET /health to each server. Server C has been returning 503 for 30 seconds (3 consecutive failures). LB marks it unhealthy and stops routing traffic to it. When C starts returning 200 again, LB marks it healthy after 2 consecutive successes.</li></ol><div class="learn-code">Health Check Timeline:\nt=0s:  LB --&gt; GET /health --&gt; Server C returns 200 ✓\nt=10s: LB --&gt; GET /health --&gt; Server C returns 503 ✗ (failCount=1)\nt=20s: LB --&gt; GET /health --&gt; Server C returns 503 ✗ (failCount=2)\nt=30s: LB --&gt; GET /health --&gt; Server C returns 503 ✗ (failCount=3)\n       LB marks Server C UNHEALTHY, stops routing traffic\nt=40s: Server C recovers, returns 200 ✓ (successCount=1)\nt=50s: Server C returns 200 ✓ (successCount=2)\n       LB marks Server C HEALTHY, resumes routing traffic\n\nDuring t=0 to t=30: requests still routed to sick Server C!\nSolution: passive health check (monitor real response codes)</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Feature</th><th>L4 (Transport Layer)</th><th>L7 (Application Layer)</th></tr><tr><td>Sees</td><td>TCP/UDP packets (IP, port)</td><td>HTTP headers, URL path, cookies, body</td></tr><tr><td>Speed</td><td>Very fast -- just forwards packets</td><td>Slower -- must parse HTTP</td></tr><tr><td>Routing</td><td>By IP:port only</td><td>By URL path, headers, cookies, query params</td></tr><tr><td>SSL</td><td>Pass-through (backend terminates)</td><td>Terminates at LB (can inspect encrypted traffic)</td></tr><tr><td>Use case</td><td>Max throughput (gaming, video, TCP services)</td><td>Content routing, A/B testing, WAF, API gateway</td></tr><tr><td>Connection</td><td>1 TCP connection (pass-through)</td><td>2 TCP connections (client-LB, LB-backend)</td></tr></table><p class="learn-p"><b>HA Strategies for Load Balancers:</b></p><table class="learn-table"><tr><th>Strategy</th><th>How</th><th>Failover Time</th><th>Trade-off</th></tr><tr><td>Active-Passive (VRRP)</td><td>Two LBs share a virtual IP; passive takes over on failure</td><td>1-3 seconds</td><td>Wastes one LB\'s capacity</td></tr><tr><td>Active-Active (DNS RR)</td><td>DNS returns multiple LB IPs; both handle traffic</td><td>DNS TTL (30-300s)</td><td>DNS caching delays failover</td></tr><tr><td>BGP Anycast</td><td>Multiple LBs worldwide advertise the same IP</td><td>1-5 seconds (BGP convergence)</td><td>Complex network setup</td></tr></table><p class="learn-p"><b>Deployment Patterns via LB:</b></p><ul class="learn-list"><li><b>Rolling deployment:</b> Update servers one at a time. LB drains connections from the server being updated. Zero downtime but slow rollout.</li><li><b>Blue-green:</b> Two identical environments. LB switches 100% traffic from blue to green in one atomic action. Fast rollback but requires 2x infrastructure.</li><li><b>Canary:</b> Route 1% of traffic to the new version via LB weights. Monitor error rates. Gradually increase to 100% if healthy. Automatic rollback if errors spike.</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Gray Failures:</b> A server with a memory leak doesn\'t crash -- it slows down. Its health check endpoint (/health) returns 200 in 50ms, but actual API requests take 10 seconds. Round robin keeps sending 1/N traffic to it, degrading the overall system. Fix: (1) Deep health checks that test DB connectivity and downstream services. (2) Passive health checks that monitor real response times -- if p99 &gt; 5s, mark unhealthy. (3) Least-response-time algorithm automatically avoids slow servers.</div><div class="learn-warn"><b>Connection Pool Exhaustion:</b> You auto-scale from 10 to 20 app servers. Each has 100 DB connections. Now: 20 * 100 = 2,000 connections, but PostgreSQL max_connections = 500. The database rejects connections and the entire system fails. Fix: PgBouncer connection pooler between app and DB, or reduce per-server pool size.</div><ul class="learn-list"><li><b>Sticky Session Failure:</b> With session affinity (IP hash), if the assigned server dies, the user loses their session. All state must be externalized (Redis) even with sticky sessions.</li><li><b>Hot Client IP:</b> A corporate NAT puts 10,000 users behind one IP. IP-hash routing sends all 10K users to one server. Fix: use cookie-based affinity or consistent hashing instead.</li><li><b>WebSocket Drain:</b> Deploying a new version when 10K WebSocket connections are active. You can\'t just kill the server. Graceful drain: stop new connections, let existing ones finish (or send reconnect directive), timeout after 30 minutes.</li><li><b>SSL Performance:</b> TLS handshake is CPU-intensive. At 100K new connections/second, SSL termination at the LB requires dedicated hardware or separate TLS offload servers.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Load Balancer</th><th>Type</th><th>Throughput</th><th>Added Latency</th><th>Best For</th></tr><tr><td>NGINX</td><td>Software L7</td><td>~50K concurrent conn/worker</td><td>~1-2ms</td><td>Reverse proxy, static files, general LB</td></tr><tr><td>HAProxy</td><td>Software L4/L7</td><td>~100K concurrent conn</td><td>&lt;1ms</td><td>Pure load balancing, lowest latency</td></tr><tr><td>Envoy</td><td>Software L7</td><td>~50K concurrent conn</td><td>~1-2ms</td><td>Service mesh, microservices, observability</td></tr><tr><td>AWS ALB</td><td>Managed L7</td><td>Auto-scales</td><td>~1-3ms</td><td>AWS workloads, no infrastructure mgmt</td></tr><tr><td>AWS NLB</td><td>Managed L4</td><td>Millions of conn</td><td>~100&mu;s</td><td>TCP/UDP, ultra-low latency, game servers</td></tr><tr><td>F5 BIG-IP</td><td>Hardware L4/L7</td><td>Millions of conn</td><td>&lt;100&mu;s</td><td>Enterprise, financial services</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: You have 3 servers: A (4 cores), B (8 cores), C (2 cores). Which LB algorithm do you use?</b><br>A: Weighted round robin with weights 2:4:1 proportional to cores. But if some requests are light (1ms) and others heavy (5s), even weighted RR fails. Use weighted least-connections: routes to the server with the fewest active connections, weighted by capacity. This adapts to both heterogeneous servers and variable request durations.</p><p class="learn-p"><b>Q2: L4 vs L7 -- when do you use each?</b><br>A: L4 when you need maximum throughput and don\'t need to inspect HTTP (game servers, video streaming, raw TCP services). L7 when you need content-based routing (/api vs /static), A/B testing (route by cookie), API gateway features (rate limiting, auth), or SSL termination with traffic inspection. L7 adds ~1ms latency but gives you powerful routing capabilities.</p><p class="learn-p"><b>Q3: How do you deploy new code to 100 servers with zero downtime?</b><br>A: Canary deployment: (1) Deploy to 1 server. (2) LB routes 1% traffic to it. (3) Monitor error rates, latency p99 for 10 minutes. (4) If healthy, gradually increase to 5%, 25%, 50%, 100%. (5) If errors spike at any stage, LB routes 100% back to old version (instant rollback). For stateful connections (WebSocket), use graceful drain: stop new connections, wait for existing ones to close (up to 30-minute timeout).</p><p class="learn-p"><b>Q4: Your health check detects failure in 30 seconds. How do you detect faster?</b><br>A: (1) Reduce check interval from 10s to 2s and failure threshold from 3 to 2 (detect in 4s, but more network overhead). (2) Add passive health checks: monitor real traffic responses. If a server returns 5xx for 5 consecutive real requests, mark it unhealthy immediately. (3) Use both: passive for fast detection, active for recovery detection.</p><p class="learn-p"><b>Q5: The load balancer itself is a single point of failure. How do you make it HA?</b><br>A: Three approaches: (1) Active-passive with VRRP: two LBs share a virtual IP, passive takes over in 1-3 seconds. Simple but wastes capacity. (2) Active-active with DNS: two LB IPs in DNS. Both serve traffic. Failover depends on DNS TTL (30-300s delay). (3) Cloud-managed (AWS ALB/NLB): auto-scales across multiple AZs, no single point of failure, managed by AWS SREs.</p><p class="learn-p"><b>Q6: What is the sidecar proxy pattern and when do you use it?</b><br>A: In Kubernetes/Istio, each application pod gets an Envoy sidecar proxy. All traffic flows through Envoy, which handles load balancing, retries, circuit breaking, TLS, and distributed tracing -- without any code changes in the application. Use it in microservices architectures with 50+ services where implementing these concerns in every service is impractical.</p><p class="learn-p"><b>Q7: A server is slow (5s response) but its health check passes. How do you handle this?</b><br>A: This is a "gray failure." Solutions: (1) Deep health check: test actual DB query latency, not just /health endpoint. (2) Passive monitoring: track real request latency. If p99 &gt; 2s, mark server as degraded and reduce its weight to near-zero. (3) Use least-response-time algorithm: slow server naturally gets fewer requests. (4) Implement outlier detection (Envoy\'s outlier_detection): eject servers with high error rates or latency.</p></div>',
    code: `// === Load Balancing & Reverse Proxy ===

// 1. NGINX configuration as reverse proxy + load balancer
// nginx.conf
upstream api_pool {
    least_conn;                         // algorithm: least connections
    server backend1:8080 weight=4;      // 4 cores
    server backend2:8080 weight=8;      // 8 cores
    server backend3:8080 weight=2;      // 2 cores
    server backend4:8080 backup;        // only when others are down
}

server {
    listen 443 ssl http2;
    ssl_certificate     /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    // L7 content-based routing
    location /api/ {
        proxy_pass http://api_pool;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
    }
    location /static/ {
        root /var/www/static;           // serve directly, no backend
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location /health {
        access_log off;
        return 200 'OK';
    }
}

// 2. Active health check logic (pseudocode)
function activeHealthCheck(server, config) {
  // Config: interval=10s, threshold=3 failures, timeout=3s
  every config.interval:
    response = HTTP_GET(server.url + '/health', timeout=config.timeout)
    if (response.status !== 200 || timedOut):
      server.consecutiveFailures++
      if (server.consecutiveFailures >= config.threshold):
        server.status = 'UNHEALTHY'
        removeFromPool(server)
        log.warn(\`Server \${server.id} marked UNHEALTHY\`)
    else:
      server.consecutiveFailures = 0
      if (server.status === 'UNHEALTHY'):
        server.consecutiveSuccesses++
        if (server.consecutiveSuccesses >= 2):
          server.status = 'HEALTHY'
          addToPool(server)
}

// 3. Passive health check (monitor real traffic)
function onResponse(server, request, response) {
  if (response.status >= 500) {
    server.recentErrors.push(Date.now())
    // Remove errors older than 30 seconds
    server.recentErrors = server.recentErrors.filter(
      t => Date.now() - t < 30000
    )
    if (server.recentErrors.length > 10) {
      server.status = 'UNHEALTHY'  // detected via real traffic!
    }
  }
  // Track response time for outlier detection
  server.latencyWindow.push(response.time)
  if (percentile(server.latencyWindow, 99) > 5000) {
    server.weight = 0  // soft-remove slow server
  }
}

// 4. Canary deployment at LB level
upstream canary_pool {
    server new_version:8080 weight=1;   // 1% traffic
    server old_version:8080 weight=99;  // 99% traffic
}
// Monitor error rates for 10 minutes
// If canary errors > 1%: rollback (weight=0 for new)
// If healthy: gradually increase weight to 50, then 100

// 5. Graceful drain for zero-downtime deployment
async function gracefulDrain(server) {
  server.acceptingNewConnections = false;  // stop new traffic
  lb.removeFromPool(server);               // LB stops routing

  // Wait for active connections to finish
  const timeout = 30 * 60 * 1000; // 30 minutes max
  const start = Date.now();
  while (server.activeConnections > 0 && Date.now() - start < timeout) {
    await sleep(1000);
  }

  // Force-close remaining connections with reconnect header
  for (const conn of server.connections) {
    if (conn.isWebSocket) {
      conn.send({ type: 'RECONNECT', target: 'new_version' });
    }
    conn.close();
  }

  server.shutdown();
}

// 6. Connection pool management
// 10 backend servers × 100 connections = 1000 pool
// Auto-scaling adds 8 more: 18 × 100 = 1800 > DB max 500!
// Solution: PgBouncer connection pooler
//   App -> PgBouncer (pool of 50 real connections) -> PostgreSQL
//   PgBouncer multiplexes hundreds of app connections onto 50 DB connections`,
    problems: [
      ["Design an API Rate Limiter","https://codemia.io/system-design/design-an-API-rate-limiter","Medium"],
      ["Load Balancer System Design","https://www.geeksforgeeks.org/system-design/load-balancer-system-design-interview-question/","Medium"],
      ["System Design Problem Breakdowns","https://www.hellointerview.com/learn/system-design/in-a-hurry/problem-breakdowns","Hard"],
      ["Top System Design Interview Questions","https://www.designgurus.io/blog/system-design-interview-questions","Medium"]
    ],
    mcqs: [
      {"q":"Which load balancing algorithm best handles mixed request durations (1ms and 5s)?","o":["Round Robin","Weighted Round Robin","Least Connections","IP Hash"],"a":2},
      {"q":"An L4 load balancer can route based on:","o":["URL path and cookies","HTTP headers","IP address and port number","Request body content"],"a":2},
      {"q":"What is the main disadvantage of SSL termination at the load balancer?","o":["Certificates are harder to manage","Traffic between LB and backends is unencrypted","L7 routing becomes impossible","Higher CPU usage on backends"],"a":1},
      {"q":"In VRRP-based HA for load balancers, what happens when the active LB fails?","o":["DNS is updated to remove the failed LB","The passive LB takes over the virtual IP","All traffic is dropped until manual intervention","BGP anycast reroutes traffic"],"a":1},
      {"q":"What is the main benefit of health-check-based load balancing over static round-robin?","o":["Lower latency","Automatically stops routing to failed or degraded backends","Simpler configuration","Better encryption support"],"a":1},
      {"q":"A 'gray failure' in load balancing refers to:","o":["A server that is completely down","A server that is slow but passes health checks","A network partition between two data centers","A load balancer running at 50% capacity"],"a":1},
      {"q":"Which deployment strategy allows instant rollback by switching LB routing?","o":["Rolling deployment","Canary deployment","Blue-green deployment","A/B testing"],"a":2},
      {"q":"The sidecar proxy pattern (Envoy) is most useful when:","o":["You have a single monolithic application","You have 50+ microservices needing consistent cross-cutting concerns","You need the lowest possible latency","You are running on bare metal servers"],"a":1}
    ],
  },
  {
    t: "Back-of-the-Envelope Estimation",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">In a system design interview, you propose caching "to improve performance." The interviewer asks: "How much memory does the cache need? Can it fit on one machine?" You stare blankly. The interview is effectively over.</p><p class="learn-p">Back-of-the-envelope calculations are the <b>quantitative backbone</b> of system design. They answer critical questions: Do we need 1 server or 100? Can one database handle the load? How much storage for 5 years? Do we need a CDN? Without these numbers, your architecture is hand-waving. With them, every decision is justified.</p><p class="learn-p"><b>Real example:</b> Instagram\'s engineers estimated that at 25M users, ~3 photos/user at 200KB each (compressed thumbnails + metadata), they needed ~15 TB of raw storage. But with CDN and S3, the architecture remained simple. The estimation told them they didn\'t need a custom distributed file system yet.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">The goal is <b>order-of-magnitude accuracy</b> -- being within 2-5x of reality is fine. Being off by 100x leads to the wrong architecture. Round aggressively: use 10^6 instead of 1,048,576.</p><p class="learn-p"><b>The four key estimations:</b></p><div class="learn-code">1. QPS (Queries Per Second):\n   QPS = DAU x queries_per_user / 86,400\n   Peak QPS = 2x-5x average (typically 3x)\n\n2. Storage:\n   Storage = items_per_day x item_size x retention_days\n   With redundancy: multiply by replication factor (typically 3x)\n\n3. Bandwidth:\n   Bandwidth = data_volume / time_period\n   Convert: bytes/s x 8 = bits/s\n\n4. Servers:\n   Servers = peak_QPS / single_server_capacity</div><p class="learn-p"><b>Key numbers every engineer should know (Jeff Dean\'s latency numbers):</b></p><table class="learn-table"><tr><th>Operation</th><th>Latency</th><th>Relative (RAM=1x)</th></tr><tr><td>L1 cache reference</td><td>0.5 ns</td><td>0.005x</td></tr><tr><td>L2 cache reference</td><td>7 ns</td><td>0.07x</td></tr><tr><td>Main memory (RAM)</td><td>100 ns</td><td>1x</td></tr><tr><td>SSD random read</td><td>150 &mu;s (150,000 ns)</td><td>1,500x</td></tr><tr><td>HDD random seek</td><td>10 ms (10,000,000 ns)</td><td>100,000x</td></tr><tr><td>Network round trip (same DC)</td><td>500 &mu;s</td><td>5,000x</td></tr><tr><td>Network round trip (CA to Netherlands)</td><td>150 ms</td><td>1,500,000x</td></tr></table><p class="learn-p">The gap between RAM (100ns) and disk (10ms) is <b>100,000x</b>. This single fact justifies caching. If your system does 1,000 lookups per request: in-memory = 0.1ms, SSD = 150ms, HDD = 10,000ms.</p></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>Powers of 2 -- the foundation of all estimation:</b></p><table class="learn-table"><tr><th>Power</th><th>Exact</th><th>Approx</th><th>Name</th></tr><tr><td>2^10</td><td>1,024</td><td>1 Thousand</td><td>1 KB</td></tr><tr><td>2^20</td><td>1,048,576</td><td>1 Million</td><td>1 MB</td></tr><tr><td>2^30</td><td>1,073,741,824</td><td>1 Billion</td><td>1 GB</td></tr><tr><td>2^40</td><td>1,099,511,627,776</td><td>1 Trillion</td><td>1 TB</td></tr></table><p class="learn-p"><b>Useful constants:</b></p><ul class="learn-list"><li>Seconds in a day: 86,400 &asymp; 10^5 (round to 100K for estimation)</li><li>Seconds in a month: 2.6 x 10^6 &asymp; 2.5M</li><li>Seconds in a year: 3.15 x 10^7 &asymp; &pi; x 10^7</li><li>2^32 &asymp; 4 x 10^9 (4 billion, fits in a 32-bit integer -- enough for IPv4 addresses)</li><li>2^64 &asymp; 1.8 x 10^19 (18 quintillion)</li><li>log2(N) bits to represent N unique items: log2(1M) &asymp; 20 bits, log2(1B) &asymp; 30 bits</li></ul><p class="learn-p"><b>Typical server capacities:</b></p><ul class="learn-list"><li>Web/app server: 5,000-10,000 QPS (depends on complexity)</li><li>Redis instance: ~100,000 QPS</li><li>MySQL/PostgreSQL (OLTP): 5,000-10,000 QPS with proper indexes</li><li>Kafka broker: 200,000-500,000 messages/sec</li><li>Elasticsearch: 1,000-5,000 search QPS per node</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Let\'s do a complete estimation for Twitter:</p><ol class="learn-list"><li><b>QPS Estimation:</b> 300M monthly active users, ~50% DAU = 150M DAU. Each user views ~200 tweets/day (reads) and posts ~2 tweets/day (writes). Read QPS = 150M x 200 / 86,400 &asymp; 347,000 req/s. Write QPS = 150M x 2 / 86,400 &asymp; 3,500 req/s. Peak (3x): ~1M read QPS, ~10K write QPS.</li><li><b>Storage Estimation:</b> Each tweet: ~280 chars = 560 bytes + metadata (user_id, timestamp, etc.) &asymp; 1KB. Daily tweets: 150M x 2 = 300M tweets. Daily storage: 300M x 1KB = 300 GB/day. Annual: 300 GB x 365 = 109 TB. With media (10% have images, avg 500KB): 30M x 500KB = 15 TB/day = 5.5 PB/year.</li><li><b>Bandwidth:</b> Read traffic: 347K req/s x 10KB/tweet (with metadata) = 3.47 GB/s &asymp; 28 Gbps. With media: much higher during peak. Peak: ~100 Gbps.</li><li><b>Server Estimation:</b> Read QPS of 1M peak. App server handles 5K QPS. Need: 1M / 5K = 200 app servers. Redis at 100K QPS: need ~10 Redis nodes for caching. DB writes at 10K QPS: single leader PostgreSQL can handle this (with write-behind caching for bursts).</li></ol><div class="learn-code">Twitter Estimation Summary:\n================================\nDAU:           150M\nRead QPS:      347K avg, 1M peak\nWrite QPS:     3.5K avg, 10K peak\nText storage:  109 TB/year\nMedia storage: 5.5 PB/year\nBandwidth:     28 Gbps avg, ~100 Gbps peak\nApp servers:   200 (for peak)\nRedis nodes:   10\nDB shards:     ~20 (by user_id)</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>System</th><th>DAU</th><th>Key Metric</th><th>Estimation</th><th>Architectural Implication</th></tr><tr><td>URL Shortener</td><td>100M URLs/month</td><td>Storage (5 years)</td><td>100M x 500B x 60mo = 3 TB</td><td>Fits on one machine with RAID</td></tr><tr><td>Chat (WhatsApp)</td><td>500M</td><td>Peak messages/sec</td><td>500M x 40msg / 86.4K = 231K msg/s</td><td>Need Kafka + sharded storage</td></tr><tr><td>Video (YouTube)</td><td>2B views/day</td><td>Bandwidth</td><td>2B x 5MB avg / 86.4K = 115 GB/s &asymp; 926 Gbps</td><td>CDN with 200+ PoPs essential</td></tr><tr><td>Image (Instagram)</td><td>100M photos/day</td><td>Daily storage</td><td>100M x 2.5MB (4 sizes) = 250 TB/day</td><td>Object storage (S3) + CDN</td></tr><tr><td>Search (Google)</td><td>8.5B queries/day</td><td>Peak QPS</td><td>8.5B / 86.4K x 3 = 295K QPS</td><td>Globally distributed, sharded index</td></tr></table><p class="learn-p"><b>Collision probability (Birthday Paradox):</b> For a URL shortener with base62 encoding: P(collision) &asymp; n^2 / (2 x m) where n = items, m = hash space. With 7 chars: m = 62^7 &asymp; 3.5 x 10^12. At 1B URLs: P &asymp; 10^18 / (7 x 10^12) &gt;&gt; 1 (guaranteed collisions!). Need 11+ chars or collision checking.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>When does a 10x error matter?</b> Sometimes order-of-magnitude is enough, sometimes it\'s not. 50 TB vs 500 TB: the first fits on one machine, the second needs distributed storage -- fundamentally different architecture. 10K QPS vs 100K QPS: the first is one server, the second is a cluster. But 10ms vs 100ms latency: both acceptable for most APIs (unless autocomplete, which needs &lt;50ms).</div><ul class="learn-list"><li><b>Peak vs Average:</b> Average QPS tells you the sustained load. Peak QPS (2x-5x average) determines your capacity requirement. Design for peak, optimize costs at average. Black Friday can be 10x-50x normal.</li><li><b>Read:Write Ratio:</b> Most apps are 100:1 read:write. Social media might be 1000:1. Chat apps are closer to 1:1. This ratio determines whether you need read replicas (reads) or write sharding (writes).</li><li><b>Network vs Compute:</b> A Redis call over the network takes ~1ms -- 10,000x slower than a local memory read. If you make 100 Redis calls per request: 100ms in network alone. Batch your cache calls using MGET!</li><li><b>80/20 Rule:</b> 20% of data is accessed 80% of the time. Cache only the hot 20%. For Twitter: 50M hot tweets x 10KB = 500 GB cache (fits in Redis cluster).</li><li><b>Don\'t forget replication:</b> 3 TB of raw data with 3x replication = 9 TB total storage needed. With backups: add another 2x = 18 TB.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Resource</th><th>Single Machine Limit</th><th>When to Distribute</th></tr><tr><td>CPU</td><td>256 cores, ~10K QPS (app server)</td><td>QPS &gt; 10K</td></tr><tr><td>RAM</td><td>12 TB (AWS u-24tb1)</td><td>Working set &gt; 12 TB (rare)</td></tr><tr><td>Storage (SSD)</td><td>~100 TB (NVMe array)</td><td>Data &gt; 100 TB</td></tr><tr><td>Network</td><td>100 Gbps NIC</td><td>Bandwidth &gt; 100 Gbps</td></tr><tr><td>Connections</td><td>~64K ports per IP</td><td>Concurrent connections &gt; 50K</td></tr></table><table class="learn-table"><tr><th>Common Item Sizes</th><th>Size</th></tr><tr><td>Tweet (text + metadata)</td><td>~1 KB</td></tr><tr><td>User profile (JSON)</td><td>~5 KB</td></tr><tr><td>Product listing (e-commerce)</td><td>~10 KB</td></tr><tr><td>Thumbnail image</td><td>~50 KB</td></tr><tr><td>Web page (HTML + CSS + JS)</td><td>~2 MB</td></tr><tr><td>Photo (JPEG, mobile)</td><td>~500 KB</td></tr><tr><td>Photo (original, DSLR)</td><td>~5 MB</td></tr><tr><td>1 minute of video (720p)</td><td>~50 MB</td></tr><tr><td>1 minute of video (4K)</td><td>~350 MB</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How many servers do you need for a service with 10M DAU and 50 actions per user per day?</b><br>A: Avg QPS = 10M x 50 / 86,400 &asymp; 5,800. Peak QPS (3x) &asymp; 17,400. At 5K QPS per server: 17,400 / 5,000 &asymp; 4 servers. Add 50% headroom: 6 servers. With redundancy (survive 1 failure): 8 servers.</p><p class="learn-p"><b>Q2: Estimate storage for a URL shortener running for 5 years at 100M URLs/month.</b><br>A: Total URLs: 100M x 60 months = 6B URLs. Each mapping: 500 bytes (short URL 10B + long URL 200B + metadata 290B). Storage: 6B x 500B = 3 TB. With 3x replication: 9 TB. Fits on a single machine with RAID, but shard for QPS reasons.</p><p class="learn-p"><b>Q3: Can one Redis instance cache all of Twitter\'s hot tweets?</b><br>A: Hot tweets (20% of recent 7 days): 300M/day x 7 x 0.2 = 420M tweets. At 1KB each: 420 GB. Single Redis maxes at ~64-100 GB. Need a cluster of ~5-7 Redis nodes. At 100K QPS each: 700K total QPS (handles Twitter\'s 347K avg read QPS with headroom).</p><p class="learn-p"><b>Q4: Your estimate is off by 10x. When does it matter?</b><br>A: Storage 50 TB vs 500 TB: matters -- one machine vs distributed storage. QPS 10K vs 100K: matters -- one server vs load-balanced cluster. Latency 10ms vs 100ms: might not matter for most APIs, but critical for autocomplete (&lt;50ms target). Bandwidth 1 Gbps vs 10 Gbps: doesn\'t matter -- both handled by standard NICs.</p><p class="learn-p"><b>Q5: How do you estimate bandwidth for Netflix streaming 200M concurrent users?</b><br>A: Concurrent peak: 200M x 30% = 60M streams. Average stream: 5 Mbps (HD). Peak bandwidth: 60M x 5 Mbps = 300 Tbps. Each server (10 Gbps NIC): 10 Gbps / 5 Mbps = 2,000 concurrent streams. Servers needed: 60M / 2,000 = 30,000 servers. This is why Netflix\'s Open Connect has servers installed directly at ISPs.</p><p class="learn-p"><b>Q6: State your assumptions for a chat system design.</b><br>A: DAU: 50M. Messages per user per day: 40. Avg message size: 200 bytes. Avg QPS: 50M x 40 / 86,400 &asymp; 23,000 msg/s. Peak: 70K msg/s. Daily storage: 50M x 40 x 200B = 400 GB. 5-year storage: 400 GB x 365 x 5 = 730 TB. With replication: ~2 PB.</p><p class="learn-p"><b>Q7: Why does the 80/20 rule matter for cache sizing?</b><br>A: If 20% of data is accessed 80% of the time, you only need to cache the hot 20% to get an 80% hit rate. For 100M products at 10KB each: total data = 1 TB. Cache only 20M hot products: 200 GB -- fits in a small Redis cluster. Caching all 100M products (1 TB) is wasteful and expensive.</p></div>',
    code: `// === Back-of-the-Envelope Estimation Cheat Sheet ===

// Key constants
const SECONDS_PER_DAY   = 86400;       // ~10^5
const SECONDS_PER_MONTH = 2.6e6;       // ~2.5 * 10^6
const SECONDS_PER_YEAR  = 3.15e7;      // ~π * 10^7

// Powers of 2 approximations
// 2^10 ≈ 10^3    (Thousand / KB)
// 2^20 ≈ 10^6    (Million  / MB)
// 2^30 ≈ 10^9    (Billion  / GB)
// 2^40 ≈ 10^12   (Trillion / TB)

// Latency reference (Jeff Dean's numbers)
// L1 cache:        0.5 ns
// L2 cache:        7 ns
// RAM:             100 ns
// SSD random read: 150 μs   (150,000 ns)
// HDD seek:        10 ms    (10,000,000 ns)
// Network (DC):    500 μs
// Network (CA→EU): 150 ms

// === QPS Estimation Template ===
function estimateQPS(dau, actionsPerUserPerDay) {
  const avgQPS = (dau * actionsPerUserPerDay) / SECONDS_PER_DAY;
  const peakQPS = avgQPS * 3;  // peak = 2-5x average
  return { avgQPS: Math.round(avgQPS), peakQPS: Math.round(peakQPS) };
}

// Example: Twitter-like service
// DAU = 150M, 200 reads/user/day
// avgQPS  = 150M * 200 / 86400 ≈ 347K
// peakQPS ≈ 1M

// === Storage Estimation Template ===
function estimateStorage(itemsPerDay, bytesPerItem, years, replicationFactor = 3) {
  const totalItems = itemsPerDay * 365 * years;
  const rawBytes = totalItems * bytesPerItem;
  const withReplication = rawBytes * replicationFactor;
  return {
    rawTB: (rawBytes / 1e12).toFixed(1),
    withReplicationTB: (withReplication / 1e12).toFixed(1)
  };
}

// Example: URL shortener (5 years)
// 100M URLs/month ≈ 3.3M/day, 500 bytes each
// Raw: 3.3M * 500 * 365 * 5 = 3 TB
// With 3x replication: 9 TB

// === Bandwidth Estimation Template ===
function estimateBandwidth(totalBytesPerDay) {
  const bytesPerSec = totalBytesPerDay / SECONDS_PER_DAY;
  const bitsPerSec = bytesPerSec * 8;
  return {
    GBps: (bytesPerSec / 1e9).toFixed(2),
    Gbps: (bitsPerSec / 1e9).toFixed(2)
  };
}

// Example: Twitter egress
// 347K req/s * 10KB = 3.47 GB/s ≈ 28 Gbps

// === Server Estimation ===
function estimateServers(peakQPS, singleServerQPS = 5000) {
  const minServers = Math.ceil(peakQPS / singleServerQPS);
  const withHeadroom = Math.ceil(minServers * 1.5);  // 50% headroom
  return { minServers, withHeadroom };
}

// Server capacities:
// Web server:     ~5,000 QPS
// Redis:          ~100,000 QPS
// MySQL (OLTP):   ~5,000 QPS
// Kafka broker:   ~200,000 msg/s
// Elasticsearch:  ~3,000 search QPS

// === Complete estimation: Chat system ===
// DAU: 50M, 40 messages/user/day, msg size: 200 bytes
// Avg QPS:   50M * 40 / 86400 ≈ 23,000 msg/s
// Peak QPS:  ≈ 70,000 msg/s
// Daily storage: 50M * 40 * 200B = 400 GB
// 5-year storage: 400GB * 365 * 5 = 730 TB (+ 3x replication = 2.2 PB)
// Servers: 70K / 5K = 14 servers (+ headroom = 20 servers)

// === Collision probability (Birthday Paradox) ===
// P(collision) ≈ 1 - e^(-n² / 2m)
// n = items, m = hash space size
// For 7-char base62: m = 62^7 ≈ 3.5 * 10^12
// At 1B URLs: P ≈ n²/(2m) = 10^18 / (7*10^12) >> 1 (guaranteed!)
// Need 10+ chars: 62^10 ≈ 8.4 * 10^17
// At 1B URLs: P ≈ 10^18 / (1.68*10^18) ≈ 0.6 (still risky!)
// Solution: use 11 chars or add collision checking`,
    problems: [
      ["Back-of-the-Envelope Exercises (Interactive)","https://www.em-tools.io/tools/back-of-the-envelope-exercises","Medium"],
      ["Estimation Guide for System Design","https://bytebytego.com/courses/system-design-interview/back-of-the-envelope-estimation","Medium"],
      ["Estimation Step-by-Step Guide","https://www.designgurus.io/blog/back-of-the-envelope-system-design-interview","Medium"],
      ["Estimation in System Design","https://www.geeksforgeeks.org/system-design/back-of-the-envelope-estimation-in-system-design/","Easy"]
    ],
    mcqs: [
      {"q":"Approximately how many seconds are in a day?","o":["8,640","86,400","864,000","8,640,000"],"a":1},
      {"q":"The latency gap between RAM (100ns) and HDD seek (10ms) is approximately:","o":["100x","1,000x","10,000x","100,000x"],"a":3},
      {"q":"If a system has 150M DAU, each making 100 requests/day, peak QPS (3x average) is approximately:","o":["500K","170K","520K","1.5M"],"a":2},
      {"q":"2^40 is approximately equal to:","o":["1 billion","1 trillion","1 million","1 quadrillion"],"a":1},
      {"q":"How many app servers (at 5K QPS each) are needed for 100K peak QPS with 50% headroom?","o":["10","20","30","40"],"a":2},
      {"q":"For a URL shortener with base62 encoding, 7 characters give a hash space of approximately:","o":["3.5 billion","350 billion","3.5 trillion","35 trillion"],"a":2},
      {"q":"Netflix streaming 60M concurrent users at 5 Mbps each requires approximately how many 10Gbps servers?","o":["3,000","10,000","30,000","100,000"],"a":2},
      {"q":"The 80/20 rule implies that to achieve ~80% cache hit rate, you should cache:","o":["100% of data","80% of data","50% of data","20% of data"],"a":3},
      {"q":"At 100M new URLs/month for 5 years, the total storage with 500 bytes per record is approximately:","o":["500 GB","1 TB","3 TB","10 TB"],"a":2}
    ],
  },
  {
    t: "Consistent Hashing",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">You\'re running a distributed cache with 4 Redis nodes, using <code>hash(key) % 4</code> to assign keys to nodes. Your traffic triples overnight, and you need a 5th node. With modular hashing, adding that node means <b>80% of all keys</b> suddenly map to wrong nodes -- 80% cache misses at once, your database gets a 20x traffic spike, and the system crashes. This is not hypothetical: this exact problem brought down early distributed cache deployments.</p><p class="learn-p"><b>Consistent hashing</b> solves this by ensuring that adding or removing a node moves only ~1/N of the keys. It\'s the foundation of DynamoDB, Cassandra, Akamai\'s CDN, and virtually every distributed cache cluster. Interviewers expect you to explain the hash ring, virtual nodes, and cascading failure prevention -- not just name-drop the concept.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">In consistent hashing, both keys and servers are mapped onto a <b>circular hash ring</b> (typically 0 to 2^32 - 1). Each key is assigned to the first server encountered when walking <b>clockwise</b> from the key\'s position on the ring.</p><div class="learn-code">Consistent Hash Ring (0 to 2^32 - 1):\n\n                    0\n                    |\n          Node C  --|--  Node A\n         (pos 400)  |   (pos 100)\n                    |\n    --------+-------+-------+--------\n            |               |\n            |               |\n            |               |\n    --------+-------+-------+--------\n                    |\n         Node D  ---|---  Node B\n        (pos 700)   |    (pos 250)\n                    |\n                   2^32\n\nKey at position 150: walk clockwise --&gt; Node B (250)  ✓\nKey at position 300: walk clockwise --&gt; Node C (400)  ✓\nKey at position 800: walk clockwise --&gt; wrap --&gt; Node A (100) ✓\n\nAdd Node E at position 180:\n  Only keys in range (100, 180] move from Node B to Node E\n  Keys at 300, 800, etc. are UNAFFECTED\n  Only ~1/5 of total keys move (instead of ~80% with modular hashing)</div><p class="learn-p"><b>Why only ~1/N keys move:</b> When a new node is added at position P, it "takes over" the range between the previous node (counter-clockwise from P) and P itself. That range is approximately 1/N of the total ring. All other ranges remain assigned to the same nodes.</p></div><div class="learn-section"><div class="learn-h">Building Blocks</div><ul class="learn-list"><li><b>Hash Ring:</b> Circular space from 0 to 2^32 - 1. Both nodes and keys are hashed into this space using a consistent hash function (MD5, MurmurHash, xxHash).</li><li><b>Virtual Nodes (vnodes):</b> Each physical node gets 100-200 positions on the ring (using different hash seeds like hash("NodeA:0"), hash("NodeA:1"), ..., hash("NodeA:149")). This dramatically improves distribution uniformity.</li><li><b>Sorted Map / Tree:</b> The ring is implemented as a sorted data structure (TreeMap, balanced BST). Finding the responsible node is a <span class="learn-complexity">O(log N)</span> ceiling/successor lookup.</li><li><b>Replication:</b> For fault tolerance, each key is stored on the next N distinct <b>physical</b> nodes clockwise. Must skip virtual nodes of the same physical server.</li><li><b>Bounded Load:</b> Each node has a maximum load threshold. If a node is at capacity, the key "overflows" to the next node clockwise. Prevents cascading failures.</li><li><b>MurmurHash / xxHash:</b> Fast, non-cryptographic hash functions. MurmurHash3 produces 128-bit hashes with excellent distribution. xxHash is even faster (~8 GB/s throughput).</li></ul><div class="learn-code">// Consistent Hash Ring — simplified implementation\nclass ConsistentHash {\n    map&lt;size_t, string&gt; ring;     // hash position → node ID\n    int vnodes;\n    hash&lt;string&gt; hasher;\npublic:\n    ConsistentHash(int vnodes = 150) : vnodes(vnodes) {}\n\n    void addNode(const string&amp; node) {\n        for (int i = 0; i &lt; vnodes; i++)\n            ring[hasher(node + ":" + to_string(i))] = node;\n    }\n    void removeNode(const string&amp; node) {\n        for (int i = 0; i &lt; vnodes; i++)\n            ring.erase(hasher(node + ":" + to_string(i)));\n    }\n    string getNode(const string&amp; key) {\n        if (ring.empty()) return "";\n        size_t h = hasher(key);\n        auto it = ring.lower_bound(h);   // first node >= key hash\n        if (it == ring.end()) it = ring.begin();  // wrap around\n        return it-&gt;second;\n    }\n};</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Let\'s trace adding a node to a 4-node ring with virtual nodes and replication factor 3:</p><ol class="learn-list"><li><b>Initial setup:</b> 4 physical nodes (A, B, C, D), each with 150 virtual nodes = 600 points on the ring. Keys are approximately evenly distributed: each node owns ~25% of keys.</li><li><b>A key "user:42" is written:</b> hash("user:42") = position 5,200. Walk clockwise: next virtual node is "B:37" at position 5,350 (belongs to physical Node B). Key is assigned to Node B. With replication factor 3: also replicate to next 2 distinct physical nodes clockwise -- Node C and Node D. Total: 3 copies.</li><li><b>Node C fails:</b> Keys owned by Node C\'s virtual nodes move to their next clockwise neighbors. But because Node C\'s 150 virtual nodes are spread across the ring, the load redistributes approximately evenly across A, B, and D -- not concentrated on one node. Each surviving node absorbs ~8% more keys (1/3 of C\'s 25%).</li><li><b>Adding Node E:</b> 150 new virtual nodes are placed on the ring. Each virtual node "takes over" a small arc from its clockwise successor. Total keys moved: ~20% (1/5 of all keys). The migration is gradual: for each key that moved, read from old node until migration confirmed on new node.</li><li><b>Key lookup after migration:</b> hash("user:42") = 5,200. New clockwise successor might still be "B:37" (if no Node E vnode was inserted between 5,200 and 5,350) or a Node E vnode. Lookup is O(log 750) in the sorted ring.</li></ol></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Approach</th><th>How It Works</th><th>Key Movement on Add</th><th>Complexity</th><th>Used By</th></tr><tr><td><b>Modular Hashing</b></td><td>hash(key) % N</td><td>~(N-1)/N keys move (~80% for N=4)</td><td><span class="learn-complexity">O(1) lookup</span></td><td>Simple sharding</td></tr><tr><td><b>Consistent Hashing</b></td><td>Hash ring with clockwise assignment</td><td>~1/N keys move (~20% for N=4)</td><td><span class="learn-complexity">O(log V) lookup (V=vnodes)</span></td><td>DynamoDB, Cassandra, CDNs</td></tr><tr><td><b>Rendezvous Hashing</b></td><td>hash(key, server) for all servers, pick highest</td><td>~1/N keys move</td><td><span class="learn-complexity">O(N) per lookup (evaluate all servers)</span></td><td>CDN routing, Ceph CRUSH</td></tr><tr><td><b>Jump Consistent Hash</b></td><td>Mathematical function, no ring</td><td>~1/N keys move</td><td><span class="learn-complexity">O(ln N) time, O(1) space</span></td><td>Google (internal)</td></tr><tr><td><b>Maglev Hashing</b></td><td>Lookup table with minimal disruption</td><td>~1/N keys move</td><td><span class="learn-complexity">O(1) lookup after table build</span></td><td>Google Maglev LB</td></tr></table><p class="learn-p"><b>Virtual node count trade-offs:</b> More vnodes = better distribution but more memory. With 3 physical nodes and 0 vnodes: one node might own 50% of the ring (high variance). With 150 vnodes each (450 total): standard deviation drops to ~2% of ideal. With 500 vnodes each: &lt;1% deviation but 1500 entries in the sorted map.</p><p class="learn-p"><b>Heterogeneous hardware:</b> If Node A has 2x the capacity of Node B, give Node A 2x the virtual nodes. It will own approximately 2x the key range and receive 2x the traffic -- proportional to capacity.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Cascading Failure:</b> Node B fails. Its keys move to Node C (next clockwise). If Node C was already at 80% capacity, the extra load pushes it over 100%. Node C fails. Its keys (including B\'s overflow) move to Node D. Node D fails. Chain reaction takes down the entire cluster. Prevention: (1) Bounded load -- cap each node at 110% of fair share, overflow to next. (2) Replication -- with RF=3, a single failure doesn\'t concentrate load.</div><div class="learn-warn"><b>Hot Key Problem:</b> A viral tweet\'s cache key gets 100x average traffic. Virtual nodes don\'t help because it\'s a single key, not a key range. Solutions: (1) Key replication with random suffix: hot_key_0 through hot_key_9 spread across 10 nodes, client picks randomly. (2) Local caching: every app server caches the hot key in-process. (3) Dedicated cache tier for hot keys.</div><ul class="learn-list"><li><b>Poor Distribution Without Vnodes:</b> With only 3 nodes on a ring, the expected maximum arc for one of 3 nodes is ~61% of the ring (H(3)/3 = 11/18). This means one node might handle over 60% of traffic while another handles under 10%. Virtual nodes are not optional in production.</li><li><b>Replication and Vnodes:</b> When finding 3 replicas clockwise, you must skip virtual nodes of the same physical server. Otherwise, two vnodes of Server A might be adjacent, giving you only 2 physical copies instead of 3.</li><li><b>Ring Metadata Size:</b> 100 physical nodes x 200 vnodes = 20,000 entries. Each entry is ~50 bytes (hash + node ID). Total: ~1 MB. Negligible. But gossiping ring state to 100 nodes creates O(N^2) messaging overhead.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>Modular Hashing</th><th>Consistent Hashing</th><th>Rendezvous Hashing</th></tr><tr><td>Lookup</td><td><span class="learn-complexity">O(1)</span></td><td><span class="learn-complexity">O(log V) where V = total vnodes</span></td><td><span class="learn-complexity">O(N) where N = nodes</span></td></tr><tr><td>Add Node</td><td>Rehash ~(N-1)/N keys</td><td>Move ~1/N keys</td><td>Move ~1/N keys</td></tr><tr><td>Remove Node</td><td>Rehash ~(N-1)/N keys</td><td>Move ~1/N keys</td><td>Move ~1/N keys</td></tr><tr><td>Memory</td><td><span class="learn-complexity">O(1)</span></td><td><span class="learn-complexity">O(V) = O(N x vnodes_per_node)</span></td><td><span class="learn-complexity">O(N)</span></td></tr><tr><td>Load Balance</td><td>Good (with good hash)</td><td>Excellent (with vnodes)</td><td>Excellent</td></tr><tr><td>Arbitrary Removal</td><td>Yes (but expensive)</td><td>Yes</td><td>Yes</td></tr></table><p class="learn-p"><b>When to use which:</b> Consistent hashing when nodes change frequently (cache clusters, auto-scaling). Rendezvous when N is small and you need simplicity (CDN with 10 PoPs). Modular hashing only when N is fixed (static sharding that never changes).</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Why does modular hashing fail when adding a node?</b><br>A: With hash(key) % 4, key 7 maps to server 3 (7%4=3). Change to 5 servers: 7%5=2. Key 7 now maps to server 2, not 3. For N=4 to N=5: approximately (N-1)/N = 4/5 = 80% of keys must move. Each remapped key is a cache miss, causing a massive DB spike.</p><p class="learn-p"><b>Q2: How do virtual nodes improve distribution?</b><br>A: With 3 physical nodes, the ring has 3 points. By randomness, one node might own 40% of the ring. With 150 vnodes per node (450 points total), the law of large numbers kicks in: each node\'s total arc converges to ~33% with low variance (&lt;2% standard deviation). For heterogeneous hardware, assign vnodes proportionally to capacity.</p><p class="learn-p"><b>Q3: A node fails and its successor is already at 80% capacity. What happens?</b><br>A: Without protection: cascading failure. The successor gets 80% + 25% (failed node\'s share) = 105%, it\'s overloaded. Prevention: (1) Bounded load: cap at 110% of fair share, overflow keys to the next-next node. (2) With RF=3, the failed node\'s keys are already replicated on 2 other nodes, so reads are served from replicas while the ring rebalances.</p><p class="learn-p"><b>Q4: How does DynamoDB use consistent hashing?</b><br>A: DynamoDB uses a variant of consistent hashing with a fixed number of virtual nodes (partitions). Each partition handles a range of hash values. When load increases, DynamoDB splits a partition into two sub-ranges. When a node is added, partitions are reassigned. This gives fine-grained control over data movement.</p><p class="learn-p"><b>Q5: Compare consistent hashing with rendezvous hashing.</b><br>A: Consistent hashing: O(log V) lookup using a sorted ring. Best for large clusters with frequent membership changes. Rendezvous: O(N) lookup (compute hash(key,server) for all servers, pick max). Simpler (no ring), but impractical for N &gt; 1000. Both move only ~1/N keys on add/remove. Rendezvous is used by Ceph (CRUSH map) and some CDNs.</p><p class="learn-p"><b>Q6: How do you handle a hot key (viral content) in a consistent hash ring?</b><br>A: A single hot key maps to one node regardless of vnodes. Three strategies: (1) Key replication: append random suffix (hot_key:0 through hot_key:9), client picks randomly. Spreads load across 10 nodes. (2) Local caching: every app server caches the hot key in-process with short TTL (10s). (3) Real-time hot key detection: monitor QPS per key, promote hot keys to a dedicated over-provisioned cache.</p><p class="learn-p"><b>Q7: What is the time complexity of lookup in a consistent hash ring with V virtual nodes?</b><br>A: O(log V) using a balanced BST (TreeMap). For 100 nodes x 150 vnodes = 15,000 entries: log2(15,000) &asymp; 14 comparisons. With a balanced BST or sorted array, lookups are O(log V) via binary search.</p></div>',
    code: `// === Consistent Hashing Implementation ===

// 1. Full hash ring implementation with virtual nodes
class ConsistentHashRing {
  constructor(replicasPerNode = 150) {
    this.replicasPerNode = replicasPerNode;  // virtual nodes per physical node
    this.ring = new SortedMap();  // hash position -> physical node
    this.nodes = new Set();
  }

  // Hash function: produces a 32-bit integer
  hash(key) {
    return murmurHash3(key) >>> 0;  // unsigned 32-bit
  }

  addNode(node) {
    this.nodes.add(node);
    for (let i = 0; i < this.replicasPerNode; i++) {
      const virtualKey = \`\${node}:vnode:\${i}\`;
      const position = this.hash(virtualKey);
      this.ring.set(position, node);
    }
    // ~1/N of keys will now map to this new node
  }

  removeNode(node) {
    this.nodes.delete(node);
    for (let i = 0; i < this.replicasPerNode; i++) {
      const virtualKey = \`\${node}:vnode:\${i}\`;
      const position = this.hash(virtualKey);
      this.ring.delete(position);
    }
    // ~1/N of keys (previously on this node) move to successors
  }

  // Find the node responsible for a key
  getNode(key) {
    if (this.ring.size === 0) return null;
    const hash = this.hash(key);
    // Find first position >= hash (ceiling entry)
    const entry = this.ring.ceiling(hash);
    // Wrap around if past the end of the ring
    return entry ? entry.value : this.ring.first().value;
  }

  // Get N distinct physical nodes for replication
  getReplicaNodes(key, replicationFactor = 3) {
    if (this.nodes.size < replicationFactor) {
      return [...this.nodes];  // not enough nodes
    }

    const replicas = [];
    const seen = new Set();
    const hash = this.hash(key);

    // Walk clockwise from key position
    for (const [pos, node] of this.ring.from(hash)) {
      if (!seen.has(node)) {  // skip vnodes of same physical node!
        seen.add(node);
        replicas.push(node);
        if (replicas.length === replicationFactor) return replicas;
      }
    }
    // Wrap around from beginning
    for (const [pos, node] of this.ring) {
      if (!seen.has(node)) {
        seen.add(node);
        replicas.push(node);
        if (replicas.length === replicationFactor) return replicas;
      }
    }
    return replicas;
  }
}

// 2. Comparison: Modular vs Consistent Hashing
// Modular: add 1 server to 4
//   hash(key) % 4 -> hash(key) % 5
//   ~80% of keys now map to different servers = 80% cache miss
// Consistent: add 1 server to 4
//   Only keys between new node and its predecessor move
//   ~20% of keys move = 20% cache miss

// 3. Data migration when adding a node
async function addNodeWithMigration(ring, newNode) {
  // Snapshot current mapping
  const oldMapping = new Map();
  for (const key of allKeys) {
    oldMapping.set(key, ring.getNode(key));
  }

  // Add node to ring
  ring.addNode(newNode);

  // Migrate only keys that changed ownership
  let migrated = 0;
  for (const key of allKeys) {
    const newOwner = ring.getNode(key);
    const oldOwner = oldMapping.get(key);
    if (newOwner !== oldOwner) {
      const data = await oldOwner.get(key);
      await newOwner.put(key, data);
      migrated++;
      // Don't delete from old owner yet -- serve from there until confirmed
    }
  }
  console.log(\`Migrated \${migrated} / \${allKeys.length} keys (\${(migrated/allKeys.length*100).toFixed(1)}%)\`);
}

// 4. Hot key mitigation
function getWithHotKeyHandling(ring, key) {
  if (hotKeyDetector.isHot(key)) {
    // Spread across 10 replicas with random suffix
    const suffix = Math.floor(Math.random() * 10);
    return ring.getNode(key + ':replica:' + suffix);
  }
  return ring.getNode(key);
}

// 5. Bounded load to prevent cascading failure
class BoundedLoadRing extends ConsistentHashRing {
  constructor(replicasPerNode, maxLoadFactor = 1.25) {
    super(replicasPerNode);
    this.maxLoadFactor = maxLoadFactor;
    this.nodeLoad = new Map();
  }

  getNode(key) {
    const avgLoad = totalKeys / this.nodes.size;
    const maxLoad = avgLoad * this.maxLoadFactor;

    const hash = this.hash(key);
    for (const [pos, node] of this.ring.from(hash)) {
      if ((this.nodeLoad.get(node) || 0) < maxLoad) {
        this.nodeLoad.set(node, (this.nodeLoad.get(node) || 0) + 1);
        return node;
      }
      // Node overloaded, try next clockwise
    }
    // Wrap around...
  }
}`,
    problems: [
      ["Design a Key-Value Store","https://codemia.io/system-design/design-a-key-value-store","Hard"],
      ["Design a Key-Value Store (Guided)","https://bytebytego.com/courses/system-design-interview/design-a-key-value-store","Hard"],
      ["Consistent Hashing Deep Dive","https://www.designgurus.io/course/grokking-the-system-design-interview","Medium"],
      ["Mastering Estimation (Hashing)","https://www.hellointerview.com/blog/mastering-estimation","Medium"]
    ],
    mcqs: [
      {"q":"When adding a 5th node to a 4-node consistent hash ring, approximately what percentage of keys need to move?","o":["80%","50%","25%","20%"],"a":3},
      {"q":"The primary purpose of virtual nodes in consistent hashing is:","o":["To improve query speed","To achieve more uniform key distribution","To provide encryption","To reduce memory usage"],"a":1},
      {"q":"In a hash ring with replication factor 3, why must you skip virtual nodes of the same physical server?","o":["To improve read speed","To ensure 3 distinct physical copies exist","To reduce network traffic","Virtual nodes of the same server have the same hash"],"a":1},
      {"q": "Virtual nodes in consistent hashing solve the problem of:", "o": ["Hash collisions", "Uneven data distribution when physical nodes have different capacities", "Network latency", "Data replication"], "a": 1},
      {"q":"What is the lookup time complexity in a consistent hash ring with V total virtual nodes?","o":["O(1)","O(log V)","O(V)","O(N) where N is physical nodes"],"a":1},
      {"q":"Rendezvous hashing differs from consistent hashing primarily in:","o":["It cannot handle node removal","It evaluates hash(key,server) for ALL servers on each lookup","It requires more memory","It moves more keys when nodes change"],"a":1},
      {"q":"Cascading failure in a hash ring occurs when:","o":["Too many virtual nodes are used","A failed node's keys overload its successor, which then fails too","The hash function produces collisions","Keys are not evenly distributed"],"a":1},
      {"q":"For heterogeneous hardware in a consistent hash ring, you should:","o":["Use a different hash function for each server","Give more virtual nodes to higher-capacity servers","Put larger servers at specific ring positions","Use modular hashing instead"],"a":1}
    ],
  },
  {
    t: "Data Models & Storage Engines",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">LinkedIn\'s social graph has 900M+ members connected by billions of relationships. Querying "people you may know" (friends of friends) in a relational database requires a 3-way self-JOIN on a billion-row table -- a query that would take minutes. Their graph database computes the same result in milliseconds using index-free adjacency. Choosing the wrong data model doesn\'t just degrade performance; it can make critical features <b>architecturally impossible</b>.</p><p class="learn-p">In any system processing millions of financial transactions per second, understanding storage engines is existential. An LSM-tree-based system (RocksDB) can ingest 500K writes/second -- perfect for market data. A B-tree-based system (PostgreSQL) excels at point reads for account lookups. Using the wrong engine for your workload is a fundamental architectural mistake.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">A <b>data model</b> determines how you think about your data (tables, documents, graphs). A <b>storage engine</b> determines how data is physically stored and retrieved on disk. These are orthogonal choices.</p><table class="learn-table"><tr><th>Data Model</th><th>Structure</th><th>Joins</th><th>Schema</th><th>Best For</th></tr><tr><td><b>Relational (SQL)</b></td><td>Tables with rows and columns</td><td>Powerful JOINs</td><td>Strict schema (schema-on-write)</td><td>Structured data, transactions, reporting</td></tr><tr><td><b>Document (NoSQL)</b></td><td>Nested JSON/BSON documents</td><td>Weak/no JOINs</td><td>Flexible (schema-on-read)</td><td>Semi-structured, varied attributes, rapid iteration</td></tr><tr><td><b>Graph</b></td><td>Nodes + edges with properties</td><td>Traversals (not JOINs)</td><td>Flexible</td><td>Highly connected data: social networks, fraud detection</td></tr><tr><td><b>Wide-Column</b></td><td>Column families, sparse columns</td><td>No JOINs</td><td>Flexible columns per row</td><td>Time-series, IoT, event logs (Cassandra, HBase)</td></tr><tr><td><b>Key-Value</b></td><td>Simple key-value pairs</td><td>None</td><td>Schema-less</td><td>Caching, sessions, config (Redis, DynamoDB)</td></tr></table><div class="learn-code">Data Model Comparison for Social Network:\n\nRelational (PostgreSQL):\n  users: [id, name, email]\n  friendships: [user_id, friend_id]\n  posts: [id, author_id, content]\n  Friends-of-friends query: 3 JOINs, O(n log n) per JOIN\n\nDocument (MongoDB):\n  { _id: "user123", name: "Alice",\n    friends: ["user456", "user789"],\n    posts: [{ content: "Hello", likes: 42 }] }\n  Friends-of-friends: application-level joins (fetch each friend doc)\n\nGraph (Neo4j):\n  (Alice)-[:FRIEND]-&gt;(Bob)-[:FRIEND]-&gt;(Carol)\n  Friends-of-friends: MATCH (me)-[:FRIEND]-&gt;()-[:FRIEND]-&gt;(fof)\n  Each hop: O(1) via index-free adjacency</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><ul class="learn-list"><li><b>B-Tree:</b> The default storage engine for relational databases (PostgreSQL/InnoDB, MySQL, SQLite). Self-balancing tree where each node is a disk page (~4KB-16KB). O(log n) reads and writes. Optimized for read-heavy workloads with point lookups and range queries.</li><li><b>LSM Tree (Log-Structured Merge Tree):</b> Write-optimized storage. Writes go to an in-memory memtable, then flush to sorted SSTables on disk. Background compaction merges SSTables. Used by Cassandra, RocksDB, LevelDB, HBase. O(1) amortized writes, O(log n) reads (may check multiple SSTables).</li><li><b>WAL (Write-Ahead Log):</b> Sequential append-only log written before any data modification. Ensures crash recovery -- replay the WAL to recover uncommitted changes. Used by both B-trees and LSM trees.</li><li><b>SSTable (Sorted String Table):</b> Immutable, sorted file on disk. Enables efficient range queries and merging. Each SSTable has a sparse index and optionally a Bloom filter.</li><li><b>Bloom Filter:</b> Probabilistic data structure in front of each SSTable. Quickly determines if a key is NOT in the SSTable, avoiding unnecessary disk reads. False positive rate ~1% with ~10 bits per key.</li><li><b>Memtable:</b> In-memory sorted data structure (red-black tree or skip list) that buffers writes before flushing to SSTables. Typically 64MB-256MB in size.</li><li><b>Compaction:</b> Background process that merges SSTables, removing duplicates and tombstones. Two strategies: size-tiered (Cassandra default -- good write throughput) and leveled (LevelDB/RocksDB -- better read performance, more write amplification).</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Let\'s trace a write and read through an LSM tree (RocksDB/Cassandra):</p><ol class="learn-list"><li><b>Write path -- INSERT user_id=42, name="Alice":</b> (a) Append to WAL on disk (sequential write, ~10&mu;s on SSD). This ensures durability. (b) Insert into memtable (in-memory skip list, ~1&mu;s). (c) Return success to client. Total write latency: ~15&mu;s. The key insight: <b>no random disk I/O</b> -- all sequential.</li><li><b>Memtable flush:</b> When memtable reaches 64MB, it\'s written to disk as an immutable SSTable (Level 0). The SSTables at Level 0 may have overlapping key ranges.</li><li><b>Compaction:</b> Background thread merges Level 0 SSTables into Level 1 (non-overlapping ranges). Level 1 into Level 2, etc. Each level is ~10x larger. This is where <b>write amplification</b> occurs: each key might be rewritten 10-30 times across levels.</li><li><b>Read path -- SELECT WHERE user_id=42:</b> (a) Check memtable first (O(log n) in skip list). (b) If not found, check Level 0 SSTables (may check all, since they can overlap). (c) Check Level 1, Level 2, etc. Use Bloom filter on each SSTable to skip files that definitely don\'t contain key 42. (d) Worst case with 5 levels: check 5 SSTables + memtable = <b>read amplification</b>.</li></ol><div class="learn-code">LSM Tree Structure:\n\nMemtable (64MB, in-memory, sorted)\n    |\n    v  (flush when full)\nLevel 0: [SST-1] [SST-2] [SST-3]  (overlapping ranges, newest first)\n    |\n    v  (compaction: merge &amp; sort)\nLevel 1: [SST-A  |  SST-B  |  SST-C]  (non-overlapping, ~640MB)\n    |\n    v  (compaction)\nLevel 2: [SST-X | SST-Y | SST-Z | ...]  (non-overlapping, ~6.4GB)\n    |\n    v\nLevel 3: [...]  (~64GB)\n\nWrite: WAL --&gt; Memtable (fast!)\nRead:  Memtable --&gt; L0 --&gt; L1 --&gt; L2 --&gt; ... (use Bloom filters)</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Feature</th><th>B-Tree (PostgreSQL/InnoDB)</th><th>LSM Tree (RocksDB/Cassandra)</th></tr><tr><td>Write speed</td><td>Slower -- random I/O for page updates</td><td><b>Fast</b> -- sequential writes only</td></tr><tr><td>Read speed</td><td><b>Fast</b> -- O(log n) single tree traversal</td><td>Slower -- may check multiple SSTables</td></tr><tr><td>Write amplification</td><td>Low (~2-4x, rewrite a 4KB page for 100B update)</td><td>High (~10-30x, due to compaction)</td></tr><tr><td>Space amplification</td><td>Low (in-place updates)</td><td>Higher (stale data until compacted)</td></tr><tr><td>Concurrency</td><td>Row/page locking</td><td>No locks on write path (append-only)</td></tr><tr><td>Best for</td><td>Read-heavy, transactions, point lookups</td><td>Write-heavy, time-series, event streams</td></tr></table><p class="learn-p"><b>Column-Oriented vs Row-Oriented Storage:</b></p><table class="learn-table"><tr><th>Feature</th><th>Row Store (OLTP)</th><th>Column Store (OLAP)</th></tr><tr><td>Storage</td><td>Entire row stored together</td><td>Each column stored separately</td></tr><tr><td>Read pattern</td><td>Full row retrieval (SELECT *)</td><td>Few columns, many rows (SELECT AVG(price))</td></tr><tr><td>Write pattern</td><td>Insert/update full rows</td><td>Bulk loads (ETL)</td></tr><tr><td>Compression</td><td>Moderate (mixed types per row)</td><td>Excellent (same type, run-length/dictionary encoding)</td></tr><tr><td>I/O for analytics</td><td>Reads all 100 columns even if query needs 2</td><td>Reads only needed columns (50x less I/O)</td></tr><tr><td>Systems</td><td>PostgreSQL, MySQL, Oracle</td><td>Redshift, BigQuery, ClickHouse, Parquet</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>OLTP + OLAP on Same DB:</b> Running analytics (table scan of 100M rows) on your production OLTP database causes lock contention, degrades web app performance, and can cause timeouts. Solution: replicate data to a separate data warehouse (ETL/CDC pipeline). Never run analytical queries on the primary OLTP database.</div><div class="learn-warn"><b>LSM Compaction Stalls:</b> If write throughput exceeds compaction throughput, uncompacted SSTables pile up. Read performance degrades (more files to check). Eventually, the system throttles writes until compaction catches up. This is called "write stall" and can cause sudden latency spikes.</div><ul class="learn-list"><li><b>Document Model Joins:</b> MongoDB doesn\'t support JOINs natively. If your data is heavily relational (many-to-many relationships), you\'ll do application-level joins -- fetching document A, then fetching all referenced documents B, C, D individually. This is N+1 query problem and much slower than a SQL JOIN.</li><li><b>Schema Evolution:</b> Relational: ALTER TABLE ADD COLUMN is a blocking operation on large tables (30+ minutes for 1B rows in some databases). Document: adding a field is trivial (just include it in new documents), but old documents don\'t have it -- handle at read time (schema-on-read).</li><li><b>Graph Query Depth:</b> Graph traversals with unbounded depth (find ALL connections) can explode exponentially. A social network with avg 200 friends: depth 1 = 200, depth 2 = 40K, depth 3 = 8M, depth 4 = 1.6B. Always limit traversal depth.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>B-Tree</th><th>LSM Tree</th><th>Hash Index</th></tr><tr><td>Point read</td><td><span class="learn-complexity">O(log n)</span></td><td><span class="learn-complexity">O(log n) * levels</span></td><td><span class="learn-complexity">O(1) avg</span></td></tr><tr><td>Range scan</td><td><span class="learn-complexity">O(log n + k)</span></td><td><span class="learn-complexity">O(log n + k) after merge</span></td><td><span class="learn-complexity">O(n) -- must scan all</span></td></tr><tr><td>Insert</td><td><span class="learn-complexity">O(log n) + random I/O</span></td><td><span class="learn-complexity">O(1) amortized (sequential)</span></td><td><span class="learn-complexity">O(1) avg</span></td></tr><tr><td>Update</td><td><span class="learn-complexity">O(log n) -- in-place</span></td><td><span class="learn-complexity">O(1) -- append new version</span></td><td><span class="learn-complexity">O(1) avg</span></td></tr><tr><td>Delete</td><td><span class="learn-complexity">O(log n) -- mark/remove</span></td><td><span class="learn-complexity">O(1) -- write tombstone</span></td><td><span class="learn-complexity">O(1) avg</span></td></tr><tr><td>Space usage</td><td>~67% fill factor</td><td>Variable (stale data exists)</td><td>~50% fill factor</td></tr></table><table class="learn-table"><tr><th>Database</th><th>Storage Engine</th><th>Data Model</th><th>Use Case</th></tr><tr><td>PostgreSQL</td><td>B-Tree (heap + indexes)</td><td>Relational</td><td>General OLTP, transactions</td></tr><tr><td>MySQL (InnoDB)</td><td>B-Tree (clustered index)</td><td>Relational</td><td>Web applications, WordPress</td></tr><tr><td>MongoDB</td><td>WiredTiger (B-Tree + LSM)</td><td>Document</td><td>Semi-structured data, rapid prototyping</td></tr><tr><td>Cassandra</td><td>LSM Tree</td><td>Wide-Column</td><td>Write-heavy, time-series, IoT</td></tr><tr><td>RocksDB</td><td>LSM Tree</td><td>Key-Value</td><td>Embedded store, MyRocks (MySQL)</td></tr><tr><td>Neo4j</td><td>Native graph (index-free adjacency)</td><td>Graph</td><td>Social networks, recommendations</td></tr><tr><td>ClickHouse</td><td>Column-oriented + merge tree</td><td>Columnar</td><td>Real-time analytics, event data</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: When would you choose a document model over relational?</b><br>A: When your data has variable structure (e.g., product catalog where shoes have "size" but electronics have "wattage"). When the entire document is typically loaded together (one-to-many relationships within a document). When you need schema flexibility for rapid iteration. When you don\'t need cross-document JOINs. <b>Don\'t choose document</b> when you have many-to-many relationships or need multi-document transactions.</p><p class="learn-p"><b>Q2: LSM tree vs B-tree for a write-heavy IoT sensor system?</b><br>A: LSM tree wins decisively. IoT sensors write continuously (100K+ writes/sec) but reads are infrequent (hourly aggregations). LSM\'s sequential writes are 10-100x faster than B-tree\'s random page updates. The write amplification from compaction is acceptable because the read path is less critical. Cassandra or ScyllaDB (LSM-based) are ideal choices.</p><p class="learn-p"><b>Q3: Explain write amplification in LSM trees. Why does it matter?</b><br>A: A single logical write might be physically written 10-30x: once to WAL, once to memtable/SSTable, then rewritten during compaction across multiple levels. For a 100-byte write with 30x amplification: 3KB of actual disk I/O. At 100K writes/sec: 300 MB/s of disk write bandwidth consumed. SSD write endurance is also a concern -- SSDs have limited write cycles.</p><p class="learn-p"><b>Q4: Why is column-oriented storage better for analytics?</b><br>A: For "SELECT AVG(price) FROM products" on 100M rows with 100 columns: row store reads all 100 columns per row = 100M x 100 x 8B = 80 GB. Column store reads only the price column = 100M x 8B = 800 MB. That\'s 100x less I/O. Column stores also compress better (similar values in a column enable run-length and dictionary encoding), reducing it to ~200 MB.</p><p class="learn-p"><b>Q5: How does graph traversal achieve O(1) per hop?</b><br>A: In a native graph database (Neo4j), each node physically stores pointers to its adjacent edges. Traversing from node A to its neighbors is a pointer dereference -- O(1), not a lookup in an index. In a relational database, finding node A\'s neighbors requires an index lookup in the "edges" table -- O(log n). For a 3-hop query with avg 200 connections/node: graph = 3 x O(1), relational = 3 x O(log n) JOINs.</p><p class="learn-p"><b>Q6: When would you use a wide-column store like Cassandra?</b><br>A: Time-series data where each row is a device/sensor and columns are timestamped measurements. Write-heavy workloads (IoT: millions of writes/sec). Multi-DC replication with tunable consistency (eventual or strong per query). When you need horizontal scalability without manual sharding. <b>Don\'t use</b> when you need JOINs, secondary indexes, or full ACID transactions across multiple partitions.</p></div>',
    code: `// === Data Models & Storage Engines ===

// 1. Relational model (SQL) -- friends-of-friends query
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE
);
CREATE TABLE friendships (
  user_id INT REFERENCES users(id),
  friend_id INT REFERENCES users(id),
  PRIMARY KEY (user_id, friend_id)
);
-- Friends of friends who liked a post (3 JOINs)
SELECT DISTINCT u_fof.name
FROM users u
  JOIN friendships f1 ON u.id = f1.user_id
  JOIN friendships f2 ON f1.friend_id = f2.user_id
  JOIN likes l ON f2.friend_id = l.user_id
  JOIN users u_fof ON l.user_id = u_fof.id
WHERE u.id = 123 AND l.post_id = 456;
-- Cost: O(n log n) per JOIN with index lookups

// 2. Document model (MongoDB)
{
  "_id": "user123",
  "name": "Alice",
  "posts": [
    { "content": "Hello world", "likes": 42, "created": "2024-01-15" },
    { "content": "System design is fun", "likes": 100 }
  ],
  "friends": ["user456", "user789"]
}
// Friends-of-friends: N+1 query problem
// 1. Fetch Alice's friends list: ["user456", "user789"]
// 2. For each friend, fetch THEIR friends: N queries
// 3. No server-side JOIN -- all done in application code

// 3. Graph model (Neo4j Cypher)
// MATCH (me:User {id: 123})-[:FRIEND]->()-[:FRIEND]->(fof)
//       -[:LIKED]->(post:Post {id: 456})
// RETURN DISTINCT fof.name
// Each hop: O(1) via index-free adjacency (pointer dereference)

// 4. LSM Tree write path (pseudocode)
class LSMTree {
  constructor() {
    this.wal = new WriteAheadLog();
    this.memtable = new SkipList();
    this.levels = [[], [], [], [], []]; // 5 levels
  }

  write(key, value) {
    this.wal.append(key, value);         // 1. Durability (sequential disk write)
    this.memtable.put(key, value);       // 2. Fast in-memory write
    if (this.memtable.size > 64 * 1024 * 1024) { // 64MB
      const sstable = this.memtable.flush(); // 3. Sort and write to disk
      this.levels[0].push(sstable);
      this.memtable = new SkipList();
      this.scheduleCompaction();         // 4. Background merge
    }
  }

  read(key) {
    // Check memtable first (newest data)
    let val = this.memtable.get(key);
    if (val !== undefined) return val;

    // Check each level, newest first
    for (const level of this.levels) {
      for (const sst of level.slice().reverse()) {
        // Bloom filter: skip SSTables that definitely don't have the key
        if (!sst.bloomFilter.mightContain(key)) continue;
        val = sst.get(key);  // binary search in sorted SSTable
        if (val !== undefined) return val;
      }
    }
    return null; // key not found anywhere
  }

  delete(key) {
    // Write a tombstone marker -- actual deletion happens during compaction
    this.write(key, TOMBSTONE);
  }
}

// 5. B-Tree vs LSM: write amplification comparison
// B-Tree: update a 4KB page for a 100-byte write
//   = 4KB / 100B = 40x byte-level overhead per write (but only 2-4x I/O ops: WAL + page write)
// LSM (leveled): write memtable -> L0 -> L1 -> L2 -> L3 -> L4
//   Each level: ~10x compaction = ~10-30x total amplification
//   But all writes are SEQUENTIAL (100x faster than B-tree random I/O)

// 6. Column-oriented query optimization
// Row store: SELECT AVG(price) FROM products (100M rows, 100 columns)
//   Reads: 100M rows × 100 cols × 8 bytes = 80 GB of I/O
// Column store: reads ONLY the price column
//   Reads: 100M × 8 bytes = 800 MB (100x less I/O!)
//   With compression (run-length + dictionary): ~200 MB

// 7. OLTP vs OLAP separation
// Production DB (PostgreSQL) ---CDC/ETL---> Data Warehouse (Redshift)
//   OLTP: point queries, transactions      OLAP: aggregations, reports
//   Row-oriented, B-tree indexed           Column-oriented, compressed
//   <10ms latency                          Seconds to minutes OK`,
    problems: [
      ["Design a Key-Value Store","https://codemia.io/system-design/design-a-key-value-store","Hard"],
      ["System Design Primer: Database","https://github.com/donnemartin/system-design-primer","Medium"],
      ["Design a Coding Platform","https://www.hellointerview.com/learn/system-design/problem-breakdowns/leetcode","Hard"]
    ],
    mcqs: [
      {"q":"Which storage engine is better for write-heavy IoT sensor data?","o":["B-Tree","LSM Tree","Column store","Hash index"],"a":1},
      {"q":"In a graph database, index-free adjacency means:","o":["No indexes are used","Each node directly points to adjacent nodes, making traversal O(1) per hop","Adjacency lists are stored in column format","The graph is stored as a B-tree"],"a":1},
      {"q":"Why is column-oriented storage preferred for analytics (OLAP)?","o":["It supports faster writes","It reads only the needed columns, reducing I/O by orders of magnitude","It provides stronger ACID guarantees","It doesn't require schema"],"a":1},
      {"q":"The purpose of Bloom filters in LSM trees is to:","o":["Compress SSTables","Speed up writes to the WAL","Quickly determine if a key is NOT in an SSTable, avoiding disk reads","Sort keys during compaction"],"a":2},
      {"q":"Write amplification in LSM trees (10-30x) means:","o":["Reads are amplified 10-30x","Each logical write causes 10-30x physical disk writes due to compaction","The WAL grows 10-30x larger than needed","Memory usage is amplified"],"a":1},
      {"q":"Which data model is worst for many-to-many relationships?","o":["Relational","Graph","Document","All handle it equally well"],"a":2},
      {"q":"When running analytics queries on an OLTP database, the main problem is:","o":["Insufficient storage space","Lock contention degrading transaction performance","Network bandwidth limitations","Schema incompatibility"],"a":1}
    ],
  },
  {
    t: "Replication & Partitioning",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">On October 4, 2021, Facebook went down for 6 hours. Their DNS servers lost the BGP routes to their data centers. But even before this, Facebook\'s database layer is designed to handle a much more common failure: individual server crashes. With 100,000+ database servers, at any given moment some servers are failing. Without replication, every server failure means data loss. Without partitioning, a single database can\'t hold petabytes of data or handle millions of queries per second.</p><p class="learn-p">Trading systems must process market data with sub-millisecond latency across multiple data centers. Replication ensures no trade is lost. Partitioning ensures the system scales to handle the entire market. These aren\'t theoretical concepts -- they\'re the difference between a profitable system and a bankrupt one.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p"><b>Replication</b> copies the same data across multiple nodes for fault tolerance and read scalability. <b>Partitioning</b> (sharding) splits different data across multiple nodes for write scalability and storage capacity. Most production systems use <b>both</b>: data is partitioned, and each partition is replicated.</p><div class="learn-code">Replication + Partitioning Combined:\n\nPartition 1 (users A-M):           Partition 2 (users N-Z):\n  [Leader 1]   --repl--&gt; [Follower 1a]    [Leader 2]   --repl--&gt; [Follower 2a]\n               --repl--&gt; [Follower 1b]                 --repl--&gt; [Follower 2b]\n  (writes A-M)  (reads A-M)               (writes N-Z)  (reads N-Z)\n\nTotal: 2 partitions x 3 replicas = 6 nodes\nWrite capacity: 2x (two leaders)\nRead capacity: 6x (all nodes serve reads)\nFault tolerance: survives 1 failure per partition</div><table class="learn-table"><tr><th>Strategy</th><th>Writes</th><th>Conflicts</th><th>Consistency</th><th>Use Case</th></tr><tr><td><b>Single-Leader</b></td><td>One leader handles all writes</td><td>No write conflicts</td><td>Strong (sync) or eventual (async)</td><td>PostgreSQL, MySQL (most common)</td></tr><tr><td><b>Multi-Leader</b></td><td>Multiple leaders accept writes</td><td>Write conflicts between leaders</td><td>Eventual (conflict resolution needed)</td><td>Multi-DC setups (MySQL Group Replication multi-primary)</td></tr><tr><td><b>Leaderless</b></td><td>Any node accepts writes (quorum)</td><td>Concurrent write conflicts</td><td>Tunable (quorum W + R &gt; N)</td><td>DynamoDB, Cassandra, Riak</td></tr></table></div><div class="learn-section"><div class="learn-h">Building Blocks</div><ul class="learn-list"><li><b>WAL Shipping:</b> The leader sends its Write-Ahead Log to followers. Followers replay the log to stay in sync. PostgreSQL uses this for streaming replication. Risk: WAL format is version-specific, so leader and follower must run the same version.</li><li><b>Logical Replication:</b> Instead of raw WAL bytes, send logical changes ("row 123, column X changed from A to B"). Decoupled from storage format. Supports cross-version replication and CDC (Change Data Capture).</li><li><b>Quorum:</b> In leaderless systems, a write succeeds if W nodes acknowledge it. A read succeeds if R nodes respond. If W + R &gt; N (total replicas), at least one node has the latest write. Common config: N=3, W=2, R=2.</li><li><b>Vector Clocks:</b> Each node maintains a vector of logical timestamps (one per node). Two writes are concurrent if neither\'s vector dominates the other\'s. Used by DynamoDB and Riak to detect conflicts.</li><li><b>Sloppy Quorum / Hinted Handoff:</b> During a network partition, if the designated quorum nodes are unreachable, write to any available node ("hint"). When the partition heals, the hint is forwarded to the correct node. Improves availability at the cost of consistency.</li><li><b>Anti-Entropy:</b> Background process that compares data across replicas and repairs inconsistencies. Uses Merkle trees (hash trees) to efficiently identify differing key ranges without transferring all data.</li><li><b>Fencing Token:</b> A monotonically increasing epoch number given to each new leader. Prevents split-brain: old leader\'s writes with stale epoch are rejected.</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Let\'s trace a leader failover scenario in a PostgreSQL replication setup with 1 leader + 2 followers:</p><ol class="learn-list"><li><b>Normal operation:</b> Leader is at WAL position 1000. Follower A is at 998 (2 behind), Follower B is at 995 (5 behind). Async replication means followers may lag.</li><li><b>Leader crashes:</b> The leader had committed transactions at positions 1001, 1002 that hadn\'t replicated to any follower. These transactions are <b>permanently lost</b>.</li><li><b>Promotion:</b> The HA system (Patroni/pg_auto_failover) promotes Follower A (most up-to-date at position 998). Follower A becomes the new leader with epoch 2.</li><li><b>Follower B catches up:</b> B is at 995, new leader A is at 998. B fetches positions 996-998 from A and catches up.</li><li><b>Old leader comes back:</b> It believes it\'s still the leader with positions up to 1002. But epoch 2 has been issued. Any writes from the old leader with epoch 1 are <b>rejected</b> (fencing). The old leader must discard positions 999-1002 and rejoin as a follower.</li><li><b>Split-brain prevention:</b> If the old leader didn\'t know about the new epoch and accepted writes, we\'d have two leaders -- split brain. Fencing tokens prevent this: clients and followers only accept writes from the highest epoch.</li></ol><div class="learn-code">Leader Failover Timeline:\n\nt=0:  Leader at pos 1000, A at 998, B at 995\nt=1:  Leader commits 1001, 1002 (not yet replicated)\nt=2:  Leader crashes!\n      Lost: positions 1001, 1002 (unreplicated commits)\nt=3:  Patroni detects failure (missed 3 heartbeats, ~15s)\nt=4:  Promote Follower A as new leader (epoch 2)\nt=5:  Follower B catches up from A (fetches 996-998)\nt=6:  Old leader restarts with epoch 1\n      Fenced: epoch 1 &lt; epoch 2, must rejoin as follower\n      Discards positions 999-1002, syncs from new leader at 998</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><p class="learn-p"><b>Partitioning Strategies:</b></p><table class="learn-table"><tr><th>Strategy</th><th>How</th><th>Range Queries</th><th>Distribution</th><th>Hot Spots</th></tr><tr><td><b>Range</b></td><td>Key ranges: A-F, G-M, N-Z</td><td>Efficient (single partition)</td><td>Can be uneven</td><td>High risk (e.g., all writes to "today" partition)</td></tr><tr><td><b>Hash</b></td><td>hash(key) % N</td><td>Scatter-gather (all partitions)</td><td>Even</td><td>Low (unless single hot key)</td></tr><tr><td><b>Compound</b></td><td>Partition by hash(user_id), sort by timestamp</td><td>Efficient within a user</td><td>Even</td><td>Low (user-level hot spots possible)</td></tr></table><p class="learn-p"><b>Replication Consistency Guarantees:</b></p><table class="learn-table"><tr><th>Guarantee</th><th>Problem Solved</th><th>Implementation</th></tr><tr><td><b>Read-your-writes</b></td><td>User updates profile, reads stale follower, sees old data</td><td>Route user\'s reads to leader for 10s after their last write</td></tr><tr><td><b>Monotonic reads</b></td><td>User refreshes, hits a more-stale follower, data "goes back in time"</td><td>Session affinity: route each user to the same replica</td></tr><tr><td><b>Consistent prefix reads</b></td><td>Causally related writes ("Q then A") arrive out of order</td><td>Track causal dependencies with Lamport timestamps</td></tr></table><p class="learn-p"><b>Multi-Leader Conflict Resolution:</b></p><ul class="learn-list"><li><b>Last Writer Wins (LWW):</b> Highest timestamp wins. Simple but <b>loses data silently</b>. Cassandra uses this by default.</li><li><b>Merge:</b> Automatically merge compatible changes (CRDTs: counters, sets, registers). Works for specific data types only.</li><li><b>Application-level resolution:</b> Store all conflicting versions, let the application/user choose. Amazon\'s shopping cart uses this (merge all items).</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Split Brain:</b> The old leader comes back online and thinks it\'s still the leader. Two leaders accept writes simultaneously. Data diverges permanently. Worse: if both modify the same row with different values, there\'s no way to know which is correct. Prevention: fencing tokens (epoch numbers), STONITH (Shoot The Other Node In The Head -- actually power off the old leader).</div><div class="learn-warn"><b>Write Skew in Leaderless Systems:</b> Two users simultaneously read that 2 doctors are on call, each decides to remove themselves. Both writes succeed (quorum met). Result: 0 doctors on call. This is "write skew" -- each write was valid individually but the combination violates an invariant. Leaderless systems cannot prevent this without linearizable reads.</div><ul class="learn-list"><li><b>Replication Lag Anomalies:</b> With 3 followers at different lag levels (100ms, 500ms, 2s), a user might see data "jump around" as different requests hit different followers. Monotonic reads (session affinity) prevents this.</li><li><b>Hot Partition:</b> Range partitioning by timestamp means ALL current writes go to one partition (the latest time range). Hash partitioning fixes distribution but breaks time-range queries. Compound key (hash on entity, sort on time) is the best compromise.</li><li><b>Scatter-Gather Tail Latency:</b> With hash partitioning and 100 shards, a query that touches all shards (e.g., "find all red cars") has latency = max(latency of all 100 shards). If each shard\'s p99 is 50ms, the query\'s p99 is much worse (tail latency amplification).</li><li><b>Rebalancing:</b> Adding a new partition requires moving data. During movement, both old and new partition must serve reads for the migrating data range. This is complex and can cause brief inconsistencies.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Aspect</th><th>Single-Leader</th><th>Multi-Leader</th><th>Leaderless</th></tr><tr><td>Write latency</td><td>Low (single leader)</td><td>Low (local DC leader)</td><td>Medium (quorum write)</td></tr><tr><td>Read scalability</td><td>High (add followers)</td><td>High</td><td>High (any node reads)</td></tr><tr><td>Write scalability</td><td>Limited (single leader)</td><td>Good (per-DC leader)</td><td>Good (any node writes)</td></tr><tr><td>Consistency</td><td>Strong (sync) or eventual</td><td>Eventual (conflicts)</td><td>Tunable (quorum)</td></tr><tr><td>Conflict handling</td><td>None (single writer)</td><td>Needed (LWW, merge, app)</td><td>Needed (vector clocks)</td></tr><tr><td>Failover complexity</td><td>Medium (promote follower)</td><td>Low (other leaders exist)</td><td>None (no leader to fail)</td></tr><tr><td>Split-brain risk</td><td>Yes (during failover)</td><td>By design (multiple leaders)</td><td>No leader = no split brain</td></tr></table><table class="learn-table"><tr><th>Secondary Index Type</th><th>Write Cost</th><th>Read Cost</th><th>Consistency</th></tr><tr><td>Local (document-partitioned)</td><td>Fast (local update)</td><td>Slow (scatter-gather ALL partitions)</td><td>Strong (local)</td></tr><tr><td>Global (term-partitioned)</td><td>Slow (distributed update)</td><td>Fast (single partition lookup)</td><td>Eventual (async global update)</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Compare single-leader, multi-leader, and leaderless replication.</b><br>A: Single-leader: simplest, no conflicts, but write bottleneck and failover risk. PostgreSQL, MySQL. Multi-leader: each DC has a leader for low-latency local writes, but conflicts between DCs must be resolved (LWW, merge, or app-level). Used in multi-DC deployments. Leaderless: any node accepts writes, quorum-based (W+R&gt;N). Most available (no leader to fail), but complex conflict handling. DynamoDB, Cassandra.</p><p class="learn-p"><b>Q2: During leader failover, what happens to unreplicated transactions?</b><br>A: They\'re lost. If the leader committed positions 1001-1005 but only 1000 was replicated, those 5 transactions are gone. Mitigation: (1) Synchronous replication to at least 1 follower (durability guarantee but higher latency). (2) Semi-synchronous: wait for 1 of 2 followers to ACK (balance). (3) Accept the risk of small data loss in exchange for lower latency (most startups).</p><p class="learn-p"><b>Q3: How do quorum reads and writes work? What does W+R&gt;N guarantee?</b><br>A: With N=3 replicas: W=2 means a write succeeds when 2 of 3 nodes ACK. R=2 means a read queries 2 of 3 nodes and takes the latest value. Since W+R=4 &gt; N=3, at least 1 node in any read quorum participated in the write quorum. This guarantees the read sees the latest write. But it\'s NOT linearizable -- concurrent operations may see different orderings.</p><p class="learn-p"><b>Q4: Range vs hash partitioning -- design a compound key strategy.</b><br>A: Use Cassandra-style compound key: partition key = hash(user_id) for even distribution. Clustering key = timestamp for sorted storage within each partition. Query "all events for user X in the last hour" hits a single partition and does a range scan on timestamp. This gives balanced distribution AND efficient time-range queries within a user\'s data.</p><p class="learn-p"><b>Q5: A celebrity user (100M followers) causes a hot partition. How do you mitigate?</b><br>A: (1) Shard the celebrity\'s write partition further: user_id + random_suffix (0-9) creates 10 sub-partitions. Reads scatter across 10 sub-partitions. (2) Use a separate "hot user" table with dedicated resources. (3) Precompute and cache the celebrity\'s feed instead of computing it from the database. Twitter uses a hybrid: fanout-on-write for normal users, fanout-on-read for celebrities.</p><p class="learn-p"><b>Q6: Why is statement-based replication dangerous?</b><br>A: Non-deterministic functions produce different values on replicas: NOW() returns different timestamps, RAND() returns different values, auto-increment IDs may differ if concurrent inserts occur in different order. Row-based (logical) replication sends the actual data changes ("row 123, col X changed from A to B") -- deterministic and safe.</p><p class="learn-p"><b>Q7: How do you handle secondary indexes in a sharded database?</b><br>A: Two approaches: (1) Local index: each shard has its own index. Writes are fast (local), but queries like "find all red cars" must scatter to ALL shards (slow). (2) Global index: a separate index partitioned by the indexed term. Reads are fast (single shard), but writes must update the global index (distributed transaction or async). Most systems use local indexes with scatter-gather, accepting the read overhead.</p></div>',
    code: `// === Replication & Partitioning ===

// 1. Single-leader replication flow
Leader (writes) → WAL → Replication Stream → Follower 1 (reads)
                                            → Follower 2 (reads)
                                            → Follower 3 (reads)

// Sync vs Async replication
// Synchronous: leader waits for follower ACK → durable but slower
// Asynchronous: leader doesn't wait → fast but risk of data loss
// Semi-synchronous: wait for 1 of N followers → balance

// 2. Read-your-writes consistency
async function readAfterWrite(userId, key) {
  // Check if user recently wrote (within last 10 seconds)
  const lastWriteTime = await cache.get(\`last_write:\${userId}\`);
  if (lastWriteTime && Date.now() - lastWriteTime < 10000) {
    return leader.read(key);   // read from leader (guaranteed fresh)
  }
  return replica.read(key);    // read from any replica (lower latency)
}

// On write, record timestamp
async function writeWithTracking(userId, key, value) {
  await leader.write(key, value);
  await cache.set(\`last_write:\${userId}\`, Date.now(), 'EX', 10);
}

// 3. Leader failover with epoch fencing
class LeaderElection {
  constructor() {
    this.currentEpoch = 0;
    this.leader = null;
  }

  promoteFollower(follower) {
    this.currentEpoch++;
    this.leader = follower;
    follower.setAsLeader(this.currentEpoch);

    // Broadcast new epoch -- all nodes reject writes with old epoch
    broadcast({
      type: 'NEW_LEADER',
      leader: follower.id,
      epoch: this.currentEpoch
    });
    // Old leader, if alive, will see epoch mismatch and step down
  }

  onWriteRequest(request) {
    if (request.epoch < this.currentEpoch) {
      throw new Error('Stale epoch -- you are no longer the leader');
    }
  }
}

// 4. Partitioning strategies

// Range partitioning (risk: hot partition on latest range)
function rangePartition(key) {
  if (key < 'G') return 'shard1';       // A-F
  if (key < 'N') return 'shard2';       // G-M
  if (key < 'T') return 'shard3';       // N-S
  return 'shard4';                       // T-Z
}

// Hash partitioning (even distribution, no range queries)
function hashPartition(key, numShards) {
  return murmurHash(key) % numShards;
}

// Compound key (Cassandra-style: best of both)
// Partition key: hash(user_id) → determines shard
// Clustering key: timestamp → sorted within partition
// Query: "all events for user X in last hour" → single partition!
CREATE TABLE user_events (
  user_id UUID,
  event_time TIMESTAMP,
  event_data TEXT,
  PRIMARY KEY ((user_id), event_time)
  // (user_id) = partition key (hashed)
  // event_time = clustering key (sorted within partition)
) WITH CLUSTERING ORDER BY (event_time DESC);

// 5. Quorum reads and writes (leaderless)
class QuorumStore {
  constructor(nodes, W, R) {
    this.nodes = nodes;  // N replicas
    this.W = W;          // write quorum
    this.R = R;          // read quorum
    // W + R > N guarantees overlap
  }

  async write(key, value) {
    const timestamp = Date.now();
    const acks = await Promise.allSettled(
      this.nodes.map(n => n.write(key, value, timestamp))
    );
    const successCount = acks.filter(a => a.status === 'fulfilled').length;
    if (successCount >= this.W) return true;   // quorum met
    throw new Error('Write quorum not met');
  }

  async read(key) {
    const responses = await Promise.allSettled(
      this.nodes.map(n => n.read(key))
    );
    const values = responses
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
    if (values.length < this.R) throw new Error('Read quorum not met');
    // Return value with highest timestamp
    return values.sort((a, b) => b.timestamp - a.timestamp)[0];
  }
}

// 6. Multi-leader conflict resolution strategies
function resolveConflict(writeA, writeB) {
  // Strategy 1: Last Writer Wins (data loss risk!)
  if (writeA.timestamp > writeB.timestamp) return writeA;
  return writeB;

  // Strategy 2: Merge (for CRDTs -- counters, sets)
  // return { count: writeA.count + writeB.count };

  // Strategy 3: Keep both, let application resolve
  // return { conflict: true, versions: [writeA, writeB] };
}

// 7. Replication log types
// Statement-based: "INSERT INTO users VALUES (...)"
//   DANGEROUS: NOW(), RAND() differ on replicas!
// WAL shipping: send raw WAL bytes
//   RISK: version-coupled between leader/follower
// Logical (row-based): "Row 123, col X: A → B"
//   BEST: decoupled, supports CDC, cross-version safe`,
    problems: [
      ["Ensure Scalability and Replication","https://www.educative.io/courses/grokking-the-system-design-interview/ensure-scalability-and-replication","Hard"],
      ["Data Partitioning Deep Dive","https://www.designgurus.io/course/grokking-the-system-design-interview","Medium"],
      ["Distributed System Design Guide","https://www.designgurus.io/blog/distributed-system-design-guide-for-beginners","Medium"],
      ["Advanced System Design (L5/L6)","https://www.designgurus.io/course/grokking-system-design-interview-ii","Hard"]
    ],
    mcqs: [
      {"q":"In single-leader replication, what is the 'split brain' problem?","o":["Two followers disagree on data","The old leader comes back and both leaders accept writes","The network splits into three groups","Read replicas fall behind the leader"],"a":1},
      {"q":"A compound partition key (hash user_id, sort by timestamp) is useful because:","o":["It eliminates the need for replication","It provides even distribution AND efficient range queries within a user","It reduces storage requirements","It makes all queries O(1)"],"a":1},
      {"q":"With local (document-partitioned) indexes, a query like 'find all red cars' requires:","o":["One partition lookup","Querying ALL partitions (scatter-gather)","A global index lookup","No indexes are needed"],"a":1},
      {"q":"Why is statement-based replication dangerous?","o":["It uses too much bandwidth","Non-deterministic functions like NOW() produce different values on replicas","It requires schema locks","It doesn't support transactions"],"a":1},
      {"q": "In a system with N=3 replicas, W=2, R=2, how many replicas can fail while still serving reads?", "o": ["0", "1", "2", "3"], "a": 1},
      {"q":"In a leaderless system with N=3, W=2, R=2, what does W+R>N guarantee?","o":["All nodes always have the latest data","At least one node in the read quorum has the latest write","Writes are atomic across all nodes","No network partitions can occur"],"a":1},
      {"q":"Semi-synchronous replication means the leader waits for:","o":["All followers to ACK","No followers to ACK","At least 1 of N followers to ACK","The client to ACK"],"a":2},
      {"q":"Scatter-gather tail latency amplification means:","o":["Query latency equals the average shard latency","Query latency equals the MAX of all shard latencies","Queries are faster with more shards","Network latency is doubled"],"a":1}
    ],
  },
  {
    t: "Transactions & Consistency",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">In 2012, Knight Capital deployed a buggy trading algorithm that bought and sold stocks in an infinite loop for 45 minutes, losing $440 million. Proper transaction handling -- ensuring that a trade is atomic (fully executed or fully rolled back) and isolated (one trade doesn\'t interfere with another) -- is literally a matter of financial survival.</p><p class="learn-p">In a trading system, every trade execution must be ACID-compliant: a partially executed trade (debit the account but don\'t record the position) is catastrophic. Understanding isolation levels, distributed consensus, and the CAP theorem isn\'t academic -- it determines whether your system loses money or data. Interviewers will ask you to reason about <b>what breaks</b> at each consistency level.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">Transactions provide four guarantees (ACID), illustrated with a bank transfer where Alice sends $100 from savings to checking:</p><table class="learn-table"><tr><th>Property</th><th>Guarantee</th><th>What Breaks Without It</th><th>Provided By</th></tr><tr><td><b>Atomicity</b></td><td>All or nothing -- both debit and credit succeed, or neither does</td><td>$100 deducted from savings but never added to checking (money vanishes)</td><td>WAL + undo log</td></tr><tr><td><b>Consistency</b></td><td>Invariants maintained (total balance unchanged, no negative balances)</td><td>Application logic error creates money from nothing</td><td>Application constraints + DB checks</td></tr><tr><td><b>Isolation</b></td><td>Concurrent transactions don\'t see each other\'s partial state</td><td>Another transaction reads Alice\'s savings mid-transfer (sees deducted but not credited)</td><td>Locks, MVCC, SSI</td></tr><tr><td><b>Durability</b></td><td>Committed data survives crashes</td><td>Power failure after commit loses the transfer permanently</td><td>WAL on disk, replication</td></tr></table><div class="learn-code">Bank Transfer (ACID):\n\nBEGIN TRANSACTION;\n  savings_balance = READ(savings);    -- $500\n  IF savings_balance &lt; 100: ABORT;     -- constraint check\n  WRITE(savings, savings_balance - 100);  -- $400\n  WRITE(checking, checking_balance + 100); -- $600\nCOMMIT;\n\nAtomicity: If crash after line 4, both writes roll back (savings stays $500)\nIsolation: Another transaction reading savings sees either $500 or $400, never mid-update\nDurability: After COMMIT returns, the data is on disk even if server crashes 1ms later</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><ul class="learn-list"><li><b>WAL (Write-Ahead Log):</b> Before any data page is modified, the change is recorded in the WAL (sequential append). On crash, replay the WAL to recover committed transactions. The foundation of both atomicity and durability.</li><li><b>MVCC (Multi-Version Concurrency Control):</b> Instead of locking, the database keeps multiple versions of each row. Readers see a consistent snapshot without blocking writers. PostgreSQL, MySQL InnoDB, Oracle all use MVCC. Each transaction gets a snapshot at its start time.</li><li><b>Two-Phase Locking (2PL):</b> Growing phase: acquire locks. Shrinking phase: release locks. Guarantees serializability but causes deadlocks and reduced concurrency. Used by older systems and for serializable isolation.</li><li><b>SSI (Serializable Snapshot Isolation):</b> An optimistic approach. Transactions execute on snapshots (no blocking). At commit time, the database checks for conflicts. If two transactions have a dependency cycle, one is aborted. PostgreSQL\'s "Serializable" isolation level uses SSI.</li><li><b>Two-Phase Commit (2PC):</b> Coordinates distributed transactions across multiple databases/services. Phase 1: prepare (all vote yes/no). Phase 2: commit/abort. Blocking protocol -- coordinator crash leaves participants stuck.</li><li><b>Raft / Paxos:</b> Consensus algorithms for getting distributed nodes to agree on a value. Raft: leader election + log replication. A write is committed when a majority has it. Tolerates floor((N-1)/2) failures in an N-node cluster.</li><li><b>Saga Pattern:</b> For microservices: replace distributed transaction with a sequence of local transactions + compensating transactions for rollback. Eventually consistent but no blocking.</li></ul></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Let\'s trace the <b>write skew anomaly</b> (doctors on call) through each isolation level to understand what breaks and why:</p><p class="learn-p"><b>Setup:</b> Hospital has 2 doctors on call. Rule: at least 1 must remain on call. Dr. A and Dr. B both want to go home.</p><ol class="learn-list"><li><b>Read Uncommitted:</b> Dr. A sees Dr. B\'s uncommitted removal (dirty read) and reads only 1 doctor on call, so Dr. A decides to stay. But Dr. B hasn\'t committed yet and might roll back. The behavior is unpredictable.</li><li><b>Read Committed:</b> Dr. A reads "2 doctors on call" (only committed data). Dr. B also reads "2 on call." Both decide to remove themselves. Both commit. Result: 0 doctors on call. Violated! Read Committed prevents dirty reads but NOT write skew.</li><li><b>Repeatable Read (Snapshot Isolation):</b> Dr. A starts transaction, sees snapshot: 2 on call. Dr. B starts transaction, sees same snapshot: 2 on call. Both remove themselves. Both commit. Result: 0 doctors. Still violated! Repeatable Read prevents dirty reads and non-repeatable reads, but NOT write skew.</li><li><b>Serializable (SSI):</b> Dr. A starts, reads 2 on call, removes self. Dr. B starts, reads 2 on call, removes self. At commit time, the database detects the read-write conflict (both read the "on call" set, both modified it). One transaction is aborted. Result: 1 doctor on call. Invariant maintained!</li></ol><div class="learn-code">Write Skew at Repeatable Read:\n\n  Dr. A Transaction           Dr. B Transaction\n  -----------------           -----------------\n  BEGIN                       BEGIN\n  SELECT COUNT(*) = 2 ✓       SELECT COUNT(*) = 2 ✓\n  (snapshot: both on call)    (snapshot: both on call)\n  DELETE self from on_call    DELETE self from on_call\n  COMMIT ✓                    COMMIT ✓\n  Result: 0 doctors on call!  (invariant violated)\n\nAt Serializable (SSI):\n  Same sequence, but at COMMIT time:\n  Database detects: A read the set B modified, B read the set A modified\n  One transaction is ABORTED and must retry\n  Result: 1 doctor on call ✓</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Isolation Level</th><th>Dirty Read</th><th>Non-Repeatable Read</th><th>Phantom</th><th>Write Skew</th><th>Performance</th></tr><tr><td>Read Uncommitted</td><td>Possible</td><td>Possible</td><td>Possible</td><td>Possible</td><td>Fastest</td></tr><tr><td>Read Committed</td><td>Prevented</td><td>Possible</td><td>Possible</td><td>Possible</td><td>Fast (PostgreSQL default)</td></tr><tr><td>Repeatable Read</td><td>Prevented</td><td>Prevented</td><td>Possible</td><td>Possible</td><td>Moderate (MySQL default)</td></tr><tr><td>Serializable</td><td>Prevented</td><td>Prevented</td><td>Prevented</td><td>Prevented</td><td>Slowest</td></tr></table><p class="learn-p"><b>Distributed Consensus Comparison:</b></p><table class="learn-table"><tr><th>Algorithm</th><th>Fault Tolerance</th><th>Leader</th><th>Latency</th><th>Used By</th></tr><tr><td><b>Raft</b></td><td>floor((N-1)/2) failures (5 nodes: 2 failures)</td><td>Single elected leader</td><td>1 RTT (after election)</td><td>etcd, CockroachDB, TiKV</td></tr><tr><td><b>Paxos</b></td><td>floor((N-1)/2) failures</td><td>Can be leaderless</td><td>2 RTTs (without leader)</td><td>Google Chubby, Spanner</td></tr><tr><td><b>2PC</b></td><td>0 failures (coordinator is SPOF)</td><td>Coordinator</td><td>2 RTTs</td><td>Traditional RDBMS (XA)</td></tr><tr><td><b>3PC</b></td><td>1 failure (non-blocking)</td><td>Coordinator</td><td>3 RTTs</td><td>Rarely used (complex)</td></tr></table><p class="learn-p"><b>CAP Theorem and PACELC:</b></p><p class="learn-p">During a network <b>Partition</b>, choose Consistency (reject requests) or Availability (serve possibly stale data). "P" is not a choice -- partitions happen. Real question: <b>CP or AP?</b></p><table class="learn-table"><tr><th>System</th><th>CAP</th><th>PACELC</th><th>Behavior During Partition</th></tr><tr><td>PostgreSQL</td><td>CP</td><td>PC/EC</td><td>Reject writes if leader unreachable</td></tr><tr><td>DynamoDB</td><td>AP</td><td>PA/EL</td><td>Accept writes, resolve conflicts later</td></tr><tr><td>Cassandra</td><td>Tunable</td><td>PA/EL (default)</td><td>Depends on consistency level per query</td></tr><tr><td>Google Spanner</td><td>CP</td><td>PC/EC</td><td>Wait for TrueTime sync, reject if uncertain</td></tr><tr><td>CockroachDB</td><td>CP</td><td>PC/EC</td><td>Raft quorum -- minority partitions unavailable</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>2PC Blocking Problem:</b> Coordinator sends "PREPARE" to all participants. All respond "YES." Coordinator crashes before sending "COMMIT." Participants are now <b>stuck</b> -- they\'ve promised to commit but don\'t know whether to proceed. They hold locks, blocking other transactions, potentially for hours until the coordinator recovers. This is why 2PC is "correct but not fault-tolerant."</div><div class="learn-warn"><b>Linearizability Violation:</b> Client A writes x=1 to the leader. Client B reads from a lagging follower and sees x=0 (the old value). From B\'s perspective, A\'s write "hasn\'t happened yet" even though A already got a success response. This violates linearizability. Fix: synchronous replication (slow) or routing all reads through the leader (bottleneck).</div><ul class="learn-list"><li><b>Phantom Reads:</b> Transaction A counts orders WHERE status=\'pending\' (finds 5). Transaction B inserts a new pending order. A counts again: now 6. The "phantom" row appeared mid-transaction. Prevented at Serializable level by predicate locking.</li><li><b>Saga Compensation Failures:</b> Step 1: reserve inventory. Step 2: charge payment. Step 3: fails. Compensate: refund payment. But what if the refund API is also down? Need retry logic with idempotency for compensating transactions. Dead letter queue for failed compensations.</li><li><b>Clock Skew in LWW:</b> Last-Writer-Wins uses timestamps. But clocks across servers can differ by 100ms+. A write at t=1000 on Server A might actually be "earlier" than a write at t=999 on Server B (whose clock is fast). LWW silently drops Server A\'s write. Google Spanner solves this with TrueTime (atomic clocks + GPS, bounded uncertainty of ~7ms).</li><li><b>Deadlocks:</b> Transaction A holds lock on row 1, waits for lock on row 2. Transaction B holds lock on row 2, waits for lock on row 1. Both wait forever. Databases detect this with a wait-for graph and abort one transaction. Prevention: acquire locks in a consistent order.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Concurrency Control</th><th>Mechanism</th><th>Pros</th><th>Cons</th></tr><tr><td>Two-Phase Locking (2PL)</td><td>Acquire locks, release after commit</td><td>Serializable, well-understood</td><td>Deadlocks, poor concurrency, readers block writers</td></tr><tr><td>MVCC (Snapshot Isolation)</td><td>Multiple versions, each txn sees a snapshot</td><td>Readers never block writers, good concurrency</td><td>Write skew possible, space overhead for versions</td></tr><tr><td>SSI (Serializable Snapshot)</td><td>Optimistic: detect conflicts at commit</td><td>Serializable without locks, good read performance</td><td>Higher abort rate under contention</td></tr><tr><td>OCC (Optimistic)</td><td>Execute freely, validate at commit</td><td>No locks during execution</td><td>Aborts under high contention (wasted work)</td></tr></table><table class="learn-table"><tr><th>Distributed Transaction Pattern</th><th>Consistency</th><th>Availability</th><th>Latency</th><th>Complexity</th></tr><tr><td>2PC</td><td>Strong</td><td>Low (coordinator SPOF)</td><td>2 RTTs</td><td>Medium</td></tr><tr><td>Saga (choreography)</td><td>Eventual</td><td>High</td><td>Sum of all steps</td><td>High (compensation logic)</td></tr><tr><td>Saga (orchestration)</td><td>Eventual</td><td>High</td><td>Sum of all steps</td><td>Medium (central orchestrator)</td></tr><tr><td>Raft consensus</td><td>Strong (linearizable)</td><td>Majority required</td><td>1 RTT</td><td>Medium</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain ACID with a real-world example. What breaks without each property?</b><br>A: Bank transfer of $100: Atomicity -- without it, money deducted but not credited (vanishes). Consistency -- application must check balance >= $100 before deducting (no negative balance invariant). Isolation -- concurrent balance check shouldn\'t see the intermediate state between debit and credit. Durability -- after "transfer complete" is shown, a power failure shouldn\'t undo it. The database provides A, I, D. The application is responsible for C (business rules).</p><p class="learn-p"><b>Q2: The 2PC coordinator crashes after PREPARE. What happens to participants?</b><br>A: Participants are blocked. They\'ve voted YES (promised to commit), hold locks on the affected rows, but don\'t know whether to commit or abort. They MUST wait for the coordinator to recover -- could be hours. Other transactions needing those locked rows also block (cascading). This is why 2PC is called a "blocking protocol." Alternative: Saga pattern with compensating transactions.</p><p class="learn-p"><b>Q3: A 5-node Raft cluster loses 2 nodes. Can it still operate? What about 3?</b><br>A: 2 failures: majority is ceil(5/2) = 3. With 3 nodes remaining, the cluster can elect a leader and commit entries (3/5 = majority). Yes, it operates normally. 3 failures: only 2 nodes remain. Cannot form a majority (need 3). The cluster is UNAVAILABLE -- cannot elect a leader or commit new entries. But it does NOT lose committed data. When nodes recover, the cluster resumes.</p><p class="learn-p"><b>Q4: Linearizability vs serializability -- what is the difference?</b><br>A: Linearizability is a single-object, real-time guarantee: once a write completes, ALL subsequent reads from ANY client see it. "Acts as if there\'s one copy." Serializability is a multi-object, transaction guarantee: concurrent transactions produce the same result as SOME serial order. No real-time constraint. A system can be serializable but not linearizable (transactions ordered correctly but reads may see stale data). Example: serializable snapshot isolation is serializable but not linearizable.</p><p class="learn-p"><b>Q5: CP vs AP for a financial system vs a social media feed?</b><br>A: Financial system: CP. A bank cannot show incorrect balance or allow double-spending. During a partition, reject transactions (unavailable) rather than risk inconsistency. Use Spanner or CockroachDB. Social media feed: AP. Showing a slightly stale feed (missing the latest tweet) is acceptable. During a partition, serve possibly stale data rather than being unavailable. Use Cassandra or DynamoDB.</p><p class="learn-p"><b>Q6: Design a Saga for an e-commerce "place order" flow across 3 services.</b><br>A: Step 1: inventory.reserve(items). Step 2: payment.charge(total). Step 3: shipping.createLabel(address). If step 3 fails: compensate step 2 (payment.refund), compensate step 1 (inventory.release). Each compensation must be idempotent (safe to retry). Use an orchestrator service that tracks the saga state. Failed compensations go to a dead letter queue for manual resolution.</p><p class="learn-p"><b>Q7: What is write skew and why can\'t Repeatable Read prevent it?</b><br>A: Write skew: two transactions read the same data, each makes a decision based on that read, and both write -- but the combination violates an invariant. Doctors example: both read "2 on call," both remove themselves, result is 0. Repeatable Read uses snapshots -- each transaction sees a consistent snapshot, but the snapshot doesn\'t reflect the other transaction\'s concurrent write. Only Serializable (via SSI or 2PL) detects the read-write conflict and aborts one transaction.</p></div>',
    code: `// === Transactions & Consistency ===

// 1. ACID example: bank transfer
BEGIN TRANSACTION;
  -- Atomicity: both succeed or both fail
  UPDATE accounts SET balance = balance - 100
    WHERE id = 'savings' AND balance >= 100;  -- Consistency: check invariant
  UPDATE accounts SET balance = balance + 100
    WHERE id = 'checking';
  -- Isolation: other transactions don't see partial state
COMMIT;  -- Durability: written to WAL on disk

// 2. Write Skew example (doctors on call)
-- Transaction A (Dr. A):
BEGIN;
  SELECT COUNT(*) FROM on_call WHERE shift = 'night';  -- returns 2
  -- Decides: 2 > 1, safe to leave
  DELETE FROM on_call WHERE doctor_id = 'A' AND shift = 'night';
COMMIT;

-- Transaction B (Dr. B) -- concurrent:
BEGIN;
  SELECT COUNT(*) FROM on_call WHERE shift = 'night';  -- returns 2 (snapshot!)
  DELETE FROM on_call WHERE doctor_id = 'B' AND shift = 'night';
COMMIT;
-- Result: 0 doctors on call! Prevented only at SERIALIZABLE level.

// 3. Two-Phase Commit (pseudocode)
class TwoPhaseCommit {
  async execute(participants, transaction) {
    // Phase 1: PREPARE
    const preparePromises = participants.map(p =>
      p.prepare(transaction)  // each participant votes YES/NO
    );
    const votes = await Promise.all(preparePromises);
    const allYes = votes.every(v => v === 'YES');

    // Write decision to coordinator's WAL (crash recovery)
    await this.wal.write({
      txId: transaction.id,
      decision: allYes ? 'COMMIT' : 'ABORT'
    });

    // Phase 2: COMMIT or ABORT
    if (allYes) {
      await Promise.all(participants.map(p => p.commit(transaction)));
    } else {
      await Promise.all(participants.map(p => p.abort(transaction)));
    }
  }
  // DANGER: if coordinator crashes between Phase 1 and Phase 2,
  // participants are BLOCKED -- holding locks, waiting for decision
}

// 4. Raft consensus (simplified)
class RaftNode {
  constructor(id, peers) {
    this.id = id;
    this.peers = peers;
    this.state = 'follower';  // follower | candidate | leader
    this.currentTerm = 0;
    this.votedFor = null;
    this.log = [];
    this.commitIndex = 0;
  }

  onElectionTimeout() {
    // No heartbeat from leader -- start election
    this.state = 'candidate';
    this.currentTerm++;
    this.votedFor = this.id;
    let votes = 1;  // vote for self

    for (const peer of this.peers) {
      const granted = peer.requestVote({
        term: this.currentTerm,
        lastLogIndex: this.log.length,
        lastLogTerm: this.log.length > 0 ? this.log.at(-1).term : 0
      });
      if (granted) votes++;
    }

    if (votes > (this.peers.length + 1) / 2) {
      this.state = 'leader';
      this.startHeartbeats();  // prevent new elections
    }
  }

  // Only leader can accept writes
  appendEntry(command) {
    if (this.state !== 'leader') throw new Error('Not leader');

    const entry = { term: this.currentTerm, command };
    this.log.push(entry);
    let acks = 1;  // self

    for (const peer of this.peers) {
      if (peer.appendEntries([entry])) acks++;
    }

    if (acks > (this.peers.length + 1) / 2) {
      this.commitIndex++;  // majority has it -- committed!
      return true;
    }
    return false;  // not enough acks
  }
}

// 5. Saga pattern (compensating transactions)
class OrderSaga {
  async execute(order) {
    const compensations = [];
    try {
      // Step 1: Reserve inventory
      await inventoryService.reserve(order.items);
      compensations.push(() => inventoryService.release(order.items));

      // Step 2: Charge payment
      const paymentId = await paymentService.charge(order.total);
      compensations.push(() => paymentService.refund(paymentId));

      // Step 3: Create shipping label
      await shippingService.createLabel(order.address);
      // No compensation needed -- shipping label can be voided

      return { status: 'SUCCESS', orderId: order.id };
    } catch (error) {
      // Execute compensations in reverse order
      for (const compensate of compensations.reverse()) {
        try {
          await compensate();  // must be idempotent!
        } catch (compError) {
          // Dead letter queue for failed compensations
          await dlq.push({ saga: order.id, error: compError });
        }
      }
      return { status: 'FAILED', error: error.message };
    }
  }
}

// 6. CAP theorem in practice
// CP: etcd, ZooKeeper, Spanner, CockroachDB
//   → During partition: refuse reads/writes (unavailable)
// AP: DynamoDB, Cassandra (default), Riak
//   → During partition: serve requests, may return stale data
// PACELC extends CAP:
//   Spanner:   PC/EC (consistent always, higher latency)
//   DynamoDB:  PA/EL (available always, lower latency)`,
    problems: [
      ["System Design Cheat Sheet (CAP & PACELC)","https://www.designgurus.io/blog/system-design-cheat-sheet","Medium"],
      ["System Design in a Hurry","https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction","Medium"],
      ["Grokking System Design Interview","https://www.educative.io/courses/grokking-the-system-design-interview","Hard"],
      ["6 System Design Interview Problems","https://dev.to/somadevtoo/6-system-design-interview-problems-for-practice-4fl8","Medium"]
    ],
    mcqs: [
      {"q":"In the write skew problem (doctors on call), which isolation level prevents it?","o":["Read Committed","Repeatable Read","Serializable","Read Uncommitted"],"a":2},
      {"q":"The main problem with Two-Phase Commit is:","o":["It's too slow for any use case","It can't handle more than 2 participants","Participants are blocked if the coordinator crashes after PREPARE","It doesn't guarantee atomicity"],"a":2},
      {"q":"A 5-node Raft cluster can tolerate how many simultaneous node failures?","o":["1","2","3","4"],"a":1},
      {"q":"In the CAP theorem, 'P' (partition tolerance) is:","o":["An optional feature you can disable","Not a real choice -- partitions happen regardless","Only relevant for multi-datacenter setups","Guaranteed by using TCP"],"a":1},
      {"q":"MVCC (Multi-Version Concurrency Control) allows:","o":["Writers to block readers for consistency","Readers to see a consistent snapshot without blocking writers","All transactions to see the latest data immediately","Deadlock-free two-phase locking"],"a":1},
      {"q":"Google Spanner achieves global consistency using:","o":["Two-Phase Commit only","Raft consensus only","TrueTime (atomic clocks + GPS) for bounded clock uncertainty","Eventual consistency with conflict resolution"],"a":2},
      {"q":"In a Saga pattern, compensating transactions must be:","o":["Executed before the forward transaction","Idempotent (safe to retry)","Synchronous with the original transaction","Atomic with the forward transaction"],"a":1},
      {"q":"Which concurrency control mechanism has the highest abort rate under contention?","o":["Two-Phase Locking (pessimistic)","MVCC with Snapshot Isolation","Optimistic Concurrency Control","Read Uncommitted"],"a":2}
    ],
  }
      ]
    },
    {
      id: "designs", t: "System Designs",
      topics: [
        {
    t: "Rate Limiter",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Every large-scale API faces abuse: bots scraping data, buggy clients hammering endpoints, or malicious actors launching DDoS attacks. Without rate limiting, a single misbehaving client can exhaust server resources and degrade experience for everyone. Twitter limits to 300 tweets/3hrs, Stripe to 100 req/sec, GitHub to 5000 req/hr. Rate limiting is critical for trading APIs where a runaway algorithm could flood the exchange with orders, incurring regulatory penalties and financial loss.</p><p class="learn-p"><b>Scale target:</b> 10M active API keys, 500K requests/second aggregate, &lt;1ms overhead per rate limit check, 99.99% availability of the rate limiting service itself.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">A rate limiter sits in the request path, counting requests per client in a time window and rejecting requests that exceed the limit. The fundamental challenge is doing this accurately, efficiently, and in a distributed setting.</p><div class="learn-code">                    ┌─────────────────────────┐\n   Client Request ──▶│   API Gateway / LB      │\n                    │   ┌─────────────────┐   │\n                    │   │  Rate Limiter    │   │\n                    │   │  (check counter) │   │\n                    │   └────┬────────┬───┘   │\n                    │        │        │        │\n                    │    ALLOWED   REJECTED    │\n                    │        │     (429)       │\n                    │        ▼                 │\n                    │   Backend Service        │\n                    └─────────────────────────┘\n                              │\n                    ┌─────────▼──────────┐\n                    │   Redis Cluster     │\n                    │  (shared counters)  │\n                    └────────────────────┘</div><p class="learn-p">The rate limiter returns HTTP 429 (Too Many Requests) with headers: <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>, and <code>Retry-After</code>.</p></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>API Design:</b></p><div class="learn-code">POST /api/ratelimit/check\n  Request:  { client_id, endpoint, weight (optional) }\n  Response: { allowed: bool, remaining: int, reset_at: epoch }\n\nGET /api/ratelimit/config\n  Response: { rules: [{ endpoint, limit, window_sec }] }\n\nPUT /api/ratelimit/config\n  Request:  { endpoint, limit, window_sec }</div><table class="learn-table"><tr><th>Component</th><th>Technology</th><th>Purpose</th></tr><tr><td>Counter Store</td><td>Redis / Memcached</td><td>Shared counters for distributed rate limiting</td></tr><tr><td>Rule Store</td><td>PostgreSQL / etcd</td><td>Rate limit configs per endpoint/tier</td></tr><tr><td>Rate Limit Middleware</td><td>Envoy / Nginx / Custom</td><td>Intercepts requests, checks limits</td></tr><tr><td>Analytics Pipeline</td><td>Kafka + Flink</td><td>Real-time monitoring of limit hits</td></tr></table><p class="learn-p"><b>Data Model:</b></p><div class="learn-code">Table: rate_limit_rules\n  id           INT PRIMARY KEY\n  endpoint     VARCHAR(255)\n  tier         VARCHAR(50)    -- free, pro, enterprise\n  max_requests INT            -- e.g., 100\n  window_sec   INT            -- e.g., 60\n\nRedis Key: rl:{client_id}:{endpoint}:{window}\nRedis Value: current_count (INT)\nRedis TTL: window_sec</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Trace a request through the <b>sliding window counter</b> algorithm:</p><ol class="learn-list"><li><b>Request arrives</b> at 12:00:45 from client <code>user_123</code> for <code>/api/search</code>. Limit: 100 req/min.</li><li><b>Calculate window</b>: Current window = 12:00:00-12:00:59. Previous window = 11:59:00-11:59:59. Position in current window = 45/60 = 0.75.</li><li><b>Fetch counters from Redis</b>: Previous window count = 80. Current window count = 30.</li><li><b>Estimate</b>: weighted_count = 80 * (1 - 0.75) + 30 = 80 * 0.25 + 30 = 20 + 30 = 50.</li><li><b>Compare</b>: 50 &lt; 100 (limit). Request ALLOWED.</li><li><b>Increment</b> current window counter: <code>INCR rl:user_123:/api/search:1200</code> → 31.</li><li><b>Set TTL</b> if first increment: <code>EXPIRE rl:user_123:/api/search:1200 120</code> (2x window for overlap).</li><li><b>Return</b>: 200 OK with headers <code>X-RateLimit-Remaining: 49</code>.</li></ol></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Algorithm</th><th>Mechanism</th><th>Burst Handling</th><th>Memory</th><th>Accuracy</th></tr><tr><td>Token Bucket</td><td>Tokens refill at fixed rate, each req consumes 1</td><td>Allows bursts up to capacity</td><td><span class="learn-complexity">O(1) per key</span></td><td>Exact</td></tr><tr><td>Leaking Bucket</td><td>Queue drains at fixed rate</td><td>Smooths bursts to constant rate</td><td><span class="learn-complexity">O(queue size)</span></td><td>Exact</td></tr><tr><td>Fixed Window</td><td>Count per fixed time slot</td><td>2x burst at window boundary</td><td><span class="learn-complexity">O(1) per key</span></td><td>Boundary issue</td></tr><tr><td>Sliding Window Log</td><td>Store all request timestamps</td><td>No burst issues</td><td><span class="learn-complexity">O(requests) per key</span></td><td>Exact</td></tr><tr><td>Sliding Window Counter</td><td>Weighted blend of 2 windows</td><td>Minimal boundary issue</td><td><span class="learn-complexity">O(1) per key</span></td><td>&lt;1% error</td></tr></table><p class="learn-p"><b>Token Bucket</b> is best for APIs where occasional bursts are OK (most REST APIs). <b>Leaking Bucket</b> is best for traffic shaping (video streaming, network QoS). <b>Sliding Window Counter</b> is the best general-purpose algorithm — accurate, memory-efficient, and simple.</p><p class="learn-p"><b>Distributed approaches:</b> (1) Centralized Redis — accurate but adds ~1ms latency per check. (2) Local counters with periodic sync — lower latency but allows up to N * limit during sync gaps (where N = number of servers). (3) Sticky sessions — route all requests from a client to the same server, enabling local-only counters.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Race condition:</b> Two requests from the same client hit different servers simultaneously. Both read counter=99 (limit=100), both increment to 100, both pass. Actual count = 101. Fix: use Redis Lua scripts for atomic check-and-increment, or use <code>MULTI/EXEC</code> transactions.</div><div class="learn-warn"><b>Shared IP (NAT):</b> 50 users behind one corporate NAT share a single IP. Per-IP rate limiting at 1000 req/min blocks legitimate users at 20 req/min each. Fix: use authenticated user IDs for rate limiting; fall back to per-IP only for unauthenticated traffic.</div><div class="learn-warn"><b>Clock skew in distributed systems:</b> If servers have slightly different clocks, window boundaries differ, causing inconsistent rate limit decisions. Fix: use Redis server time (not application server time) for all window calculations.</div><p class="learn-p"><b>Rate limiter unavailability:</b> If Redis goes down, do you fail open (allow all traffic, risking overload) or fail closed (reject all traffic, causing outage)? Most systems fail open — brief unprotected operation is better than total outage. Add local in-memory fallback limiters.</p><p class="learn-p"><b>Hot keys:</b> A single viral API key (e.g., a popular app) generates millions of checks/sec on one Redis key. Solution: use local caching with short TTL (100ms) to absorb hot-key traffic before hitting Redis.</p></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Algorithm</th><th>Time per Check</th><th>Space per Client</th><th>Distributed Friendly</th><th>Best Use Case</th></tr><tr><td>Token Bucket</td><td><span class="learn-complexity">O(1)</span></td><td><span class="learn-complexity">O(1) — 2 values</span></td><td>Hard (need atomic refill+check)</td><td>API gateways, bursty traffic</td></tr><tr><td>Leaking Bucket</td><td><span class="learn-complexity">O(1)</span></td><td><span class="learn-complexity">O(queue)</span></td><td>Hard (shared queue)</td><td>Traffic shaping, steady throughput</td></tr><tr><td>Fixed Window</td><td><span class="learn-complexity">O(1)</span></td><td><span class="learn-complexity">O(1) — 1 counter</span></td><td>Easy (single INCR)</td><td>Simple internal APIs</td></tr><tr><td>Sliding Window Log</td><td><span class="learn-complexity">O(n)</span></td><td><span class="learn-complexity">O(n) — all timestamps</span></td><td>Hard (sorted set per key)</td><td>When accuracy is critical</td></tr><tr><td>Sliding Window Counter</td><td><span class="learn-complexity">O(1)</span></td><td><span class="learn-complexity">O(1) — 2 counters</span></td><td>Easy (2 INCRs)</td><td>Production APIs (best tradeoff)</td></tr></table><p class="learn-p"><b>Redis performance:</b> A single Redis instance handles ~100K-200K ops/sec. For 500K rate limit checks/sec, you need a 3-5 node Redis cluster. Each rate limit check adds ~0.5-1ms network latency.</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How would you rate limit at 1M req/sec with &lt;1ms overhead?</b><br/>Use local in-memory token buckets per server with periodic sync to Redis (every 100ms). Local checks are &lt;0.01ms. Accept up to (N_servers * limit) overshoot during sync windows.</p><p class="learn-p"><b>Q2: A client sends 100 requests at second 59 and 100 at second 61. Fixed window allows both — how to fix?</b><br/>Use sliding window counter. The weighted estimate bridges the boundary: if window is 60s, at t=61 the blend is prev_count * (59/60) + curr_count, catching the burst.</p><p class="learn-p"><b>Q3: How do you handle rate limiting in a multi-region deployment?</b><br/>Option 1: Each region has its own limit (simple, but allows total = N_regions * limit). Option 2: Global counter with cross-region replication (accurate, but adds 50-100ms latency). Option 3: Hierarchical — local limit + global limit, check local first.</p><p class="learn-p"><b>Q4: How would you implement tiered rate limits (free: 100/min, pro: 10K/min)?</b><br/>Store tier-to-limit mapping in config. On each request, look up user tier from a cached user profile, then apply the corresponding limit. Use separate Redis keys per tier or encode tier in the key.</p><p class="learn-p"><b>Q5: What happens during a traffic spike from a DDoS attack?</b><br/>Rate limiter protects backend, but the limiter itself must handle the spike. Solution: rate limit checking should be extremely cheap (in-memory or edge/CDN level). Use Cloudflare or AWS WAF for L7 DDoS before traffic hits your rate limiter.</p><p class="learn-p"><b>Q6: How do you rate-limit WebSocket connections vs HTTP requests?</b><br/>For WebSockets, rate limit on (1) connection establishment (per-IP), (2) messages per connection per second (per-user token bucket), and (3) payload size. Cannot use HTTP middleware — implement inside the WebSocket handler.</p></div>',
    code: `// === Rate Limiter Algorithms ===

// 1. Token Bucket — allows bursts up to capacity
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;  // tokens per second
    this.lastRefill = Date.now();
  }

  allow() {
    this.refill();
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;  // rate limited → 429
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;
  }
}

// 2. Sliding Window Counter — best general-purpose algorithm
class SlidingWindowCounter {
  constructor(windowMs, limit) {
    this.windowMs = windowMs;
    this.limit = limit;
    this.prevCount = 0;
    this.currCount = 0;
    this.windowStart = Date.now();
  }

  allow() {
    const now = Date.now();
    const elapsed = now - this.windowStart;
    if (elapsed >= this.windowMs) {
      this.prevCount = this.currCount;
      this.currCount = 0;
      this.windowStart = now;
    }
    const windowPos = (now - this.windowStart) / this.windowMs;
    const estimate = this.prevCount * (1 - windowPos) + this.currCount;
    if (estimate < this.limit) {
      this.currCount++;
      return true;
    }
    return false;
  }
}

// 3. Redis Lua script — atomic check-and-increment (no race conditions)
const RATE_LIMIT_LUA = \`
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local window = tonumber(ARGV[2])
  local current = tonumber(redis.call('GET', key) or '0')
  if current < limit then
    redis.call('INCR', key)
    if current == 0 then
      redis.call('EXPIRE', key, window)
    end
    return 1  -- allowed
  end
  return 0    -- rejected (429)
\`;

// 4. Distributed rate limiter with Redis
async function checkRateLimit(clientId, endpoint, limit, windowSec) {
  const key = \`rl:\${clientId}:\${endpoint}:\${Math.floor(Date.now()/1000/windowSec)}\`;
  const allowed = await redis.eval(RATE_LIMIT_LUA, 1, key, limit, windowSec);
  if (!allowed) {
    return { allowed: false, retryAfter: windowSec };
  }
  const remaining = limit - await redis.get(key);
  return { allowed: true, remaining };
}

// 5. Multi-tier rate limiting middleware
async function rateLimitMiddleware(req, res, next) {
  const checks = [
    { key: req.ip,       limit: 1000, window: 60, label: 'per-IP' },
    { key: req.userId,   limit: 100,  window: 60, label: 'per-user' },
    { key: req.path,     limit: 50,   window: 60, label: 'per-endpoint' },
    { key: 'global',     limit: 100000, window: 60, label: 'global' },
  ];
  for (const check of checks) {
    const result = await checkRateLimit(check.key, req.path, check.limit, check.window);
    if (!result.allowed) {
      res.set('Retry-After', result.retryAfter);
      return res.status(429).json({ error: \`Rate limited: \${check.label}\` });
    }
  }
  next();
}

// 6. HTTP Response headers for rate limiting
// X-RateLimit-Limit: 100
// X-RateLimit-Remaining: 37
// X-RateLimit-Reset: 1623456789  (Unix epoch)
// Retry-After: 23  (seconds, when 429 returned)`,
    problems: [
      ["Rate Limiter — ByteByteGo Course", "https://bytebytego.com/courses/system-design-interview/design-a-rate-limiter", "Hard"]
    ],
    mcqs: [
      {"q": "Which rate limiting algorithm allows request bursts up to bucket capacity while maintaining a long-term average rate?", "o": ["Leaking bucket", "Token bucket", "Fixed window counter", "Sliding window log"], "a": 1},
      {"q": "In a sliding window counter, previous window had 80 requests and current window (30% through) has 20. Estimated count is:", "o": ["100", "76", "56", "44"], "a": 1},
      {"q": "Why is a Lua script needed for Redis-based rate limiting?", "o": ["Lua is faster than Redis commands", "To make check-and-increment atomic", "Redis does not support counters natively", "To handle multiple data types"], "a": 1},
      {"q": "If the centralized rate limiter service goes down, 'fail open' means:", "o": ["Reject all requests", "Allow all requests (no rate limiting)", "Return cached rate limit decisions", "Queue all requests until limiter recovers"], "a": 1},
      {"q": "Two simultaneous requests both read counter=99 (limit=100) from Redis. Without atomicity, what happens?", "o": ["One is rejected", "Both are allowed (counter reaches 101)", "Redis automatically handles this", "The second request blocks"], "a": 1},
      {"q": "For 500K rate limit checks/sec, a single Redis instance (200K ops/sec) is insufficient. The best solution is:", "o": ["Use a larger Redis instance", "Redis Cluster with 3-5 shards", "Switch to a relational database", "Remove rate limiting"], "a": 1},
            {"q": "The sliding window log algorithm tracks exact request timestamps. Its main drawback compared to sliding window counter is:", "o": ["Lower accuracy", "Higher memory usage (O(requests) vs O(1))", "Cannot handle distributed systems", "Does not support per-user limits"], "a": 1},
            {"q": "When a rate limiter's central Redis goes down, fail open is preferred over fail closed in most cases because:", "o": ["It is easier to implement", "Blocking all traffic causes a complete service outage, which is worse than temporary over-admission", "It uses less memory", "Redis always recovers quickly"], "a": 1}]
  },
  {
    t: "Key-Value Store",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Distributed key-value stores power the backbone of modern infrastructure: DynamoDB handles Amazon\'s shopping cart, Cassandra stores Netflix\'s 30PB of user data, Redis serves as the caching layer for virtually every high-traffic application. Understanding KV store internals is essential because nearly every system design interview involves at least one. In trading systems, distributed KV stores underpin configuration management, session caching, and real-time position tracking across trading systems.</p><p class="learn-p"><b>Scale target:</b> 1M ops/sec, 99.99% availability, &lt;10ms p99 read latency, 100TB total storage, 3-way replication across data centers.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">A distributed KV store maps keys to values across a cluster of machines. The core operations are <code>get(key) → value</code> and <code>put(key, value)</code>. The system must handle <b>partitioning</b> (spreading data across nodes), <b>replication</b> (copies for durability), and <b>consistency</b> (ensuring reads see recent writes).</p><div class="learn-code">                     ┌─────────────┐\n       Client ──────▶│ Coordinator  │\n                     └──────┬──────┘\n                            │ hash(key) → partition\n              ┌─────────────┼─────────────┐\n              ▼             ▼             ▼\n        ┌──────────┐  ┌──────────┐  ┌──────────┐\n        │ Node A   │  │ Node B   │  │ Node C   │\n        │(primary) │  │(replica1)│  │(replica2)│\n        │ WAL      │  │ WAL      │  │ WAL      │\n        │ Memtable │  │ Memtable │  │ Memtable │\n        │ SSTables │  │ SSTables │  │ SSTables │\n        └──────────┘  └──────────┘  └──────────┘\n            ▲               ▲             ▲\n            └───────────────┴─────────────┘\n              Consistent Hash Ring</div><p class="learn-p">Keys are mapped to nodes via a <b>consistent hash ring</b> with virtual nodes (150+ vnodes per physical node) for even distribution. Each key is replicated to the next N nodes on the ring.</p></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>API Design:</b></p><div class="learn-code">PUT /kv/{key}\n  Body: { value, ttl_seconds (optional) }\n  Headers: X-Consistency: strong|eventual\n  Response: { version, timestamp }\n\nGET /kv/{key}\n  Headers: X-Consistency: strong|eventual\n  Response: { value, version, timestamp }\n\nDELETE /kv/{key}\n  Response: { deleted: true, version }</div><table class="learn-table"><tr><th>Component</th><th>Purpose</th><th>Technology</th></tr><tr><td>Coordinator</td><td>Routes requests to correct partition</td><td>Any node can coordinate (leaderless)</td></tr><tr><td>Consistent Hash Ring</td><td>Maps keys → nodes, minimizes remapping</td><td>Virtual nodes for balance</td></tr><tr><td>WAL (Write-Ahead Log)</td><td>Durability — survives crashes</td><td>Append-only file on disk</td></tr><tr><td>Memtable</td><td>In-memory sorted write buffer</td><td>Red-black tree / skip list</td></tr><tr><td>SSTables</td><td>Immutable sorted files on disk</td><td>Sorted String Tables with index</td></tr><tr><td>Bloom Filter</td><td>Skip SSTables that don\'t have the key</td><td>Probabilistic (1% FP rate)</td></tr><tr><td>Gossip Protocol</td><td>Failure detection, membership</td><td>Decentralized heartbeats</td></tr></table><p class="learn-p"><b>Data Model:</b></p><div class="learn-code">SSTable format (on disk):\n  [data block 1][data block 2]...[index block][bloom filter][metadata]\n  Data block: sorted (key, value, timestamp, tombstone_flag) pairs\n  Index block: sparse index for binary search\n\nMemtable: sorted map of key → (value, timestamp)\n  Max size: 64MB typically, then flush to SSTable</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>Write path (put("user:42", "{name: Alice}")):</b></p><ol class="learn-list"><li><b>Coordinator</b> receives the write. Hashes "user:42" to find partition P7.</li><li><b>Identifies replicas:</b> P7 lives on nodes A, B, C (N=3).</li><li><b>Sends write to all 3 replicas</b> in parallel.</li><li>Each replica: (a) appends to <b>WAL</b> on disk (sequential write, fast). (b) Inserts into <b>memtable</b> (in-memory, O(log n)).</li><li><b>Waits for W=2 ACKs</b> (quorum). Node A and B respond. Coordinator returns success to client.</li><li>Node C eventually receives and applies the write (or via hinted handoff if temporarily down).</li><li>When memtable reaches 64MB, it\'s flushed as an immutable <b>SSTable</b> to disk.</li></ol><p class="learn-p"><b>Read path (get("user:42")):</b></p><ol class="learn-list"><li><b>Coordinator</b> sends read to R=2 replicas (quorum).</li><li>Each replica checks: (a) <b>Memtable</b> first (newest data). (b) <b>Bloom filters</b> on SSTables — skip tables that definitely don\'t contain the key. (c) Search matching SSTables from newest to oldest.</li><li>Coordinator compares versions from R replicas. Returns the <b>latest version</b>.</li><li>If versions disagree, coordinator triggers <b>read repair</b> — sends the latest version to the stale replica.</li></ol></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Approach</th><th>Consistency</th><th>Availability</th><th>Use Case</th></tr><tr><td>W+R &gt; N (e.g., W=2,R=2,N=3)</td><td>Strong</td><td>Tolerates 1 failure</td><td>Financial data, user profiles</td></tr><tr><td>W=1, R=1</td><td>Eventual</td><td>Highest</td><td>Metrics, logs, analytics</td></tr><tr><td>W=N, R=1</td><td>Strong reads</td><td>Low (any failure blocks writes)</td><td>Read-heavy with rare writes</td></tr><tr><td>Leader-based (Raft/Paxos)</td><td>Strong (linearizable)</td><td>Leader election latency</td><td>Coordination (locks, config)</td></tr></table><p class="learn-p"><b>Conflict resolution strategies:</b> (1) <b>Last-Write-Wins (LWW)</b> — simple but lossy, uses timestamps. (2) <b>Vector Clocks</b> — detect concurrent writes, keep both versions for application-level resolution. (3) <b>CRDTs</b> — conflict-free by construction, but limited data types (counters, sets, maps).</p><p class="learn-p"><b>Storage engine choice:</b> LSM trees (Cassandra, LevelDB) optimize writes (sequential I/O), B-trees (MySQL InnoDB) optimize reads (in-place updates). LSM trees achieve 10x write throughput but reads may check multiple SSTables.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Write amplification in LSM trees:</b> A single write may be written 10-30x due to compaction (memtable → L0 → L1 → L2). On SSDs with limited write endurance, this reduces device lifetime. Mitigation: leveled compaction limits amplification to ~10x; tiered compaction is worse (~30x) but faster writes.</div><div class="learn-warn"><b>Vector clock bloat:</b> With 1000 nodes, each key\'s vector clock has 1000 entries. Solution: prune entries for nodes that haven\'t updated recently, or use dotted version vectors.</div><div class="learn-warn"><b>Hot partition:</b> A celebrity\'s profile key receives 100K reads/sec while other partitions see 100 reads/sec. Solution: replicate hot keys to additional read-only replicas, or add a caching layer (Redis) in front.</div><p class="learn-p"><b>Tombstone accumulation:</b> Deletes create tombstone markers (not actual deletions). If compaction is slow, range queries scan millions of tombstones, degrading read performance. Set a tombstone GC grace period (e.g., 10 days) and ensure all replicas are healthy before GC.</p><p class="learn-p"><b>Split brain:</b> During a network partition, two sides of the cluster accept conflicting writes. After partition heals, resolve conflicts via LWW or vector clocks. Anti-entropy with Merkle trees identifies divergent keys efficiently (O(log n) comparison).</p></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>LSM Tree</th><th>B-Tree</th><th>Hash Index</th></tr><tr><td>Point Write</td><td><span class="learn-complexity">O(1) amortized (append)</span></td><td><span class="learn-complexity">O(log n) (in-place)</span></td><td><span class="learn-complexity">O(1)</span></td></tr><tr><td>Point Read</td><td><span class="learn-complexity">O(log n) * L levels</span></td><td><span class="learn-complexity">O(log n)</span></td><td><span class="learn-complexity">O(1)</span></td></tr><tr><td>Range Query</td><td><span class="learn-complexity">O(k + log n) with merge</span></td><td><span class="learn-complexity">O(k + log n)</span></td><td>Not supported</td></tr><tr><td>Space Amplification</td><td>~1.1x (with leveled)</td><td>~1.5x (page fragmentation)</td><td>~2x (hash table load)</td></tr><tr><td>Write Amplification</td><td>10-30x (compaction)</td><td>~2x (WAL + page)</td><td>~2x (WAL + hash)</td></tr></table><p class="learn-p"><b>System comparison:</b></p><table class="learn-table"><tr><th>System</th><th>Model</th><th>Consistency</th><th>Use Case</th></tr><tr><td>DynamoDB</td><td>Leaderless, AP</td><td>Eventual (strong optional)</td><td>Shopping carts, sessions</td></tr><tr><td>Cassandra</td><td>Leaderless, tunable</td><td>Tunable (W+R&gt;N)</td><td>Time-series, IoT, logs</td></tr><tr><td>etcd</td><td>Leader-based (Raft), CP</td><td>Strong (linearizable)</td><td>Config, service discovery</td></tr><tr><td>Redis</td><td>Leader-follower</td><td>Eventual (async replication)</td><td>Caching, rate limiting</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: With N=3 replicas, what quorum settings ensure strong consistency?</b><br/>W + R &gt; N. For N=3: W=2,R=2 or W=3,R=1 or W=1,R=3. The most balanced is W=2,R=2 — tolerates 1 node failure for both reads and writes.</p><p class="learn-p"><b>Q2: How does a Merkle tree help with anti-entropy repair?</b><br/>Each replica builds a Merkle tree over its data. Comparing root hashes takes O(1). If they differ, drill down the tree to find exactly which key ranges diverge — O(log n) comparisons instead of O(n) full scan. Only divergent keys are transferred.</p><p class="learn-p"><b>Q3: Explain the trade-off between availability and consistency during a network partition.</b><br/>CAP theorem: during a partition, you choose CP (reject writes to maintain consistency, e.g., etcd) or AP (accept writes on both sides, reconcile later, e.g., DynamoDB). Most KV stores offer tunable consistency — choose per-query.</p><p class="learn-p"><b>Q4: How does a Bloom filter speed up reads in an LSM tree?</b><br/>Each SSTable has a Bloom filter (1% FP rate, ~10 bits per key). Before scanning an SSTable, check the Bloom filter. If it says "definitely not present," skip the SSTable entirely. This avoids disk I/O for 99% of non-matching SSTables.</p><p class="learn-p"><b>Q5: What happens when a node fails for 3 hours and comes back?</b><br/>(1) Hinted handoff: writes that were destined for the failed node were sent to a stand-in, which forwards them on recovery. (2) Read repair: subsequent reads detect staleness and update. (3) Anti-entropy: background Merkle tree comparison finds all divergent keys.</p><p class="learn-p"><b>Q6: How do you handle a hot key that receives 100x the average traffic?</b><br/>Add a caching layer (Redis) in front. Use client-side caching with short TTL. Replicate the hot key to additional read-only nodes. If writes are hot, consider application-level sharding (e.g., partition the counter).</p><p class="learn-p"><b>Q7: Why does DynamoDB use LWW while Amazon\'s shopping cart used merge-all?</b><br/>For the shopping cart, losing an "add to cart" is worse than resurfacing a deleted item — customers can remove the duplicate but can\'t recover a lost item. LWW is simpler but risks silent data loss from clock skew.</p></div>',
    code: `// === Key-Value Store Design ===

// 1. Write path (LSM Tree)
function put(key, value) {
  // Step 1: Write to WAL for durability (sequential, fast)
  wal.append(key, value, timestamp);

  // Step 2: Write to memtable (in-memory sorted structure)
  memtable.insert(key, value);

  // Step 3: If memtable full (64MB), flush to SSTable on disk
  if (memtable.size() > THRESHOLD) {
    sstable = memtable.flush();   // sorted, immutable file
    sstables.add(sstable);
    memtable = new Memtable();
  }
}

// 2. Read path
function get(key) {
  // Check memtable first (newest data)
  let val = memtable.get(key);
  if (val) return val;

  // Check SSTables from newest to oldest
  for (const sstable of sstables.reverseOrder()) {
    // Bloom filter: skip if key definitely not present
    if (sstable.bloomFilter.mightContain(key)) {
      val = sstable.get(key);  // binary search in sorted file
      if (val) return val;
    }
  }
  return null;  // key not found
}

// 3. Quorum write (N=3, W=2)
async function quorumPut(key, value) {
  const replicas = hashRing.getNodes(key, 3);  // N=3
  const promises = replicas.map(r => r.put(key, value));
  const results = await Promise.allSettled(promises);
  const successes = results.filter(r => r.status === 'fulfilled');
  if (successes.length >= 2) return 'OK';   // W=2 met
  throw new Error('Write quorum not met');
}

// 4. Quorum read with read repair (N=3, R=2)
async function quorumGet(key) {
  const replicas = hashRing.getNodes(key, 3);
  const results = await Promise.allSettled(
    replicas.map(r => r.get(key))
  );
  const responses = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  if (responses.length < 2) throw new Error('Read quorum not met');

  // Find latest version
  const latest = responses.reduce((a, b) =>
    a.version > b.version ? a : b
  );

  // Read repair: update stale replicas
  for (const r of responses) {
    if (r.version < latest.version) {
      r.replica.put(key, latest.value);  // async repair
    }
  }
  return latest.value;
}

// 5. Vector clock conflict detection
function isConflict(vc1, vc2) {
  let vc1Dominates = false, vc2Dominates = false;
  for (const node of allNodes) {
    if ((vc1[node] || 0) > (vc2[node] || 0)) vc1Dominates = true;
    if ((vc2[node] || 0) > (vc1[node] || 0)) vc2Dominates = true;
  }
  return vc1Dominates && vc2Dominates;  // concurrent!
}

// 6. Gossip protocol (failure detection)
setInterval(() => {
  const peer = randomPeer();
  const myList = membershipList.serialize();
  const peerList = peer.exchange(myList);
  membershipList.merge(peerList);
  // If peer.lastHeartbeat > 2*T, mark suspected
}, GOSSIP_INTERVAL);

// 7. Consistent hash ring with virtual nodes
class ConsistentHashRing {
  constructor(nodes, vnodes = 150) {
    this.ring = new SortedMap();
    for (const node of nodes) {
      for (let i = 0; i < vnodes; i++) {
        const hash = md5(node + ':' + i);
        this.ring.set(hash, node);
      }
    }
  }
  getNodes(key, n) {
    const hash = md5(key);
    // Walk clockwise from hash, collect n distinct nodes
    const nodes = new Set();
    for (const [h, node] of this.ring.from(hash)) {
      nodes.add(node);
      if (nodes.size === n) break;
    }
    return [...nodes];
  }
}`,
    problems: [
      ["Key-Value Store — ByteByteGo Course", "https://bytebytego.com/courses/system-design-interview/design-a-key-value-store", "Hard"]
    ],
    mcqs: [
      {"q": "With N=3 replicas, which quorum configuration guarantees strong consistency?", "o": ["W=1, R=1", "W=1, R=2", "W=2, R=2", "W=1, R=3"], "a": 2},
      {"q": "What is the primary advantage of Merkle trees in anti-entropy repair?", "o": ["Faster writes", "Reduces comparison from O(n) to O(log n)", "Eliminates the need for replication", "Provides encryption for data at rest"], "a": 1},
      {"q": "In Last Write Wins conflict resolution, what is the main risk?", "o": ["Higher latency", "Silent data loss due to clock skew", "Increased storage requirements", "Network partition handling"], "a": 1},
      {"q": "A Bloom filter on an SSTable helps with:", "o": ["Speeding up writes", "Quickly determining if a key might exist on disk", "Compressing data on disk", "Resolving write conflicts"], "a": 1},
      {"q": "Which storage engine is optimized for write-heavy workloads?", "o": ["B-Tree", "LSM Tree", "Hash Index", "Bitmap Index"], "a": 1},
      {"q": "In an LSM tree, write amplification from compaction is typically:", "o": ["1-2x", "3-5x", "10-30x", "100x+"], "a": 2},
      {"q": "Virtual nodes in consistent hashing solve which problem?", "o": ["Reduce network latency", "Even data distribution across heterogeneous nodes", "Improve write consistency", "Reduce memory usage"], "a": 1}
    ]
  },
  {
    t: "URL Shortener",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">URL shorteners like bit.ly, TinyURL, and t.co are deceptively simple on the surface but require solving interesting problems at scale: unique ID generation, high-throughput redirection, analytics at billions of clicks/day, and caching for power-law access patterns. This is one of the most commonly asked system design questions and serves as a gateway to discuss distributed ID generation, database sharding, caching, and analytics pipelines.</p><p class="learn-p"><b>Scale target:</b> 100M new URLs/month (~40 URLs/sec writes), 10B redirects/month (~3,800 reads/sec), read:write ratio of 100:1, redirect latency &lt;50ms at p99.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">A URL shortener maps long URLs to short tokens: <code>short.ly/abc123</code> → <code>https://very-long-original-url.com/path?query=val</code>. The core flow is: (1) User submits a long URL, system generates a short token. (2) When someone visits the short URL, system looks up and redirects to the original.</p><div class="learn-code">    ┌──────────┐   POST /shorten     ┌──────────────┐\n    │  Client  │ ──────────────────▶ │   API Server  │\n    └──────────┘   {long_url}        │               │\n                                     │ 1. Generate ID│\n                                     │ 2. Store map  │\n         short.ly/abc123             │ 3. Return     │\n    ◀──────────────────────────────── └───────┬───────┘\n                                             │\n    GET /abc123                              ▼\n    ┌──────────┐   302 Redirect      ┌──────────────┐\n    │  Client  │ ◀────────────────── │  Cache/Redis  │\n    └──────────┘   Location: long    │       │       │\n                                     │       ▼       │\n                                     │  DB (MySQL)   │\n                                     └──────────────┘</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>API Design:</b></p><div class="learn-code">POST /api/v1/shorten\n  Request:  { long_url, custom_alias (opt), expiry (opt) }\n  Response: { short_url, created_at, expires_at }\n\nGET /{short_token}\n  Response: 302 Redirect, Location: {long_url}\n\nGET /api/v1/stats/{short_token}\n  Response: { total_clicks, clicks_by_day, top_countries, top_referrers }</div><table class="learn-table"><tr><th>Component</th><th>Technology</th><th>Purpose</th></tr><tr><td>ID Generator</td><td>Snowflake / Counter Service</td><td>Unique short tokens</td></tr><tr><td>URL Store</td><td>MySQL / DynamoDB</td><td>short_token → long_url mapping</td></tr><tr><td>Cache</td><td>Redis</td><td>Hot URL caching (200GB for 20% hot set)</td></tr><tr><td>Analytics Pipeline</td><td>Kafka → Flink → ClickHouse</td><td>Click tracking, geo, referrer</td></tr><tr><td>CDN</td><td>CloudFront / Cloudflare</td><td>Edge caching for popular URLs</td></tr></table><p class="learn-p"><b>Database Schema:</b></p><div class="learn-code">Table: url_mappings\n  short_token  VARCHAR(8) PRIMARY KEY  -- indexed, fast lookup\n  long_url     TEXT NOT NULL\n  user_id      BIGINT\n  created_at   TIMESTAMP\n  expires_at   TIMESTAMP NULL\n  click_count  BIGINT DEFAULT 0\n\nBase62 encoding: a-z (26) + A-Z (26) + 0-9 (10) = 62 chars\nLength 7: 62^7 = 3.5 trillion unique URLs (~29,000 years at 100M/month)</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>Shortening flow:</b></p><ol class="learn-list"><li><b>Client</b> submits POST /shorten with long_url = "https://example.com/very/long/path?q=hello".</li><li><b>API server</b> calls the <b>ID Generator</b> (Snowflake) to get a unique 64-bit ID: 7291847362.</li><li><b>Base62 encode</b> the ID: 7291847362 → "bK9mXz" (7 characters).</li><li><b>Store</b> in DB: INSERT INTO url_mappings (short_token, long_url) VALUES ("bK9mXz", "https://...").</li><li><b>Return</b> "short.ly/bK9mXz" to client.</li></ol><p class="learn-p"><b>Redirect flow:</b></p><ol class="learn-list"><li><b>Client</b> visits GET /bK9mXz.</li><li><b>Check Redis cache</b>: GET url:bK9mXz → cache HIT → "https://example.com/very/long/path?q=hello".</li><li>If cache MISS: query DB, populate cache with <code>SETEX url:bK9mXz 3600 {long_url}</code>.</li><li>Check <b>expiry</b>: if expires_at &lt; now, return 404.</li><li><b>Log click</b> asynchronously: push to Kafka topic (short_token, IP, user-agent, timestamp).</li><li><b>Return 302</b> redirect with Location header.</li></ol></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Approach</th><th>Collisions</th><th>Predictability</th><th>Dedup</th><th>Scalability</th></tr><tr><td>Hash (MD5) + truncate to 7 chars</td><td>High (birthday paradox)</td><td>Not guessable</td><td>Same URL → same short</td><td>Stateless</td></tr><tr><td>Auto-increment + Base62</td><td>Zero by design</td><td>Sequential, guessable</td><td>Same URL → different shorts</td><td>Needs distributed counter</td></tr><tr><td>Snowflake ID + Base62</td><td>Zero by design</td><td>Semi-guessable (time-based)</td><td>Same URL → different shorts</td><td>Decentralized, no coordination</td></tr><tr><td>Pre-generated key pool</td><td>Zero (pre-checked)</td><td>Random</td><td>Configurable</td><td>Need key generation service</td></tr></table><p class="learn-p"><b>301 vs 302:</b> Use <b>302 (temporary)</b> for analytics — browsers always hit your server, enabling accurate click tracking. Use <b>301 (permanent)</b> if you don\'t need analytics — browsers cache the redirect, reducing server load by 60-80%.</p><p class="learn-p"><b>Pre-generated key pool:</b> A background service generates random 7-char base62 strings, checks for uniqueness, and stores them in a "key pool" table. When a URL needs shortening, atomically claim a key from the pool. No runtime collision checking needed.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Birthday paradox with hashing:</b> With 7 base62 chars (3.5T space) and 1B URLs, P(collision) = n^2/(2*space) = 10^18/(7*10^12) &gt; 100%. Collisions are guaranteed. You must detect and retry with a salt. This makes the hash approach O(n) worst case.</div><div class="learn-warn"><b>URL abuse:</b> Shortened URLs can hide malicious destinations (phishing, malware). Mitigate: (1) scan URLs against Google Safe Browsing API at creation time, (2) show an interstitial "you are leaving" page, (3) rate-limit URL creation per account.</div><div class="learn-warn"><b>Hot URL thundering herd:</b> A viral tweet with a shortened URL generates 100K clicks/sec. Redis handles this fine (~100K ops/sec per shard), but ensure the cache key doesn\'t expire during the spike. Use randomized TTL jitter to prevent synchronized cache misses.</div><p class="learn-p"><b>Custom alias conflicts:</b> User requests "myapp.co/sale2024" but it\'s taken. Options: return 409 Conflict, suggest alternatives ("sale2024-1"), or silently append random chars. Best UX: return 409 and let the user choose a different alias.</p><p class="learn-p"><b>Database sharding:</b> Shard by short_token (hash partitioning). Lookups by short_token always hit one shard. But listing "all URLs by user_id" requires a scatter-gather across all shards. Solution: maintain a secondary index table sharded by user_id.</p></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Metric</th><th>Value</th><th>Calculation</th></tr><tr><td>Write QPS</td><td>~40/sec (avg), 400/sec (peak)</td><td>100M/month / (30 * 86400)</td></tr><tr><td>Read QPS</td><td>~3,800/sec (avg), 38K/sec (peak)</td><td>100:1 read/write ratio</td></tr><tr><td>Storage (5 years)</td><td>~3 TB</td><td>6B URLs * 500 bytes avg</td></tr><tr><td>Cache size (20% hot set)</td><td>~200 GB</td><td>1.2B hot URLs * 170 bytes</td></tr><tr><td>Bandwidth (reads)</td><td>~19 MB/sec</td><td>3,800 * 500 bytes * 10 (response)</td></tr></table><table class="learn-table"><tr><th>ID Generation</th><th>Throughput</th><th>Coordination Needed</th><th>Sorted</th></tr><tr><td>Auto-increment (MySQL)</td><td>~10K/sec per DB</td><td>Yes (single writer)</td><td>Yes</td></tr><tr><td>Snowflake</td><td>~4M/sec/machine</td><td>No</td><td>Roughly (time-based)</td></tr><tr><td>UUID v4</td><td>Unlimited</td><td>No</td><td>No (random)</td></tr><tr><td>Pre-generated pool</td><td>Depends on pool size</td><td>Minimal</td><td>No</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you ensure the same long URL always maps to the same short URL?</b><br/>Use a hash-based approach (MD5 of the long URL, truncated). Or maintain a reverse-lookup index: before generating a new short URL, check if the long URL already exists. The reverse index adds a DB lookup per write but saves storage.</p><p class="learn-p"><b>Q2: How would you handle URL expiration efficiently?</b><br/>Lazy deletion: check expires_at on each redirect; return 404 if expired. Background cleanup: cron job scans for expired rows and deletes them in batches (DELETE WHERE expires_at &lt; NOW() LIMIT 10000). Don\'t delete eagerly on every request — it adds write load.</p><p class="learn-p"><b>Q3: How do you build the analytics dashboard?</b><br/>Redirect handler pushes click events (short_token, timestamp, IP, user-agent, referrer) to Kafka. A Flink streaming job aggregates clicks by time bucket, country (IP geolocation), and referrer. Store aggregates in ClickHouse for fast OLAP queries. Pre-compute daily/hourly rollups.</p><p class="learn-p"><b>Q4: How many machines do you need for the redirect service?</b><br/>At 38K peak reads/sec, each Nginx instance handles ~10K req/sec. Need 4 instances behind a load balancer, with Redis handling cache lookups. Total: 4 app servers + 3-node Redis cluster + 2 MySQL replicas.</p><p class="learn-p"><b>Q5: What if a shortened URL goes viral and gets 1M clicks/sec?</b><br/>CDN (CloudFront) at the edge caches 302 redirects for popular URLs (short TTL: 60s). This absorbs 99% of traffic. The remaining 1% hits your origin. Redis handles 10K/sec easily. The bottleneck shifts to analytics ingestion — use Kafka partitioning by short_token.</p></div>',
    code: `// === URL Shortener Design ===

// 1. Base62 encoding
const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function base62Encode(num) {
  let result = '';
  while (num > 0) {
    result = CHARSET[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result.padStart(7, 'a');  // ensure 7 chars minimum
}

function base62Decode(str) {
  let num = 0;
  for (const ch of str) {
    num = num * 62 + CHARSET.indexOf(ch);
  }
  return num;
}

// 2. Snowflake-style ID generator (no coordination needed)
class SnowflakeID {
  // 41 bits: timestamp (ms since epoch) — ~69 years
  //  5 bits: datacenter ID (0-31)
  //  5 bits: machine ID (0-31)
  // 12 bits: sequence (0-4095 per ms)
  constructor(datacenterId, machineId) {
    this.datacenterId = datacenterId & 0x1F;
    this.machineId = machineId & 0x1F;
    this.sequence = 0;
    this.lastTimestamp = -1;
  }

  nextId() {
    let ts = Date.now();
    if (ts === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & 0xFFF;
      if (this.sequence === 0) {
        while (Date.now() <= ts); // wait for next ms
        ts = Date.now();
      }
    } else {
      this.sequence = 0;
    }
    this.lastTimestamp = ts;
    return (BigInt(ts - EPOCH) << 22n) |
           (BigInt(this.datacenterId) << 17n) |
           (BigInt(this.machineId) << 12n) |
           BigInt(this.sequence);
  }
}

// 3. URL shortening service
const idGen = new SnowflakeID(1, 1);

async function shortenURL(longUrl, customAlias = null) {
  // Check for existing mapping (dedup)
  const existing = await db.query(
    'SELECT short_token FROM url_mappings WHERE long_url = ?', [longUrl]
  );
  if (existing) return existing.short_token;

  let shortToken;
  if (customAlias) {
    // Check custom alias availability
    const taken = await db.query(
      'SELECT 1 FROM url_mappings WHERE short_token = ?', [customAlias]
    );
    if (taken) throw new Error('Alias already taken');
    shortToken = customAlias;
  } else {
    const id = idGen.nextId();
    shortToken = base62Encode(Number(id));
  }

  await db.query(
    'INSERT INTO url_mappings (short_token, long_url, created_at) VALUES (?, ?, NOW())',
    [shortToken, longUrl]
  );
  await redis.setex('url:' + shortToken, 3600, longUrl);
  return shortToken;
}

// 4. Redirect endpoint with caching and analytics
app.get('/:shortToken', async (req, res) => {
  const { shortToken } = req.params;

  // L1: Redis cache
  let longUrl = await redis.get('url:' + shortToken);
  if (!longUrl) {
    // L2: Database
    const record = await db.query(
      'SELECT long_url, expires_at FROM url_mappings WHERE short_token = ?',
      [shortToken]
    );
    if (!record || (record.expires_at && record.expires_at < new Date())) {
      return res.status(404).send('URL not found or expired');
    }
    longUrl = record.long_url;
    // Populate cache with jittered TTL (prevent thundering herd)
    const ttl = 3600 + Math.floor(Math.random() * 600);
    await redis.setex('url:' + shortToken, ttl, longUrl);
  }

  // Async analytics (non-blocking)
  kafka.produce('click-events', {
    shortToken,
    timestamp: Date.now(),
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    referrer: req.headers['referer'] || 'direct',
  });

  res.redirect(302, longUrl);  // 302 for analytics tracking
});

// 5. Database sharding: hash(short_token) % NUM_SHARDS
// 6. Storage: 6B URLs * 500 bytes = 3 TB across 16 shards = 187 GB/shard`,
    problems: [
      ["URL Shortener — ByteByteGo Course", "https://bytebytego.com/courses/system-design-interview/design-a-url-shortener", "Hard"]
    ],
    mcqs: [
      {"q": "With base62 encoding and 7-character short URLs, the maximum unique URLs is approximately:", "o": ["56 billion", "3.5 trillion", "218 trillion", "1 billion"], "a": 1},
      {"q": "Why is 302 (temporary) redirect preferred over 301 for URL shorteners with analytics?", "o": ["302 is faster", "Browsers don't cache 302, so every click hits the server for tracking", "301 is deprecated", "302 supports HTTPS while 301 does not"], "a": 1},
      {"q": "In Twitter's Snowflake ID, how many IDs can one machine generate per millisecond?", "o": ["1,024", "4,096", "65,536", "1,000,000"], "a": 1},
      {"q": "The birthday paradox makes hash-based URL shortening problematic because:", "o": ["Hashes are slow to compute", "Collision probability grows quadratically with the number of URLs", "MD5 is insecure", "Base62 encoding is lossy"], "a": 1},
      {"q": "Pre-generated key pools solve which problem?", "o": ["URL expiration", "Runtime collision checking and ID generation latency", "Cache invalidation", "Analytics tracking"], "a": 1}
    ]
  },
  {
    t: "Web Crawler",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Web crawlers are the foundation of search engines (Googlebot crawls 20+ billion pages/day), SEO tools, price comparison engines, and content aggregators. Building one at scale requires solving problems in distributed scheduling, deduplication, politeness, fault tolerance, and storage. This is a classic system design problem that tests your ability to think about throughput, state management, and distributed coordination.</p><p class="learn-p"><b>Scale target:</b> 1 billion pages in 1 week (1,653 pages/sec), 50TB of raw HTML storage, 10B+ URLs in the dedup set, politeness constraint of 1 request/second per domain.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">A web crawler starts from seed URLs, downloads pages, extracts links, and follows them to discover new content. The cycle is: <b>fetch → parse → extract links → deduplicate → add to frontier → repeat</b>.</p><div class="learn-code">  Seed URLs\n      │\n      ▼\n┌─────────────────┐\n│   URL Frontier   │ ◀───────────────────────────┐\n│  (Priority Queue) │                              │\n└────────┬────────┘                              │\n         │  (politeness: 1 req/s per domain)      │\n         ▼                                        │\n┌─────────────────┐                              │\n│   URL Fetcher    │  (distributed, 100 machines) │\n│  (HTTP client)   │                              │\n└────────┬────────┘                              │\n         │  (respects robots.txt)                 │\n         ▼                                        │\n┌─────────────────┐     ┌──────────────┐         │\n│ Content Parser   │────▶│ Content Store │         │\n│ (extract links)  │     │  (S3 / HDFS)  │         │\n└────────┬────────┘     └──────────────┘         │\n         │                                        │\n         ▼                                        │\n┌─────────────────┐                              │\n│  URL Filter &amp;    │──── new URLs ────────────────┘\n│  Dedup (Bloom)   │\n└─────────────────┘</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><table class="learn-table"><tr><th>Component</th><th>Purpose</th><th>Technology</th></tr><tr><td>URL Frontier</td><td>Priority queue of URLs to crawl</td><td>Redis sorted sets / custom FIFO queues</td></tr><tr><td>URL Fetcher</td><td>Downloads pages via HTTP</td><td>Async HTTP client (100 workers/machine)</td></tr><tr><td>Content Parser</td><td>Extracts text, links, metadata</td><td>jsdom, cheerio, or headless Chrome</td></tr><tr><td>URL Dedup</td><td>Avoids re-crawling seen URLs</td><td>Bloom filter (~12 GB for 10B URLs at 1% FP)</td></tr><tr><td>Content Dedup</td><td>Detects duplicate/near-dup pages</td><td>SimHash (64-bit fingerprint, Hamming &le; 3)</td></tr><tr><td>DNS Resolver</td><td>Resolves hostnames (bottleneck!)</td><td>Local DNS cache (reduces 50ms → &lt;1ms)</td></tr><tr><td>robots.txt Cache</td><td>Respects crawl directives</td><td>In-memory cache, refresh every 24h</td></tr><tr><td>Content Store</td><td>Stores raw HTML</td><td>S3 / HDFS (50TB for 1B pages at 50KB avg)</td></tr></table><p class="learn-p"><b>Capacity estimation:</b></p><div class="learn-code">Pages to crawl: 1B in 7 days\nPages/sec: 1B / (7 * 86400) = 1,653 pages/sec\nAvg page download: 2 seconds → need 3,306 concurrent fetchers\nAt 500 threads/machine → 7 machines for fetching\nStorage: 1B * 50KB avg = 50 TB raw HTML\nMetadata: 1B * 500 bytes = 500 GB\nBloom filter: 10B URLs * 1.2 bytes = 12 GB RAM</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Trace a URL from discovery to storage:</p><ol class="learn-list"><li><b>Seed URL</b> "https://en.wikipedia.org" enters the <b>URL Frontier</b> with high priority.</li><li><b>Scheduler</b> checks politeness: last fetch from en.wikipedia.org was 1.2s ago → OK to fetch.</li><li><b>Check robots.txt cache</b>: en.wikipedia.org allows / for our bot. If not cached, fetch and cache robots.txt first.</li><li><b>DNS resolution</b>: Local cache returns 208.80.154.224 in &lt;1ms (vs 50ms for uncached).</li><li><b>HTTP GET</b>: Download the page. Follow redirects (max 5). Handle timeouts (10s). Store response headers and HTML.</li><li><b>Parse HTML</b>: Extract text content, page title, meta tags, and all &lt;a href="..."&gt; links.</li><li><b>Normalize URLs</b>: Lowercase hostnames, remove fragments (#section), sort query params, remove tracking params (utm_*).</li><li><b>Dedup check</b>: For each extracted URL, check the Bloom filter. If "probably seen" → skip. If "definitely not seen" → add to Bloom filter and frontier.</li><li><b>Content dedup</b>: Compute SimHash of page content. Check against existing fingerprints — if Hamming distance &le; 3 from any existing page, mark as near-duplicate.</li><li><b>Store</b>: Save raw HTML to S3 with key = md5(URL). Save metadata (URL, title, links, timestamp) to the crawl database.</li></ol></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><p class="learn-p"><b>Traversal strategy:</b></p><table class="learn-table"><tr><th>Strategy</th><th>Pros</th><th>Cons</th><th>Best For</th></tr><tr><td>BFS</td><td>Discovers important pages first, fair coverage</td><td>Large memory for frontier</td><td>General web crawling</td></tr><tr><td>DFS</td><td>Low memory</td><td>Gets trapped in spider traps, deep chains</td><td>Small/known site crawling</td></tr><tr><td>Priority BFS</td><td>Best pages first (PageRank, domain authority)</td><td>Complex priority computation</td><td>Search engine crawlers</td></tr><tr><td>Focused crawl</td><td>Only crawls relevant content (ML classifier)</td><td>May miss important pages</td><td>Topic-specific crawlers</td></tr></table><p class="learn-p"><b>Re-crawl strategy:</b> Not all pages change at the same rate. News sites need re-crawling every hour. Wikipedia every week. Old blog posts every month. Use an adaptive re-crawl schedule based on observed change frequency: if a page changed in 3 of the last 5 crawls, increase its priority.</p><p class="learn-p"><b>JavaScript rendering:</b> Many modern sites require JS execution to reveal content. Options: (1) Headless Chrome (expensive: ~10x slower, 200MB RAM per instance). (2) Selective rendering: only render pages that return minimal content without JS. (3) Server-side rendering (SSR) detection: if the initial HTML has sufficient content, skip rendering.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Spider traps:</b> Calendar pages generating infinite URLs (/calendar/2025/01, /2025/02, ..., /3000/12). Session IDs in URLs creating unique pages. Infinite pagination. Detection: (1) URL length limit (256 chars). (2) Depth limit (15 levels from seed). (3) Pattern detection (repeating /a/b/a/b). (4) Domain blacklisting.</div><div class="learn-warn"><b>DNS bottleneck:</b> Each DNS lookup takes 10-100ms. At 1,653 pages/sec, that\'s 165 seconds of cumulative DNS time per second. Solution: run a local DNS resolver/cache (dnsmasq), prefetch DNS for URLs in the frontier queue before they\'re needed.</div><div class="learn-warn"><b>Politeness violation:</b> Without rate limiting, 1000 threads can send 1000 requests/sec to one domain, effectively DDoS-ing it. Design domain-level queues: each domain gets its own queue, drained at max 1 req/sec. This means each domain gets at most 1 concurrent request regardless of how many crawlers you have.</div><p class="learn-p"><b>Crawler ethics:</b> Respect robots.txt Crawl-delay directives. Identify yourself with a descriptive User-Agent string. Provide contact info. Don\'t crawl during site\'s peak hours if possible. Throttle if the site responds slowly (adaptive politeness).</p><p class="learn-p"><b>Large files:</b> A 10GB video file or a 500MB PDF can block a crawler thread for minutes. Set a max content-length limit (e.g., 10MB). Abort downloads that exceed the limit. Only download specific MIME types (text/html).</p></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Component</th><th>Scale Challenge</th><th>Solution</th><th>Resource Cost</th></tr><tr><td>URL Dedup</td><td>10B URLs in set</td><td>Bloom filter (12GB RAM)</td><td>Low (1% FP acceptable)</td></tr><tr><td>Content Dedup</td><td>1B page fingerprints</td><td>SimHash + hash table (8GB)</td><td>Medium</td></tr><tr><td>Frontier</td><td>Billions of pending URLs</td><td>Disk-backed priority queue</td><td>High (I/O)</td></tr><tr><td>DNS</td><td>1,653 lookups/sec</td><td>Local DNS cache (99% hit)</td><td>Low</td></tr><tr><td>Storage</td><td>50TB raw HTML</td><td>S3 / HDFS with compression</td><td>~$1,150/month on S3</td></tr><tr><td>Bandwidth</td><td>82 MB/sec (50KB * 1,653)</td><td>Multiple data centers</td><td>~$2,500/month</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How would you prioritize which URLs to crawl first?</b><br/>Use a priority queue with score = f(PageRank, domain authority, freshness need, explicit re-crawl requests). Partition into priority buckets (high/medium/low). Process 60% high, 30% medium, 10% low to prevent starvation.</p><p class="learn-p"><b>Q2: A Bloom filter has 1% false positive rate — what does this mean for crawling?</b><br/>1% of never-seen URLs are falsely marked as "already crawled" and skipped. This means we miss ~1% of new pages — acceptable for most use cases. There are zero false negatives, so we never re-crawl a page unnecessarily.</p><p class="learn-p"><b>Q3: How do you handle pages that require JavaScript to render?</b><br/>Run a pool of headless Chrome instances (Puppeteer). They\'re ~10x slower (20s vs 2s per page) and use 200MB RAM each. Only render pages where initial HTML content is below a threshold (e.g., &lt;1KB of text). This limits rendering to ~5-10% of pages.</p><p class="learn-p"><b>Q4: How do you detect and handle content that changes frequently vs rarely?</b><br/>Track change frequency per URL. If the page changed in N of the last K crawls, compute an estimated change rate. Set re-crawl interval proportional to 1/change_rate. News homepages: re-crawl every 15 min. Static blog posts: every 30 days.</p><p class="learn-p"><b>Q5: What happens if a crawler machine goes down mid-crawl?</b><br/>URLs assigned to the failed machine are re-queued after a timeout (5 min). The Bloom filter is replicated or backed by a persistent store. In-progress URLs are tracked in a "processing" state with a lease — if the lease expires without completion, the URL returns to the frontier.</p><p class="learn-p"><b>Q6: How would you distribute the crawler across multiple data centers?</b><br/>Assign URL ranges to data centers by geographic proximity (crawl European sites from EU DC, Asian sites from Asia DC). This reduces latency and bandwidth costs. Share the Bloom filter state via periodic synchronization (every 10 min).</p></div>',
    code: `// === Web Crawler Design ===

// 1. URL Frontier with priority and politeness
class URLFrontier {
  constructor() {
    this.priorityQueues = [[], [], []]; // high, medium, low priority
    this.domainQueues = {};  // domain -> queue of URLs
    this.domainLastFetch = {};  // domain -> last fetch timestamp
    this.POLITENESS_DELAY = 1000; // 1 second between requests to same domain
  }

  addURL(url, priority) {
    const domain = extractDomain(url);
    if (!this.domainQueues[domain]) {
      this.domainQueues[domain] = [];
    }
    this.domainQueues[domain].push(url);
    this.priorityQueues[priority].push(domain);
  }

  getNextURL() {
    for (const queue of this.priorityQueues) {
      while (queue.length > 0) {
        const domain = queue.shift();
        const now = Date.now();
        if (now - (this.domainLastFetch[domain] || 0) >= this.POLITENESS_DELAY) {
          this.domainLastFetch[domain] = now;
          return this.domainQueues[domain].shift();
        }
        queue.push(domain); // re-enqueue, not ready yet
      }
    }
    return null;
  }
}

// 2. Bloom Filter for URL deduplication
// For 10B URLs at 1% FP rate: ~12 GB memory (1.2 bytes per item)
class BloomFilter {
  constructor(expectedItems, fpRate = 0.01) {
    // m = -n * ln(p) / (ln2)^2
    this.size = Math.ceil(-expectedItems * Math.log(fpRate) / (Math.LN2 ** 2));
    // k = (m/n) * ln2
    this.numHashes = Math.ceil((this.size / expectedItems) * Math.LN2);
    this.bits = new BitArray(this.size);
  }
  add(item) {
    for (let i = 0; i < this.numHashes; i++) {
      const pos = hash(item, i) % this.size;
      this.bits.set(pos);
    }
  }
  mightContain(item) {
    for (let i = 0; i < this.numHashes; i++) {
      const pos = hash(item, i) % this.size;
      if (!this.bits.get(pos)) return false;
    }
    return true;  // probably yes (1% FP), definitely if all bits set
  }
}

// 3. URL normalization (critical for dedup accuracy)
function normalizeURL(url) {
  let u = new URL(url);
  u.hostname = u.hostname.toLowerCase();
  u.hash = '';                        // remove fragment (#section)
  if (u.port === '80' || u.port === '443') u.port = '';
  // Sort query params for deterministic comparison
  u.search = new URLSearchParams([...u.searchParams].sort()).toString();
  // Remove tracking params
  ['ref', 'utm_source', 'utm_medium', 'utm_campaign', 'fbclid'].forEach(
    p => u.searchParams.delete(p)
  );
  return u.toString().replace(/\\/$/, '');  // remove trailing slash
}

// 4. robots.txt parser (cached per domain, refreshed every 24h)
const robotsCache = {};
async function canFetch(url) {
  const domain = extractDomain(url);
  if (!robotsCache[domain] || robotsCache[domain].age > 24 * 3600) {
    try {
      robotsCache[domain] = await fetchAndParse(domain + '/robots.txt');
    } catch (e) {
      // If robots.txt unavailable, be conservative: block crawling
      robotsCache[domain] = { isAllowed: () => false, age: Date.now() };
    }
  }
  return robotsCache[domain].isAllowed(url, 'MyBot');
}

// 5. Spider trap detection
function isSpiderTrap(url, depth) {
  if (url.length > 256) return true;          // URL too long
  if (depth > 15) return true;                 // too deep from seed
  if (hasRepeatingPattern(url)) return true;   // /a/b/a/b/...
  if (hasCalendarPattern(url)) return true;    // /2025/01/01/...
  return false;
}

// 6. SimHash for near-duplicate content detection
function simhash(document) {
  const tokens = tokenize(document);  // ["the", "quick", "brown", ...]
  const vector = new Array(64).fill(0);
  for (const token of tokens) {
    const h = hash64(token);
    for (let i = 0; i < 64; i++) {
      vector[i] += (h >> BigInt(i)) & 1n ? 1 : -1;
    }
  }
  return vector.map(v => v > 0 ? 1 : 0);  // 64-bit fingerprint
}
// Hamming distance <= 3 bits between two SimHashes → near duplicate

// 7. Main crawl loop (per worker)
async function crawlWorker() {
  while (true) {
    const url = frontier.getNextURL();
    if (!url) { await sleep(100); continue; }
    if (bloomFilter.mightContain(url)) continue;  // already crawled
    if (!await canFetch(url)) continue;             // robots.txt blocks
    if (isSpiderTrap(url, getDepth(url))) continue; // trap detection

    const html = await fetchWithTimeout(url, 10000);
    if (!html) continue;

    bloomFilter.add(url);
    const links = extractLinks(html, url);
    const content = extractText(html);
    await contentStore.save(url, html, content);

    for (const link of links) {
      const normalized = normalizeURL(link);
      if (!bloomFilter.mightContain(normalized)) {
        frontier.addURL(normalized, computePriority(normalized));
      }
    }
  }
}`,
    problems: [
      ["Web Crawler — HelloInterview Answer Key", "https://www.hellointerview.com/learn/system-design/answer-keys/web-crawler", "Hard"],
      ["Web Crawler — ByteByteGo Course", "https://bytebytego.com/courses/system-design-interview/design-a-web-crawler", "Hard"]
    ],
    mcqs: [
      {"q": "Why is BFS preferred over DFS for web crawling?", "o": ["BFS is faster", "BFS discovers high-quality pages first and avoids traps", "DFS requires more memory", "BFS handles JavaScript-rendered pages better"], "a": 1},
      {"q": "A Bloom filter for 10 billion URLs at 1% false positive rate requires approximately:", "o": ["100 MB", "1.5 GB", "12 GB", "300 GB"], "a": 2},
      {"q": "What does a false positive in the URL Bloom filter mean for crawling?", "o": ["A new URL is mistakenly crawled twice", "A new URL is mistakenly skipped", "An old URL is re-crawled", "The crawler crashes"], "a": 1},
      {"q": "To crawl 1B pages in 7 days at 2 seconds per page download, you need approximately:", "o": ["100 concurrent threads", "1,000 concurrent threads", "3,300 concurrent threads", "10,000 concurrent threads"], "a": 2},
      {"q": "SimHash detects near-duplicate content by:", "o": ["Comparing file sizes", "Computing a fingerprint where similar documents have similar hashes (Hamming distance <= 3)", "Exact string matching", "Counting word frequencies"], "a": 1},
      {"q": "The primary purpose of domain-based queue separation in a crawler is:", "o": ["Faster crawling", "Politeness — preventing any single domain from being overwhelmed", "Better URL deduplication", "Reducing memory usage"], "a": 1},
            {"q": "How does a crawler handle robots.txt returning a 404 vs a 5xx error?", "o": ["Treat both as 'block all crawling'", "404 means no restrictions (allow all), 5xx means retry or block temporarily", "Ignore robots.txt entirely in both cases", "Cache the error and never re-check"], "a": 1},
            {"q": "Why does a web crawler need URL normalization before dedup checking?", "o": ["To reduce storage costs", "To convert URLs to a canonical form so equivalent URLs (different casing, trailing slashes, query param order) are not crawled twice", "To encrypt URLs for privacy", "To compress URLs for faster Bloom filter lookups"], "a": 1}]
  },
  {
    t: "Notification System",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Notification systems power critical user touchpoints across every major platform: Uber sends ride updates, banks send fraud alerts, e-commerce platforms send order confirmations. A well-designed notification system must handle multiple channels (push, SMS, email, in-app), respect user preferences, guarantee delivery of critical messages, and avoid spamming users. Notifications are relevant for trading alerts (margin calls, position limits, order fills) where latency and reliability are paramount.</p><p class="learn-p"><b>Scale target:</b> 1B notifications/day, 55K notifications/sec at peak, 5 delivery channels, &lt;500ms for critical notifications (P0), 99.99% delivery rate for critical messages.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">A notification system takes events from various services and delivers them to users through the appropriate channel(s). The architecture must be <b>pluggable</b> (adding a channel = implementing one adapter), <b>reliable</b> (at-least-once delivery), and <b>respectful</b> (preferences, DND, frequency caps).</p><div class="learn-code">  Event Sources           Notification Service        Delivery Channels\n  ┌──────────┐           ┌───────────────────┐       ┌──────────────┐\n  │ Order Svc│──────────▶│ 1. Validate event │──────▶│ iOS (APNS)   │\n  ├──────────┤           │ 2. Load user prefs│       ├──────────────┤\n  │ Auth Svc │──────────▶│ 3. Check DND      │──────▶│ Android(FCM) │\n  ├──────────┤           │ 4. Rate limit     │       ├──────────────┤\n  │ Payment  │──────────▶│ 5. Deduplicate    │──────▶│ Email (SES)  │\n  ├──────────┤           │ 6. Template render│       ├──────────────┤\n  │ Marketing│──────────▶│ 7. Route to queue │──────▶│ SMS (Twilio) │\n  └──────────┘           └───────────────────┘       ├──────────────┤\n                                  │                   │ In-App (WS)  │\n                                  ▼                   └──────────────┘\n                         ┌───────────────────┐\n                         │   Kafka Topics     │\n                         │ push / email / sms │\n                         └───────────────────┘</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>API Design:</b></p><div class="learn-code">POST /api/v1/notifications/send\n  Request: {\n    user_id, event_type, priority (P0/P1/P2),\n    template_id, template_data: { order_id, amount },\n    channels: ["push", "email"] (optional override)\n  }\n  Response: { notification_id, status: "queued" }\n\nGET /api/v1/notifications/{user_id}\n  Response: { notifications: [...], unread_count }\n\nPUT /api/v1/preferences/{user_id}\n  Request: { push: true, email: false, sms_critical_only: true,\n             dnd_start: "22:00", dnd_end: "07:00", timezone: "America/New_York",\n             max_per_hour: 10 }</div><table class="learn-table"><tr><th>Component</th><th>Technology</th><th>Purpose</th></tr><tr><td>Notification Service</td><td>Java/Go microservice</td><td>Orchestration, preference check, dedup</td></tr><tr><td>Message Queue</td><td>Kafka (1 topic per channel)</td><td>Decouple production from delivery</td></tr><tr><td>Preference Store</td><td>Redis (hash per user)</td><td>Fast preference lookup (&lt;1ms)</td></tr><tr><td>Template Engine</td><td>Handlebars / Mustache</td><td>Render notification content</td></tr><tr><td>Dedup Store</td><td>Redis (SET with TTL)</td><td>Prevent duplicate sends (24h window)</td></tr><tr><td>Channel Adapters</td><td>APNS, FCM, SES, Twilio SDKs</td><td>Provider-specific delivery</td></tr><tr><td>Analytics DB</td><td>ClickHouse</td><td>Delivery rates, open rates, latency</td></tr></table><p class="learn-p"><b>Data Model:</b></p><div class="learn-code">Table: notifications\n  id              UUID PRIMARY KEY\n  user_id         BIGINT\n  event_type      VARCHAR(100)\n  priority        ENUM(P0, P1, P2)\n  status          ENUM(QUEUED, SENT, DELIVERED, READ, FAILED)\n  channel         ENUM(PUSH, EMAIL, SMS, IN_APP)\n  content         JSONB\n  created_at      TIMESTAMP\n  delivered_at    TIMESTAMP\n  read_at         TIMESTAMP\n\nTable: user_preferences\n  user_id         BIGINT PRIMARY KEY\n  push_enabled    BOOLEAN\n  email_enabled   BOOLEAN\n  sms_enabled     BOOLEAN\n  dnd_start       TIME\n  dnd_end         TIME\n  timezone        VARCHAR(50)\n  max_per_hour    INT\n  unsub_categories TEXT[]</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Trace a <b>P0 fraud alert</b> through the system:</p><ol class="learn-list"><li><b>Payment Service</b> detects suspicious activity on user #42\'s card. Calls POST /notifications/send with priority=P0, event_type="fraud_alert".</li><li><b>Notification Service</b> generates a unique notification_id. Checks <b>dedup store</b>: SETNX dedup:fraud_42_txn789 → new (not a duplicate).</li><li><b>Load preferences</b> from Redis: user #42 has push=true, sms=true, email=true, DND 10PM-7AM, timezone=EST.</li><li><b>Check DND</b>: Current time in EST is 2:30 AM → inside DND window. But P0 notifications <b>override DND</b> — fraud alerts must always get through.</li><li><b>Skip frequency cap</b>: P0 messages are exempt from hourly limits.</li><li><b>Template render</b>: "ALERT: Suspicious transaction of $500 on your card ending 1234. If not you, call 1-800-BANK."</li><li><b>Route to channels</b>: Produce to Kafka topics: push-topic, sms-topic, email-topic (all 3 for P0).</li><li><b>Push worker</b> consumes from push-topic. Calls APNS with device token. APNS returns success. Update notification status to DELIVERED.</li><li><b>SMS worker</b> consumes from sms-topic. Calls Twilio API. Message delivered.</li><li><b>Email worker</b> consumes from email-topic. Calls SES. Email queued.</li><li><b>Total latency</b>: Push arrives in ~300ms, SMS in ~2s, Email in ~5s.</li></ol></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Pattern</th><th>Description</th><th>Use Case</th></tr><tr><td>Priority Queues</td><td>P0 (critical), P1 (high), P2 (normal) with weighted processing</td><td>Fraud alerts vs marketing emails</td></tr><tr><td>Staggered Delivery</td><td>Send to random 1% every 30s to prevent thundering herd</td><td>Flash sale notifications to 50M users</td></tr><tr><td>Notification Aggregation</td><td>Batch similar events: "Alice and 48 others liked your photo"</td><td>Social media engagement notifications</td></tr><tr><td>Fallback Channels</td><td>If push fails → try SMS → try email</td><td>Critical alerts that must be seen</td></tr><tr><td>Digest Mode</td><td>Collect notifications and send as a daily/weekly digest</td><td>Low-priority updates, newsletters</td></tr></table><p class="learn-p"><b>At-least-once delivery:</b> Kafka consumers commit offset only <b>after</b> confirmed delivery to the channel provider. If the consumer crashes before committing, the message is re-consumed and re-sent. Client-side dedup (notification ID) prevents the user from seeing duplicates.</p><p class="learn-p"><b>Exactly-once from user perspective:</b> True exactly-once is impossible in distributed systems. Instead: at-least-once delivery + idempotent processing + client-side dedup = exactly-once from the user\'s perspective.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Thundering herd from flash sales:</b> Sending a notification to 50M users simultaneously causes all of them to tap the notification and hit the backend at once. Solution: stagger delivery over 30-50 minutes. Send to random 1% (500K users) every 30 seconds. Trade-off: some users see the sale 50 minutes late.</div><div class="learn-warn"><b>APNS/FCM token invalidation:</b> Users uninstall the app, and their device tokens become invalid. APNS returns a "410 Gone" error. You must delete stale tokens from your database, or you\'ll waste bandwidth sending to dead tokens forever. Run a daily token cleanup job.</div><div class="learn-warn"><b>Priority inversion / starvation:</b> If the P0 queue is always busy (high-volume fraud checks), P2 marketing emails never send. Solution: weighted fair queuing — process 70% P0, 20% P1, 10% P2, guaranteeing progress at all priority levels.</div><p class="learn-p"><b>Timezone-aware DND:</b> A user in New York sets DND 10PM-7AM. You receive an event at 3AM EST for this user. You must convert the current UTC time to the user\'s local timezone before checking. Store timezone as IANA string (e.g., "America/New_York"), not a UTC offset (offsets change with DST).</p><p class="learn-p"><b>Notification fatigue:</b> Sending too many notifications causes users to disable push entirely — a permanent loss. Implement frequency caps (max 5/hour for P2, unlimited for P0) and monitor opt-out rates per notification type.</p></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Channel</th><th>Latency</th><th>Cost per Message</th><th>Deliverability</th><th>Open Rate</th></tr><tr><td>iOS Push (APNS)</td><td>100-500ms</td><td>Free</td><td>High (if token valid)</td><td>~60%</td></tr><tr><td>Android Push (FCM)</td><td>100-500ms</td><td>Free</td><td>High</td><td>~40%</td></tr><tr><td>Email (SES)</td><td>1-30s</td><td>$0.10 per 1000</td><td>Medium (spam filters)</td><td>~20%</td></tr><tr><td>SMS (Twilio)</td><td>1-5s</td><td>$0.0075 per msg</td><td>Very High</td><td>~98%</td></tr><tr><td>In-App (WebSocket)</td><td>&lt;100ms</td><td>Free</td><td>Only if app is open</td><td>~90%</td></tr></table><p class="learn-p"><b>Infrastructure sizing:</b></p><div class="learn-code">1B notifications/day = 11,574/sec avg, 55K/sec peak\nKafka: 5 topics * 12 partitions = 60 partitions, 3 brokers\nAPNS connections: 55K/sec / 3000 per connection = 19 connections\nWorkers: 20 push + 10 email + 5 SMS + 5 in-app = 40 workers\nRedis (preferences): 500M users * 200 bytes = 100 GB (10-node cluster)\nRedis (dedup): 1B keys * 50 bytes * 24h TTL = 50 GB</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you ensure a critical fraud alert is never lost?</b><br/>At-least-once delivery: persist to DB before queuing, commit Kafka offset only after confirmed delivery. Multi-channel fallback: if APNS fails → try SMS → try email. Retry with exponential backoff (max 5 retries). Alert on-call if all channels fail.</p><p class="learn-p"><b>Q2: How would you handle sending a flash sale notification to 50M users?</b><br/>Staggered delivery: partition users into 100 batches of 500K. Send one batch every 30 seconds over ~50 minutes. Randomize batch assignment to avoid geographic clustering. Monitor backend load and throttle if needed.</p><p class="learn-p"><b>Q3: Explain notification aggregation for social media (50 likes in 10 minutes).</b><br/>First event → send immediately. Start a 2-minute aggregation window. Subsequent events increment a counter in Redis. When the window expires, send aggregated notification: "Alice, Bob, and 48 others liked your photo." If the user reads the first notification before aggregation fires, cancel the pending aggregate.</p><p class="learn-p"><b>Q4: How do you prevent notification fatigue?</b><br/>Frequency caps per user (max 5 P2 notifications/hour), category-level unsubscribe, smart digest mode (batch low-priority notifications into a daily email), monitor opt-out rates and automatically reduce frequency for high-opt-out notification types.</p><p class="learn-p"><b>Q5: What is the difference between at-least-once and exactly-once delivery?</b><br/>At-least-once: message may be delivered multiple times (consumer retries). Exactly-once: message delivered exactly once (requires idempotent consumers + transactional commits). In practice, use at-least-once + client-side dedup (notification ID) for effectively exactly-once semantics.</p><p class="learn-p"><b>Q6: How do you handle device token rotation on iOS?</b><br/>APNS returns updated tokens in responses. Store device tokens in a DB indexed by user_id. When APNS returns "410 Gone," delete the token. When the app reports a new token, update the DB. Run a weekly job to prune tokens not seen in 30 days.</p></div>',
    code: `// === Notification System Design ===

// 1. Notification routing with preferences, DND, dedup
async function sendNotification(userId, event) {
  // Deduplication
  const dedupKey = \`dedup:\${event.type}:\${userId}:\${event.entityId}\`;
  const isNew = await redis.setnx(dedupKey, '1');
  if (!isNew) return;  // already sent
  await redis.expire(dedupKey, 86400);  // 24h dedup window

  // Load preferences
  const prefs = await redis.hgetall(\`prefs:\${userId}\`);
  const userTz = prefs.timezone || 'UTC';
  const localHour = getLocalHour(userTz);

  // Check DND (P0 messages override DND)
  if (event.priority !== 'P0' &&
      prefs.dndStart && localHour >= prefs.dndStart && localHour < prefs.dndEnd) {
    return scheduleForLater(userId, event, prefs.dndEnd);
  }

  // Check category unsubscribe
  if (prefs.unsubCategories?.includes(event.category)) return;

  // Check frequency cap (P0 exempt)
  if (event.priority !== 'P0') {
    const count = await redis.incr(\`notif_count:\${userId}\`);
    if (count === 1) await redis.expire(\`notif_count:\${userId}\`, 3600);
    if (count > (prefs.maxPerHour || 10)) return;
  }

  // Render template
  const content = renderTemplate(event.templateId, event.data);

  // Route to enabled channels
  const notification = { id: uuid(), userId, content, priority: event.priority };
  if (prefs.push !== 'false') await kafka.produce('push-topic', notification);
  if (prefs.email !== 'false') await kafka.produce('email-topic', notification);
  if (prefs.sms !== 'false' && event.priority === 'P0') {
    await kafka.produce('sms-topic', notification);  // SMS only for critical
  }

  // Persist to DB
  await db.notifications.insert({
    ...notification, status: 'QUEUED', createdAt: Date.now()
  });
}

// 2. Priority queue with starvation prevention
class WeightedPriorityProcessor {
  async processBatch(batchSize) {
    const p0Count = Math.floor(batchSize * 0.7);
    const p1Count = Math.floor(batchSize * 0.2);
    const p2Count = batchSize - p0Count - p1Count;
    await Promise.all([
      this.process('critical-queue', p0Count),
      this.process('high-queue', p1Count),
      this.process('normal-queue', p2Count),
    ]);
  }
}

// 3. APNS push delivery with retry and token cleanup
async function deliverPush(notification) {
  const tokens = await db.deviceTokens.findByUserId(notification.userId);
  for (const token of tokens) {
    try {
      await apns.send(token.value, {
        alert: notification.content.title,
        body: notification.content.body,
        badge: notification.content.unreadCount,
      });
      await db.notifications.update(notification.id, {
        status: 'DELIVERED', deliveredAt: Date.now()
      });
    } catch (err) {
      if (err.status === 410) {
        // Token expired — user uninstalled app
        await db.deviceTokens.delete(token.id);
      } else {
        // Retry with exponential backoff
        await retryQueue.push(notification, { delay: 2 ** notification.retryCount * 1000 });
      }
    }
  }
}

// 4. Notification aggregation (e.g., "Alice and 48 others liked your photo")
class NotificationAggregator {
  async onEvent(userId, eventType, data) {
    const key = \`agg:\${userId}:\${eventType}:\${data.targetId}\`;
    const count = await redis.incr(key);
    if (count === 1) {
      // First event: send immediately + start 2-min aggregation window
      await sendNotification(userId, { ...data, aggregated: false });
      await redis.expire(key, 120);
    }
    // Store actor names for aggregate message
    await redis.lpush(\`\${key}:actors\`, data.actorName);
    // After window expires, a scheduled job sends aggregate notification
  }
}

// 5. Staggered delivery for mass notifications (flash sale)
async function sendMassNotification(userIds, notification) {
  const BATCH_SIZE = 5000;
  const DELAY_MS = 300;  // 300ms between batches
  // Shuffle to avoid geographic clustering
  const shuffled = shuffle(userIds);
  for (let i = 0; i < shuffled.length; i += BATCH_SIZE) {
    const batch = shuffled.slice(i, i + BATCH_SIZE);
    await kafka.produce('mass-push-topic', { batch, notification });
    await sleep(DELAY_MS);
  }
  // 50M users / 5000 per batch * 300ms = 50 minutes total
}`,
    problems: [
      ["Notification System — HelloInterview Answer Key", "https://www.hellointerview.com/learn/system-design/answer-keys/notification-system", "Hard"],
      ["Notification System — ByteByteGo Course", "https://bytebytego.com/courses/system-design-interview/design-a-notification-system", "Hard"]
    ],
    mcqs: [
      {"q": "Why is exactly-once notification delivery nearly impossible in distributed systems?", "o": ["APNS doesn't support it", "Network failures can cause duplicates that can't be distinguished from new messages", "Email protocols don't support dedup", "Users can have multiple devices"], "a": 1},
      {"q": "If APNS supports 3,000 notifications/sec per HTTP/2 connection, how many connections for 90K notif/sec?", "o": ["10", "30", "90", "3,000"], "a": 1},
      {"q": "What is the primary purpose of staggered notification delivery for flash sales?", "o": ["Save bandwidth", "Prevent thundering herd on the backend when users tap the notification", "Comply with APNS rate limits", "Improve notification open rates"], "a": 1},
      {"q": "P0 notifications should:", "o": ["Be batched for efficiency", "Override DND and frequency caps", "Only use email channel", "Wait for user to open the app"], "a": 1},
      {"q": "Weighted fair queuing (70/20/10) for priority levels solves:", "o": ["Message ordering", "Starvation of low-priority notifications", "Network congestion", "Template rendering speed"], "a": 1},
      {"q": "When APNS returns '410 Gone' for a device token, the correct action is:", "o": ["Retry the notification", "Delete the token from the database", "Switch to SMS delivery", "Ignore the error"], "a": 1}
    ]
  },
  {
    t: "News Feed",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">The news feed is the core product of social platforms like Facebook, Twitter, Instagram, and LinkedIn. It determines what content users see, when they see it, and in what order. Designing a feed that serves 1B+ users with personalized, real-time content is one of the hardest distributed systems problems. This question tests your understanding of fan-out strategies, caching, ranking, and the tradeoffs between read and write amplification.</p><p class="learn-p"><b>Scale target:</b> 500M DAU, each user follows ~200 accounts on average, 10M new posts/day, feed load latency &lt;200ms, 300K feed reads/sec at peak.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">When a user opens their feed, they expect to see recent posts from accounts they follow, ranked by relevance. The central design decision is <b>when</b> to assemble each user\'s feed — at write time (push/fan-out on write) or at read time (pull/fan-out on read).</p><div class="learn-code">Fan-out on Write (Push):                Fan-out on Read (Pull):\n                                         \nUser A posts ──▶ Write to               User opens feed ──▶ Query\n                 follower feeds                               each followed\n  ┌─── Feed of Follower 1               user\'s timeline\n  ├─── Feed of Follower 2                 ┌─── User A timeline\n  ├─── Feed of Follower 3                 ├─── User B timeline\n  └─── ... (1000 writes)                  ├─── User C timeline\n                                           └─── ... (200 queries)\nRead: O(1) — pre-computed                Merge, rank, return\nWrite: O(followers)                      Read: O(following)\n                                         Write: O(1)</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>API Design:</b></p><div class="learn-code">GET /api/v1/feed?cursor={post_id}&amp;limit=20\n  Response: {\n    posts: [{ id, author, content, likes, comments, timestamp, score }],\n    next_cursor: "post_xyz789"\n  }\n\nPOST /api/v1/posts\n  Request: { content, media_urls, visibility }\n  Response: { post_id, created_at }\n\nPOST /api/v1/follow/{user_id}\nDELETE /api/v1/follow/{user_id}</div><table class="learn-table"><tr><th>Component</th><th>Technology</th><th>Purpose</th></tr><tr><td>Post Service</td><td>Go microservice</td><td>Create, edit, delete posts</td></tr><tr><td>Fan-out Service</td><td>Go + Kafka workers</td><td>Push posts to follower feeds</td></tr><tr><td>Feed Cache</td><td>Redis sorted sets</td><td>Pre-computed feeds (top 500 post IDs per user)</td></tr><tr><td>Post Store</td><td>MySQL (sharded by post_id)</td><td>Full post data</td></tr><tr><td>Social Graph</td><td>MySQL + Redis cache</td><td>Follower/following relationships</td></tr><tr><td>Ranking Service</td><td>ML model (TensorFlow Serving)</td><td>Score and rank posts</td></tr><tr><td>CDN</td><td>CloudFront</td><td>Media delivery (images, videos)</td></tr></table><p class="learn-p"><b>Data Model:</b></p><div class="learn-code">Table: posts\n  id          BIGINT PRIMARY KEY (Snowflake ID)\n  author_id   BIGINT\n  content     TEXT\n  media_urls  TEXT[]\n  created_at  TIMESTAMP\n  like_count  INT DEFAULT 0\n  comment_count INT DEFAULT 0\n\nRedis: feed:{user_id} → Sorted Set of (post_id, score)\n  Max 500 entries per user\n  Score = ranking_score (not just timestamp)\n\nTable: follows\n  follower_id  BIGINT\n  followee_id  BIGINT\n  created_at   TIMESTAMP\n  PRIMARY KEY (follower_id, followee_id)</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>Scenario: User Alice (1,200 followers, regular user) publishes a post:</b></p><ol class="learn-list"><li><b>Post Service</b> receives POST /posts with Alice\'s content. Assigns Snowflake ID, stores in posts table.</li><li><b>Publish event</b> to Kafka topic "post-created": {authorId: alice, postId: 12345, timestamp: T}.</li><li><b>Fan-out Service</b> consumes the event. Checks: Alice has 1,200 followers (below CELEBRITY_THRESHOLD of 10K) → use <b>push model</b>.</li><li><b>Fetch follower list</b> in batches of 1,000: [Bob, Charlie, Diana, ...].</li><li>For each follower, <b>ZADD</b> to Redis: <code>ZADD feed:bob T 12345</code>, <code>ZADD feed:charlie T 12345</code>, ...</li><li><b>Trim feeds</b>: <code>ZREMRANGEBYRANK feed:bob 0 -501</code> (keep only top 500 posts).</li><li>Fan-out completes in ~200ms for 1,200 followers (batch Redis pipeline).</li></ol><p class="learn-p"><b>Scenario: User Bob opens his feed:</b></p><ol class="learn-list"><li><b>GET /feed?limit=20</b>. Feed Service fetches from Redis: <code>ZREVRANGE feed:bob 0 19</code> → returns 20 post IDs from the pre-computed feed.</li><li>Bob follows 3 celebrities (50K+ followers each). <b>Pull their timelines</b>: <code>ZREVRANGE user_timeline:celeb1 0 4</code> for each celebrity → 15 more post IDs.</li><li><b>Merge</b> the 20 pushed IDs + 15 pulled IDs = 35 candidates.</li><li><b>Fetch full post objects</b> from the Post Store (batch query by IDs).</li><li><b>Filter</b>: Remove blocked/deleted posts (check against a "blocked posts" Redis set).</li><li><b>Rank</b>: ML model scores each post based on recency, engagement, affinity, content type. Sort by score.</li><li><b>Return top 20</b> with next_cursor = last post\'s ID for pagination.</li></ol></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Approach</th><th>Write Cost</th><th>Read Cost</th><th>Latency</th><th>Best For</th></tr><tr><td>Fan-out on Write (Push)</td><td><span class="learn-complexity">O(followers) — 1 write per follower</span></td><td><span class="learn-complexity">O(1) — pre-computed</span></td><td>Read: very fast</td><td>Users with &lt;10K followers</td></tr><tr><td>Fan-out on Read (Pull)</td><td><span class="learn-complexity">O(1) — write once</span></td><td><span class="learn-complexity">O(following) — merge N timelines</span></td><td>Read: slower</td><td>Celebrities with millions of followers</td></tr><tr><td>Hybrid (Push + Pull)</td><td><span class="learn-complexity">O(followers) for regular users</span></td><td><span class="learn-complexity">O(1) + O(celeb_count)</span></td><td>Read: fast</td><td>Production systems (Facebook, Twitter)</td></tr></table><p class="learn-p"><b>The Celebrity Problem:</b> A user with 50M followers posts. Fan-out on write means 50M Redis writes — taking minutes and creating a massive write spike. Solution: use pull for celebrities (&gt;10K followers). When assembling a feed, merge the pre-computed push feed with real-time pulls from followed celebrities. The threshold (10K) is tunable based on system performance.</p><p class="learn-p"><b>Ranking approaches:</b></p><ul class="learn-list"><li><b>Chronological</b>: Sort by timestamp. Simple but misses important older posts.</li><li><b>EdgeRank</b> (Facebook): Score = Sum(affinity * edge_weight * time_decay). Affinity = interaction history between users.</li><li><b>Deep learning</b>: Feature vector per post (author features, content features, user features) → neural network → engagement probability score.</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Offset-based pagination is broken for real-time feeds:</b> User loads page 1 (posts 1-20). A new post arrives, shifting everything. User loads page 2 and sees post 20 again (now at position 21). Solution: use cursor-based pagination — "give me 20 posts after post_id=XYZ." Inserts don\'t affect the cursor position.</div><div class="learn-warn"><b>Feed cache cold start:</b> A new user has no cached feed. First load triggers a full pull from all followed users\' timelines — expensive. Solution: pre-compute feeds for new users during the follow step (not just on first feed load). Or serve a "popular/trending" feed while the real feed is being built asynchronously.</div><div class="learn-warn"><b>Fan-out service lag:</b> If the fan-out service falls behind (Kafka consumer lag), users see stale feeds. Monitor consumer lag. Auto-scale fan-out workers when lag exceeds 1 minute. For real-time critical feeds, bypass the queue and fan out synchronously for small follower counts (&lt;100).</div><p class="learn-p"><b>Post deletion / policy violation:</b> A post is flagged for content violation and must be removed from all feeds immediately. Can\'t do a reverse fan-out (too slow for 50M feeds). Solution: maintain a global "blocked_post_ids" Redis set. Filter at read time before returning feed results. Eventual consistency for cache cleanup via a background job.</p><p class="learn-p"><b>Unfollow consistency:</b> User unfollows someone. Old posts from the unfollowed user are still in the cached feed. Solution: lazy cleanup — filter out posts from unfollowed users at read time. Background job cleans the cache eventually.</p></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Metric</th><th>Value</th><th>Calculation</th></tr><tr><td>Feed reads/sec</td><td>300K (peak)</td><td>500M DAU * 10 opens/day / 86400 * 5x peak</td></tr><tr><td>Posts/sec (fan-out source)</td><td>~116/sec</td><td>10M posts/day / 86400</td></tr><tr><td>Fan-out writes/sec</td><td>~23K/sec</td><td>116 posts/sec * 200 avg followers</td></tr><tr><td>Redis memory (feeds)</td><td>400 GB</td><td>50M active feeds * 500 entries * 16 bytes</td></tr><tr><td>Post storage</td><td>3.65 TB/year</td><td>10M posts/day * 1KB avg * 365</td></tr></table><table class="learn-table"><tr><th>System</th><th>Feed Strategy</th><th>Scale</th></tr><tr><td>Twitter</td><td>Hybrid push/pull</td><td>500M tweets/day, 300M MAU</td></tr><tr><td>Facebook</td><td>Pull with ranking + caching</td><td>2.9B MAU, ML-ranked feed</td></tr><tr><td>Instagram</td><td>Hybrid (similar to Twitter)</td><td>2B MAU, interest-based ranking</td></tr><tr><td>LinkedIn</td><td>Push for most, pull for influencers</td><td>900M members</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Walk through what happens when a user with 50M followers posts.</b><br/>This user is a celebrity. We do NOT fan out to 50M feeds. Instead, we write only to the celebrity\'s own timeline (1 write). When any of the 50M followers opens their feed, we pull the latest 5 posts from this celebrity\'s timeline and merge with the pre-computed feed. This limits write amplification to O(1) instead of O(50M).</p><p class="learn-p"><b>Q2: How does cursor-based pagination work and why is it necessary?</b><br/>The cursor is the ID of the last item on the current page. Next page: fetch items with score &lt; cursor_score from the sorted set. Unlike offset-based pagination, inserting a new post doesn\'t cause items to shift — the cursor points to a fixed item, so the user never sees duplicates or skipped posts.</p><p class="learn-p"><b>Q3: How do you decide the celebrity threshold (10K followers)?</b><br/>It\'s a latency vs throughput tradeoff. At 10K followers, fan-out takes ~15ms (Redis pipelining). At 100K, it takes 150ms. At 1M, 1.5 seconds — unacceptable write latency. Monitor P99 fan-out latency and adjust the threshold to keep it under 50ms. Start at 10K, tune based on production data.</p><p class="learn-p"><b>Q4: How do you rank posts in the feed?</b><br/>Feature engineering: recency (time decay), engagement (log(likes + 2*comments)), affinity (how often the viewer interacts with the author), content type (photos rank higher than text), diversity (don\'t show 10 posts from one author). Score = weighted combination or ML model prediction. Pre-score at fan-out time, re-score at read time with user-specific features.</p><p class="learn-p"><b>Q5: How much Redis memory do you need for 500M users\' feeds?</b><br/>Only active users need cached feeds. 50M DAU * 500 post IDs * 16 bytes (8B ID + 8B score) = 400 GB. With a 40-node Redis cluster (10GB per node), this is feasible. Evict feeds for users inactive &gt;7 days. Re-compute on next login.</p></div>',
    code: `// === News Feed System Design ===

// 1. Fan-out on Write service
const CELEBRITY_THRESHOLD = 10000;

async function publishPost(userId, post) {
  // Save post to posts table
  const postId = snowflake.nextId();
  await db.posts.insert({ id: postId, authorId: userId, ...post });

  const followerCount = await getFollowerCount(userId);

  if (followerCount > CELEBRITY_THRESHOLD) {
    // Celebrity: don't fan out, followers will pull at read time
    await redis.zadd(\`user_timeline:\${userId}\`, post.timestamp, postId);
    await redis.zremrangebyrank(\`user_timeline:\${userId}\`, 0, -501);
    return;
  }

  // Regular user: fan out to all followers' feeds via Kafka
  await kafka.produce('fanout-topic', {
    authorId: userId, postId, timestamp: post.timestamp
  });
}

// 2. Fan-out worker (consumes from Kafka)
kafkaConsumer.on('message', async (event) => {
  const { authorId, postId, timestamp } = event;
  const followers = await getFollowersInBatches(authorId, 1000);

  for (const batch of followers) {
    const pipeline = redis.pipeline();
    for (const followerId of batch) {
      pipeline.zadd(\`feed:\${followerId}\`, timestamp, postId);
      pipeline.zremrangebyrank(\`feed:\${followerId}\`, 0, -501); // keep 500
    }
    await pipeline.exec();  // batch Redis calls for efficiency
  }
});

// 3. Feed retrieval (hybrid push + pull)
async function getFeed(userId, cursor, limit = 20) {
  // Step 1: Get pre-computed feed (pushed posts)
  let feedIds;
  if (cursor) {
    const cursorScore = await redis.zscore(\`feed:\${userId}\`, cursor);
    feedIds = await redis.zrevrangebyscore(
      \`feed:\${userId}\`, cursorScore - 1, '-inf', 'LIMIT', 0, limit
    );
  } else {
    feedIds = await redis.zrevrange(\`feed:\${userId}\`, 0, limit - 1);
  }

  // Step 2: Pull from followed celebrities
  const celebrities = await getCelebrityFollows(userId);
  const celebPosts = [];
  for (const celeb of celebrities) {
    const posts = await redis.zrevrange(
      \`user_timeline:\${celeb}\`, 0, 4  // latest 5 posts per celebrity
    );
    celebPosts.push(...posts);
  }

  // Step 3: Merge pushed + pulled post IDs
  const allIds = [...new Set([...feedIds, ...celebPosts])];

  // Step 4: Fetch full post objects (batch DB query)
  const posts = await db.posts.findByIds(allIds);

  // Step 5: Filter blocked/deleted posts
  const blockedIds = await redis.smembers('blocked_posts');
  const filtered = posts.filter(p =>
    !blockedIds.includes(p.id) && !isUnfollowed(userId, p.authorId)
  );

  // Step 6: Rank by relevance
  const ranked = rankPosts(filtered, userId);
  return ranked.slice(0, limit);
}

// 4. Ranking function
function rankPosts(posts, userId) {
  return posts.map(post => {
    const hoursSincePost = (Date.now() - post.timestamp) / 3600000;
    const recency = 1 / (1 + hoursSincePost);  // time decay
    const engagement = Math.log(1 + post.likeCount + post.commentCount * 2);
    const affinity = getAffinityScore(userId, post.authorId);
    const contentBoost = post.mediaUrls?.length > 0 ? 1.2 : 1.0;
    post.score = affinity * engagement * recency * contentBoost;
    return post;
  }).sort((a, b) => b.score - a.score);
}

// 5. Affinity score (interaction-based)
async function getAffinityScore(viewerId, authorId) {
  // Count recent interactions: likes, comments, profile views, DMs
  const interactions = await redis.get(
    \`affinity:\${viewerId}:\${authorId}\`
  );
  if (!interactions) return 0.5;  // default
  return Math.min(1.0, 0.3 + parseInt(interactions) * 0.05);
}

// 6. Feed invalidation (post deletion)
async function deletePost(postId) {
  await db.posts.delete(postId);
  // Add to blocked set (read-time filtering)
  await redis.sadd('blocked_posts', postId);
  // Background: remove from cached feeds (eventual)
  await kafka.produce('feed-cleanup', { postId });
}`,
    problems: [
      ["News Feed System — ByteByteGo Course", "https://bytebytego.com/courses/system-design-interview/design-a-news-feed-system", "Hard"]
    ],
    mcqs: [
      {"q": "Fan-out on write is impractical for users with many followers because:", "o": ["Read latency increases", "It requires too many write operations (O(followers))", "It doesn't support ranking", "It requires more read replicas"], "a": 1},
      {"q": "Why is cursor-based pagination preferred over offset-based for news feeds?", "o": ["It's faster", "It avoids duplicate posts when new content is inserted", "It uses less memory", "It supports better caching"], "a": 1},
      {"q": "In a hybrid push/pull feed system, when is pull used?", "o": ["For all users", "For users who post frequently", "For celebrity accounts with many followers", "For inactive users"], "a": 2},
      {"q": "Redis memory for 50M active feeds with 500 post IDs each (16 bytes per entry) is:", "o": ["4 GB", "40 GB", "400 GB", "4 TB"], "a": 2},
      {"q": "A post flagged for content violation should be removed from feeds by:", "o": ["Reverse fan-out to all feeds immediately", "Adding to a blocked_posts set and filtering at read time", "Deleting the Redis cache entirely", "Sending push notifications to all affected users"], "a": 1},
      {"q": "The EdgeRank formula Score = affinity * weight * decay primarily accounts for:", "o": ["Post length", "How close the viewer is to the author, content type importance, and freshness", "Server load", "Number of comments only"], "a": 1},
            {"q": "Fan-out on write pre-computes feeds at write time. Its main disadvantage is:", "o": ["Slow reads", "Wasted writes for inactive users who never check their feed", "Complex read logic", "Poor cache hit rate"], "a": 1},
            {"q": "Cursor-based pagination in feeds uses a pointer (e.g., last seen post ID) instead of offset. This prevents:", "o": ["Slow queries", "Duplicate or missing posts when new content is inserted during pagination", "Cache misses", "High memory usage"], "a": 1}]
  },
  {
    t: "Chat System",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Chat systems like WhatsApp (2B users), Slack (20M DAU), and Discord serve billions of real-time messages daily. Building one requires solving challenging problems: persistent bidirectional connections at scale, message ordering guarantees, offline message delivery, presence tracking, and end-to-end encryption. This is a frequent system design interview question that tests your understanding of real-time protocols, distributed state, and consistency tradeoffs.</p><p class="learn-p"><b>Scale target:</b> 50M concurrent connections, 500K messages/sec, &lt;100ms message delivery latency (same region), message ordering guarantees per conversation, 99.99% delivery rate.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">A chat system enables real-time, bidirectional messaging between users. The key architectural challenge is maintaining persistent connections with millions of clients while routing messages efficiently between them.</p><div class="learn-code">┌──────────┐   WebSocket    ┌──────────────┐\n│ Client A │ ─────────────▶ │ Chat Server 1 │\n└──────────┘                └──────┬───────┘\n                                   │ Pub/Sub\n                          ┌────────▼────────┐\n                          │  Message Router   │\n                          │  (Redis Pub/Sub   │\n                          │   or Kafka)       │\n                          └────────┬────────┘\n                                   │\n┌──────────┐   WebSocket    ┌──────▼───────┐\n│ Client B │ ◀───────────── │ Chat Server 2 │\n└──────────┘                └──────────────┘\n                                   │\n                          ┌────────▼────────┐\n                          │  Message Store   │\n                          │  (Cassandra)     │\n                          └─────────────────┘</div><p class="learn-p">Each client maintains a persistent <b>WebSocket</b> connection to one chat server. When Client A sends a message to Client B (who is on a different server), the message is routed via a pub/sub layer (Redis Pub/Sub or Kafka).</p></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>API Design:</b></p><div class="learn-code">WebSocket Messages (bidirectional):\n  Client → Server: { type: "send", conversationId, content, clientMsgId }\n  Server → Client: { type: "message", conversationId, senderId, content, seqNum, timestamp }\n  Server → Client: { type: "ack", clientMsgId, status: "sent"|"delivered"|"read" }\n  Client → Server: { type: "read", conversationId, lastSeqNum }\n  Server → Client: { type: "presence", userId, status: "online"|"offline"|"typing" }\n\nREST APIs:\n  GET /api/v1/conversations/{id}/messages?before={seqNum}&amp;limit=50\n  GET /api/v1/conversations (list user\'s conversations)\n  POST /api/v1/conversations (create new 1:1 or group)\n  POST /api/v1/conversations/{id}/members (add member to group)</div><table class="learn-table"><tr><th>Component</th><th>Technology</th><th>Purpose</th></tr><tr><td>Chat Servers</td><td>Go/Erlang + WebSocket</td><td>Persistent connections, 500K connections/server</td></tr><tr><td>Connection Registry</td><td>Redis hash</td><td>userId → serverId mapping</td></tr><tr><td>Message Router</td><td>Redis Pub/Sub or Kafka</td><td>Cross-server message delivery</td></tr><tr><td>Message Store</td><td>Cassandra</td><td>Persistent message storage</td></tr><tr><td>Sequence Service</td><td>Redis INCR</td><td>Per-conversation monotonic sequence numbers</td></tr><tr><td>Presence Service</td><td>Redis with TTL</td><td>Online/offline status</td></tr><tr><td>Offline Queue</td><td>Kafka / Redis lists</td><td>Messages for offline users</td></tr></table><p class="learn-p"><b>Data Model:</b></p><div class="learn-code">Cassandra Table: messages\n  conversation_id  UUID      -- partition key\n  bucket           TEXT      -- compound partition: conv_id + month\n  seq_num          BIGINT    -- clustering key (ASC)\n  sender_id        UUID\n  content          TEXT\n  content_type     TEXT      -- text, image, video, file\n  created_at       TIMESTAMP\n  PRIMARY KEY ((conversation_id, bucket), seq_num)\n\nRedis: conn:{user_id} → server_id (which chat server)\nRedis: presence:{user_id} → {status, last_active} (TTL: 60s)\nRedis: seq:{conversation_id} → current_sequence_number</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>Alice sends "Hello!" to Bob (1:1 chat):</b></p><ol class="learn-list"><li><b>Alice\'s client</b> sends via WebSocket: <code>{type: "send", conversationId: "conv_42", content: "Hello!", clientMsgId: "abc"}</code>.</li><li><b>Chat Server 1</b> (Alice\'s server) receives the message.</li><li><b>Assign sequence number</b>: <code>INCR seq:conv_42</code> → returns 157. This ensures monotonic ordering.</li><li><b>Persist to Cassandra</b>: INSERT INTO messages (conv_42, "2026-06", 157, alice_id, "Hello!", ...).</li><li><b>ACK to Alice</b>: <code>{type: "ack", clientMsgId: "abc", status: "sent"}</code> → single checkmark.</li><li><b>Route to Bob</b>: Look up Bob\'s server: <code>GET conn:bob</code> → "chat_server_2".</li><li><b>Publish</b> to Redis channel "chat_server_2": the message with seqNum=157.</li><li><b>Chat Server 2</b> receives the published message. Finds Bob\'s WebSocket connection.</li><li><b>Deliver to Bob</b>: Send <code>{type: "message", conversationId: "conv_42", senderId: alice, content: "Hello!", seqNum: 157}</code>.</li><li><b>Bob\'s client ACKs</b>: Server sends <code>{type: "ack", clientMsgId: "abc", status: "delivered"}</code> to Alice → double checkmark.</li><li>Later, Bob opens the conversation: <code>{type: "read", conversationId: "conv_42", lastSeqNum: 157}</code>.</li><li><b>Read receipt</b> sent to Alice → blue checkmarks.</li></ol><p class="learn-p"><b>If Bob is offline:</b> At step 6, <code>GET conn:bob</code> returns null. The message is pushed to Bob\'s <b>offline queue</b> (Kafka topic or Redis list). When Bob reconnects, all pending messages are delivered in sequence order.</p></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Protocol</th><th>Direction</th><th>Overhead</th><th>Latency</th><th>Use Case</th></tr><tr><td>WebSocket</td><td>Full duplex</td><td>2 bytes framing</td><td>Very low</td><td>Chat (primary)</td></tr><tr><td>HTTP Long Polling</td><td>Simulated duplex</td><td>HTTP headers per poll</td><td>Medium</td><td>Fallback for firewalls</td></tr><tr><td>Server-Sent Events (SSE)</td><td>Server → Client only</td><td>Low</td><td>Low</td><td>Notifications, not chat</td></tr></table><p class="learn-p"><b>Group chat approaches:</b></p><ul class="learn-list"><li><b>Small groups (&lt;100 members):</b> Sender\'s server fans out to each member\'s server directly. Simple and low latency.</li><li><b>Medium groups (100-500):</b> Dedicated group service handles fan-out. Decouples sender from delivery load.</li><li><b>Large groups (500+):</b> Pub/sub channel per group. Members subscribe to the channel. Server-side fan-out is O(1) for the sender.</li></ul><p class="learn-p"><b>Message ordering:</b> Use per-conversation <b>monotonic sequence numbers</b> (Redis INCR), not timestamps. Timestamps are unreliable across servers (clock skew). The client displays messages sorted by seqNum. If message #5 arrives before #4, buffer #5 and wait briefly for #4 (or show with a gap indicator).</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Reconnection storm:</b> If a chat server with 500K connections crashes, all 500K clients try to reconnect simultaneously to other servers — overwhelming them. Solution: each client waits a random jitter (0-30 seconds) before reconnecting. Gradually spread the load across surviving servers.</div><div class="learn-warn"><b>Message ordering with multiple senders:</b> In a group chat, Alice and Bob send messages simultaneously. Server 1 assigns seqNum=10 to Alice\'s message, Server 2 assigns seqNum=11 to Bob\'s. But seqNum=11 arrives at some clients before seqNum=10. Solution: use a single <b>sequencer</b> (Redis INCR on the conversation key) to guarantee total order. This becomes a bottleneck for very active groups — partition by sub-conversation or use vector clocks.</div><div class="learn-warn"><b>Hot group partition:</b> A 10K-member group with active chatting creates a hot partition in Cassandra (all messages in one partition). Solution: compound partition key = (conversation_id, month). Each month is a separate partition. Old months are cold, new month is hot but bounded in size.</div><p class="learn-p"><b>Presence flicker:</b> User\'s connection drops for 3 seconds (elevator, subway). Without a grace period, they flicker online→offline→online. Solution: 30-second grace period before marking offline. Heartbeat every 30 seconds; if no heartbeat for 60 seconds, mark offline.</p><p class="learn-p"><b>Media and file sharing:</b> For image/video/file messages, the client uploads the file directly to object storage (S3/GCS) via a pre-signed URL, receives the file URL and metadata (size, dimensions, duration), then sends a chat message with content_type="image" and the file URL as content. The chat server never handles raw file bytes — it only routes the lightweight message. Generate thumbnails asynchronously (Lambda/worker) and attach the thumbnail URL to the message metadata. For large videos, use chunked multipart upload. This decouples media storage from real-time messaging and keeps chat server memory usage low.</p><p class="learn-p"><b>End-to-end encryption implications:</b> With E2E encryption (Signal Protocol / Double Ratchet), the server cannot read message content. This means: no server-side search, no content moderation, no link previews generated server-side. Group re-keying on member add/remove is computationally expensive for large groups.</p></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Metric</th><th>Value</th><th>Calculation</th></tr><tr><td>Concurrent connections</td><td>50M</td><td>At 500K connections/server → 100 chat servers</td></tr><tr><td>Heartbeats/sec</td><td>1.67M</td><td>50M / 30s interval</td></tr><tr><td>Heartbeat bandwidth</td><td>668 Mbps</td><td>1.67M * 50 bytes * 8 bits</td></tr><tr><td>Messages/sec</td><td>500K</td><td>Peak throughput target</td></tr><tr><td>Message storage/day</td><td>~43 TB</td><td>500K/sec * 86400 * 1KB avg = 43.2 TB (before compression)</td></tr><tr><td>Connection registry</td><td>5 GB</td><td>50M entries * 100 bytes in Redis</td></tr></table><table class="learn-table"><tr><th>Feature</th><th>WhatsApp</th><th>Slack</th><th>Discord</th></tr><tr><td>Protocol</td><td>Custom (XMPP-based)</td><td>WebSocket</td><td>WebSocket</td></tr><tr><td>E2E Encryption</td><td>Yes (Signal Protocol)</td><td>No (enterprise needs search)</td><td>No</td></tr><tr><td>Max Group Size</td><td>1,024</td><td>Unlimited (channels)</td><td>Unlimited (servers)</td></tr><tr><td>Message Persistence</td><td>Device only (E2E)</td><td>Server (searchable)</td><td>Server (searchable)</td></tr><tr><td>Scale</td><td>2B users</td><td>20M DAU</td><td>150M MAU</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Why WebSocket over HTTP long polling?</b><br/>WebSocket provides true bidirectional communication over a single persistent TCP connection with 2-byte framing overhead. Long polling requires a new HTTP request after each response (with full headers, ~800 bytes overhead per poll), and has higher latency (~100-500ms round trip per poll). For a chat system processing 500K messages/sec, the overhead savings of WebSocket are enormous.</p><p class="learn-p"><b>Q2: How do you handle 500K connections on a single server?</b><br/>Use an event-driven, non-blocking I/O framework (Go goroutines, Erlang processes, Node.js with libuv). Each connection consumes ~10KB memory (TCP buffers + state). 500K * 10KB = 5GB RAM — feasible on modern servers. The bottleneck is heartbeat processing (500K / 30 = 16K heartbeats/sec per server) and message routing.</p><p class="learn-p"><b>Q3: How do you guarantee message ordering in a group chat?</b><br/>Use a centralized sequencer per conversation (Redis INCR on the conversation ID key). This gives a monotonic sequence number to each message. All clients display messages sorted by seqNum. Tradeoff: the sequencer is a single point of contention. For very active groups (&gt;1K messages/sec), partition the sequence space or accept approximate ordering with timestamps + tiebreaking.</p><p class="learn-p"><b>Q4: What happens when a user reconnects after being offline for 2 hours?</b><br/>The offline queue (Kafka or Redis list) holds all undelivered messages for the user. On reconnect, fetch all pending messages, sort by (conversation_id, seqNum), and deliver in order. For users offline for days with large backlogs, deliver the most recent N messages per conversation and lazy-load older ones on scroll.</p><p class="learn-p"><b>Q5: How does the presence system work at scale?</b><br/>Store presence in Redis with TTL: <code>SETEX presence:user_42 60 "online"</code>. Client sends heartbeat every 30s, which resets the TTL. If TTL expires → offline. Fan-out presence updates only to users who have the app open and are viewing a conversation with the offline user — not to all 500 contacts.</p><p class="learn-p"><b>Q6: How would you implement "typing..." indicators?</b><br/>Client sends a "typing" event via WebSocket when the user starts typing. Server broadcasts to other participants in the conversation. Include a timeout: if no new "typing" event for 3 seconds, client removes the indicator. Don\'t persist these events — they\'re ephemeral and fire-and-forget.</p></div>',
    code: `// === Chat System Design ===

// 1. WebSocket server with connection management
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Connection registry: userId -> ws connection (local)
const connections = new Map();

wss.on('connection', (ws, req) => {
  const userId = authenticate(req);
  connections.set(userId, ws);

  // Register in Redis: which server this user is on
  redis.set(\`conn:\${userId}\`, SERVER_ID, 'EX', 300);
  updatePresence(userId, 'online');

  ws.on('message', (data) => handleMessage(userId, JSON.parse(data)));
  ws.on('close', () => {
    connections.delete(userId);
    redis.del(\`conn:\${userId}\`);
    // Grace period: don't mark offline immediately
    setTimeout(() => {
      if (!connections.has(userId)) updatePresence(userId, 'offline');
    }, 30000);
  });
});

// 2. Message handling with ordering guarantees
async function handleMessage(senderId, msg) {
  const { conversationId, content, clientMsgId } = msg;

  // Assign monotonic sequence number (per-conversation)
  const seqNum = await redis.incr(\`seq:\${conversationId}\`);

  const message = {
    id: generateId(),
    conversationId,
    senderId,
    content,
    seqNum,
    timestamp: Date.now(),
  };

  // Persist to Cassandra
  const bucket = new Date().toISOString().slice(0, 7); // YYYY-MM
  await cassandra.execute(
    'INSERT INTO messages (conversation_id, bucket, seq_num, sender_id, content, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [conversationId, bucket, seqNum, senderId, content, message.timestamp]
  );

  // ACK to sender: "sent" (single checkmark)
  connections.get(senderId)?.send(JSON.stringify({
    type: 'ack', clientMsgId, status: 'sent', seqNum
  }));

  // Deliver to other participants
  const members = await getConversationMembers(conversationId);
  for (const memberId of members) {
    if (memberId === senderId) continue;
    await deliverToUser(memberId, message);
  }
}

// 3. Cross-server message routing
async function deliverToUser(userId, message) {
  // Check if user is on this server (local delivery)
  const localWs = connections.get(userId);
  if (localWs) {
    localWs.send(JSON.stringify({ type: 'message', ...message }));
    return;
  }

  // Check which server the user is on
  const targetServer = await redis.get(\`conn:\${userId}\`);
  if (targetServer) {
    // Route via Redis Pub/Sub to the target server
    await redis.publish(\`server:\${targetServer}\`, JSON.stringify({
      type: 'deliver', userId, message
    }));
  } else {
    // User is offline — queue for later delivery
    await redis.rpush(\`offline:\${userId}\`, JSON.stringify(message));
  }
}

// 4. Listen for cross-server messages (Redis Pub/Sub)
redisSub.subscribe(\`server:\${SERVER_ID}\`);
redisSub.on('message', (channel, data) => {
  const { userId, message } = JSON.parse(data);
  const ws = connections.get(userId);
  if (ws) ws.send(JSON.stringify({ type: 'message', ...message }));
});

// 5. Offline message delivery on reconnect
async function onUserReconnect(userId) {
  const pending = [];
  let msg;
  while ((msg = await redis.lpop(\`offline:\${userId}\`))) {
    pending.push(JSON.parse(msg));
  }
  // Sort by conversation and sequence number
  pending.sort((a, b) => a.seqNum - b.seqNum);
  for (const m of pending) {
    connections.get(userId)?.send(JSON.stringify({ type: 'message', ...m }));
  }
}

// 6. Presence system with heartbeat
setInterval(() => {
  connections.forEach((ws, userId) => {
    ws.ping();  // send WebSocket ping frame
  });
}, 30000);

// On pong received: refresh presence TTL
ws.on('pong', () => {
  redis.expire(\`presence:\${userId}\`, 60);
});

// 7. Group chat with size-based strategy
async function sendToGroup(groupId, message) {
  const members = await redis.smembers(\`group:\${groupId}:members\`);
  if (members.length > 500) {
    // Large group: use pub/sub channel
    await redis.publish(\`group:\${groupId}\`, JSON.stringify(message));
  } else {
    // Small/medium: direct fan-out
    for (const memberId of members) {
      await deliverToUser(memberId, message);
    }
  }
}

// 8. Read receipts
async function markAsRead(userId, conversationId, lastSeqNum) {
  await db.readReceipts.upsert({
    conversationId, userId, lastReadSeq: lastSeqNum
  });
  // Notify sender(s) of read receipt
  const members = await getConversationMembers(conversationId);
  for (const memberId of members) {
    if (memberId === userId) continue;
    await deliverToUser(memberId, {
      type: 'read_receipt', userId, conversationId, lastReadSeq: lastSeqNum
    });
  }
}`,
    problems: [
      ["Chat System — ByteByteGo Course", "https://bytebytego.com/courses/system-design-interview/design-a-chat-system", "Hard"]
    ],
    mcqs: [
      {"q": "What is the primary advantage of WebSocket over HTTP long polling for chat?", "o": ["WebSocket is encrypted", "True bidirectional communication with minimal (2-byte) framing overhead", "Better browser compatibility", "Automatic reconnection"], "a": 1},
      {"q": "50M concurrent WebSocket connections with 30s heartbeats generate approximately how many heartbeats/sec?", "o": ["167K", "500K", "1.67M", "50M"], "a": 2},
      {"q": "Why use per-conversation sequence numbers instead of global timestamps for message ordering?", "o": ["Sequence numbers are smaller", "Clock skew across servers makes timestamps unreliable for ordering", "Timestamps don't support encryption", "Sequence numbers are faster to generate"], "a": 1},
      {"q": "What should happen when a user's internet drops for 5 seconds in the presence system?", "o": ["Immediately mark offline", "Use a grace period of ~30 seconds before marking offline", "Delete the user session", "Disconnect all their conversations"], "a": 1},
      {"q": "For a group chat with 50K members, the best message delivery approach is:", "o": ["Direct fan-out from sender's server", "Pub/sub channel per group", "Store-and-poll by each member", "Broadcast to all chat servers"], "a": 1},
      {"q": "Compound partition key (conversation_id, month) in Cassandra solves:", "o": ["Message ordering", "Hot partition problem for long-lived active conversations", "Data encryption", "Cross-region replication"], "a": 1}
    ]
  },
  {
    t: "Search Autocomplete",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Search autocomplete (typeahead) is a critical UX feature used by Google (8.5B searches/day), Amazon (product search), YouTube, and every modern search interface. It must return suggestions within <b>100ms</b> of each keystroke — any slower and the user perceives lag. This system design problem tests your understanding of trie data structures, distributed caching, real-time data pipelines, and latency optimization. Autocomplete is relevant for symbol search in trading terminals and research query tools.</p><p class="learn-p"><b>Scale target:</b> 10B searches/day generating autocomplete data, 100M unique search terms, top-5 suggestions per prefix in &lt;50ms, support trending topics within 5 minutes of emergence.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">The <b>trie</b> (prefix tree) is the core data structure. Each node represents a character, paths from root to nodes represent prefixes. The key optimization: pre-compute and cache the <b>top-K suggestions at every trie node</b>, so lookups are O(prefix_length) instead of scanning the entire subtree.</p><div class="learn-code">                     Root\n                   /   |   \\\n                  s    d    h\n                / |     \\    \\\n               y   t     a    o\n              /    |      \\    \\\n             s     r       t    w\n            /      |        \\    \\\n   [system   [string,   [data    [how to,\n    design,   stream,    struct,  howdy]\n    sync]     struct]    database]\n\nQuery: "st" → traverse root→s→t → return topK:\n  ["string", "stream", "structure", "stock", "start"]\n\nO(prefix_length) lookup = O(2) for "st" — extremely fast!</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>API Design:</b></p><div class="learn-code">GET /api/v1/autocomplete?q={prefix}&amp;limit=5\n  Response: {\n    suggestions: [\n      { text: "system design", score: 95000 },\n      { text: "system architecture", score: 42000 },\n      { text: "sync vs async", score: 31000 }\n    ],\n    latency_ms: 12\n  }\n\nClient-side: 100ms debounce before sending request\n  (don\'t send on every keystroke — wait for typing pause)</div><table class="learn-table"><tr><th>Component</th><th>Technology</th><th>Purpose</th></tr><tr><td>Trie Server</td><td>Go/C++ service</td><td>In-memory trie with top-K per node</td></tr><tr><td>Static Trie</td><td>Weekly batch rebuild</td><td>Base suggestions from historical data</td></tr><tr><td>Trending Cache</td><td>Redis sorted sets</td><td>Real-time trending queries (updated every minute)</td></tr><tr><td>Data Collection</td><td>Kafka → Flink</td><td>Aggregate search logs into frequency counts</td></tr><tr><td>CDN/Edge Cache</td><td>CloudFront</td><td>Cache short prefixes (1-2 chars) at the edge</td></tr><tr><td>Trie Builder</td><td>Spark batch job</td><td>Weekly rebuild from aggregated frequencies</td></tr><tr><td>Filter Service</td><td>Blocklist + ML</td><td>Remove offensive/dangerous suggestions</td></tr></table><p class="learn-p"><b>Memory estimation:</b></p><div class="learn-code">100M unique search terms, avg 20 characters each\nTrie nodes: ~2B (some paths share prefixes)\nEach node: 8 bytes pointer + children map + top-5 refs\nTop-5 per node: 5 * (pointer + score) = 5 * 16 = 80 bytes\nTotal: ~2B nodes * ~100 bytes = ~200 GB\n→ Doesn\'t fit in one machine → need sharding or compression\n\nWith prefix aggregation (only store nodes with suggestions):\n  ~500M relevant nodes * 100 bytes = ~50 GB\n  → Fits in 2 machines with 32 GB RAM each + overhead</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p">Trace a user typing "sys" in the search box:</p><ol class="learn-list"><li><b>User types "s"</b>: Client starts 100ms debounce timer. Timer reset on next keystroke.</li><li><b>User types "sy"</b>: Timer reset again (within 100ms).</li><li><b>User types "sys"</b>: 100ms passes with no more keystrokes. Client sends GET /autocomplete?q=sys.</li><li><b>Edge cache check</b> (CDN): "sys" has 3 chars → medium cache TTL. Cache MISS (first request).</li><li><b>Load balancer</b> routes to Trie Server based on first char (shard "s").</li><li><b>Trie Server</b>: Traverse root→s→y→s. Node has pre-computed top-5: ["system design", "system architecture", "sync", "syntax error", "syslog"].</li><li><b>Merge with trending</b>: Check Redis <code>ZREVRANGE trending:sys 0 4</code>. Returns ["system crash fix"] (trending due to a recent widespread outage).</li><li><b>Combine and re-rank</b>: Merge static top-5 with trending. Apply content filter (blocklist check). Score = 0.6 * global_freq + 0.3 * personal + 0.1 * trending_boost.</li><li><b>Return top 5</b> results in &lt;50ms. CDN caches the response for 5 minutes.</li><li><b>User sees</b> suggestions dropdown with 5 options within ~150ms of typing "sys" (100ms debounce + 50ms server latency).</li></ol></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Approach</th><th>Latency</th><th>Freshness</th><th>Complexity</th></tr><tr><td>Static trie (weekly rebuild)</td><td>Very low (in-memory)</td><td>Stale (up to 7 days)</td><td>Low</td></tr><tr><td>Static + trending overlay</td><td>Low (trie + Redis lookup)</td><td>Minutes (trending from streaming)</td><td>Medium</td></tr><tr><td>Real-time trie updates</td><td>Low but updates may cause locks</td><td>Real-time</td><td>High (concurrent read/write)</td></tr><tr><td>Elasticsearch prefix queries</td><td>Medium (10-50ms)</td><td>Near real-time</td><td>Low (managed service)</td></tr></table><p class="learn-p"><b>Trie sharding strategies:</b></p><ul class="learn-list"><li><b>First-character:</b> Shard by first letter. Problem: \'s\' gets 15% of traffic, \'x\' gets 0.1%. Severely imbalanced.</li><li><b>Two-character prefix:</b> 62^2 = 3,844 ranges mapped to N shards. More balanced but still imperfect.</li><li><b>Range-based with dynamic splitting:</b> Start with first-char. If a shard gets too hot, split it further (e.g., "sa-sm" on shard 1, "sn-sz" on shard 2). Best for production.</li></ul><p class="learn-p"><b>Personalization:</b> Blend global popularity with user-specific history. If the user frequently searches "system design interview," boost it for that user. Store per-user search history in Redis (last 100 searches) and re-rank suggestions at query time. This adds ~5ms latency but significantly improves relevance.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Offensive suggestions:</b> Autocomplete must NOT suggest harmful, offensive, or legally risky terms. Filter at trie construction time (remove from suggestion lists) and at query time (blocklist check). Construction-time filtering is preferred — bad suggestions never reach the serving layer. Use an ML classifier for borderline cases.</div><div class="learn-warn"><b>Typo sensitivity:</b> User types "amazn" but means "amazon." The trie has no path for "amazn." Solutions: (1) Pre-compute common misspellings as aliases pointing to correct nodes. (2) Edit-distance search (expensive in a trie — generates many candidates). (3) N-gram index for fuzzy matching. Trade-off: typo tolerance adds 10-20ms latency.</div><div class="learn-warn"><b>Cold start for new topics:</b> A major event happens (e.g., earthquake). Users search for it but the weekly trie rebuild hasn\'t captured it yet. Solution: the trending overlay (Redis, updated every minute from streaming analytics) catches new topics within 1-5 minutes. Trending results are merged with static trie results at query time.</div><p class="learn-p"><b>Query amplification:</b> Each keystroke generates a request. A user typing a 20-character query sends ~20 requests (less with debouncing). At 10B searches/day, autocomplete handles 5-10x more requests than the search itself. Debouncing (100ms) reduces this by ~60%, but it\'s still the highest-QPS endpoint.</p><p class="learn-p"><b>Language and locale:</b> Autocomplete for Chinese/Japanese requires character-level tokenization (not just prefix matching). Korean has syllable composition. Multi-language support requires per-language tries or a shared trie with language tags.</p></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Prefix Length</th><th>Unique Prefixes</th><th>Cache Hit Rate</th><th>Cache Strategy</th></tr><tr><td>1 char</td><td>62</td><td>~99%</td><td>Edge CDN, long TTL (1 hour)</td></tr><tr><td>2 chars</td><td>3,844</td><td>~95%</td><td>Edge CDN, medium TTL (30 min)</td></tr><tr><td>3 chars</td><td>~238K</td><td>~80%</td><td>Application cache, medium TTL</td></tr><tr><td>4 chars</td><td>~14.8M</td><td>~50%</td><td>Short TTL or no cache</td></tr><tr><td>5+ chars</td><td>Long tail</td><td>&lt;20%</td><td>No cache (trie lookup is fast)</td></tr></table><table class="learn-table"><tr><th>Operation</th><th>Trie</th><th>Elasticsearch</th><th>SQL LIKE</th></tr><tr><td>Prefix search</td><td><span class="learn-complexity">O(prefix_len) — microseconds</span></td><td><span class="learn-complexity">O(log n) — milliseconds</span></td><td><span class="learn-complexity">O(n) — slow</span></td></tr><tr><td>Top-K at prefix</td><td><span class="learn-complexity">O(1) — pre-computed</span></td><td><span class="learn-complexity">O(k * log n)</span></td><td><span class="learn-complexity">O(n * log k)</span></td></tr><tr><td>Update frequency</td><td>Weekly rebuild</td><td>Near real-time</td><td>Real-time</td></tr><tr><td>Fuzzy matching</td><td>Hard (need extensions)</td><td>Built-in</td><td>Not supported</td></tr><tr><td>Memory</td><td>50-200 GB (in-memory)</td><td>Moderate (disk-based)</td><td>Low</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Why store top-K at each trie node instead of searching the subtree?</b><br/>Searching the subtree for "s" requires visiting all ~15M nodes under "s" — O(subtree_size). Pre-computing top-K makes it O(prefix_length) lookup + O(1) result retrieval. The trade-off is memory: storing top-5 at each of 500M nodes costs ~40GB, but query latency drops from seconds to microseconds.</p><p class="learn-p"><b>Q2: How do you handle trending topics that appear between weekly trie rebuilds?</b><br/>Overlay approach: (1) Streaming analytics (Kafka → Flink) aggregate query frequencies in 1-minute windows. (2) Queries exceeding a threshold are written to a Redis sorted set per prefix. (3) At query time, merge static trie results with Redis trending results. (4) De-duplicate and re-rank. New topics appear within 1-5 minutes.</p><p class="learn-p"><b>Q3: How do you shard the trie across multiple machines?</b><br/>Range-based sharding by prefix. Start with first-character ranges. Monitor load per shard. If shard "s" is overloaded, split into "sa-sm" and "sn-sz." The routing layer (a lightweight lookup table) maps prefixes to shard IDs. Update the routing table atomically when splitting.</p><p class="learn-p"><b>Q4: Why debounce autocomplete requests on the client?</b><br/>Without debouncing, a user typing "system" at 5 chars/sec generates 6 requests in 1.2 seconds. With 100ms debounce, only 2-3 requests are sent (triggered during typing pauses). This reduces server QPS by ~60% and prevents wasted work for intermediate prefixes the user typed through.</p><p class="learn-p"><b>Q5: How would you add typo tolerance?</b><br/>Pre-compute common misspellings offline: for each popular term, generate edit-distance-1 variants and store as aliases in the trie. At query time, if the exact prefix has no results, check aliases. This keeps latency under 50ms. For real-time fuzzy matching, use an n-gram index (break terms into bigrams) but this adds 10-20ms.</p><p class="learn-p"><b>Q6: How does personalization work without adding too much latency?</b><br/>Store per-user recent searches in Redis (last 100 entries, ~1KB per user). At query time, fetch the user\'s history (1ms Redis lookup), boost matching suggestions by 2x, and re-rank. Total added latency: ~3-5ms. For cold-start users (no history), fall back to global popularity only.</p></div>',
    code: `// === Search Autocomplete System ===

// 1. Trie with pre-computed top-K at each node
class TrieNode {
  constructor() {
    this.children = {};
    this.topK = [];  // pre-computed top 5 suggestions [{word, freq}]
  }
}

class AutocompleteTrie {
  constructor() { this.root = new TrieNode(); }

  insert(word, frequency) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
      this.updateTopK(node, word, frequency);
    }
  }

  updateTopK(node, word, freq) {
    const existing = node.topK.find(e => e.word === word);
    if (existing) { existing.freq = freq; }
    else { node.topK.push({ word, freq }); }
    node.topK.sort((a, b) => b.freq - a.freq);
    if (node.topK.length > 5) node.topK.pop();
  }

  search(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }
    return node.topK;  // O(1) after O(prefix_length) traversal
  }
}

// 2. Client-side debouncing (critical for reducing QPS)
let debounceTimer;
searchInput.addEventListener('keyup', (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const prefix = searchInput.value.trim();
    if (prefix.length < 1) return;  // don't query empty prefix
    const res = await fetch(\`/autocomplete?q=\${encodeURIComponent(prefix)}\`);
    const suggestions = await res.json();
    renderSuggestions(suggestions);
  }, 100);  // 100ms debounce — reduces requests by ~60%
});

// 3. Server-side handler: trie + trending + cache + filter
async function autocomplete(prefix) {
  // L1: Check CDN/edge cache (handles 1-2 char prefixes with 99% hit rate)
  // L2: Check application cache
  const cached = await redis.get(\`ac:\${prefix}\`);
  if (cached) return JSON.parse(cached);

  // Query static trie
  const staticResults = trie.search(prefix);

  // Merge with trending results (updated every minute from streaming)
  const trendingResults = await redis.zrevrange(\`trending:\${prefix}\`, 0, 4);

  // Merge, deduplicate, re-rank
  const merged = mergeAndRank(staticResults, trendingResults);

  // Filter offensive content (blocklist + ML classifier)
  const filtered = merged.filter(s => !blocklist.has(s.word));

  // Tiered caching: short prefixes get long TTL
  const ttl = prefix.length <= 2 ? 3600 : prefix.length <= 4 ? 300 : 60;
  await redis.setex(\`ac:\${prefix}\`, ttl, JSON.stringify(filtered));

  return filtered.slice(0, 5);
}

// 4. Personalized re-ranking
async function personalizedAutocomplete(userId, prefix) {
  const suggestions = await autocomplete(prefix);

  // Load user's recent search history
  const history = await redis.lrange(\`search_history:\${userId}\`, 0, 99);
  const historySet = new Set(history);

  // Boost suggestions that match user's history
  return suggestions.map(s => ({
    ...s,
    score: s.score * (historySet.has(s.word) ? 2.0 : 1.0)
  })).sort((a, b) => b.score - a.score);
}

// 5. Data collection pipeline
// Kafka consumer processes search logs in real-time
kafkaConsumer.on('search_event', (event) => {
  const query = normalize(event.query);  // lowercase, trim
  // Increment global frequency counter
  redis.zincrby('query_frequencies', 1, query);
  // Update trending (1-minute sliding window)
  const bucket = Math.floor(Date.now() / 60000);
  redis.zincrby(\`trending_bucket:\${bucket}\`, 1, query);
  // Expire old buckets
  redis.expire(\`trending_bucket:\${bucket}\`, 600); // 10 min
});

// 6. Update trending prefixes (every minute)
async function updateTrending() {
  const recentBuckets = getRecentBuckets(5); // last 5 minutes
  const merged = await mergeFrequencies(recentBuckets);
  for (const { query, freq } of merged) {
    if (freq > TRENDING_THRESHOLD) {
      // Store trending result under each prefix of the query
      for (let i = 1; i <= query.length; i++) {
        const prefix = query.slice(0, i);
        await redis.zadd(\`trending:\${prefix}\`, freq, query);
        await redis.zremrangebyrank(\`trending:\${prefix}\`, 0, -6); // keep top 5
      }
    }
  }
}

// 7. Weekly trie rebuild (batch job via Spark)
async function rebuildTrie() {
  const trie = new AutocompleteTrie();
  // Top 10M queries from frequency store
  const topQueries = await redis.zrevrange('query_frequencies', 0, 10_000_000, 'WITHSCORES');
  for (const { word, freq } of topQueries) {
    if (freq > MIN_THRESHOLD && !blocklist.has(word)) {
      trie.insert(word, freq);
    }
  }
  // Blue-green deploy: build new, atomically swap
  atomicSwap(servingTrie, trie);
}`,
    problems: [
      ["Search Autocomplete — ByteByteGo Course", "https://bytebytego.com/courses/system-design-interview/design-a-search-autocomplete-system", "Hard"]
    ],
    mcqs: [
      {"q": "Storing top-K results at each trie node optimizes:", "o": ["Memory usage", "Insertion speed", "Query speed (O(prefix_length) instead of full subtree scan)", "Deletion of outdated suggestions"], "a": 2},
      {"q": "Sharding a trie by first character results in:", "o": ["Perfectly balanced shards", "Severely imbalanced shards due to letter frequency", "Inability to do prefix matching", "Higher memory usage"], "a": 1},
      {"q": "Why is debouncing (100ms delay) used for autocomplete requests?", "o": ["To reduce server load by not sending a request on every keystroke", "To improve suggestion accuracy", "Because the trie lookup takes 100ms", "To encrypt the query"], "a": 0},
      {"q": "For prefix length 1-2, the cache hit rate is approximately:", "o": ["20%", "50%", "80%", "95-99%"], "a": 3},
      {"q": "The trending overlay approach adds new topics to autocomplete within:", "o": ["Seconds", "1-5 minutes", "1 hour", "1 week (next rebuild)"], "a": 1},
      {"q": "Pre-computing common misspellings as trie aliases helps with:", "o": ["Caching efficiency", "Typo tolerance without runtime edit-distance computation", "Memory reduction", "Trending topic detection"], "a": 1},
      {"q": "A trie for 100M terms with top-5 per node requires approximately:", "o": ["1 GB", "10 GB", "50-200 GB", "1 TB"], "a": 2},
            {"q": "A Trie node for autocomplete stores children in a hash map rather than a fixed array because:", "o": ["Hash maps are always faster", "It saves memory when the character set is large (Unicode) and most children are null", "Hash maps support sorting", "Fixed arrays cannot store strings"], "a": 1}]
  },
  {
    t: "Design Stock Trading / Order Matching Engine",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">The order matching engine is the <b>heart of any stock exchange</b>. It is the single most performance-critical component in financial infrastructure — matching buy and sell orders in <b>microseconds</b> while guaranteeing correctness, fairness, and auditability. This topic is <b>directly relevant to interviews at quantitative trading firms</b>. Such firms operate high-frequency trading systems where nanosecond-level latency advantages translate to millions in profit.</p><p class="learn-p"><b>Scale target:</b> 100K orders/sec per symbol, &lt;10 microsecond matching latency (hot path), &lt;1ms end-to-end gateway-to-acknowledgment, 10,000+ symbols traded concurrently, zero data loss (every order and trade must be persisted), deterministic replay from event log.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">An order matching engine maintains an <b>order book</b> for each security — a collection of outstanding buy orders (bids) and sell orders (asks). When a new order arrives, the engine attempts to match it against existing orders on the opposite side. The most common matching policy is <b>price-time priority</b>: best price first, then earliest order at that price.</p><div class="learn-code">         Order Book for AAPL\n\n   Bids (Buy)                  Asks (Sell)\n   ──────────                  ──────────\n   Price    Qty   Time         Price    Qty   Time\n   $150.10  200   09:30:01     $150.15  100   09:30:00\n   $150.05  500   09:30:02     $150.20  300   09:30:01\n   $150.00  100   09:29:55     $150.25  200   09:30:03\n        ↑ Best Bid                  ↑ Best Ask\n        Spread = $150.15 - $150.10 = $0.05\n\n   Match occurs when: incoming_buy_price &gt;= best_ask_price\n                   or: incoming_sell_price &lt;= best_bid_price\n\n   Incoming: BUY 300 @ $150.20 (limit order)\n   → Matches 100 @ $150.15 (fills entire ask at $150.15)\n   → Matches 200 @ $150.20 (partial fill of ask at $150.20)\n   → Fully filled. Two trades generated.</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>API / Message Protocol:</b></p><div class="learn-code">Order submission (FIX protocol or binary):\n  { order_id, symbol, side (BUY/SELL), type (LIMIT/MARKET/STOP),\n    price, quantity, time_in_force (GTC/IOC/FOK), client_id }\n\nOrder acknowledgment:\n  { order_id, status (ACCEPTED/REJECTED), timestamp, seq_num }\n\nExecution report (trade):\n  { trade_id, buy_order_id, sell_order_id, price, quantity, timestamp }\n\nMarket data feed (multicast UDP):\n  { symbol, best_bid, best_ask, last_trade_price, volume }</div><table class="learn-table"><tr><th>Component</th><th>Purpose</th><th>Industry Relevance</th></tr><tr><td>Gateway</td><td>Accept orders, validate, assign sequence numbers</td><td>Kernel bypass (DPDK) for &lt;1μs network latency</td></tr><tr><td>Sequencer</td><td>Total ordering of all events (deterministic replay)</td><td>Critical for regulatory audit and backtesting</td></tr><tr><td>Matching Engine</td><td>Price-time priority matching per symbol</td><td>Lock-free data structures, zero allocation on hot path</td></tr><tr><td>Risk Engine</td><td>Pre-trade risk checks (margin, position limits)</td><td>Must not add &gt;1μs to the hot path</td></tr><tr><td>Market Data</td><td>Broadcast order book changes to subscribers</td><td>Multicast UDP for lowest latency</td></tr><tr><td>Trade Store</td><td>Persistent log of all orders and trades</td><td>Event sourcing for replay and audit</td></tr></table><p class="learn-p"><b>Data Structures:</b></p><table class="learn-table"><tr><th>Structure</th><th>Purpose</th><th>Complexity</th></tr><tr><td>Sorted Map (std::map, red-black tree)</td><td>Price levels: bids (descending), asks (ascending)</td><td><span class="learn-complexity">O(log P) insert/delete where P = price levels</span></td></tr><tr><td>FIFO Queue per price level</td><td>Time priority: oldest order at each price matched first</td><td><span class="learn-complexity">O(1) enqueue/dequeue</span></td></tr><tr><td>HashMap (order_id → Order*)</td><td><span class="learn-complexity">O(1) cancel/modify by order ID</span></td><td><span class="learn-complexity">O(1) lookup</span></td></tr><tr><td>Memory pool (pre-allocated)</td><td>Avoid malloc/new on hot path</td><td><span class="learn-complexity">O(1) allocate/free</span></td></tr></table></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>Trace: BUY 300 AAPL @ $150.20 (limit order) arrives:</b></p><ol class="learn-list"><li><b>Gateway</b> receives the order over TCP (or kernel-bypass DPDK). Validates fields, assigns global sequence number #98765.</li><li><b>Risk Engine</b> checks: Does client have sufficient margin? Is position limit exceeded? Check takes &lt;500ns using pre-cached client state.</li><li><b>Sequencer</b> logs the order to the event journal (append-only, sequential write). This enables deterministic replay.</li><li><b>Matching Engine</b> receives the order. Looks up AAPL order book.</li><li><b>Check asks</b>: Best ask = $150.15 × 100 shares. Buy price $150.20 &gt;= ask price $150.15 → <b>MATCH</b>.</li><li><b>Trade 1</b>: Execute 100 shares @ $150.15. Remove the ask order (fully filled). Buyer gets the better price (price improvement).</li><li><b>Remaining</b>: 200 shares still to fill. Next ask = $150.20 × 300 shares. Buy price $150.20 &gt;= $150.20 → <b>MATCH</b>.</li><li><b>Trade 2</b>: Execute 200 shares @ $150.20. Ask order partially filled (100 remaining).</li><li><b>Order fully filled</b> (0 remaining). Do NOT add to bid side.</li><li><b>Publish</b>: Two execution reports (trades) to both buyer and seller. Update market data feed (new best ask, trade price, volume).</li><li><b>Total matching time</b>: ~2-5 microseconds on optimized hardware.</li></ol></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Order Type</th><th>Behavior</th><th>Implementation</th></tr><tr><td>Limit Order</td><td>Buy/sell at specific price or better</td><td>Match if crosses spread, else add to book</td></tr><tr><td>Market Order</td><td>Execute immediately at best available price</td><td>Match against best opposite side, no price check</td></tr><tr><td>Stop Order</td><td>Trigger a market/limit order when price reaches threshold</td><td>Maintain a stop order list, check on each trade</td></tr><tr><td>IOC (Immediate or Cancel)</td><td>Fill whatever is available, cancel the rest</td><td>Match, then discard remaining qty (don\'t add to book)</td></tr><tr><td>FOK (Fill or Kill)</td><td>Fill entire order or cancel completely</td><td>Check total available qty before matching</td></tr><tr><td>Iceberg Order</td><td>Only show partial quantity in the book</td><td>Hidden quantity replenishes visible quantity on fill</td></tr></table><p class="learn-p"><b>Matching policies:</b></p><ul class="learn-list"><li><b>Price-Time Priority</b> (most common): Best price first, then FIFO at same price. Used by NYSE, NASDAQ.</li><li><b>Pro-Rata</b>: At the same price, allocate proportionally to order size. Used in some options/futures markets.</li><li><b>Price-Time with minimum allocation</b>: Hybrid — first order at a price gets a minimum fill, rest is pro-rata.</li></ul><p class="learn-p"><b>Common optimization techniques:</b></p><ul class="learn-list"><li><b>Lock-free data structures:</b> Use compare-and-swap (CAS) operations instead of mutexes. Eliminates context switching overhead.</li><li><b>Cache-line alignment:</b> Align Order structs to 64-byte cache lines to avoid false sharing between CPU cores.</li><li><b>Memory pools:</b> Pre-allocate Order objects. <code>new</code>/<code>malloc</code> on the hot path can take 100+ nanoseconds.</li><li><b>Kernel bypass (DPDK/Solarflare):</b> Network packets go directly to user space, bypassing the OS kernel. Reduces network latency from ~5μs to &lt;1μs.</li><li><b>CPU pinning and NUMA awareness:</b> Pin matching engine threads to specific CPU cores. Avoid cross-NUMA memory access.</li></ul></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Self-trade prevention:</b> A client\'s buy order matches their own sell order. Regulations prohibit this (wash trading). The matching engine must check if both sides belong to the same client and skip the match. This check is on the hot path and must be O(1).</div><div class="learn-warn"><b>Price improvement on market orders:</b> A market BUY order for 1000 shares arrives. Best ask has only 100 shares at $150.00, next level has 900 at $155.00. The buyer gets 100 @ $150 and 900 @ $155 — a $4,500 higher cost than expected. Solution: exchanges implement price bands (e.g., reject market orders that would move price &gt;5%).</div><div class="learn-warn"><b>Order book starvation:</b> One side of the book is empty (no bids or no asks). A market order on the empty side cannot execute. Return a rejection: "no liquidity." For limit orders, simply add to the book and wait.</div><p class="learn-p"><b>Partial fill handling:</b> An order for 1000 shares matches against 3 separate ask orders (200 + 300 + 500). Each partial fill generates a separate execution report. The order status transitions from NEW → PARTIALLY_FILLED (3 times) → FILLED. Track remaining quantity accurately to avoid overfill bugs.</p><p class="learn-p"><b>Deterministic replay:</b> For regulatory compliance and debugging, you must be able to replay the exact sequence of events and reproduce the exact same trades. This requires: (1) total ordering via the sequencer, (2) no non-deterministic operations in the matching engine (no random, no wall-clock time — use logical time), (3) event sourcing (log every order, cancel, and trade).</p><p class="learn-p"><b>Fat-finger protection:</b> A trader accidentally submits BUY 1M shares instead of 1K. Pre-trade risk checks should catch this: max order size limit, max notional value limit, price reasonability check (reject orders &gt;10% away from last trade price).</p></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>Time Complexity</th><th>Typical Latency</th></tr><tr><td>Add limit order (no match)</td><td><span class="learn-complexity">O(log P) — insert into sorted map</span></td><td>~1-2 μs</td></tr><tr><td>Match (single level)</td><td><span class="learn-complexity">O(1) — dequeue from FIFO</span></td><td>~0.5 μs</td></tr><tr><td>Match (crosses K levels)</td><td><span class="learn-complexity">O(K) — iterate price levels</span></td><td>~K * 0.5 μs</td></tr><tr><td>Cancel order</td><td><span class="learn-complexity">O(1) — HashMap lookup + mark cancelled</span></td><td>~0.5 μs</td></tr><tr><td>Best bid/ask query</td><td><span class="learn-complexity">O(1) — cached from sorted map begin()</span></td><td>&lt;0.1 μs</td></tr></table><table class="learn-table"><tr><th>Exchange</th><th>Matching Latency</th><th>Orders/sec</th><th>Technology</th></tr><tr><td>NYSE Arca</td><td>~50 μs</td><td>100K+</td><td>C++, custom hardware</td></tr><tr><td>NASDAQ</td><td>~25 μs</td><td>500K+</td><td>C++, kernel bypass</td></tr><tr><td>CME</td><td>~5 μs</td><td>1M+</td><td>FPGA-based matching</td></tr><tr><td>IEX</td><td>~350 μs (intentional)</td><td>50K</td><td>Speed bump by design</td></tr><tr><td>Quant firm (internal)</td><td>&lt;1 μs (strategy layer)</td><td>N/A</td><td>C++, lock-free, DPDK</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What data structure would you use for the order book and why?</b><br/>A <code>std::map&lt;double, queue&lt;Order*&gt;&gt;</code> (red-black tree of price levels, each containing a FIFO queue of orders). Bids use <code>greater&lt;double&gt;</code> comparator (highest price first), asks use default ascending. This gives O(log P) insert/remove where P = number of distinct price levels (typically &lt;1000), and O(1) access to best bid/ask. Add a <code>unordered_map&lt;int, Order*&gt;</code> for O(1) cancellation by order ID.</p><p class="learn-p"><b>Q2: How do you handle a market order that would move the price significantly?</b><br/>Implement <b>price bands</b> (circuit breakers). If a market order would execute at a price &gt;5% away from the last trade price, reject it or convert it to a limit order at the band boundary. This prevents flash crashes caused by fat-finger errors or algorithmic bugs.</p><p class="learn-p"><b>Q3: Why is memory allocation avoided on the hot path?</b><br/><code>malloc</code>/<code>new</code> can take 50-500 nanoseconds due to lock contention in the allocator, system calls, and page faults. For a matching engine targeting &lt;1μs, even one allocation doubles the latency. Solution: pre-allocate a memory pool of Order objects. Allocate = pop from free list (O(1)). Deallocate = push to free list (O(1)). Zero system calls.</p><p class="learn-p"><b>Q4: How do you ensure deterministic replay for regulatory audit?</b><br/>Event sourcing: log every incoming order, modification, cancellation, and outgoing trade to a sequenced journal. The matching engine is a pure function of the event stream — no external state, no randomness, no wall-clock time. Replay = read the journal and re-execute. The output must be bit-for-bit identical.</p><p class="learn-p"><b>Q5: How do you scale to 10,000 symbols?</b><br/>One matching engine instance per symbol (or per group of low-volume symbols). Each instance runs on a dedicated CPU core (pinned). Symbols are independent — no coordination needed between matching engines. The gateway routes orders to the correct engine by symbol. With 32-core servers, one server handles 32 symbols. 10K symbols need ~300 servers.</p><p class="learn-p"><b>Q6: What is the difference between price-time priority and pro-rata matching?</b><br/>Price-time: at the same price, the oldest order gets filled first (FIFO). Rewards being early. Pro-rata: at the same price, all orders get filled proportionally to their size. Rewards showing large size. Price-time is used in most equity exchanges; pro-rata is common in options/futures (encourages liquidity display).</p><p class="learn-p"><b>Q7: How does a quant firm\'s trading infrastructure differ from a public exchange?</b><br/>A quant firm operates as a <b>market participant</b>, not an exchange. Its focus is on (1) strategy-layer latency (signal generation → order decision in &lt;1μs), (2) smart order routing across multiple exchanges, (3) co-location (servers physically next to exchange matching engines), and (4) market data processing (parsing multicast UDP feeds in nanoseconds). The matching engine interview question tests whether you understand the exchange side, which is prerequisite knowledge for building trading systems.</p></div>',
    code: `// ===== Stock Trading Order Matching Engine =====
#include <iostream>
#include <map>
#include <queue>
#include <unordered_map>
#include <vector>
#include <string>
#include <chrono>
using namespace std;

enum class Side { BUY, SELL };
enum class OrderType { LIMIT, MARKET, IOC, FOK };
enum class OrderStatus { NEW, PARTIALLY_FILLED, FILLED, CANCELLED };

struct Order {
    int id;
    string symbol;
    Side side;
    OrderType type;
    double price;
    int quantity;
    int remaining;
    int clientId;           // for self-trade prevention
    long long timestamp;
    OrderStatus status;

    Order(int id, string sym, Side s, OrderType t, double p, int q,
          int cid, long long ts)
        : id(id), symbol(sym), side(s), type(t), price(p),
          quantity(q), remaining(q), clientId(cid), timestamp(ts),
          status(OrderStatus::NEW) {}
};

struct Trade {
    int tradeId;
    int buyOrderId, sellOrderId;
    double price;
    int quantity;
    long long timestamp;
};

class OrderBook {
    // Bids: highest price first (descending) — use greater<double>
    map<double, queue<Order*>, greater<double>> bids;
    // Asks: lowest price first (ascending) — default ordering
    map<double, queue<Order*>> asks;
    // O(1) order lookup for cancellations
    unordered_map<int, Order*> orderMap;
    vector<Trade> trades;
    int nextTradeId = 1;

public:
    void addOrder(Order* order) {
        orderMap[order->id] = order;

        if (order->side == Side::BUY) {
            matchBuy(order);
            // Add remaining to book (unless MARKET or IOC)
            if (order->remaining > 0 &&
                order->type == OrderType::LIMIT) {
                bids[order->price].push(order);
                order->status = order->remaining < order->quantity
                    ? OrderStatus::PARTIALLY_FILLED
                    : OrderStatus::NEW;
            }
        } else {
            matchSell(order);
            if (order->remaining > 0 &&
                order->type == OrderType::LIMIT) {
                asks[order->price].push(order);
                order->status = order->remaining < order->quantity
                    ? OrderStatus::PARTIALLY_FILLED
                    : OrderStatus::NEW;
            }
        }
    }

    void matchBuy(Order* buy) {
        while (buy->remaining > 0 && !asks.empty()) {
            auto it = asks.begin();  // lowest ask price
            // Limit order: only match if buy price >= ask price
            if (buy->type == OrderType::LIMIT &&
                it->first > buy->price) break;

            auto& q = it->second;
            Order* sell = q.front();

            // Self-trade prevention
            if (buy->clientId == sell->clientId) {
                q.pop();
                if (q.empty()) asks.erase(it);
                continue;
            }

            int matched = min(buy->remaining, sell->remaining);
            double tradePrice = it->first;  // passive order's price

            trades.push_back({nextTradeId++, buy->id, sell->id,
                              tradePrice, matched,
                              chrono::duration_cast<chrono::microseconds>(
                                chrono::steady_clock::now().time_since_epoch()
                              ).count()});

            cout << "TRADE: " << matched << " shares @ $"
                 << tradePrice << " (Buy#" << buy->id
                 << " x Sell#" << sell->id << ")" << endl;

            buy->remaining -= matched;
            sell->remaining -= matched;

            if (sell->remaining == 0) {
                sell->status = OrderStatus::FILLED;
                q.pop();
                orderMap.erase(sell->id);
            } else {
                sell->status = OrderStatus::PARTIALLY_FILLED;
            }
            if (q.empty()) asks.erase(it);
        }
        if (buy->remaining == 0) buy->status = OrderStatus::FILLED;
    }

    void matchSell(Order* sell) {
        while (sell->remaining > 0 && !bids.empty()) {
            auto it = bids.begin();  // highest bid price
            if (sell->type == OrderType::LIMIT &&
                it->first < sell->price) break;

            auto& q = it->second;
            Order* buy = q.front();

            // Self-trade prevention
            if (sell->clientId == buy->clientId) {
                q.pop();
                if (q.empty()) bids.erase(it);
                continue;
            }

            int matched = min(sell->remaining, buy->remaining);
            double tradePrice = it->first;

            trades.push_back({nextTradeId++, buy->id, sell->id,
                              tradePrice, matched, 0});

            cout << "TRADE: " << matched << " shares @ $"
                 << tradePrice << endl;

            sell->remaining -= matched;
            buy->remaining -= matched;

            if (buy->remaining == 0) {
                buy->status = OrderStatus::FILLED;
                q.pop();
                orderMap.erase(buy->id);
            }
            if (q.empty()) bids.erase(it);
        }
        if (sell->remaining == 0) sell->status = OrderStatus::FILLED;
    }

    bool cancelOrder(int orderId) {
        auto it = orderMap.find(orderId);
        if (it == orderMap.end()) return false;
        it->second->remaining = 0;
        it->second->status = OrderStatus::CANCELLED;
        orderMap.erase(it);
        cout << "CANCELLED order " << orderId << endl;
        return true;
    }

    pair<double, double> getBBO() const {  // Best Bid & Offer
        double bestBid = bids.empty() ? 0 : bids.begin()->first;
        double bestAsk = asks.empty() ? 0 : asks.begin()->first;
        return {bestBid, bestAsk};
    }

    void printBook() const {
        cout << "\\n=== ORDER BOOK ===" << endl;
        cout << "ASKS (sell side):" << endl;
        for (auto it = asks.rbegin(); it != asks.rend(); ++it)
            cout << "  $" << it->first << " x "
                 << it->second.front()->remaining << " shares" << endl;
        cout << "------- spread -------" << endl;
        cout << "BIDS (buy side):" << endl;
        for (auto& [price, q] : bids)
            cout << "  $" << price << " x "
                 << q.front()->remaining << " shares" << endl;
        auto [bid, ask] = getBBO();
        cout << "BBO: $" << bid << " / $" << ask
             << " (spread: $" << (ask - bid) << ")" << endl;
    }
};

int main() {
    OrderBook book;
    long long ts = 1;

    // Build initial order book
    auto* o1 = new Order(1, "AAPL", Side::SELL, OrderType::LIMIT,
                          150.15, 100, 10, ts++);
    auto* o2 = new Order(2, "AAPL", Side::SELL, OrderType::LIMIT,
                          150.20, 300, 11, ts++);
    auto* o3 = new Order(3, "AAPL", Side::BUY, OrderType::LIMIT,
                          150.10, 200, 12, ts++);
    book.addOrder(o1);
    book.addOrder(o2);
    book.addOrder(o3);
    book.printBook();

    // Incoming buy that crosses the spread
    cout << "\\n--- Incoming BUY 300 @ $150.20 ---" << endl;
    auto* o4 = new Order(4, "AAPL", Side::BUY, OrderType::LIMIT,
                          150.20, 300, 13, ts++);
    book.addOrder(o4);  // matches 100@150.15 + 200@150.20
    book.printBook();

    // Cancel remaining order
    book.cancelOrder(3);

    return 0;
}`,
    problems: [
      ["Stock Price Fluctuation", "https://leetcode.com/problems/stock-price-fluctuation/", "Medium"],
      ["Time Based Key-Value Store", "https://leetcode.com/problems/time-based-key-value-store/", "Medium"],
      ["Stock Exchange System Design — ByteByteGo", "https://bytebytego.com/courses/system-design-interview/stock-exchange", "Hard"]
    ],
    mcqs: [
      {"q": "In price-time priority matching, orders at the same price are matched:", "o": ["Randomly", "Largest first", "FIFO (oldest first)", "LIFO (newest first)"], "a": 2},
      {"q": "The bid side of an order book is organized as:", "o": ["Min-heap (lowest price first)", "Max-heap / descending sorted map (highest price first)", "FIFO queue", "Hash map"], "a": 1},
      {"q": "A market order differs from a limit order because:", "o": ["It has no price constraint — executes at the best available price", "It can only buy, not sell", "It is always partially filled", "It stays in the order book indefinitely"], "a": 0},
      {"q": "Why is memory allocation (malloc/new) avoided on the matching engine hot path?", "o": ["It uses too much memory", "Allocator lock contention and system calls add 50-500ns latency", "It causes memory leaks", "The compiler doesn't support it"], "a": 1},
      {"q": "Self-trade prevention is required because:", "o": ["It improves matching speed", "Regulatory rules prohibit wash trading (matching your own orders)", "It reduces memory usage", "Market orders can't self-trade"], "a": 1},
      {"q": "For deterministic replay of all trades, the matching engine must:", "o": ["Use wall-clock timestamps", "Log every event to a sequenced journal and avoid non-deterministic operations", "Store all data in a relational database", "Use random order IDs"], "a": 1},
      {"q": "An IOC (Immediate or Cancel) order:", "o": ["Stays in the book until filled", "Fills what it can immediately, then the remainder is cancelled", "Must be fully filled or entirely cancelled", "Is only valid for market orders"], "a": 1},
      {"q": "Kernel bypass (DPDK) reduces network latency by:", "o": ["Compressing packets", "Sending packets directly to user space without OS kernel involvement", "Using faster network cables", "Encrypting traffic"], "a": 1}
    ]
  },
  {
    t: "Design Payment System",
    learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Payment systems process trillions of dollars annually. Stripe handles $1T+ in payment volume, Visa processes 65,000 transactions/sec at peak. A payment system must guarantee that money is never lost, never double-charged, and every transaction is auditable. Unlike most systems where a bug causes a bad user experience, a payment bug causes <b>real financial loss</b>. This makes payment system design one of the most demanding interview topics — testing your understanding of idempotency, distributed transactions, state machines, and financial accounting principles.</p><p class="learn-p"><b>Scale target:</b> 10,000 transactions/sec, &lt;2s payment processing latency (end-to-end), 99.999% uptime (5 nines — 5 min downtime/year), zero duplicate charges, daily reconciliation accuracy of 100%.</p></div><div class="learn-section"><div class="learn-h">Core Concept</div><p class="learn-p">A payment system orchestrates the flow of money from a payer to a payee through intermediaries (card networks, banks). The critical challenge is ensuring <b>exactly-once processing</b> in a distributed system where network failures, timeouts, and retries are inevitable.</p><div class="learn-code">    ┌──────────┐   POST /pay     ┌──────────────┐\n    │  Client  │ ──────────────▶ │Payment Service│\n    │(browser) │   Idempotency   │              │\n    └──────────┘   Key: abc-123  │ 1. Dedup     │\n                                 │ 2. Validate  │\n                                 │ 3. Risk check│\n                                 └──────┬───────┘\n                                        │\n                                 ┌──────▼───────┐\n                                 │Payment Gateway│\n                                 │(Stripe/Adyen) │\n                                 └──────┬───────┘\n                                        │\n                          ┌─────────────▼──────────────┐\n                          │       Card Network          │\n                          │   (Visa / Mastercard)       │\n                          └─────────────┬──────────────┘\n                                        │\n                                 ┌──────▼───────┐\n                                 │ Issuing Bank  │\n                                 │ (approve/deny)│\n                                 └──────────────┘</div></div><div class="learn-section"><div class="learn-h">Building Blocks</div><p class="learn-p"><b>API Design:</b></p><div class="learn-code">POST /api/v1/payments\n  Headers: Idempotency-Key: "abc-123-def"\n  Request: {\n    amount: 9999,        // in cents ($99.99)\n    currency: "USD",\n    payment_method: { type: "card", token: "tok_visa_4242" },\n    description: "Order #12345",\n    metadata: { order_id: "12345", customer_id: "cust_42" }\n  }\n  Response: { payment_id, status: "succeeded"|"failed"|"pending", receipt_url }\n\nPOST /api/v1/refunds\n  Request: { payment_id, amount (partial refund), reason }\n  Response: { refund_id, status, amount_refunded }\n\nGET /api/v1/payments/{id}\n  Response: { payment_id, status, amount, created_at, events: [...] }</div><table class="learn-table"><tr><th>Component</th><th>Technology</th><th>Purpose</th></tr><tr><td>Payment Service</td><td>Java/Go microservice</td><td>Orchestration, idempotency, state machine</td></tr><tr><td>Idempotency Store</td><td>PostgreSQL (UNIQUE constraint)</td><td>Prevent duplicate charges</td></tr><tr><td>Ledger Service</td><td>PostgreSQL (ACID transactions)</td><td>Double-entry bookkeeping</td></tr><tr><td>Payment Gateway Adapter</td><td>Strategy pattern</td><td>Abstract Stripe/Adyen/PayPal</td></tr><tr><td>Risk Engine</td><td>ML model + rules</td><td>Fraud detection, velocity checks</td></tr><tr><td>Reconciliation Worker</td><td>Daily batch job</td><td>Compare internal records vs gateway records</td></tr><tr><td>Notification Service</td><td>Kafka → Email/SMS</td><td>Receipts, failure alerts</td></tr><tr><td>Audit Log</td><td>Append-only store</td><td>Regulatory compliance (PCI DSS)</td></tr></table><p class="learn-p"><b>Data Model:</b></p><div class="learn-code">Table: payments\n  id                UUID PRIMARY KEY\n  idempotency_key   VARCHAR(255) UNIQUE  -- critical!\n  amount            BIGINT               -- cents (avoid float!)\n  currency          VARCHAR(3)\n  status            ENUM(PENDING, PROCESSING, SUCCEEDED, FAILED, REFUNDED)\n  payment_method    JSONB\n  gateway_txn_id    VARCHAR(255)\n  created_at        TIMESTAMP\n  updated_at        TIMESTAMP\n\nTable: ledger_entries (append-only, never update/delete)\n  id          UUID PRIMARY KEY\n  payment_id  UUID REFERENCES payments\n  account     VARCHAR(100)   -- e.g., "user_wallet", "merchant_wallet"\n  entry_type  ENUM(DEBIT, CREDIT)\n  amount      BIGINT         -- always positive\n  created_at  TIMESTAMP\n  -- INVARIANT: SUM(credits) == SUM(debits) always\n\nTable: payment_events (event sourcing)\n  id          UUID PRIMARY KEY\n  payment_id  UUID REFERENCES payments\n  event_type  VARCHAR(50)   -- CREATED, AUTHORIZED, CAPTURED, FAILED, REFUNDED\n  data        JSONB\n  created_at  TIMESTAMP</div></div><div class="learn-section"><div class="learn-h">Working Through It</div><p class="learn-p"><b>Trace: User pays $99.99 for Order #12345:</b></p><ol class="learn-list"><li><b>Client</b> generates idempotency key "idem_abc123" and sends POST /payments with amount=9999 (cents), token=tok_visa_4242.</li><li><b>Payment Service</b> checks idempotency: <code>SELECT * FROM payments WHERE idempotency_key = \'idem_abc123\'</code>. Not found → new payment.</li><li><b>Create payment record</b>: INSERT with status=PENDING. The idempotency_key UNIQUE constraint prevents duplicates at the DB level.</li><li><b>Risk Engine</b> checks: Is this card known for fraud? Is the velocity suspicious (&gt;10 transactions in 1 minute)? Amount within normal range? → PASS.</li><li><b>Call Payment Gateway</b> (Stripe): POST /v1/charges with the card token. Stripe contacts Visa network → Visa contacts issuing bank → bank checks balance and approves.</li><li><b>Gateway responds</b>: {success: true, txn_id: "ch_stripe_789"}.</li><li><b>Update payment</b>: status=SUCCEEDED, gateway_txn_id="ch_stripe_789".</li><li><b>Create ledger entries</b> (in a DB transaction with the status update):<br/>DEBIT user_wallet $99.99, CREDIT merchant_wallet $99.99.</li><li><b>Emit event</b> to Kafka: {type: "payment.succeeded", payment_id, amount}.</li><li><b>Notification worker</b> sends email receipt to user.</li><li><b>Return</b> to client: {payment_id: "pay_42", status: "succeeded"}.</li></ol><p class="learn-p"><b>If the network times out at step 6</b> (gateway call): We don\'t know if Stripe charged the card or not. We set status=UNKNOWN. A reconciliation job checks with Stripe\'s API later. If Stripe confirms the charge succeeded, update to SUCCEEDED. If not, update to FAILED. This is why idempotency is critical — the client can safely retry, and the idempotency key ensures no duplicate charge.</p></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><p class="learn-p"><b>Payment state machine:</b></p><div class="learn-code">                    ┌──────────┐\n                    │  PENDING  │\n                    └────┬─────┘\n                         │ risk check passed\n                    ┌────▼─────┐\n               ┌────│PROCESSING│────┐\n               │    └──────────┘    │\n          success              failure/timeout\n               │                    │\n          ┌────▼─────┐       ┌──────▼───┐\n          │SUCCEEDED │       │  FAILED   │──── retry ───▶ PROCESSING\n          └────┬─────┘       └──────────┘          (max 3 retries)\n               │                    │\n          refund request       ABANDONED\n               │               (after 3 retries)\n          ┌────▼──────────┐\n          │REFUND_PENDING │\n          └────┬──────────┘\n               │\n          ┌────▼─────┐\n          │ REFUNDED  │\n          └──────────┘</div><table class="learn-table"><tr><th>Pattern</th><th>Description</th><th>When to Use</th></tr><tr><td>Idempotency Key</td><td>Client-generated UUID, UNIQUE in DB</td><td>Every payment API (non-negotiable)</td></tr><tr><td>Double-Entry Ledger</td><td>Every transaction has balanced DEBIT + CREDIT</td><td>All financial record-keeping</td></tr><tr><td>Saga Pattern</td><td>Sequence of local transactions with compensating actions</td><td>Distributed transactions (order + payment + inventory)</td></tr><tr><td>Strategy Pattern</td><td>Swap payment gateways (Stripe ↔ Adyen) without changing logic</td><td>Multi-gateway support, failover</td></tr><tr><td>Event Sourcing</td><td>Log every state change as an immutable event</td><td>Audit trail, debugging, replay</td></tr><tr><td>Two-Phase Capture</td><td>Authorize first, capture later (hotel bookings)</td><td>When final amount is unknown at auth time</td></tr></table><p class="learn-p"><b>Saga pattern for distributed transactions:</b> When a purchase involves multiple services (order service, payment service, inventory service), use a saga. Each step has a compensating action: if payment succeeds but inventory reservation fails, issue a refund (compensation). Orchestrator-based sagas are easier to reason about than choreography-based.</p><p class="learn-p"><b>Webhooks (Async PSP Notifications):</b> Payment gateways like Stripe and Adyen send <b>webhooks</b> (HTTP POST callbacks) to your server when payment events occur asynchronously (e.g., charge.succeeded, charge.failed, dispute.created). This is critical for handling gateway timeout scenarios: instead of relying solely on reconciliation, the webhook delivers the result within seconds. Key design rules: (1) <b>Verify the signature</b> — Stripe signs webhooks with HMAC-SHA256; reject unverified payloads to prevent spoofing. (2) <b>Process idempotently</b> — the same webhook may be delivered multiple times; use the event ID to deduplicate. (3) <b>Handle out-of-order delivery</b> — a charge.refunded webhook might arrive before charge.succeeded due to network delays; use the payment state machine to reject invalid transitions. (4) <b>Return 200 quickly</b> — acknowledge receipt within 5 seconds and process asynchronously via a queue; gateways retry on timeout. (5) <b>Dead letter queue</b> — if webhook processing fails repeatedly, route to a DLQ for manual investigation rather than losing the event.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><div class="learn-warn"><b>Floating-point money:</b> Never store money as <code>float</code> or <code>double</code>. <code>0.1 + 0.2 = 0.30000000000000004</code> in IEEE 754. Use <b>integer cents</b> (BIGINT): $99.99 = 9999 cents. Or use <code>DECIMAL(19,4)</code> in SQL. This is a classic bug that causes real financial discrepancies.</div><div class="learn-warn"><b>Partial refund race condition:</b> User requests two partial refunds of $30 simultaneously on a $50 payment. Without locking, both might succeed, refunding $60 on a $50 charge. Solution: use SELECT FOR UPDATE (row-level lock) on the payment record, check remaining refundable amount, then create the refund. Or use optimistic locking with a version column.</div><div class="learn-warn"><b>Gateway timeout ambiguity:</b> You call Stripe, and the connection times out after 30 seconds. Did Stripe charge the card? You don\'t know. Status should be UNKNOWN (not FAILED). The reconciliation job checks Stripe\'s API with the idempotency key to determine the actual outcome. Never assume timeout = failure for payment operations.</div><p class="learn-p"><b>Currency conversion:</b> A user pays in EUR but the merchant settles in USD. The exchange rate at authorization time may differ from settlement time (24-48 hours later). Store both the original currency/amount and the settlement currency/amount. Apply the rate at settlement, not authorization.</p><p class="learn-p"><b>PCI DSS compliance:</b> Never store raw card numbers in your system. Use tokenization: the client sends the card number directly to the payment gateway (Stripe.js), which returns a one-time token. Your server only sees the token, never the card number. This reduces PCI scope from SAQ-D (full audit) to SAQ-A (simple self-assessment).</p><p class="learn-p"><b>Reconciliation:</b> Daily, compare your ledger entries against the payment gateway\'s settlement report. Flag discrepancies: payments you recorded as succeeded but the gateway shows as failed (overcharge — refund immediately), or gateway succeeded but you recorded as failed (undercharge — capture the payment). Automate resolution for common cases; alert humans for edge cases.</p></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Metric</th><th>Value</th><th>Notes</th></tr><tr><td>Payment processing latency</td><td>1-3 seconds</td><td>Card network round-trip dominates</td></tr><tr><td>Idempotency check</td><td>&lt;5ms</td><td>PostgreSQL UNIQUE index lookup</td></tr><tr><td>Risk engine</td><td>50-200ms</td><td>ML model inference + rule checks</td></tr><tr><td>Gateway failover</td><td>&lt;1 second</td><td>Strategy pattern switches to backup gateway</td></tr><tr><td>Daily reconciliation</td><td>1-4 hours</td><td>Batch job comparing millions of records</td></tr><tr><td>Payment data retention</td><td>7+ years</td><td>Regulatory requirement (varies by jurisdiction)</td></tr></table><table class="learn-table"><tr><th>Gateway</th><th>Regions</th><th>Transaction Fee</th><th>Failover</th></tr><tr><td>Stripe</td><td>Global</td><td>2.9% + $0.30</td><td>99.99% SLA</td></tr><tr><td>Adyen</td><td>Global</td><td>Interchange++ pricing</td><td>Multi-acquirer</td></tr><tr><td>Razorpay</td><td>India</td><td>2% per txn</td><td>UPI, cards, net banking</td></tr><tr><td>PayPal</td><td>Global</td><td>2.9% + $0.30</td><td>PayPal balance fallback</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you prevent double-charging when the client retries a payment?</b><br/>The client generates an <b>idempotency key</b> (UUID) and sends it with every payment request. The server stores this key with a UNIQUE constraint in the database. On retry, the server finds the existing record and returns the cached result — no second charge. The key + result must be stored atomically with the payment record (same DB transaction).</p><p class="learn-p"><b>Q2: Why use double-entry bookkeeping?</b><br/>Every transaction creates two ledger entries: a DEBIT from one account and a CREDIT to another. The invariant SUM(credits) == SUM(debits) must always hold. This catches bugs: if a payment is recorded as a credit to the merchant but no debit from the user, the books won\'t balance, and the discrepancy is flagged immediately. It\'s also a regulatory requirement for financial systems.</p><p class="learn-p"><b>Q3: What happens if the payment gateway times out?</b><br/>Set payment status to UNKNOWN (not FAILED — you don\'t know if the charge went through). Schedule a reconciliation check: call the gateway\'s API with your idempotency key to determine the actual outcome. If the gateway confirms the charge succeeded, update status to SUCCEEDED. If not, update to FAILED and allow the user to retry.</p><p class="learn-p"><b>Q4: How do you handle a distributed transaction across order, payment, and inventory services?</b><br/>Use the <b>Saga pattern</b>. Step 1: Reserve inventory. Step 2: Process payment. Step 3: Confirm order. If Step 2 fails, compensate Step 1 (release inventory reservation). If Step 3 fails, compensate Step 2 (refund payment) and Step 1. An orchestrator service coordinates the saga and tracks which compensations are needed on failure.</p><p class="learn-p"><b>Q5: Why should money never be stored as a float?</b><br/>IEEE 754 floating-point cannot exactly represent most decimal fractions: 0.1 + 0.2 = 0.30000000000000004. Over millions of transactions, rounding errors accumulate into real financial discrepancies. Use BIGINT (cents) or DECIMAL. $99.99 is stored as integer 9999.</p><p class="learn-p"><b>Q6: How do you support multiple payment gateways with failover?</b><br/>Strategy pattern: define a PaymentGateway interface with charge() and refund() methods. Implement StripeGateway, AdyenGateway, etc. If Stripe returns a 5xx error or times out, automatically retry with Adyen. The payment service doesn\'t know or care which gateway is used — it calls the interface. Store which gateway processed each payment for reconciliation.</p><p class="learn-p"><b>Q7: What is two-phase capture and when would you use it?</b><br/>Phase 1 (Authorization): Reserve $200 on the card (hotel check-in). No money moves yet. Phase 2 (Capture): Charge the actual amount ($175 for 2 nights + minibar). This is used when the final amount is unknown at booking time (hotels, gas stations, car rentals). The authorization expires after 7-30 days if not captured.</p></div>',
    code: `// ===== Payment System — Core Components =====
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>
#include <sstream>
#include <cstdlib>
using namespace std;

enum class PaymentStatus {
    PENDING, PROCESSING, SUCCEEDED, FAILED, UNKNOWN, REFUNDED
};
enum class PaymentMethod { CARD, UPI, NET_BANKING, WALLET };

struct Payment {
    string id;
    string idempotencyKey;
    long long amount;           // in cents! never float
    string currency;
    PaymentMethod method;
    PaymentStatus status;
    string gatewayTxnId;
    long long createdAt;
    long long updatedAt;
    int retryCount;
};

struct LedgerEntry {
    string id;
    string paymentId;
    string account;     // "user_wallet", "merchant_wallet"
    string entryType;   // "DEBIT" or "CREDIT"
    long long amount;   // always positive, in cents
    long long createdAt;
};

// Strategy pattern for payment gateways
class IPaymentGateway {
public:
    virtual pair<bool, string> charge(long long amount,
                                       const string& token) = 0;
    virtual bool refund(const string& txnId, long long amount) = 0;
    virtual ~IPaymentGateway() = default;
};

class StripeGateway : public IPaymentGateway {
public:
    pair<bool, string> charge(long long amount,
                               const string& token) override {
        cout << "[Stripe] Charging $" << amount / 100.0 << endl;
        // In production: HTTP call to Stripe API with idempotency key
        return {true, "ch_stripe_" + to_string(rand() % 100000)};
    }
    bool refund(const string& txnId, long long amount) override {
        cout << "[Stripe] Refunding $" << amount / 100.0
             << " for " << txnId << endl;
        return true;
    }
};

class AdyenGateway : public IPaymentGateway {
public:
    pair<bool, string> charge(long long amount,
                               const string& token) override {
        cout << "[Adyen] Charging $" << amount / 100.0 << endl;
        return {true, "adyen_txn_" + to_string(rand() % 100000)};
    }
    bool refund(const string& txnId, long long amount) override {
        cout << "[Adyen] Refunding $" << amount / 100.0 << endl;
        return true;
    }
};

// Double-entry ledger
class Ledger {
    vector<LedgerEntry> entries;
    int nextId = 1;
public:
    void record(const string& paymentId, const string& fromAccount,
                const string& toAccount, long long amount) {
        entries.push_back({to_string(nextId++), paymentId,
                          fromAccount, "DEBIT", amount, 0});
        entries.push_back({to_string(nextId++), paymentId,
                          toAccount, "CREDIT", amount, 0});
    }

    bool isBalanced() const {
        long long totalDebits = 0, totalCredits = 0;
        for (const auto& e : entries) {
            if (e.entryType == "DEBIT") totalDebits += e.amount;
            else totalCredits += e.amount;
        }
        return totalDebits == totalCredits;  // must always be true
    }

    void printSummary() const {
        cout << "Ledger: " << entries.size() << " entries, "
             << (isBalanced() ? "BALANCED" : "IMBALANCED!") << endl;
    }
};

// Payment service with idempotency and gateway failover
class PaymentService {
    unordered_map<string, Payment> payments;
    unordered_map<string, string> idempotencyStore; // key -> paymentId
    Ledger ledger;
    vector<IPaymentGateway*> gateways;  // primary + fallback

public:
    PaymentService(vector<IPaymentGateway*> gws) : gateways(gws) {}

    string processPayment(const string& idempKey, long long amount,
                          const string& currency,
                          const string& token, PaymentMethod method) {
        // 1. Idempotency check
        if (idempotencyStore.count(idempKey)) {
            string existingId = idempotencyStore[idempKey];
            cout << "Idempotent hit: returning existing payment "
                 << existingId << endl;
            return existingId;
        }

        // 2. Create payment record (status: PENDING)
        string paymentId = "pay_" + to_string(payments.size() + 1);
        Payment p{paymentId, idempKey, amount, currency, method,
                  PaymentStatus::PENDING, "", 0, 0, 0};

        // 3. Risk check (simplified)
        if (amount > 1000000) {  // > $10,000
            cout << "Risk: high-value transaction, additional verification needed" << endl;
        }

        // 4. Try gateways with failover
        p.status = PaymentStatus::PROCESSING;
        bool charged = false;
        string txnId;
        for (auto* gw : gateways) {
            try {
                auto [success, tid] = gw->charge(amount, token);
                if (success) {
                    charged = true;
                    txnId = tid;
                    break;
                }
            } catch (...) {
                cout << "Gateway failed, trying next..." << endl;
                continue;  // try fallback gateway
            }
        }

        // 5. Update status and create ledger entries
        if (charged) {
            p.status = PaymentStatus::SUCCEEDED;
            p.gatewayTxnId = txnId;
            // Double-entry ledger: DEBIT user, CREDIT merchant
            ledger.record(paymentId, "user_wallet",
                         "merchant_wallet", amount);
            cout << "Payment " << paymentId << " SUCCEEDED ($"
                 << amount / 100.0 << ")" << endl;
        } else {
            p.status = PaymentStatus::FAILED;
            cout << "Payment " << paymentId << " FAILED" << endl;
        }

        // 6. Store payment and idempotency key atomically
        payments[paymentId] = p;
        idempotencyStore[idempKey] = paymentId;
        ledger.printSummary();
        return paymentId;
    }

    bool refund(const string& paymentId, long long amount) {
        auto it = payments.find(paymentId);
        if (it == payments.end() ||
            it->second.status != PaymentStatus::SUCCEEDED)
            return false;

        if (amount > it->second.amount) {
            cout << "Refund amount exceeds original payment" << endl;
            return false;
        }

        // Call gateway to refund
        for (auto* gw : gateways) {
            if (gw->refund(it->second.gatewayTxnId, amount)) {
                it->second.status = PaymentStatus::REFUNDED;
                // Reverse ledger entries
                ledger.record(paymentId, "merchant_wallet",
                             "user_wallet", amount);
                cout << "Refund successful for " << paymentId << endl;
                ledger.printSummary();
                return true;
            }
        }
        return false;
    }
};

int main() {
    StripeGateway stripe;
    AdyenGateway adyen;
    PaymentService service({&stripe, &adyen});

    // Process payment: $99.99 = 9999 cents
    string id = service.processPayment(
        "idem_001", 9999, "USD", "tok_visa_4242", PaymentMethod::CARD);

    // Retry with same idempotency key — NO duplicate charge
    service.processPayment(
        "idem_001", 9999, "USD", "tok_visa_4242", PaymentMethod::CARD);

    // Refund
    service.refund(id, 9999);

    return 0;
}`,
    problems: [
      ["Event Sourcing Patterns", "https://www.geeksforgeeks.org/event-sourcing-pattern/", "Medium"],
      ["Payment System — HelloInterview Answer Key", "https://www.hellointerview.com/learn/system-design/answer-keys/payment-system", "Hard"]
    ],
    mcqs: [
      {"q": "Idempotency in payment systems ensures:", "o": ["Payments are faster", "Retrying a payment request does not cause duplicate charges", "All payments succeed", "Payments are encrypted"], "a": 1},
      {"q": "In double-entry bookkeeping, every transaction:", "o": ["Has exactly one ledger entry", "Has balanced debit and credit entries", "Is stored in a blockchain", "Requires manual approval"], "a": 1},
      {"q": "Which pattern is used to support multiple payment gateways (Stripe, Adyen)?", "o": ["Singleton", "Observer", "Strategy", "Factory"], "a": 2},
      {"q": "Why should money never be stored as a floating-point number?", "o": ["Floats are too slow", "IEEE 754 cannot exactly represent most decimal fractions, causing rounding errors", "Databases don't support floats", "Floats use too much storage"], "a": 1},
      {"q": "When a payment gateway call times out, the correct payment status is:", "o": ["SUCCEEDED (assume it worked)", "FAILED (assume it didn't work)", "UNKNOWN (reconcile later to determine actual outcome)", "CANCELLED"], "a": 2},
      {"q": "The Saga pattern is used in payment systems to:", "o": ["Speed up processing", "Coordinate distributed transactions with compensating actions on failure", "Encrypt payment data", "Generate idempotency keys"], "a": 1},
      {"q": "PCI DSS compliance is simplified by:", "o": ["Storing card numbers in an encrypted database", "Using tokenization so your server never sees raw card numbers", "Processing fewer transactions", "Using only one payment gateway"], "a": 1},
      {"q": "Two-phase capture (authorize then capture) is used when:", "o": ["The payment amount is known upfront", "The final charge amount is unknown at authorization time (hotels, gas stations)", "The user has insufficient balance", "The card is expired"], "a": 1}
    ]
  }
      ]
    },
  ]
};
