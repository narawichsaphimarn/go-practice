## explanation
if runs a block when a condition is true. for repeats a block. switch picks one case from the value of a variable.

```
score := 80
if score >= 80 {
	fmt.Println("pass")
}
```

```
for i := 1; i <= 3; i++ {
	fmt.Print(i)
}
```

```
day := 1
switch day {
case 1:
	fmt.Println("monday")
}
```

## apply
Check an exam score and print pass at 80 or above. Print the numbers 1 through 3 as 123. Turn a day code into a day name.

Each snippet above can sit inside main. The loop prints 123 with no spaces because it uses Print, not Println.

## easy
Set score to 80 and print pass when score is at least 80.

```
score := 80
if score >= 80 {
	fmt.Println("pass")
}
```

## hard
Set day to 1 and use switch to print monday for that case.

```
day := 1
switch day {
case 1:
	fmt.Println("monday")
}
```
