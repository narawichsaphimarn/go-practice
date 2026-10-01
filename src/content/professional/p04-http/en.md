## explanation
A handler should reject an unsupported method with 405. A client should have a Timeout so a call cannot hang. httptest.NewRequest builds a request in a test without opening a port.

```
if r.Method != http.MethodPost {
	return http.StatusMethodNotAllowed
}
```

## apply
Use it when writing a small API and when this backend calls another service.

## easy
Accept only POST.

## hard
Set a client timeout, or write a status to the ResponseWriter.

## steps
- Compare r.Method with an http constant
- Return 405 for the wrong method
- Set Client.Timeout
- Use httptest in tests instead of a real port
