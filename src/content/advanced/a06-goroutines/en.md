## explanation
Writing go before a call runs that function alongside the current one. The two sides do not wait for each other by themselves. If you need the result, send it on a channel and receive it in main.

```
func AddAsync(a, b int) int {
	ch := make(chan int)
	go func() { ch <- a + b }()
	return <-ch
}
```

AddAsync(2, 3) returns 5 after the goroutine sends the result.

## apply
Split an addition into pieces and add them back together. Count how many jobs finished. Receive from the channel until every job has reported, or main ends and the result disappears.

## easy
AddAsync returns a+b by letting a goroutine send the result on a channel.

```
func AddAsync(a, b int) int {
	ch := make(chan int)
	go func() { ch <- a + b }()
	return <-ch
}
```

## hard
WaitBoth starts two goroutines and waits for both, so it returns 2. SumParts adds results from two goroutines.

```
func WaitBoth() int {
	ch := make(chan int)
	go func() { ch <- 1 }()
	go func() { ch <- 1 }()
	return <-ch + <-ch
}
```

```
func SumParts(a, b int) int {
	ch := make(chan int)
	go func() { ch <- a }()
	go func() { ch <- b }()
	return <-ch + <-ch
}
```
