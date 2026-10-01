## explanation
Package unsafe steps around Go's type system. This exercise does not send unsafe code to the runner, because the checker does not accept code that bypasses the type system that way.

```
b := []byte("go")
fmt.Println(b)
```

This is how you look at the bytes of a string without unsafe.

## apply
A bad pointer conversion gives you a pointer that does not refer to a live object, then you read garbage or panic. The safer way to get the bytes of a string is a []byte conversion, which copies.

```
func bytesOf(s string) []byte {
	return []byte(s)
}
```

bytesOf("go") is a byte slice of g and o, and it does not hold a pointer into the original string.

## easy
The checker does not accept code that bypasses types with unsafe. Use an ordinary conversion instead.

```
b := []byte("go")
```

## hard
The safer path than unsafe, when you want the bytes of a string, is []byte(s). A bad pointer conversion gives a pointer that does not refer to a live object.

```
func bytesOf(s string) []byte {
	return []byte(s)
}
```
