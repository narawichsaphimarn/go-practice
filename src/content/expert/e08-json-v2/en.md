## explanation
encoding/json is the ordinary package that turns a struct into JSON. encoding/json/v2 is an experimental API separate from that package. A program that imports encoding/json does not switch to v2 by itself.

```
type Note struct {
	Text string `json:"text"`
}

func toJSON(text string) ([]byte, error) {
	return json.Marshal(Note{Text: text})
}
```

Import "encoding/json". toJSON("hi") is the bytes of {"text":"hi"}.

## apply
To try v2 you enable it under that release's experiment rules, such as GOEXPERIMENT=jsonv2. A plain import does not become the default.

```
GOEXPERIMENT=jsonv2 go test ./...
```

This command turns the experiment on under the release rules. Ordinary encoding/json is still there.

## easy
encoding/json/v2 is an experimental API separate from ordinary encoding/json. Everyday code still looks like this.

```
func toJSON(text string) ([]byte, error) {
	return json.Marshal(Note{Text: text})
}
```

## hard
Try v2 by enabling it under that release's experiment rules. A program that imports encoding/json does not change by itself.

```
GOEXPERIMENT=jsonv2 go test ./...
```

```
import "encoding/json"
```
