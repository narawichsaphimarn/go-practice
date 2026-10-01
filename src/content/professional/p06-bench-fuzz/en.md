## explanation
go test -bench measures time per operation. The result shows ns/op and may show allocs/op. Fuzzing feeds random inputs and watches for a panic. A fuzz target takes *testing.F, then calls f.Add and f.Fuzz.

```
func FuzzParse(f *testing.F) {
	f.Add("seed")
	f.Fuzz(func(t *testing.T, s string) {
		_ = len(s)
	})
}
```

## apply
Use it when tuning a hot function and when searching for input that breaks a parser.

## easy
Read the columns of a bench result.

## hard
The shape of a fuzz target.

## steps
- Separate ns/op from allocs/op
- A smaller number means faster
- Remember that fuzz lives in _test.go
- Answer on this page
