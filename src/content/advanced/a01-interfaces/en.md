## explanation
An interface is a promise of what something can do. It does not say whether the value is a dog or a cat. Speaker promises a Speak method that returns text.

```
type Speaker interface {
	Speak() string
}
```

A dog and a cat are different types, and both can keep that promise.

```
type Dog struct{}

func (Dog) Speak() string { return "woof" }

type Cat struct{}

func (Cat) Speak() string { return "meow" }
```

## apply
An announcer on a stage does not need to know which animal is which. They only ask it to speak. The dog answers woof and the cat answers meow. Announce is that announcer. It accepts a Speaker and calls Speak.

```
func Announce(s Speaker) string {
	return s.Speak()
}

fmt.Println(Announce(Dog{}))
fmt.Println(Announce(Cat{}))
```

The same function prints woof, then meow.

## easy
Let the dog speak. Dog's Speak returns woof.

```
type Dog struct{}

func (Dog) Speak() string {
	return "woof"
}
```

## hard
Announce does not take a Dog directly. It takes a Speaker, so both Dog and Cat can be passed in. Cat also needs Speak that returns meow, or it cannot be passed to Announce.

```
type Speaker interface {
	Speak() string
}

type Dog struct{}

func (Dog) Speak() string { return "woof" }

type Cat struct{}

func (Cat) Speak() string { return "meow" }

func Announce(s Speaker) string {
	return s.Speak()
}
```
