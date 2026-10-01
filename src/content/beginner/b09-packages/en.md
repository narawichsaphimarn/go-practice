## explanation
A package is a folder of `.go` files about one topic. Every file in the folder starts with the same `package name` line. A module is the whole project, with a `go.mod` file in its top folder.

```
module example.com/shop

go 1.25
```

- `module example.com/shop` is the module name, the start of every import path in the project.
- `go 1.25` is the Go language version the project uses.

A package in the folder `price` of this module is imported with the path `"example.com/shop/price"` and used with the package name in front, as in `price.Total(...)`.

## apply
A name that starts with a capital letter is exported, which means other packages can use it. A name that starts with a lowercase letter is only usable inside its own package.

```
package price

func Total(a, b int) int {
	return a + b + fee()
}

func fee() int {
	return 5
}
```

Other packages can call `price.Total(10, 20)` but not `price.fee()`, because fee starts with a lowercase letter.

The standard packages that ship with Go follow the same rule: `fmt.Println` starts with a capital P. You import them by short names such as `"fmt"` or `"strings"`, with no module name in front.

## easy
Example: use package strings to check whether text starts with a word.

```
import "strings"

func IsGreeting(s string) bool {
	return strings.HasPrefix(s, "hello")
}
```

`IsGreeting("hello there")` is true. You do not write a loop to compare letters, because package strings already has this function.

## hard
Example: import two packages at once by putting them in one pair of parentheses.

```
import (
	"strconv"
	"strings"
)

func Tag(name string, n int) string {
	return strings.ToLower(name) + "-" + strconv.Itoa(n)
}
```

`Tag("Tea", 3)` is `tea-3`. `strconv.Itoa` turns a number into text, the reverse of `strconv.Atoi`.
