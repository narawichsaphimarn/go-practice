## explanation
fmt.Errorf with %w wraps the original error. errors.Is walks the chain to compare a sentinel. errors.As pulls out a specific type. Comparing the error text breaks when someone edits the sentence.

```
return fmt.Errorf("open: %w", err)
```

## apply
Use it when a layer adds context and the caller still needs to know the cause was ErrNotFound or a coded type.

## easy
Wrap and use errors.Is.

## hard
Use errors.As with your own type.

## steps
- Wrap with %w
- Declare a sentinel with errors.New
- Check with Is or As
- Do not use strings.Contains on Error()
