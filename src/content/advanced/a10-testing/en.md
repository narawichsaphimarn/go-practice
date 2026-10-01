## explanation
A table test stores inputs and wanted results in a slice and calls one function in a loop. Failing cases belong in the same table as the normal ones so they are not forgotten.

```
cases := []struct {
	n    int
	want string
}{
	{-1, "neg"},
	{0, "zero"},
	{2, "pos"},
}
```

## apply
Use it for a pure function that classifies a number or checks a range.

## easy
Classify a number.

## hard
Check that a value is inside a range, or return its sign.

## steps
- Include both normal and boundary rows
- Put the case name in the error
- Do not share a variable across rows
- Keep going after a failure with t.Run
