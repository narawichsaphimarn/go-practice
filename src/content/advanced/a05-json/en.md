## explanation
encoding/json matches fields with a json tag. Without a tag it uses the exported field name. A missing JSON field becomes the zero value.

```
var person Person
err := json.Unmarshal(data, &person)
```

## apply
Use it for an API body and for config that people edit as text.

## easy
Read the name field.

## hard
Write JSON, or accept a missing field.

## steps
- Set the tag to the JSON name
- Check errors from Marshal and Unmarshal
- Expect a missing field to be zero
- Use a type that matches the value
