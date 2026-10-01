## explanation
The smallest Go program that prints text has five lines.

```
package main

import "fmt"

func main() {
	fmt.Println("hello")
}
```

Read it line by line:

- `package main` says this file is a program you can run. (A package is a group of code; lesson 9 says more.)
- `import "fmt"` asks to use the package `fmt`, which has the printing functions.
- `func main() { ... }` is where the program starts. Go runs the lines inside the braces from top to bottom.
- `fmt.Println("hello")` prints hello and then moves to a new line.

Text inside quotes, such as `"hello"`, is called a string. Numbers need no quotes: `fmt.Println(1 + 2)` prints 3, because Go works out the sum first.

## apply
Three print functions come up all the time:

- `fmt.Println(...)` prints and then starts a new line. Several values are separated by spaces: `fmt.Println("total:", 2+5)` prints `total: 7`.
- `fmt.Print(...)` prints without a new line, so the next print continues on the same line.
- `fmt.Printf("...", ...)` prints using a pattern. `%d` is a slot for a number and `\n` starts a new line, which Printf does not add for you.

A `+` between two strings joins them: `"Go" + "pher"` gives `Gopher`.

## easy
Example: print two fruit names on two lines.

```
package main

import "fmt"

func main() {
	fmt.Println("apple")
	fmt.Println("banana")
}
```

The output is

```
apple
banana
```

## hard
Example: print the total price of 2 items at 15 baht each, letting Go do the multiplication.

```
package main

import "fmt"

func main() {
	fmt.Printf("total=%d baht\n", 2*15)
}
```

The output is `total=30 baht`, because Printf puts the result of `2*15` where `%d` is.
