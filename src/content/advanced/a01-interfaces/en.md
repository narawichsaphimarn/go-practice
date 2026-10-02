## explanation
An interface is a list of methods a type must have. It says what something can do, not what it is, like a host on stage who does not need to know who is a dog or a cat, only that they can make a sound.

```
type Speaker interface {
	Speak() string
}
```

Any type with the method `Speak() string` is a Speaker at once. You never write "I implement Speaker".

```
type Dog struct{}

func (Dog) Speak() string { return "woof" }

var s Speaker = Dog{}
```

The last line compiles because Dog already has Speak. Delete the Speak method and the compiler says Dog is not a Speaker.

Coming from another language: Java needs `implements Speaker`. Go has no such keyword; having the methods is enough.

## apply
A function that takes an interface works with every type that has those methods, including types nobody has written yet.

```
func Announce(s Speaker) string {
	return "on stage: " + s.Speak()
}
```

`Announce(Dog{})` gives `on stage: woof`, and if someone later writes a Cat with Speak, you can pass a Cat without touching Announce.

Sometimes you need to know which type is really inside an interface value. Use a type switch.

```
switch v := s.(type) {
case Dog:
	fmt.Println("a dog")
default:
	fmt.Println("something else", v)
}
```

Keep interfaces small, with only the methods their users need. Many standard library interfaces have a single method, such as `io.Reader`.

## easy
Example: an interface for things that have a price.

```
type Pricer interface {
	Price() int
}

type Coffee struct{}

func (Coffee) Price() int { return 60 }
```

Coffee has `Price() int`, so it is a Pricer and `var p Pricer = Coffee{}` compiles.

## hard
Example: total the price of anything that is a Pricer.

```
type Tea struct{ Cups int }

func (t Tea) Price() int { return 30 * t.Cups }

func Bill(items []Pricer) int {
	total := 0
	for _, it := range items {
		total += it.Price()
	}
	return total
}
```

`Bill([]Pricer{Coffee{}, Tea{Cups: 2}})` is 120. Bill never needs to know whether the list holds coffee or tea.
