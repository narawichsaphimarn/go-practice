## explanation
A program does not always run every line. Sometimes it must choose a path, and sometimes it must repeat. There are three main tools: `if` runs code when a condition is true, `for` repeats, and `switch` chooses by value.

Conditions are built by comparing values:

- `==` equal, `!=` not equal
- `<` less, `<=` less or equal, `>` greater, `>=` greater or equal
- `&&` and, `||` or, `!` not (flips true and false)

```
age := 20
if age >= 18 {
	fmt.Println("adult")
} else {
	fmt.Println("child")
}
```

This prints `adult` because 20 is at least 18. `else` is the path taken when the condition is false.

## apply
A counting `for` has three parts separated by `;`.

```
for i := 1; i <= 3; i++ {
	fmt.Println(i)
}
```

- `i := 1` runs once before the loop starts.
- `i <= 3` is checked before every round; when it is false, the loop stops.
- `i++` runs after each round and adds one to i. (`i--` subtracts one.)

The output is 1, 2, 3 on separate lines.

`switch` compares one value with several cases and runs only the matching one. You do not write break.

```
light := "red"
switch light {
case "red":
	fmt.Println("stop")
case "green":
	fmt.Println("go")
default:
	fmt.Println("wait")
}
```

`default` handles a value that matches no case.

## easy
Example: print even when a number is even (`%` gives the remainder of a division).

```
n := 6
if n%2 == 0 {
	fmt.Println("even")
}
```

## hard
Example: print the odd numbers from 1 to 7, one per line.

```
for i := 1; i <= 7; i += 2 {
	fmt.Println(i)
}
```

`i += 2` means `i = i + 2`, so the loop gives 1, 3, 5, 7 and stops, because the next i is 9, which fails `i <= 7`.
