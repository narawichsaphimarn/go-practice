## explanation
Generics let you write a function once and use it for many types, instead of writing `SumInts` and `SumFloats` separately. The type left open is called a type parameter, written in square brackets after the function name.

```
func First[T any](s []T) T {
	return s[0]
}
```

`T` stands for a type, and `any` is the constraint: T may be any type. When you call `First([]string{"a", "b"})`, the compiler works out that T is string.

The type is fixed at compile time, not at run time. If you use the wrong type, the program does not compile in the first place.

## apply
A constraint says what the function may do with T. Choose the narrowest one that still works:

- `any` accepts every type, but you cannot compare or add values; you can only store and pass them on.
- `comparable` allows `==` and `!=`, for example to search a slice.
- `cmp.Ordered`, from package `cmp`, allows `<` and `>`, for example to find a minimum or to sort.

```
func Max[T cmp.Ordered](a, b T) T {
	if a > b {
		return a
	}
	return b
}
```

`Max(3, 8)` is 8 and `Max("kiwi", "apple")` is kiwi, because strings compare in alphabetical order.

A function can have several type parameters, such as `[T, U any]`, when the input and output types differ.

## easy
Example: count how many times a value appears, for ints and strings alike.

```
func CountOf[T comparable](s []T, v T) int {
	n := 0
	for _, x := range s {
		if x == v {
			n++
		}
	}
	return n
}
```

It needs `comparable` because the function uses `x == v`. With `any` it would not compile.

## hard
Example: turn every value in a slice into a number with a function you pass in, and add the results.

```
func SumBy[T any](s []T, f func(T) int) int {
	total := 0
	for _, x := range s {
		total += f(x)
	}
	return total
}

words := []string{"go", "rust"}
fmt.Println(SumBy(words, func(w string) int { return len(w) }))
```

This prints 6. T is string, but the total is always an int, because f returns an int.
