## explanation
A worker pool caps how much work runs at once, with a token channel or a fixed set of goroutines. The rest waits in a queue. Otherwise the program starts one goroutine per job.

```
slots := make(chan struct{}, limit)
slots <- struct{}{}
```

## apply
Use it when sending many requests or processing files without exceeding a chosen concurrency.

## easy
Combine the results of several jobs.

## hard
Prove that overlapping jobs never exceed the limit.

## steps
- Create capacity equal to the limit
- Take a slot before starting
- Release the slot when finished
- Wait until every job is done
