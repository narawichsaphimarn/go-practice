## explanation
An io.Reader is something you can read bytes from, a chunk at a time. An io.Writer is something you can write bytes to. You do not need to know whether the other side is a file, memory, or the network.

```
text, err := ReadAll(strings.NewReader("go"))
```

text is go because that Reader holds the text go in memory.

## apply
Read a short note in one go. Write the same sentence into a log twice. Count the bytes that pass through without keeping the contents.

## easy
ReadAll reads until the end and returns a string.

```
func ReadAll(r io.Reader) (string, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return "", err
	}
	return string(data), nil
}
```

## hard
Count returns how many bytes were read and does not return the contents. WriteTwice writes the same string to the Writer twice.

```
func Count(r io.Reader) (int, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return 0, err
	}
	return len(data), nil
}
```

```
func WriteTwice(w io.Writer, s string) error {
	for i := 0; i < 2; i++ {
		if _, err := io.WriteString(w, s); err != nil {
			return err
		}
	}
	return nil
}
```
