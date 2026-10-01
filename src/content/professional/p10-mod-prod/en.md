## explanation
The go line in go.mod is the module's minimum language version. A toolchain line, when present, requests that toolchain. GOTOOLCHAIN=local means use the installed toolchain and do not download another. Go 1.25 still uses this rule.

```
go 1.25

toolchain go1.25.0
```

## apply
Use it to pin CI and to stop a developer machine from quietly fetching a different toolchain.

## easy
What the go line means.

## hard
toolchain and GOTOOLCHAIN=local.

## steps
- Separate the go line from the toolchain line
- Know that local does not download
- Do not assume the language version always equals the binary version
- Answer on this page
