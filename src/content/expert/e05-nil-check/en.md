## explanation
Using a nil pointer to read a field, or calling a method that touches a field, panics with a nil pointer dereference. Go 1.25 still checks this at run time. This lesson really panics on the runner. It is not a quiz.

```
var p *int
fmt.Println(*p)
```

## apply
Use it as the example of a bug that uses a result before checking an error or a nil.

## easy
Dereference a nil pointer.

## hard
Read a field or call a method through a nil pointer.

## steps
- Declare a pointer with no target
- Use that value immediately
- Run and read the panic
- Check passes when stderr contains nil pointer
