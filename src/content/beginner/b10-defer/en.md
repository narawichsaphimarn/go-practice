## explanation
`defer` schedules a function call for when the current function is about to finish, whichever `return` it leaves through.

```
func Visit() {
	fmt.Println("open")
	defer fmt.Println("close")
	fmt.Println("work")
}
```

The output is open, work, then close. The defer line does not print right away; it is noted down and run at the end.

Use defer for clean-up that must always happen, such as closing a file you opened. Put the defer right next to the line that opened it, and you will not forget to close it even when the function has several exits.

## apply
With several defers, the one registered last runs first, like a stack of plates: the plate put down last is on top, so it is picked up first.

```
defer fmt.Println("1")
defer fmt.Println("2")
defer fmt.Println("3")
```

The output is 3, 2, 1.

If the deferred work takes several lines, wrap it in an anonymous function (from lesson 4) and add `()` at the end to call it: `defer func() { ... }()`.

A function that names its result, such as `func Total() (sum int)`, has a variable sum from the start. `return 5` sets sum to 5 first, and only then do the defers run, so a defer can change the value that is returned.

```
func Total() (sum int) {
	defer func() { sum = sum * 10 }()
	return 5
}
```

`Total()` is 50.

## easy
Example: always print a closing message, even when leaving the function early.

```
func Check(n int) {
	defer fmt.Println("done")
	if n < 0 {
		fmt.Println("negative")
		return
	}
	fmt.Println("ok")
}
```

`Check(-1)` prints negative and then done, and `Check(2)` prints ok and then done.

## hard
Example: count how many times a function finishes, with a defer that uses a variable outside the function.

```
var finished int

func Job() (result string) {
	defer func() {
		finished++
		result = result + "!"
	}()
	return "ok"
}
```

Every call to `Job()` returns `ok!` and adds one to finished, because the defer runs after return has set result to "ok".
