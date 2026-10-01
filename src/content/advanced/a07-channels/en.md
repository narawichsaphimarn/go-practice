## explanation
A channel is a pipe that carries a value from one piece of work to another. A receive waits until someone sends. After the pipe is closed, range stops when the sent values are gone.

```
func SendRecv(v int) int {
	ch := make(chan int, 1)
	ch <- v
	return <-ch
}
```

SendRecv(7) is 7 because it sends into a pipe with one free slot and receives that value back at once.

## apply
Send one number and receive it back. Send a list, close the pipe, and let the receiver add until the list ends. Take the first value already sitting in a buffered pipe without waiting for more.

## easy
SendRecv sends v into a channel and receives the same value back.

```
func SendRecv(v int) int {
	ch := make(chan int, 1)
	ch <- v
	return <-ch
}
```

## hard
First receives the first value from a channel that already has a buffer and a value. SumClosed sends every value, closes the pipe, then range adds until it ends.

```
func First(ch <-chan int) int {
	return <-ch
}
```

```
func SumClosed(values []int) int {
	ch := make(chan int)
	go func() {
		for _, v := range values {
			ch <- v
		}
		close(ch)
	}()
	total := 0
	for v := range ch {
		total += v
	}
	return total
}
```
