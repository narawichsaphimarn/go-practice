## explanation
An HTTP handler is a function that receives a request and writes a response. It always looks like this.

```
func Ping(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "pong")
}
```

- `r` is the request: `r.Method` (GET, POST, ...), `r.URL.Query().Get("name")` reads values after the `?`, and `r.Body` is the content sent.
- `w` is the response: write content to w as to any io.Writer, and set the status with `w.WriteHeader(code)`.

If you never call WriteHeader, the status is 200. Call WriteHeader before writing content, because the status cannot change once content is written.

## apply
Statuses you will use often:

- `http.StatusOK` (200) success, `http.StatusCreated` (201) something new was created
- `http.StatusBadRequest` (400) the data sent was wrong
- `http.StatusMethodNotAllowed` (405) this method is not allowed on this path

`http.Error(w, "message", code)` sets the status and writes a message in one go, which is handy for error answers.

When calling another service, always set a timeout. An `http.Client` with a zero Timeout waits forever; if the other side hangs, your program hangs too.

```
client := &http.Client{Timeout: 3 * time.Second}
```

Tests need no real port: `httptest.NewRequest` builds a fake request and `httptest.NewRecorder` keeps the response for you to check.

## easy
Example: a handler that accepts only GET.

```
func Health(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "use GET", http.StatusMethodNotAllowed)
		return
	}
	fmt.Fprint(w, "ok")
}
```

Do not forget the `return` after http.Error, or the code also writes ok after the error answer.

## hard
Example: read JSON from the body and answer with the sum.

```
type Pair struct {
	A int `json:"a"`
	B int `json:"b"`
}

func Add(w http.ResponseWriter, r *http.Request) {
	var p Pair
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "bad JSON", http.StatusBadRequest)
		return
	}
	fmt.Fprint(w, p.A+p.B)
}
```

A POST body of `{"a":2,"b":3}` gets the answer 5, and a body that cannot be read gets status 400. `json.NewDecoder` reads straight from an io.Reader, so you never read the whole body first.
