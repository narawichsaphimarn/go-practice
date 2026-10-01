## explanation
When you pass a variable to a function, Go passes a copy, like sending someone a copy of a file in a chat. However much they edit their copy, your file stays the same.

```
func reset(n int) {
	n = 0
}

x := 5
reset(x)
fmt.Println(x)
```

This prints 5, because reset only changed the copy.

A pointer is the address of a variable, like sending a link to the file instead of the file itself. When they open the link and edit, the real file changes. Two symbols do the work:

- `&x` is the address of x.
- `*int` is the type "pointer to an int".
- `*p` is the value p points at, for reading or writing.

So `*` has three meanings depending on where it sits: before a type name (`*int`) it makes a pointer type, before a variable (`*p`) it means the value pointed at, and between two numbers (`a * b`) it multiplies.

## apply
Fix the example above so it changes the real value.

```
func reset(n *int) {
	*n = 0
}

x := 5
reset(&x)
fmt.Println(x)
```

This prints 0, because we passed the address of x and `*n = 0` wrote to that address.

A pointer that points at nothing is `nil`. Reading `*p` while p is nil makes the program panic, so check `if p == nil` first when you are not sure.

## easy
Example: double a variable through a pointer.

```
func DoubleIt(n *int) {
	*n = *n * 2
}

x := 4
DoubleIt(&x)
```

Afterwards x is 8. In `*n = *n * 2`, the first two stars mean "the value pointed at" and the last one multiplies.

## hard
Example: set a value to 0 only when the pointer really points at something, and report whether it did.

```
func Clear(n *int) bool {
	if n == nil {
		return false
	}
	*n = 0
	return true
}
```

`Clear(nil)` returns false without panicking, while `Clear(&x)` sets x to 0 and returns true.
