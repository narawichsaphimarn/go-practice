## explanation
The memory model says when a write of a value is visible to another read. A successful send on a channel happens before the matching receive, so a value written before the send is visible after the receive.

```
func handoff() int {
	ch := make(chan int, 1)
	ch <- 7
	return <-ch
}
```

handoff() is 7, and the send of 7 happens before that receive.

## apply
One observed order does not prove there is no data race. You need happens-before from a channel or from sync. A correctly used sync.Mutex provides happens-before between Unlock and the next Lock of the same mutex.

```
var mu sync.Mutex
var n int

func add() {
	mu.Lock()
	n++
	mu.Unlock()
}
```

The Unlock of the first add happens before the Lock of the next add, so the two n++ calls do not race.

## easy
A successful send on a channel happens before the matching receive.

```
ch := make(chan int, 1)
ch <- 7
v := <-ch
```

v is 7, and the send happens before the matching receive.

## hard
A mutex that Locks and Unlocks correctly gives happens-before between Unlock and the next Lock. One observed order does not prove there is no data race.

```
mu.Lock()
n++
mu.Unlock()
```
