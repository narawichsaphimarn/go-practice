## explanation
A benchmark measures how long a function takes for one operation. The result has an ns/op column, the average time in nanoseconds for one operation.

```
func BenchmarkSum(b *testing.B) {
	for i := 0; i < b.N; i++ {
		SumJobs([]int{1, 2, 3})
	}
}
```

A result of 40 ns/op means one SumJobs call takes 40 nanoseconds on average. Import "testing".

## apply
allocs/op is how many times one operation allocates on the heap. A lower number means fewer allocations. A fuzz target is a function named Fuzz that takes *testing.F and calls f.Fuzz so the tool can feed random inputs.

```
func FuzzSign(f *testing.F) {
	f.Add(0)
	f.Fuzz(func(t *testing.T, n int) {
		got := Sign(n)
		if got < -1 || got > 1 {
			t.Fatalf("Sign(%d)=%d", n, got)
		}
	})
}
```

f.Add(0) is a starting seed. f.Fuzz is the function called with the random values.

## easy
ns/op is the average time in nanoseconds for one operation. You read it from a Benchmark result.

```
func BenchmarkSum(b *testing.B) {
	for i := 0; i < b.N; i++ {
		SumJobs([]int{1, 2, 3})
	}
}
```

## hard
A minimal fuzz target is a function whose name starts with Fuzz, takes *testing.F, and calls f.Fuzz. A lower allocs/op means one operation allocates less on the heap.

```
func FuzzSign(f *testing.F) {
	f.Add(0)
	f.Fuzz(func(t *testing.T, n int) {
		got := Sign(n)
		if got < -1 || got > 1 {
			t.Fatalf("Sign(%d)=%d", n, got)
		}
	})
}
```
