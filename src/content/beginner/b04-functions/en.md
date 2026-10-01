## explanation
A function can return multiple values. The common pair is a result and an error. The caller checks the error before using the result.

```
func add(a, b int) int {
	return a + b
}
```

## apply
Use it to move calculation out of main so the same work can be tested and reused.

## easy
A function adds two numbers and main prints the result.

## hard
A division function returns an error when the divisor is zero.

## steps
- Write the function outside main
- Call it from main
- Check the error when there is one
- Print only the required text
