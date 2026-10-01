## explanation
Joining a host and port with string concatenation breaks for IPv6 because the host needs brackets. net.JoinHostPort handles that. In Go 1.25 an ignore block in go.mod names directories the go command will not look at.

```
net.JoinHostPort("::1", "80")
```

## apply
Use it when building an address to dial and when keeping a tools folder out of the packages go test walks.

## easy
Join an IPv4 host and port.

## hard
Join IPv6 correctly, and answer what ignore does.

## steps
- Do not concatenate host:port yourself
- Call JoinHostPort
- Remember that IPv6 needs brackets
- Answer the ignore question on the lesson page
