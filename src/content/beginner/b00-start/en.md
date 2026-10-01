## explanation
This site lets you write Go and check your answer right away, with nothing to install. Each lesson has a short explanation followed by four exercises: easy, mid, hard, and a twist.

There are three kinds of exercise:

- Output (stdout): The program has `func main`. The site runs it and compares what it prints with the answer, character by character.
- Test: you write only a function, with no `func main`. Hidden test code on the site calls the function with several inputs and compares the results with the right answers.
- Multiple choice (quiz): Pick an answer on the lesson page and press Submit.

## apply
The exercise page has an editor and four buttons:

- `Format` lays out indentation and spacing the standard Go way.
- `Vet` looks for code that is probably wrong before you run it.
- `Run` runs a program that has `func main` and shows the output. It only shows the output; it does not check your answer.
- `Check` checks the exercise rule. If you pass, your points are saved.

A test exercise has no `func main`, so it cannot be run. Press Check directly. If it fails, the output panel tells you which value was wrong.

## easy
Example: the exercise says "Print hi" and the starter code is

```
package main

import "fmt"

func main() {
	fmt.Println("todo")
}
```

Change only the word `todo` inside the quotes to `hi`, then press Check. You do not need to understand the rest yet; the next lesson explains it line by line.

## hard
Example: a test exercise says "Fix Triple to return three times n" and the starter is

```
func Triple(n int) int {
	return n
}
```

`return` hands a value back to whoever called the function. Right now it hands back `n` unchanged, so change it to `return n * 3` (`*` means multiply) and press Check. The test code will call `Triple(2)` and check that it really gives 6.
