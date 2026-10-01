## explanation
Escape analysis is the step where the compiler decides whether a value must go to the heap or can stay on the stack. If the value does not escape the function, it can stay on the stack.

```
func local() int {
	s := []int{1, 2, 3}
	return s[0]
}
```

The slice s is used only inside local and then dropped, so the compiler can avoid a heap allocation for its backing array.

## apply
Keeping more slice backing arrays on the stack means some slices skip the heap when the compiler proves they do not escape. Incorrect unsafe is more dangerous because it can point into a stack that is reused after the function returns.

```
func kept() *int {
	n := 1
	return &n
}
```

n escapes kept because someone keeps the pointer. That value must go to the heap.

## easy
Escape analysis decides whether a value must go to the heap or can stay on the stack.

```
func local() int {
	s := []int{1, 2, 3}
	return s[0]
}
```

## hard
unsafe that points into the stack incorrectly can point at memory reused after the function returns. A slice that does not escape does not need the heap.

```
func local() int {
	s := []int{1, 2, 3}
	return s[0]
}
```
