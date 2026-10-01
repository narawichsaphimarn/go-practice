## explanation
An unbuffered channel makes the sender wait until someone receives. A buffered channel accepts values up to its capacity. close says no more values are coming, and range ends when the channel is closed.

```
ch := make(chan int, 1)
ch <- 1
fmt.Println(<-ch)
```

## apply
Use it to hand work to a worker and return results without sharing a variable directly.

## easy
Send and receive one value.

## hard
Sum values from a closed channel.

## steps
- Pick a buffer or have a receiver waiting
- Close the channel from the sender side
- Use range after close
- Do not send on a closed channel
