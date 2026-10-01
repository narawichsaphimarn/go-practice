## explanation
error is an interface. nil means success. A function that can fail should return an error, and the caller checks it before using the result.

```
if b == 0 {
	return 0, errors.New("divide by zero")
}
```

## apply
Use it for bad input, such as division by zero, parsing a positive number, or requiring a non-empty value.

## easy
Divide and return an error when the divisor is zero.

## hard
Parse a positive number, or reject an empty string.

## steps
- Return an error when the condition fails
- Return nil on success
- Do not pair a trusted result with an error
- Let the test cover both paths
