## explanation
If a function returns the same type it received and does not call methods on that value, a generic is clearer than the empty interface. If the behavior is Speak, use an interface instead.

```
func First[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}
	return items[0], true
}
```

## apply
Use it in a library helper that accepts a slice of a caller-chosen type.

## easy
Return the first element.

## hard
Return the last element and whether it exists.

## steps
- Use a type parameter when you must return the same type
- Return the zero value when empty
- Do not return any and force the caller to assert
- Use an interface when you need behavior
