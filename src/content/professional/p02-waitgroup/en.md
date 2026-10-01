## explanation
sync.WaitGroup counts work that has not finished. Add raises the count. Done lowers it. Wait stops until the count is zero. Call Add before the go statement, not inside the goroutine, because Wait can run before that Add happens.

```
func FanIn(n int) int {
	var wg sync.WaitGroup
	wg.Add(n)
	for i := 0; i < n; i++ {
		go func() {
			wg.Done()
		}()
	}
	wg.Wait()
	return n
}
```

FanIn(3) starts three goroutines, waits until all three call Done, then returns 3. Import "sync".

## apply
Total lets each goroutine add 1 to the same variable. A variable that several goroutines write at once must be locked with sync.Mutex, or the writes race.

```
func Total(n int) int {
	var wg sync.WaitGroup
	var mu sync.Mutex
	total := 0
	wg.Add(n)
	for i := 0; i < n; i++ {
		go func() {
			mu.Lock()
			total++
			mu.Unlock()
			wg.Done()
		}()
	}
	wg.Wait()
	return total
}
```

Total(3) is 3 because three goroutines each add 1 under mu.

## easy
FanIn returns n after waiting for n goroutines. Call wg.Add(n) before the loop, and let each goroutine call wg.Done.

```
func FanIn(n int) int {
	var wg sync.WaitGroup
	wg.Add(n)
	for i := 0; i < n; i++ {
		go func() {
			wg.Done()
		}()
	}
	wg.Wait()
	return n
}
```

## hard
The broken code calls wg.Add inside the goroutine. If Wait runs before any goroutine reaches Add, the counter is still zero, so Wait returns at once and some jobs are not counted yet.

```
go func() {
	wg.Add(1)
	defer wg.Done()
	done.Add(1)
}()
```

Move wg.Add before the go statement so the counter is complete before Wait starts waiting.

```
func FanIn(n int) int {
	var wg sync.WaitGroup
	var done atomic.Int64
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			done.Add(1)
		}()
	}
	wg.Wait()
	return int(done.Load())
}
```

Import "sync" and "sync/atomic". Since Go 1.25, wg.Go(f) calls Add before starting the goroutine and Done when f returns, which avoids this bug from the start.
