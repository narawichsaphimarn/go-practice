## explanation
The `go` line in go.mod is the minimum language version the module needs. Since Go 1.21, an installed Go that is older than this version will not build the module with the old version.

```
module example.com/api

go 1.25

toolchain go1.25.3
```

- `go 1.25`: the code uses language features up to 1.25 and must be built with Go 1.25 or newer.
- `toolchain go1.25.3`: the suggested tool set. If the installed one is older, Go switches to this one.

A toolchain is the whole `go` program, including the compiler and the other tools, while the go line is a language version. They are different things.

## apply
The environment variable `GOTOOLCHAIN` controls whether Go may switch versions:

- `auto` (the default): if go.mod asks for a newer version than the installed one, Go downloads it and uses it.
- `local`: use only the installed version; if it is too old, the build fails.
- `go1.25.3`: always use exactly this version.

In CI or a Docker image that already pins a Go version, `GOTOOLCHAIN=local` is common, so nothing is downloaded during the build and a version mismatch fails loudly.

To upgrade the whole project, run `go get go@1.26`, which rewrites the go line, then `go mod tidy`.

## easy
Example: go.mod says `go 1.24` and Go 1.25 is installed.

Go 1.25 builds it normally, because 1.25 is newer than the minimum. Nothing is downloaded.

## hard
Example: a Dockerfile uses the image `golang:1.25` and sets `GOTOOLCHAIN=local`, and then someone changes go.mod to `go 1.26`.

The Docker build fails, saying it needs go 1.26 but only 1.25 is available. That is the outcome you want: the team learns at once that the image must be upgraded first, instead of the build quietly downloading a toolchain.
