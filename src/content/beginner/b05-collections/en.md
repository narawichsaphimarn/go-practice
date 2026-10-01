## explanation
An array has a fixed length. A slice views a range of an array and can grow. A map stores values by key. Reading past the end of a slice panics.

```
items := []int{1, 2, 3}
fmt.Println(items[0])
```

## apply
Use a slice when order matters and a map when you look up by key, such as counting words or finding a record by id.

## easy
Sum the numbers in a slice, including an empty slice.

## hard
Count how often a value appears, or return the last element safely.

## steps
- Choose the collection
- Walk the slice with range
- Guard the empty slice
- Return the value the test calls
