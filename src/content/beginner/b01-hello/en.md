## explanation
A Go program starts at func main, and that function must live in a package named main. The go.mod file says this folder is one module and that it uses Go 1.25.

```
package main

import "fmt"

func main() {
	fmt.Println("hello")
}
```

```
module example.com/hello

go 1.25
```

In the folder that holds both files, go run . compiles and runs main, and you see the word hello.

## apply
A command-line tool that prints a result and exits uses main like this. This greeting script prints two lines and then the program ends.

```
package main

import "fmt"

func main() {
	fmt.Println("go")
	fmt.Println("1.25")
}
```

go run . prints

```
go
1.25
```

## easy
Print the word hello on one line. Println adds the newline for you.

```
package main

import "fmt"

func main() {
	fmt.Println("hello")
}
```

## hard
Print sum=3 by calculating 1+2 and joining it to the text. Do not type the digit 3 as a fixed word.

```
package main

import "fmt"

func main() {
	fmt.Printf("sum=%d\n", 1+2)
}
```
