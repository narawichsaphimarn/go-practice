## explanation
A function is a named formula. It takes values in and gives a result back, like a `=SUM()` formula in a spreadsheet that you can reuse anywhere.

```
func add(a, b int) int {
	return a + b
}
```

- `add` is the function name.
- `(a, b int)` are the two input values (parameters), both int.
- The `int` after the parentheses is the type of the result.
- `return` hands the result back to the caller.

Write functions outside `func main` and call them from main: `fmt.Println(add(2, 3))` prints 5.

## apply
A Go function can return several values at once. List the result types in parentheses.

```
func minMax(a, b int) (int, int) {
	if a < b {
		return a, b
	}
	return b, a
}

low, high := minMax(9, 4)
```

low is 4 and high is 9. If you do not need one of the values, catch it with `_`, as in `_, high := minMax(9, 4)`. You need this because Go does not allow unused variables.

Good to know about division: `7 / 2` on ints is 3, because Go drops the remainder, and `7 % 2` gives the remainder, 1.

Functions are values too, so one function can be passed to another. The type of a function that takes an int and returns an int is written `func(int) int`.

```
square := func(x int) int { return x * x }
fmt.Println(square(4))
```

This prints 16. A function with no name like this is called an anonymous function.

## easy
Example: a function that returns the larger of two values.

```
func bigger(a, b int) int {
	if a > b {
		return a
	}
	return b
}
```

`bigger(3, 8)` is 8. A `return` ends the function at once, so the remaining lines do not run.

## hard
Example: a function that applies another function to every number from 1 to n and adds up the results.

```
func sumWith(f func(int) int, n int) int {
	total := 0
	for i := 1; i <= n; i++ {
		total += f(i)
	}
	return total
}

square := func(x int) int { return x * x }
fmt.Println(sumWith(square, 3))
```

This prints 14, because 1 + 4 + 9. `total += f(i)` means `total = total + f(i)`.
