## explanation
log/slog records a message plus key and value pairs. The text handler prints msg= and key=value. Concatenating one string makes it hard for a machine to split the fields.

```
logger.Info("hello", "user", "ada")
```

## apply
Use it in a service that searches logs by user id or request id.

## easy
Write one line that has a message and a key.

## hard
Pass values of different kinds while keeping pairs.

## steps
- Build a logger from a handler
- Pass a key followed by its value
- Do not concatenate the whole line yourself
- Check that the result has both msg and the key
