## explanation
An interface names the behavior you need, not the data type. Callers depend only on the methods they use, such as Speak.

```
type Speaker interface {
	Speak() string
}
```

## apply
Use it when several concrete types should answer the same way, such as animals that speak or storage that saves.

## easy
A first implementation.

## hard
A second one, or a function that accepts the interface.

## steps
- Keep the interface small
- Attach the method to the concrete type
- Accept the interface in the caller
- Do not force a concrete type on the caller
