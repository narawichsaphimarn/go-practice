## explanation
A variable is a labeled box. You put a value in the box and use it later by its name. Every box has a type that says what it can hold:

- `int` a whole number, such as 0, 42, -7
- `string` text, such as "go"
- `bool` a truth value, only `true` or `false`

There are two ways to declare a variable:

```
var count int
lang := "go"
```

The first line uses `var` with a name and a type but no value. The second uses `:=` to declare and fill the box at once, and Go picks the type from the value (so `lang` is a string). `:=` works only inside a function.

A variable declared without a value gets the zero value of its type: `0` for int, the empty string `""` for string, and `false` for bool.

## apply
Use `=` to change the value in a box that already exists, and `:=` only when you make a new box.

```
score := 10
score = score + 5
fmt.Println(score)
```

The output is 15. The second line reads: "take the old score, add 5, and put the result back in score."

Good to know: Go refuses to compile a variable you declare but never use. The error says `declared and not used`. Use the variable or delete it.

## easy
Example: keep a city name in a variable and print it.

```
city := "Bangkok"
fmt.Println(city)
```

You get `Bangkok` because Go prints what is in the box city, not the word city. `fmt.Println("city")`, with quotes, would print the word city instead.

## hard
Example: look at the zero value of a string, then change it.

```
var name string
fmt.Println(name == "")
name = "Ann"
fmt.Println(name)
```

The output is `true` and then `Ann`. The first line prints true because name is still the empty string (`==` asks whether two values are equal).
