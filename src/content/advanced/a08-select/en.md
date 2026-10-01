## explanation
select waits on several channels and runs the case that is ready first. Add default when you want to continue at once if nothing is ready. Add time.After when you want to stop after a deadline.

```
func FirstReady(a, b <-chan int) int {
	select {
	case v := <-a:
		return v
	case v := <-b:
		return v
	}
}
```

## apply
Take the result from whichever of two jobs finishes first. Use 0 instead of waiting when nothing is ready. Return -1 if the channel stays empty for more than 20 milliseconds.

## easy
FirstReady returns the value from whichever of a and b is ready first.

```
func FirstReady(a, b <-chan int) int {
	select {
	case v := <-a:
		return v
	case v := <-b:
		return v
	}
}
```

## hard
OrTimeout returns -1 when the channel stays empty for more than 20 milliseconds. OrZero returns the value in the channel, or 0 at once if nothing is there yet.

```
func OrTimeout(ch <-chan int) int {
	select {
	case v := <-ch:
		return v
	case <-time.After(20 * time.Millisecond):
		return -1
	}
}
```

```
func OrZero(ch <-chan int) int {
	select {
	case v := <-ch:
		return v
	default:
		return 0
	}
}
```
