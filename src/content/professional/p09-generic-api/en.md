## explanation
Lesson a02 used generics with functions. This lesson uses them with types too. A generic type has its type parameter after the name, and every method uses that same name.

```
type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(v T) {
	s.items = append(s.items, v)
}
```

The user picks the type when declaring, such as `var s Stack[string]` or `var n Stack[int]`, without writing a new Stack for each type.

As in lesson a02, the type is fixed at compile time, so a `Stack[int]` refuses a string at build time.

## apply
An API that may have no value to return should return two values, `(value, ok)`, like reading a map. The caller can tell "no value" apart from "the zero value".

```
func (s *Stack[T]) Pop() (T, bool) {
	if len(s.items) == 0 {
		var zero T
		return zero, false
	}
	last := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return last, true
}
```

`var zero T` is the only way to get the zero value of T, because you do not know in advance which type T is.

Use generics when the caller chooses the type, as with collections or caches. If a function only ever works with one type, the plain version reads better. If you only need to call a shared method, an interface as in lesson a01 is enough.

## easy
Example: return the item at position i if it exists.

```
func At[T any](items []T, i int) (T, bool) {
	if i < 0 || i >= len(items) {
		var zero T
		return zero, false
	}
	return items[i], true
}
```

`At([]string{"a"}, 3)` gives empty text and false instead of a panic.

## hard
Example: a generic type that counts how often each value appears.

```
type Counter[K comparable] struct {
	counts map[K]int
}

func (c *Counter[K]) Add(k K) {
	if c.counts == nil {
		c.counts = make(map[K]int)
	}
	c.counts[k]++
}

func (c *Counter[K]) Count(k K) int {
	return c.counts[k]
}
```

`var c Counter[string]` is ready to use without making the map first, because Add creates it on the first call, and Count can read a nil map and gets 0.
