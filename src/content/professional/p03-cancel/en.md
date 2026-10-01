## explanation
Blocking work must listen to ctx.Done() as well as its own channel. If the caller cancels, return ctx.Err() instead of waiting longer.

```
select {
case <-ctx.Done():
	return ctx.Err()
case v := <-work:
	return use(v)
}
```

## apply
Use it in a handler that must stop calculating when the client disconnects.

## easy
Return an error when the context has already ended.

## hard
Choose between a result and the cancel signal.

## steps
- Pass ctx down every layer
- Select on Done and the work
- Return ctx.Err()
- Do not replace cancellation with a fixed sleep
