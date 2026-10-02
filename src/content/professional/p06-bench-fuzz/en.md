## explanation
A benchmark measures how fast code runs and how much memory it allocates. It lives in a `_test.go` file, its name starts with Benchmark, and it takes a `*testing.B`.

```
func BenchmarkJoin(b *testing.B) {
	parts := []string{"a", "b", "c"}
	for b.Loop() {
		strings.Join(parts, ",")
	}
}
```

`b.Loop()` (Go 1.24) keeps looping until it has enough time for an accurate measurement. Run `go test -bench=. -benchmem` and you get something like

```
BenchmarkJoin-8   20000000   61 ns/op   16 B/op   1 allocs/op
```

- `ns/op` is the average time per call, in nanoseconds.
- `B/op` is the bytes allocated per call.
- `allocs/op` is how many heap allocations each call makes. The fewer, the less work for the garbage collector.

## apply
Fuzzing hunts for inputs that break a function. It keeps feeding in random values and checks a property that must always hold, such as "reversing text twice gives the original".

```
func FuzzTrim(f *testing.F) {
	f.Add("  go  ")
	f.Fuzz(func(t *testing.T, s string) {
		once := strings.TrimSpace(s)
		if strings.TrimSpace(once) != once {
			t.Fatalf("trimming twice changed %q", s)
		}
	})
}
```

- `f.Add(...)` adds seed values you definitely want tried.
- `f.Fuzz(...)` is the function called with the random values.

A plain `go test` runs only the seeds, like an ordinary test. `go test -fuzz=FuzzTrim` keeps generating values; when one breaks the function, Go saves it under testdata so it can be replayed.

## easy
Example: read two benchmark lines, before and after a change.

```
BenchmarkOld-8   1000000   1200 ns/op   5 allocs/op
BenchmarkNew-8   3000000    400 ns/op   1 allocs/op
```

The new version is three times faster (1200 down to 400 ns/op) and makes fewer heap allocations, 1 instead of 5 per call.

## hard
Example: a fuzz target that checks converting a number to text and back does not change it.

```
func FuzzItoa(f *testing.F) {
	f.Add(0)
	f.Add(-42)
	f.Fuzz(func(t *testing.T, n int) {
		back, err := strconv.Atoi(strconv.Itoa(n))
		if err != nil || back != n {
			t.Fatalf("%d came back as %d, %v", n, back, err)
		}
	})
}
```

A fuzz target does not know the right answer for each value. It only checks a property that must hold for every value, so it works without knowing what the random input was.
