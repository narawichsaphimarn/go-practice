## explanation
A `context.Context` is the caller's signal for whether the work should continue or stop, for example because the user closed the page or the time allowed ran out. A function that might wait a long time takes ctx as its first parameter.

Two parts of ctx come up all the time:

- `ctx.Done()` is a channel that is closed when the context ends. After that, reading from it succeeds at once.
- `ctx.Err()` is nil while the context is active. Afterwards it is `context.Canceled` (someone canceled) or `context.DeadlineExceeded` (time ran out).

```
select {
case <-ctx.Done():
	return ctx.Err()
case res := <-results:
	return use(res)
}
```

The select from lesson a08 waits on several things at once. Here it waits for both the result and the stop signal, and handles whichever comes first, so the work never hangs waiting for a result nobody wants any more.

## apply
A caller makes a child context from one it already has:

- `ctx, cancel := context.WithCancel(parent)` ends when you call `cancel()`.
- `ctx, cancel := context.WithTimeout(parent, 2*time.Second)` ends by itself when the time is up.

Call `defer cancel()` right after creating it, even if the work finishes early; otherwise the timer's resources stay around until it expires.

Contexts pass the signal down a chain. When a parent is canceled, every child ends too, like closing the main valve so every pipe downstream stops. The root that never ends is `context.Background()`.

## easy
Example: before starting heavy work, check that the caller is still waiting.

```
func Prepare(ctx context.Context) error {
	if err := ctx.Err(); err != nil {
		return err
	}
	return heavyWork()
}
```

If the context was already canceled, Prepare returns `context.Canceled` without ever starting heavyWork.

## hard
Example: wait for an answer on a channel, but no longer than a time limit.

```
func Ask(ctx context.Context, answers <-chan string) (string, error) {
	ctx, cancel := context.WithTimeout(ctx, 500*time.Millisecond)
	defer cancel()
	select {
	case a := <-answers:
		return a, nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}
```

With no answer within 0.5 seconds, Ask returns `context.DeadlineExceeded`, and if the caller cancels the original ctx first, it ends at once with `context.Canceled`.
