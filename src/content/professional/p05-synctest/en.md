## explanation
testing/synctest in Go 1.25 tests code that calls time.Sleep. The clock inside the bubble advances when every goroutine in the bubble is idle, so the test does not wait a real second.

```
synctest.Test(t, func(t *testing.T) {
	time.Sleep(time.Second)
})
```

## apply
Use it for code that cancels on a timer or waits before a retry, without slowing the suite down.

## easy
Sleep one second inside the bubble and return 1.

## hard
Return how far the bubble clock moved.

## steps
- Call time.Sleep in the function under test
- Do not depend on real time outside the bubble
- The hidden test wraps the call in synctest.Test
- Check both the returned value and the clock
