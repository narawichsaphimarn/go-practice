## explanation
WaitGroup.Add must run before go, in the goroutine that will Wait, not inside the new goroutine. go vet has a waitgroup check that warns when Add happens inside the goroutine that was just started. Done belongs in defer.

```
wg.Add(1)
go func() {
	defer wg.Done()
}()
wg.Wait()
```

## apply
Use it to wait for a batch that does not return one value at a time, such as closing several resources together.

## easy
Count finished jobs.

## hard
Place Add before go so vet stays quiet.

## steps
- Call Add before go
- Put Done in defer
- Call Wait after the jobs are started
- Keep go vet quiet
