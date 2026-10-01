## explanation
Passing a struct or an int copies it. A pointer refers to the original value, so a write through *n is visible to the caller.

```
func Inc(n *int) {
	*n++
}
```

## apply
Use it when the caller must observe the change, such as a counter, a swap, or a renamed field.

## easy
Increment through a pointer.

## hard
Swap two values, or set a field through a pointer.

## steps
- Put * on the parameter type
- Pass the address with &
- Check nil when the caller may pass it
- Write the value the caller can see
