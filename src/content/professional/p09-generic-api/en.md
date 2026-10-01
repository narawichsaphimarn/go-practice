## explanation
A generic function lets the type of the data follow the caller. First[T any] works on a slice of any type. When the slice has an element it returns the first one and true. When the slice is empty it returns the zero value of that type and false.

```
func First[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}
	return items[0], true
}
```

First([]int{4, 5}) is 4 and true. First of an empty slice is 0 and false.

## apply
Last returns the final element. At returns the element at index when index is inside 0 through len-1, and false when index is negative or past the end.

```
func Last[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}
	return items[len(items)-1], true
}
```

Last([]string{"a", "b"}) is "b" and true.

## easy
First returns the first element and true, or the zero value and false when items is empty.

```
func First[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}
	return items[0], true
}
```

## hard
At returns items[index] and true when index is in range, and the zero value and false otherwise. Last returns the last element and true.

```
func At[T any](items []T, index int) (T, bool) {
	if index < 0 || index >= len(items) {
		var zero T
		return zero, false
	}
	return items[index], true
}
```

```
func Last[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}
	return items[len(items)-1], true
}
```
