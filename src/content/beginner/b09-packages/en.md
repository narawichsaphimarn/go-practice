## explanation
Functions in the same package call each other by name. The module's go.mod names the module and the Go version.

```
module example.com/app

go 1.25
```

```
package main

func Greet(name string) string {
	return "hello " + name
}
```

A caller in package main writes Greet("ann") and gets hello ann.

## apply
A greeting, two pieces joined by a comma, and a version string are separate functions in one package. Call them again without copying the text.

## easy
Greet returns the word hello, one space, then the name.

```
func Greet(name string) string {
	return "hello " + name
}
```

## hard
Version returns the string 1.25. Join connects a and b with a comma between them.

```
func Version() string {
	return "1.25"
}
```

```
func Join(a, b string) string {
	return a + "," + b
}
```
