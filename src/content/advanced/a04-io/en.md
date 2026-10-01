## explanation
io.Reader and io.Writer are small interfaces that files, network connections, and bytes.Buffer all implement. io.ReadAll is fine for a small payload. io.Copy to io.Discard counts bytes without keeping the payload.

```
text, err := io.ReadAll(r)
```

## apply
Use it when reading a request body or writing twice to a log without binding the function to a real file.

## easy
Read the whole stream into a string.

## hard
Write twice, or count bytes.

## steps
- Accept a Reader or a Writer
- Check the error from Read or Write
- Defer a close for what you opened
- Choose Copy when you do not need the contents
