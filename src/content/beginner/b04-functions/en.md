## explanation
A function takes values in and returns a result. Some functions return two things at once: the result and an error. When the work succeeds, the error is nil.

```
func add(a, b int) int {
	return a + b
}

fmt.Println(add(2, 3))
```

```
func div(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("divide by zero")
	}
	return a / b, nil
}
```

## apply
A tiny calculator calls add(2, 3) and prints 5. Dividing 4 by 2 returns 2 and a nil error.

```
n, err := div(4, 2)
if err != nil {
	fmt.Println("error")
	return
}
fmt.Println(n)
```

## easy
Write add and print the result of add(2, 3), which is 5.

```
func add(a, b int) int {
	return a + b
}

func main() {
	fmt.Println(add(2, 3))
}
```

## hard
When the divisor is zero, do not print a quotient. Print the word error.

```
func div(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("divide by zero")
	}
	return a / b, nil
}

func main() {
	_, err := div(4, 0)
	if err != nil {
		fmt.Println("error")
	}
}
```
