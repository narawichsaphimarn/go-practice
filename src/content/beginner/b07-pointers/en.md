## explanation
An ordinary variable is a value you can copy. A pointer is the address of the original value. Writing through the pointer changes the original, not a copy.

```
n := 1
Inc(&n)
fmt.Println(n)
```

After Inc, n is 2 because the function wrote over the value at that address.

## apply
Add one to a click counter in place with Inc. Exchange two scores with Swap. Change the name on a User you were given as a pointer with SetName.

## easy
Inc adds one to the value the pointer points at.

```
func Inc(n *int) {
	*n = *n + 1
}
```

## hard
Swap exchanges the values of two pointers by saving one first. SetName sets Name on the User the pointer points at.

```
func Swap(a, b *int) {
	kept := *a
	*a = *b
	*b = kept
}
```

```
func SetName(u *User, name string) {
	u.Name = name
}
```
