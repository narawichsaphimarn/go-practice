## explanation
Wrap an error with %w so the original cause stays attached. errors.Is walks that chain looking for one error value. errors.As pulls out a type you name. Do not compare the printed text.

```
var ErrBoom = errors.New("boom")

func Wrap() error {
	return fmt.Errorf("wrap: %w", ErrBoom)
}

errors.Is(Wrap(), ErrBoom)
```

That is true because Wrap wrapped ErrBoom, even though the outer text is wrap: boom.

## apply
An outer service wraps an inner failure. The caller checks for ErrBoom without caring about the extra sentence. If the error carries a code inside a struct, pull it out with errors.As.

```
type CodeError struct{ Code int }

func (e CodeError) Error() string { return "code" }

func AsCode(err error) int {
	var target CodeError
	if errors.As(err, &target) {
		return target.Code
	}
	return 0
}
```

## easy
Wrap wraps ErrBoom with %w, so errors.Is finds ErrBoom.

```
func Wrap() error {
	return fmt.Errorf("wrap: %w", ErrBoom)
}
```

## hard
HasBoom returns true when the chain contains ErrBoom, even after several wraps. AsCode reads the Code field from a wrapped CodeError.

```
func HasBoom(err error) bool {
	return errors.Is(err, ErrBoom)
}
```

```
func AsCode(err error) int {
	var target CodeError
	if errors.As(err, &target) {
		return target.Code
	}
	return 0
}
```
