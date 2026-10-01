## explanation
context.Context carries cancellation and a deadline. The caller builds it with WithCancel or WithTimeout and passes it as the first argument. Waiting work selects on ctx.Done().

```
if err := ctx.Err(); err != nil {
	return err
}
```

## apply
Use it to stop HTTP work when the user leaves or when the deadline set at the request boundary is reached.

## easy
Report whether the context has already ended.

## hard
Return a default when it is canceled, or wait until Done.

## steps
- Take ctx as the first argument
- Check ctx.Err()
- Stop on Done
- Do not store a request context in a struct
