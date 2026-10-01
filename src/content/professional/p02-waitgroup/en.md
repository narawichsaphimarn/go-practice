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
The broken code calls wg.Add inside the goroutine. Wait can finish before Add, so the function returns 0 even though FanIn(3) should be 3.

```
go func() {
	wg.Add(1)
	wg.Done()
}()
```

Move wg.Add out, before the go statement, and return n after Wait.

```
func FanIn(n int) int {
	var wg sync.WaitGroup
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			wg.Done()
		}()
	}
	wg.Wait()
	return n
}
```
