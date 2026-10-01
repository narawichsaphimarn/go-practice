## explanation
Concurrent work means several goroutines each do one piece at the same time. If every job starts with no limit, the machine can be overwhelmed. A channel of size limit is a parking slot. A job must take a slot before it starts. When the slots are full, the next job waits.

```
func SumJobs(values []int) int {
	total := 0
	for _, v := range values {
		total += v
	}
	return total
}
```

SumJobs([]int{1, 2, 3}) is 6 because it adds every value in the slice.

## apply
CountJobs reports how many jobs there are by looking at the length of jobs. Run takes the function list jobs and lets at most limit of them run at once. The channel is the parking slot. The WaitGroup waits until every job finishes.

```
func Run(limit int, jobs []func()) {
	sem := make(chan struct{}, limit)
	var wg sync.WaitGroup
	for _, job := range jobs {
		wg.Add(1)
		sem <- struct{}{}
		go func() {
			defer wg.Done()
			defer func() { <-sem }()
			job()
		}()
	}
	wg.Wait()
}
```

Import "sync". Since Go 1.22 each loop iteration gets a fresh job variable, so the goroutine can use job directly without passing it as a parameter. If limit is 2 and there are 5 jobs, at most 2 goroutines are inside job at the same time.

## easy
SumJobs adds every value in the slice and returns the total.

```
func SumJobs(values []int) int {
	total := 0
	for _, v := range values {
		total += v
	}
	return total
}
```

## hard
Run lets at most limit jobs run at the same time. CountJobs returns how many jobs there are from the length of jobs.

```
func Run(limit int, jobs []func()) {
	sem := make(chan struct{}, limit)
	var wg sync.WaitGroup
	for _, job := range jobs {
		wg.Add(1)
		sem <- struct{}{}
		go func() {
			defer wg.Done()
			defer func() { <-sem }()
			job()
		}()
	}
	wg.Wait()
}
```

```
func CountJobs(limit int, jobs []int) int {
	return len(jobs)
}
```
