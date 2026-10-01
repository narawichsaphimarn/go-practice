## explanation
slog writes a log as a message plus key and value pairs, instead of mixing them into one sentence. Line builds a logger that writes to a Writer, then records msg with the key value pair.

```
func Line(w io.Writer, msg, key, value string) {
	logger := slog.New(slog.NewTextHandler(w, nil))
	logger.Info(msg, key, value)
}
```

Import "log/slog" and "io". Line(w, "saved", "id", "7") writes a line with the message saved and the pair id=7.

## apply
Level Warn is a warning, not ordinary information. With attaches an attribute to a logger, and every line that logger writes carries that attribute.

```
func Warn(w io.Writer, code int) {
	logger := slog.New(slog.NewTextHandler(w, nil))
	logger.Warn("warn", "code", code)
}
```

```
func WithUser(w io.Writer, user, msg string) {
	logger := slog.New(slog.NewTextHandler(w, nil)).With("user", user)
	logger.Info(msg)
}
```

WithUser(w, "ann", "login") writes a login line that also carries user=ann.

## easy
Line records msg and a key value pair to a Writer.

```
func Line(w io.Writer, msg, key, value string) {
	logger := slog.New(slog.NewTextHandler(w, nil))
	logger.Info(msg, key, value)
}
```

## hard
WithUser makes the logger attach the user attribute to the line. Warn uses level Warn and includes the key code.

```
func WithUser(w io.Writer, user, msg string) {
	logger := slog.New(slog.NewTextHandler(w, nil)).With("user", user)
	logger.Info(msg)
}
```

```
func Warn(w io.Writer, code int) {
	logger := slog.New(slog.NewTextHandler(w, nil))
	logger.Warn("warn", "code", code)
}
```
