## explanation
A network address is a host plus a port. net.JoinHostPort joins those two parts correctly for both IPv4 and IPv6. Host uses it with 127.0.0.1 and port 8080.

```
func Host() string {
	return net.JoinHostPort("127.0.0.1", "8080")
}
```

Host() is "127.0.0.1:8080". Import "net".

## apply
An IPv6 address needs brackets before the port, or a reader cannot tell where the port starts. V6 calls JoinHostPort with ::1 and 80 and gets "[::1]:80". An ignore block in a Go 1.25 go.mod tells the go command to skip the named directories and not treat them as packages in the module.

```
func V6() string {
	return net.JoinHostPort("::1", "80")
}
```

```
ignore (
	./tmp
	./scratch
)
```

The go command will not compile packages in the tmp and scratch folders.

## easy
Host returns net.JoinHostPort of 127.0.0.1 and 8080.

```
func Host() string {
	return net.JoinHostPort("127.0.0.1", "8080")
}
```

## hard
An ignore block in go.mod makes the go command skip the named directories. V6 returns the address of ::1 port 80 with brackets.

```
ignore (
	./tmp
)
```

```
func V6() string {
	return net.JoinHostPort("::1", "80")
}
```
