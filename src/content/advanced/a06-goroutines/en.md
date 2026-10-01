## explanation
go before a call starts a goroutine. That work does not line up with the caller by itself. Use a channel or sync to know it finished. If main returns first, leftover work is dropped.

```
ch := make(chan int, 1)
go func() { ch <- a + b }()
fmt.Println(<-ch)
```

## apply
Use it to overlap waiting, such as calling two services and then combining the results.

## easy
Add numbers in a goroutine and receive the result.

## hard
Combine two pieces of work.

## steps
- Start the goroutine with go
- Send the result on a channel
- Receive everything before returning
- Do not return while nobody is receiving
