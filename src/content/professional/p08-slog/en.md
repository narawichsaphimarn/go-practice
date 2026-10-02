## explanation
A plain-text log line such as `user ada saved file` is easy for people to read but hard for machines to search. A structured log stores data as key and value pairs, so you can search for "every line where user=ada". Package `log/slog` does this.

```
log := slog.New(slog.NewTextHandler(os.Stdout, nil))
log.Info("saved", "user", "ada", "bytes", 512)
```

This writes a line like

```
time=... level=INFO msg=saved user=ada bytes=512
```

- `slog.New(handler)` creates a logger, and the handler sets the format: `NewTextHandler` writes key=value and `NewJSONHandler` writes JSON.
- `Info`, `Warn`, `Error`, and `Debug` are the levels. The first argument is the message; the rest are key and value pairs.

## apply
Data that belongs on every line, such as a request id or a user name, is attached once with `With` instead of repeating it every time.

```
reqLog := log.With("request_id", "r-17")
reqLog.Info("start")
reqLog.Warn("slow", "ms", 900)
```

Both lines carry `request_id=r-17`.

The lowest level to record is set in HandlerOptions. In production you may not want Info at all.

```
h := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelWarn})
```

This handler drops Debug and Info and keeps only Warn and Error.

To make a value's type explicit, use `slog.Int("code", 7)` or `slog.String("user", "ada")` instead of a separate key and value.

## easy
Example: log that an order succeeded, with its id and total.

```
func Ordered(w io.Writer, id string, total int) {
	log := slog.New(slog.NewTextHandler(w, nil))
	log.Info("ordered", "id", id, "total", total)
}
```

This gives `level=INFO msg=ordered id=A1 total=250` after the time.

## hard
Example: a service logger whose every line names the service, in JSON.

```
func ServiceLog(w io.Writer, name string) *slog.Logger {
	return slog.New(slog.NewJSONHandler(w, nil)).With("service", name)
}

log := ServiceLog(os.Stdout, "billing")
log.Error("charge failed", "card", "visa")
```

The JSON includes `"service":"billing"` and `"card":"visa"`. Most log storage systems read JSON directly.
