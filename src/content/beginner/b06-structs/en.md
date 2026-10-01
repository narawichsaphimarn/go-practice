## explanation
A struct groups related fields. A method is a function with a receiver. A pointer receiver makes field changes visible to the caller.

```
type Rect struct {
	W int
	H int
}
```

## apply
Use it instead of passing a loose group of values, such as a size or a user name.

## easy
Calculate an area from a struct.

## hard
A method that changes a field, or renames a value.

## steps
- Declare the struct
- Pass a value or a pointer depending on whether you mutate
- Write the method
- Use the name the test calls
