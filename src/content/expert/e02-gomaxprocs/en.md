## explanation
On Linux, when the process runs in a cgroup with a CPU limit, Go 1.25 adjusts the default GOMAXPROCS to match that limit. An explicit setting still wins. This behavior is for Linux, not every operating system.

## apply
Use it when one run cannot prove the behavior.

## easy
The easy case is the choice that matches the definition.

## hard
The hard case is the choice people mix up with a neighbor.

## steps
- Read the question
- Drop the choice that breaks the rule
- Pick the one that matches the behavior
- Submit on this page
