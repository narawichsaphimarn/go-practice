## explanation
`sync.WaitGroup` counts unfinished work, like a sign showing how many people are still in a room. You can lock up only when it reaches zero.

- `wg.Add(1)` raises the count.
- `wg.Done()` lowers it when a job ends.
- `wg.Wait()` waits until the count is zero.

Since Go 1.25, `wg.Go(f)` does all three in one line: it raises the count, starts f in a new goroutine, and lowers the count when f returns.

```
var wg sync.WaitGroup
for _, url := range urls {
	wg.Go(func() {
		fetch(url)
	})
}
wg.Wait()
```

Since Go 1.22, a loop variable such as url is fresh in every round, so each goroutine gets its own round's url.

## apply
If you call Add yourself, always call it before the `go` statement. Inside the new goroutine, Wait may run before anyone has called Add; the count is still zero, so Wait returns at once while work is unfinished. In Go 1.25, `go vet` has a waitgroup check that warns about this bug.

When several goroutines write the same variable at once, the result gets corrupted. This is a data race. Use a `sync.Mutex` so only one writes at a time.

```
type Stats struct {
	mu   sync.Mutex
	hits int
}

func (s *Stats) Hit() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.hits++
}
```

The way to need no lock at all is to give each goroutine its own slot, such as `out[i]` in a slice allocated beforehand. The slots never overlap, so nothing is shared.

## easy
Example: send several emails at once and wait for all of them.

```
func SendAll(emails []string) {
	var wg sync.WaitGroup
	for _, e := range emails {
		wg.Go(func() {
			send(e)
		})
	}
	wg.Wait()
}
```

Forget `wg.Wait()` and the function returns at once, possibly before some emails are sent.

## hard
Example: add up the length of every word from many goroutines, protecting the total with a Mutex.

```
func TotalLen(words []string) int {
	var wg sync.WaitGroup
	var mu sync.Mutex
	total := 0
	for _, w := range words {
		wg.Go(func() {
			mu.Lock()
			total += len(w)
			mu.Unlock()
		})
	}
	wg.Wait()
	return total
}
```

Without Lock and Unlock, additions from different goroutines can overwrite each other, and the total comes out too small.
