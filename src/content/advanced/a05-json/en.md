## explanation
JSON is text you exchange with another program. A json tag says which name a struct field uses in that text.

```
type Person struct {
	Name string `json:"name"`
}

func DecodeName(data []byte) (string, error) {
	var person Person
	if err := json.Unmarshal(data, &person); err != nil {
		return "", err
	}
	return person.Name, nil
}
```

The bytes []byte(`{"name":"ann"}`) make DecodeName return ann.

## apply
Read a name from text the web side sent, and build JSON when you must send a name back.

```
func EncodeName(name string) ([]byte, error) {
	person := Person{Name: name}
	return json.Marshal(person)
}
```

EncodeName("ann") produces {"name":"ann"}.

## easy
DecodeName reads the name field from JSON.

```
func DecodeName(data []byte) (string, error) {
	var person Person
	if err := json.Unmarshal(data, &person); err != nil {
		return "", err
	}
	return person.Name, nil
}
```

## hard
If the JSON has no name field, return an empty string and no error. Missing text is not a broken document.

```
func DecodeName(data []byte) (string, error) {
	var person Person
	if err := json.Unmarshal(data, &person); err != nil {
		return "", err
	}
	return person.Name, nil
}
```

A Person with no name has an empty Name after Unmarshal succeeds.
