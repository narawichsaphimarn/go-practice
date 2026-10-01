## explanation
A table test is a list of cases the same function must answer correctly. Classify takes an integer and returns neg when it is negative, zero when it is zero, and pos when it is positive.

```
func Classify(n int) string {
	if n < 0 {
		return "neg"
	}
	if n == 0 {
		return "zero"
	}
	return "pos"
}
```

Classify(-3) is neg, Classify(0) is zero, and Classify(4) is pos.

## apply
The table calls the same function many times. Each row has an input and the answer you expect. A failing row is one whose answer does not match. InRange(5, 1, 3) must be false because 5 is above 3.

```
func InRange(n, low, high int) bool {
	return low <= n && n <= high
}
```

## easy
Classify returns neg when n is less than 0, zero when n is 0, and pos when n is greater than 0.

```
func Classify(n int) string {
	if n < 0 {
		return "neg"
	}
	if n == 0 {
		return "zero"
	}
	return "pos"
}
```

## hard
Sign returns -1 when negative, 0 when zero, and 1 when positive. InRange returns true when low <= n <= high.

```
func Sign(n int) int {
	if n < 0 {
		return -1
	}
	if n == 0 {
		return 0
	}
	return 1
}
```

```
func InRange(n, low, high int) bool {
	return low <= n && n <= high
}
```
