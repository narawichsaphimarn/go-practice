## explanation
The spec no longer uses the term core type as the way it explains the rule. When you say what a type parameter can do, say it from the constraint. If the constraint supports addition, values of that type can be added.

```
func Add[T ~int | ~float64](a, b T) T {
	return a + b
}
```

Add(1, 2) is 3 because the constraint supports addition for int.

## apply
cmp.Ordered is the constraint for types that have an order, such as int and string. A value limited by cmp.Ordered can be compared with <.

```
func Min[T cmp.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}
```

Import "cmp". Min(3, 1) is 1 because 3 < 1 is false, so it returns b.

## easy
The spec no longer explains the rule with the term core type. Explain it by the operation the constraint supports.

```
func Add[T ~int | ~float64](a, b T) T {
	return a + b
}
```

## hard
cmp.Ordered lets you compare values with ordering operators. Addition on a type parameter is explained by saying the constraint supports addition.

```
func Min[T cmp.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}
```
