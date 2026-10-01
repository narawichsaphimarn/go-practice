## explanation
A type parameter lets one function work for many types and still check them at compile time. Use it when a small interface would not say the same thing, such as returning the same value or finding the lesser value with cmp.Ordered.

```
func Identity[T any](v T) T {
	return v
}
```

## apply
Use it in a library that handles a slice of any element type without copying the function for each type.

## easy
Return the same value.

## hard
Pick the lesser value, or transform each element.

## steps
- Add a type parameter when the type must follow the caller
- Use any when you call no methods
- Use a constraint when you compare
- Skip generics when one type is enough
