## explanation
Escape analysis decides whether a value must move to the heap or can stay on the stack. Newer Go can keep more slice backing arrays on the stack. If unsafe points into memory the compiler thought was on the stack, the program breaks when that stack is reused.

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
