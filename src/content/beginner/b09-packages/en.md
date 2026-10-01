## explanation
Files in one folder with the same package name form one package. go.mod marks the module boundary. This exercise stays in one package main file because the runner accepts one source blob. The rule is still to export a name with a capital letter when another package should call it.

```
func Greet(name string) string {
	return "hello " + name
}
```

## apply
Use it when a helper should leave main so the rest of the module can call it.

## easy
Greet someone by name.

## hard
Join strings, or return the language version.

## steps
- Start the name with a capital letter
- Keep it in this package main file
- Do not import an outside module
- Use the name the test calls
