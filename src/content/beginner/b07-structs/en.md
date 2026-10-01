## explanation
A struct groups several related pieces of data into one value, like one row of a table with column headings. Each piece is called a field.

```
type Book struct {
	Title string
	Pages int
}

b := Book{Title: "Go", Pages: 120}
fmt.Println(b.Title)
```

- `type Book struct { ... }` creates a new type named Book with two fields.
- `Book{Title: "Go", Pages: 120}` makes a Book value. Fields you leave out get their zero value.
- `b.Title` reads a field with a dot: `Go`.

## apply
A method is a function attached to a type. You write the type in parentheses before the function name; those parentheses are called the receiver.

```
func (b Book) Long() bool {
	return b.Pages > 300
}

fmt.Println(b.Long())
```

Call a method with a dot, like reading a field. This prints false because 120 is not more than 300.

A receiver like `(b Book)` gets a copy, just like an ordinary parameter in the last lesson. If the method must change the real value, make the receiver a pointer: `(b *Book)`.

```
func (b *Book) AddPages(n int) {
	b.Pages += n
}

b.AddPages(30)
```

Afterwards b.Pages is 150. You can write `b.AddPages(30)` without `&`, because Go takes the address of b for you. Inside the method, `b.Pages` works directly; you do not write `(*b).Pages`.

## easy
Example: a method that returns the perimeter of a rectangle.

```
type Box struct {
	W int
	H int
}

func (x Box) Perimeter() int {
	return 2 * (x.W + x.H)
}
```

`Box{W: 3, H: 4}.Perimeter()` is 14. The method only reads the receiver, so it does not need a pointer.

## hard
Example: an account you can deposit into and check.

```
type Account struct {
	History []int
}

func (a *Account) Deposit(n int) {
	a.History = append(a.History, n)
}

func (a Account) Balance() int {
	total := 0
	for _, n := range a.History {
		total += n
	}
	return total
}
```

Deposit must change the real account, so it uses `*Account`. Balance only reads, so it uses `Account`. Deposit 100 and then 50, and Balance is 150.
