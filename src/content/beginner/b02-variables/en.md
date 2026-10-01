## explanation
A variable is a name that holds a value for later. If you name the type and do not assign anything, Go fills in that type's zero value. An int is 0, a string is empty text, and a bool is false.

```
var count int
var name string
var ready bool

fmt.Println(count)
fmt.Println(name)
fmt.Println(ready)
```

You see 0, a blank line, then false.

## apply
When you need to print a value you stored, print the variable. Do not type the letters of its name as text.

```
lang := "go"
fmt.Println(lang)
```

You see go because that is the value inside lang.

## easy
Declare an int with no value and print the variable. You get 0.

```
var n int
fmt.Println(n)
```

## hard
A bool with no value is false, not true and not empty text.

```
var ok bool
fmt.Println(ok)
```
