## explanation
defer runs when the function returns, in reverse order. With a named result, a deferred function can still change the returned value. panic stops the process unless recover runs inside a deferred function. panic is not the normal way to report a mistake.

```
func Order() (s string) {
	defer func() { s += "b" }()
	s = "a"
	return
}
```

## apply
Use it to close a file or unlock, and use recover only at a boundary that must keep the process alive.

## easy
Build a string with defer.

## hard
Count a close, or catch a panic.

## steps
- Place defer before the return point
- Use a named result if you must change it
- Call recover inside defer
- Do not replace an ordinary error with panic
