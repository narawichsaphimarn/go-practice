## explanation
A nil pointer does not point at an object. Dereferencing it means reading the value it points at. The main below is meant to panic because it reads a nil *int.

```
func main() {
	var p *int
	fmt.Println(*p)
}
```

p does not point at a real int, so *p panics with a nil pointer.

## apply
A nil struct pointer cannot have its fields read, and a method that reads a field on a nil receiver panics too. All three forms are meant to crash the program.

```
type Box struct {
	N int
}

func main() {
	var b *Box
	fmt.Println(b.N)
}
```

b does not point at a real Box, so b.N panics.

## easy
Make main panic by dereferencing a nil *int.

```
func main() {
	var p *int
	fmt.Println(*p)
}
```

## hard
Call the method Label, which reads a field on a nil receiver. The program must panic. Reading a field through a nil struct pointer panics too.

```
type User struct {
	Name string
}

func (u *User) Label() string {
	return u.Name
}

func main() {
	var u *User
	fmt.Println(u.Label())
}
```

```
type Box struct {
	N int
}

func main() {
	var b *Box
	fmt.Println(b.N)
}
```
