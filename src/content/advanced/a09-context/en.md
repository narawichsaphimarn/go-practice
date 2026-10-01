## explanation
A context is the caller's signal that the work should continue. After it ends, ctx.Err() is not nil and ctx.Done() is ready to receive.

```
func Done(ctx context.Context) bool {
	select {
	case <-ctx.Done():
		return true
	default:
		return false
	}
}
```

## apply
Pass the context into a function that waits. If the user cancels, the inner work stops and returns ctx.Err() instead of a normal result.

```
func Wait(ctx context.Context) error {
	<-ctx.Done()
	return ctx.Err()
}
```

## easy
Done returns true when the context has ended and false while it is still active.

```
func Done(ctx context.Context) bool {
	select {
	case <-ctx.Done():
		return true
	default:
		return false
	}
}
```

## hard
Wait blocks until the context ends, then returns ctx.Err(). OrDefault returns 0 after it ends and returns value while it is still active.

```
func Wait(ctx context.Context) error {
	<-ctx.Done()
	return ctx.Err()
}
```

```
func OrDefault(ctx context.Context, value int) int {
	select {
	case <-ctx.Done():
		return 0
	default:
		return value
	}
}
```
