## explanation
Package `encoding/json` turns structs into JSON text and back:

- `json.Marshal(v)` turns a value into JSON as a `[]byte`.
- `json.Unmarshal(data, &v)` reads JSON and writes it into v. Pass `&v` so it can change the real value.

JSON names are usually lowercase, but a Go field must start with a capital letter for package json to see it (export, from the packages lesson). So you use a tag to give the JSON name.

```
type Person struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

data, _ := json.Marshal(Person{Name: "ann", Age: 30})
fmt.Println(string(data))
```

This prints `{"name":"ann","age":30}`. The tag is the text in backticks after the field.

## apply
When reading JSON:

- Fields in the JSON that the struct does not have are skipped.
- Fields in the struct that the JSON does not have get their zero value.
- Malformed JSON makes Unmarshal return an error. Always check it.

For nested data, declare nested structs, such as `Items []Item` for an array of objects.

A tag can carry options after a comma:

- `json:"email,omitempty"` leaves the field out when it holds the zero value.
- `json:"-"` leaves the field out completely, both writing and reading. Use it for secrets such as passwords.

## easy
Example: read a price from JSON.

```
type Product struct {
	Price int `json:"price"`
}

func PriceOf(data []byte) (int, error) {
	var p Product
	if err := json.Unmarshal(data, &p); err != nil {
		return 0, err
	}
	return p.Price, nil
}
```

Passing the JSON `{"price":45,"name":"tea"}` to PriceOf gives 45. The name field is skipped because Product has none.

## hard
Example: count all the tags across an array of posts.

```
type Post struct {
	Tags []string `json:"tags"`
}

func TagCount(data []byte) (int, error) {
	var posts []Post
	if err := json.Unmarshal(data, &posts); err != nil {
		return 0, err
	}
	n := 0
	for _, p := range posts {
		n += len(p.Tags)
	}
	return n, nil
}
```

The JSON `[{"tags":["go","web"]},{"tags":["db"]},{}]` gives 3. The last post has no tags, so it gets an empty slice of length 0.
