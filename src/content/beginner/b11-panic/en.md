## explanation
A panic is the program stopping suddenly because something happened that never should, such as reading past the end of a slice or reading through a nil pointer. When a panic happens, the function stops at once, the defers it registered still run, and the program ends with a message saying why.

```
func main() {
	defer fmt.Println("cleanup")
	values := []int{1, 2}
	fmt.Println(values[5])
}
```

The output is cleanup, followed by `panic: runtime error: index out of range`. You can also panic yourself with `panic("message")`.

## apply
error and panic have different jobs:

- An error is for things you can expect, such as bad user input or a missing file. The caller checks it and carries on.
- A panic is for bugs that should never happen. If it happens, the code is wrong.

`recover()` stops a panic from ending the program, but it only works when called inside a defer. With no panic it returns nil; during a panic it returns the value passed to panic.

```
func Try() (ok bool) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("caught:", r)
		}
	}()
	panic("bad state")
}
```

`Try()` prints `caught: bad state` and returns false, and the program keeps going. `if r := recover(); r != nil` declares r and checks it on the same line.

## easy
Example: see that defers still run during a panic.

```
func main() {
	defer fmt.Println("saved")
	panic("disk full")
}
```

It prints saved first, then the program ends with `panic: disk full`.

## hard
Example: turn the panic from reading past the end of a slice into an error.

```
func At(values []int, i int) (v int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("bad index %d", i)
		}
	}()
	return values[i], nil
}
```

`At([]int{7}, 0)` gives 7 and nil, while `At([]int{7}, 3)` gives the error `bad index 3`. `fmt.Errorf` builds an error from a pattern, like Printf. In real code, checking `i < len(values)` first is better; this example only shows how recover works.
