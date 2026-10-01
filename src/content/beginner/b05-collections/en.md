## explanation
A slice is a row of values of one type, side by side, like numbered storage slots. The first slot is number 0, not 1.

```
prices := []int{40, 25, 60}
fmt.Println(prices[0])
fmt.Println(len(prices))
fmt.Println(prices[len(prices)-1])
```

- `prices[0]` is the first slot: 40.
- `len(prices)` is the number of slots: 3.
- So the last slot is number `len(prices)-1`, which is 2: 60.

Reading a slot that does not exist, such as `prices[3]`, stops the program (a panic). To add a value at the end, use `prices = append(prices, 10)`.

Walk every slot with `for ... range`, which gives two values each round: the slot number and the value in it.

```
for i, p := range prices {
	fmt.Println(i, p)
}
```

If you do not need the slot number, write `_` in its place: `for _, p := range prices`.

## apply
A map pairs names with values and looks them up by name instead of slot number, like a phone book.

```
ages := map[string]int{"ann": 20}
ages["bob"] = 31
fmt.Println(ages["ann"])
fmt.Println(ages["zed"])
```

This prints 20 and then 0. Looking up a missing name gives the zero value of the type. To know whether the name really exists, take a second value: in `age, ok := ages["zed"]`, ok is false when the name is missing.

Make a new empty map with `make(map[string]int)`.

How to choose: if order matters or you walk the items one by one, use a slice. If you look things up by name, use a map.

## easy
Example: find the largest value in a non-empty slice.

```
func Max(values []int) int {
	best := values[0]
	for _, v := range values {
		if v > best {
			best = v
		}
	}
	return best
}
```

`Max([]int{3, 9, 2})` is 9.

## hard
Example: add up sales per item from two slices of the same length.

```
func Totals(items []string, amounts []int) map[string]int {
	sum := make(map[string]int)
	for i, item := range items {
		sum[item] += amounts[i]
	}
	return sum
}
```

With items tea, cake, tea and amounts 2, 1, 3, tea is 5 and cake is 1. The line `sum[item] += amounts[i]` works even when the name is not in the map yet, because it starts from the zero value.
