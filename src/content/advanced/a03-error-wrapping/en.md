## explanation
As an error travels up through the layers of a program, each layer should add context about what it was doing without throwing away the original cause, like putting a letter in an envelope and writing on the envelope. The letter inside is still intact.

```
var ErrNotFound = errors.New("not found")

func Find() error {
	return fmt.Errorf("find user 7: %w", ErrNotFound)
}
```

`%w` wraps ErrNotFound inside. The full message is `find user 7: not found`. `%v` would keep only the text, and the original cause would be lost.

## apply
The caller can find the cause in two ways, without comparing text:

- `errors.Is(err, ErrNotFound)` asks whether this error is inside any of the envelopes. Use it for errors declared as variables (sentinel errors).
- `errors.As(err, &target)` looks for an error of target's type and, if found, stores it in target. Use it when the error carries extra data, such as a code.

```
type HTTPError struct{ Status int }

func (e HTTPError) Error() string { return fmt.Sprint("status ", e.Status) }

var he HTTPError
if errors.As(err, &he) {
	fmt.Println(he.Status)
}
```

Why not compare text: the wording changes whenever someone edits it, and two different errors can say the same thing by accident. errors.Is checks for the very same value.

When several things went wrong at once, `errors.Join(e1, e2)` combines them into one error that errors.Is can still search, and Join returns nil when there is nothing to combine.

## easy
Example: add a file name to an error from a lower layer.

```
func ReadConfig(name string) error {
	err := ErrNotFound
	return fmt.Errorf("read %s: %w", name, err)
}
```

`ReadConfig("app.yaml")` says `read app.yaml: not found`, and `errors.Is(..., ErrNotFound)` is still true.

## hard
Example: turn an error into an HTTP status by looking at the cause inside.

```
func StatusOf(err error) int {
	var he HTTPError
	switch {
	case err == nil:
		return 200
	case errors.As(err, &he):
		return he.Status
	case errors.Is(err, ErrNotFound):
		return 404
	default:
		return 500
	}
}
```

A `switch` with nothing after the keyword picks the first case whose condition is true. An error that wraps HTTPError{Status: 403}, however deep, gives 403.
