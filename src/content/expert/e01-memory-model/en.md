## explanation
The memory model says when a write in one goroutine becomes visible to a read in another. A successful send happens before the matching receive. Seeing one order once does not prove there is no data race.

```
ch <- 1
v := <-ch
```

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
