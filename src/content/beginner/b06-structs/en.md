## explanation
A struct groups related data into one value. A method is a function attached to that value. If the method must change the data, take a pointer such as *Rect, not a copy.

```
type Rect struct {
	W int
	H int
}

func Area(r Rect) int {
	return r.W * r.H
}
```

## apply
A box 3 wide and 4 tall has area 12. Grow adds the same amount to width and height. Rename changes the name stored on a User.

```
box := Rect{W: 3, H: 4}
fmt.Println(Area(box))
```

## easy
Area returns width times height of a Rect.

```
func Area(r Rect) int {
	return r.W * r.H
}
```

## hard
Grow adds n to both W and H. It must be a method on *Rect so it changes the original box. Rename sets a new Name on *User.

```
func (r *Rect) Grow(n int) {
	r.W += n
	r.H += n
}
```

```
func (u *User) Rename(name string) {
	u.Name = name
}
```
