## explanation
GOMAXPROCS is how many threads Go uses to run goroutines at once. Starting with Go 1.25 on Linux, when a cgroup CPU limit exists, the default GOMAXPROCS comes from that limit.

```
func show() int {
	return runtime.GOMAXPROCS(0)
}
```

runtime.GOMAXPROCS(0) returns the current value and does not change it. Import "runtime".

## apply
If you set GOMAXPROCS yourself, that value wins over the cgroup adjustment. This behavior applies on Linux when a cgroup limit exists, not on every platform.

```
runtime.GOMAXPROCS(2)
```

After this line the program uses 2 even if the cgroup would allow more.

## easy
On Linux, Go 1.25 uses the cgroup CPU limit as the default GOMAXPROCS when one is set.

```
func show() int {
	return runtime.GOMAXPROCS(0)
}
```

## hard
This behavior applies on Linux when a cgroup limit exists. If you set GOMAXPROCS yourself, the explicit value wins over the cgroup adjustment.

```
runtime.GOMAXPROCS(2)
```
