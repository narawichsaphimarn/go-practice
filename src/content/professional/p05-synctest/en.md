## explanation
time.Sleep pauses the current goroutine for the duration you give it. WaitTick sleeps one second and returns 1. In a test that uses testing/synctest, the clock inside the bubble advances for you, so you do not wait one real second.

```
func WaitTick() int {
	time.Sleep(time.Second)
	return 1
}
```

Import "time".

## apply
Nap reports the time that passed after sleeping two seconds, using time.Since(start). AfterTick waits until a one-second time.After is ready, then returns true.

```
func Nap(start time.Time) time.Duration {
	time.Sleep(2 * time.Second)
	return time.Since(start)
}
```

If start is the time at the beginning, after a two-second sleep Nap is about two seconds.

## easy
WaitTick calls time.Sleep for one second and returns 1.

```
func WaitTick() int {
	time.Sleep(time.Second)
	return 1
}
```

## hard
AfterTick returns true only after a one-second time.After is ready. Nap returns the elapsed time after a two-second time.Sleep.

```
func AfterTick() bool {
	<-time.After(time.Second)
	return true
}
```

```
func Nap(start time.Time) time.Duration {
	time.Sleep(2 * time.Second)
	return time.Since(start)
}
```
