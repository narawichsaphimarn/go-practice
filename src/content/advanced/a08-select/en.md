## explanation
select waits on several channels. The case that is ready first runs. default does not wait. time.After leaves when the time is up.

```
select {
case v := <-ch:
	return v
default:
	return 0
}
```

## apply
Use it in a client that must not hang and in a loop that accepts either work or a cancel signal.

## easy
Pick the channel that is ready.

## hard
Return immediately when nothing is ready, or return a sentinel when time runs out.

## steps
- Put every channel you can wait on in the select
- Use default when you must not block
- Use time.After when you must bound the wait
- Remember that After starts a timer
