## explanation
In Go, a failure is an ordinary value of type `error`. A function that might not succeed returns an error as its last result. When nothing went wrong, the error is `nil` ("nothing").

```
import "errors"

func Withdraw(balance, amount int) (int, error) {
	if amount > balance {
		return balance, errors.New("not enough money")
	}
	return balance - amount, nil
}
```

`errors.New("...")` creates an error with a message. Languages like Python catch failures with try/except; Go returns the error directly and the caller checks it.

## apply
The caller checks the error right after the call. If something went wrong, stop. Do not carry on with the result as if it worked.

```
left, err := Withdraw(100, 250)
if err != nil {
	fmt.Println("cannot withdraw:", err)
	return
}
fmt.Println(left)
```

This prints `cannot withdraw: not enough money` and never prints a balance. The pattern `if err != nil { ... }` appears all over Go code.

Many standard packages return errors the same way. `strconv.Atoi` turns text into a number and returns an error when the text is not a number.

```
import "strconv"

n, err := strconv.Atoi("42")
```

n is 42 and err is nil, while `strconv.Atoi("hi")` returns an err that is not nil.

## easy
Example: check that an age is acceptable.

```
func CheckAge(age int) error {
	if age < 0 {
		return errors.New("age is negative")
	}
	return nil
}
```

This function has no other result, so it returns only an error.

## hard
Example: turn text into a quantity that must be a number no larger than 10.

```
func ParseQty(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		return 0, err
	}
	if n > 10 {
		return 0, errors.New("too many")
	}
	return n, nil
}
```

`ParseQty("3")` gives 3 and nil, `ParseQty("x")` gives the error from Atoi, and `ParseQty("12")` gives the error too many. Every failing path returns 0 first, so nobody uses a wrong number by accident.
