## explanation
When the work fails, return an error and let the caller stop. Do not pretend the result succeeded. No problem means a nil error.

```
func Div(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("divide by zero")
	}
	return a / b, nil
}
```

## apply
A form divides two numbers. If the divisor is 0, tell the user it cannot be done. Do not show 0 as if the math worked.

```
n, err := Div(4, 0)
if err != nil {
	fmt.Println(err)
	return
}
fmt.Println(n)
```

## easy
Div returns an error when b is 0, and returns a/b with nil when it succeeds.

```
func Div(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("divide by zero")
	}
	return a / b, nil
}
```

## hard
MustHave returns an error for an empty string and nil when there is text. ParsePositive accepts only a number greater than 0.

```
func MustHave(s string) error {
	if s == "" {
		return fmt.Errorf("empty")
	}
	return nil
}
```

```
func ParsePositive(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil || n <= 0 {
		return 0, fmt.Errorf("not positive")
	}
	return n, nil
}
```
