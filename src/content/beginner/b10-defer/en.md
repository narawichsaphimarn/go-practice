## explanation
defer saves work to run as the function is about to return. Use it to finish a job or to update a named result. panic stops the whole call at once, so it is not the normal way to report a mistake. Return an error for that. recover inside defer catches that panic.

```
func Order() (s string) {
	defer func() { s += "b" }()
	s = "a"
	return s
}
```

Order returns ab because defer appends b after s is set to a and before the function really finishes.

## apply
Work that must happen on the way out, no matter which return you hit, belongs in defer. That includes appending a letter or counting that something closed.

## easy
Order returns ab by letting defer append b onto the named result.

```
func Order() (s string) {
	defer func() { s += "b" }()
	s = "a"
	return s
}
```

## hard
Safe panics, recover runs in defer, and the function returns true. Closed adds one to the named result in defer so the result is 1.

```
func Safe() (recovered bool) {
	defer func() {
		if recover() != nil {
			recovered = true
		}
	}()
	panic("boom")
}
```

```
func Closed() (n int) {
	defer func() { n++ }()
	return 0
}
```
