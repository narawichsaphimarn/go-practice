## explanation
An http.Request has a Method field, the text of the call such as POST or GET. Status reads that Method and picks a status number.

```
func Status(r *http.Request) int {
	if r.Method == http.MethodPost {
		return http.StatusOK
	}
	return http.StatusMethodNotAllowed
}
```

Import "net/http". Status of a request whose Method is POST is 200. Any other method is 405.

## apply
Client is the side that calls out. Set Timeout to one second and a call that hangs longer than that is cut off. WriteOK is the receiving side. It writes status 200 and the body ok to the ResponseWriter.

```
func Client() *http.Client {
	return &http.Client{Timeout: time.Second}
}
```

Also import "time".

```
func WriteOK(w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}
```

## easy
Status returns 200 when r.Method is POST and 405 for any other method.

```
func Status(r *http.Request) int {
	if r.Method == http.MethodPost {
		return http.StatusOK
	}
	return http.StatusMethodNotAllowed
}
```

## hard
WriteOK responds with status 200 and the body ok. Client returns an http.Client whose Timeout is one second.

```
func WriteOK(w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}
```

```
func Client() *http.Client {
	return &http.Client{Timeout: time.Second}
}
```
