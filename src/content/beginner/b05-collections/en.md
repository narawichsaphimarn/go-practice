## explanation
A slice is a row of values in order. Use it when you walk every item from first to last. A map pairs a name with a value. Use it when you look up by name, not by position.

```
values := []int{1, 2, 3}
total := 0
for _, n := range values {
	total += n
}
```

```
ages := map[string]int{"ann": 20}
fmt.Println(ages["ann"])
```

## apply
Add up a list of scores with a slice, one number at a time. Look up a person's age with a map, using the name as the key.

## easy
Sum adds the numbers in a slice. An empty list has nothing to add, so it returns 0.

```
func Sum(values []int) int {
	total := 0
	for _, n := range values {
		total += n
	}
	return total
}
```

## hard
Last returns the final item. An empty slice has no final item, so it returns 0.

```
func Last(values []int) int {
	if len(values) == 0 {
		return 0
	}
	return values[len(values)-1]
}
```

Count how often target appears by adding one each time a value matches.

```
func Count(values []int, target int) int {
	found := 0
	for _, n := range values {
		if n == target {
			found++
		}
	}
	return found
}
```
