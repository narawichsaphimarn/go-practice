## explanation
A context that has ended means the work must stop. ctx.Done() is ready to receive, and ctx.Err() is the reason it ended, such as the caller canceling. Stopped looks at that state and returns the error once it has ended.

```
func Stopped(ctx context.Context) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	default:
		return nil
	}
}
```

Import "context". If the context has not ended, Stopped returns nil.

## apply
Take waits for a value from the channel, but if the context ends first it stops and returns 0. Wait stays blocked until the context ends, then returns ctx.Err() to the caller.

```
func Take(ctx context.Context, ch <-chan int) int {
	select {
	case v := <-ch:
		return v
	case <-ctx.Done():
		return 0
	}
}
```

If ch holds 7 and the context is still active, Take is 7. If the context ends before a value arrives, Take is 0.

## easy
Stopped returns ctx.Err() when the context has ended and nil while it is still active.

```
func Stopped(ctx context.Context) error {
	select {
	case <-ctx.Done():
		return ctx.Err()
	default:
		return nil
	}
}
```

## hard
Wait blocks until the context ends, then returns ctx.Err(). Take returns the channel value when one is present and 0 when the context has ended.

```
func Wait(ctx context.Context) error {
	<-ctx.Done()
	return ctx.Err()
}
```

```
func Take(ctx context.Context, ch <-chan int) int {
	select {
	case v := <-ch:
		return v
	case <-ctx.Done():
		return 0
	}
}
```
