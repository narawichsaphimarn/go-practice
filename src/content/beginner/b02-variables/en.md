## explanation
var declares a variable with no explicit value, so it receives the zero value: 0 for int, empty for string, false for bool.

```
var count int
fmt.Println(count)
```

:= declares and infers the type from the initial value.

## apply
Use this when reading unset config and when an empty struct field must have an obvious meaning.

## easy
Print the zero value of an int.

## hard
Print a string variable, or the zero value of a bool.

## steps
- Declare the variable
- Leave it unset when you want the zero value
- Print it
- Match the required text
