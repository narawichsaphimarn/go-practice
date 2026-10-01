## explanation
A generic function does not lock the type until the caller passes a value. Use it when the same steps work for many types, such as returning the value unchanged or picking the smaller one.

```
func Identity[T any](v T) T {
	return v
}
```

Identity(1) is 1 and Identity("go") is go, without a separate function for each type.

## apply
Use a type parameter when the caller must choose the type. Min works for ints and for strings that can be ordered, because the constraint is cmp.Ordered. Map converts every item with the function the caller supplies.

```
func Min[T cmp.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}
```

## easy
Identity returns exactly the value it received.

```
func Identity[T any](v T) T {
	return v
}
```

## hard
Map builds a new slice by calling f on every item. Min returns whichever of a and b is smaller.

```
func Map[T any, U any](in []T, f func(T) U) []U {
	out := make([]U, len(in))
	for i, v := range in {
		out[i] = f(v)
	}
	return out
}
```

```
func Min[T cmp.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}
```
