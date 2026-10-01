## explanation
A good interface for a caller is only as wide as the behavior the caller needs. If the caller only asks for bytes, one method Read is enough.

```
type Reader interface {
	Read(p []byte) (int, error)
}
```

A package name should be short and a noun, such as package http, not a long sentence.

```
package store
```

## apply
An error the caller must branch on has to be a value errors.Is can see, not text alone. ErrNotFound is a value the caller can compare.

```
var ErrNotFound = errors.New("not found")

func Find(id string) error {
	return fmt.Errorf("find %s: %w", id, ErrNotFound)
}
```

The caller writes errors.Is(err, ErrNotFound) and gets true because Find wraps with %w.

## easy
The interface is only as wide as the behavior the caller needs. Reader has only Read.

```
type Reader interface {
	Read(p []byte) (int, error)
}
```

## hard
An error the caller must branch on is a value errors.Is can see. The package name is short and a noun.

```
var ErrNotFound = errors.New("not found")

func Find(id string) error {
	return fmt.Errorf("find %s: %w", id, ErrNotFound)
}
```

```
package store
```
