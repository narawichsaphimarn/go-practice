## explanation
An `io.Reader` is something you can read data out of, a piece at a time, and an `io.Writer` is something you can write data into. Both are interfaces with a single method.

```
type Reader interface {
	Read(p []byte) (n int, err error)
}

type Writer interface {
	Write(p []byte) (n int, err error)
}
```

Files, network connections, `strings.NewReader("...")`, and `bytes.Buffer` are all Readers or Writers, so a function that takes an `io.Reader` works with any source, like a hose that fits any tap.

Read returns `io.EOF` when the data runs out. That is not a failure; it only says the data has ended.

## apply
You rarely call Read yourself. Use the functions in package io:

- `io.ReadAll(r)` reads everything and returns a `[]byte`. Handy for small data.
- `io.Copy(w, r)` moves data from r to w piece by piece, never holding it all in memory.
- `io.WriteString(w, s)` writes text to w.
- `io.LimitReader(r, n)` wraps r so it gives at most n bytes.
- `io.Discard` is a Writer that throws everything away, for when you only want to count or drain.

For a 2 GB file, ReadAll needs 2 GB of memory, while io.Copy only ever uses a small buffer.

## easy
Example: read all the text and count the lines.

```
func Lines(r io.Reader) (int, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return 0, err
	}
	return strings.Count(string(data), "\n"), nil
}
```

`Lines(strings.NewReader("a\nb\n"))` is 2.

## hard
Example: copy data to a destination and report how many bytes went across, without holding it all.

```
func Save(dst io.Writer, src io.Reader) (int64, error) {
	n, err := io.Copy(dst, src)
	if err != nil {
		return n, fmt.Errorf("save: %w", err)
	}
	return n, nil
}
```

dst can be a file, a `bytes.Buffer`, or `os.Stdout`. Save does not need to know, because it only takes an io.Writer.
